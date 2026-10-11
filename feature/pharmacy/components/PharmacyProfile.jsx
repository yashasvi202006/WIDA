import React from 'react';
export const PharmacyProfile = () => {
    return (<div className="ph-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            MEDiTRACK Pharmacy Profile
          </h2>
          <span className="card-subtitle">Official facility credentials, licensing & authorized pharmacist team</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px', color: '#0d9488' }}>
            Facility Credentials
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
            <div><strong>Pharmacy Name:</strong> MEDiTRACK Central Hospital Pharmacy</div>
            <div><strong>Pharmacy ID:</strong> PH-MED-9901</div>
            <div><strong>Drug License No:</strong> DL-PH-2024-88492 / 88493</div>
            <div><strong>GSTIN Number:</strong> 27AAAAA0000A1Z5</div>
            <div><strong>Address:</strong> Healthcare Express Tower, Sector 14, New Delhi</div>
            <div><strong>Contact Phone:</strong> +91 11 4050 9900</div>
            <div><strong>Emergency Hotline:</strong> 1800 200 4400</div>
            <div><strong>Business Email:</strong> pharmacy@meditrack.org</div>
            <div><strong>Operating Hours:</strong> 24 Hours / 7 Days a Week</div>
            <div><strong>Profile Status:</strong> <span className="badge-ph badge-success">Active License</span></div>
          </div>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px', color: '#0d9488' }}>
            Authorized Pharmacists & Staff
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
            { name: 'Dr. Yogita Chugh', role: 'Head Pharmacist / Module Owner', reg: 'REG-PH-4401', status: 'On Duty' },
            { name: 'Dr. Rahul Singhania', role: 'Senior Clinical Pharmacist', reg: 'REG-PH-4409', status: 'On Duty' },
            { name: 'Priya Sharma', role: 'Assistant Pharmacist', reg: 'REG-PH-5112', status: 'Shift B' },
            { name: 'Sanjay Kumar', role: 'Inventory Specialist', reg: 'REG-INV-902', status: 'On Duty' }
        ].map(staff => (<div key={staff.reg} style={{
                padding: '12px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{staff.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{staff.role} | {staff.reg}</div>
                </div>
                <span className="badge-ph badge-success">{staff.status}</span>
              </div>))}
          </div>
        </div>
      </div>
    </div>);
};
