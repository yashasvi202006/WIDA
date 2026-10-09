package com.meditrack.doctor.service.impl;

import com.meditrack.doctor.dto.AppointmentDto;
import com.meditrack.doctor.dto.AppointmentRescheduleRequest;
import com.meditrack.doctor.dto.AppointmentStatusUpdateRequest;
import com.meditrack.doctor.entity.Appointment;
import com.meditrack.doctor.entity.DoctorNotification;
import com.meditrack.doctor.enums.AppointmentStatus;
import com.meditrack.doctor.enums.NotificationType;
import com.meditrack.doctor.exception.ResourceNotFoundException;
import com.meditrack.doctor.exception.UnauthorizedAccessException;
import com.meditrack.doctor.repository.AppointmentRepository;
import com.meditrack.doctor.repository.DoctorNotificationRepository;
import com.meditrack.doctor.service.DoctorAppointmentService;
import com.meditrack.doctor.validation.AppointmentValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DoctorAppointmentServiceImpl implements DoctorAppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorNotificationRepository notificationRepository;

    @Autowired
    private AppointmentValidator appointmentValidator;

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentDto> getDoctorAppointments(Long doctorId, AppointmentStatus status, LocalDate date, String searchQuery) {
        List<Appointment> list;

        if (searchQuery != null && !searchQuery.trim().isEmpty()) {
            list = appointmentRepository.findByDoctorIdAndPatientNameContainingIgnoreCaseOrderByAppointmentDateDesc(doctorId, searchQuery.trim());
        } else if (date != null) {
            list = appointmentRepository.findByDoctorIdAndAppointmentDateOrderByAppointmentTimeAsc(doctorId, date);
        } else if (status != null) {
            list = appointmentRepository.findByDoctorIdAndStatusOrderByAppointmentDateAscAppointmentTimeAsc(doctorId, status);
        } else {
            list = appointmentRepository.findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(doctorId);
        }

        // Secondary in-memory filtering if multiple filters are supplied
        if (status != null && (date != null || (searchQuery != null && !searchQuery.trim().isEmpty()))) {
            list = list.stream().filter(a -> a.getStatus() == status).collect(Collectors.toList());
        }

        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentDto getAppointmentById(Long doctorId, Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));

        if (!appointment.getDoctorId().equals(doctorId)) {
            throw new UnauthorizedAccessException("You are not authorized to view this appointment.");
        }

        return mapToDto(appointment);
    }

    @Override
    public AppointmentDto updateAppointmentStatus(Long doctorId, Long appointmentId, AppointmentStatusUpdateRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));

        if (!appointment.getDoctorId().equals(doctorId)) {
            throw new UnauthorizedAccessException("You are not authorized to update this appointment.");
        }

        appointment.setStatus(request.getStatus());
        if (request.getDoctorNotes() != null) {
            appointment.setDoctorNotes(request.getDoctorNotes());
        }

        Appointment saved = appointmentRepository.save(appointment);

        // Record notification
        DoctorNotification notif = new DoctorNotification();
        notif.setDoctorId(doctorId);
        notif.setTitle("Appointment " + request.getStatus().name());
        notif.setMessage(String.format("Appointment for %s on %s was updated to %s.",
                appointment.getPatientName(), appointment.getAppointmentDate(), request.getStatus().name()));
        notif.setType(request.getStatus() == AppointmentStatus.ACCEPTED ?
                NotificationType.APPOINTMENT_ACCEPTED : NotificationType.APPOINTMENT_CANCELLED);
        notif.setReferenceId(appointment.getAppointmentNumber());
        notificationRepository.save(notif);

        return mapToDto(saved);
    }

    @Override
    public AppointmentDto rescheduleAppointment(Long doctorId, Long appointmentId, AppointmentRescheduleRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));

        if (!appointment.getDoctorId().equals(doctorId)) {
            throw new UnauthorizedAccessException("You are not authorized to reschedule this appointment.");
        }

        appointmentValidator.validateReschedule(request, appointment.getStatus());

        appointment.setAppointmentDate(request.getNewDate());
        appointment.setAppointmentTime(request.getNewTime().trim());
        appointment.setStatus(AppointmentStatus.RESCHEDULED);
        if (request.getRescheduleReason() != null) {
            appointment.setRescheduleReason(request.getRescheduleReason().trim());
        }

        Appointment saved = appointmentRepository.save(appointment);

        // Record notification
        DoctorNotification notif = new DoctorNotification();
        notif.setDoctorId(doctorId);
        notif.setTitle("Appointment Rescheduled");
        notif.setMessage(String.format("Appointment for %s rescheduled to %s at %s.",
                appointment.getPatientName(), request.getNewDate(), request.getNewTime()));
        notif.setType(NotificationType.APPOINTMENT_RESCHEDULED);
        notif.setReferenceId(appointment.getAppointmentNumber());
        notificationRepository.save(notif);

        return mapToDto(saved);
    }

    @Override
    public AppointmentDto startConsultation(Long doctorId, Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));

        if (!appointment.getDoctorId().equals(doctorId)) {
            throw new UnauthorizedAccessException("You are not authorized to conduct this consultation.");
        }

        return mapToDto(appointment);
    }

    private AppointmentDto mapToDto(Appointment a) {
        AppointmentDto dto = new AppointmentDto();
        dto.setId(a.getId());
        dto.setAppointmentNumber(a.getAppointmentNumber());
        dto.setDoctorId(a.getDoctorId());
        dto.setPatientId(a.getPatientId());
        dto.setPatientName(a.getPatientName());
        dto.setAppointmentDate(a.getAppointmentDate());
        dto.setAppointmentTime(a.getAppointmentTime());
        dto.setAppointmentType(a.getAppointmentType());
        dto.setReasonForVisit(a.getReasonForVisit());
        dto.setStatus(a.getStatus());
        dto.setDoctorNotes(a.getDoctorNotes());
        dto.setRescheduleReason(a.getRescheduleReason());
        dto.setCreatedAt(a.getCreatedAt());
        return dto;
    }
}
