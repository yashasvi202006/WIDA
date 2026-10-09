package com.wida.patient.backend.model;

import java.util.List;

public class Doctor {
    public String id;
    public String name;
    public String photo;
    public boolean verified;
    public String specialization;
    public int experience;
    public double rating;
    public int patientsCount;
    public double consultationFee;
    public String location;
    public String hospital;
    public String availability;
    public String medicineSystem; // 'Allopathy' | 'Ayurveda' | 'Homeopathy'
    public String about;
    public List<String> education;
    public List<String> languages;
    public List<String> achievements;
    public List<String> availableSlots;
}
