package com.meditrack.doctor.repository;

import com.meditrack.doctor.entity.DiagnosticTestRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiagnosticTestRequestRepository extends JpaRepository<DiagnosticTestRequest, Long> {

    List<DiagnosticTestRequest> findByDoctorIdOrderByRequestedDateDesc(Long doctorId);

    List<DiagnosticTestRequest> findByDoctorIdAndPatientIdOrderByRequestedDateDesc(Long doctorId, String patientId);

    Optional<DiagnosticTestRequest> findByRequestNumber(String requestNumber);
}
