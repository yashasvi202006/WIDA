-- ========================================================
-- MEDiTRACK / WIDA - SEED DATA FOR DOCTOR MODULE
-- Module Owner: Vanshika Tailor
-- ========================================================

-- 1. All 30 Scalable Doctor Specializations
INSERT INTO doctor_specializations (name, category, description, icon_code) VALUES
('General Physician', 'Primary Care', 'Comprehensive primary health care and adult medicine', 'Stethoscope'),
('Cardiologist', 'Cardiology', 'Disorders of the heart and the cardiovascular system', 'HeartPulse'),
('Orthopedist', 'Orthopedics', 'Musculoskeletal system, bones, joints, and ligaments', 'Bone'),
('Neurologist', 'Neurology', 'Nervous system disorders, brain, and spinal cord', 'Brain'),
('Dermatologist', 'Dermatology', 'Skin, hair, nails, and related cosmetic disorders', 'Sparkles'),
('Pediatrician', 'Pediatrics', 'Medical care of infants, children, and adolescents', 'Baby'),
('Gynecologist', 'Women Health', 'Female reproductive system and women healthcare', 'ShieldCheck'),
('Obstetrician', 'Women Health', 'Pregnancy, childbirth, and postpartum care', 'HeartHandshake'),
('Psychiatrist', 'Mental Health', 'Diagnosis, prevention, and treatment of mental disorders', 'Smile'),
('Psychologist', 'Mental Health', 'Behavioral health and psychological therapy', 'Users'),
('ENT Specialist', 'Otolaryngology', 'Ear, nose, and throat disorders and head/neck surgery', 'Headphones'),
('Ophthalmologist', 'Ophthalmology', 'Eye and vision care, eye disease surgery', 'Eye'),
('Dentist', 'Dental Care', 'Oral health, teeth, gums, and maxillofacial structures', 'Smile'),
('Endocrinologist', 'Endocrinology', 'Hormone imbalances, thyroid, and diabetes management', 'Activity'),
('Gastroenterologist', 'Gastroenterology', 'Digestive system, stomach, intestines, liver, gallbladder', 'Activity'),
('Pulmonologist', 'Pulmonology', 'Respiratory tract, lungs, and breathing disorders', 'Wind'),
('Nephrologist', 'Nephrology', 'Kidney function and renal disease management', 'Activity'),
('Urologist', 'Urology', 'Urinary tract system and male reproductive organs', 'Activity'),
('Oncologist', 'Oncology', 'Cancer diagnosis, chemotherapy, and tumor management', 'ShieldAlert'),
('Radiologist', 'Radiology', 'Medical imaging interpretation (X-Ray, CT, MRI, Ultrasound)', 'Scan'),
('Pathologist', 'Pathology', 'Laboratory diagnostic analysis of tissues and fluids', 'Microscope'),
('Anesthesiologist', 'Anesthesia', 'Perioperative care, pain management, and anesthesia', 'Shield'),
('Rheumatologist', 'Rheumatology', 'Autoimmune diseases, arthritis, and joint inflammation', 'Activity'),
('Infectious Disease Specialist', 'Infectious Disease', 'Complex viral, bacterial, and fungal infections', 'ShieldAlert'),
('General Surgeon', 'Surgery', 'Surgical treatment of abdominal and soft tissue conditions', 'Scissors'),
('Neurosurgeon', 'Surgery', 'Surgical treatment of brain and nervous system disorders', 'Brain'),
('Cardiothoracic Surgeon', 'Surgery', 'Surgical treatment of heart, lung, and chest conditions', 'HeartPulse'),
('Plastic Surgeon', 'Surgery', 'Reconstructive and aesthetic plastic surgery', 'Sparkles'),
('Emergency Medicine Specialist', 'Emergency', 'Acute medical care for urgent and life-threatening conditions', 'Flame'),
('Family Medicine Specialist', 'Primary Care', 'Comprehensive whole-family primary and preventive care', 'Home');

