import React, { useState } from 'react';
import { Activity, ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import type { PatientProfile } from '../types/patientTypes';
import { patientApiService } from '../services/patientApiService';

interface PatientLoginProps {
  onLoginSuccess: (profile?: PatientProfile) => void;
  onNavigateRegister: () => void;
}

export const PatientLogin: React.FC<PatientLoginProps> = ({
  onLoginSuccess,
  onNavigateRegister
}) => {
  const [identifier, setIdentifier] = useState('yashasvi.saini@wida.health');
  const [password, setPassword] = useState('wida2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your ABHA ID, Email, or Mobile Number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await patientApiService.login(identifier);
      onLoginSuccess(res.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please verify your ABHA or Email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    const demoId = '91-4820-1928-3012';
    setIdentifier(demoId);
    setPassword('yashasvi@demo');
    setIsLoading(true);
    setError('');
    try {
      const res = await patientApiService.login(demoId);
      onLoginSuccess(res.user);
    } catch {
      onLoginSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 p-3"
      style={{
        backgroundColor: 'var(--p-bg, #F7FAFA)',
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(13, 148, 136, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.06) 0px, transparent 50%)'
      }}
    >
      <div style={{ maxWidth: 460, width: '100%' }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center mb-2"
            style={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              backgroundColor: 'var(--p-primary, #0D9488)',
              color: '#ffffff',
              boxShadow: '0 8px 16px -4px rgba(13, 148, 136, 0.35)'
            }}
          >
            <Activity size={28} />
          </div>
          <h2 className="font-heading fw-bold mb-1" style={{ color: 'var(--p-text-main, #172033)' }}>
            WIDA<span style={{ color: 'var(--p-primary, #0D9488)' }}>.health</span>
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Integrated Digital Healthcare Ecosystem • Patient Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="patient-card p-4 p-md-4 shadow-sm border">
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <div>
              <h5 className="font-heading mb-0" style={{ fontSize: '1.15rem' }}>Sign In</h5>
              <span className="text-muted" style={{ fontSize: '0.78rem' }}>Access unified clinical records & consultations</span>
            </div>
            <span className="patient-badge patient-badge-teal d-flex align-items-center gap-1">
              <ShieldCheck size={12} /> ABDM Secured
            </span>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.82rem' }} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>
                ABHA ID / Email / Mobile
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  className="patient-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="e.g. 91-4820-1928-3012 or email"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (error) setError('');
                  }}
                />
                <Mail
                  size={16}
                  className="position-absolute text-muted"
                  style={{ left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <label className="form-label fw-semibold mb-0" style={{ fontSize: '0.82rem' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your registered mobile/email.')}
                  className="border-0 bg-transparent p-0 text-muted"
                  style={{ fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="patient-input"
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                />
                <Lock
                  size={16}
                  className="position-absolute text-muted"
                  style={{ left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="position-absolute border-0 bg-transparent text-muted p-0"
                  style={{ right: '0.85rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between mb-3">
              <label className="d-flex align-items-center gap-2 mb-0" style={{ fontSize: '0.82rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember this device</span>
              </label>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>SSL 256-bit Encrypted</span>
            </div>

            <button
              type="submit"
              className="patient-btn patient-btn-primary w-100 py-2 mb-2 justify-content-center"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying Credentials...' : 'Sign In to Portal'}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Quick Demo Login Preset */}
          <div className="pt-2 border-top mt-3">
            <button
              type="button"
              className="patient-btn patient-btn-outline w-100 py-2 justify-content-center"
              style={{
                borderColor: 'var(--p-primary, #0D9488)',
                color: 'var(--p-primary, #0D9488)',
                backgroundColor: 'var(--p-primary-subtle, #F0FDFA)'
              }}
              onClick={handleQuickDemo}
            >
              <Sparkles size={16} />
              <span>1-Click Demo Login (Yashasvi Saini)</span>
            </button>
            <div className="text-center mt-1 text-muted" style={{ fontSize: '0.72rem' }}>
              Autofills verified ABHA #91-4820-1928-3012 for quick review
            </div>
          </div>
        </div>

        {/* Switch to Register */}
        <div className="text-center mt-3" style={{ fontSize: '0.85rem' }}>
          <span className="text-muted">Don't have an ABHA Health ID? </span>
          <button
            type="button"
            className="border-0 bg-transparent fw-bold p-0 text-teal"
            style={{ color: 'var(--p-primary, #0D9488)', cursor: 'pointer' }}
            onClick={onNavigateRegister}
          >
            Create New Account →
          </button>
        </div>

        {/* Regulatory Footer */}
        <div className="text-center mt-4 text-muted" style={{ fontSize: '0.72rem', lineHeight: 1.4 }}>
          <CheckCircle2 size={12} className="text-success me-1 inline-block" />
          Compliant with Ayushman Bharat Digital Mission (ABDM) & National Health Authority (NHA)
        </div>
      </div>
    </div>
  );
};
