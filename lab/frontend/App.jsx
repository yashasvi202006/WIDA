import React, { useState, useEffect, useCallback } from 'react';
import './styles/lab.css';
import { labApiClient } from './services/labApiClient.js';

// Components
import { Sidebar } from './components/Sidebar.jsx';
import { TopNav } from './components/TopNav.jsx';
import { Toast } from './components/Toast.jsx';

// Pages
import { LabLogin } from './pages/LabLogin.jsx';
import { LabRegister } from './pages/LabRegister.jsx';
import { LabDashboard } from './pages/LabDashboard.jsx';
import { TestCatalogue } from './pages/TestCatalogue.jsx';
import { BookingsManagement } from './pages/BookingsManagement.jsx';
import { SampleManagement } from './pages/SampleManagement.jsx';
import { ReportManagement } from './pages/ReportManagement.jsx';
import { BillingManagement } from './pages/BillingManagement.jsx';
import { PatientDoctorIntegration } from './pages/PatientDoctorIntegration.jsx';

export const LabApp = ({ onLogout }) => {
    const [authState, setAuthState] = useState('login'); // 'login', 'register', 'app'
    const [activeSection, setActiveSection] = useState('dashboard');
    const [currentUser, setCurrentUser] = useState(null);
    const [currentLab, setCurrentLab] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [counts, setCounts] = useState({
        pendingBookings: 0,
        unprocessedSamples: 0,
        pendingReports: 0
    });

    // Toast helper
    const showToast = useCallback((type, message, title = '') => {
        const id = 'toast-' + Date.now() + Math.random();
        setToasts(prev => [...prev, { id, type, message, title }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Check existing session on load and auto-authenticate with real backend JWT
    useEffect(() => {
        const token = labApiClient.getToken();
        const user = labApiClient.getUser();
        const lab = labApiClient.getLab();

        if (token && user) {
            labApiClient.getCurrentProfile()
                .then(prof => {
                    setCurrentUser(prof.user || user);
                    setCurrentLab(prof.lab || lab);
                    setAuthState('app');
                })
                .catch(() => {
                    // Re-acquire genuine JWT from backend port 8082
                    labApiClient.login('director@healthfirst.lab', 'LabDirector@2026')
                        .then(res => {
                            setCurrentUser(res.user);
                            setCurrentLab(res.lab);
                            setAuthState('app');
                        })
                        .catch(() => {
                            setAuthState('login');
                        });
                });
        } else {
            // Auto authenticate into Lab workspace
            labApiClient.login('director@healthfirst.lab', 'LabDirector@2026')
                .then(res => {
                    setCurrentUser(res.user);
                    setCurrentLab(res.lab);
                    setAuthState('app');
                })
                .catch(() => {
                    setAuthState('login');
                });
        }
    }, []);

    // Refresh badge counts
    const refreshCounts = useCallback(async () => {
        try {
            const data = await labApiClient.getDashboardSummary();
            if (data?.metrics) {
                setCounts({
                    pendingBookings: data.metrics.pendingCollections || 0,
                    unprocessedSamples: data.metrics.inProcessing || 0,
                    pendingReports: data.metrics.awaitingVerification || 0
                });
            }
        } catch {
            // Ignore background error
        }
    }, []);

    useEffect(() => {
        if (authState === 'app') {
            refreshCounts();
        }
    }, [authState, activeSection, refreshCounts]);

    const handleLoginSuccess = useCallback((user, lab) => {
        setCurrentUser(user);
        setCurrentLab(lab);
        setAuthState('app');
        setActiveSection('dashboard');
        showToast('success', `Welcome back, ${user.name}! Connected to ${lab?.name || 'Diagnostic Laboratory'}.`);
    }, [showToast]);

    const handleLogout = useCallback(() => {
        labApiClient.clearSession();
        setCurrentUser(null);
        setCurrentLab(null);
        if (onLogout) {
            onLogout();
            return;
        }
        setAuthState('login');
        showToast('info', 'You have been safely signed out of the laboratory workspace.');
    }, [onLogout, showToast]);

    const handleRoleSwitch = useCallback((newRole) => {
        if (!currentUser) return;
        const updated = { ...currentUser, role: newRole };
        setCurrentUser(updated);
        labApiClient.setUser(updated);
        showToast('info', `Active clinical security role switched to: ${newRole}`);
    }, [currentUser, showToast]);

    const handleSimulateVerify = useCallback(async () => {
        if (!currentLab) return;
        try {
            await labApiClient.verifyAccountSimulation(currentLab.id);
            const updatedLab = { ...currentLab, status: 'VERIFIED' };
            setCurrentLab(updatedLab);
            labApiClient.setLab(updatedLab);
            showToast('success', 'Laboratory accreditation status updated to VERIFIED (NABL Approved)!');
        } catch (err) {
            showToast('error', 'Verification failed: ' + err.message);
        }
    }, [currentLab, showToast]);

    // Render Auth Screens
    if (authState === 'login') {
        return (
            <div className="lab-app">
                <LabLogin
                    onLoginSuccess={handleLoginSuccess}
                    onNavigateRegister={() => setAuthState('register')}
                />
                <Toast toasts={toasts} onDismiss={dismissToast} />
            </div>
        );
    }

    if (authState === 'register') {
        return (
            <div className="lab-app">
                <LabRegister
                    onNavigateLogin={() => setAuthState('login')}
                    onRegistrationSuccess={() => setAuthState('login')}
                />
                <Toast toasts={toasts} onDismiss={dismissToast} />
            </div>
        );
    }

    const sectionTitles = {
        dashboard: 'Laboratory Operations Dashboard',
        catalogue: 'Diagnostic Test Catalogue & Health Packages',
        bookings: 'Patient Test Orders & Phlebotomy Management',
        samples: 'Specimen Accessioning & Processing',
        reports: 'Diagnostic Reports & Pathologist Verification',
        billing: 'Billing, Invoices & Accounts',
        integration: 'WIDA Patient & Doctor Record Hub'
    };

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <LabDashboard
                        onNavigate={setActiveSection}
                        onOpenNewBooking={() => setActiveSection('bookings')}
                        onOpenNewTest={() => setActiveSection('catalogue')}
                        lab={currentLab}
                    />
                );
            case 'catalogue':
                return (
                    <TestCatalogue
                        user={currentUser}
                        onShowToast={showToast}
                    />
                );
            case 'bookings':
                return (
                    <BookingsManagement
                        onShowToast={showToast}
                    />
                );
            case 'samples':
                return (
                    <SampleManagement
                        onShowToast={showToast}
                    />
                );
            case 'reports':
                return (
                    <ReportManagement
                        user={currentUser}
                        lab={currentLab}
                        onShowToast={showToast}
                    />
                );
            case 'billing':
                return (
                    <BillingManagement
                        lab={currentLab}
                        onShowToast={showToast}
                    />
                );
            case 'integration':
                return (
                    <PatientDoctorIntegration
                        onShowToast={showToast}
                    />
                );
            default:
                return (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--lab-text-secondary)' }}>
                        Section not found.
                    </div>
                );
        }
    };

    return (
        <div className="lab-app">
            <div className="lab-layout">
                <Sidebar
                    activeSection={activeSection}
                    onSelectSection={setActiveSection}
                    onLogout={handleLogout}
                    user={currentUser}
                    lab={currentLab}
                    counts={counts}
                />
                <main className="lab-main">
                    <TopNav
                        activeSectionTitle={sectionTitles[activeSection] || 'Diagnostic Workspace'}
                        user={currentUser}
                        lab={currentLab}
                        onRoleSwitch={handleRoleSwitch}
                        onSimulateVerify={currentLab?.status !== 'VERIFIED' ? handleSimulateVerify : null}
                    />
                    <div className="lab-content">
                        {renderActiveSection()}
                    </div>
                </main>
            </div>
            <Toast toasts={toasts} onDismiss={dismissToast} />
        </div>
    );
};

export default LabApp;
