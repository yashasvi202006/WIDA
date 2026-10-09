package com.meditrack.doctor.repository;

import com.meditrack.doctor.entity.DoctorSpecialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorSpecializationRepository extends JpaRepository<DoctorSpecialization, Long> {
    List<DoctorSpecialization> findAllByOrderByNameAsc();
    Optional<DoctorSpecialization> findByNameIgnoreCase(String name);
}
