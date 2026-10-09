package com.meditrack.doctor.service;

import com.meditrack.doctor.dto.DoctorProfileDto;
import com.meditrack.doctor.dto.DoctorProfileUpdateRequest;
import com.meditrack.doctor.dto.DoctorVerificationDto;

public interface DoctorProfileService {
    DoctorProfileDto getProfile(Long doctorId);
    DoctorProfileDto updateProfile(Long doctorId, DoctorProfileUpdateRequest request);
    DoctorVerificationDto getVerificationStatus(Long doctorId);
    DoctorVerificationDto requestVerificationReview(Long doctorId, String documentName, String documentType, String documentUrl);
}
