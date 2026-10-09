package com.meditrack.doctor.validation;

import com.meditrack.doctor.dto.AppointmentRescheduleRequest;
import com.meditrack.doctor.enums.AppointmentStatus;
import com.meditrack.doctor.exception.ValidationException;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class AppointmentValidator {

    public void validateReschedule(AppointmentRescheduleRequest request, AppointmentStatus currentStatus) {
        if (request == null) {
            throw new ValidationException("Reschedule payload cannot be empty");
        }

        if (currentStatus == AppointmentStatus.COMPLETED) {
            throw new ValidationException("Cannot reschedule an already completed appointment");
        }

        if (currentStatus == AppointmentStatus.CANCELLED) {
            throw new ValidationException("Cannot reschedule a cancelled appointment");
        }

        if (request.getNewDate() == null) {
            throw new ValidationException("New appointment date is required");
        }

        if (request.getNewDate().isBefore(LocalDate.now())) {
            throw new ValidationException("Rescheduled date cannot be in the past");
        }

        if (request.getNewTime() == null || request.getNewTime().trim().isEmpty()) {
            throw new ValidationException("New appointment time slot is required");
        }
    }
}
