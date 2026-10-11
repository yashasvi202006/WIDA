import React from 'react';
import {
    Activity,
    User,
    Stethoscope,
    Microscope,
    Pill,
    LogOut,
    ExternalLink,
    ShieldCheck
} from 'lucide-react';
import { widaBridge } from '../services/widaEcosystemBridge';

export const EcosystemHeader = ({ activePortal, onSwitchPortal, onLogout }) => {
    const currentUser = widaBridge.getCurrentUser();

    const portals = [
        { id: 'patient', name: 'Patient Portal', icon: User, color: '#0284C7' },
        { id: 'doctor', name: 'Doctor Portal', icon: Stethoscope, color: '#007C77' },
        { id: 'lab', name: 'Diagnostic Lab', icon: Microscope, color: '#0D9488' },
        { id: 'pharmacy', name: 'Pharmacy Desk', icon: Pill, color: '#0F766E' }
    ];

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

            {/* Right: Active Profile & Sign Out */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#94A3B8' }}>
                    <ShieldCheck size={14} style={{ color: '#10B981' }} />
                    <span>Active:</span>
                    <strong style={{ color: '#F1F5F9' }}>
                        {currentUser?.name || (activePortal === 'doctor' ? 'Dr. Aarav Sharma' : activePortal === 'lab' ? 'Dr. Sunita Deshmukh' : activePortal === 'pharmacy' ? 'Dr. Yogita Chugh' : 'Yashasvi Saini')}
                    </strong>
                </div>

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
                    <span>Sign Out / Switch</span>
                </button>
            </div>
        </header>
    );
};
