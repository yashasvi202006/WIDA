import React from 'react';
export const PrintableInvoice = ({ invoice, onClose }) => {
    const handlePrint = () => {
        window.print();
    };
    return (<div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '600px' }}>
        <div className="modal-header" style={{ backgroundColor: '#0d9488', color: 'white' }}>
          <h3 className="modal-title" style={{ color: 'white' }}>WIDA HEALTHCARE PHARMACY INVOICE</h3>
          <button style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.4rem', cursor: 'pointer' }} onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body" style={{ backgroundColor: '#ffffff', color: '#0f172a', padding: '24px' }}>
          <div style={{ textAlign: 'center', borderBottom: '2px solid #0d9488', paddingBottom: '12px', marginBottom: '16px' }}>
            <h2 style={{ color: '#0d9488', fontSize: '1.4rem', fontWeight: 800 }}>WIDA HEALTHCARE CENTRAL PHARMACY</h2>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>License No: PH-DL-2024-88492 | GSTIN: 27AAAAA0000A1Z5</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Healthcare Express Tower, Sector 14, New Delhi</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem', marginBottom: '16px' }}>
            <div>
              <div><strong>Invoice No:</strong> {invoice.invoiceNumber}</div>
              <div><strong>Customer Name:</strong> {invoice.customerName}</div>
              <div><strong>Customer Phone:</strong> {invoice.customerPhone || 'N/A'}</div>
            </div>
            <div>
              <div><strong>Date & Time:</strong> {invoice.date}</div>
              <div><strong>Payment Mode:</strong> {invoice.paymentMethod}</div>
              <div><strong>Dispensed By:</strong> {invoice.dispensedBy}</div>
            </div>
          </div>

          <table className="ph-table" style={{ fontSize: '0.82rem', marginBottom: '16px' }}>
            <thead>
              <tr>
                <th>Item & Batch</th>
                <th>Qty</th>
                <th>Unit Price (₹)</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (<tr key={idx}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.medicineName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Batch: {item.batchNumber}</div>
                  </td>
                  <td>{item.quantity}</td>
                  <td>₹{item.unitPrice.toFixed(2)}</td>
                  <td>₹{item.totalPrice.toFixed(2)}</td>
                </tr>))}
            </tbody>
          </table>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', fontSize: '0.88rem', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
            <div>Subtotal: <strong>₹{invoice.subtotal.toFixed(2)}</strong></div>
            {invoice.discount > 0 && <div>Discount: <strong style={{ color: '#059669' }}>-₹{invoice.discount.toFixed(2)}</strong></div>}
            <div>GST / Tax (5%): <strong>₹{invoice.tax.toFixed(2)}</strong></div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0d9488', marginTop: '6px' }}>
              Grand Total: ₹{invoice.grandTotal.toFixed(2)}
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '20px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
            Thank you for trusting MEDiTRACK Pharmacy! Wishing you good health.
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-ph btn-ph-outline" onClick={onClose}>Close</button>
          <button className="btn-ph btn-ph-primary" onClick={handlePrint}>🖨️ Print Invoice</button>
        </div>
      </div>
    </div>);
};
