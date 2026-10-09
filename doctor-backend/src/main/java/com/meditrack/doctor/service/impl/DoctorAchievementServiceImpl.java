package com.meditrack.doctor.service.impl;

import com.meditrack.doctor.dto.DoctorAchievementDto;
import com.meditrack.doctor.entity.DoctorAchievement;
import com.meditrack.doctor.repository.DoctorAchievementRepository;
import com.meditrack.doctor.service.DoctorAchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DoctorAchievementServiceImpl implements DoctorAchievementService {

    @Autowired
    private DoctorAchievementRepository achievementRepository;

    @Override
    public List<DoctorAchievementDto> getDoctorAchievements(Long doctorId) {
        return achievementRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private DoctorAchievementDto mapToDto(DoctorAchievement a) {
        DoctorAchievementDto dto = new DoctorAchievementDto();
        dto.setId(a.getId());
        dto.setDoctorId(a.getDoctorId());
        dto.setBadgeKey(a.getBadgeKey());
        dto.setTitle(a.getTitle());
        dto.setDescription(a.getDescription());
        dto.setIcon(a.getIcon());
        dto.setIsUnlocked(a.getIsUnlocked());
        dto.setProgress(a.getProgress());
        dto.setMaxProgress(a.getMaxProgress());
        dto.setAwardedDate(a.getAwardedDate());
        return dto;
    }
}
