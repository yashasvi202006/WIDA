/**
 * Database Seeder for WIDA Diagnostic Laboratory Module
 * Pre-populates realistic clinical laboratory catalogue, staff, bookings, samples, reports and invoices.
 */

import { labDb } from './db.js';
import { hashPassword } from '../backend/utils/cryptoUtil.js';

export function seedLabDatabase() {
    console.log('[LabDatabase Seeder] Checking existing data...');

    // Check if labs already seeded
    const existing = labDb.get('SELECT COUNT(*) as count FROM labs');
    if (existing && existing.count > 0) {
        console.log('[LabDatabase Seeder] Database already populated with', existing.count, 'laboratories.');
        return;
    }

    console.log('[LabDatabase Seeder] Seeding initial diagnostic laboratory dataset...');

    const now = new Date().toISOString();

    // 1. Laboratories
    const lab1Id = 'lab-01';
    const lab2Id = 'lab-02';

    labDb.run(`
        INSERT INTO labs (id, name, email, password_hash, phone, address, city, state, pincode, license_number, accreditation, diagnostic_services, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        lab1Id,
        'HealthFirst Diagnostics & Pathology Labs',
        'director@healthfirst.lab',
        hashPassword('LabDirector@2026'),
        '+91 120 4455667',
        'Plot B-12, Sector 62, Electronic City',
        'Noida',
        'Uttar Pradesh',
        '201309',
        'NABL-MC-2024-8841',
        'NABL & CAP Accredited ISO 15189:2022',
        JSON.stringify([
            'Clinical Biochemistry',
            'Hematology & Coagulation',
            'Clinical Pathology',
            'Microbiology & Serology',
            'Endocrinology & Immunology',
            'Molecular Diagnostics'
        ]),
        'VERIFIED',
        now,
        now
    ]);

    labDb.run(`
        INSERT INTO labs (id, name, email, password_hash, phone, address, city, state, pincode, license_number, accreditation, diagnostic_services, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        lab2Id,
        'Apex BioCare Diagnostics',
        'pending@newlab.org',
        hashPassword('Pending@2026'),
        '+91 11 28991122',
        'A-45, Vikas Marg, Preet Vihar',
        'New Delhi',
        'Delhi',
        '110092',
        'DL-CEA-2026-9021',
        'State Clinical Establishment Registered (Awaiting NABL)',
        JSON.stringify(['Clinical Biochemistry', 'Hematology', 'Urine Analysis']),
        'PENDING_VERIFICATION',
        now,
        now
    ]);

    // 2. Staff Accounts for HealthFirst
    const staffMembers = [
        {
            id: 'staff-01',
            lab_id: lab1Id,
            full_name: 'Dr. Sunita Deshmukh, MD',
            email: 'director@healthfirst.lab',
            password: 'LabDirector@2026',
            role: 'LAB_DIRECTOR',
            qualifications: 'MD Pathology (AIIMS), FRCPath',
            phone: '+91 98111 00223'
        },
        {
            id: 'staff-02',
            lab_id: lab1Id,
            full_name: 'Dr. Rajeshwar Prasad, MD',
            email: 'pathologist@healthfirst.lab',
            password: 'Pathologist@2026',
            role: 'PATHOLOGIST',
            qualifications: 'MD Pathology, Senior Consultant Signatory',
            phone: '+91 98222 11334'
        },
        {
            id: 'staff-03',
            lab_id: lab1Id,
            full_name: 'Vikramaditya Rao, B.Sc MLT',
            email: 'technician@healthfirst.lab',
            password: 'Tech@2026',
            role: 'TECHNICIAN',
            qualifications: 'B.Sc Medical Laboratory Technology, Quality Executive',
            phone: '+91 98333 22445'
        },
        {
            id: 'staff-04',
            lab_id: lab1Id,
            full_name: 'Anjali Sharma, DMLT',
            email: 'phlebotomist@healthfirst.lab',
            password: 'Phlebo@2026',
            role: 'PHLEBOTOMIST',
            qualifications: 'Diploma in Medical Laboratory Technology, Phlebotomist Certified',
            phone: '+91 98444 33556'
        }
    ];

    for (const staff of staffMembers) {
        labDb.run(`
            INSERT INTO lab_staff (id, lab_id, full_name, email, password_hash, role, qualifications, phone, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        `, [
            staff.id,
            staff.lab_id,
            staff.full_name,
            staff.email,
            hashPassword(staff.password),
            staff.role,
            staff.qualifications,
            staff.phone,
            now
        ]);
    }

    // 3. Test Catalogue
    const catalogue = [
        {
            id: 't-01',
            code: 'HEM-CBC',
            name: 'Complete Blood Count (CBC) with ESR',
            category: 'Hematology',
            specimen: 'EDTA Whole Blood (Purple Top)',
            price: 399.00,
            tat: '4 Hours',
            prep: 'No special fasting required. Maintain routine hydration.',
            ranges: 'Hb: 13.0-17.0 g/dL, WBC: 4,000-11,000 /mcL, Platelets: 1.5-4.5 Lakhs/mcL'
        },
        {
            id: 't-02',
            code: 'BIO-LIPID',
            name: 'Lipid Profile Panel (Cardiac Risk)',
            category: 'Biochemistry',
            specimen: 'Serum (Gold / Red Top)',
            price: 650.00,
            tat: '6 Hours',
            prep: 'Mandatory 10-12 hours overnight fasting. Plain water permitted.',
            ranges: 'Total Cholesterol: < 200 mg/dL, HDL: > 40 mg/dL, LDL: < 100 mg/dL, Triglycerides: < 150 mg/dL'
        },
        {
            id: 't-03',
            code: 'BIO-LFT',
            name: 'Liver Function Test (Comprehensive LFT)',
            category: 'Biochemistry',
            specimen: 'Serum (Gold / Red Top)',
            price: 750.00,
            tat: '6 Hours',
            prep: '8-10 hours fasting recommended. Avoid alcohol 24 hours prior.',
            ranges: 'SGPT/ALT: < 45 U/L, SGOT/AST: < 40 U/L, Bilirubin Total: 0.2-1.2 mg/dL, Albumin: 3.5-5.0 g/dL'
        },
        {
            id: 't-04',
            code: 'BIO-KFT',
            name: 'Kidney Function Test (KFT with Electrolytes)',
            category: 'Biochemistry',
            specimen: 'Serum (Gold / Red Top)',
            price: 700.00,
            tat: '6 Hours',
            prep: 'Routine intake. Avoid excessive meat intake 24h prior.',
            ranges: 'Creatinine: 0.7-1.3 mg/dL, Blood Urea Nitrogen: 7-20 mg/dL, Sodium: 136-145 mEq/L'
        },
        {
            id: 't-05',
            code: 'BIO-HBA1C',
            name: 'HbA1c (Glycated Hemoglobin) & eAG',
            category: 'Biochemistry',
            specimen: 'EDTA Whole Blood (Purple Top)',
            price: 490.00,
            tat: '4 Hours',
            prep: 'Non-fasting. Can be done anytime of the day.',
            ranges: 'Non-diabetic: < 5.7%, Pre-diabetic: 5.7-6.4%, Diabetic: >= 6.5%'
        },
        {
            id: 't-06',
            code: 'END-THYROID',
            name: 'Thyroid Function Profile (Total T3, T4, TSH)',
            category: 'Endocrinology',
            specimen: 'Serum (Gold / Red Top)',
            price: 550.00,
            tat: '6 Hours',
            prep: 'Early morning fasting sample advised before taking thyroid medication.',
            ranges: 'TSH: 0.4-4.5 mIU/L, Total T3: 80-200 ng/dL, Total T4: 5.0-12.0 ug/dL'
        },
        {
            id: 't-07',
            code: 'VIT-D3',
            name: 'Vitamin D3 (25-Hydroxycholecalciferol)',
            category: 'Biochemistry',
            specimen: 'Serum (Red Top)',
            price: 1200.00,
            tat: '12 Hours',
            prep: 'Routine sample. No special fasting required.',
            ranges: 'Deficient: < 20 ng/mL, Insufficient: 20-30 ng/mL, Sufficient: 30-100 ng/mL'
        },
        {
            id: 't-08',
            code: 'VIT-B12',
            name: 'Vitamin B12 (Cyanocobalamin)',
            category: 'Biochemistry',
            specimen: 'Serum (Red Top)',
            price: 900.00,
            tat: '12 Hours',
            prep: 'Fasting 8-10 hours preferred. Protect sample from light.',
            ranges: 'Normal: 211-911 pg/mL'
        },
        {
            id: 't-09',
            code: 'PAT-URINE',
            name: 'Urine Routine & Microscopic Examination',
            category: 'Pathology',
            specimen: 'Midstream Clean Catch Urine Container',
            price: 250.00,
            tat: '2 Hours',
            prep: 'Collect first morning midstream clean-catch sample in sterile vial provided.',
            ranges: 'Color: Pale Yellow, pH: 5.5-7.0, Protein: Nil, Sugar: Nil, Pus cells: 0-4 /hpf'
        },
        {
            id: 't-10',
            code: 'SER-DENGUE',
            name: 'Dengue NS1 Antigen & IgG/IgM Antibodies',
            category: 'Microbiology',
            specimen: 'Serum (Red Top)',
            price: 850.00,
            tat: '3 Hours',
            prep: 'No special diet required. Immediate analysis in acute febrile illness.',
            ranges: 'Negative / Non-reactive'
        }
    ];

    for (const t of catalogue) {
        labDb.run(`
            INSERT INTO test_catalogue (id, lab_id, code, name, category, specimen_type, price, turnaround_time, preparation_instructions, normal_range_summary, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        `, [
            t.id,
            lab1Id,
            t.code,
            t.name,
            t.category,
            t.specimen,
            t.price,
            t.tat,
            t.prep,
            t.ranges,
            now
        ]);
    }

    // 4. Test Packages
    const packages = [
        {
            id: 'pkg-01',
            code: 'PKG-EXEC',
            name: 'Comprehensive Executive Health Checkup',
            desc: 'Complete 68-parameter full body health screen covering blood, vital organs, cholesterol & diabetes.',
            price: 2499.00,
            orig: 3839.00,
            tests: ['t-01', 't-02', 't-03', 't-04', 't-05', 't-06', 't-09']
        },
        {
            id: 'pkg-02',
            code: 'PKG-SENIOR',
            name: 'Senior Citizen Vital Care Profile',
            desc: 'Tailored geriatric screening covering bone density biomarkers, electrolytes, organ efficiency & vitamin levels.',
            price: 2999.00,
            orig: 4489.00,
            tests: ['t-01', 't-04', 't-02', 't-05', 't-07', 't-08']
        },
        {
            id: 'pkg-03',
            code: 'PKG-CARDIAC',
            name: 'Cardiac Risk & Lipid Screening Panel',
            desc: 'Advanced vascular assessment for hypertension, arterial plaque risk and lipid abnormalities.',
            price: 1100.00,
            orig: 1539.00,
            tests: ['t-01', 't-02', 't-05']
        },
        {
            id: 'pkg-04',
            code: 'PKG-DIABETES',
            name: 'Diabetic Glycemic Monitoring Profile',
            desc: 'Targeted monitoring for glycemic index, renal microvascular function, and cholesterol balance.',
            price: 1350.00,
            orig: 1840.00,
            tests: ['t-04', 't-05', 't-09', 't-02']
        }
    ];

    for (const pkg of packages) {
        labDb.run(`
            INSERT INTO test_packages (id, lab_id, code, name, description, price, original_price, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
        `, [
            pkg.id,
            lab1Id,
            pkg.code,
            pkg.name,
            pkg.desc,
            pkg.price,
            pkg.orig,
            now
        ]);

        for (const testId of pkg.tests) {
            labDb.run(`
                INSERT INTO package_tests (package_id, test_id)
                VALUES (?, ?)
            `, [pkg.id, testId]);
        }
    }

    // 5. Test Bookings
    const bookings = [
        {
            id: 'book-101',
            ref: 'BK-2026-1041',
            patient_id: 'pat-001',
            name: 'Yashasvi Saini',
            phone: '+91 98765 43210',
            email: 'yashasvi.saini@wida.health',
            age: 24,
            gender: 'Male',
            abha: '91-4521-8902-3341',
            doc_id: 'doc-01',
            doc_name: 'Dr. Aarav Sharma (Cardiologist)',
            tests: ['t-02'],
            test_names: 'Lipid Profile Panel (Cardiac Risk)',
            coll_type: 'Lab Visit',
            date: '2026-10-10',
            time: '08:30 AM',
            status: 'REPORT_PUBLISHED',
            pay_status: 'PAID',
            amount: 650.00,
            notes: 'Follow-up for mild LDL elevation. Statin monitoring.'
        },
        {
            id: 'book-102',
            ref: 'BK-2026-1042',
            patient_id: 'pat-001',
            name: 'Yashasvi Saini',
            phone: '+91 98765 43210',
            email: 'yashasvi.saini@wida.health',
            age: 24,
            gender: 'Male',
            abha: '91-4521-8902-3341',
            doc_id: 'doc-01',
            doc_name: 'Dr. Aarav Sharma',
            tests: ['t-01'],
            test_names: 'Complete Blood Count (CBC) with ESR',
            coll_type: 'Home Sample Collection',
            date: '2026-10-10',
            time: '09:00 AM',
            status: 'REPORT_PUBLISHED',
            pay_status: 'PAID',
            amount: 399.00,
            notes: 'Annual fitness checkup phlebotomy'
        },
        {
            id: 'book-103',
            ref: 'BK-2026-1043',
            patient_id: 'pat-002',
            name: 'Priya Sharma',
            phone: '+91 98111 88990',
            email: 'priya.sharma@example.com',
            age: 28,
            gender: 'Female',
            abha: '91-3312-8874-1190',
            doc_id: 'doc-02',
            doc_name: 'Dr. Vanshika Tailor',
            tests: ['t-01', 't-06'],
            test_names: 'Complete Blood Count, Thyroid Profile',
            coll_type: 'Lab Visit',
            date: '2026-10-11',
            time: '10:00 AM',
            status: 'REPORT_PENDING_VERIFICATION',
            pay_status: 'PAID',
            amount: 949.00,
            notes: 'Results entered by technician, pending pathologist signature.'
        },
        {
            id: 'book-104',
            ref: 'BK-2026-1044',
            patient_id: 'pat-003',
            name: 'Rajesh Kumar',
            phone: '+91 98222 77665',
            email: 'rajesh.k@example.com',
            age: 56,
            gender: 'Male',
            abha: '91-8890-4412-5567',
            doc_id: 'doc-01',
            doc_name: 'Dr. Aarav Sharma',
            tests: ['t-04', 't-05'],
            test_names: 'Kidney Function Test (KFT), HbA1c',
            coll_type: 'Lab Visit',
            date: '2026-10-11',
            time: '11:15 AM',
            status: 'PROCESSING',
            pay_status: 'PAID',
            amount: 1190.00,
            notes: 'Specimen in automated biochemical analyser Cobas 6000'
        },
        {
            id: 'book-105',
            ref: 'BK-2026-1045',
            patient_id: 'pat-004',
            name: 'Ananya Sengupta',
            phone: '+91 98333 66554',
            email: 'ananya.s@example.com',
            age: 34,
            gender: 'Female',
            abha: '91-5512-3344-9981',
            doc_id: 'doc-03',
            doc_name: 'Dr. Rohan Mehta',
            tests: ['t-07', 't-08'],
            test_names: 'Vitamin D3, Vitamin B12',
            coll_type: 'Home Sample Collection',
            date: '2026-10-11',
            time: '01:30 PM',
            status: 'SAMPLE_COLLECTED',
            pay_status: 'PENDING',
            amount: 2100.00,
            notes: 'Phlebotomist collected sample, transport in cold-chain box'
        },
        {
            id: 'book-106',
            ref: 'BK-2026-1046',
            patient_id: 'pat-005',
            name: 'Manoj Tiwari',
            phone: '+91 98444 55443',
            email: 'manoj.tiwari@example.com',
            age: 45,
            gender: 'Male',
            abha: '91-7711-2233-8844',
            doc_id: 'doc-02',
            doc_name: 'Dr. Vanshika Tailor',
            tests: ['t-03'],
            test_names: 'Comprehensive Liver Function Test',
            coll_type: 'Lab Visit',
            date: '2026-10-11',
            time: '03:00 PM',
            status: 'SAMPLE_PENDING',
            pay_status: 'PENDING',
            amount: 750.00,
            notes: 'Patient arrived, token issued in phlebotomy queue'
        },
        {
            id: 'book-107',
            ref: 'BK-2026-1047',
            patient_id: 'pat-006',
            name: 'Sunita Verma',
            phone: '+91 98555 44332',
            email: 'sunita.v@example.com',
            age: 62,
            gender: 'Female',
            abha: '91-9988-7766-5544',
            doc_id: 'doc-01',
            doc_name: 'Dr. Aarav Sharma',
            tests: ['t-01', 't-04', 't-06'],
            test_names: 'CBC, KFT, Thyroid Profile',
            coll_type: 'Home Sample Collection',
            date: '2026-10-12',
            time: '08:00 AM',
            status: 'CONFIRMED',
            pay_status: 'PAID',
            amount: 1649.00,
            notes: 'Home slot confirmed for tomorrow morning'
        },
        {
            id: 'book-108',
            ref: 'BK-2026-1048',
            patient_id: 'pat-007',
            name: 'Amit Patel',
            phone: '+91 98666 33221',
            email: 'amit.patel@example.com',
            age: 39,
            gender: 'Male',
            abha: '91-2233-4455-6677',
            doc_id: null,
            doc_name: 'Self Requested',
            tests: ['t-10'],
            test_names: 'Dengue NS1 Antigen & Antibodies',
            coll_type: 'Lab Visit',
            date: '2026-10-12',
            time: '11:00 AM',
            status: 'BOOKED',
            pay_status: 'PENDING',
            amount: 850.00,
            notes: 'Acute febrile presentation reported'
        }
    ];

    for (const b of bookings) {
        labDb.run(`
            INSERT INTO test_bookings (
                id, booking_reference, lab_id, patient_id, patient_name, patient_phone, patient_email,
                patient_age, patient_gender, abha_id, doctor_id, doctor_name, test_ids, package_ids,
                test_names, collection_type, collection_address, appointment_date, appointment_time,
                status, payment_status, total_amount, notes, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            b.id,
            b.ref,
            lab1Id,
            b.patient_id,
            b.name,
            b.phone,
            b.email,
            b.age,
            b.gender,
            b.abha,
            b.doc_id,
            b.doc_name,
            JSON.stringify(b.tests),
            JSON.stringify([]),
            b.test_names,
            b.coll_type,
            'Plot B-12, Sector 62 / Registered Address',
            b.date,
            b.time,
            b.status,
            b.pay_status,
            b.amount,
            b.notes,
            now,
            now
        ]);

        // Status history audit
        labDb.run(`
            INSERT INTO booking_status_history (id, booking_id, from_status, to_status, changed_by, change_reason, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            'hist-' + b.id,
            b.id,
            null,
            b.status,
            'System Seeder',
            'Initial intake record creation',
            now
        ]);
    }

    // 6. Samples
    const samples = [
        {
            id: 'smp-101',
            barcode: 'SMP-SERUM-9914',
            booking_id: 'book-101',
            patient: 'Yashasvi Saini',
            test: 'Lipid Profile Panel',
            type: 'Serum',
            tube: 'Yellow / Gold Top (SST)',
            collected_at: '2026-10-10 08:35:00',
            collected_by: 'Anjali Sharma (Phlebotomist)',
            received_at: '2026-10-10 08:50:00',
            received_by: 'Vikramaditya Rao (Accessioning)',
            condition: 'ACCEPTED',
            status: 'RESULTS_ENTERED',
            technician: 'Vikramaditya Rao',
            analyzer: 'Roche Cobas 6000 #CH-01'
        },
        {
            id: 'smp-102',
            barcode: 'SMP-EDTA-8821',
            booking_id: 'book-102',
            patient: 'Yashasvi Saini',
            test: 'Complete Blood Count (CBC)',
            type: 'EDTA Whole Blood',
            tube: 'Purple Top (K2-EDTA)',
            collected_at: '2026-10-10 09:10:00',
            collected_by: 'Anjali Sharma',
            received_at: '2026-10-10 09:30:00',
            received_by: 'Vikramaditya Rao',
            condition: 'ACCEPTED',
            status: 'RESULTS_ENTERED',
            technician: 'Vikramaditya Rao',
            analyzer: 'Sysmex XN-1000 #HM-02'
        },
        {
            id: 'smp-103',
            barcode: 'SMP-SERUM-9915',
            booking_id: 'book-103',
            patient: 'Priya Sharma',
            test: 'Complete Blood Count & Thyroid',
            type: 'Serum & EDTA Blood',
            tube: 'Purple & Gold Top',
            collected_at: '2026-10-11 10:05:00',
            collected_by: 'Anjali Sharma',
            received_at: '2026-10-11 10:20:00',
            received_by: 'Vikramaditya Rao',
            condition: 'ACCEPTED',
            status: 'RESULTS_ENTERED',
            technician: 'Vikramaditya Rao',
            analyzer: 'Roche Cobas e411 #IM-01'
        },
        {
            id: 'smp-104',
            barcode: 'SMP-SERUM-9916',
            booking_id: 'book-104',
            patient: 'Rajesh Kumar',
            test: 'Kidney Function Test & HbA1c',
            type: 'Serum & EDTA Blood',
            tube: 'Gold & Purple Top',
            collected_at: '2026-10-11 11:20:00',
            collected_by: 'Anjali Sharma',
            received_at: '2026-10-11 11:35:00',
            received_by: 'Vikramaditya Rao',
            condition: 'ACCEPTED',
            status: 'IN_PROCESSING',
            technician: 'Vikramaditya Rao',
            analyzer: 'Beckman Coulter AU480 #CH-03'
        },
        {
            id: 'smp-105',
            barcode: 'SMP-SERUM-9917',
            booking_id: 'book-105',
            patient: 'Ananya Sengupta',
            test: 'Vitamin D3 & B12',
            type: 'Serum',
            tube: 'Amber / Red Top',
            collected_at: '2026-10-11 13:35:00',
            collected_by: 'Anjali Sharma',
            received_at: null,
            received_by: null,
            condition: 'ACCEPTED',
            status: 'ACCESSIONED',
            technician: null,
            analyzer: null
        }
    ];

    for (const s of samples) {
        labDb.run(`
            INSERT INTO samples (
                id, sample_barcode, booking_id, lab_id, patient_name, test_name, sample_type, tube_color,
                collection_timestamp, collected_by, received_timestamp, received_by, condition,
                processing_status, assigned_technician, analyzer_id, notes, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            s.id,
            s.barcode,
            s.booking_id,
            lab1Id,
            s.patient,
            s.test,
            s.type,
            s.tube,
            s.collected_at,
            s.collected_by,
            s.received_at,
            s.received_by,
            s.condition,
            s.status,
            s.technician,
            s.analyzer,
            'Sample verified with 2D barcode scan',
            now,
            now
        ]);
    }

    // 7. Diagnostic Reports
    const reports = [
        {
            id: 'rep-301',
            number: 'REP-2026-301',
            booking_id: 'book-101',
            sample_id: 'smp-101',
            patient_id: 'pat-001',
            patient_name: 'Yashasvi Saini',
            age: 24,
            gender: 'Male',
            abha: '91-4521-8902-3341',
            doc_name: 'Dr. Aarav Sharma',
            test_name: 'Lipid Profile Panel',
            coll_date: '2026-10-10',
            rep_date: '2026-10-10',
            conclusion: 'Lipid profile shows mild LDL borderline elevation (108 mg/dL). Well managed with current low-dose statin therapy. HDL and Triglycerides within normal limits.',
            status: 'PUBLISHED',
            is_ver: 1,
            ver_by: 'Dr. Rajeshwar Prasad, MD Path (Reg: MCI-99482)',
            ver_at: '2026-10-10 14:15:00',
            params: [
                { name: 'Total Cholesterol', val: '182', unit: 'mg/dL', ref: '< 200', status: 'NORMAL', order: 1 },
                { name: 'HDL (Good) Cholesterol', val: '52', unit: 'mg/dL', ref: '> 40', status: 'NORMAL', order: 2 },
                { name: 'LDL (Bad) Cholesterol', val: '108', unit: 'mg/dL', ref: '< 100', status: 'ELEVATED', order: 3 },
                { name: 'Triglycerides', val: '142', unit: 'mg/dL', ref: '< 150', status: 'NORMAL', order: 4 },
                { name: 'VLDL Cholesterol', val: '28.4', unit: 'mg/dL', ref: '< 30', status: 'NORMAL', order: 5 },
                { name: 'Total / HDL Ratio', val: '3.5', unit: 'Ratio', ref: '< 4.5', status: 'NORMAL', order: 6 }
            ]
        },
        {
            id: 'rep-302',
            number: 'REP-2026-302',
            booking_id: 'book-102',
            sample_id: 'smp-102',
            patient_id: 'pat-001',
            patient_name: 'Yashasvi Saini',
            age: 24,
            gender: 'Male',
            abha: '91-4521-8902-3341',
            doc_name: 'Dr. Aarav Sharma',
            test_name: 'Complete Blood Count (CBC)',
            coll_date: '2026-10-10',
            rep_date: '2026-10-10',
            conclusion: 'Hemogram parameters within healthy physiological limits. Normocytic normochromic red cell morphology. Normal leukocyte and platelet count.',
            status: 'PUBLISHED',
            is_ver: 1,
            ver_by: 'Dr. Rajeshwar Prasad, MD Path (Reg: MCI-99482)',
            ver_at: '2026-10-10 12:45:00',
            params: [
                { name: 'Hemoglobin (Hb)', val: '15.2', unit: 'g/dL', ref: '13.0 - 17.0', status: 'NORMAL', order: 1 },
                { name: 'Total Leukocyte Count (TLC)', val: '7400', unit: '/mcL', ref: '4000 - 11000', status: 'NORMAL', order: 2 },
                { name: 'Platelet Count', val: '2.40', unit: 'Lakhs/mcL', ref: '1.50 - 4.50', status: 'NORMAL', order: 3 },
                { name: 'RBC Count', val: '5.10', unit: 'mil/mcL', ref: '4.50 - 5.50', status: 'NORMAL', order: 4 },
                { name: 'Packed Cell Volume (PCV)', val: '45.6', unit: '%', ref: '40.0 - 50.0', status: 'NORMAL', order: 5 },
                { name: 'Neutrophils', val: '62', unit: '%', ref: '40 - 75', status: 'NORMAL', order: 6 },
                { name: 'Lymphocytes', val: '30', unit: '%', ref: '20 - 45', status: 'NORMAL', order: 7 },
                { name: 'Erythrocyte Sedimentation Rate (ESR)', val: '8', unit: 'mm/1st hr', ref: '< 15', status: 'NORMAL', order: 8 }
            ]
        },
        {
            id: 'rep-303',
            number: 'REP-2026-303',
            booking_id: 'book-103',
            sample_id: 'smp-103',
            patient_id: 'pat-002',
            patient_name: 'Priya Sharma',
            age: 28,
            gender: 'Female',
            abha: '91-3312-8874-1190',
            doc_name: 'Dr. Vanshika Tailor',
            test_name: 'Thyroid Function Profile',
            coll_date: '2026-10-11',
            rep_date: '2026-10-11',
            conclusion: 'Thyroid profile shows elevated sensitive TSH (6.42 mIU/L) with borderline normal Free T4, indicating subclinical hypothyroidism. Clinical correlation recommended.',
            status: 'PENDING_VERIFICATION',
            is_ver: 0,
            ver_by: null,
            ver_at: null,
            params: [
                { name: 'Sensitive TSH (3rd Gen)', val: '6.42', unit: 'mIU/L', ref: '0.40 - 4.50', status: 'ELEVATED', order: 1 },
                { name: 'Total T3 (Triiodothyronine)', val: '112', unit: 'ng/dL', ref: '80 - 200', status: 'NORMAL', order: 2 },
                { name: 'Total T4 (Thyroxine)', val: '6.8', unit: 'ug/dL', ref: '5.0 - 12.0', status: 'NORMAL', order: 3 }
            ]
        }
    ];

    for (const r of reports) {
        labDb.run(`
            INSERT INTO diagnostic_reports (
                id, report_number, booking_id, sample_id, lab_id, patient_id, patient_name, patient_age,
                patient_gender, abha_id, doctor_name, test_name, collection_date, reporting_date,
                clinical_interpretation, status, is_verified, verified_by, verified_at,
                amendment_version, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
        `, [
            r.id,
            r.number,
            r.booking_id,
            r.sample_id,
            lab1Id,
            r.patient_id,
            r.patient_name,
            r.age,
            r.gender,
            r.abha,
            r.doc_name,
            r.test_name,
            r.coll_date,
            r.rep_date,
            r.conclusion,
            r.status,
            r.is_ver,
            r.ver_by,
            r.ver_at,
            now,
            now
        ]);

        for (const p of r.params) {
            labDb.run(`
                INSERT INTO report_parameters (id, report_id, parameter_name, observed_value, unit, reference_range, status, display_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                `param-${r.id}-${p.order}`,
                r.id,
                p.name,
                p.val,
                p.unit,
                p.ref,
                p.status,
                p.order
            ]);
        }

        labDb.run(`
            INSERT INTO report_audit_log (id, report_id, action, performed_by, role, details, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            `audit-${r.id}`,
            r.id,
            r.is_ver ? 'PUBLISHED' : 'SUBMITTED_VERIFICATION',
            r.is_ver ? 'Dr. Rajeshwar Prasad' : 'Vikramaditya Rao',
            r.is_ver ? 'PATHOLOGIST' : 'TECHNICIAN',
            r.is_ver ? 'Clinical validation signed with digital credentials' : 'Analyzer results imported and verified',
            now
        ]);
    }

    // 8. Invoices
    const invoices = [
        {
            id: 'inv-101',
            number: 'INV-2026-1041',
            booking_id: 'book-101',
            patient: 'Yashasvi Saini',
            subtotal: 650.00,
            tax: 0.00,
            discount: 0.00,
            total: 650.00,
            paid: 650.00,
            balance: 0.00,
            status: 'PAID',
            method: 'UPI (GPay / PhonePe)',
            ref: 'UPI-NHA-99281203',
            items: [
                { desc: 'Lipid Profile Panel (Cardiac Risk)', type: 'TEST', price: 650.00, qty: 1 }
            ]
        },
        {
            id: 'inv-102',
            number: 'INV-2026-1042',
            booking_id: 'book-102',
            patient: 'Yashasvi Saini',
            subtotal: 399.00,
            tax: 0.00,
            discount: 0.00,
            total: 399.00,
            paid: 399.00,
            balance: 0.00,
            status: 'PAID',
            method: 'Credit Card',
            ref: 'CC-TXN-4491028',
            items: [
                { desc: 'Complete Blood Count (CBC) with ESR', type: 'TEST', price: 399.00, qty: 1 }
            ]
        },
        {
            id: 'inv-103',
            number: 'INV-2026-1043',
            booking_id: 'book-103',
            patient: 'Priya Sharma',
            subtotal: 949.00,
            tax: 0.00,
            discount: 0.00,
            total: 949.00,
            paid: 949.00,
            balance: 0.00,
            status: 'PAID',
            method: 'UPI',
            ref: 'UPI-77889911',
            items: [
                { desc: 'Complete Blood Count (CBC)', type: 'TEST', price: 399.00, qty: 1 },
                { desc: 'Thyroid Function Profile', type: 'TEST', price: 550.00, qty: 1 }
            ]
        },
        {
            id: 'inv-104',
            number: 'INV-2026-1045',
            booking_id: 'book-105',
            patient: 'Ananya Sengupta',
            subtotal: 2100.00,
            tax: 0.00,
            discount: 100.00,
            total: 2000.00,
            paid: 0.00,
            balance: 2000.00,
            status: 'PENDING',
            method: 'Cash on Collection',
            ref: null,
            items: [
                { desc: 'Vitamin D3 & B12 Panel', type: 'TEST', price: 2100.00, qty: 1 },
                { desc: 'First Home Phlebotomy Promotion Discount', type: 'DISCOUNT', price: -100.00, qty: 1 }
            ]
        }
    ];

    for (const inv of invoices) {
        labDb.run(`
            INSERT INTO invoices (
                id, invoice_number, booking_id, lab_id, patient_name, subtotal, tax_amount, discount_amount,
                total_amount, amount_paid, balance_due, payment_status, payment_method, transaction_reference,
                invoice_date, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            inv.id,
            inv.number,
            inv.booking_id,
            lab1Id,
            inv.patient,
            inv.subtotal,
            inv.tax,
            inv.discount,
            inv.total,
            inv.paid,
            inv.balance,
            inv.status,
            inv.method,
            inv.ref,
            '2026-10-10',
            now
        ]);

        for (let idx = 0; idx < inv.items.length; idx++) {
            const item = inv.items[idx];
            labDb.run(`
                INSERT INTO invoice_items (id, invoice_id, item_description, item_type, unit_price, quantity, total_price)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                `item-${inv.id}-${idx}`,
                inv.id,
                item.desc,
                item.type,
                item.price,
                item.qty,
                item.price * item.qty
            ]);
        }
    }

    // 9. ABDM Interoperability Consent
    labDb.run(`
        INSERT INTO abdm_consents (id, lab_id, patient_id, patient_name, abha_id, doctor_id, purpose, access_mode, status, valid_until, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        'consent-101',
        lab1Id,
        'pat-001',
        'Yashasvi Saini',
        '91-4521-8902-3341',
        'doc-01',
        'Diagnostic Investigation & Longitudinal EHR Archival',
        'VIEW_AND_RECORD',
        'ACTIVE',
        '2027-10-10',
        now
    ]);

    console.log('[LabDatabase Seeder] Successfully seeded all clinical datasets.');
}

// Auto-seed on load
try {
    seedLabDatabase();
} catch (err) {
    console.error('[LabDatabase Seeder] Auto-seed failed:', err.message);
}
