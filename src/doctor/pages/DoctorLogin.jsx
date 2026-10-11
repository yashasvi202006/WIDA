import React, { useState } from 'react';
import { doctorApi } from '../services/doctorApi.js';
export const DoctorLogin = ({ onLoginSuccess, onGoToRegister, }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email.trim()) {
            setError('Please enter your professional email.');
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
            try {
                const regMap = JSON.parse(localStorage.getItem('wida_registered_users_map') || '{}');
                const u = regMap[email.trim().toLowerCase()];
                if (u && (u.role === 'doctor' || u.doctorId)) {
                    onLoginSuccess(u);
                    return;
                }
            } catch {}
            setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
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

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13.5px' }}>
          New practitioner?{' '}
          <button type="button" className="doc-btn-ghost" style={{ color: 'var(--doc-primary)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }} onClick={onGoToRegister}>
            Register Doctor Account &rarr;
          </button>
        </div>
      </div>
    </div>);
};
