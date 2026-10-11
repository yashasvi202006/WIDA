package com.meditrack.doctor.repository;

import com.meditrack.doctor.entity.MedicalReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalReportRepository extends JpaRepository<MedicalReport, Long> {

    List<MedicalReport> findByDoctorIdOrderByReportDateDesc(Long doctorId);

    List<MedicalReport> findByDoctorIdAndPatientIdOrderByReportDateDesc(Long doctorId, String patientId);

    List<MedicalReport> findByDoctorIdAndPatientNameContainingIgnoreCaseOrderByReportDateDesc(Long doctorId, String patientName);

    Optional<MedicalReport> findByReportNumber(String reportNumber);
}
