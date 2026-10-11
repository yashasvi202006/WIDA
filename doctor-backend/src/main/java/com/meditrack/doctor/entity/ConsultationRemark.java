package com.meditrack.doctor.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultation_remarks")
public class ConsultationRemark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "consultation_id", nullable = false)
    private Long consultationId;

    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;

    @Column(name = "patient_id", nullable = false, length = 50)
    private String patientId;

    @Column(name = "remark_title", length = 150)
    private String remarkTitle;

    @Column(name = "remark_content", nullable = false, columnDefinition = "TEXT")
    private String remarkContent;

    @Column(name = "is_confidential")
    private Boolean isConfidential = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public ConsultationRemark() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getConsultationId() { return consultationId; }
    public void setConsultationId(Long consultationId) { this.consultationId = consultationId; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getRemarkTitle() { return remarkTitle; }
    public void setRemarkTitle(String remarkTitle) { this.remarkTitle = remarkTitle; }

    public String getRemarkContent() { return remarkContent; }
    public void setRemarkContent(String remarkContent) { this.remarkContent = remarkContent; }

    public Boolean getIsConfidential() { return isConfidential; }
    public void setIsConfidential(Boolean isConfidential) { this.isConfidential = isConfidential; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
