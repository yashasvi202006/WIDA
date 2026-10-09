package com.meditrack.doctor.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

public class PrescriptionCreateRequest {

    private Long consultationId;
    private Long appointmentId;

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Patient name is required")
    private String patientName;

    private String generalAdvice;

    @NotEmpty(message = "At least one medicine is required")
    @Valid
    private List<PrescriptionItemDto> items = new ArrayList<>();

    public PrescriptionCreateRequest() {}

    public Long getConsultationId() { return consultationId; }
    public void setConsultationId(Long consultationId) { this.consultationId = consultationId; }

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getGeneralAdvice() { return generalAdvice; }
    public void setGeneralAdvice(String generalAdvice) { this.generalAdvice = generalAdvice; }

    public List<PrescriptionItemDto> getItems() { return items; }
    public void setItems(List<PrescriptionItemDto> items) { this.items = items; }
}
