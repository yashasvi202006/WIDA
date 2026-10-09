import React, { useState } from 'react';
export const PurchaseOrders = ({ purchaseOrders, suppliers, medicines, onCreatePO, onReceivePOStock }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
    const [selectedMedId, setSelectedMedId] = useState(medicines[0]?.id || '');
    const [orderQty, setOrderQty] = useState(100);
    const [poLineItems, setPoLineItems] = useState([]);
    const handleAddLineItem = () => {
        const med = medicines.find(m => m.id === selectedMedId);
        if (!med)
            return;
        const existingIndex = poLineItems.findIndex(i => i.medicineId === med.id);
        if (existingIndex >= 0) {
            const updated = [...poLineItems];
            updated[existingIndex].quantityOrdered += orderQty;
            updated[existingIndex].totalCost = updated[existingIndex].quantityOrdered * updated[existingIndex].unitCost;
            setPoLineItems(updated);
        }
        else {
            setPoLineItems([
                ...poLineItems,
                {
                    medicineId: med.id,
                    medicineName: med.name,
                    batchNumber: `BT-2026-${Math.floor(100 + Math.random() * 900)}`,
                    quantityOrdered: orderQty,
                    quantityReceived: 0,
                    unitCost: med.purchasePrice,
                    totalCost: orderQty * med.purchasePrice
                }
            ]);
        }
    };
    const handleCreateSubmit = (e) => {
        e.preventDefault();
        if (poLineItems.length === 0)
            return;
        const sup = suppliers.find(s => s.id === selectedSupplierId);
        const subtotal = poLineItems.reduce((sum, i) => sum + i.totalCost, 0);
        const tax = subtotal * 0.12;
        const totalAmount = subtotal + tax;
        const newPO = {
            id: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
            supplierId: selectedSupplierId,
            supplierName: sup ? sup.name : 'Supplier',
            orderDate: new Date().toISOString().split('T')[0],
            expectedDeliveryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
            status: 'Submitted',
            items: poLineItems,
            subtotal,
            tax,
            totalAmount,
            notes: 'Generated from Pharmacy Replenishment System'
        };
        onCreatePO(newPO);
        setShowCreateModal(false);
        setPoLineItems([]);
    };
    return (<div className="ph-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Supplier Purchase Orders & Procurement
          </h2>
          <span className="card-subtitle">Manage wholesale stock orders, delivery dates, and auto-inventory updates</span>
        </div>

        <button className="btn-ph btn-ph-primary" onClick={() => setShowCreateModal(true)}>
          + Create Purchase Order
        </button>
      </div>

      <div className="table-container">
        <table className="ph-table">
          <thead>
            <tr>
              <th>PO ID</th>
              <th>Supplier Name</th>
              <th>Order Date</th>
              <th>Expected Delivery</th>
              <th>Items Count</th>
              <th>Total Amount (₹)</th>
              <th>PO Status</th>
              <th>Receiving Action</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map(po => (<tr key={po.id}>
                <td style={{ fontWeight: 700, color: '#0d9488' }}>{po.id}</td>
                <td style={{ fontWeight: 600 }}>{po.supplierName}</td>
                <td>{po.orderDate}</td>
                <td>{po.expectedDeliveryDate}</td>
                <td><strong>{po.items.length} SKUs</strong></td>
                <td style={{ fontWeight: 700 }}>₹{po.totalAmount.toFixed(2)}</td>
                <td>
                  <span className={`badge-ph ${po.status === 'Received' ? 'badge-success' :
                po.status === 'Submitted' ? 'badge-info' : 'badge-warning'}`}>
                    {po.status}
                  </span>
                </td>
                <td>
                  {po.status !== 'Received' ? (<button className="btn-ph btn-ph-secondary btn-ph-sm" onClick={() => onReceivePOStock(po.id)}>
                      Receive Stock & Update Inventory
                    </button>) : (<span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>Stock Added</span>)}
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>

      {/* CREATE PO MODAL */}
      {showCreateModal && (<div className="modal-overlay">
          <div className="modal-card lg">
            <div className="modal-header">
              <h3 className="modal-title">Create Supplier Purchase Order</h3>
              <button style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Supplier *</label>
                  <select className="form-control" value={selectedSupplierId} onChange={(e) => setSelectedSupplierId(e.target.value)}>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.contactPerson})</option>)}
                  </select>
                </div>

                <div style={{ padding: '14px', backgroundColor: '#e6f4f1', borderRadius: '8px', border: '1px solid #ccfbf1' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f766e', marginBottom: '8px' }}>
                    Add Medicine Items to PO
                  </h4>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label className="form-label">Medicine</label>
                      <select className="form-control" value={selectedMedId} onChange={(e) => setSelectedMedId(e.target.value)}>
                        {medicines.map(m => <option key={m.id} value={m.id}>{m.name} (Stock: {m.availableQuantity})</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Order Quantity</label>
                      <input type="number" min="1" className="form-control" value={orderQty} onChange={(e) => setOrderQty(parseInt(e.target.value) || 1)}/>
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <button type="button" className="btn-ph btn-ph-primary" style={{ width: '100%' }} onClick={handleAddLineItem}>
                        Add Item
                      </button>
                    </div>
                  </div>
                </div>

                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '12px' }}>Order Line Items ({poLineItems.length})</h4>
                <div className="table-container">
                  <table className="ph-table">
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Order Qty</th>
                        <th>Unit Cost (₹)</th>
                        <th>Total Cost (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {poLineItems.length === 0 ? (<tr>
                          <td colSpan={4} style={{ textAlign: 'center', color: '#64748b' }}>No items added yet.</td>
                        </tr>) : (poLineItems.map((item, idx) => (<tr key={idx}>
                            <td style={{ fontWeight: 600 }}>{item.medicineName}</td>
                            <td>{item.quantityOrdered}</td>
                            <td>₹{item.unitCost.toFixed(2)}</td>
                            <td><strong>₹{item.totalCost.toFixed(2)}</strong></td>
                          </tr>)))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-ph btn-ph-outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-ph btn-ph-primary" disabled={poLineItems.length === 0}>
                  Submit Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
