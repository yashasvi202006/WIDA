package com.meditrack.doctor.controller;

import com.meditrack.doctor.dto.DoctorAuthResponse;
import com.meditrack.doctor.dto.DoctorLoginRequest;
import com.meditrack.doctor.dto.DoctorRegisterRequest;
import com.meditrack.doctor.service.DoctorAuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/doctor/auth")
public class DoctorAuthController {

    @Autowired
    private DoctorAuthService authService;

    @PostMapping("/register")
    public ResponseEntity<DoctorAuthResponse> register(@Valid @RequestBody DoctorRegisterRequest request) {
        DoctorAuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<DoctorAuthResponse> login(@Valid @RequestBody DoctorLoginRequest request) {
        DoctorAuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/{doctorId}")
    public ResponseEntity<DoctorAuthResponse> getCurrentDoctor(@PathVariable Long doctorId) {
        DoctorAuthResponse response = authService.getCurrentDoctor(doctorId);
        return ResponseEntity.ok(response);
    }
}
