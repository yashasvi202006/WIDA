import React, { useState } from 'react';
export const ReturnsManagement = ({ returns, onAddReturn, onApproveReturn }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [medName, setMedName] = useState('');
    const [returnQty, setReturnQty] = useState(1);
    const [reason, setReason] = useState('Damaged');
    const [notes, setNotes] = useState('');
    const handleCreateReturn = (e) => {
        e.preventDefault();
        if (!invoiceNo || !medName)
            return;
        // Strict rule: Damaged or Expired items MUST NOT be restocked to sellable inventory
        const isRestockable = reason !== 'Damaged' && reason !== 'Expired' && reason !== 'Adverse Effect';
        const newReturn = {
            id: `RET-2026-${Math.floor(10 + Math.random() * 90)}`,
            returnDate: new Date().toISOString().split('T')[0],
            invoiceNumber: invoiceNo,
            customerName: customerName || 'Walk-in Customer',
            medicineId: 'MED-1001',
            medicineName: medName,
            quantity: returnQty,
            reason,
            refundAmount: returnQty * 50.0,
            status: 'Pending Review',
            restockEligible: isRestockable,
            notes
        };
        onAddReturn(newReturn);
        setShowAddModal(false);
    };
    return (<div className="ph-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
            Returns & Quarantine Management
          </h2>
          <span className="card-subtitle">Process medicine returns, inspect damaged goods & enforce quarantine rules</span>
        </div>

        <button className="btn-ph btn-ph-primary" onClick={() => setShowAddModal(true)}>
          + Record New Return Request
        </button>
      </div>

      <div className="table-container">
        <table className="ph-table">
          <thead>
            <tr>
              <th>Return ID</th>
              <th>Return Date</th>
              <th>Invoice No</th>
              <th>Medicine Name</th>
              <th>Qty</th>
              <th>Reason</th>
              <th>Restock Eligible?</th>
              <th>Refund Amt (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {returns.map(ret => (<tr key={ret.id}>
                <td style={{ fontWeight: 700, color: '#0d9488' }}>{ret.id}</td>
                <td>{ret.returnDate}</td>
                <td>{ret.invoiceNumber}</td>
                <td style={{ fontWeight: 600 }}>{ret.medicineName}</td>
                <td>{ret.quantity}</td>
                <td><span className="badge-ph badge-warning">{ret.reason}</span></td>
                <td>
                  {ret.restockEligible ? (<span className="badge-ph badge-success">Eligible for Stock</span>) : (<span className="badge-ph badge-danger">Quarantined (Non-sellable)</span>)}
                </td>
                <td style={{ fontWeight: 700 }}>₹{ret.refundAmount.toFixed(2)}</td>
                <td>
                  <span className={`badge-ph ${ret.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                    {ret.status}
                  </span>
                </td>
                <td>
                  {ret.status !== 'Approved' && (<button className="btn-ph btn-ph-secondary btn-ph-sm" onClick={() => onApproveReturn(ret.id)}>
                      Approve Return
                    </button>)}
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>

      {/* CREATE RETURN MODAL */}
      {showAddModal && (<div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Record Medicine Return Request</h3>
              <button style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleCreateReturn}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Original Invoice Number *</label>
                    <input type="text" className="form-control" placeholder="e.g. INV-2026-8801" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} required/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Customer Name</label>
                    <input type="text" className="form-control" value={customerName} onChange={(e) => setCustomerName(e.target.value)}/>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Medicine Name *</label>
                    <input type="text" className="form-control" value={medName} onChange={(e) => setMedName(e.target.value)} required/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Return Quantity *</label>
                    <input type="number" min="1" className="form-control" value={returnQty} onChange={(e) => setReturnQty(parseInt(e.target.value) || 1)}/>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Return Reason *</label>
                  <select className="form-control" value={reason} onChange={(e) => setReason(e.target.value)}>
                    <option value="Damaged">Damaged Packaging / Punctured (Quarantined)</option>
                    <option value="Expired">Near Expiry / Expired (Quarantined)</option>
                    <option value="Adverse Effect">Adverse Patient Effect (Quarantined)</option>
                    <option value="Wrong Item">Wrong Item Sold (Restockable if sealed)</option>
                    <option value="Customer Refund">Unopened Customer Refund (Restockable)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Inspection & Pharmacist Notes</label>
                  <textarea className="form-control" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-ph btn-ph-outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-ph btn-ph-primary">
                  Submit Return Request
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
