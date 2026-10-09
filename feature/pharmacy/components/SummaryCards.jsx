import React from 'react';
export const SummaryCards = ({ metrics, onCardClick }) => {
    return (<div className="grid-row row-summary">
      <div className="summary-card teal" style={{ cursor: 'pointer' }} onClick={() => onCardClick && onCardClick('inventory')}>
        <div className="summary-icon-wrapper">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        </div>
        <div className="summary-details">
          <span className="summary-label">Total Medicines</span>
          <span className="summary-value">{metrics.totalMedicines.toLocaleString()}</span>
          <span className="summary-subtext">Active SKUs in inventory</span>
        </div>
      </div>

      <div className="summary-card amber" style={{ cursor: 'pointer' }} onClick={() => onCardClick && onCardClick('stock-alerts')}>
        <div className="summary-icon-wrapper">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <div className="summary-details">
          <span className="summary-label">Low Stock Items</span>
          <span className="summary-value">{metrics.lowStockCount}</span>
          <span className="summary-subtext" style={{ color: '#d97706', fontWeight: 600 }}>Requires replenishment</span>
        </div>
      </div>

      <div className="summary-card blue" style={{ cursor: 'pointer' }} onClick={() => onCardClick && onCardClick('prescriptions')}>
        <div className="summary-icon-wrapper">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div className="summary-details">
          <span className="summary-label">Pending Prescriptions</span>
          <span className="summary-value">{metrics.pendingPrescriptionsCount}</span>
          <span className="summary-subtext">Awaiting pharmacist review</span>
        </div>
      </div>

      <div className="summary-card green" style={{ cursor: 'pointer' }} onClick={() => onCardClick && onCardClick('sales-billing')}>
        <div className="summary-icon-wrapper">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <div className="summary-details">
          <span className="summary-label">Today's Sales</span>
          <span className="summary-value">₹{metrics.todaySalesAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          <span className="summary-subtext" style={{ color: '#059669', fontWeight: 600 }}>↑ 14% vs yesterday</span>
        </div>
      </div>
    </div>);
};
