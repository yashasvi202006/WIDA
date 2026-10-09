package com.meditrack.doctor.exception;

public class DoctorModuleException extends RuntimeException {
    public DoctorModuleException(String message) {
        super(message);
    }
    public DoctorModuleException(String message, Throwable cause) {
        super(message, cause);
    }
}
