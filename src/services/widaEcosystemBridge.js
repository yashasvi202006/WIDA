/**
 * WIDA Integrated Healthcare Ecosystem — Unified Cross-Module Data Bridge
 * Connects Patient, Doctor, Diagnostic Laboratory, and Pharmacy domains with real-time persistence.
 */
import { emailService } from './emailService';

// Initial Seed Data from each domain
const INITIAL_DOCTORS = [
    {
        id: 'doc-001',
        doctorId: 1,
        fullName: 'Dr. Aarav Sharma',
        name: 'Dr. Aarav Sharma',
        email: 'aarav.sharma@wida.org',
        phone: '+91 98765 43210',
        specialization: 'Cardiologist',
        qualification: 'MBBS, MD (Cardiology), FACC',
        experience: 14,
        hospital: 'Apex Heart & Vascular Institute',
        location: 'Ring Road, Sector 5, New Delhi',
        consultationFee: 800,
        rating: 4.9,
        patientsCount: 3840,
        availability: 'Mon - Fri (10:00 AM - 04:30 PM)',
        avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
        availableSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '03:45 PM', '05:00 PM']
    },
    {
        id: 'doc-002',
        doctorId: 2,
        fullName: 'Dr. Ananya Verma',
        name: 'Dr. Ananya Verma',
        email: 'ananya.verma@wida.org',
        phone: '+91 98111 22334',
        specialization: 'Orthopedist',
        qualification: 'MBBS, MS (Orthopedics), MCh',
        experience: 11,
        hospital: 'Apollo Hospitals & Joint Care Centre',
        location: 'South Extension, New Delhi',
        consultationFee: 700,
        rating: 4.8,
        patientsCount: 2450,
        availability: 'Tue - Sat (11:00 AM - 06:00 PM)',
        avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
        availableSlots: ['11:00 AM', '12:30 PM', '03:15 PM', '05:00 PM']
    },
    {
        id: 'doc-003',
        doctorId: 3,
        fullName: 'Dr. Rohan Mehta',
        name: 'Dr. Rohan Mehta',
        email: 'rohan.mehta@wida.org',
        phone: '+91 98222 33445',
        specialization: 'Neurologist',
        qualification: 'MBBS, MD, DM (Neurology)',
        experience: 15,
        hospital: 'Max Super Speciality Hospital',
        location: 'Cyber City, Gurugram',
        consultationFee: 900,
        rating: 4.9,
        patientsCount: 4120,
        availability: 'Mon - Thu (09:30 AM - 03:30 PM)',
        avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
        availableSlots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM']
    },
    {
        id: 'doc-004',
        doctorId: 4,
        fullName: 'Dr. Kavya Singh',
        name: 'Dr. Kavya Singh',
        email: 'kavya.singh@wida.org',
        phone: '+91 98333 44556',
        specialization: 'Dermatologist',
        qualification: 'MBBS, MD (Dermatology), DNB',
        experience: 9,
        hospital: 'Kavya Skin & Aesthetic Clinic',
        location: 'Greater Kailash II, New Delhi',
        consultationFee: 650,
        rating: 4.7,
        patientsCount: 1980,
        availability: 'Mon - Sat (10:00 AM - 05:00 PM)',
        avatarUrl: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&q=80&w=300',
        availableSlots: ['10:15 AM', '12:00 PM', '02:30 PM', '04:15 PM']
    }
];

