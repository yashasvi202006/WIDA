package com.meditrack.doctor.service;

import com.meditrack.doctor.dto.AppointmentDto;
import com.meditrack.doctor.dto.AppointmentRescheduleRequest;
import com.meditrack.doctor.dto.AppointmentStatusUpdateRequest;
import com.meditrack.doctor.enums.AppointmentStatus;

import java.time.LocalDate;
import java.util.List;

public interface DoctorAppointmentService {
    List<AppointmentDto> getDoctorAppointments(Long doctorId, AppointmentStatus status, LocalDate date, String searchQuery);
    AppointmentDto getAppointmentById(Long doctorId, Long appointmentId);
    AppointmentDto updateAppointmentStatus(Long doctorId, Long appointmentId, AppointmentStatusUpdateRequest request);
    AppointmentDto rescheduleAppointment(Long doctorId, Long appointmentId, AppointmentRescheduleRequest request);
    AppointmentDto startConsultation(Long doctorId, Long appointmentId);
}
