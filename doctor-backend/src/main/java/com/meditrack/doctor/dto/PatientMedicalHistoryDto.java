package com.meditrack.doctor.dto;

import java.util.ArrayList;
import java.util.List;

public class PatientMedicalHistoryDto {

    private PatientSummaryDto patient;
    private List<ConsultationDto> consultations = new ArrayList<>();
    private List<PrescriptionDto> prescriptions = new ArrayList<>();
    private List<MedicalReportDto> reports = new ArrayList<>();
    private List<String> doctorRemarks = new ArrayList<>();

    public PatientMedicalHistoryDto() {}

    public PatientSummaryDto getPatient() { return patient; }
    public void setPatient(PatientSummaryDto patient) { this.patient = patient; }

    public List<ConsultationDto> getConsultations() { return consultations; }
    public void setConsultations(List<ConsultationDto> consultations) { this.consultations = consultations; }

    public List<PrescriptionDto> getPrescriptions() { return prescriptions; }
    public void setPrescriptions(List<PrescriptionDto> prescriptions) { this.prescriptions = prescriptions; }

    public List<MedicalReportDto> getReports() { return reports; }
    public void setReports(List<MedicalReportDto> reports) { this.reports = reports; }

    public List<String> getDoctorRemarks() { return doctorRemarks; }
    public void setDoctorRemarks(List<String> doctorRemarks) { this.doctorRemarks = doctorRemarks; }
}
