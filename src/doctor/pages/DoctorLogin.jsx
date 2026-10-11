import React, { useState } from 'react';
import { doctorApi } from '../services/doctorApi.js';
export const DoctorLogin = ({ onLoginSuccess, onGoToRegister, }) => {
    const [email, setEmail] = useState('aarav.sharma@wida.org');
    const [password, setPassword] = useState('Doctor@123');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const sampleDoctors = doctorApi.getAllDoctors();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email.trim()) {
            setError('Please enter your email.');
            return;
        }
        if (!password) {
            setError('Please enter your password.');
            return;
        }
        setIsLoading(true);
        try {
            const doc = await doctorApi.login(email, password);
            onLoginSuccess(doc);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSelectSampleDoctor = (doc) => {
        setEmail(doc.email);
        setPassword('Doctor@123');
        setError('');
    };
    return (<div className="doc-auth-container">
      <div className="doc-auth-card">
        <div className="doc-auth-header">
          <div className="doc-brand-badge">
            <span>🛡️</span>
            <span>WIDA DOCTOR PORTAL</span>
          </div>
          <h1>Doctor Sign In</h1>
          <p>Access your authorized clinical management workspace</p>
        </div>

        {error && (<div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px',
                borderRadius: 'var(--doc-radius)',
                marginBottom: '20px',
                fontSize: '13.5px',
            }}>
            ⚠️ {error}
          </div>)}

        <form onSubmit={handleSubmit} className="doc-form-grid single-col">
          <div className="doc-form-group">
            <label className="doc-label" htmlFor="doc-email">
              Professional Email Address <span className="req">*</span>
            </label>
            <input id="doc-email" type="email" className="doc-input" placeholder="doctor@hospital.org" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>

          <div className="doc-form-group">
            <label className="doc-label" htmlFor="doc-password">
              Password <span className="req">*</span>
            </label>
            <input id="doc-password" type="password" className="doc-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </div>

          <button type="submit" className="doc-btn doc-btn-primary doc-btn-lg" style={{ width: '100%', marginTop: '8px' }} disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Sign In to Workspace'}
          </button>
        </form>

        {/* Quick Demo Credentials Box */}
        <div style={{
            marginTop: '24px',
            padding: '14px',
            background: 'var(--doc-surface-muted)',
            borderRadius: 'var(--doc-radius)',
            border: '1px solid var(--doc-border)',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--doc-text-muted)', marginBottom: '8px' }}>
            ⚡ QUICK DEMO LOGIN (SELECT SPECIALIST):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {sampleDoctors.slice(0, 4).map((d) => (<button key={d.id} type="button" className="doc-btn doc-btn-outline doc-btn-sm" onClick={() => handleSelectSampleDoctor(d)}>
                {d.fullName} ({d.specializationName})
              </button>))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13.5px' }}>
          New practitioner?{' '}
          <button type="button" className="doc-btn-ghost" style={{ color: 'var(--doc-primary)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }} onClick={onGoToRegister}>
            Register Doctor Account &rarr;
          </button>
        </div>
      </div>
    </div>);
};