-- 2. Seed Sample Doctors (BCrypt hashed password for 'Doctor@123' is '$2a$10$26Gxn3CwxqRUbr9NkSImn.lEkKTG82sCrFTEx2L7W0oyUDxchP6R.')
INSERT INTO doctors (id, full_name, email, phone_number, password_hash, gender, date_of_birth, medical_registration_number, qualification, specialization_id, specialization_name, sub_specialization, years_of_experience, hospital_clinic_name, address, city, state, pincode, consultation_fee, languages_known, professional_bio, profile_photo_url, verification_status, average_rating, total_ratings, total_patients, is_active) VALUES
(1, 'Dr. Aarav Sharma', 'aarav.sharma@wida.org', '+91 98765 43210', '$2a$10$26Gxn3CwxqRUbr9NkSImn.lEkKTG82sCrFTEx2L7W0oyUDxchP6R.', 'MALE', '1984-05-14', 'MCI-2009-48291', 'MBBS, MD (Cardiology), FACC', 2, 'Cardiologist', 'Interventional Cardiology', 14, 'Apex Heart & Vascular Institute', 'Ring Road, Sector 5', 'New Delhi', 'Delhi', '110001', 800.00, 'English, Hindi', 'Senior consultant interventional cardiologist with over 14 years of clinical experience in cardiac diagnostics, angiography, and lifestyle cardiology.', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80', 'VERIFIED', 4.90, 128, 450, true),
(2, 'Dr. Ananya Verma', 'ananya.verma@wida.org', '+91 98765 43211', '$2a$10$26Gxn3CwxqRUbr9NkSImn.lEkKTG82sCrFTEx2L7W0oyUDxchP6R.', 'FEMALE', '1987-09-22', 'MCI-2012-39201', 'MBBS, MS (Orthopedics)', 3, 'Orthopedist', 'Joint Replacement & Sports Medicine', 11, 'City Bone & Joint Clinic', 'Bandra West, Hill Road', 'Mumbai', 'Maharashtra', '400050', 750.00, 'English, Hindi, Marathi', 'Specialized orthopedic surgeon focusing on knee and hip arthroplasty, sports injury rehabilitation, and minimally invasive bone surgeries.', 'https://images.unsplash.com/photo-1594824813682-1c2550ec1969?w=400&auto=format&fit=crop&q=80', 'VERIFIED', 4.85, 96, 320, true),
(3, 'Dr. Rohan Mehta', 'rohan.mehta@wida.org', '+91 98765 43212', '$2a$10$26Gxn3CwxqRUbr9NkSImn.lEkKTG82sCrFTEx2L7W0oyUDxchP6R.', 'MALE', '1982-12-03', 'MCI-2007-88231', 'MBBS, DM (Neurology)', 4, 'Neurologist', 'Stroke & Epilepsy Management', 16, 'Metro Neuro Care Hospital', 'Koramangala 4th Block', 'Bengaluru', 'Karnataka', '560034', 900.00, 'English, Hindi, Kannada', 'Renowned neurologist specialized in epilepsy management, neuro-rehab, stroke intervention, and acute migraine therapy.', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80', 'VERIFIED', 4.92, 142, 510, true),
(4, 'Dr. Kavya Singh', 'kavya.singh@wida.org', '+91 98765 43213', '$2a$10$26Gxn3CwxqRUbr9NkSImn.lEkKTG82sCrFTEx2L7W0oyUDxchP6R.', 'FEMALE', '1990-03-18', 'MCI-2015-11029', 'MBBS, MD (Dermatology)', 5, 'Dermatologist', 'Clinical Dermatology & Trichology', 8, 'Aura Skin & Hair Clinic', 'Banjara Hills, Road No 12', 'Hyderabad', 'Telangana', '500034', 600.00, 'English, Hindi, Telugu', 'Dedicated dermatologist with expertise in allergic skin reactions, acne scarring, eczema, and pediatric dermatological wellness.', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80', 'UNDER_REVIEW', 4.78, 64, 210, true),
(5, 'Dr. Rahul Gupta', 'rahul.gupta@wida.org', '+91 98765 43214', '$2a$10$26Gxn3CwxqRUbr9NkSImn.lEkKTG82sCrFTEx2L7W0oyUDxchP6R.', 'MALE', '1986-07-11', 'MCI-2011-94812', 'MBBS, DCH, DNB (Pediatrics)', 6, 'Pediatrician', 'Neonatal & Child Healthcare', 12, 'Little Angels Children Clinic', 'Alwarpet, TTK Road', 'Chennai', 'Tamil Nadu', '600018', 650.00, 'English, Hindi, Tamil', 'Compassionate pediatrician focused on early childhood immunization, developmental milestones, and pediatric respiratory conditions.', 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&auto=format&fit=crop&q=80', 'VERIFIED', 4.95, 180, 620, true),
(6, 'Dr. Meera Joshi', 'meera.joshi@wida.org', '+91 98765 43215', '$2a$10$26Gxn3CwxqRUbr9NkSImn.lEkKTG82sCrFTEx2L7W0oyUDxchP6R.', 'FEMALE', '1985-11-29', 'MCI-2010-77401', 'MBBS, MS (Obstetrics & Gynecology)', 7, 'Gynecologist', 'High-Risk Pregnancy & Laparoscopy', 13, 'Mother & Child Care Center', 'Shivaji Nagar', 'Pune', 'Maharashtra', '411005', 750.00, 'English, Hindi, Marathi', 'Consultant gynecologist and obstetrician specializing in adolescent reproductive care, high-risk maternity, and laparoscopic surgeries.', 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&auto=format&fit=crop&q=80', 'VERIFIED', 4.88, 115, 390, true),
(7, 'Dr. Arjun Kapoor', 'arjun.kapoor@wida.org', '+91 98765 43216', '$2a$10$26Gxn3CwxqRUbr9NkSImn.lEkKTG82sCrFTEx2L7W0oyUDxchP6R.', 'MALE', '1989-01-15', 'MCI-2014-66231', 'MBBS, MD (General Medicine)', 1, 'General Physician', 'Internal Medicine & Diabetes Care', 9, 'CareFirst Wellness Clinic', 'Salt Lake, Sector 1', 'Kolkata', 'West Bengal', '700064', 500.00, 'English, Hindi, Bengali', 'Primary care clinician focused on holistic chronic illness management, seasonal fever control, hypertension, and preventative health.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80', 'PENDING', 4.70, 48, 180, true);

-- 3. Doctor Verifications
INSERT INTO doctor_verifications (doctor_id, status, document_name, document_type, document_url, reviewer_remarks) VALUES
(1, 'VERIFIED', 'MCI_Cardiology_Reg_Aarav.pdf', 'Medical Registration Certificate', '/docs/mci-reg-1.pdf', 'National Medical Commission registry verified. Valid license.'),
(2, 'VERIFIED', 'Orthopedics_Board_Ananya.pdf', 'State Medical Council Certificate', '/docs/mci-reg-2.pdf', 'Verified credentials against Maharashtra Medical Council.'),
(3, 'VERIFIED', 'Neurology_Board_Rohan.pdf', 'Super-Specialty Board Certificate', '/docs/mci-reg-3.pdf', 'Verified credentials against Karnataka Medical Council.'),
(4, 'UNDER_REVIEW', 'Dermatology_License_Kavya.pdf', 'State Medical Council Certificate', '/docs/mci-reg-4.pdf', 'Application submitted. Verification currently under review by verification desk.'),
(5, 'VERIFIED', 'Pediatrics_Cert_Rahul.pdf', 'Medical Registration Certificate', '/docs/mci-reg-5.pdf', 'DNB & MCI certificates confirmed.'),
(6, 'VERIFIED', 'Gynecology_Lic_Meera.pdf', 'Medical Registration Certificate', '/docs/mci-reg-6.pdf', 'Verified credentials with Pune Health Directorate.'),
(7, 'PENDING', 'General_Medicine_Arjun.pdf', 'Provisional Degree & Reg', '/docs/mci-reg-7.pdf', 'Awaiting administrative verification.');

-- 4. Doctor Availability (Dr. Aarav Sharma - Doctor 1)
INSERT INTO doctor_availabilities (doctor_id, day_of_week, is_available, start_time, end_time, break_start_time, break_end_time, slot_duration_minutes) VALUES
(1, 'MONDAY', true, '09:00 AM', '05:00 PM', '01:00 PM', '02:00 PM', 30),
(1, 'TUESDAY', true, '09:00 AM', '05:00 PM', '01:00 PM', '02:00 PM', 30),
(1, 'WEDNESDAY', true, '09:00 AM', '01:00 PM', NULL, NULL, 30),
(1, 'THURSDAY', true, '09:00 AM', '05:00 PM', '01:00 PM', '02:00 PM', 30),
(1, 'FRIDAY', true, '09:00 AM', '05:00 PM', '01:00 PM', '02:00 PM', 30),
(1, 'SATURDAY', true, '10:00 AM', '02:00 PM', NULL, NULL, 30),
(1, 'SUNDAY', false, '00:00', '00:00', NULL, NULL, 30);

-- 5. Authorized Patients Summary
INSERT INTO patients_summary (id, patient_id, full_name, age, gender, blood_group, phone, email, allergies, chronic_conditions) VALUES
(1, 'PAT-1001', 'Rahul Verma', 42, 'MALE', 'B+', '+91 98210 11223', 'rahul.verma@example.com', 'Penicillin, Dust', 'Hypertension Stage 1'),
(2, 'PAT-1002', 'Priya Deshmukh', 36, 'FEMALE', 'O+', '+91 98210 22334', 'priya.deshmukh@example.com', 'Sulfa drugs', 'Mild Asthma'),
(3, 'PAT-1003', 'Vikramaditya Rao', 58, 'MALE', 'A+', '+91 98210 33445', 'vikram.rao@example.com', 'None known', 'Type 2 Diabetes, Coronary Artery Disease'),
(4, 'PAT-1004', 'Sunita Sundaram', 64, 'FEMALE', 'AB+', '+91 98210 44556', 'sunita.s@example.com', 'Aspirin', 'Hyperlipidemia, Angina'),
(5, 'PAT-1005', 'Amitabh Sen', 29, 'MALE', 'O-', '+91 98210 55667', 'amitabh.sen@example.com', 'None known', 'None');

-- 6. Sample Appointments for Dr. Aarav Sharma (Doctor 1)
INSERT INTO appointments (id, appointment_number, doctor_id, patient_id, patient_name, appointment_date, appointment_time, appointment_type, reason_for_visit, status, doctor_notes, reschedule_reason) VALUES
(1, 'APT-2026-001', 1, 'PAT-1001', 'Rahul Verma', '2026-10-07', '10:00 AM', 'IN_PERSON', 'Routine cardiac evaluation and recurring chest tightness on exertion', 'ACCEPTED', 'Patient advised to bring past ECG reports.', NULL),
(2, 'APT-2026-002', 1, 'PAT-1002', 'Priya Deshmukh', '2026-10-07', '11:30 AM', 'VIDEO_CONSULTATION', 'Follow-up regarding palpitations and stress management', 'PENDING', NULL, NULL),
(3, 'APT-2026-003', 1, 'PAT-1003', 'Vikramaditya Rao', '2026-10-07', '02:30 PM', 'IN_PERSON', 'Post-stenting 6-month arterial checkup and blood pressure review', 'ACCEPTED', 'Schedule lipid profile prior to consultation.', NULL),
(4, 'APT-2026-004', 1, 'PAT-1004', 'Sunita Sundaram', '2026-10-08', '09:30 AM', 'FOLLOW_UP', 'Review of recent echocardiogram results', 'ACCEPTED', NULL, NULL),
(5, 'APT-2026-005', 1, 'PAT-1005', 'Amitabh Sen', '2026-10-08', '11:00 AM', 'IN_PERSON', 'Pre-marathon cardiovascular fitness assessment', 'PENDING', NULL, NULL),
(6, 'APT-2026-006', 1, 'PAT-1001', 'Rahul Verma', '2026-09-28', '10:00 AM', 'IN_PERSON', 'Initial consult for mild arrhythmia', 'COMPLETED', 'Consultation finished, prescribed beta blocker and requested CBC.', NULL),
(7, 'APT-2026-007', 1, 'PAT-1002', 'Priya Deshmukh', '2026-09-20', '03:00 PM', 'VIDEO_CONSULTATION', 'Holter monitor report discussion', 'COMPLETED', 'Holter normal, stress induced sinus tachycardia.', NULL);

-- 7. Consultations
INSERT INTO consultations (id, consultation_number, appointment_id, doctor_id, patient_id, patient_name, consultation_date, chief_complaint, symptoms, clinical_notes, diagnosis, doctor_remarks, follow_up_date, additional_notes, status) VALUES
(1, 'CNS-2026-101', 6, 1, 'PAT-1001', 'Rahul Verma', '2026-09-28', 'Mild palpitation and exercise fatigue', 'Intermittent chest discomfort, shortness of breath upon brisk walking for 15 mins.', 'BP: 138/88 mmHg, HR: 82 bpm, S1/S2 normal, no murmurs.', 'Mild Sinus Tachycardia with Essential Hypertension', 'Advised 30 minutes light walking, low sodium diet, avoid excessive caffeine.', '2026-10-07', 'Repeat ECG if palpitations intensify.', 'COMPLETED'),
(2, 'CNS-2026-102', 7, 1, 'PAT-1002', 'Priya Deshmukh', '2026-09-20', 'Racing pulse during work hours', 'Episodic palpitations, anxiety, sweating, fatigue in late afternoons.', 'BP: 122/76 mmHg, HR: 94 bpm, respiratory clear, thyroid non-palpable.', 'Stress-Induced Autonomic Dysfunction', 'Practice deep breathing relaxation exercises, maintain adequate hydration.', '2026-10-07', 'Rule out hyperthyroidism via lab panel.', 'COMPLETED');

-- 8. Prescriptions
INSERT INTO prescriptions (id, prescription_number, consultation_id, appointment_id, doctor_id, patient_id, patient_name, prescription_date, general_advice, pharmacy_status) VALUES
(1, 'RX-2026-801', 1, 6, 1, 'PAT-1001', 'Rahul Verma', '2026-09-28', 'Take medicines strictly after meals. Monitor morning blood pressure daily.', 'DISPENSED'),
(2, 'RX-2026-802', 2, 7, 1, 'PAT-1002', 'Priya Deshmukh', '2026-09-20', 'Avoid sudden caffeine intake. Keep hydration above 2.5 liters/day.', 'DISPENSED');

-- 9. Prescription Items
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, instructions) VALUES
(1, 'Metoprolol Tartrate', '25 mg', 'Once daily', '14 days', 'Take in the morning after breakfast'),
(1, 'Telmisartan', '40 mg', 'Once daily', '30 days', 'Take after dinner, before bedtime'),
(1, 'Atorvastatin', '10 mg', 'Once daily', '30 days', 'Take at night after food'),
(2, 'Propranolol', '10 mg', 'As needed', '10 days', 'Take 1 tablet during severe palpitation episodes'),
(2, 'Magnesium Glycinate', '200 mg', 'Once daily', '20 days', 'Take at bedtime with water');

-- 10. Diagnostic Test Requests
INSERT INTO diagnostic_test_requests (id, request_number, doctor_id, patient_id, patient_name, appointment_id, test_name, priority, clinical_reason, special_instructions, status, requested_date) VALUES
(1, 'DTR-2026-401', 1, 'PAT-1001', 'Rahul Verma', 1, 'Lipid Profile', 'ROUTINE', 'Assess hyperlipidemia risk and baseline LDL/HDL before statin dosage adjustment', '12-hour overnight fasting required.', 'COMPLETED', '2026-09-29'),
(2, 'DTR-2026-402', 1, 'PAT-1001', 'Rahul Verma', 1, 'ECG 12-Lead', 'ROUTINE', 'Rule out ischemic ST changes and rhythm abnormalities', 'Resting supine tracing.', 'COMPLETED', '2026-09-29'),
(3, 'DTR-2026-403', 1, 'PAT-1002', 'Priya Deshmukh', 2, 'Thyroid Profile (T3, T4, TSH)', 'ROUTINE', 'Rule out subclinical hyperthyroidism presenting as palpitations', 'Early morning sample preferred.', 'COMPLETED', '2026-09-21'),
(4, 'DTR-2026-404', 1, 'PAT-1003', 'Vikramaditya Rao', 3, 'Echocardiogram (2D Echo)', 'URGENT', 'Evaluate left ventricular ejection fraction and regional wall motion post-PTCA', 'Compare with previous 2025 baseline study.', 'REQUESTED', '2026-10-06');

-- 11. Medical Reports (Available to Doctor)
INSERT INTO medical_reports (id, report_number, patient_id, patient_name, doctor_id, test_request_id, test_name, report_date, result_summary, result_status, lab_technician_name, report_file_url) VALUES
(1, 'RPT-2026-901', 'PAT-1001', 'Rahul Verma', 1, 1, 'Lipid Profile', '2026-09-30', 'Total Cholesterol: 218 mg/dL (Elevated), Triglycerides: 165 mg/dL, HDL: 44 mg/dL, LDL: 141 mg/dL. Statin adjustment indicated.', 'ABNORMAL', 'K. Murthy, Senior Biochemist', '/reports/rpt-901.pdf'),
(2, 'RPT-2026-902', 'PAT-1001', 'Rahul Verma', 1, 2, 'ECG 12-Lead', '2026-09-30', 'Sinus rhythm, HR 78 bpm, normal axis. No acute ischemic ST elevation or depression. Non-specific minor T-wave flattening in lead III.', 'NORMAL', 'Dr. S. Nair, Consulting Radiologist', '/reports/rpt-902.pdf'),
(3, 'RPT-2026-903', 'PAT-1002', 'Priya Deshmukh', 1, 3, 'Thyroid Profile', '2026-09-22', 'TSH: 2.15 uIU/mL (Normal: 0.4-4.2), Total T3: 110 ng/dL, Total T4: 8.2 ug/dL. Euthyroid state confirmed.', 'NORMAL', 'V. Saxena, Biochemist', '/reports/rpt-903.pdf');

-- 12. Doctor Achievements (Prototype System-Generated)
INSERT INTO doctor_achievements (doctor_id, badge_key, title, description, icon, is_unlocked, progress, max_progress, awarded_date) VALUES
(1, 'VERIFIED_DOCTOR', 'Verified Medical Specialist', 'National Medical Commission registry verified and authenticated', 'BadgeCheck', true, 100, 100, '2026-01-15'),
(1, 'PATIENT_MILESTONE_100', '100+ Consultations Completed', 'Successfully conducted over 100 patient clinical consultations', 'Users', true, 100, 100, '2026-04-10'),
(1, 'PATIENTS_SERVED_400', '400+ Patients Served', 'Provided compassionate care to more than 400 unique patients', 'HeartHandshake', true, 450, 400, '2026-08-22'),
(1, 'TOP_RATED_SPECIALIST', 'Top Rated Specialist (4.9★)', 'Maintained exceptional average rating above 4.8 from verified patient visits', 'Star', true, 100, 100, '2026-07-01'),
(1, 'CONSISTENT_AVAILABILITY', 'Consistent Availability Champion', 'Maintained 95%+ clinic punctuality and availability schedule adherence', 'Clock', true, 96, 100, '2026-09-15'),
(1, 'DIAGNOSTIC_EXCELLENCE', 'Clinical Diagnostic Excellence', 'Recorded high correlation between clinical impressions and diagnostic investigations', 'Activity', true, 100, 100, '2026-09-30');

-- 13. Doctor Ratings
INSERT INTO doctor_ratings (doctor_id, patient_name, rating_value, review_title, review_comment, appointment_type, created_at) VALUES
(1, 'Rahul Verma', 5, 'Extremely knowledgeable and calm', 'Dr. Aarav explained my ECG results with great clarity. He did not rush through the consultation and created a realistic diet plan.', 'In-Person', '2026-09-30 11:20:00'),
(1, 'Priya Deshmukh', 5, 'Reassuring and thorough consultation', 'I was very anxious about my heart rate spikes. Dr. Aarav ruled out major issues and guided me gently. Feeling much better now.', 'Telehealth', '2026-09-22 16:45:00'),
(1, 'Vikramaditya Rao', 5, 'Exceptional post-stent management', 'Been consulting Dr. Aarav for 3 years. One of the finest cardiologists in Delhi. Truly professional and empathetic.', 'In-Person', '2026-08-14 14:10:00'),
(1, 'Sunita Sundaram', 4, 'Very good experience', 'Clinic was on time and doctor inspected all previous echo reports carefully. Prescriptions were clear.', 'Follow-up', '2026-08-01 10:15:00');

-- 14. Doctor Notifications
INSERT INTO doctor_notifications (doctor_id, title, message, type, reference_id, is_read, created_at) VALUES
(1, 'New Appointment Request', 'Priya Deshmukh requested a Video Consultation appointment for today at 11:30 AM.', 'APPOINTMENT_REQUEST', 'APT-2026-002', false, '2026-10-07 08:30:00'),
(1, 'New Appointment Request', 'Amitabh Sen requested an In-Person appointment for tomorrow at 11:00 AM.', 'APPOINTMENT_REQUEST', 'APT-2026-005', false, '2026-10-07 09:15:00'),
(1, 'Diagnostic Lab Report Available', 'Lipid Profile report for patient Rahul Verma is now ready to view.', 'LAB_REPORT_READY', 'RPT-2026-901', false, '2026-10-06 17:00:00'),
(1, 'Prescription Dispensed', 'Prescription RX-2026-801 for Rahul Verma was fulfilled by Meditrack Pharmacy.', 'PRESCRIPTION_ALERT', 'RX-2026-801', true, '2026-09-29 14:30:00'),
(1, 'System Verification Confirmed', 'Your National Medical Commission credentials have been re-verified successfully.', 'SYSTEM', 'VERIF-101', true, '2026-09-01 09:00:00');
