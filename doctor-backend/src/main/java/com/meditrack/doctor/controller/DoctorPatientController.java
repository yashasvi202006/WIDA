package com.meditrack.doctor.controller;

import com.meditrack.doctor.dto.PatientMedicalHistoryDto;
import com.meditrack.doctor.dto.PatientSummaryDto;
import com.meditrack.doctor.service.DoctorPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor/patients")
public class DoctorPatientController {

    @Autowired
    private DoctorPatientService patientService;

    @GetMapping("/{doctorId}")
    public ResponseEntity<List<PatientSummaryDto>> getAuthorizedPatients(
            @PathVariable Long doctorId,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(patientService.getAuthorizedPatients(doctorId, search));
    }

    @GetMapping("/{doctorId}/{patientId}")
    public ResponseEntity<PatientSummaryDto> getPatientDetails(
            @PathVariable Long doctorId,
            @PathVariable String patientId) {
        return ResponseEntity.ok(patientService.getPatientDetails(doctorId, patientId));
    }

    @GetMapping("/{doctorId}/{patientId}/history")
    public ResponseEntity<PatientMedicalHistoryDto> getPatientMedicalHistory(
            @PathVariable Long doctorId,
            @PathVariable String patientId) {
        return ResponseEntity.ok(patientService.getPatientMedicalHistory(doctorId, patientId));
    }
}
