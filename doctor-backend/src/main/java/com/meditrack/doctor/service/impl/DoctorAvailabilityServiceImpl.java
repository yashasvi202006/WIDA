package com.meditrack.doctor.service.impl;

import com.meditrack.doctor.dto.DoctorAvailabilityDto;
import com.meditrack.doctor.dto.DoctorAvailabilityDto.DayScheduleDto;
import com.meditrack.doctor.entity.DoctorAvailability;
import com.meditrack.doctor.repository.DoctorAvailabilityRepository;
import com.meditrack.doctor.service.DoctorAvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class DoctorAvailabilityServiceImpl implements DoctorAvailabilityService {

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    private static final List<String> ALL_DAYS = Arrays.asList(
            "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
    );

    @Override
    @Transactional(readOnly = true)
    public DoctorAvailabilityDto getAvailability(Long doctorId) {
        List<DoctorAvailability> list = availabilityRepository.findByDoctorId(doctorId);
        Map<String, DoctorAvailability> dayMap = list.stream()
                .collect(Collectors.toMap(DoctorAvailability::getDayOfWeek, a -> a, (a, b) -> a));

        List<DayScheduleDto> scheduleList = new ArrayList<>();
        for (String day : ALL_DAYS) {
            DoctorAvailability a = dayMap.get(day);
            if (a != null) {
                scheduleList.add(new DayScheduleDto(
                        a.getId(), a.getDayOfWeek(), a.getIsAvailable(),
                        a.getStartTime(), a.getEndTime(),
                        a.getBreakStartTime(), a.getBreakEndTime(), a.getSlotDurationMinutes()
                ));
            } else {
                scheduleList.add(new DayScheduleDto(
                        null, day, false, "09:00 AM", "05:00 PM", "01:00 PM", "02:00 PM", 30
                ));
            }
        }

        return new DoctorAvailabilityDto(doctorId, scheduleList);
    }

    @Override
    public DoctorAvailabilityDto updateAvailability(Long doctorId, DoctorAvailabilityDto dto) {
        if (dto != null && dto.getWeeklySchedule() != null) {
            for (DayScheduleDto dayDto : dto.getWeeklySchedule()) {
                DoctorAvailability entity = availabilityRepository
                        .findByDoctorIdAndDayOfWeek(doctorId, dayDto.getDayOfWeek())
                        .orElse(new DoctorAvailability());

                entity.setDoctorId(doctorId);
                entity.setDayOfWeek(dayDto.getDayOfWeek());
                entity.setIsAvailable(dayDto.getIsAvailable() != null ? dayDto.getIsAvailable() : false);
                entity.setStartTime(dayDto.getStartTime() != null ? dayDto.getStartTime() : "09:00 AM");
                entity.setEndTime(dayDto.getEndTime() != null ? dayDto.getEndTime() : "05:00 PM");
                entity.setBreakStartTime(dayDto.getBreakStartTime());
                entity.setBreakEndTime(dayDto.getBreakEndTime());
                entity.setSlotDurationMinutes(dayDto.getSlotDurationMinutes() != null ? dayDto.getSlotDurationMinutes() : 30);

                availabilityRepository.save(entity);
            }
        }

        return getAvailability(doctorId);
    }
}
