package com.meditrack.doctor.dto;

import com.meditrack.doctor.enums.TestPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DiagnosticTestCreateRequest {

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Patient name is required")
    private String patientName;

    private Long appointmentId;

    @NotBlank(message = "Test name is required")
    private String testName;

    @NotNull(message = "Priority is required")
    private TestPriority priority = TestPriority.ROUTINE;

    @NotBlank(message = "Clinical reason is required")
    private String clinicalReason;

    private String specialInstructions;

    public DiagnosticTestCreateRequest() {}

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
}
