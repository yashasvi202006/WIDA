// WIDA Patient Module - Isolated usePatientReminders Hook with Backend API Integration
import { useState, useCallback, useEffect } from 'react';
import type { PatientReminder, ReminderStatus, ReminderType, RepeatInterval, PriorityLevel } from '../types/patientTypes';
import { patientReminderService } from '../services/patientReminderService';
import { patientApiService } from '../services/patientApiService';

export function usePatientReminders() {
  const [reminders, setReminders] = useState<PatientReminder[]>(() =>
    patientReminderService.getReminders()
  );

  const refresh = useCallback(async () => {
    try {
      const list = await patientApiService.getReminders();
      setReminders(list);
    } catch {
      setReminders(patientReminderService.getReminders());
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateStatus = useCallback(async (id: string, status: ReminderStatus) => {
    // Optimistic update
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    patientReminderService.updateReminderStatus(id, status);

    try {
      await patientApiService.updateReminderStatus(id, status);
    } catch {
      // Ignored
    }
  }, []);

  const addReminder = useCallback(
    async (data: {
      type: ReminderType;
      title: string;
      description: string;
      date: string;
      time: string;
      repeat: RepeatInterval;
      priority?: PriorityLevel;
      dosage?: string;
      instructions?: string;
    }) => {
      patientReminderService.createReminder(data);
      try {
        await patientApiService.addReminder({
          ...data,
          status: 'Upcoming',
          priority: data.priority || 'medium'
        });
      } catch {
        // Fallback already saved locally
      }
      refresh();
    },
    [refresh]
  );

  const deleteReminder = useCallback(async (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    patientReminderService.deleteReminder(id);

    try {
      await patientApiService.deleteReminder(id);
    } catch {
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
