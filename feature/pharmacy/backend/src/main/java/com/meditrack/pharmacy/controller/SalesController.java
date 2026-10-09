package com.meditrack.pharmacy.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pharmacy/sales")
@CrossOrigin(origins = "*")
public class SalesController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSalesSummary() {
        Map<String, Object> response = new HashMap<>();
        response.put("todaySalesAmount", 42850.00);
        response.put("currency", "INR");
        response.put("totalTransactions", 18);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> recordSale(@RequestBody Map<String, Object> saleData) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("invoiceNumber", "INV-2026-" + (int)(Math.random() * 9000 + 1000));
        response.put("message", "Sale recorded and stock updated automatically.");
        return ResponseEntity.ok(response);
    }
}
