import React, { useState } from 'react';
export const MedicineInventory = ({ medicines, suppliers, onAddMedicine, onUpdateMedicine, onDeleteMedicine }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    // Modal States
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState(null);
    const [viewingMedicine, setViewingMedicine] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    // Form State for Add / Edit
    const [formData, setFormData] = useState({
        name: '',
        genericName: '',
        brand: '',
        category: 'Tablets',
        manufacturer: '',
        batchNumber: '',
        strength: '',
        dosageForm: 'Tablet',
        packSize: '10 Tablets Strip',
        availableQuantity: 100,
        reorderLevel: 20,
        purchasePrice: 10.0,
        sellingPrice: 20.0,
        supplierId: suppliers[0]?.id || 'SUP-101',
        supplierName: suppliers[0]?.name || 'Apex Healthcare Distributors',
        mfgDate: new Date().toISOString().split('T')[0],
        expiryDate: '2027-12-31',
        prescriptionRequired: false,
        storageInstructions: 'Store in a cool dry place',
        status: 'Active'
    });
    const [formError, setFormError] = useState('');
    const categories = [
        'Tablets', 'Capsules', 'Syrups', 'Injections', 'Antibiotics',
        'Pain Relief', 'Vitamins and Supplements', 'Dermatology', 'Cardiac Medicines',
        'Diabetes Medicines', 'Respiratory Medicines', 'Gastrointestinal Medicines',
        'First Aid', 'Medical Supplies', 'Other'
    ];
    const getStockStatus = (m) => {
        const exp = new Date(m.expiryDate);
        const now = new Date();
        if (exp <= now)
            return 'Expired';
        const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 90)
            return 'Expiring Soon';
        if (m.availableQuantity === 0)
            return 'Out of Stock';
        if (m.availableQuantity <= m.reorderLevel)
            return 'Low Stock';
        return 'In Stock';
    };
    // Filtered and Sorted Medicines
    const filteredMedicines = medicines.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
        const status = getStockStatus(m);
        const matchesStatus = statusFilter === 'All' || status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => {
        if (sortBy === 'name')
            return a.name.localeCompare(b.name);
        if (sortBy === 'quantity')
            return b.availableQuantity - a.availableQuantity;
        if (sortBy === 'price')
            return b.sellingPrice - a.sellingPrice;
        if (sortBy === 'expiry')
            return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        return 0;
    });
    const handleOpenAdd = () => {
        setFormData({
            id: `MED-${1000 + medicines.length + 1}`,
            name: '',
            genericName: '',
            brand: '',
            category: 'Tablets',
            manufacturer: '',
            batchNumber: `BT-2026-${Math.floor(100 + Math.random() * 900)}`,
            strength: '500 mg',
            dosageForm: 'Tablet',
            packSize: '10 Strip',
            availableQuantity: 100,
            reorderLevel: 25,
            purchasePrice: 20,
            sellingPrice: 40,
            supplierId: suppliers[0]?.id || 'SUP-101',
            supplierName: suppliers[0]?.name || 'Apex Healthcare',
            mfgDate: new Date().toISOString().split('T')[0],
            expiryDate: '2027-12-31',
            prescriptionRequired: false,
            storageInstructions: 'Store below 25°C',
            status: 'Active'
        });
        setFormError('');
        setShowAddModal(true);
    };
    const handleOpenEdit = (m) => {
        setEditingMedicine(m);
        setFormData({ ...m });
        setFormError('');
    };
    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.genericName || !formData.batchNumber) {
            setFormError('Please fill out all required fields (Name, Generic Name, Batch Number).');
            return;
        }
        if ((formData.availableQuantity ?? -1) < 0) {
            setFormError('Available quantity cannot be negative.');
            return;
        }
        if ((formData.purchasePrice ?? -1) < 0 || (formData.sellingPrice ?? -1) < 0) {
            setFormError('Prices must be non-negative values.');
            return;
        }
        const selectedSupplier = suppliers.find(s => s.id === formData.supplierId);
        const updatedMed = {
            ...formData,
            supplierName: selectedSupplier ? selectedSupplier.name : formData.supplierName || 'General Supplier'
        };
        if (editingMedicine) {
            onUpdateMedicine(updatedMed);
            setEditingMedicine(null);
        }
        else {
            onAddMedicine(updatedMed);
            setShowAddModal(false);
        }
    };
    return (<div className="ph-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            Medicine Inventory Management
          </h2>
          <span className="card-subtitle">Complete registry of active pharmaceutical products & stock batches</span>
        </div>

        <button className="btn-ph btn-ph-primary" onClick={handleOpenAdd}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Add New Medicine
        </button>
      </div>

      {/* FILTER & CONTROL BAR */}
      <div style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
            gap: '12px',
            marginBottom: '20px',
            padding: '14px',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
        }}>
        <div>
          <label className="form-label">Search Medicine / Brand / Batch</label>
          <input type="text" className="form-control" placeholder="Type name or batch..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>

        <div>
          <label className="form-label">Category</label>
          <select className="form-control" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="form-label">Stock Status</label>
          <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        <div>
          <label className="form-label">Sort By</label>
          <select className="form-control" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name (A-Z)</option>
            <option value="quantity">Stock Quantity (High-Low)</option>
            <option value="price">Selling Price (High-Low)</option>
            <option value="expiry">Expiry Date (Earliest First)</option>
          </select>
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <div className="table-container">
        <table className="ph-table">
          <thead>
            <tr>
              <th>ID & Name</th>
              <th>Category</th>
              <th>Batch / Expiry</th>
              <th>Stock Qty</th>
              <th>Reorder Level</th>
              <th>Unit Price (₹)</th>
              <th>Status</th>
              <th>Rx</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.length === 0 ? (<tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  No medicine records match the selected filters.
                </td>
              </tr>) : (filteredMedicines.map(m => {
            const status = getStockStatus(m);
            return (<tr key={m.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{m.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {m.genericName} ({m.brand}) | <span style={{ color: '#0d9488' }}>{m.id}</span>
                      </div>
                    </td>
                    <td><span className="badge-ph badge-neutral">{m.category}</span></td>
                    <td>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600 }}>{m.batchNumber}</div>
                      <div style={{ fontSize: '0.74rem', color: status === 'Expired' || status === 'Expiring Soon' ? '#dc2626' : '#64748b' }}>
                        Exp: {m.expiryDate}
                      </div>
                    </td>
                    <td>
                      <strong style={{
                    color: m.availableQuantity === 0 ? '#dc2626' : m.availableQuantity <= m.reorderLevel ? '#d97706' : '#0f172a',
                    fontSize: '1rem'
                }}>
                        {m.availableQuantity}
                      </strong>
                    </td>
                    <td>{m.reorderLevel}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>₹{m.sellingPrice.toFixed(2)}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Cost: ₹{m.purchasePrice.toFixed(2)}</div>
                    </td>
                    <td>
                      <span className={`badge-ph ${status === 'In Stock' ? 'badge-success' :
                    status === 'Low Stock' ? 'badge-warning' :
                        status === 'Out of Stock' ? 'badge-danger' :
                            status === 'Expiring Soon' ? 'badge-warning' : 'badge-danger'}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      {m.prescriptionRequired ? (<span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', backgroundColor: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }}>Rx</span>) : (<span style={{ fontSize: '0.75rem', color: '#059669', backgroundColor: '#d1fae5', padding: '2px 6px', borderRadius: '4px' }}>OTC</span>)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-ph btn-ph-secondary btn-ph-sm" title="View Details" onClick={() => setViewingMedicine(m)}>
                          View
                        </button>
                        <button className="btn-ph btn-ph-outline btn-ph-sm" title="Edit" onClick={() => handleOpenEdit(m)}>
                          Edit
                        </button>
                        <button className="btn-ph btn-ph-danger btn-ph-sm" title="Delete" onClick={() => setConfirmDeleteId(m.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>);
        }))}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}
      {(showAddModal || editingMedicine) && (<div className="modal-overlay">
          <div className="modal-card lg">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingMedicine ? `Edit Medicine: ${editingMedicine.id}` : 'Add New Pharmaceutical SKU'}
              </h3>
              <button style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => { setShowAddModal(false); setEditingMedicine(null); }}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div className="modal-body">
                {formError && (<div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '0.85rem' }}>
                    {formError}
                  </div>)}

                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Medicine Name *</label>
                    <input type="text" className="form-control" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Generic Name *</label>
                    <input type="text" className="form-control" value={formData.genericName || ''} onChange={(e) => setFormData({ ...formData, genericName: e.target.value })} required/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Brand Name</label>
                    <input type="text" className="form-control" value={formData.brand || ''} onChange={(e) => setFormData({ ...formData, brand: e.target.value })}/>
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-control" value={formData.category || 'Tablets'} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Manufacturer</label>
                    <input type="text" className="form-control" value={formData.manufacturer || ''} onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Batch Number *</label>
                    <input type="text" className="form-control" value={formData.batchNumber || ''} onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })} required/>
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Strength</label>
                    <input type="text" className="form-control" value={formData.strength || ''} onChange={(e) => setFormData({ ...formData, strength: e.target.value })}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dosage Form</label>
                    <input type="text" className="form-control" value={formData.dosageForm || ''} onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pack Size</label>
                    <input type="text" className="form-control" value={formData.packSize || ''} onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}/>
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Available Quantity *</label>
                    <input type="number" min="0" className="form-control" value={formData.availableQuantity ?? 0} onChange={(e) => setFormData({ ...formData, availableQuantity: parseInt(e.target.value) || 0 })} required/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reorder Level *</label>
                    <input type="number" min="0" className="form-control" value={formData.reorderLevel ?? 0} onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })} required/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Supplier</label>
                    <select className="form-control" value={formData.supplierId || ''} onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}>
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Purchase Price (₹) *</label>
                    <input type="number" step="0.01" min="0" className="form-control" value={formData.purchasePrice ?? 0} onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })} required/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Selling Price (₹) *</label>
                    <input type="number" step="0.01" min="0" className="form-control" value={formData.sellingPrice ?? 0} onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })} required/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prescription Requirement</label>
                    <select className="form-control" value={formData.prescriptionRequired ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, prescriptionRequired: e.target.value === 'true' })}>
                      <option value="false">No (OTC)</option>
                      <option value="true">Yes (Rx Required)</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Mfg Date</label>
                    <input type="date" className="form-control" value={formData.mfgDate || ''} onChange={(e) => setFormData({ ...formData, mfgDate: e.target.value })}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expiry Date *</label>
                    <input type="date" className="form-control" value={formData.expiryDate || ''} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} required/>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Storage Instructions</label>
                  <input type="text" className="form-control" value={formData.storageInstructions || ''} onChange={(e) => setFormData({ ...formData, storageInstructions: e.target.value })}/>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-ph btn-ph-outline" onClick={() => { setShowAddModal(false); setEditingMedicine(null); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-ph btn-ph-primary">
                  {editingMedicine ? 'Save Changes' : 'Create Medicine SKU'}
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* VIEW DETAILS MODAL */}
      {viewingMedicine && (<div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Medicine Specifications: {viewingMedicine.name}</h3>
              <button style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setViewingMedicine(null)}>
                ×
              </button>
            </div>
            <div className="modal-body" style={{ fontSize: '0.9rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                <div><strong>SKU ID:</strong> {viewingMedicine.id}</div>
                <div><strong>Brand Name:</strong> {viewingMedicine.brand}</div>
                <div><strong>Generic Name:</strong> {viewingMedicine.genericName}</div>
                <div><strong>Category:</strong> {viewingMedicine.category}</div>
                <div><strong>Manufacturer:</strong> {viewingMedicine.manufacturer}</div>
                <div><strong>Batch Number:</strong> {viewingMedicine.batchNumber}</div>
                <div><strong>Strength / Dosage:</strong> {viewingMedicine.strength} ({viewingMedicine.dosageForm})</div>
                <div><strong>Pack Size:</strong> {viewingMedicine.packSize}</div>
                <div><strong>Available Stock:</strong> {viewingMedicine.availableQuantity} units</div>
                <div><strong>Reorder Threshold:</strong> {viewingMedicine.reorderLevel} units</div>
                <div><strong>Purchase Price:</strong> ₹{viewingMedicine.purchasePrice.toFixed(2)}</div>
                <div><strong>Selling Price:</strong> ₹{viewingMedicine.sellingPrice.toFixed(2)}</div>
                <div><strong>Supplier:</strong> {viewingMedicine.supplierName}</div>
                <div><strong>Mfg / Expiry:</strong> {viewingMedicine.mfgDate} / {viewingMedicine.expiryDate}</div>
                <div><strong>Rx Requirement:</strong> {viewingMedicine.prescriptionRequired ? 'Prescription Required (Rx)' : 'Over the counter (OTC)'}</div>
                <div><strong>Storage:</strong> {viewingMedicine.storageInstructions}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-ph btn-ph-primary" onClick={() => setViewingMedicine(null)}>Close</button>
            </div>
          </div>
        </div>)}

      {/* DELETE CONFIRMATION MODAL */}
      {confirmDeleteId && (<div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '420px' }}>
            <div className="modal-header" style={{ backgroundColor: '#fee2e2' }}>
              <h3 className="modal-title" style={{ color: '#991b1b' }}>Confirm Medicine Removal</h3>
            </div>
            <div className="modal-body">
              Are you sure you want to remove medicine record <strong>{confirmDeleteId}</strong> from active inventory?
            </div>
            <div className="modal-footer">
              <button className="btn-ph btn-ph-outline" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              <button className="btn-ph btn-ph-danger" onClick={() => {
                onDeleteMedicine(confirmDeleteId);
                setConfirmDeleteId(null);
            }}>
                Delete Medicine
              </button>
            </div>
          </div>
        </div>)}
    </div>);
};
