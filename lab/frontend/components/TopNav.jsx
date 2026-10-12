import React, { useState } from 'react';
import { UserCheck, ShieldAlert, Award, Clock, Bot } from 'lucide-react';
import { WidaAIAssistantModal } from '../../../src/components/WidaAIAssistantModal.jsx';

export const TopNav = ({ activeSectionTitle, user, lab, onRoleSwitch, onSimulateVerify }) => {
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const roleBadges = {
        LAB_DIRECTOR: { label: 'Lab Director', color: 'var(--lab-purple)', bg: 'var(--lab-purple-subtle)' },
        PATHOLOGIST: { label: 'Consultant Pathologist', color: 'var(--lab-primary-dark)', bg: 'var(--lab-primary-subtle)' },
        TECHNICIAN: { label: 'Medical Lab Tech', color: 'var(--lab-info)', bg: 'var(--lab-info-subtle)' },
        PHLEBOTOMIST: { label: 'Phlebotomist', color: 'var(--lab-warning)', bg: 'var(--lab-warning-subtle)' }
    };

    const currentBadge = roleBadges[user?.role] || { label: user?.role || 'Staff', color: 'var(--lab-text-secondary)', bg: 'var(--lab-surface-muted)' };

    return (
        <header className="lab-topnav no-print">
            <div>
                <h1 className="lab-topnav-title">{activeSectionTitle}</h1>
                <div style={{ fontSize: '0.75rem', color: 'var(--lab-text-secondary)' }}>
                    WIDA Diagnostic Interoperability Network • {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
            </div>

            <div className="lab-topnav-actions">
                {/* AI Assistant Button */}
                <button
                    type="button"
                    className="lab-btn lab-btn-outline lab-btn-sm"
                    onClick={() => setIsAiModalOpen(true)}
                    style={{
                        background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(99, 102, 241, 0.15) 100%)',
                        borderColor: 'rgba(13, 148, 136, 0.35)',
                        color: 'var(--lab-primary-dark)',
                        fontWeight: 700,
                        fontSize: '0.76rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                    title="Open WIDA AI Diagnostic & Clinical Assistant"
                >
                    <Bot size={15} style={{ color: 'var(--lab-primary)' }} />
                    <span>AI Assistant</span>
                </button>

                {/* Lab Verification Status Badge */}
                {lab?.status === 'VERIFIED' ? (
                    <span className="lab-badge lab-badge-teal" title="Authorized Diagnostic Testing Centre">
                        <Award size={13} /> NABL Verified
                    </span>
                ) : (
                    <div className="d-flex align-items-center gap-2">
                        <span className="lab-badge lab-badge-warning" title="Clinical Establishment Verification Underway">
                            <Clock size={13} /> Verification Pending
                        </span>
                        {onSimulateVerify && (
                            <button
                                type="button"
                                className="lab-btn lab-btn-primary lab-btn-sm"
                                onClick={onSimulateVerify}
                                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                                title="Click to simulate NABL review approval for testing"
                            >
                                Simulate Verify
                            </button>
                        )}
                    </div>
                )}

                {/* Registered NABL / Clinical Establishment ID */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'var(--lab-surface-muted)',
                    border: '1px solid var(--lab-border)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    color: 'var(--lab-text-secondary)'
                }}>
                    <span style={{ fontSize: '0.82rem' }}>🆔</span>
                    <span>License:</span>
                    <strong style={{ color: 'var(--lab-primary-dark)', letterSpacing: '0.3px' }}>
                        {lab?.license_number || user?.registeredId || 'NABL-ISO-48291'}
                    </strong>
                </div>

                {/* User Profile Pill */}
                <div className="lab-user-pill">
                    <div className="lab-user-avatar">
                        {user?.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--lab-text-main)', lineHeight: 1.2 }}>
                            {user?.name || 'Staff User'}
                        </div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: currentBadge.color }}>
                            {currentBadge.label}
                        </div>
                    </div>
                </div>
            </div>

            <WidaAIAssistantModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                initialDomain="lab"
            />
        </header>
    );
};

