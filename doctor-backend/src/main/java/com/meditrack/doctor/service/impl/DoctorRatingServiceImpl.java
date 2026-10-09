package com.meditrack.doctor.service.impl;

import com.meditrack.doctor.dto.DoctorRatingDto;
import com.meditrack.doctor.entity.Doctor;
import com.meditrack.doctor.entity.DoctorRating;
import com.meditrack.doctor.repository.DoctorRatingRepository;
import com.meditrack.doctor.repository.DoctorRepository;
import com.meditrack.doctor.service.DoctorRatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DoctorRatingServiceImpl implements DoctorRatingService {

    @Autowired
    private DoctorRatingRepository ratingRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public List<DoctorRatingDto> getDoctorRatings(Long doctorId) {
        return ratingRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public BigDecimal getAverageRating(Long doctorId) {
        List<DoctorRating> ratings = ratingRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
        if (ratings.isEmpty()) {
            Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
            return doctor != null ? doctor.getAverageRating() : new BigDecimal("5.00");
        }

        double avg = ratings.stream().mapToInt(DoctorRating::getRatingValue).average().orElse(5.0);
        return BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public Map<Integer, Long> getRatingDistribution(Long doctorId) {
        List<DoctorRating> ratings = ratingRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
        Map<Integer, Long> distribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            distribution.put(i, 0L);
        }

        for (DoctorRating r : ratings) {
            int val = r.getRatingValue();
            distribution.put(val, distribution.getOrDefault(val, 0L) + 1);
        }

        return distribution;
    }

    private DoctorRatingDto mapToDto(DoctorRating r) {
        DoctorRatingDto dto = new DoctorRatingDto();
        dto.setId(r.getId());
        dto.setDoctorId(r.getDoctorId());
        dto.setPatientName(r.getPatientName());
        dto.setRatingValue(r.getRatingValue());
        dto.setReviewTitle(r.getReviewTitle());
        dto.setReviewComment(r.getReviewComment());
        dto.setAppointmentType(r.getAppointmentType());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}
