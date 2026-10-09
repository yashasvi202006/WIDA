package com.meditrack.doctor.service.impl;

import com.meditrack.doctor.dto.PrescriptionCreateRequest;
import com.meditrack.doctor.dto.PrescriptionDto;
import com.meditrack.doctor.dto.PrescriptionItemDto;
import com.meditrack.doctor.entity.Doctor;
import com.meditrack.doctor.entity.DoctorNotification;
import com.meditrack.doctor.entity.Prescription;
import com.meditrack.doctor.entity.PrescriptionItem;
import com.meditrack.doctor.enums.NotificationType;
import com.meditrack.doctor.exception.ResourceNotFoundException;
import com.meditrack.doctor.exception.UnauthorizedAccessException;
import com.meditrack.doctor.repository.DoctorNotificationRepository;
import com.meditrack.doctor.repository.DoctorRepository;
import com.meditrack.doctor.repository.PrescriptionRepository;
import com.meditrack.doctor.service.DoctorPrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class DoctorPrescriptionServiceImpl implements DoctorPrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorNotificationRepository notificationRepository;

    @Override
    public PrescriptionDto createPrescription(Long doctorId, PrescriptionCreateRequest request) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        Prescription prescription = new Prescription();
        prescription.setPrescriptionNumber("RX-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        prescription.setDoctorId(doctorId);
        prescription.setPatientId(request.getPatientId());
        prescription.setPatientName(request.getPatientName());
        prescription.setConsultationId(request.getConsultationId());
        prescription.setAppointmentId(request.getAppointmentId());
        prescription.setPrescriptionDate(LocalDate.now());
        prescription.setGeneralAdvice(request.getGeneralAdvice());
        prescription.setPharmacyStatus("PENDING_DISPENSE"); // Integration contract for Pharmacy Module

        List<PrescriptionItem> items = new ArrayList<>();
        if (request.getItems() != null) {
            for (PrescriptionItemDto itemDto : request.getItems()) {
                PrescriptionItem item = new PrescriptionItem();
                item.setMedicineName(itemDto.getMedicineName().trim());
                item.setDosage(itemDto.getDosage().trim());
                item.setFrequency(itemDto.getFrequency().trim());
                item.setDuration(itemDto.getDuration().trim());
                item.setInstructions(itemDto.getInstructions().trim());
                items.add(item);
            }
        }
        prescription.setItems(items);

        Prescription saved = prescriptionRepository.save(prescription);

        // Notify
        DoctorNotification notif = new DoctorNotification();
        notif.setDoctorId(doctorId);
        notif.setTitle("Prescription Issued");
        notif.setMessage(String.format("Prescription %s generated for %s (%d medicines). Forwarded to pharmacy integration queue.",
                saved.getPrescriptionNumber(), saved.getPatientName(), saved.getItems().size()));
        notif.setType(NotificationType.PRESCRIPTION_ALERT);
        notif.setReferenceId(saved.getPrescriptionNumber());
        notificationRepository.save(notif);

        return mapToDto(saved, doctor);
    }

    @Override
    @Transactional(readOnly = true)
    public PrescriptionDto getPrescriptionById(Long doctorId, Long prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription", "id", prescriptionId));

        if (!prescription.getDoctorId().equals(doctorId)) {
            throw new UnauthorizedAccessException("You are not authorized to view this prescription.");
        }

        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
        return mapToDto(prescription, doctor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionDto> getPrescriptions(Long doctorId, String patientId) {
        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
        List<Prescription> list;

        if (patientId != null && !patientId.trim().isEmpty()) {
            list = prescriptionRepository.findByDoctorIdAndPatientIdOrderByPrescriptionDateDesc(doctorId, patientId.trim());
        } else {
            list = prescriptionRepository.findByDoctorIdOrderByPrescriptionDateDesc(doctorId);
        }

        return list.stream().map(p -> mapToDto(p, doctor)).collect(Collectors.toList());
    }

    private PrescriptionDto mapToDto(Prescription p, Doctor doc) {
        PrescriptionDto dto = new PrescriptionDto();
        dto.setId(p.getId());
        dto.setPrescriptionNumber(p.getPrescriptionNumber());
        dto.setConsultationId(p.getConsultationId());
        dto.setAppointmentId(p.getAppointmentId());
        dto.setDoctorId(p.getDoctorId());
        dto.setPatientId(p.getPatientId());
        dto.setPatientName(p.getPatientName());
        dto.setPrescriptionDate(p.getPrescriptionDate().toString());
        dto.setGeneralAdvice(p.getGeneralAdvice());
        dto.setPharmacyStatus(p.getPharmacyStatus());

        if (doc != null) {
            dto.setDoctorName(doc.getFullName());
            dto.setDoctorSpecialization(doc.getSpecializationName());
            dto.setDoctorQualification(doc.getQualification());
            dto.setDoctorClinic(doc.getHospitalClinicName());
        }

        if (p.getItems() != null) {
            dto.setItems(p.getItems().stream().map(item -> {
                PrescriptionItemDto itemDto = new PrescriptionItemDto();
                itemDto.setId(item.getId());
                itemDto.setMedicineName(item.getMedicineName());
                itemDto.setDosage(item.getDosage());
                itemDto.setFrequency(item.getFrequency());
                itemDto.setDuration(item.getDuration());
                itemDto.setInstructions(item.getInstructions());
                return itemDto;
            }).collect(Collectors.toList()));
        }

        return dto;
    }
}
