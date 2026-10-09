package com.meditrack.doctor.controller;

import com.meditrack.doctor.dto.DoctorAvailabilityDto;
import com.meditrack.doctor.service.DoctorAvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/doctor/availability")
public class DoctorAvailabilityController {

    @Autowired
    private DoctorAvailabilityService availabilityService;

    @GetMapping("/{doctorId}")
    public ResponseEntity<DoctorAvailabilityDto> getAvailability(@PathVariable Long doctorId) {
        return ResponseEntity.ok(availabilityService.getAvailability(doctorId));
    }

    @PutMapping("/{doctorId}")
    public ResponseEntity<DoctorAvailabilityDto> updateAvailability(
            @PathVariable Long doctorId,
            @RequestBody DoctorAvailabilityDto availabilityDto) {
        return ResponseEntity.ok(availabilityService.updateAvailability(doctorId, availabilityDto));
    }
}
