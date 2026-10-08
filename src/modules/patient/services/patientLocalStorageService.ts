// WIDA Patient Module - Isolated LocalStorage Service
import type {
  PatientAppointment,
  PatientPrescription,
  PatientLabBooking,
  PatientPharmacyOrder,
  PatientCareJourneyStep,
  PatientProfile,
  PatientConsentPermission,
  AppointmentType
} from '../types/patientTypes';
import {
  PATIENT_MOCK_APPOINTMENTS,
  PATIENT_MOCK_PRESCRIPTIONS,
  PATIENT_MOCK_CARE_JOURNEY,
  PATIENT_MOCK_PROFILE,
  PATIENT_MOCK_CONSENT,
  PATIENT_MOCK_PHARMACY_ORDERS
} from '../data/patientMockData';
import { patientNotificationService } from './patientNotificationService';
import { patientReminderService } from './patientReminderService';

const APPOINTMENTS_KEY = 'wida_patient_appointments';
const PRESCRIPTIONS_KEY = 'wida_patient_prescriptions';
const LAB_BOOKINGS_KEY = 'wida_patient_lab_bookings';
const PHARMACY_ORDERS_KEY = 'wida_patient_pharmacy_orders';
const CARE_JOURNEY_KEY = 'wida_patient_care_journey';
const PROFILE_KEY = 'wida_patient_profile';
const CONSENT_KEY = 'wida_patient_consent';

