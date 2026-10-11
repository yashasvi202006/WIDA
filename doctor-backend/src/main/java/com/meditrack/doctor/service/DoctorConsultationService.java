package com.meditrack.doctor.service;

import com.meditrack.doctor.dto.ConsultationCreateRequest;
import com.meditrack.doctor.dto.ConsultationDto;
import java.util.List;

public interface DoctorConsultationService {
    ConsultationDto saveConsultation(Long doctorId, ConsultationCreateRequest request);
    ConsultationDto getConsultationById(Long doctorId, Long consultationId);
    List<ConsultationDto> getDoctorConsultations(Long doctorId, String patientId, String searchQuery);
}
