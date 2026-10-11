package com.meditrack.doctor.service;

import com.meditrack.doctor.dto.DashboardSummaryDto;

public interface DoctorDashboardService {
    DashboardSummaryDto getDashboardSummary(Long doctorId);
}
