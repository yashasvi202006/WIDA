package com.wida.patient.backend.model;

import java.util.List;

public class LabReport {
    public String id;
    public String testId;
    public String testName;
    public String labName;
    public String date;
    public String doctorName;
    public String status; // 'Processing' | 'Ready' | 'Reviewed' | 'Shared'
    public List<LabParameter> parameters;
    public String overallConclusion;
    public String doctorNotes;
    public String pdfUrl;
    public boolean isVerified;

    public static class LabParameter {
        public String name;
        public String value;
        public String unit;
        public String normalRange;
        public String status; // 'Normal' | 'Elevated' | 'Low'

        public LabParameter() {}
        public LabParameter(String name, String value, String unit, String normalRange, String status) {
            this.name = name;
            this.value = value;
            this.unit = unit;
            this.normalRange = normalRange;
            this.status = status;
        }
    }
}
