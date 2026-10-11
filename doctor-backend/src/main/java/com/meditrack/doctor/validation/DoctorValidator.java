package com.meditrack.doctor.validation;

import com.meditrack.doctor.dto.DoctorRegisterRequest;
import com.meditrack.doctor.exception.ValidationException;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.regex.Pattern;

@Component
public class DoctorValidator {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"
    );

    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );

    public void validateRegistration(DoctorRegisterRequest request) {
        if (request == null) {
            throw new ValidationException("Registration payload cannot be empty");
        }

        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new ValidationException("Full name is required");
        }

        if (request.getEmail() == null || !EMAIL_PATTERN.matcher(request.getEmail().trim()).matches()) {
            throw new ValidationException("Invalid email format");
        }

        if (request.getPassword() == null || request.getPassword().length() < 8) {
            throw new ValidationException("Password must be at least 8 characters long");
        }

        if (!PASSWORD_PATTERN.matcher(request.getPassword()).matches()) {
            throw new ValidationException("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
        }

        if (request.getConfirmPassword() == null || !request.getPassword().equals(request.getConfirmPassword())) {
            throw new ValidationException("Password and confirm password do not match");
        }

        if (request.getMedicalRegistrationNumber() == null || request.getMedicalRegistrationNumber().trim().isEmpty()) {
            throw new ValidationException("Medical registration number is mandatory");
        }

        if (request.getYearsOfExperience() != null && request.getYearsOfExperience() < 0) {
            throw new ValidationException("Experience cannot be negative");
        }

        if (request.getConsultationFee() != null && request.getConsultationFee().compareTo(BigDecimal.ZERO) < 0) {
            throw new ValidationException("Consultation fee cannot be negative");
        }

        if (request.getHospitalClinicName() == null || request.getHospitalClinicName().trim().isEmpty()) {
            throw new ValidationException("Hospital/clinic name is required");
        }
    }
}
