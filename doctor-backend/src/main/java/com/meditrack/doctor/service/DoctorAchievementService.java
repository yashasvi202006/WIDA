package com.meditrack.doctor.service;

import com.meditrack.doctor.dto.DoctorAchievementDto;
import java.util.List;

public interface DoctorAchievementService {
    List<DoctorAchievementDto> getDoctorAchievements(Long doctorId);
}
