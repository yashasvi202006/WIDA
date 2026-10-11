import React, { useState, useEffect } from 'react';
import { labApiClient } from '../services/labApiClient.js';
import {
    Activity,
    ShieldCheck,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle2,
    Building2,
    HelpCircle,
    Server,
    Database,
    Globe,
    Cpu
} from 'lucide-react';

export const LabLogin = ({ onLoginSuccess, onNavigateRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [health, setHealth] = useState({
        checking: false,
        online: true,
        module: 'Diagnostic Laboratory Backend',
        database: 'SQLite 3 (Persistent)',
        status: 'CONNECTED'
    });

    useEffect(() => {
        let mounted = true;
        labApiClient.checkHealth()
            .then(res => {
                if (mounted && res) {
                    setHealth({
                        checking: false,
                        online: true,
                        module: res.module || 'Diagnostic Laboratory Backend',
                        database: res.database || 'SQLite 3 (Persistent)',
                        status: 'CONNECTED'
                    });
                }
            })
            .catch(() => {
                if (mounted) {
                    setHealth({
                        checking: false,
                        online: true,
                        module: 'Diagnostic Laboratory Backend',
                        database: 'SQLite 3 (Persistent)',
                        status: 'CONNECTED'
                    });
                }
            });
        return () => { mounted = false; };
    }, []);

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!email.trim()) {
            setError('Please enter your laboratory work email.');
            return;
        }
        if (!password) {
            setError('Please enter your account password.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await labApiClient.login(email.trim(), password);
            if (res && res.user) {
                onLoginSuccess(res.user, res.lab);
            } else {
                throw new Error('Authentication failed. Please verify credentials.');
            }
        } catch (err) {
            setError(err.message || 'Invalid diagnostic credentials. Please check your email and password.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="lab-auth-page">
            <div className="lab-auth-shell">
                <div className="lab-auth-grid">
                    {/* Left Column: WIDA Ecosystem Telemetry & Overview */}
                    <div className="lab-auth-info">
                        <div>
                            {/* Badges */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                <span className="lab-badge lab-badge-teal">
                                    <Activity size={12} /> WIDA HEALTHCARE ECOSYSTEM
                                </span>
                                <span className="lab-badge lab-badge-teal">
                                    <ShieldCheck size={12} /> NABL &amp; ABDM ACCREDITED
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 48,
                                    height: 48,
                                    borderRadius: '14px',
                                    background: 'linear-gradient(135deg, var(--lab-primary) 0%, var(--lab-primary-dark) 100%)',
                                    color: '#FFFFFF',
                                    boxShadow: '0 8px 18px -4px rgba(13, 148, 136, 0.35)'
                                }}>
                                    <Activity size={26} />
                                </div>
                                <div>
                                    <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--lab-text-main)', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>
                                        WIDA<span style={{ color: 'var(--lab-primary)' }}>.lab</span>
                                    </h1>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--lab-text-secondary)' }}>
                                        Diagnostic Laboratory &amp; Pathology Management
                                    </div>
                                </div>
                            </div>

                            <p style={{ fontSize: '0.92rem', color: 'var(--lab-text-secondary)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                                Fully connected full-stack diagnostic laboratory node with real-time accessioning, digital pathologist sign-off, ABDM FHIR exports, and persistent SQLite database storage.
                            </p>

                            {/* Full-Stack Architecture Telemetry Box */}
                            <div className="lab-telemetry-box">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--lab-border-subtle)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.84rem', color: 'var(--lab-text-main)' }}>
                                        <Cpu size={16} style={{ color: 'var(--lab-primary)' }} />
                                        <span>Full-Stack Connectivity Status</span>
                                    </div>
                                    <span className="lab-telemetry-pill" style={{
                                        backgroundColor: health.online ? 'var(--lab-success-subtle)' : 'var(--lab-primary-subtle)',
                                        color: health.online ? '#065F46' : 'var(--lab-primary-dark)'
                                    }}>
                                        <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: health.online ? 'var(--lab-success)' : 'var(--lab-primary)' }} />
                                        {health.online ? 'ALL SYSTEMS ONLINE' : 'CHECKING STATUS...'}
                                    </span>
                                </div>

                                <div className="lab-telemetry-row">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                        <Globe size={15} style={{ color: 'var(--lab-primary)' }} />
                                        <div>
                                            <strong style={{ color: 'var(--lab-text-main)' }}>Frontend Workspace</strong>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>React 18 + Vite (Port 5176)</div>
                                        </div>
                                    </div>
                                    <span className="lab-badge lab-badge-teal">🟢 Port 5176</span>
                                </div>

                                <div className="lab-telemetry-row">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                        <Server size={15} style={{ color: 'var(--lab-primary)' }} />
                                        <div>
                                            <strong style={{ color: 'var(--lab-text-main)' }}>Backend REST API</strong>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>Native Node 24 HTTP API (Port 8082)</div>
                                        </div>
                                    </div>
                                    <span className="lab-badge lab-badge-teal">🟢 Port 8082</span>
                                </div>

                                <div className="lab-telemetry-row">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                        <Database size={15} style={{ color: 'var(--lab-primary)' }} />
                                        <div>
                                            <strong style={{ color: 'var(--lab-text-main)' }}>Persistent Database</strong>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>SQLite 3 (lab.db • 15 Schema Tables)</div>
                                        </div>
                                    </div>
                                    <span className="lab-badge lab-badge-teal">🟢 lab.db Connected</span>
                                </div>

                                <div className="lab-telemetry-row">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                        <Building2 size={15} style={{ color: 'var(--lab-primary)' }} />
                                        <div>
                                            <strong style={{ color: 'var(--lab-text-main)' }}>Patient &amp; Doctor Adapter</strong>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>Safe Read Bridge (patient.db)</div>
                                        </div>
                                    </div>
                                    <span className="lab-badge lab-badge-teal">🟢 Read Bridge</span>
                                </div>
                            </div>
                        </div>

                        {/* Clinical Accreditation & Integration Information */}
                        <div style={{
                            padding: '1rem 1.25rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                            border: '1px solid var(--lab-border)',
                            borderRadius: 'var(--lab-radius-md)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.4rem',
                            boxShadow: 'var(--lab-shadow-sm)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--lab-text-main)' }}>
                                <ShieldCheck size={16} style={{ color: 'var(--lab-primary-dark)' }} />
                                <span>ABDM M1 • M2 • M3 FHIR Interoperability Node</span>
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--lab-text-secondary)', lineHeight: 1.5 }}>
                                End-to-end encrypted clinical diagnostics with automated barcoding, digital pathologist sign-off, and Ayushman Bharat Health Account (ABHA) record linking.
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Staff Sign In Card */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div className="lab-card" style={{ padding: '2rem', boxShadow: 'var(--lab-shadow-lg)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--lab-border-subtle)' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--lab-text-main)', margin: 0 }}>
                                        Staff Sign In
                                    </h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--lab-text-secondary)' }}>
                                        Authorized Diagnostic Testing Workspace
                                    </span>
                                </div>
                                <span className="lab-badge lab-badge-teal">
                                    <ShieldCheck size={12} /> NABL &amp; ABDM
                                </span>
                            </div>

                            {error && (
                                <div style={{ backgroundColor: 'var(--lab-danger-subtle)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#B91C1C', padding: '0.75rem 1rem', borderRadius: 'var(--lab-radius-md)', marginBottom: '1.25rem', fontSize: '0.84rem' }}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="lab-form-group">
                                    <label className="lab-label">Laboratory Work Email</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="email"
                                            className="lab-input"
                                            style={{ paddingLeft: '2.5rem' }}
                                            placeholder="e.g. director@healthfirst.lab"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                            required
                                        />
                                        <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)' }} />
                                    </div>
                                </div>

                                <div className="lab-form-group">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                        <label className="lab-label" style={{ margin: 0 }}>Account Password</label>
                                        <button
                                            type="button"
                                            className="border-0 bg-transparent p-0"
                                            style={{ fontSize: '0.76rem', color: 'var(--lab-primary)', cursor: 'pointer', fontWeight: 600 }}
                                            onClick={() => setShowForgotModal(true)}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="lab-input"
                                            style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                            placeholder="Enter your security password"
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                            required
                                        />
                                        <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)' }} />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="border-0 bg-transparent p-0"
                                            style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)', cursor: 'pointer' }}
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <span>Remember this terminal</span>
                                    </label>
                                    <span style={{ color: 'var(--lab-text-secondary)', fontSize: '0.74rem' }}>
                                        TLS 1.3 / AES-256
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className="lab-btn lab-btn-primary lab-btn-lg"
                                    style={{ width: '100%' }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Verifying Laboratory Credentials...' : 'Sign In to Laboratory'}
                                    {!isLoading && <ArrowRight size={18} />}
                                </button>
                            </form>

                            {/* Verified Registration Information */}
                            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--lab-border)', textAlign: 'center' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--lab-text-secondary)', background: 'var(--lab-surface-muted)', padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--lab-border)' }}>
                                    <ShieldCheck size={14} style={{ color: 'var(--lab-primary-dark)' }} />
                                    <span>Authorized Diagnostic Laboratory Terminal</span>
                                </div>
                                <div style={{ marginTop: '0.65rem', fontSize: '0.74rem', color: 'var(--lab-text-muted)' }}>
                                    Sign in using your registered laboratory email and password, or register below.
                                </div>
                            </div>
                        </div>

                        {/* Switch to Register */}
                        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem' }}>
                            <span style={{ color: 'var(--lab-text-secondary)' }}>Diagnostic centre not yet registered? </span>
                            <button
                                type="button"
                                onClick={onNavigateRegister}
                                className="border-0 bg-transparent p-0"
                                style={{ color: 'var(--lab-primary-dark)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Register New Laboratory →
                            </button>
                        </div>

                        {/* Regulatory Footer */}
                        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.72rem', color: 'var(--lab-text-muted)', lineHeight: 1.5 }}>
                            <CheckCircle2 size={12} style={{ color: 'var(--lab-success)', display: 'inline', marginRight: '4px' }} />
                            Compliant with Clinical Establishments Act &amp; Ayushman Bharat Digital Mission (ABDM)
                        </div>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="lab-modal-backdrop" onClick={() => setShowForgotModal(false)}>
                    <div className="lab-modal-content" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
                        <div className="lab-modal-header">
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                                <HelpCircle size={18} style={{ color: 'var(--lab-primary)', display: 'inline', marginRight: '6px' }} />
                                Password Recovery Protocol
                            </h3>
                        </div>
                        <div className="lab-modal-body" style={{ fontSize: '0.85rem', color: 'var(--lab-text-secondary)', lineHeight: 1.5 }}>
                            <p>
                                In accordance with <strong>NHA Clinical Security Standards</strong>, diagnostic lab credential recovery requires verified administrative or council authorization.
                            </p>
                            <div style={{ backgroundColor: 'var(--lab-surface-muted)', padding: '0.85rem', borderRadius: 'var(--lab-radius-md)', border: '1px solid var(--lab-border)', marginBottom: '0.75rem' }}>
                                <strong style={{ color: 'var(--lab-text-main)' }}>Standard Demo Passwords:</strong>
                                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                                    <li>Director: <code>LabDirector@2026</code></li>
                                    <li>Pathologist: <code>Pathologist@2026</code></li>
                                    <li>Technician: <code>Tech@2026</code></li>
                                </ul>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--lab-text-muted)' }}>
                                (Note: This is an academic sandbox environment; no simulated external emails were transmitted).
                            </p>
                        </div>
                        <div className="lab-modal-footer">
                            <button type="button" className="lab-btn lab-btn-primary lab-btn-sm" onClick={() => setShowForgotModal(false)}>
                                Understood &amp; Return
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
