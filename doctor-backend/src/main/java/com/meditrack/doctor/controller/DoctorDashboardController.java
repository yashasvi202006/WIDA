package com.meditrack.doctor.controller;

import com.meditrack.doctor.dto.DashboardSummaryDto;
import com.meditrack.doctor.service.DoctorDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/doctor/dashboard")
public class DoctorDashboardController {

    @Autowired
    private DoctorDashboardService dashboardService;

    @GetMapping("/{doctorId}")
    public ResponseEntity<DashboardSummaryDto> getDashboard(@PathVariable Long doctorId) {
        return ResponseEntity.ok(dashboardService.getDashboardSummary(doctorId));
    }
}
