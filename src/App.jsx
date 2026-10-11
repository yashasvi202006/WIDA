import React, { useState, useEffect } from 'react';
// WIDA Components & Gateways
import { UnifiedAuthGateway } from './components/UnifiedAuthGateway.jsx';
import { widaBridge } from './services/widaEcosystemBridge';

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
  const [showAuthGateway, setShowAuthGateway] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'true') return true;
    const existing = widaBridge.getCurrentUser();
    return !existing;
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
      url.searchParams.set('login', 'true');
      window.history.replaceState({}, '', url.toString());
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
      {/* Primary Domain View */}
      <div style={{ flex: 1 }}>
        {renderActivePortal()}
      </div>
    </div>
  );
}
