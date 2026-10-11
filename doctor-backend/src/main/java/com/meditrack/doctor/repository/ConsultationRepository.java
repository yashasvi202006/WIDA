package com.meditrack.doctor.repository;

import com.meditrack.doctor.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    List<Consultation> findByDoctorIdOrderByConsultationDateDesc(Long doctorId);

    List<Consultation> findByDoctorIdAndPatientIdOrderByConsultationDateDesc(Long doctorId, String patientId);

    List<Consultation> findByDoctorIdAndPatientNameContainingIgnoreCaseOrderByConsultationDateDesc(Long doctorId, String patientName);

    Optional<Consultation> findByAppointmentId(Long appointmentId);

    Optional<Consultation> findByConsultationNumber(String consultationNumber);

    long countByDoctorId(Long doctorId);
}
