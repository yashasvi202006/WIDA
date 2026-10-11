package com.meditrack.doctor.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MedicalReportDto {

    private Long id;
    private String reportNumber;
    private String patientId;
    private String patientName;
    private Long doctorId;
    private Long testRequestId;
    private String testName;
    private LocalDate reportDate;
    private String resultSummary;
    private String resultStatus; // NORMAL, ABNORMAL, CRITICAL
    private String labTechnicianName;
    private String reportFileUrl;
    private LocalDateTime createdAt;

    public MedicalReportDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReportNumber() { return reportNumber; }
    public void setReportNumber(String reportNumber) { this.reportNumber = reportNumber; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public Long getTestRequestId() { return testRequestId; }
    public void setTestRequestId(Long testRequestId) { this.testRequestId = testRequestId; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public LocalDate getReportDate() { return reportDate; }
    public void setReportDate(LocalDate reportDate) { this.reportDate = reportDate; }

    public String getResultSummary() { return resultSummary; }
    public void setResultSummary(String resultSummary) { this.resultSummary = resultSummary; }

    public String getResultStatus() { return resultStatus; }
    public void setResultStatus(String resultStatus) { this.resultStatus = resultStatus; }

    public String getLabTechnicianName() { return labTechnicianName; }
    public void setLabTechnicianName(String labTechnicianName) { this.labTechnicianName = labTechnicianName; }

    public String getReportFileUrl() { return reportFileUrl; }
    public void setReportFileUrl(String reportFileUrl) { this.reportFileUrl = reportFileUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
