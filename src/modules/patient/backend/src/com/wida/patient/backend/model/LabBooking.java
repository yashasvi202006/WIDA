package com.wida.patient.backend.model;

public class LabBooking {
    public String id;
    public String testId;
    public String testName;
    public String labId;
    public String labName;
    public String date;
    public String time;
    public String collectionType; // 'Visit Lab' | 'Home Sample Collection'
    public String status; // 'Booked' | 'Sample Collected' | 'Report Ready'
    public double price;
}