const INITIAL_LAB_TESTS = [
    {
        id: 't-01',
        testCode: 'CBC-01',
        name: 'Complete Blood Count (CBC with ESR)',
        category: 'Hematology',
        sampleType: 'EDTA Whole Blood',
        tubeColor: 'Lavender',
        turnaroundHours: 4,
        price: 399,
        description: 'Measures RBC, WBC, Platelets, Hemoglobin, Hematocrit, and 5-part differential.',
        labName: 'HealthFirst Diagnostics & Pathology Labs',
        accreditation: 'NABL ISO 15189:2022'
    },
    {
        id: 't-02',
        testCode: 'LIPID-01',
        name: 'Lipid Profile Comprehensive',
        category: 'Biochemistry',
        sampleType: 'Serum',
        tubeColor: 'Gold / SST',
        turnaroundHours: 6,
        price: 699,
        description: 'Complete lipid assessment: Total Cholesterol, HDL, LDL, VLDL, Triglycerides.',
        labName: 'HealthFirst Diagnostics & Pathology Labs',
        accreditation: 'NABL ISO 15189:2022'
    },
    {
        id: 't-03',
        testCode: 'HBA1C-01',
        name: 'HbA1c (Glycated Hemoglobin HPLC)',
        category: 'Biochemistry',
        sampleType: 'EDTA Whole Blood',
        tubeColor: 'Lavender',
        turnaroundHours: 4,
        price: 499,
        description: 'NGSP and IFCC standardized evaluation of 90-day glycemic control.',
        labName: 'HealthFirst Diagnostics & Pathology Labs',
        accreditation: 'NABL ISO 15189:2022'
    },
    {
        id: 't-04',
        testCode: 'THYROID-01',
        name: 'Thyroid Panel Total (T3, T4, TSH Ultra)',
        category: 'Endocrinology',
        sampleType: 'Serum',
        tubeColor: 'Gold / SST',
        turnaroundHours: 8,
        price: 550,
        description: 'Full endocrine evaluation of thyroid gland functioning and pituitary axis.',
        labName: 'HealthFirst Diagnostics & Pathology Labs',
        accreditation: 'NABL ISO 15189:2022'
    },
    {
        id: 't-05',
        testCode: 'LFT-01',
        name: 'Liver Function Test (LFT 11 Parameters)',
        category: 'Biochemistry',
        sampleType: 'Serum',
        tubeColor: 'Gold / SST',
        turnaroundHours: 6,
        price: 750,
        description: 'Measures Bilirubin, SGOT/AST, SGPT/ALT, Alkaline Phosphatase, Protein, Albumin.',
        labName: 'HealthFirst Diagnostics & Pathology Labs',
        accreditation: 'NABL ISO 15189:2022'
    },
    {
        id: 't-06',
        testCode: 'KFT-01',
        name: 'Kidney Function Test (KFT with Electrolytes)',
        category: 'Biochemistry',
        sampleType: 'Serum',
        tubeColor: 'Gold / SST',
        turnaroundHours: 6,
        price: 700,
        description: 'Serum Creatinine, Blood Urea Nitrogen, Uric Acid, Sodium, Potassium, Chloride.',
        labName: 'HealthFirst Diagnostics & Pathology Labs',
        accreditation: 'NABL ISO 15189:2022'
    }
];

const INITIAL_MEDICINES = [
    {
        id: 'med-01',
        name: 'Metformin 500mg SR',
        category: 'Diabetes',
        genericName: 'Metformin Hydrochloride Prolonged Release',
        dosage: '500mg Once or Twice Daily with Meals',
        form: 'Tablet',
        price: 45.00,
        stock: 180,
        manufacturer: 'Cipla Ltd.',
        requiresPrescription: true
    },
    {
        id: 'med-02',
        name: 'Atorvastatin 10mg',
        category: 'Cardiac',
        genericName: 'Atorvastatin Calcium',
        dosage: '10mg Bedtime',
        form: 'Film-coated Tablet',
        price: 110.50,
        stock: 95,
        manufacturer: 'Sun Pharma',
        requiresPrescription: true
    },
    {
        id: 'med-03',
        name: 'Telmisartan 40mg',
        category: 'Cardiac & BP',
        genericName: 'Telmisartan Tablets IP',
        dosage: '40mg Once Daily in Morning',
        form: 'Tablet',
        price: 88.00,
        stock: 120,
        manufacturer: 'Glenmark Pharmaceuticals',
        requiresPrescription: true
    },
    {
        id: 'med-04',
        name: 'Salbutamol Inhaler 100mcg',
        category: 'Respiratory',
        genericName: 'Salbutamol Pressurised Inhalation',
        dosage: '1-2 puffs as required for breathlessness',
        form: 'Inhaler (200 MDI Doses)',
        price: 165.00,
        stock: 45,
        manufacturer: 'Cipla Ltd.',
        requiresPrescription: true
    },
    {
        id: 'med-05',
        name: 'Paracetamol 650mg (Dolo)',
        category: 'Pain & Fever',
        genericName: 'Paracetamol IP 650mg',
        dosage: '1 tablet SOS after food',
        form: 'Tablet',
        price: 32.00,
        stock: 350,
        manufacturer: 'Micro Labs Ltd.',
        requiresPrescription: false
    },
    {
        id: 'med-06',
        name: 'Pantoprazole 40mg',
        category: 'Gastrointestinal',
        genericName: 'Pantoprazole Gastro-resistant Tablets IP',
        dosage: '1 tablet 30 min before breakfast',
        form: 'Tablet',
        price: 78.00,
        stock: 210,
        manufacturer: 'Alkem Laboratories',
        requiresPrescription: true
    }
];

