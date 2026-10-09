// WIDA Patient Module - Isolated Notification Service
import type { PatientNotification, PatientNotificationType, PriorityLevel } from '../types/patientTypes';
import { PATIENT_MOCK_NOTIFICATIONS } from '../data/patientMockData';

const STORAGE_KEY = 'wida_patient_module_notifications';

export const patientNotificationService = {
  getNotifications(): PatientNotification[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PATIENT_MOCK_NOTIFICATIONS));
      return PATIENT_MOCK_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return PATIENT_MOCK_NOTIFICATIONS;
    }
  },

  createNotification(data: {
    type: PatientNotificationType;
    title: string;
    message: string;
    priority?: PriorityLevel;
    actionUrl?: string;
    relatedId?: string;
  }): PatientNotification {
    const list = this.getNotifications();
    const newNotif: PatientNotification = {
      id: `pnotif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: data.type,
      title: data.title,
      message: data.message,
      timestamp: 'Just now',
      isRead: false,
      priority: data.priority || 'medium',
      actionUrl: data.actionUrl,
      relatedId: data.relatedId
    };
    const updated = [newNotif, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newNotif;
  },

  markAsRead(id: string): PatientNotification[] {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  markAllAsRead(): PatientNotification[] {
    const list = this.getNotifications();
    const updated = list.map((n) => ({ ...n, isRead: true }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteNotification(id: string): PatientNotification[] {
    const list = this.getNotifications();
    const updated = list.filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  getUnreadCount(): number {
    return this.getNotifications().filter((n) => !n.isRead).length;
  }
};
