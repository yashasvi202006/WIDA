package com.meditrack.doctor.controller;

import com.meditrack.doctor.dto.DoctorRatingDto;
import com.meditrack.doctor.service.DoctorRatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/doctor/ratings")
public class DoctorRatingController {

    @Autowired
    private DoctorRatingService ratingService;

    @GetMapping("/{doctorId}")
    public ResponseEntity<List<DoctorRatingDto>> getRatings(@PathVariable Long doctorId) {
        return ResponseEntity.ok(ratingService.getDoctorRatings(doctorId));
    }

    @GetMapping("/{doctorId}/average")
    public ResponseEntity<Map<String, Object>> getAverageRating(@PathVariable Long doctorId) {
        BigDecimal avg = ratingService.getAverageRating(doctorId);
        Map<String, Object> map = new HashMap<>();
        map.put("averageRating", avg);
        return ResponseEntity.ok(map);
    }

    @GetMapping("/{doctorId}/distribution")
    public ResponseEntity<Map<Integer, Long>> getDistribution(@PathVariable Long doctorId) {
        return ResponseEntity.ok(ratingService.getRatingDistribution(doctorId));
    }
}
