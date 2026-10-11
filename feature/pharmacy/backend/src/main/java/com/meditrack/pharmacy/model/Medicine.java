package com.meditrack.pharmacy.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "pharmacy_medicines")
public class Medicine {

    @Id
    @Column(name = "medicine_id", length = 50)
    private String id;

    @NotBlank(message = "Medicine name is required")
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank(message = "Generic name is required")
    @Column(name = "generic_name", nullable = false)
    private String genericName;

    @Column(name = "brand")
    private String brand;

    @NotBlank(message = "Category is required")
    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "manufacturer")
    private String manufacturer;

    @NotBlank(message = "Batch number is required")
    @Column(name = "batch_number", nullable = false)
    private String batchNumber;

    @Column(name = "strength")
    private String strength;

    @Column(name = "dosage_form")
    private String dosageForm;

    @Column(name = "pack_size")
    private String packSize;

    @Min(value = 0, message = "Available quantity cannot be negative")
    @Column(name = "available_quantity", nullable = false)
    private Integer availableQuantity;

    @Min(value = 0, message = "Reorder level cannot be negative")
    @Column(name = "reorder_level", nullable = false)
    private Integer reorderLevel;

    @NotNull(message = "Purchase price is required")
    @DecimalMin(value = "0.0", message = "Purchase price must be non-negative")
    @Column(name = "purchase_price", precision = 12, scale = 2)
    private BigDecimal purchasePrice;

    @NotNull(message = "Selling price is required")
    @DecimalMin(value = "0.0", message = "Selling price must be non-negative")
    @Column(name = "selling_price", precision = 12, scale = 2)
    private BigDecimal sellingPrice;

    @Column(name = "supplier_id")
    private String supplierId;

    @Column(name = "supplier_name")
    private String supplierName;

    @Column(name = "mfg_date")
    private LocalDate mfgDate;

    @NotNull(message = "Expiry date is required")
    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "prescription_required")
    private Boolean prescriptionRequired;

    @Column(name = "storage_instructions")
    private String storageInstructions;

    @Column(name = "status")
    private String status;

    public Medicine() {}

    public Medicine(String id, String name, String genericName, String brand, String category,
                    String manufacturer, String batchNumber, String strength, String dosageForm,
                    String packSize, Integer availableQuantity, Integer reorderLevel,
                    BigDecimal purchasePrice, BigDecimal sellingPrice, String supplierId,
                    String supplierName, LocalDate mfgDate, LocalDate expiryDate,
                    Boolean prescriptionRequired, String storageInstructions, String status) {
        this.id = id;
        this.name = name;
        this.genericName = genericName;
        this.brand = brand;
        this.category = category;
        this.manufacturer = manufacturer;
        this.batchNumber = batchNumber;
        this.strength = strength;
        this.dosageForm = dosageForm;
        this.packSize = packSize;
        this.availableQuantity = availableQuantity;
        this.reorderLevel = reorderLevel;
        this.purchasePrice = purchasePrice;
        this.sellingPrice = sellingPrice;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.mfgDate = mfgDate;
        this.expiryDate = expiryDate;
        this.prescriptionRequired = prescriptionRequired;
        this.storageInstructions = storageInstructions;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGenericName() { return genericName; }
    public void setGenericName(String genericName) { this.genericName = genericName; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public String getStrength() { return strength; }
    public void setStrength(String strength) { this.strength = strength; }

    public String getDosageForm() { return dosageForm; }
    public void setDosageForm(String dosageForm) { this.dosageForm = dosageForm; }

    public String getPackSize() { return packSize; }
    public void setPackSize(String packSize) { this.packSize = packSize; }

    public Integer getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(Integer availableQuantity) { this.availableQuantity = availableQuantity; }

    public Integer getReorderLevel() { return reorderLevel; }
    public void setReorderLevel(Integer reorderLevel) { this.reorderLevel = reorderLevel; }

    public BigDecimal getPurchasePrice() { return purchasePrice; }
    public void setPurchasePrice(BigDecimal purchasePrice) { this.purchasePrice = purchasePrice; }

    public BigDecimal getSellingPrice() { return sellingPrice; }
    public void setSellingPrice(BigDecimal sellingPrice) { this.sellingPrice = sellingPrice; }

    public String getSupplierId() { return supplierId; }
    public void setSupplierId(String supplierId) { this.supplierId = supplierId; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public LocalDate getMfgDate() { return mfgDate; }
    public void setMfgDate(LocalDate mfgDate) { this.mfgDate = mfgDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public Boolean getPrescriptionRequired() { return prescriptionRequired; }
    public void setPrescriptionRequired(Boolean prescriptionRequired) { this.prescriptionRequired = prescriptionRequired; }

    public String getStorageInstructions() { return storageInstructions; }
    public void setStorageInstructions(String storageInstructions) { this.storageInstructions = storageInstructions; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
