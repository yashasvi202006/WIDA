package com.meditrack.doctor.service;

import com.meditrack.doctor.dto.DoctorAvailabilityDto;

public interface DoctorAvailabilityService {
    DoctorAvailabilityDto getAvailability(Long doctorId);
    DoctorAvailabilityDto updateAvailability(Long doctorId, DoctorAvailabilityDto availabilityDto);
}
