package com.meditrack.doctor.service.impl;

import com.meditrack.doctor.dto.*;
import com.meditrack.doctor.entity.*;
import com.meditrack.doctor.enums.AppointmentStatus;
import com.meditrack.doctor.exception.ResourceNotFoundException;
import com.meditrack.doctor.repository.*;
import com.meditrack.doctor.service.DoctorDashboardService;
import com.meditrack.doctor.service.DoctorPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DoctorDashboardServiceImpl implements DoctorDashboardService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private DoctorPatientService doctorPatientService;

    @Autowired
    private DoctorNotificationRepository notificationRepository;

    @Override
    public DashboardSummaryDto getDashboardSummary(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        DashboardSummaryDto dto = new DashboardSummaryDto();
        dto.setDoctorId(doctor.getId());
        dto.setDoctorName(doctor.getFullName());
        dto.setSpecialization(doctor.getSpecializationName());
        dto.setQualification(doctor.getQualification());
        dto.setHospitalClinicName(doctor.getHospitalClinicName());
        dto.setVerificationStatus(doctor.getVerificationStatus().name());
        dto.setProfilePhotoUrl(doctor.getProfilePhotoUrl());

        LocalDate today = LocalDate.now();

        // Count metrics
        long todayCount = appointmentRepository.countByDoctorIdAndAppointmentDate(doctorId, today);
        long pendingCount = appointmentRepository.countByDoctorIdAndStatus(doctorId, AppointmentStatus.PENDING);
        long completedConsultationsCount = consultationRepository.countByDoctorId(doctorId);

        List<PatientSummaryDto> authorizedPatients = doctorPatientService.getAuthorizedPatients(doctorId, null);

        dto.setTodayAppointmentsCount((int) todayCount);
        dto.setPendingRequestsCount((int) pendingCount);
        dto.setCompletedConsultationsCount((int) completedConsultationsCount);
        dto.setTotalPatientsCount(authorizedPatients.size());
        dto.setAverageRating(doctor.getAverageRating());
        dto.setTotalReviewsCount(doctor.getTotalRatings());

        // Today's schedule
        List<Appointment> todayApts = appointmentRepository.findByDoctorIdAndAppointmentDateOrderByAppointmentTimeAsc(doctorId, today);
        dto.setTodaySchedule(todayApts.stream().map(this::mapToAppointmentDto).collect(Collectors.toList()));

        // Upcoming appointments
        List<Appointment> upcoming = appointmentRepository
                .findByDoctorIdAndAppointmentDateBetweenOrderByAppointmentDateAscAppointmentTimeAsc(
                        doctorId, today.plusDays(1), today.plusDays(30)
                );
        dto.setUpcomingAppointments(upcoming.stream().limit(5).map(this::mapToAppointmentDto).collect(Collectors.toList()));

        // Pending requests
        List<Appointment> pending = appointmentRepository
                .findByDoctorIdAndStatusOrderByAppointmentDateAscAppointmentTimeAsc(doctorId, AppointmentStatus.PENDING);
        dto.setPendingRequests(pending.stream().map(this::mapToAppointmentDto).collect(Collectors.toList()));

        // Recent Patients
        dto.setRecentPatients(authorizedPatients.stream().limit(5).collect(Collectors.toList()));

        // Recent Consultations
        List<Consultation> consultations = consultationRepository.findByDoctorIdOrderByConsultationDateDesc(doctorId);
        dto.setRecentConsultations(consultations.stream().limit(5).map(this::mapToConsultationDto).collect(Collectors.toList()));

        // Unread notifications
        dto.setUnreadNotificationsCount((int) notificationRepository.countByDoctorIdAndIsReadFalse(doctorId));

        return dto;
    }

    private AppointmentDto mapToAppointmentDto(Appointment a) {
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

    private ConsultationDto mapToConsultationDto(Consultation c) {
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
