package com.meditrack.doctor.service.impl;

import com.meditrack.doctor.dto.MedicalReportDto;
import com.meditrack.doctor.entity.MedicalReport;
import com.meditrack.doctor.exception.ResourceNotFoundException;
import com.meditrack.doctor.exception.UnauthorizedAccessException;
import com.meditrack.doctor.repository.MedicalReportRepository;
import com.meditrack.doctor.service.DoctorMedicalReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DoctorMedicalReportServiceImpl implements DoctorMedicalReportService {

    @Autowired
    private MedicalReportRepository medicalReportRepository;

    @Override
    public List<MedicalReportDto> getAuthorizedReports(Long doctorId, String patientId, String searchQuery) {
        List<MedicalReport> list;

        if (patientId != null && !patientId.trim().isEmpty()) {
            list = medicalReportRepository.findByDoctorIdAndPatientIdOrderByReportDateDesc(doctorId, patientId.trim());
        } else if (searchQuery != null && !searchQuery.trim().isEmpty()) {
            list = medicalReportRepository.findByDoctorIdAndPatientNameContainingIgnoreCaseOrderByReportDateDesc(doctorId, searchQuery.trim());
        } else {
            list = medicalReportRepository.findByDoctorIdOrderByReportDateDesc(doctorId);
        }

        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public MedicalReportDto getReportById(Long doctorId, Long reportId) {
        MedicalReport report = medicalReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Medical Report", "id", reportId));

        if (!report.getDoctorId().equals(doctorId)) {
            throw new UnauthorizedAccessException("You are not authorized to view this diagnostic report.");
        }

        return mapToDto(report);
    }

    private MedicalReportDto mapToDto(MedicalReport r) {
        MedicalReportDto dto = new MedicalReportDto();
        dto.setId(r.getId());
        dto.setReportNumber(r.getReportNumber());
        dto.setPatientId(r.getPatientId());
        dto.setPatientName(r.getPatientName());
        dto.setDoctorId(r.getDoctorId());
        dto.setTestRequestId(r.getTestRequestId());
        dto.setTestName(r.getTestName());
        dto.setReportDate(r.getReportDate());
        dto.setResultSummary(r.getResultSummary());
        dto.setResultStatus(r.getResultStatus());
        dto.setLabTechnicianName(r.getLabTechnicianName());
        dto.setReportFileUrl(r.getReportFileUrl());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}
