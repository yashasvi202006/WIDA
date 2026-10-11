import React, { useState } from 'react';
export const ExpiryTracker = ({ medicines, onDeactivateExpiredBatch }) => {
    const [filterDays, setFilterDays] = useState(30);
    const now = new Date();
    const getDaysUntilExpiry = (expiryDateStr) => {
        const exp = new Date(expiryDateStr);
        const diffTime = exp.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
    const filteredItems = medicines.filter(m => {
        const days = getDaysUntilExpiry(m.expiryDate);
        if (filterDays === 'expired')
            return days <= 0;
        return days > 0 && days <= filterDays;
    });
    return (<div className="ph-card">
      <div className="card-header">
        <div>
          <h2 className="card-title" style={{ color: '#dc2626' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Expiry Warning & Batch Quarantine Tracker
          </h2>
          <span className="card-subtitle">Strict compliance monitor: Prevents expired medicine batches from being dispensed</span>
        </div>
      </div>

      <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#fff1f2',
            borderRadius: '8px',
            border: '1px solid #fecdd3'
        }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9f1239' }}>Filter Expiry Range:</span>
        <button className={`btn-ph ${filterDays === 7 ? 'btn-ph-danger' : 'btn-ph-outline'} btn-ph-sm`} onClick={() => setFilterDays(7)}>
          Expiring in 7 Days
        </button>
        <button className={`btn-ph ${filterDays === 30 ? 'btn-ph-danger' : 'btn-ph-outline'} btn-ph-sm`} onClick={() => setFilterDays(30)}>
          Expiring in 30 Days
        </button>
        <button className={`btn-ph ${filterDays === 90 ? 'btn-ph-secondary' : 'btn-ph-outline'} btn-ph-sm`} onClick={() => setFilterDays(90)}>
          Expiring in 90 Days
        </button>
        <button className={`btn-ph ${filterDays === 'expired' ? 'btn-ph-danger' : 'btn-ph-outline'} btn-ph-sm`} onClick={() => setFilterDays('expired')}>
          Already Expired
        </button>
      </div>

      <div className="table-container">
        <table className="ph-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Batch Number</th>
              <th>Expiry Date</th>
              <th>Days Left</th>
              <th>Qty in Stock</th>
              <th>Manufacturer</th>
              <th>Safety Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (<tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#059669' }}>
                  ✅ No medicine batches fall under this expiry filter.
                </td>
              </tr>) : (filteredItems.map(m => {
            const days = getDaysUntilExpiry(m.expiryDate);
            const isExpired = days <= 0;
            return (<tr key={m.id}>
                    <td style={{ fontWeight: 700 }}>{m.name}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{m.batchNumber}</td>
                    <td style={{ color: isExpired ? '#dc2626' : '#d97706', fontWeight: 700 }}>{m.expiryDate}</td>
                    <td>
                      <strong style={{ color: isExpired ? '#dc2626' : '#d97706' }}>
                        {isExpired ? 'EXPIRED' : `${days} Days`}
                      </strong>
                    </td>
                    <td><strong>{m.availableQuantity} units</strong></td>
                    <td>{m.manufacturer}</td>
                    <td>
                      {isExpired ? (<span className="badge-ph badge-danger">BLOCKED - QUARANTINED</span>) : (<span className="badge-ph badge-warning">Near Expiry Warning</span>)}
                    </td>
                    <td>
                      <button className="btn-ph btn-ph-danger btn-ph-sm" onClick={() => onDeactivateExpiredBatch(m.id)}>
                        Quarantine & Deactivate
                      </button>
                    </td>
                  </tr>);
        }))}
          </tbody>
        </table>
      </div>
    </div>);
};
