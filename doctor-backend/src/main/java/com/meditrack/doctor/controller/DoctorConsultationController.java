package com.meditrack.doctor.controller;

import com.meditrack.doctor.dto.ConsultationCreateRequest;
import com.meditrack.doctor.dto.ConsultationDto;
import com.meditrack.doctor.service.DoctorConsultationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor/consultations")
public class DoctorConsultationController {

    @Autowired
    private DoctorConsultationService consultationService;

    @PostMapping("/{doctorId}")
    public ResponseEntity<ConsultationDto> saveConsultation(
            @PathVariable Long doctorId,
            @Valid @RequestBody ConsultationCreateRequest request) {
        ConsultationDto dto = consultationService.saveConsultation(doctorId, request);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/{doctorId}/{consultationId}")
    public ResponseEntity<ConsultationDto> getConsultationById(
            @PathVariable Long doctorId,
            @PathVariable Long consultationId) {
        return ResponseEntity.ok(consultationService.getConsultationById(doctorId, consultationId));
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<List<ConsultationDto>> getConsultations(
            @PathVariable Long doctorId,
            @RequestParam(required = false) String patientId,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(consultationService.getDoctorConsultations(doctorId, patientId, search));
    }
}
