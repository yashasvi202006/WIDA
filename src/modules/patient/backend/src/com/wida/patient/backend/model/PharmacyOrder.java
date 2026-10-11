package com.wida.patient.backend.model;

import java.util.List;

public class PharmacyOrder {
    public String id;
    public String prescriptionId;
    public String pharmacyName;
    public String date;
    public List<OrderItem> medicines;
    public double totalAmount;
    public String status; // 'Prescription received' | 'Verification' | 'Processing' | 'Ready' | 'Delivered'
    public String deliveryType; // 'Pickup' | 'Home Delivery'
    public String estimatedReadyTime;

    public static class OrderItem {
        public String name;
        public String quantity;
        public double price;

        public OrderItem() {}
        public OrderItem(String name, String quantity, double price) {
            this.name = name;
            this.quantity = quantity;
            this.price = price;
        }
    }
}
