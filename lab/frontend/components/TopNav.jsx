import React from 'react';
import { UserCheck, ShieldAlert, Award, Clock } from 'lucide-react';

export const TopNav = ({ activeSectionTitle, user, lab, onRoleSwitch, onSimulateVerify }) => {
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

                {/* Role Switcher for Testing RBAC Permissions */}
                {onRoleSwitch && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--lab-text-secondary)' }}>Role:</span>
                        <select
                            className="lab-select"
                            value={user?.role}
                            onChange={(e) => onRoleSwitch(e.target.value)}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', height: '32px', width: 'auto' }}
                            title="Test different clinical security roles"
                        >
                            <option value="LAB_DIRECTOR">Lab Director (Full Admin)</option>
                            <option value="PATHOLOGIST">Pathologist (Verification Signatory)</option>
                            <option value="TECHNICIAN">Technician (Results Entry Only)</option>
                            <option value="PHLEBOTOMIST">Phlebotomist (Sample Collector)</option>
                        </select>
                    </div>
                )}

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
        </header>
    );
};
