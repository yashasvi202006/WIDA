// WIDA Patient Module - Unified Backend API Service
import { patientApiClient } from './patientApiClient';
import type {
  PatientProfile,
  PatientDoctor,
  PatientAppointment,
  PatientPrescription,
  PatientDiagnosticTest,
  PatientLab,
  PatientLabReport,
  PatientLabBooking,
  PatientPharmacyOrder,
  PatientCareJourneyStep,
  PatientNotification,
  PatientReminder,
  PatientWellnessMetric,
  PatientWearable,
  PatientConsentPermission,
  PatientMedicalDocument,
  PatientGovernmentScheme,
  PatientEmergencyRequest,
  AppointmentType,
  ReminderStatus
} from '../types/patientTypes';

export interface AuthResponse {
  token: string;
  user: PatientProfile;
  message: string;
}

export interface AIChatResponse {
  id: string;
  sender: 'ai';
  text: string;
  timestamp: string;
  recommendations?: string[];
}

export const patientApiService = {
  // -------------------------------------------------------------
  // System Health & Diagnostics
  // -------------------------------------------------------------
  async checkHealth(): Promise<{ status: string; engine: string; version: string }> {
    return patientApiClient.get('/system/health');
  },

  async resetMockDatabase(): Promise<{ success: boolean; message: string }> {
    return patientApiClient.post('/system/reset-db');
  },

  // -------------------------------------------------------------
  // Authentication
  // -------------------------------------------------------------
  async login(emailOrAbha: string): Promise<AuthResponse> {
    const res = await patientApiClient.post<AuthResponse>('/patient/auth/login', { emailOrAbha });
    if (res.token) {
      localStorage.setItem('wida_patient_jwt', res.token);
    }
    return res;
  },

  async register(profileData: Partial<PatientProfile>): Promise<AuthResponse> {
    const res = await patientApiClient.post<AuthResponse>('/patient/auth/register', profileData);
    if (res.token) {
      localStorage.setItem('wida_patient_jwt', res.token);
    }
    return res;
  },

  async logout(): Promise<void> {
    try {
      await patientApiClient.post('/patient/auth/logout');
    } finally {
      localStorage.removeItem('wida_patient_jwt');
    }
  },

  async getMe(): Promise<{ user: PatientProfile }> {
    return patientApiClient.get('/patient/auth/me');
  },

  // -------------------------------------------------------------
  // Profile
  // -------------------------------------------------------------
  async getProfile(): Promise<PatientProfile> {
    return patientApiClient.get<PatientProfile>('/patient/profile');
  },

  async updateProfile(updates: Partial<PatientProfile>): Promise<PatientProfile> {
    return patientApiClient.put<PatientProfile>('/patient/profile', updates);
  },

  // -------------------------------------------------------------
  // Doctors Directory
  // -------------------------------------------------------------
  async getDoctors(filters?: {
    search?: string;
    system?: string;
    specialty?: string;
  }): Promise<PatientDoctor[]> {
    return patientApiClient.get<PatientDoctor[]>('/patient/doctors', filters);
  },

  async getDoctorById(id: string): Promise<PatientDoctor> {
    return patientApiClient.get<PatientDoctor>(`/patient/doctors/${id}`);
  },

  // -------------------------------------------------------------
  // Appointments
  // -------------------------------------------------------------
  async getAppointments(): Promise<PatientAppointment[]> {
    return patientApiClient.get<PatientAppointment[]>('/patient/appointments');
  },

  async bookAppointment(data: {
    doctorId: string;
    doctorName: string;
    doctorSpecialization: string;
    doctorAvatar: string;
    date: string;
    time: string;
    type: AppointmentType;
    reason: string;
    fee: number;
    location?: string;
  }): Promise<PatientAppointment> {
    return patientApiClient.post<PatientAppointment>('/patient/appointments', data);
  },

  async cancelAppointment(id: string): Promise<PatientAppointment> {
    return patientApiClient.patch<PatientAppointment>(`/patient/appointments/${id}/cancel`);
  },

  // -------------------------------------------------------------
  // Prescriptions & Pharmacy
  // -------------------------------------------------------------
  async getPrescriptions(): Promise<PatientPrescription[]> {
    return patientApiClient.get<PatientPrescription[]>('/patient/prescriptions');
  },

  async orderPrescription(prescriptionId: string): Promise<{
    success: boolean;
    prescription: PatientPrescription;
    orders: PatientPharmacyOrder[];
  }> {
    return patientApiClient.post(`/patient/prescriptions/${prescriptionId}/order`);
  },

  async getPharmacyOrders(): Promise<PatientPharmacyOrder[]> {
    return patientApiClient.get<PatientPharmacyOrder[]>('/patient/pharmacy/orders');
  },

  // -------------------------------------------------------------
  // Diagnostics & Labs
  // -------------------------------------------------------------
  async getDiagnosticTests(): Promise<PatientDiagnosticTest[]> {
    return patientApiClient.get<PatientDiagnosticTest[]>('/patient/diagnostics/tests');
  },

  async getLabs(): Promise<PatientLab[]> {
    return patientApiClient.get<PatientLab[]>('/patient/diagnostics/labs');
  },

  async getReports(): Promise<PatientLabReport[]> {
    return patientApiClient.get<PatientLabReport[]>('/patient/diagnostics/reports');
  },

  async getLabBookings(): Promise<PatientLabBooking[]> {
    return patientApiClient.get<PatientLabBooking[]>('/patient/diagnostics/bookings');
  },

  async bookLabTest(data: {
    testId: string;
    testName: string;
    labName: string;
    date: string;
    time: string;
    price: number;
  }): Promise<PatientLabBooking> {
    return patientApiClient.post<PatientLabBooking>('/patient/diagnostics/book', data);
  },

  async simulateReportReady(bookingId: string): Promise<PatientLabBooking> {
    return patientApiClient.post<PatientLabBooking>(`/patient/diagnostics/bookings/${bookingId}/ready`);
  },

  // -------------------------------------------------------------
  // Care Journey
  // -------------------------------------------------------------
  async getCareJourney(): Promise<PatientCareJourneyStep[]> {
    return patientApiClient.get<PatientCareJourneyStep[]>('/patient/care-journey');
  },

  // -------------------------------------------------------------
  // Wellness & Wearables
  // -------------------------------------------------------------
  async getWellnessMetrics(): Promise<PatientWellnessMetric[]> {
    return patientApiClient.get<PatientWellnessMetric[]>('/patient/wellness/metrics');
  },

  async getWearable(): Promise<PatientWearable> {
    return patientApiClient.get<PatientWearable>('/patient/wellness/wearable');
  },

  // -------------------------------------------------------------
  // Emergency SOS
  // -------------------------------------------------------------
  async getActiveEmergency(): Promise<PatientEmergencyRequest | null> {
    return patientApiClient.get<PatientEmergencyRequest | null>('/patient/emergency/active');
  },

  async triggerEmergencySos(location: string): Promise<PatientEmergencyRequest> {
    return patientApiClient.post<PatientEmergencyRequest>('/patient/emergency/sos', { location });
  },

  async updateEmergencyStatus(
    id: string,
    status: PatientEmergencyRequest['status']
  ): Promise<PatientEmergencyRequest> {
    return patientApiClient.patch<PatientEmergencyRequest>(`/patient/emergency/${id}/status`, { status });
  },

  // -------------------------------------------------------------
  // Notifications
  // -------------------------------------------------------------
  async getNotifications(): Promise<PatientNotification[]> {
    return patientApiClient.get<PatientNotification[]>('/patient/notifications');
  },

  async markNotificationRead(id: string): Promise<void> {
    await patientApiClient.patch(`/patient/notifications/${id}/read`);
  },

  async markAllNotificationsRead(): Promise<void> {
    await patientApiClient.post('/patient/notifications/mark-all-read');
  },

  async deleteNotification(id: string): Promise<void> {
    await patientApiClient.delete(`/patient/notifications/${id}`);
  },

  // -------------------------------------------------------------
  // Reminders
  // -------------------------------------------------------------
  async getReminders(): Promise<PatientReminder[]> {
    return patientApiClient.get<PatientReminder[]>('/patient/reminders');
  },

  async addReminder(reminder: Omit<PatientReminder, 'id'>): Promise<PatientReminder> {
    return patientApiClient.post<PatientReminder>('/patient/reminders', reminder);
  },

  async updateReminderStatus(id: string, status: ReminderStatus): Promise<PatientReminder> {
    return patientApiClient.patch<PatientReminder>(`/patient/reminders/${id}/status`, { status });
  },

  async deleteReminder(id: string): Promise<void> {
    await patientApiClient.delete(`/patient/reminders/${id}`);
  },

  // -------------------------------------------------------------
  // Privacy & Consent
  // -------------------------------------------------------------
  async getConsentPermissions(): Promise<PatientConsentPermission[]> {
    return patientApiClient.get<PatientConsentPermission[]>('/patient/privacy/consent');
  },

  async toggleConsent(id: string): Promise<PatientConsentPermission> {
    return patientApiClient.patch<PatientConsentPermission>(`/patient/privacy/consent/${id}/toggle`);
  },

  // -------------------------------------------------------------
  // Medical Vault
  // -------------------------------------------------------------
  async getDocuments(): Promise<PatientMedicalDocument[]> {
    return patientApiClient.get<PatientMedicalDocument[]>('/patient/vault/documents');
  },

  async uploadDocument(data: Omit<PatientMedicalDocument, 'id' | 'date'>): Promise<PatientMedicalDocument> {
    return patientApiClient.post<PatientMedicalDocument>('/patient/vault/upload', data);
  },

  // -------------------------------------------------------------
  // Government Schemes
  // -------------------------------------------------------------
  async getGovernmentSchemes(): Promise<PatientGovernmentScheme[]> {
    return patientApiClient.get<PatientGovernmentScheme[]>('/patient/schemes');
  },

  // -------------------------------------------------------------
  // AI Clinical Consultation
  // -------------------------------------------------------------
  async askAICare(message: string): Promise<AIChatResponse> {
    return patientApiClient.post<AIChatResponse>('/patient/ai/chat', { message });
  }
};
