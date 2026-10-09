import React, { useState } from 'react';
export const PrescriptionManagement = ({ prescriptions, medicines, onUpdatePrescriptionStatus, onProceedToDispense }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedRx, setSelectedRx] = useState(null);
    const [pharmacistNoteText, setPharmacistNoteText] = useState('');
    const filteredRxList = prescriptions.filter(rx => {
        const matchesSearch = rx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rx.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || rx.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    const handleOpenDetails = (rx) => {
        setSelectedRx(rx);
        setPharmacistNoteText(rx.pharmacistNotes || '');
    };
    const handleSaveNotes = () => {
        if (!selectedRx)
            return;
        onUpdatePrescriptionStatus(selectedRx.id, selectedRx.status, pharmacistNoteText);
        setSelectedRx({ ...selectedRx, pharmacistNotes: pharmacistNoteText });
    };
    return (<div className="ph-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Prescription Management & Verification
          </h2>
          <span className="card-subtitle">Review incoming hospital prescriptions, verify stock & approve for dispensing</span>
        </div>
      </div>

      <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '12px',
            marginBottom: '20px',
            padding: '14px',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
        }}>
        <div>
          <label className="form-label">Search Prescription ID / Patient / Doctor</label>
          <input type="text" className="form-control" placeholder="Type RX ID, patient name, doctor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>

        <div>
          <label className="form-label">Filter Status</label>
          <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved for Dispensing">Approved for Dispensing</option>
            <option value="Partially Dispensed">Partially Dispensed</option>
            <option value="Dispensed">Dispensed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="ph-table">
          <thead>
            <tr>
              <th>RX ID</th>
              <th>Patient Name & ID</th>
              <th>Doctor & Department</th>
              <th>Prescription Date</th>
              <th>Medicines Count</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRxList.length === 0 ? (<tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  No prescription records match criteria.
                </td>
              </tr>) : (filteredRxList.map(rx => (<tr key={rx.id}>
                  <td style={{ fontWeight: 700, color: '#0d9488' }}>{rx.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{rx.patientName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{rx.patientId} | {rx.patientAge}y {rx.patientGender}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{rx.doctorName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{rx.doctorDepartment}</div>
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>{rx.prescriptionDate}</td>
                  <td><strong>{rx.items.length} Items</strong></td>
                  <td>
                    <span className={`badge-ph ${rx.status === 'Dispensed' ? 'badge-success' :
                rx.status === 'Approved for Dispensing' ? 'badge-info' :
                    rx.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                      {rx.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn-ph btn-ph-secondary btn-ph-sm" onClick={() => handleOpenDetails(rx)}>
                        Review Rx
                      </button>
                      {rx.status !== 'Dispensed' && rx.status !== 'Rejected' && (<button className="btn-ph btn-ph-primary btn-ph-sm" onClick={() => onProceedToDispense(rx)}>
                          Dispense
                        </button>)}
                    </div>
                  </td>
                </tr>)))}
          </tbody>
        </table>
      </div>

      {/* PRESCRIPTION DETAIL MODAL */}
      {selectedRx && (<div className="modal-overlay">
          <div className="modal-card lg">
            <div className="modal-header">
              <h3 className="modal-title">Prescription Review: {selectedRx.id}</h3>
              <button style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setSelectedRx(null)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px',
                backgroundColor: '#e6f4f1',
                padding: '14px',
                borderRadius: '8px'
            }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#0f766e', fontWeight: 600 }}>PATIENT INFORMATION</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedRx.patientName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#475569' }}>{selectedRx.patientId} | {selectedRx.patientAge} yrs, {selectedRx.patientGender}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#0f766e', fontWeight: 600 }}>PRESCRIBING DOCTOR</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedRx.doctorName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#475569' }}>{selectedRx.doctorDepartment}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#0f766e', fontWeight: 600 }}>STATUS & DATE</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0d9488' }}>{selectedRx.status}</div>
                  <div style={{ fontSize: '0.78rem', color: '#475569' }}>{selectedRx.prescriptionDate}</div>
                </div>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '10px' }}>
                Prescribed Medicines Availability Check
              </h4>

              <div className="table-container">
                <table className="ph-table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Dosage & Frequency</th>
                      <th>Duration</th>
                      <th>Qty Req.</th>
                      <th>Available Stock</th>
                      <th>Availability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRx.items.map(item => {
                const activeMed = medicines.find(m => m.id === item.medicineId || m.name === item.medicineName);
                const currentStock = activeMed ? activeMed.availableQuantity : item.availableStock;
                const isStockSufficient = currentStock >= item.quantityRequested;
                return (<tr key={item.id}>
                          <td style={{ fontWeight: 700 }}>{item.medicineName}</td>
                          <td>{item.dosage} - {item.frequency}</td>
                          <td>{item.duration}</td>
                          <td><strong>{item.quantityRequested}</strong></td>
                          <td><strong style={{ color: isStockSufficient ? '#059669' : '#dc2626' }}>{currentStock}</strong></td>
                          <td>
                            {isStockSufficient ? (<span className="badge-ph badge-success">In Stock</span>) : (<span className="badge-ph badge-danger">Stock Shortage</span>)}
                          </td>
                        </tr>);
            })}
                  </tbody>
                </table>
              </div>

              <div className="form-group" style={{ marginTop: '10px' }}>
                <label className="form-label">Pharmacist Notes & Clinical Remarks</label>
                <textarea className="form-control" rows={3} placeholder="Enter pharmacist verification remarks..." value={pharmacistNoteText} onChange={(e) => setPharmacistNoteText(e.target.value)}></textarea>
                <button type="button" className="btn-ph btn-ph-outline btn-ph-sm" style={{ width: 'fit-content', marginTop: '4px' }} onClick={handleSaveNotes}>
                  Save Notes
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-ph btn-ph-danger" onClick={() => {
                onUpdatePrescriptionStatus(selectedRx.id, 'Rejected', pharmacistNoteText);
                setSelectedRx(null);
            }}>
                Reject Prescription
              </button>
              <button className="btn-ph btn-ph-secondary" onClick={() => {
                onUpdatePrescriptionStatus(selectedRx.id, 'Approved for Dispensing', pharmacistNoteText);
                setSelectedRx(null);
            }}>
                Approve for Dispensing
              </button>
              <button className="btn-ph btn-ph-primary" onClick={() => {
                setSelectedRx(null);
                onProceedToDispense(selectedRx);
            }}>
                Proceed to Dispense Workflow →
              </button>
            </div>
          </div>
        </div>)}
    </div>);
};
