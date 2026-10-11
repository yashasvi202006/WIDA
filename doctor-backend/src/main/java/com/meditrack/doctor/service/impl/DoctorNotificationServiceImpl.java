package com.meditrack.doctor.service.impl;

import com.meditrack.doctor.dto.DoctorNotificationDto;
import com.meditrack.doctor.entity.DoctorNotification;
import com.meditrack.doctor.exception.ResourceNotFoundException;
import com.meditrack.doctor.repository.DoctorNotificationRepository;
import com.meditrack.doctor.service.DoctorNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DoctorNotificationServiceImpl implements DoctorNotificationService {

    @Autowired
    private DoctorNotificationRepository notificationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DoctorNotificationDto> getNotifications(Long doctorId, Boolean unreadOnly) {
        List<DoctorNotification> list;
        if (Boolean.TRUE.equals(unreadOnly)) {
            list = notificationRepository.findByDoctorIdAndIsReadFalseOrderByCreatedAtDesc(doctorId);
        } else {
            list = notificationRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
        }

        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Long doctorId, Long notificationId) {
        DoctorNotification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        if (notif.getDoctorId().equals(doctorId)) {
            notif.setIsRead(true);
            notificationRepository.save(notif);
        }
    }

    @Override
    public void markAllAsRead(Long doctorId) {
        List<DoctorNotification> unread = notificationRepository.findByDoctorIdAndIsReadFalseOrderByCreatedAtDesc(doctorId);
        for (DoctorNotification n : unread) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long doctorId) {
        return notificationRepository.countByDoctorIdAndIsReadFalse(doctorId);
    }

    private DoctorNotificationDto mapToDto(DoctorNotification n) {
        DoctorNotificationDto dto = new DoctorNotificationDto();
        dto.setId(n.getId());
        dto.setDoctorId(n.getDoctorId());
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setType(n.getType());
        dto.setReferenceId(n.getReferenceId());
        dto.setIsRead(n.getIsRead());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }
}
