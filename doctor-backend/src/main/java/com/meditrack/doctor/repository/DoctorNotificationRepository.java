package com.meditrack.doctor.repository;

import com.meditrack.doctor.entity.DoctorNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DoctorNotificationRepository extends JpaRepository<DoctorNotification, Long> {
    List<DoctorNotification> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);
    List<DoctorNotification> findByDoctorIdAndIsReadFalseOrderByCreatedAtDesc(Long doctorId);
    long countByDoctorIdAndIsReadFalse(Long doctorId);
}
