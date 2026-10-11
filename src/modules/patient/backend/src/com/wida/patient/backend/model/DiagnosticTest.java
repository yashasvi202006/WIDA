package com.wida.patient.backend.model;

import java.util.List;

public class DiagnosticTest {
    public String id;
    public String name;
    public String category; // 'Full Body' | 'Blood' | 'Pathology' | 'Radiology' | 'Cardiology' | 'Preventive'
    public String description;
    public double price;
    public String preparation;
    public String turnaroundTime;
    public String sampleType;
    public Boolean popular;
    public List<String> recommendedFor;
}
