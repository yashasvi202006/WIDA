import React, { useState } from 'react';
import { labApiClient } from '../services/labApiClient.js';
import {
    Activity,
    ShieldCheck,
    Building2,
    User,
    Mail,
    Phone,
    Lock,
    MapPin,
    Award,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Clock,
    Sparkles
} from 'lucide-react';

export const LabRegister = ({ onNavigateLogin, onRegistrationSuccess }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        labName: '',
        representativeName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: '',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201309',
        licenseNumber: '',
        accreditation: 'NABL ISO 15189:2022 Accredited',
        services: ['Clinical Biochemistry', 'Hematology & Coagulation', 'Clinical Pathology'],
        termsAccepted: false
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [registeredResult, setRegisteredResult] = useState(null);

    const availableServices = [
        'Clinical Biochemistry',
        'Hematology & Coagulation',
        'Clinical Pathology',
        'Microbiology & Serology',
        'Endocrinology & Immunology',
        'Molecular Diagnostics & PCR',
        'Histopathology & Cytology'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleServiceToggle = (service) => {
        setFormData(prev => {
            const current = [...prev.services];
            const idx = current.indexOf(service);
            if (idx > -1) {
                current.splice(idx, 1);
            } else {
                current.push(service);
            }
            return { ...prev, services: current };
        });
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        if (!formData.labName.trim()) {
            setError('Please provide the Diagnostic Centre or Laboratory Name');
            return;
        }
        if (!formData.representativeName.trim()) {
            setError('Authorized Representative name is required');
            return;
        }
        if (!formData.email.trim()) {
            setError('Official laboratory work email is required');
            return;
        }
        if (!formData.phone.trim()) {
            setError('Contact phone number is required');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password.length < 8) {
            setError('Password must contain at least 8 characters');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Password and confirmation do not match');
            return;
        }
        if (!formData.termsAccepted) {
            setError('You must accept the ABDM Diagnostic Interoperability guidelines');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await labApiClient.register({
                labName: formData.labName,
                representativeName: formData.representativeName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                address: formData.address || 'Medical Enclave, Healthcare District',
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                licenseNumber: formData.licenseNumber || `NABL-APPL-${Date.now().toString().slice(-4)}`,
                accreditation: formData.accreditation,
                diagnosticServices: formData.services
            });

            setRegisteredResult(res);
        } catch (err) {
            setError(err.message || 'Registration failed. An account with this email may already exist.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSimulateApprove = async () => {
        if (!registeredResult?.labId) return;
        setIsLoading(true);
        try {
            await labApiClient.verifyAccountSimulation(registeredResult.labId);
            alert('Laboratory account status updated to VERIFIED! You can now log in.');
            onNavigateLogin();
        } catch (err) {
            alert('Verification simulation failed: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (registeredResult) {
        return (
            <div className="lab-auth-page">
                <div className="lab-card" style={{ maxWidth: 520, width: '100%', padding: '2.5rem', textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--lab-warning-subtle)', color: 'var(--lab-warning)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                        <Clock size={36} />
                    </div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--lab-text-main)', marginBottom: '0.5rem' }}>
                        Registration Submitted
                    </h2>
                    <span className="lab-badge lab-badge-warning" style={{ marginBottom: '1rem' }}>
                        Status: PENDING_VERIFICATION
                    </span>
                    <p style={{ fontSize: '0.88rem', color: 'var(--lab-text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                        Thank you for registering <strong>{formData.labName}</strong>. As mandated by NHA and ABDM regulatory guidelines, new laboratory registrations require verification of clinical accreditation documents before clinical results can be published.
                    </p>

                    <div style={{ backgroundColor: 'var(--lab-surface-muted)', borderRadius: 'var(--lab-radius-md)', padding: '1rem', border: '1px solid var(--lab-border)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.82rem' }}>
                        <div style={{ marginBottom: '0.4rem' }}>
                            <span style={{ color: 'var(--lab-text-secondary)' }}>Assigned Lab ID: </span>
                            <strong>{registeredResult.labId}</strong>
                        </div>
                        <div>
                            <span style={{ color: 'var(--lab-text-secondary)' }}>Registered Email: </span>
                            <strong>{formData.email}</strong>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button
                            type="button"
                            className="lab-btn lab-btn-primary"
                            onClick={handleSimulateApprove}
                            disabled={isLoading}
                        >
                            <Sparkles size={16} /> 1-Click Simulation: Approve NABL License & Verify
                        </button>
                        <button
                            type="button"
                            className="lab-btn lab-btn-outline"
                            onClick={onNavigateLogin}
                        >
                            Return to Login Page
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="lab-auth-page">
            <div style={{ maxWidth: 640, width: '100%' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 50, height: 50, borderRadius: '14px', background: 'linear-gradient(135deg, var(--lab-primary) 0%, var(--lab-primary-dark) 100%)', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                        <Activity size={26} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--lab-text-main)', margin: 0 }}>
                        WIDA Diagnostic Network
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--lab-text-secondary)' }}>
                        Accredited Pathology & Diagnostic Laboratory Registration
                    </p>
                </div>

                {/* Form Card */}
                <div className="lab-card" style={{ padding: '2rem', boxShadow: 'var(--lab-shadow-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--lab-border-subtle)' }}>
                        <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                                Laboratory Onboarding
                            </h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--lab-text-secondary)' }}>
                                {step === 1 ? 'Step 1: Facility Profile & Administration' : 'Step 2: Services, Accreditations & Security'}
                            </span>
                        </div>
                        <span className="lab-badge lab-badge-teal">
                            <ShieldCheck size={12} /> ABDM Interoperable
                        </span>
                    </div>

                    {error && (
                        <div style={{ backgroundColor: 'var(--lab-danger-subtle)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#B91C1C', padding: '0.75rem 1rem', borderRadius: 'var(--lab-radius-md)', marginBottom: '1.25rem', fontSize: '0.84rem' }}>
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleNextStep}>
                            <div className="lab-form-group">
                                <label className="lab-label">Diagnostic Centre / Laboratory Name *</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        name="labName"
                                        className="lab-input"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="e.g. Apex BioCare Pathology & Imaging"
                                        value={formData.labName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Building2 size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)' }} />
                                </div>
                            </div>

                            <div className="lab-form-group">
                                <label className="lab-label">Authorized Signatory / Representative Name *</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        name="representativeName"
                                        className="lab-input"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="e.g. Dr. Ramesh Gupta, MD (Pathology)"
                                        value={formData.representativeName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="lab-form-group">
                                    <label className="lab-label">Work Email Address *</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="email"
                                            name="email"
                                            className="lab-input"
                                            style={{ paddingLeft: '2.5rem' }}
                                            placeholder="admin@apexbio.lab"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)' }} />
                                    </div>
                                </div>

                                <div className="lab-form-group">
                                    <label className="lab-label">Contact Phone Number *</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            name="phone"
                                            className="lab-input"
                                            style={{ paddingLeft: '2.5rem' }}
                                            placeholder="+91 98111 22334"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Phone size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)' }} />
                                    </div>
                                </div>
                            </div>

                            <div className="lab-form-group">
                                <label className="lab-label">Facility Street Address</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        name="address"
                                        className="lab-input"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="Plot 45, Sector 18, Commercial Block"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                    <MapPin size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                <div className="lab-form-group">
                                    <label className="lab-label">City</label>
                                    <input type="text" name="city" className="lab-input" value={formData.city} onChange={handleChange} />
                                </div>
                                <div className="lab-form-group">
                                    <label className="lab-label">State</label>
                                    <input type="text" name="state" className="lab-input" value={formData.state} onChange={handleChange} />
                                </div>
                                <div className="lab-form-group">
                                    <label className="lab-label">Pincode</label>
                                    <input type="text" name="pincode" className="lab-input" value={formData.pincode} onChange={handleChange} />
                                </div>
                            </div>

                            <button type="submit" className="lab-btn lab-btn-primary lab-btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
                                Continue to Step 2 <ArrowRight size={18} />
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit}>
                            <div className="lab-form-group">
                                <label className="lab-label">NABL / Clinical Establishment Registration No.</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        className="lab-input"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="e.g. NABL-MC-2026-9921 or State License"
                                        value={formData.licenseNumber}
                                        onChange={handleChange}
                                    />
                                    <Award size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)' }} />
                                </div>
                                <div className="lab-hint">Mandatory for automated ABDM diagnostic health record verification</div>
                            </div>

                            <div className="lab-form-group">
                                <label className="lab-label">Diagnostic Services Offered</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', maxHeight: '140px', overflowY: 'auto', padding: '0.5rem', border: '1px solid var(--lab-border)', borderRadius: 'var(--lab-radius-md)' }}>
                                    {availableServices.map(srv => (
                                        <label key={srv} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.services.includes(srv)}
                                                onChange={() => handleServiceToggle(srv)}
                                            />
                                            <span>{srv}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="lab-form-group">
                                    <label className="lab-label">Account Password (Min 8 Chars) *</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="password"
                                            name="password"
                                            className="lab-input"
                                            style={{ paddingLeft: '2.5rem' }}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)' }} />
                                    </div>
                                </div>

                                <div className="lab-form-group">
                                    <label className="lab-label">Confirm Password *</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className="lab-input"
                                            style={{ paddingLeft: '2.5rem' }}
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)' }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ backgroundColor: 'var(--lab-surface-muted)', padding: '0.85rem', borderRadius: 'var(--lab-radius-md)', border: '1px solid var(--lab-border)', marginBottom: '1.25rem', fontSize: '0.8rem' }}>
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', margin: 0 }}>
                                    <input
                                        type="checkbox"
                                        name="termsAccepted"
                                        checked={formData.termsAccepted}
                                        onChange={handleChange}
                                        style={{ marginTop: '3px' }}
                                    />
                                    <span style={{ color: 'var(--lab-text-secondary)', lineHeight: 1.4 }}>
                                        I hereby certify that all diagnostic testing shall comply with <strong>ABDM (Ayushman Bharat Digital Mission)</strong> clinical security standards, quality control calibrator norms, and NHA health data guidelines.
                                    </span>
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="button" className="lab-btn lab-btn-outline" onClick={() => setStep(1)}>
                                    <ArrowLeft size={16} /> Back
                                </button>
                                <button type="submit" className="lab-btn lab-btn-primary lab-btn-lg" style={{ flex: 1 }} disabled={isLoading}>
                                    {isLoading ? 'Registering Facility...' : 'Submit Diagnostic Registration'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Back to Login */}
                <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--lab-text-secondary)' }}>Already have a verified laboratory terminal? </span>
                    <button
                        type="button"
                        onClick={onNavigateLogin}
                        className="border-0 bg-transparent p-0"
                        style={{ color: 'var(--lab-primary-dark)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Sign In Here →
                    </button>
                </div>
            </div>
        </div>
    );
};
