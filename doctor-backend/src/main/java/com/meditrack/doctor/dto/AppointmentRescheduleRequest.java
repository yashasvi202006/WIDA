package com.meditrack.doctor.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class AppointmentRescheduleRequest {

    @NotNull(message = "New appointment date is required")
    @FutureOrPresent(message = "Date cannot be in the past")
    private LocalDate newDate;

    @NotBlank(message = "New appointment time is required")
    private String newTime;

    private String rescheduleReason;

    public AppointmentRescheduleRequest() {}

    public AppointmentRescheduleRequest(LocalDate newDate, String newTime, String rescheduleReason) {
        this.newDate = newDate;
        this.newTime = newTime;
        this.rescheduleReason = rescheduleReason;
    }

    public LocalDate getNewDate() { return newDate; }
    public void setNewDate(LocalDate newDate) { this.newDate = newDate; }

    public String getNewTime() { return newTime; }
    public void setNewTime(String newTime) { this.newTime = newTime; }

    public String getRescheduleReason() { return rescheduleReason; }
    public void setRescheduleReason(String rescheduleReason) { this.rescheduleReason = rescheduleReason; }
}
