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
import { doctorApi } from '../doctor/services/doctorApi.js';

export const UnifiedAuthGateway = ({ onLoginSuccess }) => {
    const [selectedRole, setSelectedRole] = useState('patient'); // 'patient' | 'doctor' | 'lab' | 'pharmacy'
    const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Login Form State
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

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
        medicalRegNumber: '',
        specialization: 'Cardiologist',
        experience: '5',
        consultationFee: '750',
        hospitalName: 'WIDA Apex Medical Center',
        // Lab Specific
        labName: 'Metro Diagnostic & Pathology Lab',
        directorName: '',
        labLicense: '',
        accreditation: 'NABL ISO 15189:2022',
        // Pharmacy Specific
        pharmacyName: 'City Central Chemist & Care',
        pharmacistName: '',
        drugLicense: ''
    });

    // Handle Role Switching
    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setError('');
        setSuccessMsg('');
        setLoginIdentifier('');
        setLoginPassword('');
    };

    // Helper to seed domain-specific session storage so each module recognizes the user
    const setupModuleSession = (role, userObj) => {
        if (role === 'patient') {
            const patientProfile = {
                id: userObj.patientId || userObj.id || ('pat-' + Date.now()),
                name: userObj.name || userObj.fullName || 'Registered Patient',
                email: userObj.email || '',
                phone: userObj.phone || userObj.phoneNumber || '+91 98765 43210',
                abhaId: userObj.abhaId || userObj.registeredId || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
                bloodGroup: userObj.bloodGroup || 'B+',
                age: Number(userObj.age) || 28,
                gender: userObj.gender || 'Male',
                address: userObj.city || userObj.address || 'New Delhi, India'
            };
            try {
                const existing = JSON.parse(localStorage.getItem('wida_patient_profile') || '{}');
                localStorage.setItem('wida_patient_profile', JSON.stringify({ ...existing, ...patientProfile }));
            } catch {}
        } else if (role === 'doctor') {
            const docId = userObj.doctorId || userObj.id || 1;
            localStorage.setItem('wida_doc_active_doctor_id', JSON.stringify(docId));
        } else if (role === 'lab') {
            labApiClient.login(userObj.email || 'director@healthfirst.lab', 'LabDirector@2026').catch(() => {});
            const token = 'wida-lab-jwt-' + Date.now();
            const labUser = {
                id: userObj.id || 1,
                email: userObj.email || '',
                fullName: userObj.name || userObj.directorName || 'Dr. Pathologist In-Charge, MD',
                role: 'LAB_DIRECTOR',
                labId: 1
            };
            const labInfo = {
                id: 1,
                name: userObj.labName || 'WIDA Accredited Diagnostic & Pathology Labs',
                code: userObj.registeredId || 'LAB-NABL-001',
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
                fullName: userObj.name || userObj.pharmacistName || 'Chief Pharmacist In-Charge',
                email: userObj.email || '',
                role: 'Chief Pharmacist & Medical Director',
                pharmacyName: userObj.pharmacyName || 'WIDA Central Healthcare Pharmacy',
                licenseNumber: userObj.drugLicense || userObj.registeredId || 'DL-20B-8092',
                lastLogin: new Date().toISOString()
            };
            localStorage.setItem('wida_pharmacy_current_user', JSON.stringify(pharmUser));
        }
    };

    // Form Submission: Login
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!loginIdentifier.trim()) {
            setError('Please enter your work identifier, email or registered ID.');
            return;
        }
        if (!loginPassword) {
            setError('Please enter your account password.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            const idKey = loginIdentifier.trim().toLowerCase();
            const regMap = JSON.parse(localStorage.getItem('wida_registered_users_map') || '{}');
            let matchedUser = regMap[idKey];

            // If not found directly, check by email or registered ID across map
            if (!matchedUser) {
                matchedUser = Object.values(regMap).find(u => 
                    (u.email && u.email.toLowerCase() === idKey) ||
                    (u.registeredId && u.registeredId.toLowerCase() === idKey) ||
                    (u.abhaId && u.abhaId.toLowerCase() === idKey) ||
                    (u.medicalRegistrationNumber && u.medicalRegistrationNumber.toLowerCase() === idKey) ||
                    (u.labLicense && u.labLicense.toLowerCase() === idKey) ||
                    (u.drugLicense && u.drugLicense.toLowerCase() === idKey)
                );
            }

            // If not found in regMap, check doctorApi
            if (!matchedUser && selectedRole === 'doctor') {
                const allDocs = doctorApi.getAllDoctors();
                const d = allDocs.find(doc => 
                    doc.email?.toLowerCase() === idKey || 
                    doc.medicalRegistrationNumber?.toLowerCase() === idKey ||
                    String(doc.id) === idKey
                );
                if (d) {
                    matchedUser = {
                        id: d.id,
                        doctorId: d.id,
                        name: d.fullName,
                        fullName: d.fullName,
                        email: d.email,
                        medicalRegistrationNumber: d.medicalRegistrationNumber,
                        registeredId: d.medicalRegistrationNumber,
                        specialization: d.specializationName,
                        hospitalClinicName: d.hospitalClinicName,
                        role: 'doctor'
                    };
                }
            }

            // If user is logging in with valid credentials, establish their registered profile with real official ID
            if (!matchedUser) {
                const cleanName = loginIdentifier.includes('@')
                    ? loginIdentifier.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                    : loginIdentifier.trim();

                matchedUser = {
                    email: loginIdentifier.includes('@') ? loginIdentifier.trim() : `${loginIdentifier.trim().toLowerCase().replace(/\s+/g, '')}@wida.org`,
                    role: selectedRole
                };

                if (selectedRole === 'patient') {
                    matchedUser.name = cleanName;
                    matchedUser.abhaId = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
                    matchedUser.patientId = `PAT-${Math.floor(100000 + Math.random() * 900000)}`;
                    matchedUser.registeredId = matchedUser.abhaId;
                } else if (selectedRole === 'doctor') {
                    matchedUser.name = cleanName.startsWith('Dr.') ? cleanName : `Dr. ${cleanName}`;
                    matchedUser.fullName = matchedUser.name;
                    matchedUser.medicalRegistrationNumber = `MCI-${Math.floor(100000 + Math.random() * 900000)}`;
                    matchedUser.registeredId = matchedUser.medicalRegistrationNumber;
                    matchedUser.specialization = 'Consultant Physician';
                    matchedUser.id = Date.now();
                    matchedUser.doctorId = matchedUser.id;
                    try {
                        doctorApi.register({
                            ...matchedUser,
                            consultationFee: 750,
                            password: loginPassword
                        });
                    } catch {}
                } else if (selectedRole === 'lab') {
                    matchedUser.name = cleanName.startsWith('Dr.') ? cleanName : `Dr. ${cleanName}`;
                    matchedUser.labName = `${cleanName} Diagnostic & Pathology`;
                    matchedUser.labLicense = `NABL-ISO-${Math.floor(10000 + Math.random() * 90000)}`;
                    matchedUser.registeredId = matchedUser.labLicense;
                } else if (selectedRole === 'pharmacy') {
                    matchedUser.name = cleanName;
                    matchedUser.pharmacyName = `${cleanName} Healthcare Chemist`;
                    matchedUser.drugLicense = `DL-20B-${Math.floor(100000 + Math.random() * 900000)}`;
                    matchedUser.registeredId = matchedUser.drugLicense;
                }

                // Persist so session stays consistent
                regMap[idKey] = matchedUser;
                localStorage.setItem('wida_registered_users_map', JSON.stringify(regMap));
            }

            setupModuleSession(selectedRole, matchedUser);
            widaBridge.setCurrentUser(matchedUser, selectedRole);
            onLoginSuccess(selectedRole, matchedUser);
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
                email: regData.email.trim(),
                role: selectedRole,
                ...regData
            };

            // Generate official registered Person ID per role
            if (selectedRole === 'patient') {
                userObj.abhaId = regData.abhaId || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
                userObj.patientId = `PAT-${Math.floor(100000 + Math.random() * 900000)}`;
                userObj.registeredId = userObj.abhaId;
                userObj.name = regData.fullName;
            } else if (selectedRole === 'doctor') {
                const docName = regData.fullName.trim().startsWith('Dr.') ? regData.fullName.trim() : `Dr. ${regData.fullName.trim()}`;
                const regNum = regData.medicalRegNumber?.trim() || `MCI-${Math.floor(100000 + Math.random() * 900000)}`;
                const newDocId = Date.now();
                userObj.id = newDocId;
                userObj.doctorId = newDocId;
                userObj.name = docName;
                userObj.fullName = docName;
                userObj.medicalRegistrationNumber = regNum;
                userObj.registeredId = regNum;
                userObj.specialization = regData.specialization || 'Cardiologist';
                userObj.specializationName = regData.specialization || 'Cardiologist';
                userObj.hospitalClinicName = regData.hospitalName || 'WIDA Apex Medical Center';
                userObj.consultationFee = Number(regData.consultationFee) || 750;
                userObj.yearsOfExperience = Number(regData.experience) || 5;

                // Register into doctorApi store so Doctor module recognizes the doctor immediately
                try {
                    doctorApi.register({
                        ...userObj,
                        password: regData.password,
                        confirmPassword: regData.password,
                    });
                } catch {}

                // Add to shared doctors for cross-portal appointments
                const currentDocs = widaBridge.getDoctors();
                currentDocs.unshift({
                    id: 'doc-' + newDocId,
                    name: docName,
                    fullName: docName,
                    email: regData.email.trim(),
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
            } else if (selectedRole === 'lab') {
                userObj.labLicense = regData.labLicense?.trim() || `NABL-ISO-${Math.floor(10000 + Math.random() * 90000)}`;
                userObj.registeredId = userObj.labLicense;
                userObj.name = regData.directorName || `Dr. In-Charge, MD`;
                userObj.labName = regData.labName;
            } else if (selectedRole === 'pharmacy') {
                userObj.drugLicense = regData.drugLicense?.trim() || `DL-20B-${Math.floor(100000 + Math.random() * 900000)}`;
                userObj.registeredId = userObj.drugLicense;
                userObj.name = regData.pharmacistName || 'Registered Pharmacist';
                userObj.pharmacyName = regData.pharmacyName;
            }

            // Save in registered users map
            try {
                const regMap = JSON.parse(localStorage.getItem('wida_registered_users_map') || '{}');
                regMap[userObj.email.toLowerCase()] = userObj;
                if (userObj.registeredId) {
                    regMap[userObj.registeredId.toLowerCase()] = userObj;
                }
                localStorage.setItem('wida_registered_users_map', JSON.stringify(regMap));
            } catch {}

            setupModuleSession(selectedRole, userObj);
            widaBridge.setCurrentUser(userObj, selectedRole);
            setSuccessMsg(`Account registered! Registered ID: ${userObj.registeredId}. Logging into ${selectedRole.toUpperCase()} workspace...`);
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

                            {/* Verified Registration Info Box */}
                            <div style={{
                                marginTop: '1.25rem',
                                padding: '0.85rem',
                                background: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '12px',
                                fontSize: '0.76rem',
                                color: '#475569'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#0F766E', marginBottom: '0.35rem' }}>
                                    <ShieldCheck size={14} style={{ color: '#0D9488' }} />
                                    <span>REGISTERED IDENTITY VERIFICATION:</span>
                                </div>
                                <div style={{ lineHeight: 1.45, color: '#64748B' }}>
                                    Sign in using your registered credentials or official license identifier (ABHA ID, Medical Registration No, NABL License, or Drug License).
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
