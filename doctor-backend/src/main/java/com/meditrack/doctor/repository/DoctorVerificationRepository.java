package com.meditrack.doctor.repository;

import com.meditrack.doctor.entity.DoctorVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DoctorVerificationRepository extends JpaRepository<DoctorVerification, Long> {
    Optional<DoctorVerification> findByDoctorId(Long doctorId);
}
