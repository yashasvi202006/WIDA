package com.meditrack.doctor.repository;

import com.meditrack.doctor.entity.PatientSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientSummaryRepository extends JpaRepository<PatientSummary, Long> {

    Optional<PatientSummary> findByPatientId(String patientId);

    List<PatientSummary> findByFullNameContainingIgnoreCase(String name);

    @Query("SELECT p FROM PatientSummary p WHERE p.patientId IN " +
           "(SELECT DISTINCT a.patientId FROM Appointment a WHERE a.doctorId = :doctorId)")
    List<PatientSummary> findAuthorizedPatientsByDoctorId(@Param("doctorId") Long doctorId);
}