export const patientLocalStorageService = {
  // Profile
  getProfile(): PatientProfile {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(PATIENT_MOCK_PROFILE));
      return PATIENT_MOCK_PROFILE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return PATIENT_MOCK_PROFILE;
    }
  },

  updateProfile(updates: Partial<PatientProfile>): PatientProfile {
    const current = this.getProfile();
    const updated = { ...current, ...updates };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    return updated;
  },

  // Appointments
  getAppointments(): PatientAppointment[] {
    const raw = localStorage.getItem(APPOINTMENTS_KEY);
    if (!raw) {
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(PATIENT_MOCK_APPOINTMENTS));
      return PATIENT_MOCK_APPOINTMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return PATIENT_MOCK_APPOINTMENTS;
    }
  },

  bookAppointment(data: {
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
  }): PatientAppointment {
    const list = this.getAppointments();
    const newApt: PatientAppointment = {
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

    const updated = [newApt, ...list];
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));

    // Automated Notification & Reminder
    patientNotificationService.createNotification({
      type: 'appointment',
      title: 'Appointment Confirmed',
      message: `Appointment confirmed with ${data.doctorName} for ${data.date} at ${data.time}.`,
      priority: 'high',
      actionUrl: 'appointments',
      relatedId: newApt.id
    });

    patientReminderService.createReminder({
      type: 'Appointment',
      title: `Consultation with ${data.doctorName}`,
      description: `${data.doctorSpecialization} consultation scheduled for ${data.time}.`,
      date: data.date,
      time: data.time,
      repeat: 'Once',
      priority: 'high',
      relatedEntityId: newApt.id
    });

    return newApt;
  },

  cancelAppointment(id: string): PatientAppointment[] {
    const list = this.getAppointments();
    const target = list.find((a) => a.id === id);
    const updated = list.map((a) => (a.id === id ? { ...a, status: 'Cancelled' as const } : a));
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));

    if (target) {
      patientNotificationService.createNotification({
        type: 'appointment',
        title: 'Appointment Cancelled',
        message: `Your appointment with ${target.doctorName} on ${target.date} has been cancelled.`,
        priority: 'medium',
        actionUrl: 'appointments',
        relatedId: id
      });
    }
    return updated;
  },

  // Prescriptions
  getPrescriptions(): PatientPrescription[] {
    const raw = localStorage.getItem(PRESCRIPTIONS_KEY);
    if (!raw) {
      localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(PATIENT_MOCK_PRESCRIPTIONS));
      return PATIENT_MOCK_PRESCRIPTIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return PATIENT_MOCK_PRESCRIPTIONS;
    }
  },

  orderPrescriptionToPharmacy(prescriptionId: string, pharmacyName = 'HealthPlus Pharmacy'): PatientPrescription[] {
    const list = this.getPrescriptions();
    const updated = list.map((p) =>
      p.id === prescriptionId ? { ...p, isSentToPharmacy: true, dispensedBy: pharmacyName } : p
    );
    localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(updated));

    patientNotificationService.createNotification({
      type: 'pharmacy',
      title: 'Prescription Sent to Pharmacy',
      message: `Prescription #${prescriptionId} has been securely routed to ${pharmacyName} for fulfillment.`,
      priority: 'medium',
      actionUrl: 'pharmacy',
      relatedId: prescriptionId
    });

    return updated;
  },

  // Lab Bookings
  getLabBookings(): PatientLabBooking[] {
    const raw = localStorage.getItem(LAB_BOOKINGS_KEY);
    if (!raw) {
      const initial: PatientLabBooking[] = [
        {
          id: 'bk-501',
          testId: 'test-01',
          testName: 'Complete Blood Count (CBC)',
          labId: 'lab-01',
          labName: 'HealthFirst Diagnostics',
          date: '11 Oct 2026',
          time: '08:30 AM',
          collectionType: 'Home Sample Collection',
          status: 'Report Ready',
          price: 350
        }
      ];
      localStorage.setItem(LAB_BOOKINGS_KEY, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  bookLabTest(booking: {
    testId: string;
    testName: string;
    labId?: string;
    labName: string;
    date: string;
    time: string;
    collectionType?: 'Visit Lab' | 'Home Sample Collection';
    price: number;
    preparationNotes?: string;
  }): PatientLabBooking {
    const list = this.getLabBookings();
    const newBk: PatientLabBooking = {
      id: `bk-${Date.now()}`,
      testId: booking.testId,
      testName: booking.testName,
      labId: booking.labId || 'lab-01',
      labName: booking.labName,
      date: booking.date,
      time: booking.time,
      collectionType: booking.collectionType || 'Home Sample Collection',
      status: 'Booked',
      price: booking.price
    };

    const updated = [newBk, ...list];
    localStorage.setItem(LAB_BOOKINGS_KEY, JSON.stringify(updated));

    patientNotificationService.createNotification({
      type: 'diagnostic',
      title: 'Lab Test Booked',
      message: `${booking.testName} booked with ${booking.labName} for ${booking.date} at ${booking.time}.`,
      priority: 'high',
      actionUrl: 'diagnostics',
      relatedId: newBk.id
    });

    patientReminderService.createReminder({
      type: 'Lab',
      title: `${booking.testName} Sample Collection`,
      description: `Appointment at ${booking.time}. ${booking.preparationNotes || 'Follow fasting/water instructions.'}`,
      date: booking.date,
      time: booking.time,
      repeat: 'Once',
      priority: 'medium',
      relatedEntityId: newBk.id
    });

    return newBk;
  },

  // Pharmacy Orders
  getPharmacyOrders(): PatientPharmacyOrder[] {
    const raw = localStorage.getItem(PHARMACY_ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(PHARMACY_ORDERS_KEY, JSON.stringify(PATIENT_MOCK_PHARMACY_ORDERS));
      return PATIENT_MOCK_PHARMACY_ORDERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return PATIENT_MOCK_PHARMACY_ORDERS;
    }
  },

  // Care Journey
  getCareJourney(): PatientCareJourneyStep[] {
    const raw = localStorage.getItem(CARE_JOURNEY_KEY);
    if (!raw) {
      localStorage.setItem(CARE_JOURNEY_KEY, JSON.stringify(PATIENT_MOCK_CARE_JOURNEY));
      return PATIENT_MOCK_CARE_JOURNEY;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return PATIENT_MOCK_CARE_JOURNEY;
    }
  },

  // Consent
  getConsentPermissions(): PatientConsentPermission[] {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(PATIENT_MOCK_CONSENT));
      return PATIENT_MOCK_CONSENT;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return PATIENT_MOCK_CONSENT;
    }
  },

  toggleConsent(id: string): PatientConsentPermission[] {
    const list = this.getConsentPermissions();
    const updated = list.map((p) =>
      p.id === id ? { ...p, status: p.status === 'Active' ? ('Revoked' as const) : ('Active' as const) } : p
    );
    localStorage.setItem(CONSENT_KEY, JSON.stringify(updated));

    const item = list.find((p) => p.id === id);
    if (item) {
      patientNotificationService.createNotification({
        type: 'security',
        title: 'Consent Permission Updated',
        message: `Access authorization for ${item.providerName} has been ${item.status === 'Active' ? 'revoked' : 'reactivated'}.`,
        priority: 'high',
        actionUrl: 'privacy'
      });
    }

    return updated;
  }
};
