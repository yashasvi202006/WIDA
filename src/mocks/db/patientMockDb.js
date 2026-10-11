import { PATIENT_MOCK_PROFILE, PATIENT_MOCK_DOCTORS, PATIENT_MOCK_APPOINTMENTS, PATIENT_MOCK_PRESCRIPTIONS, PATIENT_MOCK_TESTS, PATIENT_MOCK_LABS, PATIENT_MOCK_REPORTS, PATIENT_MOCK_PHARMACY_ORDERS, PATIENT_MOCK_NOTIFICATIONS, PATIENT_MOCK_REMINDERS, PATIENT_MOCK_WELLNESS_METRICS, PATIENT_MOCK_WEARABLE, PATIENT_MOCK_CONSENT, PATIENT_MOCK_AUDIT_LOGS, PATIENT_MOCK_DOCUMENTS, PATIENT_MOCK_SCHEMES, PATIENT_MOCK_CARE_JOURNEY } from '../../modules/patient/data/patientMockData';
const DB_STORAGE_KEY = 'wida_msw_patient_db_v1';
const getInitialData = () => ({
    profile: { ...PATIENT_MOCK_PROFILE },
    doctors: [...PATIENT_MOCK_DOCTORS],
    appointments: [...PATIENT_MOCK_APPOINTMENTS],
    prescriptions: [...PATIENT_MOCK_PRESCRIPTIONS],
    tests: [...PATIENT_MOCK_TESTS],
    labs: [...PATIENT_MOCK_LABS],
    reports: [...PATIENT_MOCK_REPORTS],
    labBookings: [
        {
            id: 'book-01',
            testId: 't-01',
            testName: 'Complete Blood Count (CBC)',
            labId: 'lab-01',
            labName: 'HealthFirst Diagnostics, Noida',
            date: 'Tomorrow, 08:30 AM',
            time: '08:30 AM',
            collectionType: 'Home Sample Collection',
            status: 'Booked',
            price: 399
        }
    ],
    pharmacyOrders: [...PATIENT_MOCK_PHARMACY_ORDERS],
    careJourney: [...PATIENT_MOCK_CARE_JOURNEY],
    notifications: [...PATIENT_MOCK_NOTIFICATIONS],
    reminders: [...PATIENT_MOCK_REMINDERS],
    wellnessMetrics: [...PATIENT_MOCK_WELLNESS_METRICS],
    wearable: { ...PATIENT_MOCK_WEARABLE },
    consent: [...PATIENT_MOCK_CONSENT],
    auditLogs: [...PATIENT_MOCK_AUDIT_LOGS],
    documents: [...PATIENT_MOCK_DOCUMENTS],
    schemes: [...PATIENT_MOCK_SCHEMES],
    activeEmergency: null
});
class PatientMockDb {
    data;
    constructor() {
        this.data = this.load();
    }
    load() {
        try {
            const raw = localStorage.getItem(DB_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return {
                    ...parsed,
                    schemes: PATIENT_MOCK_SCHEMES
                };
            }
        }
        catch {
            // fallback to initial
        }
        const initial = getInitialData();
        this.save(initial);
        return initial;
    }
    save(data = this.data) {
        try {
            localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(data));
        }
        catch {
            // storage unavailable or full
        }
    }
    reset() {
        this.data = getInitialData();
        this.save();
    }
    // Profile
    getProfile() {
        return this.data.profile;
    }
    updateProfile(updates) {
        this.data.profile = { ...this.data.profile, ...updates };
        this.save();
        return this.data.profile;
    }
    // Doctors
    getDoctors() {
        return this.data.doctors;
    }
    getDoctorById(id) {
        return this.data.doctors.find((d) => d.id === id);
    }
    // Appointments
    getAppointments() {
        return this.data.appointments;
    }
    bookAppointment(data) {
        const newApt = {
            id: `apt-${Date.now()}`,
            doctorId: data.doctorId,
            doctorName: data.doctorName,
            doctorSpecialization: data.doctorSpecialization,
            doctorAvatar: data.doctorAvatar,
            date: data.date,
            time: data.time,
            type: data.type,
            status: 'Confirmed',
            reason: data.reason || 'General health consultation',
            fee: data.fee,
            location: data.location || (data.type === 'Online' ? 'Telehealth Video Room' : 'Max Hospital OPD Block 3'),
            joinUrl: data.type === 'Online' ? `https://telehealth.wida.health/room/${Date.now()}` : undefined
        };
        this.data.appointments = [newApt, ...this.data.appointments];
        // Auto-create care journey step
        const journeyStep = {
            id: `cj-${Date.now()}`,
            title: `Consultation Confirmed: ${data.doctorName}`,
            subtitle: `${data.doctorSpecialization} • ${data.type} Consultation`,
            date: `${data.date}, ${data.time}`,
            provider: data.doctorName,
            status: 'in_progress',
            icon: 'calendar',
            routeLink: 'appointments'
        };
        this.data.careJourney = [journeyStep, ...this.data.careJourney];
        // Auto-create reminder & notification
        this.addNotification({
            type: 'appointment',
            title: 'Appointment Booked',
            message: `Confirmed with ${data.doctorName} for ${data.date} at ${data.time}.`,
            priority: 'high',
            actionUrl: 'appointments'
        });
        this.addReminder({
            type: 'Appointment',
            title: `Visit: ${data.doctorName}`,
            description: `${data.doctorSpecialization} (${data.type})`,
            date: data.date,
            time: data.time,
            repeat: 'Once',
            status: 'Upcoming',
            priority: 'high'
        });
        this.save();
        return newApt;
    }
    cancelAppointment(id) {
        const target = this.data.appointments.find((a) => a.id === id);
        if (!target)
            return null;
        target.status = 'Cancelled';
        this.addNotification({
            type: 'appointment',
            title: 'Appointment Cancelled',
            message: `Your appointment with ${target.doctorName} on ${target.date} has been cancelled.`,
            priority: 'medium',
            actionUrl: 'appointments'
        });
        this.save();
        return target;
    }
    // Prescriptions
    getPrescriptions() {
        return this.data.prescriptions;
    }
    orderPrescription(rxId) {
        const rx = this.data.prescriptions.find((p) => p.id === rxId);
        if (!rx)
            return null;
        rx.isSentToPharmacy = true;
        // Create Pharmacy Order
        const totalAmount = rx.medicines.reduce((acc, m) => acc + (m.price || 85), 0);
        const newOrder = {
            id: `ord-${Date.now()}`,
            prescriptionId: rx.id,
            pharmacyName: 'HealthPlus 24x7 Express Pharmacy',
            date: 'Today, Just now',
            medicines: rx.medicines.map((m) => ({
                name: m.name,
                quantity: m.duration || '1 Strip / Month',
                price: m.price || 120
            })),
            totalAmount: totalAmount || 340,
            status: 'Prescription received',
            deliveryType: 'Home Delivery',
            estimatedReadyTime: 'Within 90 mins (Priority)'
        };
        this.data.pharmacyOrders = [newOrder, ...this.data.pharmacyOrders];
        this.addNotification({
            type: 'pharmacy',
            title: 'Prescription Transferred to Pharmacy',
            message: `Rx #${rx.id.toUpperCase()} has been forwarded to HealthPlus Pharmacy for home delivery.`,
            priority: 'high',
            actionUrl: 'pharmacy'
        });
        this.save();
        return rx;
    }
    // Diagnostics & Labs
    getTests() {
        return this.data.tests;
    }
    getLabs() {
        return this.data.labs;
    }
    getReports() {
        return this.data.reports;
    }
    getLabBookings() {
        return this.data.labBookings;
    }
    bookLabTest(data) {
        const newBooking = {
            id: `lab-book-${Date.now()}`,
            testId: data.testId,
            testName: data.testName,
            labId: 'lab-01',
            labName: data.labName,
            date: data.date,
            time: data.time,
            collectionType: 'Home Sample Collection',
            status: 'Booked',
            price: data.price
        };
        this.data.labBookings = [newBooking, ...this.data.labBookings];
        this.addNotification({
            type: 'diagnostic',
            title: 'Lab Test Booked',
            message: `Your home collection for ${data.testName} is scheduled for ${data.date}.`,
            priority: 'medium',
            actionUrl: 'diagnostics'
        });
        this.save();
        return newBooking;
    }
    markReportReady(bookingId) {
        const target = this.data.labBookings.find((b) => b.id === bookingId);
        if (!target)
            return null;
        target.status = 'Report Ready';
        this.addNotification({
            type: 'diagnostic',
            title: 'Certified Lab Report Available',
            message: `Your official diagnostic report for ${target.testName} from ${target.labName} is now ready to download.`,
            priority: 'high',
            actionUrl: 'diagnostics'
        });
        this.save();
        return target;
    }
    // Pharmacy
    getPharmacyOrders() {
        return this.data.pharmacyOrders;
    }
    // Care Journey
    getCareJourney() {
        return this.data.careJourney;
    }
    // Wellness
    getWellnessMetrics() {
        return this.data.wellnessMetrics;
    }
    getWearable() {
        return this.data.wearable;
    }
    // Emergency SOS
    getActiveEmergency() {
        return this.data.activeEmergency;
    }
    triggerEmergencySos(location) {
        const req = {
            id: `sos-${Date.now()}`,
            patientId: this.data.profile.id,
            timestamp: 'Just now',
            location,
            status: 'Alert Sent',
            hospitalName: 'Max Super Speciality Trauma Emergency',
            ambulanceNumber: 'DL-01-AMB-9488',
            etaMinutes: 6,
            paramedicContact: '+91 99999 11223',
            criticalDetailsShared: {
                bloodGroup: this.data.profile.bloodGroup,
                allergies: this.data.profile.allergies,
                chronicConditions: this.data.profile.chronicConditions,
                emergencyContact: `${this.data.profile.emergencyContact.name} (${this.data.profile.emergencyContact.phone})`
            }
        };
        this.data.activeEmergency = req;
        this.addNotification({
            type: 'emergency',
            title: 'EMERGENCY SOS DISPATCHED',
            message: 'Trauma ambulance DL-01-AMB-9488 dispatched. Trauma bay prepared.',
            priority: 'urgent',
            actionUrl: 'emergency'
        });
        this.save();
        return req;
    }
    updateEmergencyStatus(id, status) {
        if (this.data.activeEmergency && this.data.activeEmergency.id === id) {
            if (status === 'Deactivated' || status === 'Cancelled' || status === 'Resolved') {
                const cancelled = { ...this.data.activeEmergency, status };
                this.data.activeEmergency = null;
                this.save();
                return cancelled;
            }
            this.data.activeEmergency.status = status;
            this.save();
            return this.data.activeEmergency;
        }
        return null;
    }
    deactivateEmergency(id) {
        if (this.data.activeEmergency && (!id || this.data.activeEmergency.id === id)) {
            this.data.activeEmergency = null;
            this.addNotification({
                type: 'emergency',
                title: 'EMERGENCY SOS DEACTIVATED',
                message: 'The emergency SOS broadcast has been safely stood down and cancelled.',
                priority: 'urgent',
                actionUrl: 'emergency'
            });
            this.save();
            return true;
        }
        return false;
    }
    // Notifications
    getNotifications() {
        return this.data.notifications;
    }
    addNotification(notification) {
        const newNotif = {
            ...notification,
            id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            timestamp: 'Just now',
            isRead: false
        };
        this.data.notifications = [newNotif, ...this.data.notifications];
        this.save();
        return newNotif;
    }
    markNotificationRead(id) {
        const target = this.data.notifications.find((n) => n.id === id);
        if (!target)
            return false;
        target.isRead = true;
        this.save();
        return true;
    }
    markAllNotificationsRead() {
        this.data.notifications.forEach((n) => {
            n.isRead = true;
        });
        this.save();
    }
    deleteNotification(id) {
        const initialLen = this.data.notifications.length;
        this.data.notifications = this.data.notifications.filter((n) => n.id !== id);
        const deleted = this.data.notifications.length !== initialLen;
        if (deleted)
            this.save();
        return deleted;
    }
    // Reminders
    getReminders() {
        return this.data.reminders;
    }
    addReminder(reminder) {
        const newRem = {
            ...reminder,
            id: `rem-${Date.now()}`
        };
        this.data.reminders = [newRem, ...this.data.reminders];
        this.save();
        return newRem;
    }
    updateReminderStatus(id, status) {
        const target = this.data.reminders.find((r) => r.id === id);
        if (!target)
            return null;
        target.status = status;
        this.save();
        return target;
    }
    deleteReminder(id) {
        const initialLen = this.data.reminders.length;
        this.data.reminders = this.data.reminders.filter((r) => r.id !== id);
        const deleted = this.data.reminders.length !== initialLen;
        if (deleted)
            this.save();
        return deleted;
    }
    // Privacy & Consent
    getConsent() {
        return this.data.consent;
    }
    toggleConsent(id) {
        const target = this.data.consent.find((p) => p.id === id);
        if (!target)
            return null;
        target.status = target.status === 'Active' ? 'Revoked' : 'Active';
        this.save();
        return target;
    }
    // Documents Vault
    getDocuments() {
        return this.data.documents;
    }
    uploadDocument(doc) {
        const newDoc = {
            ...doc,
            id: `doc-${Date.now()}`,
            date: 'Today, Just now'
        };
        this.data.documents = [newDoc, ...this.data.documents];
        this.save();
        return newDoc;
    }
    // Schemes
    getSchemes() {
        return this.data.schemes && this.data.schemes.length >= PATIENT_MOCK_SCHEMES.length
            ? this.data.schemes
            : PATIENT_MOCK_SCHEMES;
    }
}
export const patientMockDb = new PatientMockDb();
