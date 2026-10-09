package com.meditrack.doctor.service;

import com.meditrack.doctor.dto.DoctorRatingDto;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface DoctorRatingService {
    List<DoctorRatingDto> getDoctorRatings(Long doctorId);
    BigDecimal getAverageRating(Long doctorId);
    Map<Integer, Long> getRatingDistribution(Long doctorId);
}
