package com.meditrack.doctor.repository;

import com.meditrack.doctor.entity.Appointment;
import com.meditrack.doctor.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(Long doctorId);

    List<Appointment> findByDoctorIdAndStatusOrderByAppointmentDateAscAppointmentTimeAsc(Long doctorId, AppointmentStatus status);

    List<Appointment> findByDoctorIdAndAppointmentDateOrderByAppointmentTimeAsc(Long doctorId, LocalDate date);

    List<Appointment> findByDoctorIdAndAppointmentDateBetweenOrderByAppointmentDateAscAppointmentTimeAsc(
            Long doctorId, LocalDate startDate, LocalDate endDate);

    List<Appointment> findByDoctorIdAndPatientNameContainingIgnoreCaseOrderByAppointmentDateDesc(
            Long doctorId, String patientName);

    Optional<Appointment> findByAppointmentNumber(String appointmentNumber);

    long countByDoctorIdAndStatus(Long doctorId, AppointmentStatus status);

    long countByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);

    @Query("SELECT DISTINCT a.patientId FROM Appointment a WHERE a.doctorId = :doctorId")
    List<String> findDistinctPatientIdsByDoctorId(@Param("doctorId") Long doctorId);
}
