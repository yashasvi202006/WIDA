import React, { useState, useEffect } from 'react';
// WIDA Doctor Module (Vanshika Tailor)
import DoctorApp from './doctor/DoctorApp.jsx';
// WIDA Patient Module
import { PatientModule } from './modules/patient';

export default function App() {
  const getInitialPortal = () => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('portal');
    if (p === 'patient') return 'patient';
    if (p === 'doctor') return 'doctor';
    const saved = localStorage.getItem('wida_active_portal');
    if (saved) return saved;
    return 'doctor';
  };

  const [portal, setPortal] = useState(getInitialPortal);

  useEffect(() => {
    localStorage.setItem('wida_active_portal', portal);
  }, [portal]);

  return (
    <div>
      {/* WIDA Multi-Portal Floating Switcher */}
      <div
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 99999,
          background: 'rgba(15, 23, 42, 0.94)',
          backdropFilter: 'blur(10px)',
          borderRadius: '9999px',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          fontSize: '12px',
          color: '#fff',
        }}
      >
        <span style={{ fontWeight: 600, color: '#94a3b8' }}>Portal:</span>
        <button
          type="button"
          onClick={() => setPortal('doctor')}
          style={{
            background: portal === 'doctor' ? '#007c77' : 'transparent',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          🩺 Doctor
        </button>
        <button
          type="button"
          onClick={() => setPortal('patient')}
          style={{
            background: portal === 'patient' ? '#0284c7' : 'transparent',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          👤 Patient
        </button>
      </div>

      {portal === 'doctor' ? <DoctorApp /> : <PatientModule initialTab="dashboard" />}
    </div>
  );
}
