import React, { useState } from 'react';
export const ReportsAndAnalytics = ({ medicines, prescriptions, invoices, purchaseOrders, returns }) => {
    const [activeReport, setActiveReport] = useState('sales');
    const [dateRange, setDateRange] = useState('month');
    const totalSalesVal = invoices.reduce((sum, i) => sum + i.grandTotal, 0);
    const totalPOVal = purchaseOrders.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalInventoryVal = medicines.reduce((sum, m) => sum + (m.availableQuantity * m.sellingPrice), 0);
    return (<div className="ph-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Pharmacy Analytics & Clinical Reports
          </h2>
          <span className="card-subtitle">Comprehensive financial, inventory & clinical fulfilment reports</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <select className="form-control" style={{ width: 'auto', fontSize: '0.85rem' }} value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="today">Today's Data</option>
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="year">Current Year</option>
          </select>
          <button className="btn-ph btn-ph-secondary btn-ph-sm" onClick={() => window.print()}>
            Export CSV / Print Report
          </button>
        </div>
      </div>

      {/* REPORT SELECTOR TABS */}
      <div style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
        }}>
        {[
            { id: 'sales', label: 'Sales & Revenue Report' },
            { id: 'inventory', label: 'Inventory Valuation' },
            { id: 'lowstock', label: 'Low Stock Report' },
            { id: 'expiry', label: 'Expiry Audit Report' },
            { id: 'prescription', label: 'Prescription Fulfilment' },
            { id: 'purchase', label: 'Procurement Spend' },
            { id: 'returns', label: 'Quarantine & Returns' },
            { id: 'movement', label: 'Stock Movement Log' }
        ].map(tab => (<button key={tab.id} className={`btn-ph ${activeReport === tab.id ? 'btn-ph-primary' : 'btn-ph-outline'} btn-ph-sm`} onClick={() => setActiveReport(tab.id)}>
            {tab.label}
          </button>))}
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#e6f4f1', border: '1px solid #ccfbf1' }}>
          <div style={{ fontSize: '0.8rem', color: '#0f766e', fontWeight: 600 }}>TOTAL INVENTORY VALUATION</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            ₹{totalInventoryVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Calculated across {medicines.length} SKUs</div>
        </div>

        <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' }}>
          <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 600 }}>TOTAL SALES REVENUE</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            ₹{totalSalesVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>From {invoices.length} billing transactions</div>
        </div>

        <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <div style={{ fontSize: '0.8rem', color: '#1d4ed8', fontWeight: 600 }}>PURCHASE PROCUREMENT SPEND</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            ₹{totalPOVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Across {purchaseOrders.length} supplier orders</div>
        </div>
      </div>

      {/* DYNAMIC REPORT CONTENT */}
      {activeReport === 'sales' && (<div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Sales Transactions Log</h3>
          <div className="table-container">
            <table className="ph-table">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Payment Mode</th>
                  <th>Subtotal</th>
                  <th>Discount</th>
                  <th>Tax</th>
                  <th>Grand Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(i => (<tr key={i.id}>
                    <td style={{ fontWeight: 700, color: '#0d9488' }}>{i.invoiceNumber}</td>
                    <td>{i.customerName}</td>
                    <td>{i.date}</td>
                    <td><span className="badge-ph badge-neutral">{i.paymentMethod}</span></td>
                    <td>₹{i.subtotal.toFixed(2)}</td>
                    <td style={{ color: '#059669' }}>-₹{i.discount.toFixed(2)}</td>
                    <td>₹{i.tax.toFixed(2)}</td>
                    <td style={{ fontWeight: 700 }}>₹{i.grandTotal.toFixed(2)}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>)}

      {activeReport === 'inventory' && (<div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Inventory Valuation Breakdown</h3>
          <div className="table-container">
            <table className="ph-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Category</th>
                  <th>Available Stock</th>
                  <th>Unit Selling Price</th>
                  <th>Total Valuation (₹)</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map(m => (<tr key={m.id}>
                    <td style={{ fontWeight: 600 }}>{m.name}</td>
                    <td>{m.category}</td>
                    <td>{m.availableQuantity}</td>
                    <td>₹{m.sellingPrice.toFixed(2)}</td>
                    <td style={{ fontWeight: 700 }}>₹{(m.availableQuantity * m.sellingPrice).toFixed(2)}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>)}

      {activeReport === 'prescription' && (<div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Prescription Fulfilment Audit</h3>
          <div className="table-container">
            <table className="ph-table">
              <thead>
                <tr>
                  <th>RX ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Prescription Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map(p => (<tr key={p.id}>
                    <td style={{ fontWeight: 700, color: '#0d9488' }}>{p.id}</td>
                    <td>{p.patientName}</td>
                    <td>{p.doctorName}</td>
                    <td>{p.prescriptionDate}</td>
                    <td><span className="badge-ph badge-success">{p.status}</span></td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>)}

      {activeReport !== 'sales' && activeReport !== 'inventory' && activeReport !== 'prescription' && (<div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', color: '#64748b' }}>
          Report data rendered dynamically for active range: <strong>{dateRange}</strong>.
        </div>)}
    </div>);
};
