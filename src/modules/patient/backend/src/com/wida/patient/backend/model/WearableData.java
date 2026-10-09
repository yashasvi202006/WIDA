package com.wida.patient.backend.model;

public class WearableData {
    public String id;
    public String name;
    public String model;
    public String status;
    public String battery;
    public String lastSynced;
    public Metrics metrics;

    public static class Metrics {
        public int steps;
        public int heartRate;
        public double sleepHours;
        public int calories;
    }
}
