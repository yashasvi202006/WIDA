import React from 'react';

export const Sidebar = ({
  activeSection,
  onSelectSection,
  pendingAppointmentsCount,
  unreadNotificationsCount,
  onLogout,
  isMobileOpen,
}) => {
  return (
    <aside className="wida-sidebar">
      {/* Brand Header */}
      <div className="wida-sidebar-brand">
        <div className="wida-brand-logo-icon">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#e6f7f4" />
            <path
              d="M11 11C11 8.79086 12.7909 7 15 7C17.2091 7 19 8.79086 19 11V21C19 23.2091 17.2091 25 15 25C12.7909 25 11 23.2091 11 21V11Z"
              stroke="#007c77"
              strokeWidth="2.5"
            />
            <path
              d="M11 15C8.79086 15 7 16.7909 7 19C7 21.2091 8.79086 23 11 23H21C23.2091 23 25 21.2091 25 19C25 16.7909 23.2091 15 21 15H11Z"
              stroke="#007c77"
              strokeWidth="2.5"
            />
          </svg>
        </div>
        <div className="wida-brand-title">
          <span>WIDA</span>
          <span className="wida-brand-dot">.</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className={`wida-sidebar-nav ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="wida-nav-section">
          <button
            type="button"
            className={`wida-nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => onSelectSection('dashboard')}
          >
            <span className="wida-nav-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" />
              </svg>
            </span>
            <span className="wida-nav-txt">Dashboard</span>
          </button>

          <button
            type="button"
            className={`wida-nav-link ${activeSection === 'appointments' ? 'active' : ''}`}
            onClick={() => onSelectSection('appointments')}
          >
            <span className="wida-nav-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="3" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <span className="wida-nav-txt">Appointments</span>
            <span className="wida-nav-arrow">›</span>
          </button>

          <button
            type="button"
            className={`wida-nav-link ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => onSelectSection('profile')}
          >
            <span className="wida-nav-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </span>
            <span className="wida-nav-txt">Doctors</span>
          </button>

          <button
            type="button"
            className={`wida-nav-link ${activeSection === 'consultations' ? 'active' : ''}`}
            onClick={() => onSelectSection('consultations')}
          >
            <span className="wida-nav-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <span className="wida-nav-txt">Messages</span>
            <span className="wida-nav-badge-red">2</span>
          </button>

          <button
            type="button"
            className={`wida-nav-link ${activeSection === 'diagnostic-tests' ? 'active' : ''}`}
            onClick={() => onSelectSection('diagnostic-tests')}
          >
            <span className="wida-nav-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </span>
            <span className="wida-nav-txt">AI Care</span>
          </button>
        </div>

        {/* Other Menu */}
        <div className="wida-nav-group-label">Other Menu</div>
        <div className="wida-nav-section">
          <button
            type="button"
            className={`wida-nav-link ${activeSection === 'patients' || activeSection === 'medical-reports' ? 'active' : ''}`}
            onClick={() => onSelectSection('patients')}
          >
            <span className="wida-nav-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </span>
            <span className="wida-nav-txt">Health Records</span>
            <span className="wida-nav-arrow">›</span>
          </button>

          <button
            type="button"
            className={`wida-nav-link ${activeSection === 'prescriptions' ? 'active' : ''}`}
            onClick={() => onSelectSection('prescriptions')}
          >
            <span className="wida-nav-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.5 20.5 4 14l10-10 6.5 6.5-10 10Z" />
                <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
              </svg>
            </span>
            <span className="wida-nav-txt">Prescriptions</span>
            <span className="wida-nav-arrow">›</span>
          </button>

          <button
            type="button"
            className={`wida-nav-link ${activeSection === 'ratings' ? 'active' : ''}`}
            onClick={() => onSelectSection('ratings')}
          >
            <span className="wida-nav-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </span>
            <span className="wida-nav-txt">Billing & Insurance</span>
          </button>

          <button
            type="button"
            className={`wida-nav-link ${activeSection === 'availability' ? 'active' : ''}`}
            onClick={() => onSelectSection('availability')}
          >
            <span className="wida-nav-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </span>
            <span className="wida-nav-txt">Resources</span>
          </button>
        </div>

        {/* Support */}
        <div className="wida-nav-group-label">Support</div>
        <div className="wida-nav-section">
          <button
            type="button"
            className={`wida-nav-link ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => onSelectSection('settings')}
          >
            <span className="wida-nav-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </span>
            <span className="wida-nav-txt">Settings</span>
          </button>

          <button
            type="button"
            className="wida-nav-link"
            onClick={() => onSelectSection('notifications')}
          >
            <span className="wida-nav-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </span>
            <span className="wida-nav-txt">Help Center</span>
          </button>

          <button
            type="button"
            className="wida-nav-link wida-logout-link"
            onClick={onLogout}
          >
            <span className="wida-nav-ico">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span className="wida-nav-txt">Logout</span>
          </button>
        </div>

        {/* Bottom Promo Card */}
        <div className="wida-promo-card">
          <div className="wida-promo-tag">
            <span>🎁</span> 1 Month Free
          </div>
          <h4 className="wida-promo-title">
            Have you tried our new <strong>Mobile App?</strong>
          </h4>
          <button
            type="button"
            className="wida-promo-btn"
            onClick={() => alert('WIDA Mobile App is available on iOS App Store and Google Play!')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Now
          </button>
        </div>
      </nav>
    </aside>
  );
};
