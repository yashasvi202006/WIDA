import React, { useState } from 'react';
export const SupplierManagement = ({ suppliers, onAddSupplier, onUpdateSupplier }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        categories: ['Antibiotics', 'Pain Relief'],
        status: 'Active'
    });
    const filteredSuppliers = suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.includes(searchTerm));
    const handleOpenAdd = () => {
        setFormData({
            id: `SUP-${100 + suppliers.length + 1}`,
            name: '',
            contactPerson: '',
            phone: '+91 ',
            email: '',
            address: '',
            categories: ['Antibiotics', 'Pain Relief'],
            status: 'Active',
            totalOrders: 0
        });
        setShowAddModal(true);
    };
    const handleOpenEdit = (sup) => {
        setEditingSupplier(sup);
        setFormData({ ...sup });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.contactPerson)
            return;
        if (editingSupplier) {
            onUpdateSupplier(formData);
            setEditingSupplier(null);
        }
        else {
            onAddSupplier(formData);
            setShowAddModal(false);
        }
    };
    return (<div className="ph-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            Pharmaceutical Supplier Directory
          </h2>
          <span className="card-subtitle">Verified suppliers, business contact details & purchase history</span>
        </div>

        <button className="btn-ph btn-ph-primary" onClick={handleOpenAdd}>
          + Add New Supplier
        </button>
      </div>

      <div style={{ marginBottom: '16px', maxWidth: '400px' }}>
        <input type="text" className="form-control" placeholder="Search supplier name, contact person..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>

      <div className="table-container">
        <table className="ph-table">
          <thead>
            <tr>
              <th>Supplier ID & Name</th>
              <th>Contact Person</th>
              <th>Phone & Email</th>
              <th>Supplied Categories</th>
              <th>Total Orders</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map(s => (<tr key={s.id}>
                <td>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{s.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#0d9488' }}>{s.id}</div>
                </td>
                <td>{s.contactPerson}</td>
                <td>
                  <div>{s.phone}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.email}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {s.categories.map(c => <span key={c} className="badge-ph badge-neutral">{c}</span>)}
                  </div>
                </td>
                <td><strong>{s.totalOrders} Orders</strong></td>
                <td>
                  <span className={`badge-ph ${s.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                    {s.status}
                  </span>
                </td>
                <td>
                  <button className="btn-ph btn-ph-outline btn-ph-sm" onClick={() => handleOpenEdit(s)}>
                    Edit
                  </button>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT SUPPLIER MODAL */}
      {(showAddModal || editingSupplier) && (<div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">{editingSupplier ? 'Edit Supplier' : 'Register New Supplier'}</h3>
              <button style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => { setShowAddModal(false); setEditingSupplier(null); }}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Supplier Business Name *</label>
                  <input type="text" className="form-control" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required/>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Contact Person *</label>
                    <input type="text" className="form-control" value={formData.contactPerson || ''} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} required/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Phone *</label>
                    <input type="text" className="form-control" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Business Email</label>
                  <input type="email" className="form-control" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Business Address</label>
                  <input type="text" className="form-control" value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })}/>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-ph btn-ph-outline" onClick={() => { setShowAddModal(false); setEditingSupplier(null); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-ph btn-ph-primary">Save Supplier</button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
