package com.meditrack.doctor.dto;

import com.meditrack.doctor.enums.VerificationStatus;
import java.time.LocalDateTime;

public class DoctorVerificationDto {

    private Long id;
    private Long doctorId;
    private VerificationStatus status;
    private String documentName;
    private String documentType;
    private String documentUrl;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private String reviewerRemarks;
    private String badgeText;

    public DoctorVerificationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public VerificationStatus getStatus() { return status; }
    public void setStatus(VerificationStatus status) {
        this.status = status;
        if (status == VerificationStatus.VERIFIED) {
            this.badgeText = "Verified \u2713";
        } else if (status == VerificationStatus.UNDER_REVIEW) {
            this.badgeText = "Verification Under Review";
        } else if (status == VerificationStatus.REJECTED) {
            this.badgeText = "Verification Rejected";
        } else {
            this.badgeText = "Verification Pending";
        }
    }

    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getDocumentUrl() { return documentUrl; }
    public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

    public String getReviewerRemarks() { return reviewerRemarks; }
    public void setReviewerRemarks(String reviewerRemarks) { this.reviewerRemarks = reviewerRemarks; }

    public String getBadgeText() { return badgeText; }
    public void setBadgeText(String badgeText) { this.badgeText = badgeText; }
}
