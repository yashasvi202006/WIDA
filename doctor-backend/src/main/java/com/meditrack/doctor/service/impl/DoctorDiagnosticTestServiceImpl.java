package com.meditrack.doctor.service.impl;

import com.meditrack.doctor.dto.DiagnosticTestCreateRequest;
import com.meditrack.doctor.dto.DiagnosticTestRequestDto;
import com.meditrack.doctor.entity.DiagnosticTestRequest;
import com.meditrack.doctor.entity.Doctor;
import com.meditrack.doctor.entity.DoctorNotification;
import com.meditrack.doctor.enums.NotificationType;
import com.meditrack.doctor.enums.TestStatus;
import com.meditrack.doctor.exception.ResourceNotFoundException;
import com.meditrack.doctor.repository.DiagnosticTestRequestRepository;
import com.meditrack.doctor.repository.DoctorNotificationRepository;
import com.meditrack.doctor.repository.DoctorRepository;
import com.meditrack.doctor.service.DoctorDiagnosticTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class DoctorDiagnosticTestServiceImpl implements DoctorDiagnosticTestService {

    @Autowired
    private DiagnosticTestRequestRepository diagnosticTestRequestRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorNotificationRepository notificationRepository;

    private static final List<String> CATALOG_TESTS = Arrays.asList(
            "Complete Blood Count (CBC)",
            "Fasting Blood Glucose",
            "Lipid Profile",
            "Thyroid Profile (T3, T4, TSH)",
            "Liver Function Test (LFT)",
            "Kidney Function Test (KFT)",
            "Routine Urine Examination",
            "Chest X-Ray PA View",
            "Brain MRI with Contrast",
            "Abdominal CT Scan",
            "ECG 12-Lead",
            "2D Echocardiogram",
            "Pelvic Ultrasound (USG)",
            "HbA1c Glycated Hemoglobin",
            "Serum Electrolytes (Na, K, Cl)"
    );

    @Override
    public DiagnosticTestRequestDto requestTest(Long doctorId, DiagnosticTestCreateRequest request) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        DiagnosticTestRequest testRequest = new DiagnosticTestRequest();
        testRequest.setRequestNumber("DTR-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        testRequest.setDoctorId(doctorId);
        testRequest.setPatientId(request.getPatientId());
        testRequest.setPatientName(request.getPatientName());
        testRequest.setAppointmentId(request.getAppointmentId());
        testRequest.setTestName(request.getTestName().trim());
        testRequest.setPriority(request.getPriority());
        testRequest.setClinicalReason(request.getClinicalReason().trim());
        testRequest.setSpecialInstructions(request.getSpecialInstructions());
        testRequest.setStatus(TestStatus.REQUESTED);
        testRequest.setRequestedDate(LocalDate.now());

        DiagnosticTestRequest saved = diagnosticTestRequestRepository.save(testRequest);

        // Notify
        DoctorNotification notif = new DoctorNotification();
        notif.setDoctorId(doctorId);
        notif.setTitle("Diagnostic Test Requested");
        notif.setMessage(String.format("Test '%s' requested for patient %s. Sent to laboratory requisition queue.",
                saved.getTestName(), saved.getPatientName()));
        notif.setType(NotificationType.SYSTEM);
        notif.setReferenceId(saved.getRequestNumber());
        notificationRepository.save(notif);

        return mapToDto(saved, doctor.getFullName());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DiagnosticTestRequestDto> getDoctorTestRequests(Long doctorId, String patientId) {
        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
        String doctorName = doctor != null ? doctor.getFullName() : "Dr. Specialist";

        List<DiagnosticTestRequest> list;
        if (patientId != null && !patientId.trim().isEmpty()) {
            list = diagnosticTestRequestRepository.findByDoctorIdAndPatientIdOrderByRequestedDateDesc(doctorId, patientId.trim());
        } else {
            list = diagnosticTestRequestRepository.findByDoctorIdOrderByRequestedDateDesc(doctorId);
        }

        return list.stream().map(t -> mapToDto(t, doctorName)).collect(Collectors.toList());
    }

    @Override
    public List<String> getCatalogTestNames() {
        return CATALOG_TESTS;
    }

    private DiagnosticTestRequestDto mapToDto(DiagnosticTestRequest t, String doctorName) {
        DiagnosticTestRequestDto dto = new DiagnosticTestRequestDto();
        dto.setId(t.getId());
        dto.setRequestNumber(t.getRequestNumber());
        dto.setDoctorId(t.getDoctorId());
        dto.setDoctorName(doctorName);
        dto.setPatientId(t.getPatientId());
        dto.setPatientName(t.getPatientName());
        dto.setAppointmentId(t.getAppointmentId());
        dto.setTestName(t.getTestName());
        dto.setPriority(t.getPriority());
        dto.setClinicalReason(t.getClinicalReason());
        dto.setSpecialInstructions(t.getSpecialInstructions());
        dto.setStatus(t.getStatus());
        dto.setRequestedDate(t.getRequestedDate());
        dto.setCreatedAt(t.getCreatedAt());
        return dto;
    }
}
