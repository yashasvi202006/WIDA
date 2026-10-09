package com.meditrack.pharmacy.controller;

import com.meditrack.pharmacy.model.Medicine;
import com.meditrack.pharmacy.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pharmacy/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    private final MedicineService medicineService;

    @Autowired
    public InventoryController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getInventorySummary() {
        List<Medicine> all = medicineService.getAllMedicines();
        List<Medicine> lowStock = medicineService.getLowStockMedicines();
        List<Medicine> expiring = medicineService.getExpiringMedicines(90);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalMedicines", all.size());
        summary.put("lowStockCount", lowStock.size());
        summary.put("expiringCount", expiring.size());
        summary.put("status", "HEALTHY");

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Medicine>> getLowStockItems() {
        return ResponseEntity.ok(medicineService.getLowStockMedicines());
    }

    @GetMapping("/expiring")
    public ResponseEntity<List<Medicine>> getExpiringItems(@RequestParam(defaultValue = "90") int days) {
        return ResponseEntity.ok(medicineService.getExpiringMedicines(days));
    }
}
