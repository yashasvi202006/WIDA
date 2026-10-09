import React, { useState } from 'react';
import { loginUser, registerUser, DEMO_DOCTORS } from '../database/pharmacyDB';

export const AuthPage = ({ onAuthSuccess }) => {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [formData, setFormData] = useState({
        email: 'aarav.sharma@wida.health',
        password: 'password123',
        fullName: '',
        confirmPassword: '',
        phone: '',
        role: 'Doctor / Clinical Specialist',
        pharmacyName: 'WIDA Health Medical Center',
        licenseNumber: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
        setSuccess('');
    };

    const handleLogin = (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        setTimeout(() => {
            const result = loginUser(formData.email, formData.password);
            setLoading(false);
            if (result.success && result.user) {
                setSuccess(`Welcome back, ${result.user.fullName}! Redirecting...`);
                setTimeout(() => onAuthSuccess(result.user), 600);
            } else {
                setError(result.message || 'Invalid professional credentials.');
            }
        }, 400);
    };

    const handleQuickLogin = (doc) => {
        setFormData(prev => ({
            ...prev,
            email: doc.email,
            password: 'password123'
        }));
        setLoading(true);
        setError('');
        setTimeout(() => {
            const result = loginUser(doc.email, 'password123');
            setLoading(false);
            if (result.success && result.user) {
                setSuccess(`Logged in as ${doc.fullName} (${doc.role})...`);
                setTimeout(() => onAuthSuccess(result.user), 500);
            } else {
                onAuthSuccess(doc);
            }
        }, 300);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }
        if (!formData.fullName.trim()) {
            setError('Please enter your full practitioner name.');
            setLoading(false);
            return;
        }

        setTimeout(() => {
            const result = registerUser({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: formData.role,
                pharmacyName: formData.pharmacyName,
                licenseNumber: formData.licenseNumber || 'WIDA-MED-2026',
            });
            setLoading(false);
            if (result.success && result.user) {
                setSuccess('Doctor account registered! Redirecting to workspace...');
                setTimeout(() => onAuthSuccess(result.user), 600);
            } else {
                setError(result.message);
            }
        }, 400);
    };

    return (
        <div style={styles.pageBackground}>
            <div style={styles.authCard}>
                {/* Top Badge */}
                <div style={styles.topBadgeWrapper}>
                    <span style={styles.topBadge}>
                        <span style={{ fontSize: '0.9rem' }}>🛡️</span> WIDA DOCTOR PORTAL
                    </span>
                </div>

                {/* Header Title */}
                <h1 style={styles.mainTitle}>
                    {mode === 'login' ? 'Doctor Sign In' : 'Register Doctor Account'}
                </h1>
                <p style={styles.subtitle}>
                    {mode === 'login'
                        ? 'Access your authorized clinical management workspace'
                        : 'Create your practitioner credentials to join WIDA Ecosystem'}
                </p>

                {/* Alerts */}
                {error && (
                    <div style={styles.alertError}>
                        <span>⚠️</span> {error}
                    </div>
                )}
                {success && (
                    <div style={styles.alertSuccess}>
                        <span>✅</span> {success}
                    </div>
                )}

                {/* Login Form */}
                {mode === 'login' ? (
                    <form onSubmit={handleLogin} style={styles.form}>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>
                                Professional Email Address <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="aarav.sharma@wida.health"
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>
                                Password <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••••••"
                                style={styles.input}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={loading ? { ...styles.submitBtn, opacity: 0.7 } : styles.submitBtn}
                        >
                            {loading ? 'Authenticating...' : 'Sign In to Workspace'}
                        </button>
                    </form>
                ) : (
                    /* Register Form */
                    <form onSubmit={handleRegister} style={styles.form}>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>
                                Full Doctor Name <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Dr. Yogita Chugh"
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>
                                Professional Email <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="yogita.chugh@wida.health"
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.row2}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Password *</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Confirm Password *</label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    style={styles.input}
                                />
                            </div>
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Specialist Role / Department</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                style={styles.select}
                            >
                                <option value="Chief Pharmacist & Medical Director">Chief Pharmacist & Medical Director</option>
                                <option value="Cardiologist">Cardiologist</option>
                                <option value="Orthopedist">Orthopedist</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="General Physician">General Physician</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={loading ? { ...styles.submitBtn, opacity: 0.7 } : styles.submitBtn}
                        >
                            {loading ? 'Creating Account...' : 'Register Practitioner Account'}
                        </button>
                    </form>
                )}

                {/* Quick Demo Login Box */}
                {mode === 'login' && (
                    <div style={styles.demoBox}>
                        <div style={styles.demoHeader}>
                            ⚡ QUICK DEMO LOGIN (SELECT SPECIALIST):
                        </div>
                        <div style={styles.demoGrid}>
                            {DEMO_DOCTORS.map(doc => (
                                <button
                                    key={doc.id}
                                    type="button"
                                    onClick={() => handleQuickLogin(doc)}
                                    style={styles.demoBtn}
                                    title={`Click to login as ${doc.fullName}`}
                                >
                                    {doc.fullName} ({doc.role.split(' ')[0]})
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Switcher */}
                <div style={styles.footerLink}>
                    {mode === 'login' ? (
                        <span>
                            New practitioner?{' '}
                            <span style={styles.linkAnchor} onClick={() => setMode('register')}>
                                Register Doctor Account →
                            </span>
                        </span>
                    ) : (
                        <span>
                            Already registered?{' '}
                            <span style={styles.linkAnchor} onClick={() => setMode('login')}>
                                Back to Doctor Sign In →
                            </span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageBackground: {
        minHeight: '100vh',
        backgroundColor: '#475569', // Muted slate gray outer frame matching photo
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 16px',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    },
    authCard: {
        width: '100%',
        maxWidth: '460px',
        backgroundColor: '#f1f5f9', // Clean light gray/off-white card background
        borderRadius: '24px',
        padding: '40px 36px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid rgba(255, 255, 255, 0.4)',
    },
    topBadgeWrapper: {
        marginBottom: '16px',
    },
    topBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 16px',
        borderRadius: '20px',
        backgroundColor: '#e0f2fe',
        color: '#0284c7',
        fontSize: '0.75rem',
        fontWeight: 800,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
    },
    mainTitle: {
        fontSize: '1.85rem',
        fontWeight: 900,
        color: '#0f172a',
        marginBottom: '6px',
        textAlign: 'center',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        fontSize: '0.88rem',
        color: '#64748b',
        textAlign: 'center',
        marginBottom: '28px',
        lineHeight: 1.4,
    },
    alertError: {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '10px',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#991b1b',
        fontSize: '0.82rem',
        fontWeight: 600,
        marginBottom: '18px',
    },
    alertSuccess: {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '10px',
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        color: '#166534',
        fontSize: '0.82rem',
        fontWeight: 600,
        marginBottom: '18px',
    },
    form: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '0.82rem',
        fontWeight: 700,
        color: '#334155',
    },
    input: {
        width: '100%',
        padding: '12px 14px',
        borderRadius: '10px',
        border: '1px solid #cbd5e1',
        backgroundColor: '#e2e8f0', // Clean light input background matching photo
        fontSize: '0.9rem',
        color: '#0f172a',
        outline: 'none',
        transition: 'border-color 0.2s ease',
        fontFamily: "'Inter', sans-serif",
    },
    select: {
        width: '100%',
        padding: '12px 14px',
        borderRadius: '10px',
        border: '1px solid #cbd5e1',
        backgroundColor: '#e2e8f0',
        fontSize: '0.9rem',
        color: '#0f172a',
        outline: 'none',
        cursor: 'pointer',
    },
    row2: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
    },
    submitBtn: {
        width: '100%',
        padding: '14px 0',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: '#0284c7', // Exact cyan-blue filled button matching photo
        color: '#ffffff',
        fontSize: '0.98rem',
        fontWeight: 800,
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
        marginTop: '6px',
        transition: 'all 0.2s ease',
    },
    demoBox: {
        width: '100%',
        marginTop: '28px',
        padding: '16px',
        borderRadius: '14px',
        backgroundColor: '#e2e8f0',
        border: '1px solid #cbd5e1',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    demoHeader: {
        fontSize: '0.72rem',
        fontWeight: 800,
        color: '#475569',
        letterSpacing: '0.5px',
        textAlign: 'center',
    },
    demoGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    demoBtn: {
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        backgroundColor: '#ffffff',
        color: '#1e293b',
        fontSize: '0.8rem',
        fontWeight: 600,
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.15s ease',
    },
    footerLink: {
        marginTop: '24px',
        fontSize: '0.84rem',
        color: '#64748b',
        textAlign: 'center',
    },
    linkAnchor: {
        color: '#0284c7',
        fontWeight: 700,
        cursor: 'pointer',
        textDecoration: 'none',
    }
};
