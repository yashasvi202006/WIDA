package com.meditrack.doctor.repository;

import com.meditrack.doctor.entity.DoctorRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DoctorRatingRepository extends JpaRepository<DoctorRating, Long> {
    List<DoctorRating> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);
}
