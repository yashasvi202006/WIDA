import React, { useState } from 'react';
import { PrintableInvoice } from './PrintableInvoice';
export const SalesAndBilling = ({ medicines, invoices, onCompleteSale }) => {
    const [customerName, setCustomerName] = useState('Walk-in Customer');
    const [customerPhone, setCustomerPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [discountPercent, setDiscountPercent] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [selectedMedId, setSelectedMedId] = useState(medicines[0]?.id || '');
    const [addQty, setAddQty] = useState(1);
    const [saleError, setSaleError] = useState('');
    const [activeInvoiceForPrint, setActiveInvoiceForPrint] = useState(null);
    const handleAddToCart = () => {
        const med = medicines.find(m => m.id === selectedMedId);
        if (!med)
            return;
        if (new Date(med.expiryDate) <= new Date()) {
            setSaleError(`Cannot sell expired medicine (${med.name})!`);
            return;
        }
        if (addQty > med.availableQuantity) {
            setSaleError(`Requested quantity (${addQty}) exceeds available stock (${med.availableQuantity})!`);
            return;
        }
        const existingIdx = cartItems.findIndex(i => i.medicine.id === med.id);
        if (existingIdx >= 0) {
            const updated = [...cartItems];
            const newQty = updated[existingIdx].quantity + addQty;
            if (newQty > med.availableQuantity) {
                setSaleError(`Total quantity in cart (${newQty}) exceeds available stock (${med.availableQuantity})!`);
                return;
            }
            updated[existingIdx].quantity = newQty;
            setCartItems(updated);
        }
        else {
            setCartItems([...cartItems, { medicine: med, quantity: addQty }]);
        }
        setSaleError('');
    };
    const handleRemoveFromCart = (index) => {
        const updated = cartItems.filter((_, i) => i !== index);
        setCartItems(updated);
    };
    const subtotal = cartItems.reduce((sum, item) => sum + (item.medicine.sellingPrice * item.quantity), 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    const taxAmount = (subtotal - discountAmount) * 0.05;
    const grandTotal = subtotal - discountAmount + taxAmount;
    const handleFinalizeSale = (e) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            setSaleError('Cart is empty. Please add medicines before finalizing sale.');
            return;
        }
        const lineItems = cartItems.map(item => ({
            medicineId: item.medicine.id,
            medicineName: item.medicine.name,
            batchNumber: item.medicine.batchNumber,
            quantity: item.quantity,
            unitPrice: item.medicine.sellingPrice,
            totalPrice: item.medicine.sellingPrice * item.quantity
        }));
        const invoice = {
            id: `INV-${Date.now()}`,
            invoiceNumber: `INV-2026-${Math.floor(8000 + Math.random() * 1000)}`,
            customerName: customerName || 'Walk-in Customer',
            customerPhone,
            date: new Date().toLocaleString(),
            items: lineItems,
            subtotal,
            discount: discountAmount,
            tax: taxAmount,
            grandTotal,
            paymentMethod,
            paymentStatus: 'Paid',
            dispensedBy: 'Dr. Yogita Chugh'
        };
        const itemsToDeduct = cartItems.map(i => ({ medicineId: i.medicine.id, qty: i.quantity }));
        onCompleteSale(invoice, itemsToDeduct);
        setActiveInvoiceForPrint(invoice);
        setCartItems([]);
        setSaleError('');
    };
    return (<div className="ph-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            Sales Counter & POS Billing Terminal (₹)
          </h2>
          <span className="card-subtitle">Realtime billing terminal with automatic stock deduction & invoice printing</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* LEFT: CART BUILDER */}
        <div>
          <div style={{ padding: '16px', backgroundColor: '#e6f4f1', borderRadius: '10px', border: '1px solid #ccfbf1', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f766e', marginBottom: '10px' }}>Select Medicine to Bill</h3>

            {saleError && (<div style={{ padding: '8px 12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '10px' }}>
                ⚠️ {saleError}
              </div>)}

            <div className="form-grid-3">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Medicine</label>
                <select className="form-control" value={selectedMedId} onChange={(e) => setSelectedMedId(e.target.value)}>
                  {medicines.map(m => (<option key={m.id} value={m.id}>
                      {m.name} - ₹{m.sellingPrice.toFixed(2)} (Stock: {m.availableQuantity})
                    </option>))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Qty</label>
                <input type="number" min="1" className="form-control" value={addQty} onChange={(e) => setAddQty(parseInt(e.target.value) || 1)}/>
              </div>
            </div>

            <button type="button" className="btn-ph btn-ph-primary" style={{ marginTop: '12px', width: '100%' }} onClick={handleAddToCart}>
              + Add Item to Bill
            </button>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>Bill Items ({cartItems.length})</h3>

          <div className="table-container">
            <table className="ph-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Price (₹)</th>
                  <th>Qty</th>
                  <th>Total (₹)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.length === 0 ? (<tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                      No items in current billing cart. Select medicine above to add.
                    </td>
                  </tr>) : (cartItems.map((item, idx) => (<tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{item.medicine.name}</td>
                      <td>₹{item.medicine.sellingPrice.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td><strong>₹{(item.medicine.sellingPrice * item.quantity).toFixed(2)}</strong></td>
                      <td>
                        <button className="btn-ph btn-ph-danger btn-ph-sm" onClick={() => handleRemoveFromCart(idx)}>
                          Remove
                        </button>
                      </td>
                    </tr>)))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: BILL SUMMARY & PAYMENT */}
        <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              Customer & Payment Details
            </h3>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Customer Name</label>
              <input type="text" className="form-control" value={customerName} onChange={(e) => setCustomerName(e.target.value)}/>
            </div>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Customer Mobile</label>
              <input type="text" className="form-control" placeholder="+91 98765 43210" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}/>
            </div>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Payment Method</label>
              <select className="form-control" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="UPI">UPI / QR Code</option>
                <option value="Cash">Cash Counter</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Insurance">Insurance Claim</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Discount (%)</label>
              <input type="number" min="0" max="50" className="form-control" value={discountPercent} onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}/>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Subtotal:</span>
                <strong>₹{subtotal.toFixed(2)}</strong>
              </div>
              {discountAmount > 0 && (<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#059669' }}>
                  <span>Discount ({discountPercent}%):</span>
                  <strong>-₹{discountAmount.toFixed(2)}</strong>
                </div>)}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>GST / Tax (5%):</span>
                <strong>₹{taxAmount.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: '#0d9488', borderTop: '2px solid #e2e8f0', paddingTop: '8px', marginTop: '4px' }}>
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button type="button" className="btn-ph btn-ph-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '20px' }} onClick={handleFinalizeSale} disabled={cartItems.length === 0}>
            Complete Sale & Print Receipt ₹
          </button>
        </div>
      </div>

      {/* RECENT SALES INVOICES TABLE */}
      <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
          Recent Counter Invoices Log ({invoices.length})
        </h3>
        <div className="table-container">
          <table className="ph-table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Payment Mode</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (<tr key={inv.id}>
                  <td style={{ fontWeight: 700, color: '#0d9488' }}>{inv.invoiceNumber}</td>
                  <td>{inv.customerName}</td>
                  <td style={{ fontSize: '0.8rem' }}>{inv.date}</td>
                  <td><span className="badge-ph badge-neutral">{inv.paymentMethod}</span></td>
                  <td style={{ fontWeight: 700 }}>₹{inv.grandTotal.toFixed(2)}</td>
                  <td><span className="badge-ph badge-success">{inv.paymentStatus}</span></td>
                  <td>
                    <button className="btn-ph btn-ph-secondary btn-ph-sm" onClick={() => setActiveInvoiceForPrint(inv)}>
                      Print Receipt
                    </button>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT MODAL */}
      {activeInvoiceForPrint && (<PrintableInvoice invoice={activeInvoiceForPrint} onClose={() => setActiveInvoiceForPrint(null)}/>)}
    </div>);
};
