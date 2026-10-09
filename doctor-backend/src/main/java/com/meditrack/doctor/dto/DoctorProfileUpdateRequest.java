package com.meditrack.doctor.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class DoctorProfileUpdateRequest {

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Hospital/clinic name is required")
    private String hospitalClinicName;

    private String address;
    private String city;
    private String state;
    private String pincode;

    @NotNull(message = "Consultation fee is required")
    @DecimalMin(value = "0.0", message = "Consultation fee cannot be negative")
    private BigDecimal consultationFee;

    private String languagesKnown;
    private String professionalBio;
    private String profilePhotoUrl;
    private String subSpecialization;

    public DoctorProfileUpdateRequest() {}

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getHospitalClinicName() { return hospitalClinicName; }
    public void setHospitalClinicName(String hospitalClinicName) { this.hospitalClinicName = hospitalClinicName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public BigDecimal getConsultationFee() { return consultationFee; }
    public void setConsultationFee(BigDecimal consultationFee) { this.consultationFee = consultationFee; }

    public String getLanguagesKnown() { return languagesKnown; }
    public void setLanguagesKnown(String languagesKnown) { this.languagesKnown = languagesKnown; }

    public String getProfessionalBio() { return professionalBio; }
    public void setProfessionalBio(String professionalBio) { this.professionalBio = professionalBio; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public String getSubSpecialization() { return subSpecialization; }
    public void setSubSpecialization(String subSpecialization) { this.subSpecialization = subSpecialization; }
}
