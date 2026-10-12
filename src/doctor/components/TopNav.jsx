import React, { useState, useRef, useEffect } from 'react';
import { WidaAIAssistantModal } from '../../components/WidaAIAssistantModal.jsx';

export const TopNav = ({ doctor, allDoctors, onSwitchDoctor, unreadCount, onOpenNotifications, onOpenProfile, onToggleMobileMenu, }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const initials = doctor.fullName
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    return (<header className="doc-topnav">
      {/* Left: Mobile menu + Demo switcher */}
      <div className="doc-topnav-left">
        <button type="button" className="doc-btn doc-btn-ghost doc-btn-sm" style={{ display: 'none' }} onClick={onToggleMobileMenu} title="Toggle Menu">
          ☰
        </button>

        <div className="doc-demo-switch" style={{ gap: '8px' }}>
          <span style={{ fontSize: '13px' }}>🩺</span>
          <span style={{ fontWeight: 600, color: 'var(--doc-primary-dark)', fontSize: '12px' }}>
            Registered Doctor:
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
            {doctor.fullName}
          </span>
          <span style={{ fontSize: '11px', color: '#007C77', background: '#CCFBF1', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
            🆔 Reg ID: {doctor.medicalRegistrationNumber || `DOC-${doctor.id}`}
          </span>
        </div>
      </div>

      {/* Right: Verification badge + AI assistant + notifications + profile */}
      <div className="doc-topnav-right">
        {/* AI Assistant Button */}
        <button
          type="button"
          className="doc-btn doc-btn-outline doc-btn-sm"
          onClick={() => setIsAiModalOpen(true)}
          style={{
            background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(99, 102, 241, 0.15) 100%)',
            borderColor: 'rgba(13, 148, 136, 0.35)',
            color: 'var(--doc-primary-dark)',
            fontWeight: 700,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="Open WIDA AI Clinical Assistant"
        >
          <span>🤖</span> AI Clinical Assistant
        </button>

        {/* Verification Status */}
        <span className={`doc-badge ${doctor.verificationStatus === 'VERIFIED'
            ? 'doc-badge-verified'
            : doctor.verificationStatus === 'UNDER_REVIEW'
                ? 'doc-badge-review'
                : 'doc-badge-pending'}`}>
          {doctor.verificationStatus === 'VERIFIED'
            ? '✓ Verified'
            : doctor.verificationStatus === 'UNDER_REVIEW'
                ? '⏳ Under Review'
                : '⚠ Pending'}
        </span>

        {/* Notifications Bell */}
        <button type="button" className="doc-btn doc-btn-ghost doc-btn-sm" style={{ position: 'relative', fontSize: '20px', padding: '8px', borderRadius: '50%' }} onClick={onOpenNotifications} title="Notifications">
          🔔
          {unreadCount > 0 && (<span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: 'var(--doc-danger)',
                color: 'white',
                borderRadius: '50%',
                fontSize: '9.5px',
                fontWeight: 700,
                width: '17px',
                height: '17px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>)}
        </button>

        {/* Doctor Profile Dropdown */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button type="button" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'transparent',
            border: '1.5px solid var(--doc-border)',
            borderRadius: '9999px',
            padding: '5px 14px 5px 6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
        }} onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--doc-primary-light)';
            e.currentTarget.style.background = 'var(--doc-primary-subtle)';
        }} onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--doc-border)';
            e.currentTarget.style.background = 'transparent';
        }} onClick={() => setShowMenu((v) => !v)}>
            {doctor.profilePhotoUrl ? (<img src={doctor.profilePhotoUrl} alt={doctor.fullName} className="doc-avatar" style={{ width: 34, height: 34 }}/>) : (<div className="doc-avatar-initial" style={{ width: 34, height: 34, fontSize: 12 }}>
                {initials}
              </div>)}
            <div className="doc-user-info" style={{ textAlign: 'left' }}>
              <span className="doc-user-name">{doctor.fullName}</span>
              <span className="doc-user-role">{doctor.specializationName}</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--doc-text-soft)', marginLeft: 2 }}>▾</span>
          </button>

          {showMenu && (<div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: '#fff',
                border: '1px solid var(--doc-border)',
                borderRadius: 'var(--doc-radius-lg)',
                boxShadow: 'var(--doc-shadow-md)',
                padding: '8px',
                minWidth: '200px',
                zIndex: 60,
                animation: 'docFadeIn 0.18s ease',
            }}>
              {/* Profile header */}
              <div style={{
                padding: '10px 12px 12px',
                borderBottom: '1px solid var(--doc-border)',
                marginBottom: 6,
            }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--doc-text-main)' }}>
                  {doctor.fullName}
                </div>
                <div style={{ fontSize: 12, color: 'var(--doc-text-muted)' }}>{doctor.email}</div>
              </div>

              <button type="button" className="doc-btn doc-btn-ghost doc-btn-sm" style={{ width: '100%', justifyContent: 'flex-start', gap: 10 }} onClick={() => {
                setShowMenu(false);
                onOpenProfile();
            }}>
                <span>👤</span> View Profile
              </button>
            </div>)}
        </div>
      </div>

      <WidaAIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialDomain="doctor"
      />
    </header>);
};
