package com.wida.patient.backend.model;

public class Reminder {
    public String id;
    public String type; // 'Medicine' | 'Appointment' | 'Lab' | 'Wellness' | 'Follow-up' | 'Custom'
    public String title;
    public String description;
    public String date;
    public String time;
    public String repeat; // 'Once' | 'Daily' | 'Weekly' | 'Custom'
    public String status; // 'Upcoming' | 'Taken' | 'Skipped' | 'Missed' | 'Completed'
    public String relatedEntityId;
    public String priority;
    public String dosage;
    public String instructions;
}
