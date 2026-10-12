import React, { useState } from 'react';
import {
    Activity,
    User,
    Stethoscope,
    Microscope,
    Pill,
    LogOut,
    ExternalLink,
    ShieldCheck,
    Users,
    ChevronDown,
    Check
} from 'lucide-react';
import { widaBridge } from '../services/widaEcosystemBridge';
import { DEMO_ACCOUNTS, setupModuleSession } from './UnifiedAuthGateway.jsx';

export const EcosystemHeader = ({ activePortal, onSwitchPortal, onLogout, onSwitchUser }) => {
    const [showDemoMenu, setShowDemoMenu] = useState(false);
    const currentUser = widaBridge.getCurrentUser();

    const portals = [
        { id: 'patient', name: 'Patient Portal', icon: User, color: '#0284C7' },
        { id: 'doctor', name: 'Doctor Portal', icon: Stethoscope, color: '#007C77' },
        { id: 'lab', name: 'Diagnostic Lab', icon: Microscope, color: '#0D9488' },
        { id: 'pharmacy', name: 'Pharmacy Desk', icon: Pill, color: '#0F766E' }
    ];

    const currentRoleDemos = DEMO_ACCOUNTS[activePortal] || [];
    const activeDemoId = currentUser?.registeredId || currentUser?.abhaId || currentUser?.medicalRegistrationNumber || currentRoleDemos[0]?.registeredId;

    const handleSelectDemo = (demo) => {
        setupModuleSession(activePortal, demo);
        widaBridge.setCurrentUser(demo, activePortal);
        setShowDemoMenu(false);
        if (onSwitchUser) {
            onSwitchUser(demo);
        } else {
            window.location.reload();
        }
    };

    return (
        <header style={{
            height: '48px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.25rem',
            position: 'sticky',
            top: 0,
            zIndex: 99998,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        }}>
            {/* Left: Ecosystem Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #0D9488 0%, #0284C7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                }}>
                    <Activity size={16} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '-0.02em' }}>
                        WIDA<span style={{ color: '#2DD4BF' }}>.ecosystem</span>
                    </span>
                    <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        backgroundColor: 'rgba(45, 212, 191, 0.15)',
                        color: '#2DD4BF',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '9999px',
                        border: '1px solid rgba(45, 212, 191, 0.3)'
                    }}>
                        LIVE INTERCONNECTED
                    </span>
                </div>
            </div>

            {/* Center: Direct Interconnected Portal Jump Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {portals.map((p) => {
                    const Icon = p.icon;
                    const isActive = activePortal === p.id;
                    return (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => onSwitchPortal(p.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.3rem 0.75rem',
                                borderRadius: '9999px',
                                border: isActive ? `1.5px solid ${p.color}` : '1px solid transparent',
                                backgroundColor: isActive ? p.color : 'rgba(255, 255, 255, 0.08)',
                                color: '#FFFFFF',
                                fontSize: '0.78rem',
                                fontWeight: isActive ? 700 : 500,
                                cursor: 'pointer',
                                transition: 'all 0.18s'
                            }}
                        >
                            <Icon size={14} />
                            <span>{p.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Right: Active Profile, 4 Demo IDs Selector, & Sign Out */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* 4 Demo IDs Dropdown Switcher */}
                <div style={{ position: 'relative' }}>
                    <button
                        type="button"
                        onClick={() => setShowDemoMenu(!showDemoMenu)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(45, 212, 191, 0.4)',
                            backgroundColor: 'rgba(45, 212, 191, 0.12)',
                            color: '#2DD4BF',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                        title="Quickly switch between the 4 demo profiles for this portal"
                    >
                        <Users size={13} />
                        <span>4 Demo IDs</span>
                        <ChevronDown size={12} />
                    </button>

                    {showDemoMenu && (
                        <div style={{
                            position: 'absolute',
                            top: '36px',
                            right: 0,
                            width: '280px',
                            backgroundColor: '#1E293B',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '12px',
                            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                            padding: '0.6rem',
                            zIndex: 99999,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem'
                        }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', padding: '0.2rem 0.4rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                {activePortal.toUpperCase()} DEMO ACCOUNTS (4)
                            </div>
                            {currentRoleDemos.map((demo, idx) => {
                                const isCurrent = currentUser?.email?.toLowerCase() === demo.email.toLowerCase() || (!currentUser && idx === 0);
                                return (
                                    <button
                                        key={demo.email + idx}
                                        type="button"
                                        onClick={() => handleSelectDemo(demo)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.45rem 0.6rem',
                                            borderRadius: '8px',
                                            backgroundColor: isCurrent ? 'rgba(45, 212, 191, 0.15)' : 'transparent',
                                            border: isCurrent ? '1px solid rgba(45, 212, 191, 0.4)' : '1px solid transparent',
                                            color: '#FFFFFF',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            transition: 'background 0.15s'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isCurrent ? '#2DD4BF' : '#F8FAFC' }}>
                                                {idx + 1}. {demo.name}
                                            </div>
                                            <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                                                ID: {demo.registeredId || demo.abhaId}
                                            </div>
                                        </div>
                                        {isCurrent && <Check size={14} style={{ color: '#2DD4BF' }} />}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Active User Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#94A3B8' }}>
                    <ShieldCheck size={14} style={{ color: '#10B981' }} />
                    <span>Active:</span>
                    <strong style={{ color: '#F1F5F9' }}>
                        {currentUser?.name || currentRoleDemos[0]?.name || 'Dr. Aarav Sharma'}
                    </strong>
                </div>

                {/* Sign Out Button */}
                <button
                    type="button"
                    onClick={onLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        color: '#F87171',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                    title="Sign Out and Return to Unified Login Gateway"
                >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                </button>
            </div>
        </header>
    );
};
