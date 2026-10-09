package com.meditrack.doctor.repository;

import com.meditrack.doctor.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    List<Prescription> findByDoctorIdOrderByPrescriptionDateDesc(Long doctorId);

    List<Prescription> findByDoctorIdAndPatientIdOrderByPrescriptionDateDesc(Long doctorId, String patientId);

    Optional<Prescription> findByPrescriptionNumber(String prescriptionNumber);

    Optional<Prescription> findByConsultationId(Long consultationId);

    Optional<Prescription> findByAppointmentId(Long appointmentId);
}
