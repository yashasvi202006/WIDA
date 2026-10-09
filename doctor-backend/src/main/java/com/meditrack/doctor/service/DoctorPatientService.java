package com.meditrack.doctor.service;

import com.meditrack.doctor.dto.PatientMedicalHistoryDto;
import com.meditrack.doctor.dto.PatientSummaryDto;
import java.util.List;

public interface DoctorPatientService {
    List<PatientSummaryDto> getAuthorizedPatients(Long doctorId, String search);

    PatientSummaryDto getPatientDetails(Long doctorId, String patientId);

    PatientMedicalHistoryDto getPatientMedicalHistory(Long doctorId, String patientId);
}
