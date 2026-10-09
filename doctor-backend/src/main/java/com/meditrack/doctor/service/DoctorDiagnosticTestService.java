package com.meditrack.doctor.service;

import com.meditrack.doctor.dto.DiagnosticTestCreateRequest;
import com.meditrack.doctor.dto.DiagnosticTestRequestDto;
import java.util.List;

public interface DoctorDiagnosticTestService {
    DiagnosticTestRequestDto requestTest(Long doctorId, DiagnosticTestCreateRequest request);
    List<DiagnosticTestRequestDto> getDoctorTestRequests(Long doctorId, String patientId);
    List<String> getCatalogTestNames();
}
