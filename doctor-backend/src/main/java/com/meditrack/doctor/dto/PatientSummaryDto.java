package com.meditrack.doctor.dto;

import java.time.LocalDate;

public class PatientSummaryDto {

    private Long id;
    private String patientId;
    private String fullName;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private String phone;
    private String email;
    private String allergies;
    private String chronicConditions;
    private LocalDate lastAppointmentDate;
    private LocalDate lastConsultationDate;
    private String status;

    public PatientSummaryDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public String getChronicConditions() { return chronicConditions; }
    public void setChronicConditions(String chronicConditions) { this.chronicConditions = chronicConditions; }

    public LocalDate getLastAppointmentDate() { return lastAppointmentDate; }
    public void setLastAppointmentDate(LocalDate lastAppointmentDate) { this.lastAppointmentDate = lastAppointmentDate; }

    public LocalDate getLastConsultationDate() { return lastConsultationDate; }
    public void setLastConsultationDate(LocalDate lastConsultationDate) { this.lastConsultationDate = lastConsultationDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
