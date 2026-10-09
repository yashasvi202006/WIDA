package com.meditrack.pharmacy.service;

import com.meditrack.pharmacy.model.Medicine;
import com.meditrack.pharmacy.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MedicineService {

    private final MedicineRepository medicineRepository;

    @Autowired
    public MedicineService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Optional<Medicine> getMedicineById(String id) {
        return medicineRepository.findById(id);
    }

    public Medicine saveMedicine(Medicine medicine) {
        if (medicine.getAvailableQuantity() < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }
        return medicineRepository.save(medicine);
    }

    public void deleteMedicine(String id) {
        medicineRepository.deleteById(id);
    }

    public List<Medicine> getLowStockMedicines() {
        return medicineRepository.findLowStockMedicines();
    }

    public List<Medicine> getExpiringMedicines(int withinDays) {
        LocalDate threshold = LocalDate.now().plusDays(withinDays);
        return medicineRepository.findExpiringBefore(threshold);
    }

    public List<Medicine> searchMedicines(String query) {
        return medicineRepository.findByNameContainingIgnoreCaseOrGenericNameContainingIgnoreCaseOrBatchNumberContainingIgnoreCase(
                query, query, query);
    }

    public Medicine updateStock(String id, int quantityDelta) {
        Medicine med = medicineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found with ID: " + id));
        
        int updatedQty = med.getAvailableQuantity() + quantityDelta;
        if (updatedQty < 0) {
            throw new IllegalArgumentException("Insufficient stock available for medicine: " + med.getName());
        }
        med.setAvailableQuantity(updatedQty);
        return medicineRepository.save(med);
    }
}
