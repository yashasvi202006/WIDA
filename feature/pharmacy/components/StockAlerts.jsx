import React, { useState } from 'react';
export const StockAlerts = ({ medicines, onCreatePO }) => {
    const [activeTab, setActiveTab] = useState('all');
    const lowStockItems = medicines.filter(m => m.availableQuantity > 0 && m.availableQuantity <= m.reorderLevel);
    const outOfStockItems = medicines.filter(m => m.availableQuantity === 0);
    const displayedItems = activeTab === 'low' ? lowStockItems :
        activeTab === 'out' ? outOfStockItems :
            [...lowStockItems, ...outOfStockItems];
    return (<div className="ph-card">
      <div className="card-header">
        <div>
          <h2 className="card-title" style={{ color: '#d97706' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            Stock Alerts & Replenishment Radar
          </h2>
          <span className="card-subtitle">Real-time alerts for low stock and depleted inventory levels</span>
        </div>

        <button className="btn-ph btn-ph-primary" onClick={onCreatePO}>
          Create Replenishment Purchase Order
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button className={`btn-ph ${activeTab === 'all' ? 'btn-ph-secondary' : 'btn-ph-outline'} btn-ph-sm`} onClick={() => setActiveTab('all')}>
          All Alerts ({lowStockItems.length + outOfStockItems.length})
        </button>
        <button className={`btn-ph ${activeTab === 'low' ? 'btn-ph-secondary' : 'btn-ph-outline'} btn-ph-sm`} onClick={() => setActiveTab('low')}>
          Low Stock ({lowStockItems.length})
        </button>
        <button className={`btn-ph ${activeTab === 'out' ? 'btn-ph-danger' : 'btn-ph-outline'} btn-ph-sm`} onClick={() => setActiveTab('out')}>
          Out of Stock ({outOfStockItems.length})
        </button>
      </div>

      <div className="table-container">
        <table className="ph-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Category</th>
              <th>Current Qty</th>
              <th>Reorder Threshold</th>
              <th>Recommended Order Qty</th>
              <th>Supplier</th>
              <th>Alert Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.length === 0 ? (<tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#059669' }}>
                  ✅ No stock alert warnings at this time. All items are sufficiently stocked.
                </td>
              </tr>) : (displayedItems.map(item => {
            const isOut = item.availableQuantity === 0;
            const recQty = Math.max(100, item.reorderLevel * 3 - item.availableQuantity);
            return (<tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.genericName} | {item.id}</div>
                    </td>
                    <td><span className="badge-ph badge-neutral">{item.category}</span></td>
                    <td>
                      <strong style={{ color: isOut ? '#dc2626' : '#d97706', fontSize: '1.05rem' }}>
                        {item.availableQuantity}
                      </strong>
                    </td>
                    <td>{item.reorderLevel}</td>
                    <td><strong>{recQty} units</strong></td>
                    <td>{item.supplierName}</td>
                    <td>
                      {isOut ? (<span className="badge-ph badge-danger">Out of Stock</span>) : (<span className="badge-ph badge-warning">Low Stock</span>)}
                    </td>
                    <td>
                      <button className="btn-ph btn-ph-primary btn-ph-sm" onClick={onCreatePO}>
                        Order Stock
                      </button>
                    </td>
                  </tr>);
        }))}
          </tbody>
        </table>
      </div>
    </div>);
};
