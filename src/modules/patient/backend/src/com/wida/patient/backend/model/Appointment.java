package com.wida.patient.backend.model;

public class Appointment {
    public String id;
    public String doctorId;
    public String doctorName;
    public String doctorSpecialization;
    public String doctorAvatar;
    public String date;
    public String time;
    public String type; // 'Online' | 'In-person'
    public String status; // 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'Rescheduled'
    public String reason;
    public double fee;
    public String joinUrl;
    public String location;
    public String doctorRemarks;
}
