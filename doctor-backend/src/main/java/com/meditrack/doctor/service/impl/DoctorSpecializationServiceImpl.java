package com.meditrack.doctor.service.impl;

import com.meditrack.doctor.entity.DoctorSpecialization;
import com.meditrack.doctor.exception.ResourceNotFoundException;
import com.meditrack.doctor.repository.DoctorSpecializationRepository;
import com.meditrack.doctor.service.DoctorSpecializationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class DoctorSpecializationServiceImpl implements DoctorSpecializationService {

    @Autowired
    private DoctorSpecializationRepository specializationRepository;

    @Override
    public List<DoctorSpecialization> getAllSpecializations() {
        return specializationRepository.findAllByOrderByNameAsc();
    }

    @Override
    public DoctorSpecialization getSpecializationById(Long id) {
        return specializationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialization", "id", id));
    }
}
