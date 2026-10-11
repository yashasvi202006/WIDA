package com.wida.patient.backend.model;

import java.util.List;

public class Prescription {
    public String id;
    public String doctorId;
    public String doctorName;
    public String doctorSpecialization;
    public String date;
    public String expiryDate;
    public String status; // 'Active' | 'Completed' | 'Expired' | 'Partially fulfilled'
    public String diagnosis;
    public List<Medicine> medicines;
    public String instructions;
    public String dispensedBy;
    public boolean isSentToPharmacy;

    public static class Medicine {
        public String id;
        public String name;
        public String dosage;
        public String frequency;
        public String duration;
        public String instructions;
        public List<String> timing;
        public Double price;
        public Integer quantity;
    }
}
