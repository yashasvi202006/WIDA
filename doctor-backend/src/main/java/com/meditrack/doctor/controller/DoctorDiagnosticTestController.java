package com.meditrack.doctor.controller;

import com.meditrack.doctor.dto.DiagnosticTestCreateRequest;
import com.meditrack.doctor.dto.DiagnosticTestRequestDto;
import com.meditrack.doctor.service.DoctorDiagnosticTestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor/diagnostic-tests")
public class DoctorDiagnosticTestController {

    @Autowired
    private DoctorDiagnosticTestService diagnosticTestService;

    @PostMapping("/{doctorId}")
    public ResponseEntity<DiagnosticTestRequestDto> requestTest(
            @PathVariable Long doctorId,
            @Valid @RequestBody DiagnosticTestCreateRequest request) {
        DiagnosticTestRequestDto dto = diagnosticTestService.requestTest(doctorId, request);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<List<DiagnosticTestRequestDto>> getDoctorTestRequests(
            @PathVariable Long doctorId,
            @RequestParam(required = false) String patientId) {
        return ResponseEntity.ok(diagnosticTestService.getDoctorTestRequests(doctorId, patientId));
    }

    @GetMapping("/catalog")
    public ResponseEntity<List<String>> getCatalogTestNames() {
        return ResponseEntity.ok(diagnosticTestService.getCatalogTestNames());
    }
}
