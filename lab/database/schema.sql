-- ========================================================
-- WIDA DIAGNOSTIC LABORATORY MODULE SCHEMA (SQLite 3)
-- Module: Diagnostic Laboratory & Pathology Management
-- ========================================================

PRAGMA foreign_keys = ON;

-- 1. Laboratories Profile & Authentication
CREATE TABLE IF NOT EXISTS labs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    license_number TEXT NOT NULL,
    accreditation TEXT NOT NULL DEFAULT 'NABL Accredited',
    diagnostic_services TEXT NOT NULL, -- JSON array of services
    status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION', -- PENDING_VERIFICATION, VERIFIED, SUSPENDED
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- 2. Laboratory Staff & Role-Based Access
CREATE TABLE IF NOT EXISTS lab_staff (
    id TEXT PRIMARY KEY,
    lab_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL, -- LAB_DIRECTOR, PATHOLOGIST, TECHNICIAN, PHLEBOTOMIST
    qualifications TEXT,
    phone TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE
);

-- 3. Laboratory Accreditations & Verification Log
CREATE TABLE IF NOT EXISTS lab_verifications (
    id TEXT PRIMARY KEY,
    lab_id TEXT NOT NULL,
    status TEXT NOT NULL, -- PENDING, VERIFIED, REJECTED
    document_name TEXT NOT NULL,
    document_type TEXT NOT NULL,
    reviewer_notes TEXT,
    verified_at TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE
);

-- 4. Diagnostic Test Catalogue
CREATE TABLE IF NOT EXISTS test_catalogue (
    id TEXT PRIMARY KEY,
    lab_id TEXT NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- Hematology, Biochemistry, Microbiology, Pathology, Endocrinology
    specimen_type TEXT NOT NULL, -- EDTA Blood, Serum, Plasma, Urine, Swab
    price REAL NOT NULL,
    turnaround_time TEXT NOT NULL, -- e.g., '4 Hours', '24 Hours'
    preparation_instructions TEXT NOT NULL,
    normal_range_summary TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE
);

-- 5. Diagnostic Health Packages
CREATE TABLE IF NOT EXISTS test_packages (
    id TEXT PRIMARY KEY,
    lab_id TEXT NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    original_price REAL NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE
);

