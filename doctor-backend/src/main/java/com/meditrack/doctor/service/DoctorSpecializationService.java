package com.meditrack.doctor.service;

import com.meditrack.doctor.entity.DoctorSpecialization;
import java.util.List;

public interface DoctorSpecializationService {
    List<DoctorSpecialization> getAllSpecializations();
    DoctorSpecialization getSpecializationById(Long id);
}
