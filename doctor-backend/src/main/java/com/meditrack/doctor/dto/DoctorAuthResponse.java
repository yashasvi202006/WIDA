package com.meditrack.doctor.dto;

import com.meditrack.doctor.enums.VerificationStatus;
import java.math.BigDecimal;

public class DoctorAuthResponse {

    private String token;
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String specializationName;
    private String qualification;
    private String hospitalClinicName;
    private BigDecimal consultationFee;
    private String profilePhotoUrl;
    private VerificationStatus verificationStatus;
    private String role = "ROLE_DOCTOR";
    private String message;

    public DoctorAuthResponse() {}

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getSpecializationName() { return specializationName; }
    public void setSpecializationName(String specializationName) { this.specializationName = specializationName; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getHospitalClinicName() { return hospitalClinicName; }
    public void setHospitalClinicName(String hospitalClinicName) { this.hospitalClinicName = hospitalClinicName; }

    public BigDecimal getConsultationFee() { return consultationFee; }
    public void setConsultationFee(BigDecimal consultationFee) { this.consultationFee = consultationFee; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
