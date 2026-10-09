// WIDA Patient Module - Isolated usePatientNotifications Hook with Backend API Integration
import { useState, useCallback, useEffect } from 'react';
import { patientNotificationService } from '../services/patientNotificationService';
import { patientApiService } from '../services/patientApiService';
export function usePatientNotifications() {
    const [notifications, setNotifications] = useState(() => patientNotificationService.getNotifications());
    const [unreadCount, setUnreadCount] = useState(() => patientNotificationService.getUnreadCount());
    const refresh = useCallback(async () => {
        try {
            const list = await patientApiService.getNotifications();
            setNotifications(list);
            setUnreadCount(list.filter((n) => !n.isRead).length);
        }
        catch {
            const list = patientNotificationService.getNotifications();
            setNotifications(list);
            setUnreadCount(list.filter((n) => !n.isRead).length);
        }
    }, []);
    useEffect(() => {
        refresh();
    }, [refresh]);
    const markAsRead = useCallback(async (id) => {
        // Optimistic update
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
        setUnreadCount((prev) => Math.max(0, prev - 1));
        patientNotificationService.markAsRead(id);
        try {
            await patientApiService.markNotificationRead(id);
        }
        catch {
            // Ignored, state already updated optimistically
        }
    }, []);
    const markAllAsRead = useCallback(async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        patientNotificationService.markAllAsRead();
        try {
            await patientApiService.markAllNotificationsRead();
        }
        catch {
            // Ignored
        }
    }, []);
    const deleteNotification = useCallback(async (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setUnreadCount((prev) => {
            const target = notifications.find((n) => n.id === id);
            return target && !target.isRead ? Math.max(0, prev - 1) : prev;
        });
        patientNotificationService.deleteNotification(id);
        try {
            await patientApiService.deleteNotification(id);
        }
        catch {
            // Ignored
        }
    }, [notifications]);
    const triggerNotification = useCallback((data) => {
        patientNotificationService.createNotification(data);
        refresh();
    }, [refresh]);
    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        triggerNotification,
        refresh
    };
}
