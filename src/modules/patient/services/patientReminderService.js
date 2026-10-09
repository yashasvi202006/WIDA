import { PATIENT_MOCK_REMINDERS } from '../data/patientMockData';
const STORAGE_KEY = 'wida_patient_module_reminders';
export const patientReminderService = {
    getReminders() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(PATIENT_MOCK_REMINDERS));
            return PATIENT_MOCK_REMINDERS;
        }
        try {
            return JSON.parse(raw);
        }
        catch {
            return PATIENT_MOCK_REMINDERS;
        }
    },
    createReminder(data) {
        const list = this.getReminders();
        const newReminder = {
            id: `prem-${Date.now()}`,
            type: data.type,
            title: data.title,
            description: data.description,
            date: data.date,
            time: data.time,
            repeat: data.repeat,
            status: 'Upcoming',
            priority: data.priority || 'medium',
            dosage: data.dosage,
            instructions: data.instructions,
            relatedEntityId: data.relatedEntityId
        };
        const updated = [newReminder, ...list];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return newReminder;
    },
    updateReminderStatus(id, status) {
        const list = this.getReminders();
        const updated = list.map((r) => (r.id === id ? { ...r, status } : r));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    },
    deleteReminder(id) {
        const list = this.getReminders();
        const updated = list.filter((r) => r.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    }
};
