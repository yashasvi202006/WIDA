package com.wida.patient.backend.model;

import java.util.List;

public class EmergencyRequest {
    public String id;
    public String patientId;
    public String timestamp;
    public String location;
    public String status; // 'Alert Sent' | 'Request Received' | 'Response Assigned' | 'Ambulance Dispatched' | 'Hospital Notified' | 'Arrived'
    public String ambulanceNumber;
    public String hospitalName;
    public Integer etaMinutes;
    public String paramedicContact;
    public CriticalDetails criticalDetailsShared;

    public static class CriticalDetails {
        public String bloodGroup;
        public List<String> allergies;
        public List<String> chronicConditions;
        public String emergencyContact;
    }
}
