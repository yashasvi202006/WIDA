package com.meditrack.doctor.service;

import com.meditrack.doctor.dto.MedicalReportDto;
import java.util.List;

public interface DoctorMedicalReportService {
    List<MedicalReportDto> getAuthorizedReports(Long doctorId, String patientId, String searchQuery);
    MedicalReportDto getReportById(Long doctorId, Long reportId);
}
