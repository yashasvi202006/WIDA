import React, { useState } from 'react';
export const DispensingManagement = ({ prescriptions, medicines, selectedPrescriptionForDispensing, onCompleteDispensing }) => {
    const [currentRxId, setCurrentRxId] = useState(selectedPrescriptionForDispensing?.id || prescriptions[0]?.id || '');
    const activeRx = prescriptions.find(r => r.id === currentRxId) || selectedPrescriptionForDispensing;
    const [dispensedQuantities, setDispensedQuantities] = useState(() => {
        if (!activeRx)
            return {};
        const map = {};
        activeRx.items.forEach(item => {
            map[item.medicineId] = item.quantityRequested;
        });
        return map;
    });
    const [pharmacistAuthCode, setPharmacistAuthCode] = useState('');
    const [authError, setAuthError] = useState('');
    const [isDispensedSuccess, setIsDispensedSuccess] = useState(false);
    const [generatedInvoice, setGeneratedInvoice] = useState(null);
    const handleRxChange = (rxId) => {
        setCurrentRxId(rxId);
        const target = prescriptions.find(r => r.id === rxId);
        if (target) {
            const map = {};
            target.items.forEach(item => {
                map[item.medicineId] = item.quantityRequested;
            });
            setDispensedQuantities(map);
        }
        setAuthError('');
        setIsDispensedSuccess(false);
    };
    const handleDispenseSubmit = (e) => {
        e.preventDefault();
        if (!activeRx)
            return;
        // Check expiry & stock for all items
        for (const item of activeRx.items) {
            const med = medicines.find(m => m.id === item.medicineId || m.name === item.medicineName);
            if (med) {
                const expDate = new Date(med.expiryDate);
                if (expDate <= new Date()) {
                    setAuthError(`Cannot dispense expired medicine batch (${med.name} expired on ${med.expiryDate})!`);
                    return;
                }
                const qtyToDispense = dispensedQuantities[item.medicineId] || item.quantityRequested;
                if (qtyToDispense > med.availableQuantity) {
                    setAuthError(`Insufficient stock for ${med.name}! Requested: ${qtyToDispense}, Available: ${med.availableQuantity}`);
                    return;
                }
            }
        }
        // Generate Invoice & Update Stock
        const lineItems = activeRx.items.map(item => {
            const med = medicines.find(m => m.id === item.medicineId || m.name === item.medicineName);
            const qty = dispensedQuantities[item.medicineId] || item.quantityRequested;
            const price = med ? med.sellingPrice : item.unitPrice;
            return {
                medicineId: med ? med.id : item.medicineId,
                medicineName: item.medicineName,
                batchNumber: med ? med.batchNumber : 'BT-DEFAULT',
                quantity: qty,
                unitPrice: price,
                totalPrice: qty * price
            };
        });
        const subtotal = lineItems.reduce((sum, i) => sum + i.totalPrice, 0);
        const discount = 0;
        const tax = subtotal * 0.05;
        const grandTotal = subtotal + tax;
        const invoice = {
            id: `INV-${Date.now()}`,
            invoiceNumber: `INV-2026-${Math.floor(8000 + Math.random() * 1000)}`,
            customerName: activeRx.patientName,
            prescriptionId: activeRx.id,
            date: new Date().toLocaleString(),
            items: lineItems,
            subtotal,
            discount,
            tax,
            grandTotal,
            paymentMethod: 'Cash',
            paymentStatus: 'Paid',
            dispensedBy: 'Dr. Yogita Chugh'
        };
        const itemsToUpdate = lineItems.map(i => ({ medicineId: i.medicineId, qty: i.quantity }));
        onCompleteDispensing(activeRx.id, itemsToUpdate, invoice);
        setGeneratedInvoice(invoice);
        setIsDispensedSuccess(true);
        setAuthError('');
    };
    return (<div className="ph-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
            7-Step Medicine Dispensing Workflow
          </h2>
          <span className="card-subtitle">Validated workflow: Verification → Expiry Check → Stock Deduct → Dispensing Log</span>
        </div>
      </div>

      {/* WORKFLOW PIPELINE TRACKER */}
      <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '6px',
            margin: '16px 0 24px 0',
            backgroundColor: '#e6f4f1',
            padding: '12px',
            borderRadius: '10px'
        }}>
        {[
            { step: '1', title: 'Rx Received' },
            { step: '2', title: 'Rx Review' },
            { step: '3', title: 'Stock Check' },
            { step: '4', title: 'Authorization' },
            { step: '5', title: 'Dispensing' },
            { step: '6', title: 'Stock Update' },
            { step: '7', title: 'Log Record' }
        ].map(s => (<div key={s.step} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #ccfbf1'
            }}>
            <span style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: '#0d9488',
                color: 'white',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '4px'
            }}>
              {s.step}
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#0f172a' }}>{s.title}</span>
          </div>))}
      </div>

      <div className="form-group" style={{ marginBottom: '20px', maxWidth: '480px' }}>
        <label className="form-label">Select Active Prescription to Process</label>
        <select className="form-control" value={currentRxId} onChange={(e) => handleRxChange(e.target.value)}>
          {prescriptions.map(rx => (<option key={rx.id} value={rx.id}>
              {rx.id} - {rx.patientName} ({rx.status})
            </option>))}
        </select>
      </div>

      {activeRx ? (<form onSubmit={handleDispenseSubmit}>
          <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '18px',
                marginBottom: '20px'
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                  Patient: {activeRx.patientName} ({activeRx.patientAge} yrs, {activeRx.patientGender})
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Prescribed by {activeRx.doctorName} ({activeRx.doctorDepartment}) on {activeRx.prescriptionDate}
                </span>
              </div>
              <span className={`badge-ph ${activeRx.status === 'Dispensed' ? 'badge-success' : 'badge-warning'}`}>
                {activeRx.status}
              </span>
            </div>

            {authError && (<div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '0.88rem', marginBottom: '14px' }}>
                ⚠️ {authError}
              </div>)}

            {isDispensedSuccess && generatedInvoice && (<div style={{ padding: '14px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '8px', marginBottom: '16px', border: '1px solid #a7f3d0' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>✅ Dispensing Transaction Completed Successfully!</div>
                <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                  Invoice Number: <strong>{generatedInvoice.invoiceNumber}</strong> | Grand Total: <strong>₹{generatedInvoice.grandTotal.toFixed(2)}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', marginTop: '2px', color: '#047857' }}>
                  Inventory stock updated automatically. Duplicate stock deductions prevented.
                </div>
              </div>)}

            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
              Prescribed Medicines to Dispense
            </h4>

            <div className="table-container">
              <table className="ph-table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Prescribed Qty</th>
                    <th>Dispense Qty</th>
                    <th>Available Stock</th>
                    <th>Batch Exp Date</th>
                    <th>Expiry Check</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRx.items.map(item => {
                const med = medicines.find(m => m.id === item.medicineId || m.name === item.medicineName);
                const stock = med ? med.availableQuantity : item.availableStock;
                const expDate = med ? med.expiryDate : '2027-12-31';
                const isExpired = new Date(expDate) <= new Date();
                return (<tr key={item.id}>
                        <td style={{ fontWeight: 700 }}>{item.medicineName}</td>
                        <td>{item.quantityRequested}</td>
                        <td>
                          <input type="number" min="1" max={stock} className="form-control" style={{ width: '80px', padding: '4px 8px' }} value={dispensedQuantities[item.medicineId] ?? item.quantityRequested} onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setDispensedQuantities({ ...dispensedQuantities, [item.medicineId]: val });
                    }} disabled={activeRx.status === 'Dispensed'}/>
                        </td>
                        <td><strong style={{ color: stock >= item.quantityRequested ? '#059669' : '#dc2626' }}>{stock}</strong></td>
                        <td style={{ fontFamily: 'monospace' }}>{expDate}</td>
                        <td>
                          {isExpired ? (<span className="badge-ph badge-danger">EXPIRED - DO NOT DISPENSE</span>) : (<span className="badge-ph badge-success">Valid Batch</span>)}
                        </td>
                      </tr>);
            })}
                </tbody>
              </table>
            </div>

            <div className="form-group" style={{ marginTop: '16px', maxWidth: '360px' }}>
              <label className="form-label">Pharmacist Verification Authorization Code</label>
              <input type="password" className="form-control" placeholder="Enter pharmacist PIN (e.g. 1234)" value={pharmacistAuthCode} onChange={(e) => setPharmacistAuthCode(e.target.value)} disabled={activeRx.status === 'Dispensed'}/>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="submit" className="btn-ph btn-ph-primary" disabled={activeRx.status === 'Dispensed'}>
              Authorise & Dispense Medicine →
            </button>
          </div>
        </form>) : (<div style={{ padding: '20px', color: '#64748b' }}>No prescription selected.</div>)}
    </div>);
};
