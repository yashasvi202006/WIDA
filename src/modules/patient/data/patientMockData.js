export const PATIENT_MOCK_PROFILE = {
    id: 'pat-001',
    abhaId: '91-4521-8902-3341',
    name: 'Yashasvi Saini',
    email: 'yashasvi.saini@wida.health',
    phone: '+91 98765 43210',
    dob: '2002-06-15',
    gender: 'Male',
    address: 'B-402, Green Avenue, Sector 62, Noida, UP, India',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    bloodGroup: 'B+',
    height: '178 cm',
    weight: '71 kg',
    bmi: '22.4 (Normal)',
    emergencyContact: {
        name: 'Rajendra Saini',
        relationship: 'Father',
        phone: '+91 98111 22334'
    },
    allergies: ['Penicillin', 'Sulfa drugs'],
    chronicConditions: ['Mild Essential Hypertension'],
    currentMedications: ['Telmisartan 40mg (OD)', 'Atorvastatin 10mg (HS)'],
    lifestyle: {
        smoking: 'Non-smoker',
        alcohol: 'Occasional',
        activityLevel: 'Moderate (Gym 4x/week)'
    }
};
export const PATIENT_MOCK_DOCTORS = [
    {
        id: 'doc-001',
        name: 'Dr. Sharma',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
        verified: true,
        specialization: 'Cardiologist',
        experience: 16,
        rating: 4.9,
        patientsCount: 3840,
        consultationFee: 800,
        location: 'Max Super Speciality Hospital, New Delhi',
        hospital: 'Max Super Speciality Hospital',
        availability: 'Mon - Fri (10:00 AM - 04:30 PM)',
        medicineSystem: 'Allopathy',
        about: 'Senior Consultant Interventional Cardiologist with extensive expertise in preventive cardiology, coronary artery disease, and hypertension management.',
        education: ['MBBS - AIIMS New Delhi', 'MD (Medicine) - PGIMER', 'DM (Cardiology) - AIIMS'],
        languages: ['English', 'Hindi'],
        achievements: ['Fellow of American College of Cardiology', 'National Excellence in Cardiology Award 2024'],
        availableSlots: ['09:30 AM', '10:30 AM', '11:45 AM', '02:30 PM', '04:00 PM']
    },
    {
        id: 'doc-002',
        name: 'Dr. Priya Mehta',
        photo: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&q=80&w=300',
        verified: true,
        specialization: 'Dermatologist',
        experience: 11,
        rating: 4.8,
        patientsCount: 2450,
        consultationFee: 700,
        location: 'Apollo Clinic, South Extension, New Delhi',
        hospital: 'Apollo Hospitals',
        availability: 'Tue - Sat (11:00 AM - 06:00 PM)',
        medicineSystem: 'Allopathy',
        about: 'Board-certified clinical and aesthetic dermatologist focusing on allergic skin disorders, autoimmune dermatitis, and non-invasive therapy.',
        education: ['MBBS - King George Medical University', 'MD (Dermatology) - MAMC New Delhi'],
        languages: ['English', 'Hindi', 'Gujarati'],
        achievements: ['IADVL Young Dermatologist Award', 'Published 18 International Papers'],
        availableSlots: ['11:00 AM', '12:30 PM', '03:15 PM', '05:00 PM']
    },
    {
        id: 'doc-003',
        name: 'Dr. Rajiv Kapoor',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
        verified: true,
        specialization: 'General Physician',
        experience: 19,
        rating: 4.9,
        patientsCount: 6100,
        consultationFee: 600,
        location: 'Medanta Mediclinic, Cyber City, Gurugram',
        hospital: 'Medanta - The Medicity',
        availability: 'Mon - Sat (09:00 AM - 03:00 PM)',
        medicineSystem: 'Allopathy',
        about: 'Experienced internal medicine physician providing comprehensive diagnostic evaluation, chronic lifestyle disease monitoring, and preventive geriatric care.',
        education: ['MBBS - Maulana Azad Medical College', 'MD (Internal Medicine) - AIIMS'],
        languages: ['English', 'Hindi', 'Punjabi'],
        achievements: ['Distinguished Physician Council Member', 'Ex-Registrar AIIMS Delhi'],
        availableSlots: ['09:00 AM', '10:15 AM', '11:30 AM', '01:30 PM']
    },
    {
        id: 'doc-004',
        name: 'Dr. Ananya Joshi',
        photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
        verified: true,
        specialization: 'Ayurvedic Physician',
        experience: 12,
        rating: 4.7,
        patientsCount: 1980,
        consultationFee: 500,
        location: 'Patanjali Wellness Institute, New Delhi',
        hospital: 'Chikitsalaya Wellness Center',
        availability: 'Mon - Fri (10:00 AM - 05:00 PM)',
        medicineSystem: 'Ayurveda',
        about: 'Specialized in classical Panchakarma therapies, holistic gut health, and herbal formulations for metabolic wellness.',
        education: ['BAMS - Gujarat Ayurved University', 'MD (Panchakarma) - National Institute of Ayurveda'],
        languages: ['English', 'Hindi', 'Sanskrit'],
        achievements: ['AYUSH Ministry Certified Practitioner', 'Author of Holistic Gut Rebalance'],
        availableSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '03:45 PM']
    },
    {
        id: 'doc-005',
        name: 'Dr. Rohan Varma',
        photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300',
        verified: true,
        specialization: 'Homeopathy Specialist',
        experience: 10,
        rating: 4.6,
        patientsCount: 1650,
        consultationFee: 450,
        location: 'Hahnemann Clinic, Connaught Place, New Delhi',
        hospital: 'Hahnemann Homeopathic Care',
        availability: 'Wed - Sun (11:00 AM - 05:30 PM)',
        medicineSystem: 'Homeopathy',
        about: 'Expert in constitutional classical homeopathy treating chronic allergies, pediatric asthma, and psychosomatic disorders.',
        education: ['BHMS - Nehru Homoeopathic Medical College', 'MD (Homoeopathy)'],
        languages: ['English', 'Hindi'],
        achievements: ['Gold Medalist Delhi University', 'Member of Central Council of Homoeopathy'],
        availableSlots: ['11:30 AM', '01:00 PM', '03:30 PM', '04:45 PM']
    }
];
export const PATIENT_MOCK_APPOINTMENTS = [
    {
        id: 'apt-101',
        doctorId: 'doc-001',
        doctorName: 'Dr. Sharma',
        doctorSpecialization: 'Cardiologist',
        doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
        date: '10 Oct 2026',
        time: '10:30 AM',
        type: 'In-person',
        status: 'Confirmed',
        reason: 'Routine cardiac follow-up & blood pressure regulation review',
        fee: 800,
        location: 'Max Super Speciality Hospital, OPD Block 3, Room 204'
    },
    {
        id: 'apt-102',
        doctorId: 'doc-002',
        doctorName: 'Dr. Priya Mehta',
        doctorSpecialization: 'Dermatologist',
        doctorAvatar: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&q=80&w=300',
        date: '18 Oct 2026',
        time: '03:15 PM',
        type: 'Online',
        status: 'Pending',
        reason: 'Seasonal contact dermatitis consultation',
        fee: 700,
        joinUrl: 'https://telehealth.wida.health/room/apt-102'
    },
    {
        id: 'apt-103',
        doctorId: 'doc-003',
        doctorName: 'Dr. Rajiv Kapoor',
        doctorSpecialization: 'General Physician',
        doctorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
        date: '28 Sep 2026',
        time: '11:00 AM',
        type: 'In-person',
        status: 'Completed',
        reason: 'Annual preventive physical exam & vitamin deficiency check',
        fee: 600,
        doctorRemarks: 'Patient healthy. Recommended CBC and Lipid Profile panel.'
    }
];
export const PATIENT_MOCK_PRESCRIPTIONS = [
    {
        id: 'rx-201',
        doctorId: 'doc-001',
        doctorName: 'Dr. Sharma',
        doctorSpecialization: 'Cardiologist',
        date: '10 Oct 2026',
        expiryDate: '10 Jan 2027',
        status: 'Active',
        diagnosis: 'Stage 1 Primary Hypertension & Hyperlipidemia Management',
        instructions: 'Maintain low sodium diet, avoid strenuous unmonitored lifting, 30 min brisk walk daily.',
        dispensedBy: 'HealthPlus Pharmacy',
        isSentToPharmacy: true,
        medicines: [
            {
                id: 'med-01',
                name: 'Telmisartan 40mg',
                dosage: '1 Tablet',
                frequency: 'Once Daily (OD)',
                duration: '90 Days',
                instructions: 'Take in the morning with water after breakfast.',
                timing: ['Morning'],
                price: 180,
                quantity: 90
            },
            {
                id: 'med-02',
                name: 'Atorvastatin 10mg',
                dosage: '1 Tablet',
                frequency: 'Once Daily at Bedtime (HS)',
                duration: '90 Days',
                instructions: 'Take before sleep. Regular lipid panel monitoring required.',
                timing: ['Night'],
                price: 240,
                quantity: 90
            }
        ]
    },
    {
        id: 'rx-202',
        doctorId: 'doc-003',
        doctorName: 'Dr. Rajiv Kapoor',
        doctorSpecialization: 'General Physician',
        date: '28 Sep 2026',
        expiryDate: '28 Oct 2026',
        status: 'Completed',
        diagnosis: 'Mild Seasonal Bronchitis',
        instructions: 'Warm water gargles 3x/day, steam inhalation before sleep.',
        dispensedBy: 'MediCare Pharmacy',
        isSentToPharmacy: true,
        medicines: [
            {
                id: 'med-03',
                name: 'Amoxicillin + Clavulanic Acid 625mg',
                dosage: '1 Tablet',
                frequency: 'Twice Daily (BD)',
                duration: '5 Days',
                instructions: 'Take after meals. Complete the entire course.',
                timing: ['Morning', 'Night'],
                price: 210,
                quantity: 10
            },
            {
                id: 'med-04',
                name: 'Paracetamol 650mg',
                dosage: '1 Tablet',
                frequency: 'SOS (When needed for fever/headache)',
                duration: '5 Days',
                instructions: 'Keep minimum 6 hours gap between doses.',
                timing: ['Afternoon'],
                price: 35,
                quantity: 10
            }
        ]
    }
];
export const PATIENT_MOCK_TESTS = [
    {
        id: 'test-01',
        name: 'Complete Blood Count (CBC)',
        category: 'Blood',
        description: 'Measures red blood cells, white blood cells, hemoglobin, hematocrit, and platelets to evaluate overall health and detect disorders.',
        price: 350,
        preparation: 'No mandatory fasting required. Drink plenty of water.',
        turnaroundTime: '6 to 12 Hours',
        sampleType: 'Whole Blood (EDTA)',
        popular: true,
        recommendedFor: ['Routine checkup', 'Fatigue evaluation', 'Pre-surgery screen']
    },
    {
        id: 'test-02',
        name: 'Comprehensive Lipid Profile',
        category: 'Blood',
        description: 'Measures Total Cholesterol, HDL, LDL, VLDL, and Triglycerides to assess cardiovascular disease risk.',
        price: 650,
        preparation: '10–12 hours overnight fasting mandatory. Water allowed.',
        turnaroundTime: '12 Hours',
        sampleType: 'Serum Blood',
        popular: true,
        recommendedFor: ['Cardiac patients', 'Hypertension', 'Age 30+ screening']
    },
    {
        id: 'test-03',
        name: 'HbA1c (Glycated Hemoglobin)',
        category: 'Pathology',
        description: 'Evaluates average blood sugar levels over the past 2 to 3 months for diabetes screening and glycemic control.',
        price: 450,
        preparation: 'No fasting required. Any time of the day.',
        turnaroundTime: '8 Hours',
        sampleType: 'Whole Blood',
        popular: true,
        recommendedFor: ['Pre-diabetes', 'Type 2 Diabetes', 'Annual metabolic profile']
    },
    {
        id: 'test-04',
        name: 'Full Body Health Master Checkup',
        category: 'Full Body',
        description: 'Package of 78 vital parameters including CBC, Lipid, Liver (LFT), Kidney (KFT), Thyroid (TSH), Vitamin D & B12.',
        price: 1899,
        preparation: '12 hours strict fasting required. Morning sample collection recommended.',
        turnaroundTime: '24 Hours',
        sampleType: 'Blood and Urine',
        popular: true,
        recommendedFor: ['Annual comprehensive assessment', 'Age 25+ preventive health']
    }
];
export const PATIENT_MOCK_LABS = [
    {
        id: 'lab-01',
        name: 'HealthFirst Diagnostics',
        address: 'Plot 14, Health City, Sector 62, Noida',
        rating: 4.9,
        accreditation: 'NABL Accredited & ISO 15189 Certified',
        phone: '+91 120 4567890',
        availableSlots: ['07:30 AM', '08:30 AM', '09:30 AM', '11:00 AM', '03:00 PM']
    },
    {
        id: 'lab-02',
        name: 'MedCare Diagnostics & Imaging',
        address: 'Near Apollo Pharmacy, Greater Kailash 1, New Delhi',
        rating: 4.8,
        accreditation: 'CAP & NABL Certified Lab',
        phone: '+91 11 29876543',
        availableSlots: ['08:00 AM', '09:00 AM', '10:30 AM', '12:00 PM']
    }
];
export const PATIENT_MOCK_REPORTS = [
    {
        id: 'rep-301',
        testId: 'test-01',
        testName: 'Complete Blood Count (CBC)',
        labName: 'HealthFirst Diagnostics',
        date: '12 Oct 2026',
        doctorName: 'Dr. Sharma',
        status: 'Ready',
        isVerified: true,
        overallConclusion: 'All hematological indices within normal biological reference limits. No signs of infection, anemia, or thrombocytopenia.',
        doctorNotes: 'Reviewed by Dr. Sharma. Blood parameters optimal. Continue existing cardiac medications as prescribed.',
        parameters: [
            { name: 'Hemoglobin (Hb)', value: '15.2', unit: 'g/dL', normalRange: '13.0 - 17.0', status: 'Normal' },
            { name: 'Total Leucocyte Count (TLC)', value: '6,800', unit: '/cu.mm', normalRange: '4,000 - 11,000', status: 'Normal' },
            { name: 'RBC Count', value: '5.1', unit: 'mill/cu.mm', normalRange: '4.5 - 5.9', status: 'Normal' },
            { name: 'Packed Cell Volume (PCV)', value: '44.8', unit: '%', normalRange: '40.0 - 50.0', status: 'Normal' },
            { name: 'Platelet Count', value: '240,000', unit: '/cu.mm', normalRange: '150,000 - 450,000', status: 'Normal' },
            { name: 'Neutrophils', value: '62', unit: '%', normalRange: '40 - 70', status: 'Normal' },
            { name: 'Lymphocytes', value: '30', unit: '%', normalRange: '20 - 40', status: 'Normal' },
            { name: 'Eosinophils', value: '3', unit: '%', normalRange: '1 - 6', status: 'Normal' },
            { name: 'Monocytes', value: '5', unit: '%', normalRange: '2 - 8', status: 'Normal' }
        ]
    },
    {
        id: 'rep-302',
        testId: 'test-02',
        testName: 'Comprehensive Lipid Profile',
        labName: 'HealthFirst Diagnostics',
        date: '29 Sep 2026',
        doctorName: 'Dr. Rajiv Kapoor',
        status: 'Reviewed',
        isVerified: true,
        overallConclusion: 'Borderline elevated LDL cholesterol. Triglycerides and HDL within expected therapeutic target range.',
        doctorNotes: 'Advised lifestyle modification and low saturated fat intake. Follow up with cardiologist.',
        parameters: [
            { name: 'Total Cholesterol', value: '198', unit: 'mg/dL', normalRange: '< 200', status: 'Normal' },
            { name: 'HDL (Good) Cholesterol', value: '52', unit: 'mg/dL', normalRange: '> 40', status: 'Normal' },
            { name: 'LDL (Bad) Cholesterol', value: '124', unit: 'mg/dL', normalRange: '< 100', status: 'Elevated' },
            { name: 'Triglycerides', value: '142', unit: 'mg/dL', normalRange: '< 150', status: 'Normal' }
        ]
    }
];
export const PATIENT_MOCK_PHARMACY_ORDERS = [
    {
        id: 'ord-401',
        prescriptionId: 'rx-201',
        pharmacyName: 'HealthPlus Pharmacy',
        date: '12 Oct 2026',
        medicines: [
            { name: 'Telmisartan 40mg (90 tabs)', quantity: '1 pack', price: 180 },
            { name: 'Atorvastatin 10mg (90 tabs)', quantity: '1 pack', price: 240 }
        ],
        totalAmount: 420,
        status: 'Delivered',
        deliveryType: 'Home Delivery',
        estimatedReadyTime: 'Delivered on 13 Oct 2026'
    }
];
export const PATIENT_MOCK_CARE_JOURNEY = [
    {
        id: 'step-1',
        title: 'Appointment Booked',
        subtitle: 'Dr. Sharma (Cardiologist)',
        date: '10 Oct 2026, 10:30 AM',
        provider: 'Max Super Speciality Hospital',
        status: 'completed',
        icon: 'calendar',
        routeLink: 'appointments',
        details: 'Confirmed in-person consultation for cardiac follow-up.'
    },
    {
        id: 'step-2',
        title: 'Consultation Completed',
        subtitle: 'Clinical assessment & diagnosis',
        date: '10 Oct 2026, 11:15 AM',
        provider: 'Dr. Sharma',
        status: 'completed',
        icon: 'stethoscope',
        routeLink: 'doctors',
        details: 'Blood pressure checked (128/82 mmHg). Advised CBC & Lipid monitor.'
    },
    {
        id: 'step-3',
        title: 'Prescription & Test Issued',
        subtitle: '2 Medicines + CBC Test ordered',
        date: '10 Oct 2026, 11:20 AM',
        provider: 'WIDA Digital Rx',
        status: 'completed',
        icon: 'file-text',
        routeLink: 'prescriptions',
        details: 'Telmisartan 40mg + Atorvastatin 10mg and CBC panel ordered.'
    },
    {
        id: 'step-4',
        title: 'Diagnostic Test Booked',
        subtitle: 'CBC Sample collection',
        date: '11 Oct 2026, 08:30 AM',
        provider: 'HealthFirst Diagnostics',
        status: 'completed',
        icon: 'flask',
        routeLink: 'diagnostics',
        details: 'Phlebotomist collected venous sample at home.'
    },
    {
        id: 'step-5',
        title: 'Lab Report Generated',
        subtitle: 'CBC Verified Report Available',
        date: '12 Oct 2026, 02:45 PM',
        provider: 'HealthFirst Diagnostics',
        status: 'completed',
        icon: 'file-check',
        routeLink: 'diagnostics',
        details: 'All hematological indices normal. Reviewed by Dr. Sharma.'
    },
    {
        id: 'step-6',
        title: 'Pharmacy Order Dispensed',
        subtitle: 'HealthPlus Pharmacy verified & delivered',
        date: '13 Oct 2026, 04:30 PM',
        provider: 'HealthPlus Pharmacy',
        status: 'completed',
        icon: 'capsule',
        routeLink: 'pharmacy',
        details: 'Original pharmaceutical packaging verified with barcode audit.'
    },
    {
        id: 'step-7',
        title: 'Unified Health Record Updated',
        subtitle: 'Continuous care record synchronized',
        date: '13 Oct 2026, 04:35 PM',
        provider: 'WIDA Health Vault',
        status: 'completed',
        icon: 'shield',
        routeLink: 'records',
        details: 'Encounter loop closed. Automated reminder schedule updated.'
    }
];
export const PATIENT_MOCK_HEALTH_RECORDS = [
    {
        id: 'hr-01',
        category: 'Pharmacy',
        title: 'Cardiac Medicine Dispensed',
        date: '13 Oct 2026',
        time: '04:30 PM',
        provider: 'HealthPlus Pharmacy',
        summary: 'Fulfilled 90-day course of Telmisartan 40mg & Atorvastatin 10mg. Dispensing pharmacist: R. Chugh (Lic #DL-7821).',
        verified: true,
        badgeType: 'pharmacy',
        relatedId: 'ord-401'
    },
    {
        id: 'hr-02',
        category: 'Lab',
        title: 'Complete Blood Count (CBC) Report Verified',
        date: '12 Oct 2026',
        time: '02:45 PM',
        provider: 'HealthFirst Diagnostics',
        summary: 'Normal blood count parameters. Hemoglobin: 15.2 g/dL, Platelets: 240,000/cu.mm. Digital signature verified.',
        verified: true,
        badgeType: 'lab',
        relatedId: 'rep-301'
    },
    {
        id: 'hr-03',
        category: 'Lab',
        title: 'CBC Test Sample Collected',
        date: '11 Oct 2026',
        time: '08:30 AM',
        provider: 'HealthFirst Diagnostics',
        summary: 'EDTA blood sample drawn via certified home phlebotomy kit. Barcode #BC-99201.',
        verified: true,
        badgeType: 'lab',
        relatedId: 'test-01'
    },
    {
        id: 'hr-04',
        category: 'Prescription',
        title: 'Digital Prescription Generated',
        date: '10 Oct 2026',
        time: '11:20 AM',
        provider: 'Dr. Sharma (Cardiologist)',
        summary: 'Issued digital Rx #RX-201 for blood pressure & lipid regulation. 90-day supply with automated refill reminders.',
        verified: true,
        badgeType: 'doctor',
        relatedId: 'rx-201'
    },
    {
        id: 'hr-05',
        category: 'Consultation',
        title: 'Cardiology Consultation Encounter',
        date: '10 Oct 2026',
        time: '10:30 AM',
        provider: 'Dr. Sharma (Max Super Speciality)',
        summary: 'In-person evaluation. BP 128/82 mmHg, pulse 72 bpm regular. S1 S2 normal. Ordered CBC test and initiated therapy.',
        verified: true,
        badgeType: 'doctor',
        relatedId: 'apt-101'
    }
];
export const PATIENT_MOCK_REMINDERS = [
    {
        id: 'rem-01',
        type: 'Medicine',
        title: 'Telmisartan 40mg',
        description: 'Blood pressure medicine. Take with water after breakfast.',
        date: '2026-10-07',
        time: '08:00 AM',
        repeat: 'Daily',
        status: 'Taken',
        priority: 'high',
        dosage: '1 Tablet'
    },
    {
        id: 'rem-02',
        type: 'Appointment',
        title: 'Consultation with Dr. Sharma',
        description: 'Cardiology follow-up at Max Super Speciality Hospital.',
        date: '2026-10-10',
        time: '10:30 AM',
        repeat: 'Once',
        status: 'Upcoming',
        priority: 'high'
    },
    {
        id: 'rem-03',
        type: 'Wellness',
        title: 'Hydration Target (2.5L)',
        description: 'Time to drink a fresh glass of water to meet your daily 3000ml goal.',
        date: '2026-10-07',
        time: '02:00 PM',
        repeat: 'Daily',
        status: 'Upcoming',
        priority: 'low'
    },
    {
        id: 'rem-04',
        type: 'Wellness',
        title: 'Evening Brisk Walk / Activity',
        description: 'Target: 8,000 steps daily for cardiovascular health.',
        date: '2026-10-07',
        time: '06:00 PM',
        repeat: 'Daily',
        status: 'Upcoming',
        priority: 'medium'
    },
    {
        id: 'rem-05',
        type: 'Medicine',
        title: 'Atorvastatin 10mg',
        description: 'Lipid regulator tablet. Take before bedtime.',
        date: '2026-10-07',
        time: '09:30 PM',
        repeat: 'Daily',
        status: 'Upcoming',
        priority: 'high',
        dosage: '1 Tablet'
    }
];
export const PATIENT_MOCK_NOTIFICATIONS = [
    {
        id: 'notif-01',
        type: 'appointment',
        title: 'Appointment Confirmed',
        message: 'Your consultation with Dr. Sharma is confirmed for 10 Oct at 10:30 AM at Max Hospital.',
        timestamp: '10 Oct 2026, 09:00 AM',
        isRead: false,
        priority: 'high',
        actionUrl: 'appointments'
    },
    {
        id: 'notif-02',
        type: 'diagnostic',
        title: 'Diagnostic Report Ready',
        message: 'Your Complete Blood Count (CBC) report from HealthFirst Diagnostics is now available.',
        timestamp: '12 Oct 2026, 02:45 PM',
        isRead: false,
        priority: 'medium',
        actionUrl: 'diagnostics'
    },
    {
        id: 'notif-03',
        type: 'pharmacy',
        title: 'Prescription Verified by Pharmacy',
        message: 'HealthPlus Pharmacy has verified Rx #201 and prepared your medication package.',
        timestamp: '12 Oct 2026, 04:15 PM',
        isRead: false,
        priority: 'medium',
        actionUrl: 'pharmacy'
    },
    {
        id: 'notif-04',
        type: 'medicine',
        title: 'Medication Refill Notice',
        message: 'Your 90-day supply of Telmisartan 40mg is active. Refill reminders are configured.',
        timestamp: '13 Oct 2026, 10:00 AM',
        isRead: true,
        priority: 'low',
        actionUrl: 'reminders'
    },
    {
        id: 'notif-05',
        type: 'security',
        title: 'Medical Record Access Authorized',
        message: 'Dr. Sharma accessed your cardiology medical history for consultation evaluation.',
        timestamp: '10 Oct 2026, 10:32 AM',
        isRead: true,
        priority: 'low',
        actionUrl: 'access-history'
    },
    {
        id: 'notif-06',
        type: 'wellness',
        title: 'Daily Step Goal Achieved',
        message: 'Congratulations! You reached 8,420 steps today, surpassing your 8,000 steps target.',
        timestamp: 'Yesterday, 08:30 PM',
        isRead: true,
        priority: 'low',
        actionUrl: 'wellness'
    }
];
export const PATIENT_MOCK_WELLNESS_METRICS = [
    {
        id: 'm-hr',
        name: 'Heart Rate',
        value: 72,
        unit: 'BPM',
        status: 'Normal',
        trend: '↑ 3% from yesterday',
        trendDirection: 'stable',
        lastUpdated: '10 mins ago'
    },
    {
        id: 'm-bp',
        name: 'Blood Pressure',
        value: '120/80',
        unit: 'mmHg',
        status: 'Optimal',
        trend: 'Stable across 7 days',
        trendDirection: 'stable',
        lastUpdated: 'Today, 08:30 AM'
    },
    {
        id: 'm-glucose',
        name: 'Fasting Glucose',
        value: 94,
        unit: 'mg/dL',
        status: 'Normal',
        trend: '↓ 2 mg/dL vs last week',
        trendDirection: 'down',
        lastUpdated: 'Yesterday morning'
    },
    {
        id: 'm-sleep',
        name: 'Sleep Duration',
        value: '7h 45m',
        unit: 'hrs',
        status: 'Optimal',
        trend: '88% Deep & REM sleep',
        trendDirection: 'up',
        lastUpdated: 'Last night'
    },
    {
        id: 'm-steps',
        name: 'Daily Steps',
        value: '8,420',
        unit: 'steps',
        status: 'Optimal',
        trend: '105% of 8k goal',
        trendDirection: 'up',
        lastUpdated: 'Just now'
    },
    {
        id: 'm-hydration',
        name: 'Hydration',
        value: '2.4',
        unit: 'Liters',
        status: 'Normal',
        trend: 'Target: 3.0 Liters',
        trendDirection: 'stable',
        lastUpdated: '1 hr ago'
    }
];
export const PATIENT_MOCK_WEARABLE = {
    id: 'wear-01',
    name: 'Fitbit Sense 2 Pro',
    model: 'Model FB-521',
    status: 'Connected',
    battery: '84%',
    lastSynced: 'Today at 04:12 PM',
    metrics: {
        steps: 8420,
        heartRate: 72,
        sleepHours: 7.75,
        calories: 2180
    }
};
export const PATIENT_MOCK_CONSENT = [
    {
        id: 'perm-01',
        providerName: 'Dr. Sharma',
        providerType: 'Doctor',
        grantedDate: '10 Oct 2026',
        expiryDate: '10 Jan 2027',
        accessScopes: {
            medicalHistory: true,
            prescriptions: true,
            labReports: true,
            wellnessData: true
        },
        status: 'Active'
    },
    {
        id: 'perm-02',
        providerName: 'HealthFirst Diagnostics',
        providerType: 'Diagnostic Lab',
        grantedDate: '11 Oct 2026',
        expiryDate: '18 Oct 2026',
        accessScopes: {
            medicalHistory: false,
            prescriptions: true,
            labReports: true,
            wellnessData: false
        },
        status: 'Active'
    },
    {
        id: 'perm-03',
        providerName: 'HealthPlus Pharmacy',
        providerType: 'Pharmacy',
        grantedDate: '12 Oct 2026',
        expiryDate: '15 Oct 2026',
        accessScopes: {
            medicalHistory: false,
            prescriptions: true,
            labReports: false,
            wellnessData: false
        },
        status: 'Active'
    }
];
export const PATIENT_MOCK_AUDIT_LOGS = [
    {
        id: 'log-01',
        accessorName: 'Dr. Sharma',
        accessorRole: 'Cardiologist (Max Hospital)',
        action: 'Viewed Medical History & Past Labs',
        resourceAccessed: 'Unified Health Record & Lipid Profile',
        timestamp: '10 Oct 2026, 10:32 AM',
        purpose: 'Cardiology Consultation Evaluation',
        status: 'Authorized'
    },
    {
        id: 'log-02',
        accessorName: 'HealthFirst Diagnostics',
        accessorRole: 'Diagnostic Laboratory',
        action: 'Uploaded Verified CBC Test Report',
        resourceAccessed: 'Lab Document Vault (rep-301)',
        timestamp: '12 Oct 2026, 02:45 PM',
        purpose: 'Pathology Result Delivery',
        status: 'Authorized'
    },
    {
        id: 'log-03',
        accessorName: 'HealthPlus Pharmacy',
        accessorRole: 'Certified Pharmacist',
        action: 'Verified Digital Prescription',
        resourceAccessed: 'Prescription #rx-201',
        timestamp: '12 Oct 2026, 04:15 PM',
        purpose: 'Drug Dispensing & Adherence Audit',
        status: 'Authorized'
    }
];
export const PATIENT_MOCK_DOCUMENTS = [
    {
        id: 'doc-file-01',
        title: 'Complete Blood Count (CBC) Certified PDF',
        category: 'Medical Reports',
        date: '12 Oct 2026',
        fileSize: '1.4 MB',
        uploader: 'HealthFirst Diagnostics',
        sharingStatus: 'Shared with Doctors',
        fileType: 'pdf'
    },
    {
        id: 'doc-file-02',
        title: 'Comprehensive Lipid Profile Report',
        category: 'Medical Reports',
        date: '29 Sep 2026',
        fileSize: '840 KB',
        uploader: 'HealthFirst Diagnostics',
        sharingStatus: 'Shared with Doctors',
        fileType: 'pdf'
    },
    {
        id: 'doc-file-03',
        title: 'COVID-19 Booster Vaccination Certificate',
        category: 'Vaccination',
        date: '14 Jan 2024',
        fileSize: '420 KB',
        uploader: 'CoWIN / ABHA Vault',
        sharingStatus: 'Shared with Doctors',
        fileType: 'pdf'
    }
];
export const PATIENT_MOCK_SCHEMES = [
    {
        id: 'gov-01',
        name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)',
        shortName: 'PM-JAY',
        category: 'Hospital Care',
        ministry: 'National Health Authority & MoHFW',
        tagline: 'World’s largest government-funded health assurance scheme providing ₹5 Lakh cover per family per year for secondary and tertiary hospitalization.',
        coverageAmount: '₹5,00,000 per family/year',
        eligibility: [
            'Families categorized under SECC 2011 deprivation criteria',
            'Rural households with one room, kacha walls and roof',
            'No earning adult member aged 16 to 59 years',
            'All senior citizens aged 70+ (expanded coverage)'
        ],
        benefits: [
            '100% cashless hospitalization across 29,000+ empanelled public and private hospitals',
            'Covers 1,949 treatment packages including oncology, neurosurgery, and cardiac care',
            'Pre-existing diseases covered from Day 1 without waiting periods',
            'Includes 3 days pre-hospitalization and 15 days post-hospitalization medicine expenses'
        ],
        requiredDocuments: ['Aadhaar Card', 'Ration Card', 'PMJAY Beneficiary Letter / Family ID'],
        officialSource: 'https://pmjay.gov.in',
        status: 'Available',
        applicationProcedure: 'Verify eligibility online or visit your nearest Ayushman Mitra kiosk at any empanelled hospital.'
    },
    {
        id: 'gov-02',
        name: 'Ayushman Bharat Digital Mission (ABHA)',
        shortName: 'ABHA Health Account',
        category: 'Digital Health',
        ministry: 'National Health Authority',
        tagline: 'Create a unique 14-digit ABHA number to store, access, and securely exchange digital health records across registered healthcare facilities nationwide.',
        coverageAmount: 'Universal Digital Healthcare Account',
        eligibility: ['All Indian citizens with a valid Aadhaar number or mobile phone'],
        benefits: [
            'Single digital identity for all lab reports, prescriptions, scans, and discharge summaries',
            'Granular consent-driven data sharing with registered doctors and healthcare providers',
            'Instant Scan-and-Share QR token generation for fast OPD hospital check-ins',
            'Direct interoperability across government and private electronic health records (EHR)'
        ],
        requiredDocuments: ['Aadhaar Card or Driving License', 'Active Mobile Number for OTP'],
        officialSource: 'https://abdm.gov.in',
        status: 'Enrolled',
        applicationProcedure: 'Integrated natively in WIDA! Your ABHA account is verified and linked to your patient profile.'
    },
    {
        id: 'gov-03',
        name: 'Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)',
        shortName: 'Jan Aushadhi',
        category: 'Affordable Medicines',
        ministry: 'Department of Pharmaceuticals',
        tagline: 'Access top-quality generic medicines at 50% to 90% cheaper prices than branded market equivalents through 10,000+ Jan Aushadhi Kendras.',
        coverageAmount: 'Up to 90% discount on 1,965+ generic drugs & 293 surgical items',
        eligibility: ['Open to all Indian citizens without any income, quota, or residency restrictions'],
        benefits: [
            'High-grade WHO-GMP certified generic medicines at heavily subsidized prices',
            'Jan Aushadhi Sugam mobile app for locating nearest outlets and price comparison',
            'Suvidha oxo-biodegradable sanitary napkins available at ₹1 per pad',
            'Affordable cardiac, diabetes, anti-infective, and nutraceutical medications'
        ],
        requiredDocuments: ['Doctor Prescription (Rx) with generic medicine names'],
        officialSource: 'https://janaushadhi.gov.in',
        status: 'Available',
        applicationProcedure: 'Locate a Jan Aushadhi Kendra near you via the portal and purchase prescribed medicines directly.'
    },
    {
        id: 'gov-04',
        name: 'eSanjeevani - National Teleconsultation Service',
        shortName: 'eSanjeevani OPD',
        category: 'Teleconsultation',
        ministry: 'Ministry of Health and Family Welfare & C-DAC',
        tagline: 'Government of India’s free telemedicine portal connecting patients in urban and rural areas directly with certified doctors and medical specialists.',
        coverageAmount: '100% Free Nationwide Online Video Consultations',
        eligibility: ['All Indian citizens residing anywhere in India with internet connectivity'],
        benefits: [
            'Free real-time video audio consultation with government doctors and super-specialists',
            'Verifiable, digitally signed e-Prescription sent directly via SMS and downloadable PDF',
            'Access to dedicated specialized clinics (Cardiology, Psychiatry, Pediatrics, Oncology)',
            'Zero travel expenses or clinic wait times for routine and follow-up medical queries'
        ],
        requiredDocuments: ['Active Mobile Number for OTP', 'Optional ABHA ID', 'Previous Medical Records'],
        officialSource: 'https://esanjeevani.mohfw.gov.in',
        status: 'Available',
        applicationProcedure: 'Register with mobile OTP on the eSanjeevani portal, enter token queue, and consult doctor over video.'
    },
    {
        id: 'gov-05',
        name: 'Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)',
        shortName: 'PMSMA Matritva',
        category: 'Maternal & Child Health',
        ministry: 'Ministry of Health and Family Welfare',
        tagline: 'Assured, comprehensive, and quality antenatal care free of cost to all pregnant women on the 9th day of every calendar month.',
        coverageAmount: '100% Free Antenatal Consultations & Diagnostic Testing',
        eligibility: ['All pregnant women in their 2nd and 3rd trimesters visiting public health facilities'],
        benefits: [
            'Complete health checkup by OB-GYN specialists or medical officers',
            'Free ultrasound sonography, hemoglobin, blood sugar, and urine lab tests',
            'Early identification and color-coded categorization of High-Risk Pregnancies (HRP)',
            'Free distribution of Iron Folic Acid (IFA) and Calcium nutritional supplements'
        ],
        requiredDocuments: ['Mother & Child Protection (MCP) Card', 'Aadhaar Card'],
        officialSource: 'https://pmsma.mohfw.gov.in',
        status: 'Available',
        applicationProcedure: 'Visit your nearest Primary Health Centre (PHC), Community Health Centre (CHC), or district hospital on the 9th of any month.'
    },
    {
        id: 'gov-06',
        name: 'Janani Shishu Suraksha Karyakram (JSSK)',
        shortName: 'JSSK Delivery & Neonatal',
        category: 'Maternal & Child Health',
        ministry: 'National Health Mission (NHM)',
        tagline: 'Completely cashless deliveries, C-sections, and treatment of sick infants up to 1 year in all government health institutions.',
        coverageAmount: 'Zero Out-of-Pocket Expenditure for Mothers & Infants',
        eligibility: ['All pregnant women delivering in public health institutions and sick neonates up to 1 year'],
        benefits: [
            'Free and zero-expense institutional deliveries and caesarean section surgeries',
            'Free drugs, IV fluids, consumables, and blood transfusions during delivery',
            'Free diagnostic lab tests and imaging during entire hospital stay',
            'Free round-trip transport from home to facility, inter-facility transfer, and drop-back home',
            'Free wholesome diet during hospital stay (up to 3 days for normal, 7 days for C-section)'
        ],
        requiredDocuments: ['Identity Proof (Aadhaar or Voter ID)', 'MCP Card'],
        officialSource: 'https://nhm.gov.in',
        status: 'Available',
        applicationProcedure: 'Direct cashless entitlement upon admission at any government civil hospital or community health centre.'
    },
    {
        id: 'gov-07',
        name: 'Ni-kshay Poshan Yojana (NTEP)',
        shortName: 'Ni-kshay TB Support',
        category: 'Chronic Disease & Nutrition',
        ministry: 'Central TB Division, MoHFW',
        tagline: 'Direct Benefit Transfer (DBT) cash nutrition support and 100% free treatment for all notified tuberculosis patients across India.',
        coverageAmount: '₹500 / month Direct Cash Assistance + Free Diagnostics & Meds',
        eligibility: ['All tuberculosis patients notified on the national Ni-kshay digital portal'],
        benefits: [
            'Direct monthly bank transfer of ₹500 for the entire anti-TB treatment duration',
            '100% free daily fixed-dose combination (FDC) anti-tubercular medication kits',
            'Free GeneXpert / CBNAAT and TrueNat rapid molecular drug-resistance diagnostics',
            'Nutritional food basket support from community Ni-kshay Mitra volunteers'
        ],
        requiredDocuments: ['Aadhaar Card', 'Active Bank Account Details (Passbook / Cancelled Cheque)', 'TB Notification Number'],
        officialSource: 'https://nikshay.in',
        status: 'Available',
        applicationProcedure: 'Your treating physician or DOTS centre registers your case on Ni-kshay, linking your bank account for DBT.'
    },
    {
        id: 'gov-08',
        name: 'Rashtriya Bal Swasthya Karyakram (RBSK)',
        shortName: 'RBSK Child Health',
        category: 'Maternal & Child Health',
        ministry: 'Ministry of Health and Family Welfare',
        tagline: 'Comprehensive child health screening and early intervention from birth to 18 years covering the 4Ds (Defects, Diseases, Deficiencies, Delays).',
        coverageAmount: 'Free Screening, Diagnostics, Surgeries, & Assistive Devices',
        eligibility: ['All children from birth to 18 years in rural and urban areas, Anganwadis, and government schools'],
        benefits: [
            'Free screening for 32 health conditions including congenital heart disease and cleft lip',
            'Free tertiary surgeries and medical treatments at specialized partner hospitals',
            'District Early Intervention Centres (DEIC) providing physiotherapy and speech therapy',
            'Free distribution of prescription spectacles, hearing aids, and mobility equipment'
        ],
        requiredDocuments: ['School / Anganwadi Registration or Birth Certificate', 'Aadhaar Card'],
        officialSource: 'https://rbsk.gov.in',
        status: 'Available',
        applicationProcedure: 'Mobile health teams conduct screening at schools and Anganwadis; referral cards given for DEIC centres.'
    },
    {
        id: 'gov-09',
        name: 'Central Government Health Scheme (CGHS)',
        shortName: 'CGHS',
        category: 'Employee & Pensioner Care',
        ministry: 'Ministry of Health and Family Welfare',
        tagline: 'Comprehensive healthcare delivery network serving central government employees, pensioners, and eligible dependents in 80+ cities.',
        coverageAmount: 'Full Cashless Hospitalization & Subsidized Wellness Care',
        eligibility: ['Current central government civil servants, central pensioners, and recognized dependents'],
        benefits: [
            'Cashless inpatient treatment and diagnostic testing at top private empaneled hospitals',
            'Specialized consultations across Allopathy, Ayurveda, Yoga, Unani, Siddha, and Homeopathy',
            'Full reimbursement of emergency treatments underwent in non-empanelled hospitals',
            'Convenient plastic wellness cards with online appointment booking'
        ],
        requiredDocuments: ['CGHS Beneficiary Card', 'Pension Payment Order (PPO) or Employee Pay Slip', 'Aadhaar Card'],
        officialSource: 'https://cghs.nic.in',
        status: 'Available',
        applicationProcedure: 'Apply online via the CGHS beneficiary portal through your central government department or pension office.'
    },
    {
        id: 'gov-10',
        name: 'Employees’ State Insurance Scheme (ESIC)',
        shortName: 'ESIC Social Security',
        category: 'Employee & Pensioner Care',
        ministry: 'Ministry of Labour and Employment',
        tagline: 'Integrated social security system providing complete medical care and financial protection against sickness, maternity, and disablement.',
        coverageAmount: 'Full Medical Care for Family + Cash Wage Benefits',
        eligibility: ['Employees in non-seasonal factories/companies earning up to ₹21,000 per month (₹25,000 for PwD)'],
        benefits: [
            'Comprehensive medical care in ESIC dispensaries, Model Hospitals, and tie-up superspeciality centres',
            'Cash sickness benefit of 70% of average daily wages during certified temporary illness',
            '100% average daily wage maternity benefit for 26 weeks for female employees',
            'Permanent disablement pension and dependent pensions in case of fatal employment injury'
        ],
        requiredDocuments: ['ESIC Pehchan Smart Card / IP Number', 'Aadhaar Card', 'Bank Account Details'],
        officialSource: 'https://www.esic.gov.in',
        status: 'Available',
        applicationProcedure: 'Employer registers employee upon joining; Pehchan card issued for self and dependents on the portal.'
    },
    {
        id: 'gov-11',
        name: 'National Tele Mental Health Programme (Tele-MANAS)',
        shortName: 'Tele-MANAS',
        category: 'Mental Health',
        ministry: 'Ministry of Health and Family Welfare & NIMHANS',
        tagline: '24x7 free national tele-mental health helpline and psychological counseling service across all States & UTs in 20+ regional languages.',
        coverageAmount: '100% Free 24x7 Counseling & Psychiatric Referral',
        eligibility: [
            'Open to all Indian citizens experiencing stress, anxiety, depression, insomnia, or emotional distress',
            'Students dealing with academic pressure, adolescents, working professionals, and senior citizens',
            'Families seeking psychological first-aid or substance abuse de-addiction guidance'
        ],
        benefits: [
            'Immediate round-the-clock connection to certified clinical psychologists and mental health counselors',
            'Toll-free 24x7 access via 14416 or 1800-891-4416 in 20+ scheduled Indian languages',
            'Seamless tiered referral to NIMHANS and regional tertiary mental health institutes',
            'Confidential digital follow-ups, e-prescriptions, and continuous psycho-social support'
        ],
        requiredDocuments: ['No documentation required - Instant, anonymous dial-in service'],
        officialSource: 'https://telemanas.mohfw.gov.in',
        status: 'Available',
        applicationProcedure: 'Dial toll-free 14416 from any phone or visit the official Tele-MANAS portal for web/app consultations.'
    },
    {
        id: 'gov-12',
        name: 'National Policy for Rare Diseases (NPRD) & Rare Diseases Portal',
        shortName: 'NPRD Rare Disease Support',
        category: 'Specialized & Rare Diseases',
        ministry: 'Ministry of Health and Family Welfare',
        tagline: 'Financial support up to ₹50 Lakh per patient for life-saving treatment of rare disorders at designated Centers of Excellence.',
        coverageAmount: 'Up to ₹50,00,000 per patient (One-time grant)',
        eligibility: [
            'Patients diagnosed with rare genetic conditions (e.g., Lysosomal Storage Disorders, Gaucher, Pompe, SCID, MPS, Spinal Muscular Atrophy)',
            'Receiving care at any of the 12 notified National Centers of Excellence (CoEs) including AIIMS New Delhi and PGIMER Chandigarh',
            'Eligible under Group 1, 2, or 3 disorder classification of the National Policy'
        ],
        benefits: [
            'Direct financial assistance up to ₹50 Lakh for high-cost enzyme replacement therapies and bone marrow transplants',
            'National crowdfunding module connecting verified cases with CSR funds and philanthropic donors',
            'Access to specialized clinical genetic panels and multidisciplinary rare disease boards',
            'Free diagnostic confirmatory genomic assays at designated apex genetic laboratories'
        ],
        requiredDocuments: ['Diagnostic Genetic / Biochemical Report from CoE', 'Aadhaar Card', 'Treating Physician Recommendation Form'],
        officialSource: 'https://rarediseases.mohfw.gov.in',
        status: 'Available',
        applicationProcedure: 'Visit the Rare Disease Board at your designated Center of Excellence (CoE); the nodal officer submits your case directly on the portal.'
    },
    {
        id: 'gov-13',
        name: 'Pradhan Mantri National Dialysis Programme (PMNDP)',
        shortName: 'PMNDP Dialysis',
        category: 'Chronic Disease & Critical Care',
        ministry: 'National Health Mission (NHM), MoHFW',
        tagline: '100% free hemodialysis and peritoneal dialysis in all District Hospitals nationwide under One Nation-One Dialysis portability.',
        coverageAmount: '100% Free Dialysis for BPL Patients / Subsidized for Non-BPL',
        eligibility: [
            'All End-Stage Renal Disease (ESRD) and chronic kidney failure patients below poverty line (BPL)',
            'Non-BPL patients eligible for dialysis at government-subsidized rates'
        ],
        benefits: [
            '100% cashless hemodialysis sessions including dialyzers, tubing, and heparin anticoagulation',
            'Support for Automated and Continuous Ambulatory Peritoneal Dialysis (CAPD) for home management',
            'National renal registry integration ensuring seamless inter-district and inter-state treatment continuity',
            'Official PMNDP mobile app to monitor dialysis cycles, lab values, and find the nearest center'
        ],
        requiredDocuments: ['Nephrologist Prescription / ESRD Diagnosis', 'BPL Ration Card or Income Certificate', 'Aadhaar Card', 'ABHA ID'],
        officialSource: 'https://pmndp.mohfw.gov.in',
        status: 'Available',
        applicationProcedure: 'Register with your ABHA ID at the dialysis wing of any District Hospital or through the PMNDP portal.'
    },
    {
        id: 'gov-14',
        name: 'U-WIN Digital Platform & Universal Immunization Programme (UIP)',
        shortName: 'U-WIN Vaccination',
        category: 'Maternal & Child Health',
        ministry: 'Ministry of Health and Family Welfare',
        tagline: 'Universal digital immunization registry and vaccination tracking for pregnant mothers and all children from birth to age 5.',
        coverageAmount: '100% Free Complete National Immunization Schedule',
        eligibility: [
            'All pregnant women across India',
            'All infants and children up to 5 years (and catch-up immunizations up to 16 years)'
        ],
        benefits: [
            '100% free vaccination against 12 preventable diseases (Polio, Measles-Rubella, Hepatitis B, Rotavirus, PCV, DPT, BCG)',
            'Instant digital QR-verifiable vaccination certificates linked directly to child ABHA account',
            'Automated SMS notifications and reminders for upcoming vaccine milestones',
            'Flexible slot booking and nationwide walk-in access across 200,000+ government health session sites'
        ],
        requiredDocuments: ['Parent/Guardian Mobile Number', 'Aadhaar Card of Parent', 'Child Birth Certificate or MCP Card'],
        officialSource: 'https://uwin.mohfw.gov.in',
        status: 'Available',
        applicationProcedure: 'Log in to uwin.mohfw.gov.in using your mobile number to view vaccine schedules and book or track appointments.'
    },
    {
        id: 'gov-15',
        name: 'Rashtriya Arogya Nidhi (RAN) & Health Minister’s Cancer Patient Fund',
        shortName: 'Rashtriya Arogya Nidhi',
        category: 'Hospital Care',
        ministry: 'Ministry of Health and Family Welfare',
        tagline: 'Direct financial aid up to ₹15 Lakh for BPL patients battling life-threatening illnesses and cancer in government superspecialty hospitals.',
        coverageAmount: 'Up to ₹15,00,000 Direct Financial Assistance',
        eligibility: [
            'Patients living Below Poverty Line (BPL) suffering from major life-threatening diseases',
            'Receiving inpatient treatment in any of the 27 designated Government Superspeciality Hospitals / AIIMS',
            'Not covered under PM-JAY or other government health insurance schemes'
        ],
        benefits: [
            'Revolving fund release directly to hospital accounts for oncology, neurosurgery, and organ transplants',
            'Dedicated HMCPF window providing up to ₹5 Lakh exclusively for expensive cancer medications',
            'Emergency fast-track approval through the Medical Superintendent of the treating medical institute',
            'Covers costly medical implants, artificial heart valves, stents, and surgical consumables'
        ],
        requiredDocuments: ['Application Form endorsed by Medical Superintendent', 'BPL Ration Card / Income Certificate', 'Aadhaar Card', 'Histopathology / Diagnostic Reports'],
        officialSource: 'https://mohfw.gov.in/schemes/schemes-programmes/rashtriya-arogya-nidhi',
        status: 'Available',
        applicationProcedure: 'Submit application via the Medical Superintendent / Medical Social Work department of your treating government hospital.'
    },
    {
        id: 'gov-16',
        name: 'National Sickle Cell Anemia Elimination Mission (NSCAEM)',
        shortName: 'Sickle Cell Mission',
        category: 'Chronic Disease & Critical Care',
        ministry: 'Ministry of Health and Family Welfare & Ministry of Tribal Affairs',
        tagline: 'Mission to eliminate Sickle Cell Disease by 2047: universal screening of 7 Crore citizens with color-coded genetic status cards.',
        coverageAmount: '100% Free Screening, Counseling, & Disease Management',
        eligibility: [
            'All individuals aged 0 to 40 years across 17 high-prevalence States (particularly tribal and vulnerable communities)',
            'Couples planning marriage and pregnant women for prenatal genetic trait matching'
        ],
        benefits: [
            'Free point-of-care solubility testing and confirmatory HPLC electrophoresis diagnosis',
            'Issuance of official color-coded Sickle Cell Status Cards (Trait / Disease / Normal) linked to ABHA ID',
            'Lifelong free supply of Hydroxyurea, Folic Acid, and pneumococcal prophylaxis vaccines',
            'Day-care pain management and blood transfusion facilities at Community Health Centres'
        ],
        requiredDocuments: ['Aadhaar Card', 'ABHA Number'],
        officialSource: 'https://sickle.nhm.gov.in',
        status: 'Available',
        applicationProcedure: 'Participate in screening camps organized at local health centers, Anganwadis, or schools; cards are generated online.'
    },
    {
        id: 'gov-17',
        name: 'National Programme for Prevention & Control of NCDs (NP-NCD)',
        shortName: 'NP-NCD Screening',
        category: 'Chronic Disease & Critical Care',
        ministry: 'National Health Systems Resource Centre (NHSRC), MoHFW',
        tagline: 'Universal screening and free lifelong treatment for Hypertension, Diabetes, and Oral, Breast, and Cervical cancers.',
        coverageAmount: '100% Free Universal Health Screening & NCD Medications',
        eligibility: [
            'All Indian citizens aged 30 years and older',
            'Screening conducted at Ayushman Arogya Mandirs (Health & Wellness Centres) and Community Health Centres'
        ],
        benefits: [
            'Annual non-communicable disease risk assessment (CBAC) by frontline ASHA and ANM healthcare workers',
            'Free blood pressure and random blood sugar testing with longitudinal digital tracking on the NCD portal',
            'Free clinical breast examinations, cervical cancer screening (VIA), and oral cancer screening',
            'Lifelong free supply of essential anti-hypertensive, anti-diabetic, and cardiovascular medicines'
        ],
        requiredDocuments: ['Aadhaar Card or Mobile Number', 'ABHA ID'],
        officialSource: 'https://ncd.nhm.gov.in',
        status: 'Available',
        applicationProcedure: 'Visit your nearest Ayushman Arogya Mandir (Health & Wellness Centre) or attend community screening sessions.'
    },
    {
        id: 'gov-18',
        name: 'National Organ and Tissue Transplant Organisation (NOTTO)',
        shortName: 'NOTTO Organ Registry',
        category: 'Critical Care & Organ Donation',
        ministry: 'Directorate General of Health Services (DGHS), MoHFW',
        tagline: 'Apex national registry for deceased & living organ donation, transparent waitlists, and instant donor pledge cards.',
        coverageAmount: 'Universal National Organ Allocation & Donor Registry',
        eligibility: [
            'All citizens aged 18+ who wish to pledge organ and tissue donation after death',
            'Patients needing transplants (Kidney, Liver, Heart, Lungs, Cornea, Pancreas) registered at certified hospitals'
        ],
        benefits: [
            'Instant issuance of official Government of India Organ Donor Pledge Card linked with ABHA ID',
            'Transparent, computerized national waiting list and organ allocation protocol under the THOTA Act',
            '24x7 National Organ Transplant Toll-Free Helpline: 1800-11-4770',
            'Rapid inter-state coordination of green corridors and commercial flights for time-critical organ delivery'
        ],
        requiredDocuments: ['Aadhaar Card', 'Active Mobile Number for OTP', 'Two Next-of-Kin Contact Details'],
        officialSource: 'https://notto.mohfw.gov.in',
        status: 'Available',
        applicationProcedure: 'Pledge your organs online at notto.mohfw.gov.in using Aadhaar OTP to download your official donor card.'
    },
    {
        id: 'gov-19',
        name: 'National Viral Hepatitis Control Program (NVHCP)',
        shortName: 'NVHCP Hepatitis Care',
        category: 'Chronic Disease & Critical Care',
        ministry: 'National Health Mission (NHM), MoHFW',
        tagline: '100% free viral load testing and curative oral therapy for Hepatitis C and lifelong management for Hepatitis B across India.',
        coverageAmount: '100% Free Diagnostics & Curative Treatment Regimens',
        eligibility: [
            'All Indian citizens diagnosed with or suspected of having Hepatitis B or Hepatitis C infections'
        ],
        benefits: [
            'Free molecular testing (quantitative HCV RNA & HBV DNA viral load assays) at designated viral hepatitis labs',
            '100% free 12-week curative Direct-Acting Antiviral (DAA) treatment regimen (Sofosbuvir + Velpatasvir) for Hepatitis C',
            'Lifelong free Tenofovir / Entecavir antiviral therapy for chronic Hepatitis B patients',
            'National toll-free hepatitis guidance helpline: 1800-11-6666'
        ],
        requiredDocuments: ['Photo ID (Aadhaar or Voter ID)', 'Prescription / Screening Report from Government Hospital'],
        officialSource: 'https://nvhcp.mohfw.gov.in',
        status: 'Available',
        applicationProcedure: 'Visit the Model Treatment Centre (MTC) or Treatment Centre (TC) at your district civil hospital or government medical college.'
    },
    {
        id: 'gov-20',
        name: 'Pradhan Mantri Ayushman Bharat Health Infrastructure Mission (PM-ABHIM)',
        shortName: 'PM-ABHIM Infrastructure',
        category: 'Healthcare Infrastructure',
        ministry: 'Ministry of Health and Family Welfare',
        tagline: '₹64,180 Crore national health mission establishing 24x7 Critical Care Hospital Blocks and Integrated Public Health Labs across every district.',
        coverageAmount: '₹64,180 Crore Nationwide Health Infrastructure Outlay',
        eligibility: [
            'Universal public healthcare infrastructure catering to all citizens in rural and urban areas'
        ],
        benefits: [
            'Setting up 50/100-bedded 24x7 Critical Care Hospital Blocks in all 730 districts to ensure emergency ICU preparedness',
            'Establishing Integrated Public Health Labs (IPHL) in all districts for rapid outbreak detection and diagnostic services',
            'Expansion of 17,788 rural and 11,024 urban Ayushman Bharat Health and Wellness Centres',
            'Modern biosafety level labs (BSL-3) and National Institutes for One Health & Virology'
        ],
        requiredDocuments: ['Public Infrastructure Scheme - No individual registration needed'],
        officialSource: 'https://pmabhim.mohfw.gov.in',
        status: 'Available',
        applicationProcedure: 'Citizens can access the newly commissioned Critical Care Blocks and Integrated Diagnostic Labs at their local District Hospitals.'
    }
];
