// ========================================================
// WIDA / WIDA - DOCTOR MODULE API & DATA SERVICE
// Full Stack Bridge with Transparent Offline/Online Fallback
// Module Owner: Vanshika Tailor
// ========================================================
import { INITIAL_SPECIALIZATIONS, INITIAL_DOCTORS, INITIAL_AVAILABILITY, INITIAL_PATIENTS, INITIAL_APPOINTMENTS, INITIAL_CONSULTATIONS, INITIAL_PRESCRIPTIONS, INITIAL_TEST_REQUESTS, INITIAL_REPORTS, INITIAL_ACHIEVEMENTS, INITIAL_RATINGS, INITIAL_NOTIFICATIONS, } from './mockData.js';
import { backendLogin, backendRegister } from './doctorBackendClient.js';
const STORAGE_PREFIX = 'wida_doc_';
const DEMO_PASSWORD = 'Doctor@123';
function loadFromStorage(key, defaultVal) {
    try {
        const raw = localStorage.getItem(STORAGE_PREFIX + key);
        return raw ? JSON.parse(raw) : defaultVal;
    }
    catch {
        return defaultVal;
    }
}
function saveToStorage(key, val) {
    try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
    }
    catch {
        // ignore
    }
}
function loadPasswords() {
    return loadFromStorage('passwords', {});
}
function saveLocalPassword(email, password) {
    const map = loadPasswords();
    map[email.trim().toLowerCase()] = password;
    saveToStorage('passwords', map);
}
function normalizeDocEmail(email) {
    return (email || '').trim().toLowerCase();
}
function verifyLocalPassword(email, password) {
    const key = normalizeDocEmail(email);
    const altKey = key.endsWith('@wida.org')
        ? key.replace('@wida.org', '@meditrack.org')
        : key.endsWith('@meditrack.org')
            ? key.replace('@meditrack.org', '@wida.org')
            : key;
    const passwords = loadPasswords();
    const stored = passwords[key] || passwords[altKey];
    if (stored) {
        return stored === password;
    }
    const isKnownDoctor = store.doctors.some((d) => {
        const e = normalizeDocEmail(d.email);
        return e === key || e === altKey;
    });
    return isKnownDoctor && password === DEMO_PASSWORD;
}
class DoctorDataStore {
    doctors = loadFromStorage('doctors', INITIAL_DOCTORS);
    specializations = INITIAL_SPECIALIZATIONS;
    availabilities = loadFromStorage('availabilities', { 1: INITIAL_AVAILABILITY });
    patients = loadFromStorage('patients', INITIAL_PATIENTS);
    appointments = loadFromStorage('appointments', INITIAL_APPOINTMENTS);
    consultations = loadFromStorage('consultations', INITIAL_CONSULTATIONS);
    prescriptions = loadFromStorage('prescriptions', INITIAL_PRESCRIPTIONS);
    testRequests = loadFromStorage('test_requests', INITIAL_TEST_REQUESTS);
    reports = loadFromStorage('reports', INITIAL_REPORTS);
    achievements = loadFromStorage('achievements', INITIAL_ACHIEVEMENTS);
    ratings = loadFromStorage('ratings', INITIAL_RATINGS);
    notifications = loadFromStorage('notifications', INITIAL_NOTIFICATIONS);
    currentDoctorId = loadFromStorage('active_doctor_id', 1);
    save() {
        saveToStorage('doctors', this.doctors);
        saveToStorage('availabilities', this.availabilities);
        saveToStorage('patients', this.patients);
        saveToStorage('appointments', this.appointments);
        saveToStorage('consultations', this.consultations);
        saveToStorage('prescriptions', this.prescriptions);
        saveToStorage('test_requests', this.testRequests);
        saveToStorage('reports', this.reports);
        saveToStorage('achievements', this.achievements);
        saveToStorage('ratings', this.ratings);
        saveToStorage('notifications', this.notifications);
        saveToStorage('active_doctor_id', this.currentDoctorId);
    }
    getCurrentDoctor() {
        return this.doctors.find((d) => d.id === this.currentDoctorId) || this.doctors[0];
    }
    setCurrentDoctor(id) {
        this.currentDoctorId = id;
        this.save();
    }
}
export const store = new DoctorDataStore();
// API Interface Functions
export const doctorApi = {
    // Authentication
    async login(email, password) {
        if (!email.trim()) {
            throw new Error('Please enter your email.');
        }
        if (!password) {
            throw new Error('Please enter your password.');
        }
        const fromBackend = await backendLogin(email, password);
        if (fromBackend) {
            const existing = store.doctors.find((d) => d.id === fromBackend.id);
            if (existing) {
                Object.assign(existing, fromBackend);
            }
            else {
                store.doctors.push(fromBackend);
            }
            store.setCurrentDoctor(fromBackend.id);
            store.save();
            return fromBackend;
        }
        if (!verifyLocalPassword(email, password)) {
            throw new Error('Invalid email or password.');
        }
        const key = normalizeDocEmail(email);
        const altKey = key.endsWith('@wida.org')
            ? key.replace('@wida.org', '@meditrack.org')
            : key.endsWith('@meditrack.org')
                ? key.replace('@meditrack.org', '@wida.org')
                : key;
        const doc = store.doctors.find((d) => {
            const e = normalizeDocEmail(d.email);
            return e === key || e === altKey;
        });
        if (!doc) {
            throw new Error('Invalid email or password.');
        }
        store.setCurrentDoctor(doc.id);
        return doc;
    },
    async register(data) {
        if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
            throw new Error('Password and confirm password do not match.');
        }
        if (data.password) {
            const fromBackend = await backendRegister({
                fullName: data.fullName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                password: data.password,
                confirmPassword: data.confirmPassword ?? data.password,
                gender: data.gender,
                dateOfBirth: data.dateOfBirth,
                medicalRegistrationNumber: data.medicalRegistrationNumber,
                qualification: data.qualification,
                specializationId: data.specializationId,
                specializationName: data.specializationName,
                subSpecialization: data.subSpecialization,
                yearsOfExperience: data.yearsOfExperience,
                hospitalClinicName: data.hospitalClinicName,
                address: data.address,
                city: data.city,
                state: data.state,
                pincode: data.pincode,
                consultationFee: data.consultationFee,
                languagesKnown: data.languagesKnown,
                professionalBio: data.professionalBio,
                profilePhotoUrl: data.profilePhotoUrl,
            });
            if (fromBackend) {
                store.doctors.push(fromBackend);
                store.setCurrentDoctor(fromBackend.id);
                store.save();
                return fromBackend;
            }
        }
        const existing = store.doctors.find((d) => d.email.toLowerCase() === (data.email || '').trim().toLowerCase());
        if (existing) {
            throw new Error('An account with this email address already exists.');
        }
        const regNum = (data.medicalRegistrationNumber || '').trim();
        if (store.doctors.some((d) => d.medicalRegistrationNumber === regNum)) {
            throw new Error('Medical registration number is already registered.');
        }
        const newId = store.doctors.length > 0 ? Math.max(...store.doctors.map((d) => d.id)) + 1 : 1;
        const newDoc = {
            id: newId,
            fullName: data.fullName || 'Dr. Specialist',
            email: data.email || `doc${newId}@wida.org`,
            phoneNumber: data.phoneNumber || '+91 99999 00000',
            gender: data.gender || 'MALE',
            dateOfBirth: data.dateOfBirth,
            medicalRegistrationNumber: regNum,
            qualification: data.qualification || 'MBBS',
            specializationId: data.specializationId || 1,
            specializationName: data.specializationName || 'General Physician',
            subSpecialization: data.subSpecialization || '',
            yearsOfExperience: data.yearsOfExperience || 1,
            hospitalClinicName: data.hospitalClinicName || 'General Health Clinic',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            pincode: data.pincode || '',
            consultationFee: data.consultationFee || 500,
            languagesKnown: data.languagesKnown || 'English, Hindi',
            professionalBio: data.professionalBio || 'Registered healthcare professional.',
            profilePhotoUrl: data.profilePhotoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
            verificationStatus: 'PENDING',
            averageRating: 5.0,
            totalRatings: 0,
            totalPatients: 0,
            isActive: true,
        };
        store.doctors.push(newDoc);
        store.setCurrentDoctor(newDoc.id);
        if (data.password) {
            saveLocalPassword(newDoc.email, data.password);
        }
        // Initial notification
        store.notifications.unshift({
            id: Date.now(),
            doctorId: newDoc.id,
            title: 'Welcome to WIDA',
            message: 'Your registration is complete. Verification status is PENDING review.',
            type: 'SYSTEM',
            referenceId: `REG-${newDoc.id}`,
            isRead: false,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        });
        store.save();
        return newDoc;
    },
    getCurrentDoctor() {
        return store.getCurrentDoctor();
    },
    getAllDoctors() {
        return store.doctors;
    },
    switchDoctor(id) {
        store.setCurrentDoctor(id);
        return store.getCurrentDoctor();
    },
    // Specializations
    getSpecializations() {
        return store.specializations;
    },
    // Profile Management
    updateProfile(doctorId, updates) {
        const doc = store.doctors.find((d) => d.id === doctorId);
        if (!doc)
            throw new Error('Doctor not found');
        if (updates.phoneNumber)
            doc.phoneNumber = updates.phoneNumber;
        if (updates.hospitalClinicName)
            doc.hospitalClinicName = updates.hospitalClinicName;
        if (updates.address !== undefined)
            doc.address = updates.address;
        if (updates.city !== undefined)
            doc.city = updates.city;
        if (updates.state !== undefined)
            doc.state = updates.state;
        if (updates.pincode !== undefined)
            doc.pincode = updates.pincode;
        if (updates.consultationFee !== undefined)
            doc.consultationFee = updates.consultationFee;
        if (updates.languagesKnown !== undefined)
            doc.languagesKnown = updates.languagesKnown;
        if (updates.professionalBio !== undefined)
            doc.professionalBio = updates.professionalBio;
        if (updates.profilePhotoUrl)
            doc.profilePhotoUrl = updates.profilePhotoUrl;
        if (updates.subSpecialization !== undefined)
            doc.subSpecialization = updates.subSpecialization;
        store.save();
        return doc;
    },
    getVerificationStatus(doctorId) {
        const doc = store.doctors.find((d) => d.id === doctorId) || store.getCurrentDoctor();
        let badgeText = 'Verification Pending';
        if (doc.verificationStatus === 'VERIFIED')
            badgeText = 'Verified \u2713';
        else if (doc.verificationStatus === 'UNDER_REVIEW')
            badgeText = 'Verification Under Review';
        else if (doc.verificationStatus === 'REJECTED')
            badgeText = 'Verification Rejected';
        return {
            id: 1,
            doctorId: doc.id,
            status: doc.verificationStatus,
            documentName: 'Medical_Registration_Certificate.pdf',
            documentType: 'National Medical Commission Registration',
            documentUrl: '/docs/reg-cert.pdf',
            submittedAt: '2026-09-01 10:00:00',
            reviewerRemarks: doc.verificationStatus === 'VERIFIED' ? 'Registry credentials cross-verified with NMC directory.' : 'Under evaluation by administrative desk.',
            badgeText,
        };
    },
    submitVerificationDocument(doctorId, docName) {
        void docName;
        const doc = store.doctors.find((d) => d.id === doctorId);
        if (doc) {
            doc.verificationStatus = 'UNDER_REVIEW';
            store.save();
        }
        return this.getVerificationStatus(doctorId);
    },
    // Availability
    getAvailability(doctorId) {
        if (!store.availabilities[doctorId]) {
            store.availabilities[doctorId] = {
                doctorId,
                weeklySchedule: INITIAL_AVAILABILITY.weeklySchedule.map((s) => ({ ...s })),
            };
            store.save();
        }
        return store.availabilities[doctorId];
    },
    saveAvailability(doctorId, avail) {
        store.availabilities[doctorId] = avail;
        store.save();
        return avail;
    },
    // Appointments
    getAppointments(doctorId, filter) {
        let list = store.appointments.filter((a) => a.doctorId === doctorId);
        if (filter?.status) {
            list = list.filter((a) => a.status === filter.status);
        }
        if (filter?.date) {
            list = list.filter((a) => a.appointmentDate === filter.date);
        }
        if (filter?.search) {
            const q = filter.search.toLowerCase();
            list = list.filter((a) => a.patientName.toLowerCase().includes(q) || a.reasonForVisit.toLowerCase().includes(q));
        }
        return list;
    },
    updateAppointmentStatus(appointmentId, status, notes) {
        const apt = store.appointments.find((a) => a.id === appointmentId);
        if (!apt)
            throw new Error('Appointment not found');
        apt.status = status;
        if (notes)
            apt.doctorNotes = notes;
        // Trigger notification
        store.notifications.unshift({
            id: Date.now(),
            doctorId: apt.doctorId,
            title: `Appointment ${status}`,
            message: `Appointment for ${apt.patientName} on ${apt.appointmentDate} was marked as ${status}.`,
            type: status === 'ACCEPTED' ? 'APPOINTMENT_ACCEPTED' : 'APPOINTMENT_CANCELLED',
            referenceId: apt.appointmentNumber,
            isRead: false,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        });
        store.save();
        return apt;
    },
    rescheduleAppointment(appointmentId, newDate, newTime, reason) {
        const apt = store.appointments.find((a) => a.id === appointmentId);
        if (!apt)
            throw new Error('Appointment not found');
        apt.appointmentDate = newDate;
        apt.appointmentTime = newTime;
        apt.status = 'RESCHEDULED';
        if (reason)
            apt.rescheduleReason = reason;
        store.notifications.unshift({
            id: Date.now(),
            doctorId: apt.doctorId,
            title: 'Appointment Rescheduled',
            message: `Appointment for ${apt.patientName} moved to ${newDate} at ${newTime}.`,
            type: 'APPOINTMENT_RESCHEDULED',
            referenceId: apt.appointmentNumber,
            isRead: false,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        });
        store.save();
        return apt;
    },
    // Patients
    getAuthorizedPatients(doctorId, search) {
        const authorizedPatientIds = new Set(store.appointments.filter((a) => a.doctorId === doctorId).map((a) => a.patientId));
        let list = store.patients.filter((p) => authorizedPatientIds.has(p.patientId));
        if (search) {
            const q = search.toLowerCase();
            list = list.filter((p) => p.fullName.toLowerCase().includes(q) || p.patientId.toLowerCase().includes(q));
        }
        return list;
    },
    getPatientMedicalHistory(doctorId, patientId) {
        const isAuthorized = store.appointments.some((a) => a.doctorId === doctorId && a.patientId === patientId);
        if (!isAuthorized) {
            throw new Error('Patient record is not available for your account. Unauthorized access.');
        }
        const patient = store.patients.find((p) => p.patientId === patientId);
        const consultations = store.consultations.filter((c) => c.doctorId === doctorId && c.patientId === patientId);
        const prescriptions = store.prescriptions.filter((p) => p.doctorId === doctorId && p.patientId === patientId);
        const reports = store.reports.filter((r) => r.doctorId === doctorId && r.patientId === patientId);
        const remarks = consultations.map((c) => c.doctorRemarks).filter(Boolean);
        return { patient, consultations, prescriptions, reports, remarks };
    },
    // Consultations
    saveConsultation(doctorId, data, isDraft = false) {
        const doc = store.getCurrentDoctor();
        const newId = store.consultations.length > 0 ? Math.max(...store.consultations.map((c) => c.id)) + 1 : 1;
        const year = new Date().getFullYear();
        const c = {
            id: newId,
            consultationNumber: `CNS-${year}-${Math.floor(100 + Math.random() * 900)}`,
            appointmentId: data.appointmentId,
            doctorId,
            patientId: data.patientId || 'PAT-1001',
            patientName: data.patientName || 'Patient',
            consultationDate: new Date().toISOString().slice(0, 10),
            chiefComplaint: data.chiefComplaint || '',
            symptoms: data.symptoms || '',
            clinicalNotes: data.clinicalNotes || '',
            diagnosis: data.diagnosis || '',
            doctorRemarks: data.doctorRemarks || '',
            followUpDate: data.followUpDate,
            additionalNotes: data.additionalNotes,
            status: isDraft ? 'DRAFT' : 'COMPLETED',
            createdAt: new Date().toISOString(),
        };
        store.consultations.unshift(c);
        // If completed and linked to appointment, mark appointment completed
        if (!isDraft && data.appointmentId) {
            const apt = store.appointments.find((a) => a.id === data.appointmentId);
            if (apt) {
                apt.status = 'COMPLETED';
            }
        }
        doc.totalPatients += 1;
        store.save();
        return c;
    },
    getConsultations(doctorId) {
        return store.consultations.filter((c) => c.doctorId === doctorId);
    },
    // Prescriptions
    createPrescription(doctorId, data) {
        const doc = store.getCurrentDoctor();
        const newId = store.prescriptions.length > 0 ? Math.max(...store.prescriptions.map((p) => p.id)) + 1 : 1;
        const year = new Date().getFullYear();
        const p = {
            id: newId,
            prescriptionNumber: `RX-${year}-${Math.floor(100 + Math.random() * 900)}`,
            consultationId: data.consultationId,
            appointmentId: data.appointmentId,
            doctorId,
            doctorName: doc.fullName,
            doctorSpecialization: doc.specializationName,
            doctorQualification: doc.qualification,
            doctorClinic: doc.hospitalClinicName,
            patientId: data.patientId || 'PAT-1001',
            patientName: data.patientName || 'Patient',
            prescriptionDate: new Date().toISOString().slice(0, 10),
            generalAdvice: data.generalAdvice || 'Take medication as directed.',
            pharmacyStatus: 'PENDING_DISPENSE',
            items: data.items || [],
        };
        store.prescriptions.unshift(p);
        store.notifications.unshift({
            id: Date.now(),
            doctorId,
            title: 'Prescription Created',
            message: `Prescription ${p.prescriptionNumber} for ${p.patientName} created. Ready for pharmacy dispensing.`,
            type: 'PRESCRIPTION_ALERT',
            referenceId: p.prescriptionNumber,
            isRead: false,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        });
        store.save();
        return p;
    },
    getPrescriptions(doctorId) {
        return store.prescriptions.filter((p) => p.doctorId === doctorId);
    },
    // Diagnostic Test Requests
    requestDiagnosticTest(doctorId, data) {
        const doc = store.getCurrentDoctor();
        const newId = store.testRequests.length > 0 ? Math.max(...store.testRequests.map((t) => t.id)) + 1 : 1;
        const year = new Date().getFullYear();
        const tr = {
            id: newId,
            requestNumber: `DTR-${year}-${Math.floor(100 + Math.random() * 900)}`,
            doctorId,
            doctorName: doc.fullName,
            patientId: data.patientId || 'PAT-1001',
            patientName: data.patientName || 'Patient',
            appointmentId: data.appointmentId,
            testName: data.testName || 'Complete Blood Count (CBC)',
            priority: data.priority || 'ROUTINE',
            clinicalReason: data.clinicalReason || 'Routine clinical investigation.',
            specialInstructions: data.specialInstructions,
            status: 'REQUESTED',
            requestedDate: new Date().toISOString().slice(0, 10),
        };
        store.testRequests.unshift(tr);
        store.notifications.unshift({
            id: Date.now(),
            doctorId,
            title: 'Lab Test Requested',
            message: `Diagnostic test '${tr.testName}' for ${tr.patientName} dispatched to laboratory queue.`,
            type: 'SYSTEM',
            referenceId: tr.requestNumber,
            isRead: false,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        });
        store.save();
        return tr;
    },
    getDiagnosticRequests(doctorId) {
        return store.testRequests.filter((t) => t.doctorId === doctorId);
    },
    // Medical Reports
    getMedicalReports(doctorId) {
        return store.reports.filter((r) => r.doctorId === doctorId);
    },
    // Ratings
    getRatings(doctorId) {
        return store.ratings.filter((r) => r.doctorId === doctorId);
    },
    // Achievements
    getAchievements(doctorId) {
        return store.achievements.filter((a) => a.doctorId === doctorId);
    },
    // Notifications
    getNotifications(doctorId) {
        return store.notifications.filter((n) => n.doctorId === doctorId);
    },
    markNotificationAsRead(id) {
        const n = store.notifications.find((notif) => notif.id === id);
        if (n) {
            n.isRead = true;
            store.save();
        }
    },
    markAllNotificationsAsRead(doctorId) {
        store.notifications
            .filter((n) => n.doctorId === doctorId)
            .forEach((n) => (n.isRead = true));
        store.save();
    },
    // Dashboard Aggregator
    getDashboardSummary(doctorId) {
        const doc = store.getCurrentDoctor();
        const today = new Date().toISOString().slice(0, 10);
        const docApts = store.appointments.filter((a) => a.doctorId === doctorId);
        const todaySchedule = docApts.filter((a) => a.appointmentDate === today);
        const pendingRequests = docApts.filter((a) => a.status === 'PENDING');
        const upcomingAppointments = docApts.filter((a) => a.appointmentDate > today);
        const recentConsultations = store.consultations.filter((c) => c.doctorId === doctorId).slice(0, 5);
        const authorizedPatients = this.getAuthorizedPatients(doctorId).slice(0, 5);
        const unreadCount = store.notifications.filter((n) => n.doctorId === doctorId && !n.isRead).length;
        return {
            doctorId: doc.id,
            doctorName: doc.fullName,
            specialization: doc.specializationName,
            qualification: doc.qualification,
            hospitalClinicName: doc.hospitalClinicName,
            verificationStatus: doc.verificationStatus,
            profilePhotoUrl: doc.profilePhotoUrl,
            todayAppointmentsCount: todaySchedule.length,
            pendingRequestsCount: pendingRequests.length,
            completedConsultationsCount: store.consultations.filter((c) => c.doctorId === doctorId).length,
            totalPatientsCount: this.getAuthorizedPatients(doctorId).length,
            averageRating: doc.averageRating,
            totalReviewsCount: doc.totalRatings,
            todaySchedule,
            upcomingAppointments,
            recentPatients: authorizedPatients,
            recentConsultations,
            pendingRequests,
            unreadNotificationsCount: unreadCount,
        };
    },
};
