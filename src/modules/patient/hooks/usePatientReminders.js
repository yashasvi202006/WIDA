// WIDA Patient Module - Isolated usePatientReminders Hook with Backend API Integration
import { useState, useCallback, useEffect } from 'react';
import { patientReminderService } from '../services/patientReminderService';
import { patientApiService } from '../services/patientApiService';
export function usePatientReminders() {
    const [reminders, setReminders] = useState(() => patientReminderService.getReminders());
    const refresh = useCallback(async () => {
        try {
            const list = await patientApiService.getReminders();
            setReminders(list);
        }
        catch {
            setReminders(patientReminderService.getReminders());
        }
    }, []);
    useEffect(() => {
        refresh();
    }, [refresh]);
    const updateStatus = useCallback(async (id, status) => {
        // Optimistic update
        setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
        patientReminderService.updateReminderStatus(id, status);
        try {
            await patientApiService.updateReminderStatus(id, status);
        }
        catch {
            // Ignored
        }
    }, []);
    const addReminder = useCallback(async (data) => {
        patientReminderService.createReminder(data);
        try {
            await patientApiService.addReminder({
                ...data,
                status: 'Upcoming',
                priority: data.priority || 'medium'
            });
        }
        catch {
            // Fallback already saved locally
        }
        refresh();
    }, [refresh]);
    const deleteReminder = useCallback(async (id) => {
        setReminders((prev) => prev.filter((r) => r.id !== id));
        patientReminderService.deleteReminder(id);
        try {
            await patientApiService.deleteReminder(id);
        }
        catch {
            // Ignored
        }
    }, []);
    return {
        reminders,
        updateStatus,
        addReminder,
        deleteReminder,
        refresh
    };
}
