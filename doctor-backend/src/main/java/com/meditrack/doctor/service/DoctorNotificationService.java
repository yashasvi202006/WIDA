package com.meditrack.doctor.service;

import com.meditrack.doctor.dto.DoctorNotificationDto;
import java.util.List;

public interface DoctorNotificationService {
    List<DoctorNotificationDto> getNotifications(Long doctorId, Boolean unreadOnly);
    void markAsRead(Long doctorId, Long notificationId);
    void markAllAsRead(Long doctorId);
    long getUnreadCount(Long doctorId);
}
