package com.meditrack.doctor.controller;

import com.meditrack.doctor.dto.DoctorProfileDto;
import com.meditrack.doctor.dto.DoctorProfileUpdateRequest;
import com.meditrack.doctor.dto.DoctorVerificationDto;
import com.meditrack.doctor.service.DoctorProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/doctor/profile")
public class DoctorProfileController {

    @Autowired
    private DoctorProfileService profileService;

    @GetMapping("/{doctorId}")
    public ResponseEntity<DoctorProfileDto> getProfile(@PathVariable Long doctorId) {
        return ResponseEntity.ok(profileService.getProfile(doctorId));
    }

    @PutMapping("/{doctorId}")
    public ResponseEntity<DoctorProfileDto> updateProfile(
            @PathVariable Long doctorId,
            @Valid @RequestBody DoctorProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(doctorId, request));
    }

    @GetMapping("/{doctorId}/verification")
    public ResponseEntity<DoctorVerificationDto> getVerificationStatus(@PathVariable Long doctorId) {
        return ResponseEntity.ok(profileService.getVerificationStatus(doctorId));
    }

    @PostMapping("/{doctorId}/verification/submit")
    public ResponseEntity<DoctorVerificationDto> submitVerificationReview(
            @PathVariable Long doctorId,
            @RequestBody Map<String, String> payload) {
        String docName = payload.getOrDefault("documentName", "Updated_Medical_Certificate.pdf");
        String docType = payload.getOrDefault("documentType", "Medical Council License");
        String docUrl = payload.getOrDefault("documentUrl", "/docs/license-" + doctorId + ".pdf");
        return ResponseEntity.ok(profileService.requestVerificationReview(doctorId, docName, docType, docUrl));
    }
}
