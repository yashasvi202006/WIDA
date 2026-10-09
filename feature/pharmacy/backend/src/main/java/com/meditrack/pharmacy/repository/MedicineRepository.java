package com.meditrack.pharmacy.repository;

import com.meditrack.pharmacy.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, String> {

    List<Medicine> findByCategory(String category);

    List<Medicine> findByStatus(String status);

    @Query("SELECT m FROM Medicine m WHERE m.availableQuantity <= m.reorderLevel")
    List<Medicine> findLowStockMedicines();

    @Query("SELECT m FROM Medicine m WHERE m.expiryDate <= :targetDate")
    List<Medicine> findExpiringBefore(LocalDate targetDate);

    List<Medicine> findByNameContainingIgnoreCaseOrGenericNameContainingIgnoreCaseOrBatchNumberContainingIgnoreCase(
            String name, String genericName, String batchNumber);
}
