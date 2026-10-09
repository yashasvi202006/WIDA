package com.meditrack.doctor.controller;

import com.meditrack.doctor.dto.DoctorNotificationDto;
import com.meditrack.doctor.service.DoctorNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/doctor/notifications")
public class DoctorNotificationController {

    @Autowired
    private DoctorNotificationService notificationService;

    @GetMapping("/{doctorId}")
    public ResponseEntity<List<DoctorNotificationDto>> getNotifications(
            @PathVariable Long doctorId,
            @RequestParam(required = false) Boolean unreadOnly) {
        return ResponseEntity.ok(notificationService.getNotifications(doctorId, unreadOnly));
    }

    @PutMapping("/{doctorId}/{notificationId}/read")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable Long doctorId,
            @PathVariable Long notificationId) {
        notificationService.markAsRead(doctorId, notificationId);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Notification marked as read");
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{doctorId}/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(@PathVariable Long doctorId) {
        notificationService.markAllAsRead(doctorId);
        Map<String, String> res = new HashMap<>();
        res.put("message", "All notifications marked as read");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{doctorId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable Long doctorId) {
        Map<String, Long> res = new HashMap<>();
        res.put("unreadCount", notificationService.getUnreadCount(doctorId));
        return ResponseEntity.ok(res);
    }
}
