import React, { useState } from 'react';
export const MedicineCategories = ({ medicines, onSelectCategory }) => {
    const categoryList = [
        'Tablets', 'Capsules', 'Syrups', 'Injections', 'Antibiotics',
        'Pain Relief', 'Vitamins and Supplements', 'Dermatology', 'Cardiac Medicines',
        'Diabetes Medicines', 'Respiratory Medicines', 'Gastrointestinal Medicines',
        'First Aid', 'Medical Supplies', 'Other'
    ];
    const [selectedCat, setSelectedCat] = useState(null);
    const getCategoryCount = (cat) => {
        return medicines.filter(m => m.category === cat).length;
    };
    const getCategoryStock = (cat) => {
        return medicines.filter(m => m.category === cat).reduce((sum, m) => sum + m.availableQuantity, 0);
    };
    return (<div className="ph-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
            Therapeutic Medicine Categories
          </h2>
          <span className="card-subtitle">Organized categories for classification and stock management</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginTop: '12px' }}>
        {categoryList.map(cat => {
            const count = getCategoryCount(cat);
            const totalUnits = getCategoryStock(cat);
            const isSelected = selectedCat === cat;
            return (<div key={cat} onClick={() => {
                    setSelectedCat(cat);
                    if (onSelectCategory)
                        onSelectCategory(cat);
                }} style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: isSelected ? '#e6f4f1' : '#ffffff',
                    border: `1.5px solid ${isSelected ? '#0d9488' : '#e2e8f0'}`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{cat}</span>
                <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: count > 0 ? '#ccfbf1' : '#f1f5f9',
                    color: count > 0 ? '#0f766e' : '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: 700
                }}>
                  {count} SKUs
                </span>
              </div>

              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                <span>Total Units in Stock:</span>
                <strong style={{ color: '#0f172a' }}>{totalUnits.toLocaleString()}</strong>
              </div>
            </div>);
        })}
      </div>

      {selectedCat && (<div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
            Medicines under "{selectedCat}" ({getCategoryCount(selectedCat)})
          </h3>

          <div className="table-container">
            <table className="ph-table">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Brand</th>
                  <th>Strength</th>
                  <th>Pack Size</th>
                  <th>Available Stock</th>
                  <th>Selling Price</th>
                </tr>
              </thead>
              <tbody>
                {medicines.filter(m => m.category === selectedCat).map(m => (<tr key={m.id}>
                    <td style={{ fontWeight: 700, color: '#0d9488' }}>{m.name}</td>
                    <td>{m.brand}</td>
                    <td>{m.strength}</td>
                    <td>{m.packSize}</td>
                    <td><strong>{m.availableQuantity}</strong></td>
                    <td>₹{m.sellingPrice.toFixed(2)}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>)}
    </div>);
};
