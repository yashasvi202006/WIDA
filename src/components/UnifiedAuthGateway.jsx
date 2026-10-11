import React, { useState } from 'react';
import {
    Activity,
    ShieldCheck,
    User,
    Stethoscope,
    Microscope,
    Pill,
    Lock,
    Mail,
    Phone,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    Building2,
    Eye,
    EyeOff,
    FileText,
    Server,
    Database,
    Globe,
    Cpu,
    Calendar,
    Award
} from 'lucide-react';
import { widaBridge } from '../services/widaEcosystemBridge';
import { labApiClient } from '../../lab/frontend/services/labApiClient.js';

export const UnifiedAuthGateway = ({ onLoginSuccess }) => {
    const [selectedRole, setSelectedRole] = useState('patient'); // 'patient' | 'doctor' | 'lab' | 'pharmacy'
    const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Login Form State
    const [loginIdentifier, setLoginIdentifier] = useState('yashasvi.saini@wida.health');
    const [loginPassword, setLoginPassword] = useState('wida2026');

    // Registration Form State (Universal across roles)
    const [regData, setRegData] = useState({
        // Common
        fullName: '',
        email: '',
        phone: '',
        password: '',
        city: 'Noida',
        // Patient Specific
        age: '24',
        gender: 'Male',
        bloodGroup: 'B+',
        // Doctor Specific
        medicalRegNumber: 'MCI-2026-98124',
        specialization: 'Cardiologist',
        experience: '8',
        consultationFee: '800',
        hospitalName: 'WIDA Apex Medical Center',
        // Lab Specific
        labName: 'Metro Diagnostic & Pathology Lab',
        directorName: '',
        labLicense: 'NABL-DL-2026-44',
        accreditation: 'NABL ISO 15189:2022',
        // Pharmacy Specific
        pharmacyName: 'City Central Chemist & Care',
        pharmacistName: '',
        drugLicense: 'DL-PH-2026-7789'
    });

    // Handle Role Switching
    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setError('');
        setSuccessMsg('');

        // Preload standard demo credentials for the role
        if (role === 'patient') {
            setLoginIdentifier('yashasvi.saini@wida.health');
            setLoginPassword('wida2026');
        } else if (role === 'doctor') {
            setLoginIdentifier('aarav.sharma@wida.org');
            setLoginPassword('Doctor@123');
        } else if (role === 'lab') {
            setLoginIdentifier('director@healthfirst.lab');
            setLoginPassword('LabDirector@2026');
        } else if (role === 'pharmacy') {
            setLoginIdentifier('yogita.chugh@wida.health');
            setLoginPassword('password123');
        }
    };

    // Helper to seed domain-specific session storage so each module recognizes the user
    const setupModuleSession = (role, userObj) => {
        if (role === 'patient') {
            const patientProfile = {
                id: 'pat-' + Date.now(),
                name: userObj.name || 'Yashasvi Saini',
                email: userObj.email || 'yashasvi.saini@wida.health',
                phone: userObj.phone || '+91 98765 43210',
                abhaId: userObj.abhaId || '91-4521-8902-3341',
                bloodGroup: userObj.bloodGroup || 'B+',
                age: Number(userObj.age) || 24,
                gender: userObj.gender || 'Male',
                address: userObj.city || 'Sector 62, Noida, Uttar Pradesh'
            };
            try {
                const existing = JSON.parse(localStorage.getItem('wida_patient_profile') || '{}');
                localStorage.setItem('wida_patient_profile', JSON.stringify({ ...existing, ...patientProfile }));
            } catch {}
        } else if (role === 'doctor') {
            const docId = userObj.doctorId || userObj.id || 1;
            localStorage.setItem('wida_doc_active_doctor_id', JSON.stringify(docId));
        } else if (role === 'lab') {
            labApiClient.login('director@healthfirst.lab', 'LabDirector@2026').catch(() => {});
            const token = 'wida-lab-jwt-' + Date.now();
            const labUser = {
                id: userObj.id || 1,
                email: userObj.email || 'director@healthfirst.lab',
                fullName: userObj.name || 'Dr. Sunita Deshmukh, MD',
                role: 'LAB_DIRECTOR',
                labId: 1
            };
            const labInfo = {
                id: 1,
                name: userObj.labName || 'HealthFirst Diagnostics & Pathology Labs',
                code: 'LAB-DEL-001',
                accreditation: userObj.accreditation || 'NABL ISO 15189:2022'
            };
            localStorage.setItem('wida_lab_token', token);
            localStorage.setItem('lab_token', token);
            localStorage.setItem('wida_lab_user', JSON.stringify(labUser));
            localStorage.setItem('lab_user', JSON.stringify(labUser));
            localStorage.setItem('wida_lab_info', JSON.stringify(labInfo));
            localStorage.setItem('lab_info', JSON.stringify(labInfo));
        } else if (role === 'pharmacy') {
            const pharmUser = {
                id: 'PH-' + (userObj.id || Date.now()),
                fullName: userObj.name || 'Dr. Yogita Chugh',
                email: userObj.email || 'yogita.chugh@wida.health',
                role: 'Chief Pharmacist & Medical Director',
                pharmacyName: userObj.pharmacyName || 'WIDA Ecosystem Central Hospital & Pharmacy',
                licenseNumber: userObj.drugLicense || 'WIDA-PH-8092',
                lastLogin: new Date().toISOString()
            };
            localStorage.setItem('wida_pharmacy_current_user', JSON.stringify(pharmUser));
        }
    };

    // Quick 1-Click Demo Login Handlers
    const handleQuickLogin = (role, email, pass, name) => {
        setSelectedRole(role);
        setLoginIdentifier(email);
        setLoginPassword(pass);
        setIsLoading(true);
        setError('');

        setTimeout(() => {
            setIsLoading(false);
            const userObj = {
                name,
                email,
                role
            };
            setupModuleSession(role, userObj);
            widaBridge.setCurrentUser(userObj, role);
            onLoginSuccess(role, userObj);
        }, 300);
    };

    // Form Submission: Login
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!loginIdentifier.trim()) {
            setError('Please enter your work identifier or email.');
            return;
        }
        if (!loginPassword) {
            setError('Please enter your account password.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            let userObj = {
                name: loginIdentifier.split('@')[0],
                email: loginIdentifier,
                role: selectedRole
            };

            if (selectedRole === 'patient') {
                userObj.name = 'Yashasvi Saini';
                userObj.abhaId = '91-4521-8902-3341';
            } else if (selectedRole === 'doctor') {
                userObj.name = 'Dr. Aarav Sharma';
                userObj.specialization = 'Cardiologist';
            } else if (selectedRole === 'lab') {
                userObj.name = 'Dr. Sunita Deshmukh, MD';
                userObj.labName = 'HealthFirst Diagnostics';
            } else if (selectedRole === 'pharmacy') {
                userObj.name = 'Dr. Yogita Chugh';
                userObj.pharmacyName = 'Central Pharmacy';
            }

            setupModuleSession(selectedRole, userObj);
            widaBridge.setCurrentUser(userObj, selectedRole);
            onLoginSuccess(selectedRole, userObj);
        }, 350);
    };

    // Form Submission: Register
    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!regData.fullName && !regData.labName && !regData.pharmacyName) {
            setError('Please fill in your name or facility title.');
            return;
        }
        if (!regData.email.trim()) {
            setError('Please provide a valid work email.');
            return;
        }
        if (!regData.password || regData.password.length < 4) {
            setError('Password must contain at least 4 characters.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            const userObj = {
                name: regData.fullName || regData.directorName || regData.pharmacistName || 'Registered User',
                email: regData.email,
                role: selectedRole,
                ...regData
            };

            // If registering doctor, add to shared doctors list
            if (selectedRole === 'doctor') {
                const currentDocs = widaBridge.getDoctors();
                currentDocs.unshift({
                    id: 'doc-' + Date.now(),
                    name: regData.fullName,
                    fullName: regData.fullName,
                    email: regData.email,
                    specialization: regData.specialization,
                    hospital: regData.hospitalName,
                    consultationFee: Number(regData.consultationFee) || 750,
                    experience: Number(regData.experience) || 5,
                    rating: 5.0,
                    patientsCount: 0,
                    availableSlots: ['10:00 AM', '02:00 PM', '04:30 PM'],
                    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
                });
                localStorage.setItem('wida_shared_doctors', JSON.stringify(currentDocs));
            }

            setupModuleSession(selectedRole, userObj);
            widaBridge.setCurrentUser(userObj, selectedRole);
            setSuccessMsg(`Account successfully registered! Logging into ${selectedRole.toUpperCase()} workspace...`);
            setTimeout(() => {
                onLoginSuccess(selectedRole, userObj);
            }, 600);
        }, 400);
    };

    const rolesConfig = [
        {
            id: 'patient',
            name: 'Patient Portal',
            badge: 'WIDA.health',
            icon: User,
            color: '#0284C7',
            bgColor: '#F0F9FF',
            borderColor: '#BAE6FD',
            desc: 'ABHA Records, Digital Vault, Appointments & Medicine Delivery'
        },
        {
            id: 'doctor',
            name: 'Doctor Portal',
            badge: 'WIDA.doc',
            icon: Stethoscope,
            color: '#007C77',
            bgColor: '#F0FDFA',
            borderColor: '#99F6E4',
            desc: 'Clinical Practice, Teleconsultations, EHR & Electronic Prescriptions'
        },
        {
            id: 'lab',
            name: 'Diagnostic Laboratory',
            badge: 'WIDA.lab',
            icon: Microscope,
            color: '#0D9488',
            bgColor: '#E8F7F6',
            borderColor: '#5EEAD4',
            desc: 'NABL Specimen Accessioning, Pathologist Review & ABDM Reports'
        },
        {
            id: 'pharmacy',
            name: 'Pharmacy Portal',
            badge: 'WIDA.pharmacy',
            icon: Pill,
            color: '#0F766E',
            bgColor: '#F0FDF4',
            borderColor: '#A7F3D0',
            desc: 'Medication Inventory, Prescription Dispensing & Invoicing'
        }
    ];

    const currentRoleCfg = rolesConfig.find(r => r.id === selectedRole);

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#E8F7F6',
            backgroundImage: 'radial-gradient(at 0% 0%, rgba(13, 148, 136, 0.14) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(2, 132, 199, 0.1) 0px, transparent 50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1.25rem',
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        }}>
            <div style={{ width: '100%', maxWidth: 1080 }}>
                {/* Global Brand Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0.9rem', borderRadius: '9999px', backgroundColor: '#CCFBF1', color: '#0F766E', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                        <Activity size={14} /> WIDA INTEGRATED DIGITAL HEALTHCARE ECOSYSTEM • ABDM COMPLIANT
                    </div>
                    <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#172033', letterSpacing: '-0.03em', margin: 0 }}>
                        WIDA<span style={{ color: '#0D9488' }}>.ecosystem</span> Unified Gateway
                    </h1>
                    <p style={{ fontSize: '0.95rem', color: '#64748B', maxWidth: 640, margin: '0.5rem auto 0 auto' }}>
                        One centralized access portal connecting Patients, Doctors, Diagnostic Laboratories, and Pharmacies into a single live interoperable network.
                    </p>
                </div>

                {/* Role Switcher Selector Tabs (Big 4 Roles) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
                    {rolesConfig.map((r) => {
                        const Icon = r.icon;
                        const isSelected = selectedRole === r.id;
                        return (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => handleRoleSelect(r.id)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    padding: '1.1rem 0.75rem',
                                    borderRadius: '16px',
                                    border: isSelected ? `2.5px solid ${r.color}` : '1.5px solid #CBD5E1',
                                    backgroundColor: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                                    boxShadow: isSelected ? '0 10px 25px -3px rgba(13, 148, 136, 0.15)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    transform: isSelected ? 'translateY(-2px)' : 'none'
                                }}
                            >
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: '12px',
                                    backgroundColor: isSelected ? r.color : r.bgColor,
                                    color: isSelected ? '#FFFFFF' : r.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '0.5rem',
                                    transition: 'all 0.2s'
                                }}>
                                    <Icon size={22} />
                                </div>
                                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: isSelected ? '#172033' : '#475569' }}>
                                    {r.name}
                                </div>
                                <span style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    marginTop: '0.25rem',
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '9999px',
                                    backgroundColor: r.bgColor,
                                    color: r.color
                                }}>
                                    {r.badge}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Card Shell: Left Column (Ecosystem Overview & Telemetry) + Right Column (Auth Form) */}
                <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px -10px rgba(15, 118, 110, 0.12)',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: '1.05fr 1.25fr'
                }}>
                    {/* Left Panel: Domain Information & 1-Click Fast Presets */}
                    <div style={{
                        padding: '2.5rem',
                        backgroundColor: '#F8FAFC',
                        borderRight: '1px solid #E2E8F0',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: currentRoleCfg.color, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                <ShieldCheck size={16} /> SELECTED WORKSPACE
                            </div>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#172033', margin: 0 }}>
                                {currentRoleCfg.name}
                            </h2>
                            <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '0.35rem', lineHeight: 1.5 }}>
                                {currentRoleCfg.desc}
                            </p>

                            {/* Live Backend & Database Telemetry */}
                            <div style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '14px',
                                padding: '1rem',
                                marginTop: '1.25rem',
                                fontSize: '0.8rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', fontWeight: 700, color: '#172033' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Cpu size={14} style={{ color: '#0D9488' }} /> Interconnected Architecture
                                    </span>
                                    <span style={{ color: '#059669', fontSize: '0.72rem', backgroundColor: '#ECFDF5', padding: '0.15rem 0.45rem', borderRadius: '9999px' }}>
                                        ● ONLINE & SYNCED
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid #F1F5F9' }}>
                                    <span style={{ color: '#64748B' }}>Patient Backend (Java):</span>
                                    <strong style={{ color: '#172033' }}>Port 8080 (patient.db)</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid #F1F5F9' }}>
                                    <span style={{ color: '#64748B' }}>Doctor Backend (Spring Boot):</span>
                                    <strong style={{ color: '#172033' }}>Port 8081 (meditrack_db)</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid #F1F5F9' }}>
                                    <span style={{ color: '#64748B' }}>Lab Backend (Node 24 REST):</span>
                                    <strong style={{ color: '#172033' }}>Port 8082 (lab.db • 15 tables)</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                                    <span style={{ color: '#64748B' }}>Pharmacy Engine:</span>
                                    <strong style={{ color: '#172033' }}>Live Medicine Catalogue</strong>
                                </div>
                            </div>

                            {/* 1-Click Fast Evaluation Logins */}
                            <div style={{ marginTop: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '0.6rem' }}>
                                    <Sparkles size={14} style={{ color: '#0D9488' }} />
                                    <span>INSTANT 1-CLICK DEMO ACCESS:</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.45rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickLogin('patient', 'yashasvi.saini@wida.health', 'wida2026', 'Yashasvi Saini')}
                                        style={{ padding: '0.55rem', border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: '#FFFFFF', fontSize: '0.75rem', fontWeight: 600, color: '#1E293B', cursor: 'pointer', textAlign: 'left' }}
                                    >
                                        👤 Yashasvi (Patient)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickLogin('doctor', 'aarav.sharma@wida.org', 'Doctor@123', 'Dr. Aarav Sharma')}
                                        style={{ padding: '0.55rem', border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: '#FFFFFF', fontSize: '0.75rem', fontWeight: 600, color: '#1E293B', cursor: 'pointer', textAlign: 'left' }}
                                    >
                                        🩺 Dr. Aarav (Cardio)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickLogin('lab', 'director@healthfirst.lab', 'LabDirector@2026', 'Dr. Sunita Deshmukh')}
                                        style={{ padding: '0.55rem', border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: '#FFFFFF', fontSize: '0.75rem', fontWeight: 600, color: '#1E293B', cursor: 'pointer', textAlign: 'left' }}
                                    >
                                        🔬 Lab Director (Sunita)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickLogin('pharmacy', 'yogita.chugh@wida.health', 'password123', 'Dr. Yogita Chugh')}
                                        style={{ padding: '0.55rem', border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: '#FFFFFF', fontSize: '0.75rem', fontWeight: 600, color: '#1E293B', cursor: 'pointer', textAlign: 'left' }}
                                    >
                                        💊 Pharmacist (Yogita)
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.25rem', fontSize: '0.74rem', color: '#94A3B8', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
                            <CheckCircle2 size={13} style={{ color: '#10B981', display: 'inline', marginRight: '4px' }} />
                            Ayushman Bharat Digital Mission (ABDM) &amp; NABL ISO 15189 Certified
                        </div>
                    </div>

                    {/* Right Panel: Authentication Form with Sign In / Register Tabs */}
                    <div style={{ padding: '2.5rem' }}>
                        {/* Tab Switcher: Sign In vs Register */}
                        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
                            <button
                                type="button"
                                onClick={() => { setAuthMode('login'); setError(''); }}
                                style={{
                                    flex: 1,
                                    padding: '0.65rem',
                                    border: 'none',
                                    borderBottom: authMode === 'login' ? `3px solid ${currentRoleCfg.color}` : '3px solid transparent',
                                    backgroundColor: 'transparent',
                                    fontSize: '0.95rem',
                                    fontWeight: authMode === 'login' ? 800 : 600,
                                    color: authMode === 'login' ? currentRoleCfg.color : '#64748B',
                                    cursor: 'pointer'
                                }}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => { setAuthMode('register'); setError(''); }}
                                style={{
                                    flex: 1,
                                    padding: '0.65rem',
                                    border: 'none',
                                    borderBottom: authMode === 'register' ? `3px solid ${currentRoleCfg.color}` : '3px solid transparent',
                                    backgroundColor: 'transparent',
                                    fontSize: '0.95rem',
                                    fontWeight: authMode === 'register' ? 800 : 600,
                                    color: authMode === 'register' ? currentRoleCfg.color : '#64748B',
                                    cursor: 'pointer'
                                }}
                            >
                                Register New {selectedRole.toUpperCase()}
                            </button>
                        </div>

                        {error && (
                            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '0.75rem', borderRadius: '10px', fontSize: '0.84rem', marginBottom: '1.25rem' }}>
                                ⚠️ {error}
                            </div>
                        )}

                        {successMsg && (
                            <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #6EE7B7', color: '#047857', padding: '0.75rem', borderRadius: '10px', fontSize: '0.84rem', marginBottom: '1.25rem' }}>
                                ✓ {successMsg}
                            </div>
                        )}

                        {/* MODE 1: SIGN IN FORM */}
                        {authMode === 'login' ? (
                            <form onSubmit={handleLoginSubmit}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        {selectedRole === 'patient' && 'ABHA Number, Registered Email or Phone'}
                                        {selectedRole === 'doctor' && 'Medical Council Work Email or MCI ID'}
                                        {selectedRole === 'lab' && 'Diagnostic Facility Work Email'}
                                        {selectedRole === 'pharmacy' && 'Registered Pharmacist Email'}
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            value={loginIdentifier}
                                            onChange={(e) => setLoginIdentifier(e.target.value)}
                                            placeholder="Enter your credential identifier"
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                                                borderRadius: '10px',
                                                border: '1.5px solid #CBD5E1',
                                                fontSize: '0.9rem',
                                                color: '#172033',
                                                outline: 'none',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Account Password
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            placeholder="Enter security password"
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.65rem 2.4rem 0.65rem 2.4rem',
                                                borderRadius: '10px',
                                                border: '1.5px solid #CBD5E1',
                                                fontSize: '0.9rem',
                                                color: '#172033',
                                                outline: 'none',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0 }}
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{
                                        width: '100%',
                                        padding: '0.85rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        backgroundColor: currentRoleCfg.color,
                                        color: '#FFFFFF',
                                        fontSize: '0.95rem',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        boxShadow: `0 6px 18px -2px ${currentRoleCfg.color}66`
                                    }}
                                >
                                    {isLoading ? 'Verifying Workspace Credentials...' : `Sign In to ${currentRoleCfg.name}`}
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                        ) : (
                            /* MODE 2: UNIVERSAL REGISTRATION FORM */
                            <form onSubmit={handleRegisterSubmit}>
                                <div style={{ maxHeight: '380px', overflowY: 'auto', paddingRight: '0.4rem' }}>
                                    {/* Patient Registration Fields */}
                                    {selectedRole === 'patient' && (
                                        <>
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.2rem' }}>Full Legal Name</label>
                                                <input
                                                    type="text"
                                                    value={regData.fullName}
                                                    onChange={e => setRegData({ ...regData, fullName: e.target.value })}
                                                    placeholder="e.g. Yashasvi Saini"
                                                    required
                                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                                                />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>Age</label>
                                                    <input type="number" value={regData.age} onChange={e => setRegData({ ...regData, age: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }} />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>Gender</label>
                                                    <select value={regData.gender} onChange={e => setRegData({ ...regData, gender: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }}>
                                                        <option>Male</option>
                                                        <option>Female</option>
                                                        <option>Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>Blood Group</label>
                                                    <select value={regData.bloodGroup} onChange={e => setRegData({ ...regData, bloodGroup: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }}>
                                                        <option>B+</option><option>O+</option><option>A+</option><option>AB+</option><option>B-</option><option>O-</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Doctor Registration Fields */}
                                    {selectedRole === 'doctor' && (
                                        <>
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.2rem' }}>Doctor Full Name &amp; Title</label>
                                                <input
                                                    type="text"
                                                    value={regData.fullName}
                                                    onChange={e => setRegData({ ...regData, fullName: e.target.value })}
                                                    placeholder="e.g. Dr. Rajesh Kumar, MD"
                                                    required
                                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                                                />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>Specialization</label>
                                                    <select value={regData.specialization} onChange={e => setRegData({ ...regData, specialization: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }}>
                                                        <option>Cardiologist</option>
                                                        <option>General Physician</option>
                                                        <option>Orthopedist</option>
                                                        <option>Neurologist</option>
                                                        <option>Dermatologist</option>
                                                        <option>Pediatrician</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>Consultation Fee (₹)</label>
                                                    <input type="number" value={regData.consultationFee} onChange={e => setRegData({ ...regData, consultationFee: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }} />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Lab Registration Fields */}
                                    {selectedRole === 'lab' && (
                                        <>
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.2rem' }}>Diagnostic Center Name</label>
                                                <input
                                                    type="text"
                                                    value={regData.labName}
                                                    onChange={e => setRegData({ ...regData, labName: e.target.value })}
                                                    placeholder="e.g. LifeCare Pathology & Imaging"
                                                    required
                                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                                                />
                                            </div>
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.2rem' }}>Medical Director Name</label>
                                                <input
                                                    type="text"
                                                    value={regData.directorName}
                                                    onChange={e => setRegData({ ...regData, directorName: e.target.value })}
                                                    placeholder="e.g. Dr. Ramesh Gupta, MD (Path)"
                                                    required
                                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* Pharmacy Registration Fields */}
                                    {selectedRole === 'pharmacy' && (
                                        <>
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.2rem' }}>Pharmacy / Retail Facility Name</label>
                                                <input
                                                    type="text"
                                                    value={regData.pharmacyName}
                                                    onChange={e => setRegData({ ...regData, pharmacyName: e.target.value })}
                                                    placeholder="e.g. Apollo Pharmacy & Surgical"
                                                    required
                                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                                                />
                                            </div>
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.2rem' }}>Chief Pharmacist In-Charge</label>
                                                <input
                                                    type="text"
                                                    value={regData.pharmacistName}
                                                    onChange={e => setRegData({ ...regData, pharmacistName: e.target.value })}
                                                    placeholder="e.g. Sneha Patel, B.Pharm"
                                                    required
                                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* Common Contact Fields */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>Email Address</label>
                                            <input type="email" value={regData.email} onChange={e => setRegData({ ...regData, email: e.target.value })} placeholder="work@wida.health" required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>Phone</label>
                                            <input type="text" value={regData.phone} onChange={e => setRegData({ ...regData, phone: e.target.value })} placeholder="+91 98765 43210" required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }} />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.2rem' }}>Create Password</label>
                                        <input
                                            type="password"
                                            value={regData.password}
                                            onChange={e => setRegData({ ...regData, password: e.target.value })}
                                            placeholder="Choose a secure password"
                                            required
                                            style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{
                                        width: '100%',
                                        marginTop: '1rem',
                                        padding: '0.85rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        backgroundColor: currentRoleCfg.color,
                                        color: '#FFFFFF',
                                        fontSize: '0.95rem',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        boxShadow: `0 6px 18px -2px ${currentRoleCfg.color}66`
                                    }}
                                >
                                    {isLoading ? 'Creating Facility Record...' : `Complete ${currentRoleCfg.name} Registration`}
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
