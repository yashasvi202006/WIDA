package com.meditrack.doctor.controller;

import com.meditrack.doctor.dto.PrescriptionCreateRequest;
import com.meditrack.doctor.dto.PrescriptionDto;
import com.meditrack.doctor.service.DoctorPrescriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor/prescriptions")
public class DoctorPrescriptionController {

    @Autowired
    private DoctorPrescriptionService prescriptionService;

    @PostMapping("/{doctorId}")
    public ResponseEntity<PrescriptionDto> createPrescription(
            @PathVariable Long doctorId,
            @Valid @RequestBody PrescriptionCreateRequest request) {
        PrescriptionDto dto = prescriptionService.createPrescription(doctorId, request);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/{doctorId}/{prescriptionId}")
    public ResponseEntity<PrescriptionDto> getPrescriptionById(
            @PathVariable Long doctorId,
            @PathVariable Long prescriptionId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionById(doctorId, prescriptionId));
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<List<PrescriptionDto>> getPrescriptions(
            @PathVariable Long doctorId,
            @RequestParam(required = false) String patientId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptions(doctorId, patientId));
    }
}
