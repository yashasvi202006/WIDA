import React from 'react';
import { SummaryCards } from './SummaryCards';
export const DashboardOverview = ({ medicines, prescriptions, orders, notifications, metrics, onNavigate, onSelectPrescription }) => {
    const lowStockItems = medicines.filter(m => m.availableQuantity <= m.reorderLevel);
    const expiringItems = medicines.filter(m => {
        const expDate = new Date(m.expiryDate);
        const now = new Date();
        const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 90;
    });
    return (<div className="dashboard-grid">
      {/* ROW 1: SUMMARY CARDS */}
      <SummaryCards metrics={metrics} onCardClick={onNavigate}/>

      {/* ROW 2: INVENTORY OVERVIEW | STOCK ALERTS */}
      <div className="grid-row row-split-60-40">
        <div className="ph-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                Inventory Overview by Category
              </h3>
              <span className="card-subtitle">Distribution of medicines across therapeutic categories</span>
            </div>
            <button className="btn-ph btn-ph-secondary btn-ph-sm" onClick={() => onNavigate('inventory')}>
              View All SKUs
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '8px' }}>
            {[
            { cat: 'Antibiotics', count: 180, color: '#0d9488' },
            { cat: 'Pain Relief', count: 420, color: '#14b8a6' },
            { cat: 'Diabetes', count: 125, color: '#f59e0b' },
            { cat: 'Cardiac', count: 95, color: '#ef4444' },
            { cat: 'Respiratory', count: 210, color: '#3b82f6' },
            { cat: 'Gastrointestinal', count: 310, color: '#8b5cf6' }
        ].map(item => (<div key={item.cat} style={{
                padding: '14px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0'
            }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{item.cat}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  {item.count} <span style={{ fontSize: '0.72rem', fontWeight: 400 }}>units</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#e2e8f0', height: '5px', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (item.count / 420) * 100)}%`, backgroundColor: item.color, height: '100%' }}></div>
                </div>
              </div>))}
          </div>
        </div>

        <div className="ph-card">
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ color: '#d97706' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                Stock Alerts ({lowStockItems.length})
              </h3>
              <span className="card-subtitle">Items at or below reorder threshold</span>
            </div>
            <button className="btn-ph btn-ph-outline btn-ph-sm" onClick={() => onNavigate('stock-alerts')}>
              Manage Alerts
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lowStockItems.slice(0, 3).map(item => (<div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                backgroundColor: '#fffbeb',
                borderRadius: '8px',
                border: '1px solid #fef3c7'
            }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#78350f' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#92400e' }}>
                    Current: <strong>{item.availableQuantity}</strong> | Reorder level: {item.reorderLevel}
                  </div>
                </div>
                <button className="btn-ph btn-ph-primary btn-ph-sm" onClick={() => onNavigate('purchase-orders')}>
                  Restock PO
                </button>
              </div>))}
          </div>
        </div>
      </div>

      {/* ROW 3: RECENT PRESCRIPTIONS | EXPIRY TRACKER */}
      <div className="grid-row row-split-50-50">
        <div className="ph-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Incoming Doctor Prescriptions
              </h3>
              <span className="card-subtitle">Recent prescriptions from hospital doctors</span>
            </div>
            <button className="btn-ph btn-ph-secondary btn-ph-sm" onClick={() => onNavigate('prescriptions')}>
              View Queue
            </button>
          </div>

          <div className="table-container">
            <table className="ph-table">
              <thead>
                <tr>
                  <th>Prescription ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.slice(0, 3).map(rx => (<tr key={rx.id}>
                    <td style={{ fontWeight: 700, color: '#0d9488' }}>{rx.id}</td>
                    <td>{rx.patientName} ({rx.patientAge}y)</td>
                    <td>{rx.doctorName}</td>
                    <td>
                      <span className={`badge-ph ${rx.status === 'Dispensed' ? 'badge-success' :
                rx.status === 'Approved for Dispensing' ? 'badge-info' : 'badge-warning'}`}>
                        {rx.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-ph btn-ph-primary btn-ph-sm" onClick={() => {
                onSelectPrescription(rx);
                onNavigate('prescriptions');
            }}>
                        Process
                      </button>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ph-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Expiry Warning Tracker
              </h3>
              <span className="card-subtitle">Medicines approaching shelf expiration</span>
            </div>
            <button className="btn-ph btn-ph-outline btn-ph-sm" onClick={() => onNavigate('expiry-tracker')}>
              Expiry Log
            </button>
          </div>

          <div className="table-container">
            <table className="ph-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Batch</th>
                  <th>Expiry Date</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                {expiringItems.slice(0, 3).map(item => (<tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{item.batchNumber}</td>
                    <td style={{ color: '#dc2626', fontWeight: 700 }}>{item.expiryDate}</td>
                    <td><strong>{item.availableQuantity}</strong></td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ROW 4: RECENT ORDERS | QUICK ACTIONS */}
      <div className="grid-row row-split-60-40">
        <div className="ph-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                Recent Customer Pharmacy Orders
              </h3>
              <span className="card-subtitle">Online & counter orders for fulfillment</span>
            </div>
            <button className="btn-ph btn-ph-secondary btn-ph-sm" onClick={() => onNavigate('orders')}>
              All Orders
            </button>
          </div>

          <div className="table-container">
            <table className="ph-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Fulfillment</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(ord => (<tr key={ord.id}>
                    <td style={{ fontWeight: 700 }}>{ord.id}</td>
                    <td>{ord.customerName}</td>
                    <td style={{ fontWeight: 700 }}>₹{ord.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={`badge-ph ${ord.orderStatus === 'Ready for Collection' ? 'badge-success' : 'badge-warning'}`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{ord.fulfillmentType}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ph-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Quick Actions
              </h3>
              <span className="card-subtitle">Fast operations for active counter workflow</span>
            </div>
          </div>

          <div className="quick-actions-grid">
            <div className="action-tile" onClick={() => onNavigate('sales-billing')}>
              <div className="action-icon">₹</div>
              <div>
                <div className="action-title">New Counter Sale</div>
                <div className="action-desc">Generate pharmacy invoice</div>
              </div>
            </div>

            <div className="action-tile" onClick={() => onNavigate('inventory')}>
              <div className="action-icon">+</div>
              <div>
                <div className="action-title">Add Medicine</div>
                <div className="action-desc">Register new batch/stock</div>
              </div>
            </div>

            <div className="action-tile" onClick={() => onNavigate('dispensing')}>
              <div className="action-icon">Rx</div>
              <div>
                <div className="action-title">Dispense Prescription</div>
                <div className="action-desc">Process doctor Rx</div>
              </div>
            </div>

            <div className="action-tile" onClick={() => onNavigate('purchase-orders')}>
              <div className="action-icon">PO</div>
              <div>
                <div className="action-title">Create Supplier PO</div>
                <div className="action-desc">Order stock from supplier</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 5: SALES OVERVIEW | NOTIFICATIONS */}
      <div className="grid-row row-split-50-50">
        <div className="ph-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                Today's Revenue Summary
              </h3>
              <span className="card-subtitle">Payment method split and sales totals</span>
            </div>
            <button className="btn-ph btn-ph-secondary btn-ph-sm" onClick={() => onNavigate('reports')}>
              Sales Report
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#f0fdfa', borderRadius: '8px', border: '1px solid #ccfbf1' }}>
              <div style={{ fontSize: '0.75rem', color: '#0f766e', fontWeight: 600 }}>UPI / QR Payment</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>₹28,450</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>66.3% of today's total</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>Cash Counter</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>₹10,200</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>23.8% of today's total</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 600 }}>Card / Insurance</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>₹4,200</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>9.9% of today's total</div>
            </div>
          </div>
        </div>

        <div className="ph-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                Pharmacy System Alerts & Feeds
              </h3>
              <span className="card-subtitle">Realtime updates from stock & prescription engine</span>
            </div>
            <button className="btn-ph btn-ph-outline btn-ph-sm" onClick={() => onNavigate('notifications')}>
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {notifications.slice(0, 3).map(n => (<div key={n.id} style={{
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: n.priority === 'high' ? '#fee2e2' : '#f8fafc',
                border: `1px solid ${n.priority === 'high' ? '#fca5a5' : '#e2e8f0'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', color: n.priority === 'high' ? '#991b1b' : '#0f172a' }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#475569' }}>{n.description}</div>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{n.timestamp}</span>
              </div>))}
          </div>
        </div>
      </div>
    </div>);
};
