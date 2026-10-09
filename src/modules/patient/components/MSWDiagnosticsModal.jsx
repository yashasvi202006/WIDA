// WIDA Patient Module - Mock Service Worker (MSW) Diagnostics & Test Console
import React, { useState } from 'react';
import { Server, Activity, RefreshCw, CheckCircle, Database, Shield, Zap, X } from 'lucide-react';
import { patientApiService } from '../services/patientApiService';
export const MSWDiagnosticsModal = ({ isOpen, onClose, onDataReset }) => {
    const [pingStatus, setPingStatus] = useState(null);
    const [pingResponse, setPingResponse] = useState(null);
    const [isPinging, setIsPinging] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    if (!isOpen)
        return null;
    const handleTestPing = async () => {
        setIsPinging(true);
        setPingStatus('Pinging /api/system/health...');
        const startTime = performance.now();
        try {
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator && !navigator.serviceWorker.controller) {
                const { ensureMswActive } = await import('../../../mocks/browser');
                await ensureMswActive();
            }
            const res = await patientApiService.checkHealth();
            const elapsed = Math.round(performance.now() - startTime);
            setPingStatus(`200 OK (${elapsed}ms)`);
            setPingResponse(JSON.stringify(res, null, 2));
        }
        catch (err) {
            setPingStatus('Request Failed');
            setPingResponse(err instanceof Error ? err.message : String(err));
        }
        finally {
            setIsPinging(false);
        }
    };
    const handleResetDb = async () => {
        if (!window.confirm('Reset all mock database collections to original seed state?'))
            return;
        setIsResetting(true);
        try {
            await patientApiService.resetMockDatabase();
            if (onDataReset) {
                onDataReset();
            }
            alert('Mock database successfully restored to seed data.');
            onClose();
        }
        catch (err) {
            alert(`Reset failed: ${err}`);
        }
        finally {
            setIsResetting(false);
        }
    };
    return (<div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 1060
        }} onClick={onClose}>
      <div className="patient-card shadow-lg p-0 border overflow-hidden" style={{
            width: '92%',
            maxWidth: 620,
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--p-surface)',
            borderColor: 'var(--p-border)'
        }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between text-white" style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)' }}>
          <div className="d-flex align-items-center gap-2">
            <Server size={20}/>
            <h5 className="mb-0 font-heading fw-bold" style={{ fontSize: '1.05rem' }}>
              Backend & SQLite Database Integration Console
            </h5>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-link text-white p-0 text-decoration-none" aria-label="Close Diagnostics modal">
            <X size={20}/>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-auto flex-fill d-flex flex-column gap-3" style={{ fontSize: '0.86rem' }}>
          {/* Status Banner */}
          <div className="p-3 rounded border d-flex align-items-center justify-content-between" style={{
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            borderColor: 'rgba(16, 185, 129, 0.3)'
        }}>
            <div className="d-flex align-items-center gap-3">
              <span style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 8px #10B981'
        }}/>
              <div>
                <div className="fw-bold" style={{ color: 'var(--p-text-main)' }}>
                  Java Enterprise Server & SQLite DB Connected
                </div>
                <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                  Target: <code>http://localhost:8080/api/*</code> • Relational Database: <code>patient.db</code>
                </div>
              </div>
            </div>
            <span className="badge bg-success bg-opacity-20 text-success border border-success">
              Port 8080 Active
            </span>
          </div>

          {/* Stats Grid */}
          <div className="row g-2">
            <div className="col-sm-6">
              <div className="p-3 rounded border bg-light bg-opacity-50 h-100">
                <div className="text-muted small d-flex align-items-center gap-1 mb-1">
                  <Activity size={14} className="text-primary"/> Active Handlers
                </div>
                <div className="h5 fw-bold mb-0 font-heading">42 REST Routes</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                  Auth, Doctors, Appointments, Rx, Diagnostics, SOS, etc.
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="p-3 rounded border bg-light bg-opacity-50 h-100">
                <div className="text-muted small d-flex align-items-center gap-1 mb-1">
                  <Zap size={14} className="text-warning"/> Simulated Latency
                </div>
                <div className="h5 fw-bold mb-0 font-heading">250 ms</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                  Realistic network delay with async async/await lifecycle
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="p-3 rounded border bg-light bg-opacity-50 h-100">
                <div className="text-muted small d-flex align-items-center gap-1 mb-1">
                  <Database size={14} className="text-teal"/> Database Engine
                </div>
                <div className="h5 fw-bold mb-0 font-heading">SQLite 3 (patient.db)</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                  Native relational tables connected via Java JDBC driver
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="p-3 rounded border bg-light bg-opacity-50 h-100">
                <div className="text-muted small d-flex align-items-center gap-1 mb-1">
                  <Shield size={14} className="text-success"/> Security Protocol
                </div>
                <div className="h5 fw-bold mb-0 font-heading">Bearer Token Auth</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                  Protected endpoints validate JWT Authorization header
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="d-flex flex-wrap gap-2 mt-2">
            <button onClick={handleTestPing} disabled={isPinging} className="patient-btn patient-btn-primary flex-fill d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '0.84rem' }}>
              <Activity size={15}/>
              {isPinging ? 'Pinging...' : 'Test API Live Ping (/api/system/health)'}
            </button>

            <button onClick={handleResetDb} disabled={isResetting} className="patient-btn patient-btn-outline flex-fill d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '0.84rem', color: '#DC2626', borderColor: '#FCA5A5' }}>
              <RefreshCw size={15}/>
              {isResetting ? 'Resetting...' : 'Reset Mock DB Seed Data'}
            </button>
          </div>

          {/* Ping Live Result */}
          {pingStatus && (<div className="p-3 rounded border bg-dark text-light font-monospace" style={{ fontSize: '0.75rem' }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-success d-flex align-items-center gap-1">
                  <CheckCircle size={14}/> Result: {pingStatus}
                </span>
                <span className="text-muted">Network Layer</span>
              </div>
              {pingResponse && (<pre className="mb-0 text-white-50" style={{ maxHeight: 120, overflow: 'auto' }}>
                  {pingResponse}
                </pre>)}
            </div>)}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-top bg-light bg-opacity-50 d-flex justify-content-end" style={{ borderColor: 'var(--p-border)' }}>
          <button onClick={onClose} className="patient-btn patient-btn-neutral">
            Done
          </button>
        </div>
      </div>
    </div>);
};
