import React, { useState } from 'react';
export const PharmacySettings = () => {
    const [taxRate, setTaxRate] = useState(5.0);
    const [defaultReorder, setDefaultReorder] = useState(25);
    const [currencySymbol, setCurrencySymbol] = useState('₹');
    const [autoDeductStock, setAutoDeductStock] = useState(true);
    const [savedMsg, setSavedMsg] = useState('');
    const handleSave = (e) => {
        e.preventDefault();
        setSavedMsg('Settings updated successfully!');
        setTimeout(() => setSavedMsg(''), 3000);
    };
    return (<div className="ph-card" style={{ maxWidth: '650px' }}>
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Pharmacy Module System Settings
          </h2>
          <span className="card-subtitle">Configure tax rates, reorder thresholds & billing parameters</span>
        </div>
      </div>

      {savedMsg && (<div style={{ padding: '10px 14px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '6px', marginBottom: '16px', fontWeight: 600 }}>
          ✅ {savedMsg}
        </div>)}

      <form onSubmit={handleSave}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Default GST / Tax Rate (%)</label>
            <input type="number" step="0.1" className="form-control" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}/>
          </div>

          <div className="form-group">
            <label className="form-label">Default Reorder Level Threshold (Units)</label>
            <input type="number" className="form-control" value={defaultReorder} onChange={(e) => setDefaultReorder(parseInt(e.target.value) || 0)}/>
          </div>

          <div className="form-group">
            <label className="form-label">Currency Symbol</label>
            <input type="text" className="form-control" value={currencySymbol} onChange={(e) => setCurrencySymbol(e.target.value)}/>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" id="autodeduct" checked={autoDeductStock} onChange={(e) => setAutoDeductStock(e.target.checked)}/>
            <label htmlFor="autodeduct" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
              Auto-deduct inventory stock upon completing sales / dispensing transactions
            </label>
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-ph btn-ph-primary">
            Save System Settings
          </button>
        </div>
      </form>
    </div>);
};
