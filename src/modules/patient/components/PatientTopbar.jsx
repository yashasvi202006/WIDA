import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, Moon, Sun, User, Shield, Settings, LogOut, FileText, Pill, UserPlus } from 'lucide-react';
import { NotificationBell } from './NotificationBell';
export const PatientTopbar = ({ currentTab, onSelectTab, onToggleMobileMenu, notifications, unreadCount, onMarkAsRead, onMarkAllAsRead, patient, darkMode, onToggleDarkMode, onOpenAIChat, onOpenMSWConsole, onLogout }) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const profileRef = useRef(null);
    useEffect(() => {
        const handleOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);
    const getPageTitle = () => {
        switch (currentTab) {
            case 'dashboard':
                return 'Patient Health Overview';
            case 'appointments':
                return 'Appointments Management';
            case 'doctors':
                return 'Find & Consult Doctors';
            case 'records':
                return 'Unified Health Records & Journey';
            case 'prescriptions':
                return 'Active & Past Prescriptions';
            case 'diagnostics':
                return 'Diagnostic Tests & Lab Reports';
            case 'pharmacy':
                return 'Pharmacy Orders & Refill Reminders';
            case 'wellness':
                return 'Personal Wellness & Wearable';
            case 'emergency':
                return 'Emergency / SOS Medical Dispatch';
            case 'government':
                return 'Government Health Schemes & ABHA';
            case 'alternative':
                return 'Alternative Medicine & AYUSH';
            case 'notifications':
                return 'Notification Center';
            case 'reminders':
                return 'Medication & Schedule Reminders';
            case 'messages':
                return 'Healthcare Care Team Messages';
            case 'ai-care':
                return 'AI Care Health Assistant';
            case 'vault':
                return 'Secure Medical Document Vault';
            case 'privacy':
                return 'Privacy, Consent & Audit Trail';
            case 'settings':
                return 'Account & Preference Settings';
            case 'profile':
                return 'Patient Profile & Health Summary';
            default:
                return 'WIDA Patient Portal';
        }
    };
    return (<header className="patient-topbar" role="banner">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="d-flex align-items-center gap-3">
        <button className="patient-btn patient-btn-outline p-2 d-lg-none" onClick={onToggleMobileMenu} aria-label="Toggle navigation menu">
          <Menu size={20}/>
        </button>

        <div>
          <h5 className="font-heading mb-0" style={{ fontSize: '1.15rem' }}>
            {getPageTitle()}
          </h5>
          <span style={{ fontSize: '0.72rem', color: 'var(--p-text-muted)' }}>
            WIDA Ecosystem • Patient Portal
          </span>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="d-none d-md-block position-relative" style={{ width: 340 }}>
        <div className="position-relative">
          <Search size={16} className="position-absolute text-muted" style={{ top: '50%', transform: 'translateY(-50%)', left: 12 }}/>
          <input type="search" className="patient-input ps-5 pe-3" placeholder="Search doctors, reports, medicines..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 200)} aria-label="Global search across WIDA"/>
        </div>

        {/* Instant Search Results Dropdown */}
        {searchFocused && searchQuery.trim() && (<div className="position-absolute start-0 end-0 mt-2 bg-white rounded shadow-lg border p-2" style={{
                backgroundColor: 'var(--p-surface)',
                borderColor: 'var(--p-border)',
                zIndex: 1040,
                maxHeight: 280,
                overflowY: 'auto'
            }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--p-text-subtle)' }} className="px-2 py-1 fw-bold">
              SEARCH RESULTS
            </div>
            <div className="p-2 rounded d-flex align-items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.82rem' }} onMouseDown={() => {
                onSelectTab('doctors');
                setSearchQuery('');
            }}>
              <User size={14} style={{ color: 'var(--p-primary)' }}/>
              <span>Dr. Sharma (Cardiologist)</span>
            </div>
            <div className="p-2 rounded d-flex align-items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.82rem' }} onMouseDown={() => {
                onSelectTab('diagnostics');
                setSearchQuery('');
            }}>
              <FileText size={14} style={{ color: '#0284C7' }}/>
              <span>Complete Blood Count (CBC) Lab Report</span>
            </div>
            <div className="p-2 rounded d-flex align-items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.82rem' }} onMouseDown={() => {
                onSelectTab('prescriptions');
                setSearchQuery('');
            }}>
              <Pill size={14} style={{ color: 'var(--p-success)' }}/>
              <span>Telmisartan 40mg (Prescription #RX-201)</span>
            </div>
          </div>)}
      </div>

      {/* Right Actions */}
      <div className="d-flex align-items-center gap-2">
        {onOpenMSWConsole && (<button onClick={onOpenMSWConsole} className="patient-btn d-none d-md-flex align-items-center gap-2 py-1 px-2 border" style={{
                fontSize: '0.74rem',
                fontWeight: 600,
                backgroundColor: 'var(--p-surface-alt)',
                borderColor: 'rgba(16, 185, 129, 0.4)',
                borderRadius: '20px',
                color: 'var(--p-text-main)',
                cursor: 'pointer'
            }} title="Click to open Java Backend & SQLite Database Console">
            <span style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 6px #10B981'
            }}/>
            <span>Java DB (8080) Active</span>
          </button>)}

        {onOpenAIChat && (<button onClick={onOpenAIChat} className="patient-btn patient-btn-outline p-2 d-none d-sm-flex align-items-center gap-1" style={{
                borderColor: 'var(--p-primary)',
                color: 'var(--p-primary)',
                fontSize: '0.8rem',
                fontWeight: 600
            }} title="Open WIDA AI Care Navigator">
            <span>🤖 AI Assistant</span>
          </button>)}

        {/* Dark Mode Toggle */}
        <button onClick={onToggleDarkMode} className="patient-btn patient-btn-outline p-2" style={{
            borderRadius: '50%',
            width: 40,
            height: 40,
            borderColor: 'var(--p-border)',
            color: 'var(--p-text-main)'
        }} title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'} aria-label="Toggle theme">
          {darkMode ? <Sun size={18} className="text-warning"/> : <Moon size={18}/>}
        </button>

        {/* Notification Bell */}
        <NotificationBell notifications={notifications} unreadCount={unreadCount} onMarkAsRead={onMarkAsRead} onMarkAllAsRead={onMarkAllAsRead} onNavigateToNotifications={() => onSelectTab('notifications')}/>

        {/* Profile Avatar & Dropdown */}
        <div className="position-relative" ref={profileRef}>
          <div onClick={() => setProfileOpen(!profileOpen)} className="d-flex align-items-center gap-2 p-1 rounded" style={{ cursor: 'pointer' }}>
            <img src={patient.avatarUrl} alt={patient.name} onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=0D9488&color=fff&bold=true`;
        }} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}/>
            <span className="d-none d-sm-inline fw-semibold text-truncate" style={{ fontSize: '0.88rem', maxWidth: 110 }}>
              {patient.name.split(' ')[0]}
            </span>
          </div>

          {profileOpen && (<div className="position-absolute end-0 mt-2 rounded shadow-lg border p-1" style={{
                width: 220,
                backgroundColor: 'var(--p-surface)',
                borderColor: 'var(--p-border)',
                zIndex: 1050
            }}>
              <div className="p-2 border-bottom" style={{ borderColor: 'var(--p-border-subtle)' }}>
                <div className="fw-bold" style={{ fontSize: '0.88rem' }}>{patient.name}</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>{patient.email}</div>
                <span className="patient-badge patient-badge-teal mt-1" style={{ fontSize: '0.65rem' }}>
                  ABHA Verified
                </span>
              </div>

              <div className="py-1">
                <button className="patient-nav-item py-2" onClick={() => {
                setProfileOpen(false);
                onSelectTab('profile');
            }}>
                  <User size={15}/> My Profile
                </button>
                <button className="patient-nav-item py-2" onClick={() => {
                setProfileOpen(false);
                onSelectTab('privacy');
            }}>
                  <Shield size={15}/> Privacy & Consent
                </button>
                <button className="patient-nav-item py-2" onClick={() => {
                setProfileOpen(false);
                onSelectTab('settings');
            }}>
                  <Settings size={15}/> Settings
                </button>
                <button className="patient-nav-item py-2 text-teal" style={{ color: 'var(--p-primary)' }} onClick={() => {
                setProfileOpen(false);
                onSelectTab('register');
            }}>
                  <UserPlus size={15}/> Create New Account
                </button>
                <button className="patient-nav-item py-2 text-danger" onClick={() => {
                setProfileOpen(false);
                if (onLogout) {
                    onLogout();
                }
                else {
                    alert('Signed out from WIDA session.');
                }
            }}>
                  <LogOut size={15}/> Logout
                </button>
              </div>
            </div>)}
        </div>
      </div>
    </header>);
};
