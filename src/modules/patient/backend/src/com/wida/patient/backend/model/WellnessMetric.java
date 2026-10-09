package com.wida.patient.backend.model;

public class WellnessMetric {
    public String id;
    public String name;
    public Object value; // e.g. "118/76" or 72
    public String unit;
    public String status; // 'Normal' | 'Optimal' | 'Attention' | 'Warning'
    public String trend;
    public String trendDirection; // 'up' | 'down' | 'stable'
    public String lastUpdated;
    public String target;
}
