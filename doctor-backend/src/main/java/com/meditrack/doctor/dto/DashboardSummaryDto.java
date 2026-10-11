package com.meditrack.doctor.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class DashboardSummaryDto {

    private Long doctorId;
    private String doctorName;
    private String specialization;
    private String qualification;
    private String hospitalClinicName;
    private String verificationStatus;
    private String profilePhotoUrl;

    // KPI Metrics
    private Integer todayAppointmentsCount;
    private Integer pendingRequestsCount;
    private Integer completedConsultationsCount;
    private Integer totalPatientsCount;
    private BigDecimal averageRating;
    private Integer totalReviewsCount;

    // Timeline and quick data
    private List<AppointmentDto> todaySchedule = new ArrayList<>();
    private List<AppointmentDto> upcomingAppointments = new ArrayList<>();
    private List<PatientSummaryDto> recentPatients = new ArrayList<>();
    private List<ConsultationDto> recentConsultations = new ArrayList<>();
    private List<AppointmentDto> pendingRequests = new ArrayList<>();
    private Integer unreadNotificationsCount = 0;

    public DashboardSummaryDto() {}

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getHospitalClinicName() { return hospitalClinicName; }
    public void setHospitalClinicName(String hospitalClinicName) { this.hospitalClinicName = hospitalClinicName; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public Integer getTodayAppointmentsCount() { return todayAppointmentsCount; }
    public void setTodayAppointmentsCount(Integer todayAppointmentsCount) { this.todayAppointmentsCount = todayAppointmentsCount; }

    public Integer getPendingRequestsCount() { return pendingRequestsCount; }
    public void setPendingRequestsCount(Integer pendingRequestsCount) { this.pendingRequestsCount = pendingRequestsCount; }

    public Integer getCompletedConsultationsCount() { return completedConsultationsCount; }
    public void setCompletedConsultationsCount(Integer completedConsultationsCount) { this.completedConsultationsCount = completedConsultationsCount; }

    public Integer getTotalPatientsCount() { return totalPatientsCount; }
    public void setTotalPatientsCount(Integer totalPatientsCount) { this.totalPatientsCount = totalPatientsCount; }

    public BigDecimal getAverageRating() { return averageRating; }
    public void setAverageRating(BigDecimal averageRating) { this.averageRating = averageRating; }

    public Integer getTotalReviewsCount() { return totalReviewsCount; }
    public void setTotalReviewsCount(Integer totalReviewsCount) { this.totalReviewsCount = totalReviewsCount; }

    public List<AppointmentDto> getTodaySchedule() { return todaySchedule; }
    public void setTodaySchedule(List<AppointmentDto> todaySchedule) { this.todaySchedule = todaySchedule; }

    public List<AppointmentDto> getUpcomingAppointments() { return upcomingAppointments; }
    public void setUpcomingAppointments(List<AppointmentDto> upcomingAppointments) { this.upcomingAppointments = upcomingAppointments; }

    public List<PatientSummaryDto> getRecentPatients() { return recentPatients; }
    public void setRecentPatients(List<PatientSummaryDto> recentPatients) { this.recentPatients = recentPatients; }

    public List<ConsultationDto> getRecentConsultations() { return recentConsultations; }
    public void setRecentConsultations(List<ConsultationDto> recentConsultations) { this.recentConsultations = recentConsultations; }

    public List<AppointmentDto> getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(List<AppointmentDto> pendingRequests) { this.pendingRequests = pendingRequests; }

    public Integer getUnreadNotificationsCount() { return unreadNotificationsCount; }
    public void setUnreadNotificationsCount(Integer unreadNotificationsCount) { this.unreadNotificationsCount = unreadNotificationsCount; }
}
