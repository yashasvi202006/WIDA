package com.meditrack.doctor.service.impl;

import com.meditrack.doctor.dto.DoctorProfileDto;
import com.meditrack.doctor.dto.DoctorProfileUpdateRequest;
import com.meditrack.doctor.dto.DoctorVerificationDto;
import com.meditrack.doctor.entity.Doctor;
import com.meditrack.doctor.entity.DoctorVerification;
import com.meditrack.doctor.enums.VerificationStatus;
import com.meditrack.doctor.exception.ResourceNotFoundException;
import com.meditrack.doctor.repository.DoctorRepository;
import com.meditrack.doctor.repository.DoctorVerificationRepository;
import com.meditrack.doctor.service.DoctorProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class DoctorProfileServiceImpl implements DoctorProfileService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorVerificationRepository verificationRepository;

    @Override
    @Transactional(readOnly = true)
    public DoctorProfileDto getProfile(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));
        return mapToProfileDto(doctor);
    }

    @Override
    public DoctorProfileDto updateProfile(Long doctorId, DoctorProfileUpdateRequest request) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
            doctor.setPhoneNumber(request.getPhoneNumber().trim());
        }
        if (request.getHospitalClinicName() != null && !request.getHospitalClinicName().trim().isEmpty()) {
            doctor.setHospitalClinicName(request.getHospitalClinicName().trim());
        }
        if (request.getAddress() != null) doctor.setAddress(request.getAddress().trim());
        if (request.getCity() != null) doctor.setCity(request.getCity().trim());
        if (request.getState() != null) doctor.setState(request.getState().trim());
        if (request.getPincode() != null) doctor.setPincode(request.getPincode().trim());
        if (request.getConsultationFee() != null) doctor.setConsultationFee(request.getConsultationFee());
        if (request.getLanguagesKnown() != null) doctor.setLanguagesKnown(request.getLanguagesKnown());
        if (request.getProfessionalBio() != null) doctor.setProfessionalBio(request.getProfessionalBio());
        if (request.getProfilePhotoUrl() != null && !request.getProfilePhotoUrl().trim().isEmpty()) {
            doctor.setProfilePhotoUrl(request.getProfilePhotoUrl().trim());
        }
        if (request.getSubSpecialization() != null) {
            doctor.setSubSpecialization(request.getSubSpecialization().trim());
        }

        Doctor updated = doctorRepository.save(doctor);
        return mapToProfileDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public DoctorVerificationDto getVerificationStatus(Long doctorId) {
        DoctorVerification verification = verificationRepository.findByDoctorId(doctorId)
                .orElseGet(() -> {
                    Doctor doctor = doctorRepository.findById(doctorId)
                            .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));
                    DoctorVerification fallback = new DoctorVerification();
                    fallback.setDoctorId(doctorId);
                    fallback.setStatus(doctor.getVerificationStatus());
                    fallback.setDocumentName("Registration_Certificate.pdf");
                    fallback.setDocumentType("Medical Registration");
                    fallback.setSubmittedAt(doctor.getCreatedAt());
                    fallback.setReviewerRemarks("Pending board verification review");
                    return fallback;
                });

        return mapToVerificationDto(verification);
    }

    @Override
    public DoctorVerificationDto requestVerificationReview(Long doctorId, String documentName, String documentType, String documentUrl) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        DoctorVerification verification = verificationRepository.findByDoctorId(doctorId)
                .orElse(new DoctorVerification());

        verification.setDoctorId(doctorId);
        verification.setStatus(VerificationStatus.UNDER_REVIEW);
        if (documentName != null) verification.setDocumentName(documentName);
        if (documentType != null) verification.setDocumentType(documentType);
        if (documentUrl != null) verification.setDocumentUrl(documentUrl);
        verification.setSubmittedAt(LocalDateTime.now());
        verification.setReviewerRemarks("Document re-submitted for review by the doctor. Review in progress.");

        DoctorVerification savedVerif = verificationRepository.save(verification);

        doctor.setVerificationStatus(VerificationStatus.UNDER_REVIEW);
        doctorRepository.save(doctor);

        return mapToVerificationDto(savedVerif);
    }

    private DoctorProfileDto mapToProfileDto(Doctor doctor) {
        DoctorProfileDto dto = new DoctorProfileDto();
        dto.setId(doctor.getId());
        dto.setFullName(doctor.getFullName());
        dto.setEmail(doctor.getEmail());
        dto.setPhoneNumber(doctor.getPhoneNumber());
        dto.setGender(doctor.getGender());
        dto.setDateOfBirth(doctor.getDateOfBirth());
        dto.setMedicalRegistrationNumber(doctor.getMedicalRegistrationNumber());
        dto.setQualification(doctor.getQualification());
        dto.setSpecializationId(doctor.getSpecializationId());
        dto.setSpecializationName(doctor.getSpecializationName());
        dto.setSubSpecialization(doctor.getSubSpecialization());
        dto.setYearsOfExperience(doctor.getYearsOfExperience());
        dto.setHospitalClinicName(doctor.getHospitalClinicName());
        dto.setAddress(doctor.getAddress());
        dto.setCity(doctor.getCity());
        dto.setState(doctor.getState());
        dto.setPincode(doctor.getPincode());
        dto.setConsultationFee(doctor.getConsultationFee());
        dto.setLanguagesKnown(doctor.getLanguagesKnown());
        dto.setProfessionalBio(doctor.getProfessionalBio());
        dto.setProfilePhotoUrl(doctor.getProfilePhotoUrl());
        dto.setVerificationStatus(doctor.getVerificationStatus());
        dto.setAverageRating(doctor.getAverageRating());
        dto.setTotalRatings(doctor.getTotalRatings());
        dto.setTotalPatients(doctor.getTotalPatients());
        dto.setCreatedAt(doctor.getCreatedAt());
        return dto;
    }

    private DoctorVerificationDto mapToVerificationDto(DoctorVerification verif) {
        DoctorVerificationDto dto = new DoctorVerificationDto();
        dto.setId(verif.getId());
        dto.setDoctorId(verif.getDoctorId());
        dto.setStatus(verif.getStatus());
        dto.setDocumentName(verif.getDocumentName());
        dto.setDocumentType(verif.getDocumentType());
        dto.setDocumentUrl(verif.getDocumentUrl());
        dto.setSubmittedAt(verif.getSubmittedAt());
        dto.setReviewedAt(verif.getReviewedAt());
        dto.setReviewerRemarks(verif.getReviewerRemarks());
        return dto;
    }
}
