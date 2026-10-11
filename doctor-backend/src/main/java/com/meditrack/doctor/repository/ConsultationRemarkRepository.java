package com.meditrack.doctor.repository;

import com.meditrack.doctor.entity.ConsultationRemark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConsultationRemarkRepository extends JpaRepository<ConsultationRemark, Long> {
    List<ConsultationRemark> findByConsultationId(Long consultationId);
    List<ConsultationRemark> findByDoctorIdAndPatientId(Long doctorId, String patientId);
}
