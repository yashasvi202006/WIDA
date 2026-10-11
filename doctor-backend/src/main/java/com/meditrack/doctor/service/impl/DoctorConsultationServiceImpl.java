package com.meditrack.doctor.service.impl;

import com.meditrack.doctor.dto.ConsultationCreateRequest;
import com.meditrack.doctor.dto.ConsultationDto;
import com.meditrack.doctor.entity.Appointment;
import com.meditrack.doctor.entity.Consultation;
import com.meditrack.doctor.entity.ConsultationRemark;
import com.meditrack.doctor.entity.DoctorNotification;
import com.meditrack.doctor.enums.AppointmentStatus;
import com.meditrack.doctor.enums.ConsultationStatus;
import com.meditrack.doctor.enums.NotificationType;
import com.meditrack.doctor.exception.ResourceNotFoundException;
import com.meditrack.doctor.exception.UnauthorizedAccessException;
import com.meditrack.doctor.repository.AppointmentRepository;
import com.meditrack.doctor.repository.ConsultationRemarkRepository;
import com.meditrack.doctor.repository.ConsultationRepository;
import com.meditrack.doctor.repository.DoctorNotificationRepository;
import com.meditrack.doctor.service.DoctorConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class DoctorConsultationServiceImpl implements DoctorConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorNotificationRepository notificationRepository;

    @Override
    public ConsultationDto saveConsultation(Long doctorId, ConsultationCreateRequest request) {
        Consultation consultation = new Consultation();
        consultation.setConsultationNumber("CNS-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        consultation.setDoctorId(doctorId);
        consultation.setPatientId(request.getPatientId());
        consultation.setPatientName(request.getPatientName());
        consultation.setAppointmentId(request.getAppointmentId());
        consultation.setConsultationDate(LocalDate.now());
        consultation.setChiefComplaint(request.getChiefComplaint().trim());
        consultation.setSymptoms(request.getSymptoms());
        consultation.setClinicalNotes(request.getClinicalNotes());
        consultation.setDiagnosis(request.getDiagnosis().trim());
        consultation.setDoctorRemarks(request.getDoctorRemarks());
        consultation.setFollowUpDate(request.getFollowUpDate());
        consultation.setAdditionalNotes(request.getAdditionalNotes());
        consultation.setStatus(Boolean.TRUE.equals(request.getIsDraft()) ? ConsultationStatus.DRAFT : ConsultationStatus.COMPLETED);

        Consultation saved = consultationRepository.save(consultation);

        // Update appointment status to COMPLETED if not draft
        if (!Boolean.TRUE.equals(request.getIsDraft()) && request.getAppointmentId() != null) {
            appointmentRepository.findById(request.getAppointmentId()).ifPresent(apt -> {
                if (apt.getDoctorId().equals(doctorId)) {
                    apt.setStatus(AppointmentStatus.COMPLETED);
                    appointmentRepository.save(apt);
                }
            });
        }

        // Notification
        DoctorNotification notif = new DoctorNotification();
        notif.setDoctorId(doctorId);
        notif.setTitle("Consultation " + (Boolean.TRUE.equals(request.getIsDraft()) ? "Draft Saved" : "Completed"));
        notif.setMessage(String.format("Consultation %s for patient %s has been recorded.",
                saved.getConsultationNumber(), saved.getPatientName()));
        notif.setType(NotificationType.SYSTEM);
        notif.setReferenceId(saved.getConsultationNumber());
        notificationRepository.save(notif);

        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ConsultationDto getConsultationById(Long doctorId, Long consultationId) {
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation", "id", consultationId));

        if (!consultation.getDoctorId().equals(doctorId)) {
            throw new UnauthorizedAccessException("You are not authorized to view this consultation.");
        }

        return mapToDto(consultation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConsultationDto> getDoctorConsultations(Long doctorId, String patientId, String searchQuery) {
        List<Consultation> list;

        if (patientId != null && !patientId.trim().isEmpty()) {
            list = consultationRepository.findByDoctorIdAndPatientIdOrderByConsultationDateDesc(doctorId, patientId.trim());
        } else if (searchQuery != null && !searchQuery.trim().isEmpty()) {
            list = consultationRepository.findByDoctorIdAndPatientNameContainingIgnoreCaseOrderByConsultationDateDesc(doctorId, searchQuery.trim());
        } else {
            list = consultationRepository.findByDoctorIdOrderByConsultationDateDesc(doctorId);
        }

        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private ConsultationDto mapToDto(Consultation c) {
        ConsultationDto dto = new ConsultationDto();
        dto.setId(c.getId());
        dto.setConsultationNumber(c.getConsultationNumber());
        dto.setAppointmentId(c.getAppointmentId());
        dto.setDoctorId(c.getDoctorId());
        dto.setPatientId(c.getPatientId());
        dto.setPatientName(c.getPatientName());
        dto.setConsultationDate(c.getConsultationDate());
        dto.setChiefComplaint(c.getChiefComplaint());
        dto.setSymptoms(c.getSymptoms());
        dto.setClinicalNotes(c.getClinicalNotes());
        dto.setDiagnosis(c.getDiagnosis());
        dto.setDoctorRemarks(c.getDoctorRemarks());
        dto.setFollowUpDate(c.getFollowUpDate());
        dto.setAdditionalNotes(c.getAdditionalNotes());
        dto.setStatus(c.getStatus());
        dto.setCreatedAt(c.getCreatedAt());
        return dto;
    }
}
