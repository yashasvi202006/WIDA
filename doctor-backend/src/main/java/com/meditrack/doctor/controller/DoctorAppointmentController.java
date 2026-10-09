package com.meditrack.doctor.controller;

import com.meditrack.doctor.dto.AppointmentDto;
import com.meditrack.doctor.dto.AppointmentRescheduleRequest;
import com.meditrack.doctor.dto.AppointmentStatusUpdateRequest;
import com.meditrack.doctor.enums.AppointmentStatus;
import com.meditrack.doctor.service.DoctorAppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/doctor/appointments")
public class DoctorAppointmentController {

    @Autowired
    private DoctorAppointmentService appointmentService;

    @GetMapping("/{doctorId}")
    public ResponseEntity<List<AppointmentDto>> getAppointments(
            @PathVariable Long doctorId,
            @RequestParam(required = false) AppointmentStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(appointmentService.getDoctorAppointments(doctorId, status, date, search));
    }

    @GetMapping("/{doctorId}/{appointmentId}")
    public ResponseEntity<AppointmentDto> getAppointmentById(
            @PathVariable Long doctorId,
            @PathVariable Long appointmentId) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(doctorId, appointmentId));
    }

    @PutMapping("/{doctorId}/{appointmentId}/status")
    public ResponseEntity<AppointmentDto> updateStatus(
            @PathVariable Long doctorId,
            @PathVariable Long appointmentId,
            @Valid @RequestBody AppointmentStatusUpdateRequest request) {
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(doctorId, appointmentId, request));
    }

    @PutMapping("/{doctorId}/{appointmentId}/reschedule")
    public ResponseEntity<AppointmentDto> reschedule(
            @PathVariable Long doctorId,
            @PathVariable Long appointmentId,
            @Valid @RequestBody AppointmentRescheduleRequest request) {
        return ResponseEntity.ok(appointmentService.rescheduleAppointment(doctorId, appointmentId, request));
    }

    @PostMapping("/{doctorId}/{appointmentId}/start-consultation")
    public ResponseEntity<AppointmentDto> startConsultation(
            @PathVariable Long doctorId,
            @PathVariable Long appointmentId) {
        return ResponseEntity.ok(appointmentService.startConsultation(doctorId, appointmentId));
    }
}
