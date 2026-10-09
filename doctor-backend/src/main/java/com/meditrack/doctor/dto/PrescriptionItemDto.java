package com.meditrack.doctor.dto;

import jakarta.validation.constraints.NotBlank;

public class PrescriptionItemDto {

    private Long id;

    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    @NotBlank(message = "Dosage is required (e.g., 500 mg)")
    private String dosage;

    @NotBlank(message = "Frequency is required (e.g., 2 times/day)")
    private String frequency;

    @NotBlank(message = "Duration is required (e.g., 5 days)")
    private String duration;

    @NotBlank(message = "Instructions are required (e.g., After meals)")
    private String instructions;

    public PrescriptionItemDto() {}

    public PrescriptionItemDto(String medicineName, String dosage, String frequency, String duration, String instructions) {
        this.medicineName = medicineName;
        this.dosage = dosage;
        this.frequency = frequency;
        this.duration = duration;
        this.instructions = instructions;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
}
