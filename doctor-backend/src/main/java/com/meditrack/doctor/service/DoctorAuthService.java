package com.meditrack.doctor.service;

import com.meditrack.doctor.dto.DoctorAuthResponse;
import com.meditrack.doctor.dto.DoctorLoginRequest;
import com.meditrack.doctor.dto.DoctorRegisterRequest;

public interface DoctorAuthService {
    DoctorAuthResponse register(DoctorRegisterRequest request);
    DoctorAuthResponse login(DoctorLoginRequest request);
    DoctorAuthResponse getCurrentDoctor(Long doctorId);
}
