import React, { useState, useEffect } from 'react';
// WIDA Components & Gateways
import { UnifiedAuthGateway } from './components/UnifiedAuthGateway.jsx';
import { EcosystemHeader } from './components/EcosystemHeader.jsx';
import { widaBridge } from './services/widaEcosystemBridge';
import { WidaAIAssistantModal } from './components/WidaAIAssistantModal.jsx';

// WIDA Doctor Module (Vanshika Tailor)
import DoctorApp from './doctor/DoctorApp.jsx';
// WIDA Patient Module
import { PatientModule } from './modules/patient';
// WIDA Diagnostic Laboratory Module
import { LabApp } from '../lab/frontend/App.jsx';
// WIDA Pharmacy Module
import { PharmacyDashboard } from '../feature/pharmacy/PharmacyDashboard.jsx';

export default function App() {
  const getInitialPortal = () => {
    // 1. Check path route
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/lab')) return 'lab';
    if (path.includes('/pharmacy')) return 'pharmacy';
    if (path.includes('/patient')) return 'patient';
    if (path.includes('/doctor')) return 'doctor';

    // 2. Check URL search param
    const params = new URLSearchParams(window.location.search);
    const p = params.get('portal');
    if (['doctor', 'patient', 'lab', 'pharmacy'].includes(p)) return p;

    // 3. Check persistent localStorage
    const saved = localStorage.getItem('wida_active_portal');
    if (['doctor', 'patient', 'lab', 'pharmacy'].includes(saved)) return saved;
    return 'patient';
  };

  const [portal, setPortal] = useState(getInitialPortal);
  const [currentUser, setCurrentUser] = useState(() => widaBridge.getCurrentUser());
  const [globalAiOpen, setGlobalAiOpen] = useState(false);
  const [showAuthGateway, setShowAuthGateway] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'true') return true;
    const p = params.get('portal');
    if (p && ['doctor', 'patient', 'lab', 'pharmacy'].includes(p)) {
      const existing = widaBridge.getCurrentUser();
      return !existing;
    }
    // By default, visiting website opens the login page directly
    return true;
  });

  const handlePortalSwitch = (newPortal) => {
    setPortal(newPortal);
    localStorage.setItem('wida_active_portal', newPortal);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('portal', newPortal);
      url.searchParams.delete('login');
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore URL errors in restricted environments
    }
  };

  useEffect(() => {
    const handleGlobalPortalSwitch = (e) => {
      if (e.detail?.portal) {
        handlePortalSwitch(e.detail.portal);
      }
    };
    window.addEventListener('wida:switch-portal', handleGlobalPortalSwitch);
    return () => window.removeEventListener('wida:switch-portal', handleGlobalPortalSwitch);
  }, []);

  const handleLoginSuccess = (role, userObj) => {
    setCurrentUser(userObj);
    setPortal(role);
    setShowAuthGateway(false);
    handlePortalSwitch(role);
  };

  const handleLogout = () => {
    widaBridge.logout();
    setCurrentUser(null);
    setShowAuthGateway(true);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('portal');
      url.searchParams.set('login', 'true');
      window.history.replaceState({}, '', url.pathname + '?login=true');
    } catch {
      // Ignore URL errors
    }
  };

  useEffect(() => {
    localStorage.setItem('wida_active_portal', portal);
  }, [portal]);

  const renderActivePortal = () => {
    switch (portal) {
      case 'doctor':
        return <DoctorApp key={`doc-${currentUser?.email || currentUser?.id || 'portal'}`} onLogout={handleLogout} initialSection="dashboard" />;
      case 'patient':
        return <PatientModule initialTab="dashboard" onLogout={handleLogout} />;
      case 'lab':
        return <LabApp onLogout={handleLogout} />;
      case 'pharmacy':
        return <PharmacyDashboard onLogout={handleLogout} />;
      default:
        return <PatientModule initialTab="dashboard" onLogout={handleLogout} />;
    }
  };

  // If on Unified Login / Registration Gateway
  if (showAuthGateway) {
    return (
      <div>
        <UnifiedAuthGateway onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // Active Multi-Module Connected Ecosystem
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Universal Connected Ecosystem Header */}
      <EcosystemHeader
        activePortal={portal}
        onSwitchPortal={handlePortalSwitch}
        onLogout={handleLogout}
        onSwitchUser={(newUser) => {
          setCurrentUser(newUser);
        }}
      />

      {/* Primary Domain View */}
      <div style={{ flex: 1 }}>
        {renderActivePortal()}
      </div>

      {/* Floating Global AI Assistant Trigger */}
      <button
        type="button"
        id="wida-global-ai-trigger"
        onClick={() => setGlobalAiOpen(true)}
        style={{
          position: 'fixed',
          bottom: '22px',
          right: '22px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          borderRadius: '50px',
          background: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.86rem',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 24px rgba(13, 148, 136, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        title="Open WIDA Unified AI Healthcare Assistant"
      >
        <span style={{ fontSize: '1.1rem' }}>🤖</span>
        <span>AI Health Assistant</span>
      </button>

      <WidaAIAssistantModal
        isOpen={globalAiOpen}
        onClose={() => setGlobalAiOpen(false)}
        initialDomain={portal}
      />
    </div>
  );
}

