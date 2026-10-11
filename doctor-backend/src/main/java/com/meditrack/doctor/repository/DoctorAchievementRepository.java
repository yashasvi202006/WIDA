package com.meditrack.doctor.repository;

import com.meditrack.doctor.entity.DoctorAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorAchievementRepository extends JpaRepository<DoctorAchievement, Long> {
    List<DoctorAchievement> findByDoctorId(Long doctorId);
    Optional<DoctorAchievement> findByDoctorIdAndBadgeKey(Long doctorId, String badgeKey);
}
