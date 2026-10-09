import React from 'react';
import { LayoutDashboard, Calendar, FileHeart, Sparkles, Menu } from 'lucide-react';

interface PatientMobileNavProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  onToggleMobileDrawer: () => void;
}

export const PatientMobileNav: React.FC<PatientMobileNavProps> = ({
  currentTab,
  onSelectTab,
  onToggleMobileDrawer
}) => {
  return (
    <nav className="patient-mobile-nav" aria-label="Mobile navigation bar">
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`patient-nav-item flex-column justify-content-center p-1 m-0 text-center ${
          currentTab === 'dashboard' ? 'active' : ''
        }`}
        style={{ width: 'auto' }}
      >
        <LayoutDashboard size={20} />
        <span style={{ fontSize: '0.68rem' }}>Home</span>
      </button>

      <button
        onClick={() => onSelectTab('appointments')}
        className={`patient-nav-item flex-column justify-content-center p-1 m-0 text-center ${
          currentTab === 'appointments' ? 'active' : ''
        }`}
        style={{ width: 'auto' }}
      >
        <Calendar size={20} />
        <span style={{ fontSize: '0.68rem' }}>Appts</span>
      </button>

      <button
        onClick={() => onSelectTab('records')}
        className={`patient-nav-item flex-column justify-content-center p-1 m-0 text-center ${
          currentTab === 'records' ? 'active' : ''
        }`}
        style={{ width: 'auto' }}
      >
        <FileHeart size={20} />
        <span style={{ fontSize: '0.68rem' }}>Records</span>
      </button>

      <button
        onClick={() => onSelectTab('ai-care')}
        className={`patient-nav-item flex-column justify-content-center p-1 m-0 text-center ${
          currentTab === 'ai-care' ? 'active' : ''
        }`}
        style={{ width: 'auto' }}
      >
        <Sparkles size={20} style={{ color: 'var(--p-purple)' }} />
        <span style={{ fontSize: '0.68rem' }}>AI Care</span>
      </button>

      <button
        onClick={onToggleMobileDrawer}
        className="patient-nav-item flex-column justify-content-center p-1 m-0 text-center"
        style={{ width: 'auto' }}
      >
        <Menu size={20} />
        <span style={{ fontSize: '0.68rem' }}>More</span>
      </button>
    </nav>
  );
};
