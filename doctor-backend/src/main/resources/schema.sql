-- ========================================================
-- MEDiTRACK / WIDA - DOCTOR MODULE SCHEMA (MySQL & H2 Compatible)
-- Module Owner: Vanshika Tailor
-- ========================================================

CREATE TABLE IF NOT EXISTS doctor_specializations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50),
    description TEXT,
    icon_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    date_of_birth DATE,
    medical_registration_number VARCHAR(100) NOT NULL UNIQUE,
    qualification VARCHAR(150) NOT NULL,
    specialization_id BIGINT,
    specialization_name VARCHAR(100) NOT NULL,
    sub_specialization VARCHAR(150),
    years_of_experience INT NOT NULL DEFAULT 0,
    hospital_clinic_name VARCHAR(200) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    consultation_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    languages_known VARCHAR(255),
    professional_bio TEXT,
    profile_photo_url VARCHAR(500),
    verification_status VARCHAR(30) DEFAULT 'PENDING',
    average_rating DECIMAL(3,2) DEFAULT 5.00,
    total_ratings INT DEFAULT 0,
    total_patients INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctor_verifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    document_name VARCHAR(255),
    document_type VARCHAR(100),
    document_url VARCHAR(500),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewer_remarks TEXT
);

CREATE TABLE IF NOT EXISTS doctor_availabilities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    break_start_time VARCHAR(10),
    break_end_time VARCHAR(10),
    slot_duration_minutes INT DEFAULT 30
);

CREATE TABLE IF NOT EXISTS patients_summary (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(150),
    allergies TEXT,
    chronic_conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_number VARCHAR(50) NOT NULL UNIQUE,
    doctor_id BIGINT NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    appointment_type VARCHAR(50) NOT NULL,
    reason_for_visit TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    doctor_notes TEXT,
    reschedule_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consultations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    consultation_number VARCHAR(50) NOT NULL UNIQUE,
    appointment_id BIGINT,
    doctor_id BIGINT NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    consultation_date DATE NOT NULL,
    chief_complaint TEXT NOT NULL,
    symptoms TEXT,
    clinical_notes TEXT,
    diagnosis TEXT NOT NULL,
    doctor_remarks TEXT,
    follow_up_date DATE,
    additional_notes TEXT,
    status VARCHAR(30) DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prescription_number VARCHAR(50) NOT NULL UNIQUE,
    consultation_id BIGINT,
    appointment_id BIGINT,
    doctor_id BIGINT NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    prescription_date DATE NOT NULL,
    general_advice TEXT,
    pharmacy_status VARCHAR(30) DEFAULT 'PENDING_DISPENSE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prescription_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prescription_id BIGINT NOT NULL,
    medicine_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    instructions VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS diagnostic_test_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_number VARCHAR(50) NOT NULL UNIQUE,
    doctor_id BIGINT NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    appointment_id BIGINT,
    test_name VARCHAR(150) NOT NULL,
    priority VARCHAR(30) NOT NULL,
    clinical_reason TEXT NOT NULL,
    special_instructions TEXT,
    status VARCHAR(30) DEFAULT 'REQUESTED',
    requested_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medical_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_number VARCHAR(50) NOT NULL UNIQUE,
    patient_id VARCHAR(50) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    doctor_id BIGINT NOT NULL,
    test_request_id BIGINT,
    test_name VARCHAR(150) NOT NULL,
    report_date DATE NOT NULL,
    result_summary TEXT NOT NULL,
    result_status VARCHAR(30) NOT NULL,
    lab_technician_name VARCHAR(150),
    report_file_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctor_achievements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    badge_key VARCHAR(100) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    is_unlocked BOOLEAN DEFAULT TRUE,
    progress INT DEFAULT 100,
    max_progress INT DEFAULT 100,
    awarded_date DATE
);

CREATE TABLE IF NOT EXISTS doctor_ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    rating_value INT NOT NULL,
    review_title VARCHAR(200),
    review_comment TEXT,
    appointment_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctor_notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
