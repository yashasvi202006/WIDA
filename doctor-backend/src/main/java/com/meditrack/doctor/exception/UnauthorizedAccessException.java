package com.meditrack.doctor.exception;

public class UnauthorizedAccessException extends DoctorModuleException {
    public UnauthorizedAccessException(String message) {
        super(message);
    }
}
