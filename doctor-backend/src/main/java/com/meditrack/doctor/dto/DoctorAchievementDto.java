package com.meditrack.doctor.dto;

import java.time.LocalDate;

public class DoctorAchievementDto {

    private Long id;
    private Long doctorId;
    private String badgeKey;
    private String title;
    private String description;
    private String icon;
    private Boolean isUnlocked;
    private Integer progress;
    private Integer maxProgress;
    private LocalDate awardedDate;

    public DoctorAchievementDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public String getBadgeKey() { return badgeKey; }
    public void setBadgeKey(String badgeKey) { this.badgeKey = badgeKey; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public Boolean getIsUnlocked() { return isUnlocked; }
    public void setIsUnlocked(Boolean isUnlocked) { this.isUnlocked = isUnlocked; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public Integer getMaxProgress() { return maxProgress; }
    public void setMaxProgress(Integer maxProgress) { this.maxProgress = maxProgress; }

    public LocalDate getAwardedDate() { return awardedDate; }
    public void setAwardedDate(LocalDate awardedDate) { this.awardedDate = awardedDate; }
}
