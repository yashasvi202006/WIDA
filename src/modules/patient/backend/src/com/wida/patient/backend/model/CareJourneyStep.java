package com.wida.patient.backend.model;

public class CareJourneyStep {
    public String id;
    public String title;
    public String subtitle;
    public String date;
    public String provider;
    public String status; // 'completed' | 'in_progress' | 'pending'
    public String icon;
    public String routeLink;
    public String details;
}
