package com.meditrack.doctor.dto;

import com.meditrack.doctor.enums.TestPriority;
import com.meditrack.doctor.enums.TestStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class DiagnosticTestRequestDto {

    private Long id;
    private String requestNumber;
    private Long doctorId;
    private String doctorName;
    private String patientId;
    private String patientName;
    private Long appointmentId;
    private String testName;
    private TestPriority priority;
    private String clinicalReason;
    private String specialInstructions;
    private TestStatus status;
    private LocalDate requestedDate;
    private LocalDateTime createdAt;

    public DiagnosticTestRequestDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequestNumber() { return requestNumber; }
    public void setRequestNumber(String requestNumber) { this.requestNumber = requestNumber; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public TestPriority getPriority() { return priority; }
    public void setPriority(TestPriority priority) { this.priority = priority; }

    public String getClinicalReason() { return clinicalReason; }
    public void setClinicalReason(String clinicalReason) { this.clinicalReason = clinicalReason; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }

    public TestStatus getStatus() { return status; }
    public void setStatus(TestStatus status) { this.status = status; }

    public LocalDate getRequestedDate() { return requestedDate; }
    public void setRequestedDate(LocalDate requestedDate) { this.requestedDate = requestedDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
