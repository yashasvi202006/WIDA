package com.meditrack.doctor.service;

import com.meditrack.doctor.dto.PrescriptionCreateRequest;
import com.meditrack.doctor.dto.PrescriptionDto;
import java.util.List;

public interface DoctorPrescriptionService {
    PrescriptionDto createPrescription(Long doctorId, PrescriptionCreateRequest request);
    PrescriptionDto getPrescriptionById(Long doctorId, Long prescriptionId);
    List<PrescriptionDto> getPrescriptions(Long doctorId, String patientId);
}
