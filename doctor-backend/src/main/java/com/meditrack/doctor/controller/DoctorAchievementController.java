package com.meditrack.doctor.controller;

import com.meditrack.doctor.dto.DoctorAchievementDto;
import com.meditrack.doctor.service.DoctorAchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor/achievements")
public class DoctorAchievementController {

    @Autowired
    private DoctorAchievementService achievementService;

    @GetMapping("/{doctorId}")
    public ResponseEntity<List<DoctorAchievementDto>> getAchievements(@PathVariable Long doctorId) {
        return ResponseEntity.ok(achievementService.getDoctorAchievements(doctorId));
    }
}
