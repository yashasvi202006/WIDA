package com.meditrack.doctor.controller;

import com.meditrack.doctor.entity.DoctorSpecialization;
import com.meditrack.doctor.service.DoctorSpecializationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor/specializations")
public class DoctorSpecializationController {

    @Autowired
    private DoctorSpecializationService specializationService;

    @GetMapping
    public ResponseEntity<List<DoctorSpecialization>> getAllSpecializations() {
        return ResponseEntity.ok(specializationService.getAllSpecializations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorSpecialization> getSpecializationById(@PathVariable Long id) {
        return ResponseEntity.ok(specializationService.getSpecializationById(id));
    }
}
