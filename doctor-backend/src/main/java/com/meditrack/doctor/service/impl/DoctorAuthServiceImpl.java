package com.meditrack.doctor.service.impl;

import com.meditrack.doctor.dto.DoctorAuthResponse;
import com.meditrack.doctor.dto.DoctorLoginRequest;
import com.meditrack.doctor.dto.DoctorRegisterRequest;
import com.meditrack.doctor.entity.*;
import com.meditrack.doctor.enums.NotificationType;
import com.meditrack.doctor.enums.VerificationStatus;
import com.meditrack.doctor.exception.InvalidCredentialsException;
import com.meditrack.doctor.exception.ResourceNotFoundException;
import com.meditrack.doctor.exception.ValidationException;
import com.meditrack.doctor.repository.*;
import com.meditrack.doctor.service.DoctorAuthService;
import com.meditrack.doctor.validation.DoctorValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class DoctorAuthServiceImpl implements DoctorAuthService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorSpecializationRepository specializationRepository;

    @Autowired
    private DoctorVerificationRepository verificationRepository;

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    @Autowired
    private DoctorAchievementRepository achievementRepository;

    @Autowired
    private DoctorNotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DoctorValidator doctorValidator;

    @Override
    public DoctorAuthResponse register(DoctorRegisterRequest request) {
        doctorValidator.validateRegistration(request);

        if (doctorRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new ValidationException("An account with this email address already exists.");
        }

        if (doctorRepository.existsByMedicalRegistrationNumber(request.getMedicalRegistrationNumber().trim())) {
            throw new ValidationException("Medical registration number is already registered.");
        }

        // Fetch specialization name
        String specName = request.getSpecializationName();
        if (request.getSpecializationId() != null) {
            DoctorSpecialization spec = specializationRepository.findById(request.getSpecializationId()).orElse(null);
            if (spec != null) {
                specName = spec.getName();
            }
        }
        if (specName == null || specName.trim().isEmpty()) {
            specName = "General Physician";
        }

        Doctor doctor = new Doctor();
        doctor.setFullName(request.getFullName().trim());
        doctor.setEmail(request.getEmail().trim().toLowerCase());
        doctor.setPhoneNumber(request.getPhoneNumber().trim());
        doctor.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        doctor.setGender(request.getGender());
        doctor.setDateOfBirth(request.getDateOfBirth());
        doctor.setMedicalRegistrationNumber(request.getMedicalRegistrationNumber().trim());
        doctor.setQualification(request.getQualification().trim());
        doctor.setSpecializationId(request.getSpecializationId());
        doctor.setSpecializationName(specName);
        doctor.setSubSpecialization(request.getSubSpecialization());
        doctor.setYearsOfExperience(request.getYearsOfExperience() != null ? request.getYearsOfExperience() : 0);
        doctor.setHospitalClinicName(request.getHospitalClinicName().trim());
        doctor.setAddress(request.getAddress());
        doctor.setCity(request.getCity());
        doctor.setState(request.getState());
        doctor.setPincode(request.getPincode());
        doctor.setConsultationFee(request.getConsultationFee() != null ? request.getConsultationFee() : BigDecimal.ZERO);
        doctor.setLanguagesKnown(request.getLanguagesKnown());
        doctor.setProfessionalBio(request.getProfessionalBio());
        doctor.setProfilePhotoUrl(request.getProfilePhotoUrl() != null && !request.getProfilePhotoUrl().isEmpty() ?
                request.getProfilePhotoUrl() : "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80");
        doctor.setVerificationStatus(VerificationStatus.PENDING);
        doctor.setAverageRating(new BigDecimal("5.00"));
        doctor.setTotalRatings(0);
        doctor.setTotalPatients(0);
        doctor.setIsActive(true);

        Doctor savedDoctor = doctorRepository.save(doctor);

        // Create verification record
        DoctorVerification verification = new DoctorVerification();
        verification.setDoctorId(savedDoctor.getId());
        verification.setStatus(VerificationStatus.PENDING);
        verification.setDocumentName(request.getVerificationDocumentName() != null ? request.getVerificationDocumentName() : "Registration_Certificate.pdf");
        verification.setDocumentType(request.getVerificationDocumentType() != null ? request.getVerificationDocumentType() : "Medical Registration");
        verification.setDocumentUrl("/docs/verification-" + savedDoctor.getId() + ".pdf");
        verification.setReviewerRemarks("Registration submitted. Verification queue entry created.");
        verificationRepository.save(verification);

        // Seed initial availability (Mon - Fri 09:00 AM - 05:00 PM)
        List<String> weekdays = Arrays.asList("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY");
        for (String day : weekdays) {
            DoctorAvailability avail = new DoctorAvailability();
            avail.setDoctorId(savedDoctor.getId());
            avail.setDayOfWeek(day);
            avail.setIsAvailable(true);
            avail.setStartTime("09:00 AM");
            avail.setEndTime("05:00 PM");
            avail.setBreakStartTime("01:00 PM");
            avail.setBreakEndTime("02:00 PM");
            avail.setSlotDurationMinutes(30);
            availabilityRepository.save(avail);
        }
        // Saturday partial
        DoctorAvailability sat = new DoctorAvailability();
        sat.setDoctorId(savedDoctor.getId());
        sat.setDayOfWeek("SATURDAY");
        sat.setIsAvailable(true);
        sat.setStartTime("10:00 AM");
        sat.setEndTime("02:00 PM");
        sat.setSlotDurationMinutes(30);
        availabilityRepository.save(sat);
        // Sunday off
        DoctorAvailability sun = new DoctorAvailability();
        sun.setDoctorId(savedDoctor.getId());
        sun.setDayOfWeek("SUNDAY");
        sun.setIsAvailable(false);
        sun.setStartTime("00:00");
        sun.setEndTime("00:00");
        sun.setSlotDurationMinutes(30);
        availabilityRepository.save(sun);

        // Add welcome achievement
        DoctorAchievement achievement = new DoctorAchievement();
        achievement.setDoctorId(savedDoctor.getId());
        achievement.setBadgeKey("PROFILE_SETUP");
        achievement.setTitle("Healthcare Provider Profile Setup");
        achievement.setDescription("Completed doctor registration and joined the Meditrack clinical network.");
        achievement.setIcon("BadgeCheck");
        achievement.setIsUnlocked(true);
        achievement.setProgress(100);
        achievement.setMaxProgress(100);
        achievement.setAwardedDate(LocalDate.now());
        achievementRepository.save(achievement);

        // Welcome notification
        DoctorNotification notif = new DoctorNotification();
        notif.setDoctorId(savedDoctor.getId());
        notif.setTitle("Welcome to Meditrack Doctor Module");
        notif.setMessage("Your profile has been created. Medical verification is currently in PENDING state.");
        notif.setType(NotificationType.SYSTEM);
        notif.setReferenceId("WELCOME-" + savedDoctor.getId());
        notif.setIsRead(false);
        notificationRepository.save(notif);

        return mapToAuthResponse(savedDoctor, "Doctor registration completed successfully.");
    }

    @Override
    public DoctorAuthResponse login(DoctorLoginRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            throw new InvalidCredentialsException("Email and password are required.");
        }

        String inputEmail = request.getEmail().trim().toLowerCase();
        String altEmail = inputEmail.endsWith("@wida.org")
                ? inputEmail.replace("@wida.org", "@meditrack.org")
                : inputEmail.endsWith("@meditrack.org")
                    ? inputEmail.replace("@meditrack.org", "@wida.org")
                    : inputEmail;

        Doctor doctor = doctorRepository.findByEmail(inputEmail)
                .or(() -> doctorRepository.findByEmail(altEmail))
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), doctor.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        if (!Boolean.TRUE.equals(doctor.getIsActive())) {
            throw new InvalidCredentialsException("This doctor account is currently inactive. Please contact support.");
        }

        return mapToAuthResponse(doctor, "Login successful.");
    }

    @Override
    @Transactional(readOnly = true)
    public DoctorAuthResponse getCurrentDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));
        return mapToAuthResponse(doctor, "Doctor details retrieved successfully.");
    }

    private DoctorAuthResponse mapToAuthResponse(Doctor doctor, String message) {
        DoctorAuthResponse response = new DoctorAuthResponse();
        response.setToken("MEDITRACK-DOCTOR-JWT-" + UUID.randomUUID());
        response.setId(doctor.getId());
        response.setFullName(doctor.getFullName());
        response.setEmail(doctor.getEmail());
        response.setPhoneNumber(doctor.getPhoneNumber());
        response.setSpecializationName(doctor.getSpecializationName());
        response.setQualification(doctor.getQualification());
        response.setHospitalClinicName(doctor.getHospitalClinicName());
        response.setConsultationFee(doctor.getConsultationFee());
        response.setProfilePhotoUrl(doctor.getProfilePhotoUrl());
        response.setVerificationStatus(doctor.getVerificationStatus());
        response.setRole("ROLE_DOCTOR");
        response.setMessage(message);
        return response;
    }
}
