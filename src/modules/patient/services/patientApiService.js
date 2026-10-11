// WIDA Patient Module - Unified Backend API Service
import { patientApiClient } from './patientApiClient';
export const patientApiService = {
    // -------------------------------------------------------------
    // System Health & Diagnostics
    // -------------------------------------------------------------
    async checkHealth() {
        return patientApiClient.get('/system/health');
    },
    async resetMockDatabase() {
        return patientApiClient.post('/system/reset-db');
    },
    // -------------------------------------------------------------
    // Authentication
    // -------------------------------------------------------------
    async login(emailOrAbha) {
        const res = await patientApiClient.post('/patient/auth/login', { emailOrAbha });
        if (res.token) {
            localStorage.setItem('wida_patient_jwt', res.token);
        }
        return res;
    },
    async register(profileData) {
        const res = await patientApiClient.post('/patient/auth/register', profileData);
        if (res.token) {
            localStorage.setItem('wida_patient_jwt', res.token);
        }
        return res;
    },
    async logout() {
        try {
            await patientApiClient.post('/patient/auth/logout');
        }
        finally {
            localStorage.removeItem('wida_patient_jwt');
        }
    },
    async getMe() {
        return patientApiClient.get('/patient/auth/me');
    },
    // -------------------------------------------------------------
    // Profile
    // -------------------------------------------------------------
    async getProfile() {
        return patientApiClient.get('/patient/profile');
    },
    async updateProfile(updates) {
        return patientApiClient.put('/patient/profile', updates);
    },
    // -------------------------------------------------------------
    // Doctors Directory
    // -------------------------------------------------------------
    async getDoctors(filters) {
        return patientApiClient.get('/patient/doctors', filters);
    },
    async getDoctorById(id) {
        return patientApiClient.get(`/patient/doctors/${id}`);
    },
    // -------------------------------------------------------------
    // Appointments
    // -------------------------------------------------------------
    async getAppointments() {
        return patientApiClient.get('/patient/appointments');
    },
    async bookAppointment(data) {
        return patientApiClient.post('/patient/appointments', data);
    },
    async cancelAppointment(id) {
        return patientApiClient.patch(`/patient/appointments/${id}/cancel`);
    },
    // -------------------------------------------------------------
    // Prescriptions & Pharmacy
    // -------------------------------------------------------------
    async getPrescriptions() {
        return patientApiClient.get('/patient/prescriptions');
    },
    async orderPrescription(prescriptionId) {
        return patientApiClient.post(`/patient/prescriptions/${prescriptionId}/order`);
    },
    async getPharmacyOrders() {
        return patientApiClient.get('/patient/pharmacy/orders');
    },
    // -------------------------------------------------------------
    // Diagnostics & Labs
    // -------------------------------------------------------------
    async getDiagnosticTests() {
        return patientApiClient.get('/patient/diagnostics/tests');
    },
    async getLabs() {
        return patientApiClient.get('/patient/diagnostics/labs');
    },
    async getReports() {
        return patientApiClient.get('/patient/diagnostics/reports');
    },
    async getLabBookings() {
        return patientApiClient.get('/patient/diagnostics/bookings');
    },
    async bookLabTest(data) {
        return patientApiClient.post('/patient/diagnostics/book', data);
    },
    async simulateReportReady(bookingId) {
        return patientApiClient.post(`/patient/diagnostics/bookings/${bookingId}/ready`);
    },
    // -------------------------------------------------------------
    // Care Journey
    // -------------------------------------------------------------
    async getCareJourney() {
        return patientApiClient.get('/patient/care-journey');
    },
    // -------------------------------------------------------------
    // Wellness & Wearables
    // -------------------------------------------------------------
    async getWellnessMetrics() {
        return patientApiClient.get('/patient/wellness/metrics');
    },
    async getWearable() {
        return patientApiClient.get('/patient/wellness/wearable');
    },
    // -------------------------------------------------------------
    // Emergency SOS
    // -------------------------------------------------------------
    async getActiveEmergency() {
        return patientApiClient.get('/patient/emergency/active');
    },
    async triggerEmergencySos(location) {
        return patientApiClient.post('/patient/emergency/sos', { location });
    },
    async updateEmergencyStatus(id, status) {
        return patientApiClient.patch(`/patient/emergency/${id}/status`, { status });
    },
    async deactivateEmergency(id) {
        return patientApiClient.post(`/patient/emergency/${id}/deactivate`, {});
    },
    // -------------------------------------------------------------
    // Notifications
    // -------------------------------------------------------------
    async getNotifications() {
        return patientApiClient.get('/patient/notifications');
    },
    async markNotificationRead(id) {
        await patientApiClient.patch(`/patient/notifications/${id}/read`);
    },
    async markAllNotificationsRead() {
        await patientApiClient.post('/patient/notifications/mark-all-read');
    },
    async deleteNotification(id) {
        await patientApiClient.delete(`/patient/notifications/${id}`);
    },
    // -------------------------------------------------------------
    // Reminders
    // -------------------------------------------------------------
    async getReminders() {
        return patientApiClient.get('/patient/reminders');
    },
    async addReminder(reminder) {
        return patientApiClient.post('/patient/reminders', reminder);
    },
    async updateReminderStatus(id, status) {
        return patientApiClient.patch(`/patient/reminders/${id}/status`, { status });
    },
    async deleteReminder(id) {
        await patientApiClient.delete(`/patient/reminders/${id}`);
    },
    // -------------------------------------------------------------
    // Privacy & Consent
    // -------------------------------------------------------------
    async getConsentPermissions() {
        return patientApiClient.get('/patient/privacy/consent');
    },
    async toggleConsent(id) {
        return patientApiClient.patch(`/patient/privacy/consent/${id}/toggle`);
    },
    // -------------------------------------------------------------
    // Medical Vault
    // -------------------------------------------------------------
    async getDocuments() {
        return patientApiClient.get('/patient/vault/documents');
    },
    async uploadDocument(data) {
        return patientApiClient.post('/patient/vault/upload', data);
    },
    // -------------------------------------------------------------
    // Government Schemes
    // -------------------------------------------------------------
    async getGovernmentSchemes() {
        return patientApiClient.get('/patient/schemes');
    },
    // -------------------------------------------------------------
    // AI Clinical Consultation
    // -------------------------------------------------------------
    async askAICare(message) {
        return patientApiClient.post('/patient/ai/chat', { message });
    }
};
