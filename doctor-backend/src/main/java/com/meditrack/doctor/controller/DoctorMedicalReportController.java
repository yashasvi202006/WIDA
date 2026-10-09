package com.meditrack.doctor.controller;

import com.meditrack.doctor.dto.MedicalReportDto;
import com.meditrack.doctor.service.DoctorMedicalReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor/medical-reports")
public class DoctorMedicalReportController {

    @Autowired
    private DoctorMedicalReportService medicalReportService;

    @GetMapping("/{doctorId}")
    public ResponseEntity<List<MedicalReportDto>> getReports(
            @PathVariable Long doctorId,
            @RequestParam(required = false) String patientId,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(medicalReportService.getAuthorizedReports(doctorId, patientId, search));
    }

    @GetMapping("/{doctorId}/{reportId}")
    public ResponseEntity<MedicalReportDto> getReportById(
            @PathVariable Long doctorId,
            @PathVariable Long reportId) {
        return ResponseEntity.ok(medicalReportService.getReportById(doctorId, reportId));
    }
}
