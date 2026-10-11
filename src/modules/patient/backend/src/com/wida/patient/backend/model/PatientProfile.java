package com.wida.patient.backend.model;

import java.util.List;
import java.util.Map;

public class PatientProfile {
    public String id;
    public String abhaId;
    public String name;
    public String email;
    public String phone;
    public String dob;
    public String gender;
    public String address;
    public String avatarUrl;
    public String bloodGroup;
    public String height;
    public String weight;
    public String bmi;
    public EmergencyContact emergencyContact;
    public List<String> allergies;
    public List<String> chronicConditions;
    public List<String> currentMedications;
    public Lifestyle lifestyle;

    public static class EmergencyContact {
        public String name;
        public String relationship;
        public String phone;

        public EmergencyContact() {}
        public EmergencyContact(String name, String relationship, String phone) {
            this.name = name;
            this.relationship = relationship;
            this.phone = phone;
        }
    }

    public static class Lifestyle {
        public String smoking;
        public String alcohol;
        public String activityLevel;

        public Lifestyle() {}
        public Lifestyle(String smoking, String alcohol, String activityLevel) {
            this.smoking = smoking;
            this.alcohol = alcohol;
            this.activityLevel = activityLevel;
        }
    }
}