-- 6. Package-to-Test Mapping
CREATE TABLE IF NOT EXISTS package_tests (
    package_id TEXT NOT NULL,
    test_id TEXT NOT NULL,
    PRIMARY KEY (package_id, test_id),
    FOREIGN KEY (package_id) REFERENCES test_packages(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES test_catalogue(id) ON DELETE CASCADE
);

-- 7. Test Bookings
CREATE TABLE IF NOT EXISTS test_bookings (
    id TEXT PRIMARY KEY,
    booking_reference TEXT NOT NULL UNIQUE,
    lab_id TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    patient_email TEXT,
    patient_age INTEGER,
    patient_gender TEXT,
    abha_id TEXT,
    doctor_id TEXT,
    doctor_name TEXT,
    test_ids TEXT NOT NULL, -- JSON array of test IDs
    package_ids TEXT, -- JSON array of package IDs
    test_names TEXT NOT NULL, -- Comma-separated summary
    collection_type TEXT NOT NULL, -- 'Lab Visit' or 'Home Sample Collection'
    collection_address TEXT,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'BOOKED', -- BOOKED, CONFIRMED, SAMPLE_PENDING, SAMPLE_COLLECTED, PROCESSING, REPORT_PENDING_VERIFICATION, REPORT_PUBLISHED, CANCELLED
    payment_status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, PAID, PARTIALLY_PAID, REFUNDED
    total_amount REAL NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE
);

-- 8. Booking Status Transition Audit Trail
CREATE TABLE IF NOT EXISTS booking_status_history (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    from_status TEXT,
    to_status TEXT NOT NULL,
    changed_by TEXT NOT NULL,
    change_reason TEXT,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES test_bookings(id) ON DELETE CASCADE
);

-- 9. Sample Collection & Laboratory Processing
CREATE TABLE IF NOT EXISTS samples (
    id TEXT PRIMARY KEY,
    sample_barcode TEXT NOT NULL UNIQUE,
    booking_id TEXT NOT NULL,
    lab_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    test_name TEXT NOT NULL,
    sample_type TEXT NOT NULL, -- EDTA Whole Blood, Serum, Plasma, Sodium Fluoride, Urine
    tube_color TEXT NOT NULL, -- Purple, Red, Yellow, Grey
    collection_timestamp TEXT NOT NULL,
    collected_by TEXT NOT NULL,
    received_timestamp TEXT,
    received_by TEXT,
    condition TEXT NOT NULL DEFAULT 'ACCEPTED', -- ACCEPTED, REJECTED
    rejection_reason TEXT,
    processing_status TEXT NOT NULL DEFAULT 'ACCESSIONED', -- ACCESSIONED, IN_PROCESSING, ANALYSER_COMPLETE, RESULTS_ENTERED
    assigned_technician TEXT,
    analyzer_id TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES test_bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE
);

-- 10. Diagnostic Reports
CREATE TABLE IF NOT EXISTS diagnostic_reports (
    id TEXT PRIMARY KEY,
    report_number TEXT NOT NULL UNIQUE,
    booking_id TEXT NOT NULL,
    sample_id TEXT NOT NULL,
    lab_id TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    patient_age INTEGER,
    patient_gender TEXT,
    abha_id TEXT,
    doctor_name TEXT,
    test_name TEXT NOT NULL,
    collection_date TEXT NOT NULL,
    reporting_date TEXT NOT NULL,
    clinical_interpretation TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT', -- DRAFT, PENDING_VERIFICATION, VERIFIED, PUBLISHED
    is_verified INTEGER NOT NULL DEFAULT 0,
    verified_by TEXT,
    verified_at TEXT,
    amendment_version INTEGER NOT NULL DEFAULT 1,
    amendment_reason TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES test_bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (sample_id) REFERENCES samples(id) ON DELETE CASCADE,
    FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE
);

-- 11. Report Biomarker & Clinical Parameters
CREATE TABLE IF NOT EXISTS report_parameters (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL,
    parameter_name TEXT NOT NULL,
    observed_value TEXT NOT NULL,
    unit TEXT NOT NULL,
    reference_range TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'NORMAL', -- NORMAL, ELEVATED, LOW, CRITICAL
    display_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (report_id) REFERENCES diagnostic_reports(id) ON DELETE CASCADE
);

-- 12. Report Audit Log
CREATE TABLE IF NOT EXISTS report_audit_log (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL,
    action TEXT NOT NULL, -- CREATED, RESULTS_ENTERED, SUBMITTED_VERIFICATION, VERIFIED, PUBLISHED, AMENDED
    performed_by TEXT NOT NULL,
    role TEXT NOT NULL,
    details TEXT,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (report_id) REFERENCES diagnostic_reports(id) ON DELETE CASCADE
);

-- 13. Billing & Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    invoice_number TEXT NOT NULL UNIQUE,
    booking_id TEXT NOT NULL,
    lab_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    subtotal REAL NOT NULL,
    tax_amount REAL NOT NULL DEFAULT 0.0,
    discount_amount REAL NOT NULL DEFAULT 0.0,
    total_amount REAL NOT NULL,
    amount_paid REAL NOT NULL DEFAULT 0.0,
    balance_due REAL NOT NULL DEFAULT 0.0,
    payment_status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, PAID, PARTIALLY_PAID, REFUNDED
    payment_method TEXT, -- Cash, UPI, Card, NetBanking, Insurance
    transaction_reference TEXT,
    invoice_date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES test_bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE
);

-- 14. Itemized Invoice Breakdown
CREATE TABLE IF NOT EXISTS invoice_items (
    id TEXT PRIMARY KEY,
    invoice_id TEXT NOT NULL,
    item_description TEXT NOT NULL,
    item_type TEXT NOT NULL, -- TEST, PACKAGE, COLLECTION_FEE
    unit_price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price REAL NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- 15. ABDM & FHIR Interoperability Consent Records
CREATE TABLE IF NOT EXISTS abdm_consents (
    id TEXT PRIMARY KEY,
    lab_id TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    abha_id TEXT NOT NULL,
    doctor_id TEXT,
    purpose TEXT NOT NULL DEFAULT 'Diagnostic Investigation & Care',
    access_mode TEXT NOT NULL DEFAULT 'VIEW_AND_RECORD',
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, REVOKED, EXPIRED
    valid_until TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE
);

-- Indexes for optimal lookup performance
CREATE INDEX IF NOT EXISTS idx_test_bookings_lab ON test_bookings(lab_id, status);
CREATE INDEX IF NOT EXISTS idx_test_bookings_patient ON test_bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_samples_booking ON samples(booking_id);
CREATE INDEX IF NOT EXISTS idx_samples_barcode ON samples(sample_barcode);
CREATE INDEX IF NOT EXISTS idx_diagnostic_reports_booking ON diagnostic_reports(booking_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_reports_status ON diagnostic_reports(lab_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_booking ON invoices(booking_id);