class WidaEcosystemBridge {
    constructor() {
        this.initStorage();
    }

    initStorage() {
        if (typeof window === 'undefined') return;

        if (!localStorage.getItem('wida_shared_doctors')) {
            localStorage.setItem('wida_shared_doctors', JSON.stringify(INITIAL_DOCTORS));
        }

        if (!localStorage.getItem('wida_shared_lab_tests')) {
            localStorage.setItem('wida_shared_lab_tests', JSON.stringify(INITIAL_LAB_TESTS));
        }

        if (!localStorage.getItem('wida_shared_medicines')) {
            localStorage.setItem('wida_shared_medicines', JSON.stringify(INITIAL_MEDICINES));
        }

        if (!localStorage.getItem('wida_shared_appointments')) {
            const defaultAppointments = [
                {
                    id: 'apt-101',
                    patientId: 'pat-001',
                    patientName: 'Yashasvi Saini',
                    patientPhone: '+91 98765 43210',
                    patientAge: 24,
                    patientGender: 'Male',
                    doctorId: 'doc-001',
                    doctorName: 'Dr. Aarav Sharma',
                    specialization: 'Cardiologist',
                    date: '2026-10-12',
                    time: '10:00 AM',
                    type: 'In-Person Consultation',
                    reason: 'Routine Cardiac Health Checkup & ECG Review',
                    status: 'CONFIRMED',
                    fee: 800,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'apt-102',
                    patientId: 'pat-001',
                    patientName: 'Yashasvi Saini',
                    patientPhone: '+91 98765 43210',
                    patientAge: 24,
                    patientGender: 'Male',
                    doctorId: 'doc-002',
                    doctorName: 'Dr. Ananya Verma',
                    specialization: 'Orthopedist',
                    date: '2026-10-14',
                    time: '11:00 AM',
                    type: 'Teleconsultation',
                    reason: 'Post-gym Knee Pain Evaluation',
                    status: 'PENDING',
                    fee: 700,
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('wida_shared_appointments', JSON.stringify(defaultAppointments));
        }

        if (!localStorage.getItem('wida_shared_lab_bookings')) {
            const defaultLabBookings = [
                {
                    id: 'book-101',
                    bookingReference: 'BK-2026-8910',
                    patientId: 'pat-001',
                    patientName: 'Yashasvi Saini',
                    patientPhone: '+91 98765 43210',
                    patientAge: 24,
                    patientGender: 'Male',
                    testId: 't-01',
                    testName: 'Complete Blood Count (CBC with ESR)',
                    labName: 'HealthFirst Diagnostics & Pathology Labs',
                    date: '2026-10-12',
                    time: '08:30 AM',
                    collectionType: 'Lab Visit',
                    status: 'PROCESSING',
                    price: 399,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'book-102',
                    bookingReference: 'BK-2026-8911',
                    patientId: 'pat-001',
                    patientName: 'Yashasvi Saini',
                    patientPhone: '+91 98765 43210',
                    patientAge: 24,
                    patientGender: 'Male',
                    testId: 't-02',
                    testName: 'Lipid Profile Comprehensive',
                    labName: 'HealthFirst Diagnostics & Pathology Labs',
                    date: '2026-10-15',
                    time: '09:00 AM',
                    collectionType: 'Home Sample Collection',
                    status: 'CONFIRMED',
                    price: 699,
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('wida_shared_lab_bookings', JSON.stringify(defaultLabBookings));
        }

        if (!localStorage.getItem('wida_shared_pharmacy_orders')) {
            const defaultOrders = [
                {
                    id: 'ord-101',
                    orderNumber: 'ORD-WIDA-7821',
                    patientId: 'pat-001',
                    patientName: 'Yashasvi Saini',
                    patientPhone: '+91 98765 43210',
                    address: 'B-402, Green Avenue, Sector 62, Noida',
                    medicines: [
                        { name: 'Metformin 500mg SR', qty: 2, price: 45.00 },
                        { name: 'Telmisartan 40mg', qty: 1, price: 88.00 }
                    ],
                    totalAmount: 178.00,
                    status: 'PROCESSING',
                    pharmacyName: 'WIDA Ecosystem Central Hospital & Pharmacy',
                    pharmacist: 'Dr. Yogita Chugh',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('wida_shared_pharmacy_orders', JSON.stringify(defaultOrders));
        }

        if (!localStorage.getItem('wida_shared_prescriptions')) {
            const defaultPrescriptions = [
                {
                    id: 'rx-101',
                    rxNumber: 'RX-2026-4401',
                    patientId: 'pat-001',
                    patientName: 'Yashasvi Saini',
                    doctorName: 'Dr. Aarav Sharma',
                    doctorSpecialization: 'Cardiologist',
                    hospital: 'Apex Heart & Vascular Institute',
                    date: '2026-10-10',
                    diagnosis: 'Stage 1 Hypertension & Metabolic Screening',
                    medicines: [
                        { name: 'Telmisartan 40mg', dosage: '1 tablet once daily in morning', duration: '30 Days' },
                        { name: 'Atorvastatin 10mg', dosage: '1 tablet at bedtime', duration: '30 Days' }
                    ],
                    labInvestigations: ['Lipid Profile Comprehensive', 'Serum Creatinine (KFT)'],
                    status: 'ACTIVE',
                    dispensedStatus: 'PENDING_DISPENSING'
                }
            ];
            localStorage.setItem('wida_shared_prescriptions', JSON.stringify(defaultPrescriptions));
        }
    }

    // Helper to check if a candidate record is genuinely a doctor
    _isAuthenticDoctor(d) {
        if (!d) return false;
        // Strict exclusion of non-doctor roles
        if (d.role && d.role !== 'doctor') return false;
        if (d.abhaId || d.labLicense || d.drugLicense) return false;
        
        const regId = String(d.medicalRegistrationNumber || d.registeredId || d.licenseNumber || '').trim();
        // Check for non-medical registration formats (ABHA IDs start with 91-, Lab with NABL-, Pharmacy with DL- or WIDA-PH-)
        if (regId.startsWith('91-') || regId.startsWith('NABL-') || regId.startsWith('DL-') || regId.startsWith('WIDA-PH-')) {
            return false;
        }

        // Genuine doctor indicators
        if (d.role === 'doctor') return true;
        if (regId.startsWith('MCI-') || regId.startsWith('NMC-') || regId.startsWith('NBE-') || regId.startsWith('DOC-')) {
            return true;
        }
        if (d.id && (String(d.id).startsWith('doc-') || [1, 2, 3, 4].includes(d.id))) {
            return true;
        }
        return false;
    }

    // Helper to normalize doctor record
    _normalizeDoctor(d, forceRegistered = false) {
        if (!this._isAuthenticDoctor(d)) return null;
        const fullName = d.fullName || d.name || 'Dr. Medical Practitioner';
        const docId = d.id ? String(d.id) : ('doc-' + (d.doctorId || Date.now()));
        const spec = d.specialization || d.specializationName || 'General Physician';
        const specLower = spec.toLowerCase();
        const system = d.medicineSystem || (
            specLower.includes('ayur') ? 'Ayurveda' :
            specLower.includes('homeo') ? 'Homeopathy' : 'Allopathy'
        );
        const medReg = d.medicalRegistrationNumber || (String(d.registeredId || '').startsWith('MCI-') || String(d.registeredId || '').startsWith('NMC-') || String(d.registeredId || '').startsWith('DOC-') ? d.registeredId : 'MCI-REG-VALIDATED');
        const isReg = forceRegistered || Boolean(d.isRegistered || (d.role === 'doctor' && d.email && !d.email.endsWith('@wida.health')));

        return {
            id: docId.startsWith('doc-') ? docId : `doc-${docId}`,
            doctorId: d.doctorId || (typeof d.id === 'number' ? d.id : parseInt(String(d.id).replace(/\D/g, ''), 10) || 1),
            name: fullName,
            fullName: fullName,
            email: d.email || '',
            phone: d.phone || d.phoneNumber || '+91 98765 43210',
            specialization: spec,
            specializationName: spec,
            subSpecialization: d.subSpecialization || '',
            qualification: d.qualification || 'MBBS, MD',
            experience: Number(d.experience || d.yearsOfExperience) || 5,
            yearsOfExperience: Number(d.experience || d.yearsOfExperience) || 5,
            hospital: d.hospital || d.hospitalClinicName || 'WIDA Apex Medical Center',
            hospitalClinicName: d.hospitalClinicName || d.hospital || 'WIDA Apex Medical Center',
            location: d.location || d.city || 'Sector 5, New Delhi',
            consultationFee: Number(d.consultationFee) || 750,
            rating: Number(d.rating || d.averageRating) || 5.0,
            patientsCount: Number(d.patientsCount || d.totalPatients) || 0,
            availability: d.availability || 'Mon - Sat (10:00 AM - 05:00 PM)',
            availableSlots: d.availableSlots && d.availableSlots.length ? d.availableSlots : ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'],
            avatarUrl: d.avatarUrl || d.photo || d.profilePhotoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
            photo: d.photo || d.avatarUrl || d.profilePhotoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
            profilePhotoUrl: d.profilePhotoUrl || d.avatarUrl || d.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
            medicineSystem: system,
            medicalRegistrationNumber: medReg,
            verified: true,
            isRegistered: isReg
        };
    }

    registerDoctor(doc) {
        if (!doc) return null;
        const normalized = this._normalizeDoctor(doc, true);
        if (!normalized) return null;
        const docs = this.getDoctors();
        const existingIdx = docs.findIndex(d => 
            (d.email && normalized.email && d.email.toLowerCase() === normalized.email.toLowerCase()) ||
            d.id === normalized.id ||
            (d.medicalRegistrationNumber && normalized.medicalRegistrationNumber && d.medicalRegistrationNumber === normalized.medicalRegistrationNumber)
        );
        if (existingIdx >= 0) {
            docs[existingIdx] = { ...docs[existingIdx], ...normalized };
        } else {
            docs.unshift(normalized);
        }
        localStorage.setItem('wida_shared_doctors', JSON.stringify(docs));
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('wida:doctor-registered', { detail: normalized }));
        }
        return normalized;
    }

    // Doctors — Real-time Multi-Store Sync
    getDoctors() {
        const docMap = new Map();

        // 1. Seed doctors as baseline
        INITIAL_DOCTORS.forEach(d => {
            const norm = this._normalizeDoctor(d, false);
            if (norm) {
                const key = (norm.email || norm.id).toLowerCase();
                docMap.set(key, norm);
            }
        });

        // 2. Load from wida_shared_doctors (and sanitize storage)
        try {
            const rawShared = localStorage.getItem('wida_shared_doctors');
            if (rawShared) {
                const parsed = JSON.parse(rawShared);
                const sanitized = [];
                parsed.forEach(d => {
                    if (this._isAuthenticDoctor(d)) {
                        const norm = this._normalizeDoctor(d, d.isRegistered);
                        if (norm) {
                            const key = (norm.email || norm.id).toLowerCase();
                            docMap.set(key, norm);
                            sanitized.push(norm);
                        }
                    }
                });
                localStorage.setItem('wida_shared_doctors', JSON.stringify(sanitized));
            }
        } catch {}

        // 3. Load from wida_doc_doctors (Doctor module store)
        try {
            const rawDocModule = localStorage.getItem('wida_doc_doctors');
            if (rawDocModule) {
                const parsed = JSON.parse(rawDocModule);
                parsed.forEach(d => {
                    if (this._isAuthenticDoctor(d)) {
                        const isNew = d.id > 4 || (d.email && !d.email.endsWith('@wida.health'));
                        const norm = this._normalizeDoctor(d, isNew);
                        if (norm) {
                            const key = (norm.email || norm.id).toLowerCase();
                            if (!docMap.has(key) || isNew) {
                                docMap.set(key, norm);
                            }
                        }
                    }
                });
            }
        } catch {}

        // 4. Load from wida_registered_users_map (STRICT: only role === 'doctor')
        try {
            const rawReg = localStorage.getItem('wida_registered_users_map');
            if (rawReg) {
                const mapObj = JSON.parse(rawReg);
                Object.values(mapObj).forEach(u => {
                    if (u && u.role === 'doctor') {
                        const norm = this._normalizeDoctor(u, true);
                        if (norm) {
                            const key = (norm.email || norm.id).toLowerCase();
                            docMap.set(key, norm);
                        }
                    }
                });
            }
        } catch {}

        // 5. Load from wida_ecosystem_user (active logged-in user STRICTLY if doctor)
        try {
            const rawUser = localStorage.getItem('wida_ecosystem_user');
            if (rawUser) {
                const u = JSON.parse(rawUser);
                if (u && u.role === 'doctor') {
                    const norm = this._normalizeDoctor(u, true);
                    if (norm) {
                        const key = (norm.email || norm.id).toLowerCase();
                        docMap.set(key, norm);
                    }
                }
            }
        } catch {}

        // Convert to array and prioritize newly registered doctors
        const allDocs = Array.from(docMap.values()).sort((a, b) => {
            if (a.isRegistered && !b.isRegistered) return -1;
            if (!a.isRegistered && b.isRegistered) return 1;
            return 0;
        });

        return allDocs;
    }

    // Diagnostic Lab Tests
    getDiagnosticTests() {
        try {
            const raw = localStorage.getItem('wida_shared_lab_tests');
            return raw ? JSON.parse(raw) : INITIAL_LAB_TESTS;
        } catch {
            return INITIAL_LAB_TESTS;
        }
    }

    // Medicines
    getMedicines() {
        try {
            const raw = localStorage.getItem('wida_shared_medicines');
            return raw ? JSON.parse(raw) : INITIAL_MEDICINES;
        } catch {
            return INITIAL_MEDICINES;
        }
    }

    // Appointments (Patient <-> Doctor)
    getAppointments() {
        try {
            const raw = localStorage.getItem('wida_shared_appointments');
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    bookAppointment(apt) {
        const appointments = this.getAppointments();
        const aptId = apt.id || ('apt-' + Date.now());
        const newApt = {
            id: aptId,
            appointmentNumber: apt.appointmentNumber || ('APT-' + String(aptId).slice(-4)),
            status: apt.status || 'PENDING',
            createdAt: new Date().toISOString(),
            ...apt
        };
        appointments.unshift(newApt);
        localStorage.setItem('wida_shared_appointments', JSON.stringify(appointments));

        // Sync with doctor appointments in localStorage
        try {
            const rawDocApts = JSON.parse(localStorage.getItem('wida_doc_appointments') || '[]');
            const parsedDocId = typeof newApt.doctorId === 'number' ? newApt.doctorId : (parseInt(String(newApt.doctorId).replace(/\D/g, ''), 10) || 1);
            if (!rawDocApts.some(a => a.id === newApt.id || a.appointmentNumber === newApt.appointmentNumber)) {
                rawDocApts.unshift({
                    id: newApt.id,
                    appointmentNumber: newApt.appointmentNumber,
                    doctorId: parsedDocId,
                    patientId: newApt.patientId || 'PID-2026-901',
                    patientName: newApt.patientName || 'Yashasvi Saini',
                    patientAge: newApt.patientAge || 24,
                    patientGender: newApt.patientGender || 'MALE',
                    patientPhone: newApt.patientPhone || '+91 98765 43210',
                    appointmentDate: newApt.date || newApt.appointmentDate || new Date().toISOString().slice(0, 10),
                    appointmentTime: newApt.time || newApt.appointmentTime || '10:30 AM',
                    timeSlot: newApt.time || newApt.appointmentTime || '10:30 AM',
                    status: newApt.status || 'PENDING',
                    consultationType: (newApt.type === 'Online' || newApt.consultType === 'Online' || newApt.consultationType === 'TELECONSULT') ? 'TELECONSULT' : 'IN_PERSON',
                    reasonForVisit: newApt.reason || newApt.reasonForVisit || 'Continuity Healthcare Consultation',
                    tokenNumber: 'TK-' + String(newApt.id).slice(-2)
                });
                localStorage.setItem('wida_doc_appointments', JSON.stringify(rawDocApts));
            }
        } catch {}

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('wida:appointment-booked', { detail: newApt }));
        }
        return newApt;
    }

    updateAppointmentStatus(id, newStatus, meta = {}) {
        const appointments = this.getAppointments();
        const idx = appointments.findIndex(a => a.id === id || a.appointmentNumber === id);
        let updated = null;
        if (idx !== -1) {
            appointments[idx].status = newStatus;
            appointments[idx].updatedAt = new Date().toISOString();
            if (meta.doctorNotes) appointments[idx].doctorNotes = meta.doctorNotes;
            localStorage.setItem('wida_shared_appointments', JSON.stringify(appointments));
            updated = appointments[idx];
        }

        // Also update doctor store
        try {
            const docApts = JSON.parse(localStorage.getItem('wida_doc_appointments') || '[]');
            const dIdx = docApts.findIndex(a => a.id === id || a.appointmentNumber === id);
            if (dIdx !== -1) {
                docApts[dIdx].status = newStatus;
                localStorage.setItem('wida_doc_appointments', JSON.stringify(docApts));
            }
        } catch {}

        // Also update patient store
        try {
            const pApts = JSON.parse(localStorage.getItem('wida_patient_appointments') || '[]');
            const pIdx = pApts.findIndex(a => a.id === id || a.id === String(id));
            if (pIdx !== -1) {
                pApts[pIdx].status = newStatus === 'ACCEPTED' ? 'Confirmed' : newStatus === 'REJECTED' ? 'Cancelled' : newStatus;
                localStorage.setItem('wida_patient_appointments', JSON.stringify(pApts));
            }
        } catch {}

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('wida:appointment-status-updated', { detail: { id, status: newStatus } }));
        }
        return updated;
    }

    // Lab Bookings (Patient <-> Lab)
    getLabBookings() {
        try {
            const raw = localStorage.getItem('wida_shared_lab_bookings');
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    bookLabTest(booking) {
        const bookings = this.getLabBookings();
        const newBooking = {
            id: 'book-' + Date.now(),
            bookingReference: 'BK-2026-' + Math.floor(1000 + Math.random() * 9000),
            status: 'CONFIRMED',
            labName: 'HealthFirst Diagnostics & Pathology Labs',
            createdAt: new Date().toISOString(),
            ...booking
        };
        bookings.unshift(newBooking);
        localStorage.setItem('wida_shared_lab_bookings', JSON.stringify(bookings));
        return newBooking;
    }

    // Pharmacy Orders (Patient <-> Pharmacy)
    getPharmacyOrders() {
        try {
            const raw = localStorage.getItem('wida_shared_pharmacy_orders');
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    createPharmacyOrder(order) {
        const orders = this.getPharmacyOrders();
        const newOrder = {
            id: 'ord-' + Date.now(),
            orderNumber: 'ORD-WIDA-' + Math.floor(1000 + Math.random() * 9000),
            status: 'RECEIVED',
            pharmacyName: 'WIDA Ecosystem Central Hospital & Pharmacy',
            createdAt: new Date().toISOString(),
            ...order
        };
        orders.unshift(newOrder);
        localStorage.setItem('wida_shared_pharmacy_orders', JSON.stringify(orders));
        return newOrder;
    }

    // Prescriptions (Doctor <-> Patient <-> Pharmacy)
    getPrescriptions() {
        try {
            const raw = localStorage.getItem('wida_shared_prescriptions');
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    addPrescription(rx) {
        const prescriptions = this.getPrescriptions();
        const newRx = {
            id: 'rx-' + Date.now(),
            rxNumber: 'RX-2026-' + Math.floor(1000 + Math.random() * 9000),
            date: new Date().toISOString().split('T')[0],
            status: 'ACTIVE',
            dispensedStatus: 'PENDING_DISPENSING',
            ...rx
        };
        prescriptions.unshift(newRx);
        localStorage.setItem('wida_shared_prescriptions', JSON.stringify(prescriptions));
        return newRx;
    }

    // Current Unified Auth Session
    getCurrentUser() {
        try {
            const raw = localStorage.getItem('wida_ecosystem_user');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    setCurrentUser(user, role) {
        if (user) {
            localStorage.setItem('wida_ecosystem_user', JSON.stringify({ ...user, role }));
            localStorage.setItem('wida_active_portal', role);
        } else {
            localStorage.removeItem('wida_ecosystem_user');
        }
    }

    logout() {
        localStorage.removeItem('wida_ecosystem_user');
    }

    switchPortal(portalName) {
        if (!portalName) return;
        localStorage.setItem('wida_active_portal', portalName);
        try {
            const url = new URL(window.location.href);
            url.searchParams.set('portal', portalName);
            url.searchParams.delete('login');
            window.history.replaceState({}, '', url.toString());
        } catch {}
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('wida:switch-portal', { detail: { portal: portalName } }));
        }
    }
}

export const widaBridge = new WidaEcosystemBridge();
