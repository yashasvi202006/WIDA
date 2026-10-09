package com.meditrack.doctor.service.impl;

import com.meditrack.doctor.dto.*;
import com.meditrack.doctor.entity.*;
import com.meditrack.doctor.exception.ResourceNotFoundException;
import com.meditrack.doctor.exception.UnauthorizedAccessException;
import com.meditrack.doctor.repository.*;
import com.meditrack.doctor.service.DoctorPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DoctorPatientServiceImpl implements DoctorPatientService {

    @Autowired
    private PatientSummaryRepository patientSummaryRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicalReportRepository medicalReportRepository;

    @Override
    public List<PatientSummaryDto> getAuthorizedPatients(Long doctorId, String search) {
        List<PatientSummary> patients = patientSummaryRepository.findAuthorizedPatientsByDoctorId(doctorId);

        if (search != null && !search.trim().isEmpty()) {
            String lower = search.trim().toLowerCase();
            patients = patients.stream()
                    .filter(p -> p.getFullName().toLowerCase().contains(lower) ||
                                 p.getPatientId().toLowerCase().contains(lower))
                    .collect(Collectors.toList());
        }

        return patients.stream().map(p -> mapToSummaryDto(p, doctorId)).collect(Collectors.toList());
    }

    @Override
    public PatientSummaryDto getPatientDetails(Long doctorId, String patientId) {
        verifyDoctorPatientAuthorization(doctorId, patientId);

        PatientSummary patient = patientSummaryRepository.findByPatientId(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "patientId", patientId));

        return mapToSummaryDto(patient, doctorId);
    }

    @Override
    public PatientMedicalHistoryDto getPatientMedicalHistory(Long doctorId, String patientId) {
        verifyDoctorPatientAuthorization(doctorId, patientId);

        PatientSummary patient = patientSummaryRepository.findByPatientId(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "patientId", patientId));

        PatientMedicalHistoryDto historyDto = new PatientMedicalHistoryDto();
        historyDto.setPatient(mapToSummaryDto(patient, doctorId));

        // Authorized consultations
        List<Consultation> consultations = consultationRepository.findByDoctorIdAndPatientIdOrderByConsultationDateDesc(doctorId, patientId);
        historyDto.setConsultations(consultations.stream().map(this::mapToConsultationDto).collect(Collectors.toList()));

        // Remarks from consultations
        List<String> remarks = consultations.stream()
                .filter(c -> c.getDoctorRemarks() != null && !c.getDoctorRemarks().isEmpty())
                .map(Consultation::getDoctorRemarks)
                .collect(Collectors.toList());
        historyDto.setDoctorRemarks(remarks);

        // Authorized prescriptions
        List<Prescription> prescriptions = prescriptionRepository.findByDoctorIdAndPatientIdOrderByPrescriptionDateDesc(doctorId, patientId);
        historyDto.setPrescriptions(prescriptions.stream().map(this::mapToPrescriptionDto).collect(Collectors.toList()));

        // Authorized medical reports
        List<MedicalReport> reports = medicalReportRepository.findByDoctorIdAndPatientIdOrderByReportDateDesc(doctorId, patientId);
        historyDto.setReports(reports.stream().map(this::mapToReportDto).collect(Collectors.toList()));

        return historyDto;
    }

    private void verifyDoctorPatientAuthorization(Long doctorId, String patientId) {
        List<String> authorizedPatientIds = appointmentRepository.findDistinctPatientIdsByDoctorId(doctorId);
        if (!authorizedPatientIds.contains(patientId)) {
            throw new UnauthorizedAccessException("Patient record is not available for your account. No authorized clinical interaction exists.");
        }
    }

    private PatientSummaryDto mapToSummaryDto(PatientSummary p, Long doctorId) {
        PatientSummaryDto dto = new PatientSummaryDto();
        dto.setId(p.getId());
        dto.setPatientId(p.getPatientId());
        dto.setFullName(p.getFullName());
        dto.setAge(p.getAge());
        dto.setGender(p.getGender());
        dto.setBloodGroup(p.getBloodGroup());
        dto.setPhone(p.getPhone());
        dto.setEmail(p.getEmail());
        dto.setAllergies(p.getAllergies());
        dto.setChronicConditions(p.getChronicConditions());
        dto.setStatus("Active Care");

        List<Appointment> apts = appointmentRepository.findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(doctorId);
        apts.stream().filter(a -> a.getPatientId().equals(p.getPatientId())).findFirst().ifPresent(a -> {
            dto.setLastAppointmentDate(a.getAppointmentDate());
        });

        List<Consultation> cons = consultationRepository.findByDoctorIdAndPatientIdOrderByConsultationDateDesc(doctorId, p.getPatientId());
        if (!cons.isEmpty()) {
            dto.setLastConsultationDate(cons.get(0).getConsultationDate());
        }

        return dto;
    }

    private ConsultationDto mapToConsultationDto(Consultation c) {
        ConsultationDto dto = new ConsultationDto();
        dto.setId(c.getId());
        dto.setConsultationNumber(c.getConsultationNumber());
        dto.setAppointmentId(c.getAppointmentId());
        dto.setDoctorId(c.getDoctorId());
        dto.setPatientId(c.getPatientId());
        dto.setPatientName(c.getPatientName());
        dto.setConsultationDate(c.getConsultationDate());
        dto.setChiefComplaint(c.getChiefComplaint());
        dto.setSymptoms(c.getSymptoms());
        dto.setClinicalNotes(c.getClinicalNotes());
        dto.setDiagnosis(c.getDiagnosis());
        dto.setDoctorRemarks(c.getDoctorRemarks());
        dto.setFollowUpDate(c.getFollowUpDate());
        dto.setAdditionalNotes(c.getAdditionalNotes());
        dto.setStatus(c.getStatus());
        dto.setCreatedAt(c.getCreatedAt());
        return dto;
    }

    private PrescriptionDto mapToPrescriptionDto(Prescription p) {
        PrescriptionDto dto = new PrescriptionDto();
        dto.setId(p.getId());
        dto.setPrescriptionNumber(p.getPrescriptionNumber());
        dto.setConsultationId(p.getConsultationId());
        dto.setAppointmentId(p.getAppointmentId());
        dto.setDoctorId(p.getDoctorId());
        dto.setPatientId(p.getPatientId());
        dto.setPatientName(p.getPatientName());
        dto.setPrescriptionDate(p.getPrescriptionDate().toString());
        dto.setGeneralAdvice(p.getGeneralAdvice());
        dto.setPharmacyStatus(p.getPharmacyStatus());
        if (p.getItems() != null) {
            dto.setItems(p.getItems().stream().map(i ->
                    new PrescriptionItemDto(i.getMedicineName(), i.getDosage(), i.getFrequency(), i.getDuration(), i.getInstructions())
            ).collect(Collectors.toList()));
        }
        return dto;
    }

    private MedicalReportDto mapToReportDto(MedicalReport r) {
        MedicalReportDto dto = new MedicalReportDto();
        dto.setId(r.getId());
        dto.setReportNumber(r.getReportNumber());
        dto.setPatientId(r.getPatientId());
        dto.setPatientName(r.getPatientName());
        dto.setDoctorId(r.getDoctorId());
        dto.setTestRequestId(r.getTestRequestId());
        dto.setTestName(r.getTestName());
        dto.setReportDate(r.getReportDate());
        dto.setResultSummary(r.getResultSummary());
        dto.setResultStatus(r.getResultStatus());
        dto.setLabTechnicianName(r.getLabTechnicianName());
        dto.setReportFileUrl(r.getReportFileUrl());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}
