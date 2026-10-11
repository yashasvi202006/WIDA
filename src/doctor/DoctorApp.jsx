import React, { useState, useCallback, useEffect } from "react";
import "./doctor.css";
import { doctorApi } from "./services/doctorApi.js";
// Components
import { Sidebar } from "./components/Sidebar.jsx";
import { TopNav } from "./components/TopNav.jsx";
// Pages
import { DoctorLogin } from "./pages/DoctorLogin.jsx";
import { DoctorRegister } from "./pages/DoctorRegister.jsx";
import { DoctorDashboard } from "./pages/DoctorDashboard.jsx";
import { DoctorProfile } from "./pages/DoctorProfile.jsx";
import { AppointmentsPage } from "./pages/AppointmentsPage.jsx";
import { PatientsPage } from "./pages/PatientsPage.jsx";
import { ConsultationPage } from "./pages/ConsultationPage.jsx";
import { PrescriptionPage } from "./pages/PrescriptionPage.jsx";
import { DiagnosticTestPage } from "./pages/DiagnosticTestPage.jsx";
import { MedicalReportsPage } from "./pages/MedicalReportsPage.jsx";
import { AvailabilityPage } from "./pages/AvailabilityPage.jsx";
import { RatingsPage } from "./pages/RatingsPage.jsx";
import { NotificationsPage } from "./pages/NotificationsPage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";
export const DoctorApp = ({ onLogout, initialSection = "dashboard" }) => {
    const [currentDoctor, setCurrentDoctor] = useState(() => {
        try {
            const raw = localStorage.getItem('wida_ecosystem_user');
            if (raw) {
                const u = JSON.parse(raw);
                if (u.role === 'doctor') {
                    const match = doctorApi.getAllDoctors().find(d => d.email?.toLowerCase() === u.email?.toLowerCase() || d.id === (u.doctorId || u.id));
                    if (match) {
                        return {
                            ...match,
                            medicalRegistrationNumber: u.medicalRegistrationNumber || match.medicalRegistrationNumber,
                            fullName: u.fullName || u.name || match.fullName,
                        };
                    }
                    return {
                        id: u.doctorId || u.id || Date.now(),
                        fullName: u.fullName || u.name || 'Dr. Registered Practitioner',
                        email: u.email,
                        medicalRegistrationNumber: u.medicalRegistrationNumber || u.registeredId || `MCI-784912`,
                        specializationName: u.specialization || u.specializationName || 'Clinical Specialist',
                        hospitalClinicName: u.hospitalClinicName || 'WIDA Apex Medical Center',
                        verificationStatus: 'VERIFIED',
                        averageRating: 5.0,
                        totalRatings: 1,
                        profilePhotoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
                    };
                }
            }
        } catch {}
        return doctorApi.getCurrentDoctor() || doctorApi.getAllDoctors()[0];
    });
    const [authState, setAuthState] = useState("app");
    const [activeSection, setActiveSection] = useState(initialSection || "dashboard");
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    // Cross-section navigation state
    const [prefillApt, setPrefillApt] = useState(null);
    const [prefillPatient, setPrefillPatient] = useState(null);
    const [prefillPrescriptionPatient, setPrefillPrescriptionPatient] = useState(null);
    const [prefillDiagnosticPatient, setPrefillDiagnosticPatient] = useState(null);
    const [, forceUpdate] = useState(0);

    // Ensure dashboard is always active upon login or portal switch
    useEffect(() => {
        setActiveSection(initialSection || "dashboard");
    }, [currentDoctor?.id, initialSection]);

    useEffect(() => {
        const handleGlobalPortalSwitch = (e) => {
            if (e.detail?.portal === 'doctor') {
                setActiveSection(e.detail?.section || "dashboard");
            }
        };
        window.addEventListener('wida:switch-portal', handleGlobalPortalSwitch);
        return () => window.removeEventListener('wida:switch-portal', handleGlobalPortalSwitch);
    }, []);

    const handleLoginSuccess = useCallback((doc) => {
        setCurrentDoctor(doc);
        setAuthState("app");
        setActiveSection("dashboard");
    }, []);
    const handleRegisterSuccess = useCallback((doc) => {
        setCurrentDoctor(doc);
        setAuthState("app");
        setActiveSection("dashboard");
    }, []);
    const handleLogout = useCallback(() => {
        if (onLogout) {
            onLogout();
            return;
        }
        setCurrentDoctor(null);
        setAuthState("login");
        setPrefillApt(null);
        setPrefillPatient(null);
    }, [onLogout]);
    const handleSwitchDoctor = useCallback((id) => {
        const doc = doctorApi.switchDoctor(id);
        setCurrentDoctor(doc);
        forceUpdate((n) => n + 1);
    }, []);
    const handleStartConsultationForAppointment = useCallback((apt) => {
        setPrefillApt(apt);
        setPrefillPatient(null);
        setActiveSection("consultations");
    }, []);
    const handleStartConsultationForPatient = useCallback((patient) => {
        setPrefillPatient(patient);
        setPrefillApt(null);
        setActiveSection("consultations");
    }, []);
    const handleOpenNewPrescription = useCallback(() => {
        setPrefillPrescriptionPatient(null);
        setActiveSection("prescriptions");
    }, []);
    const handleOpenNewTestRequest = useCallback(() => {
        setPrefillDiagnosticPatient(null);
        setActiveSection("diagnostic-tests");
    }, []);
    const handleMarkNotifications = useCallback(() => {
        forceUpdate((n) => n + 1);
    }, []);
    if (authState === "login") {
        return (<div className="doc-app">
        <DoctorLogin onLoginSuccess={handleLoginSuccess} onGoToRegister={() => setAuthState("register")}/>
      </div>);
    }
    if (authState === "register") {
        return (<div className="doc-app">
        <DoctorRegister onRegisterSuccess={handleRegisterSuccess} onGoToLogin={() => setAuthState("login")}/>
      </div>);
    }
    if (!currentDoctor)
        return null;
    const doctor = currentDoctor;
    const summary = doctorApi.getDashboardSummary(doctor.id);
    const allDoctors = doctorApi.getAllDoctors();
    const achievements = doctorApi.getAchievements(doctor.id);
    const unreadCount = summary.unreadNotificationsCount;
    const pendingCount = summary.pendingRequestsCount;
    const renderSection = () => {
        switch (activeSection) {
            case "dashboard":
                return (<DoctorDashboard doctor={doctor} summary={summary} onNavigate={setActiveSection} onAcceptAppointment={(id) => { doctorApi.updateAppointmentStatus(id, "ACCEPTED"); forceUpdate((n) => n + 1); }} onRejectAppointment={(id) => { doctorApi.updateAppointmentStatus(id, "REJECTED"); forceUpdate((n) => n + 1); }} onStartConsultationForAppointment={handleStartConsultationForAppointment} onOpenNewPrescription={handleOpenNewPrescription} onOpenNewTestRequest={handleOpenNewTestRequest}/>);
            case "appointments":
                return <AppointmentsPage doctorId={doctor.id} onStartConsultation={handleStartConsultationForAppointment}/>;
            case "patients":
                return <PatientsPage doctorId={doctor.id} onStartConsultationForPatient={handleStartConsultationForPatient}/>;
            case "consultations":
                return (<ConsultationPage doctorId={doctor.id} prefillAppointment={prefillApt} prefillPatient={prefillPatient} onClear={() => { setPrefillApt(null); setPrefillPatient(null); }}/>);
            case "prescriptions":
                return (<PrescriptionPage doctorId={doctor.id} prefillPatientId={prefillPrescriptionPatient?.id} prefillPatientName={prefillPrescriptionPatient?.name} onClear={() => setPrefillPrescriptionPatient(null)}/>);
            case "diagnostic-tests":
                return (<DiagnosticTestPage doctorId={doctor.id} prefillPatientId={prefillDiagnosticPatient?.id} prefillPatientName={prefillDiagnosticPatient?.name} onClear={() => setPrefillDiagnosticPatient(null)}/>);
            case "medical-reports":
                return <MedicalReportsPage doctorId={doctor.id}/>;
            case "availability":
                return <AvailabilityPage doctorId={doctor.id}/>;
            case "profile":
                return (<DoctorProfile doctor={doctor} achievements={achievements} onOpenEditProfile={() => setActiveSection("settings")} onOpenVerificationModal={() => setActiveSection("profile")}/>);
            case "ratings":
                return <RatingsPage doctor={doctor}/>;
            case "notifications":
                return <NotificationsPage doctorId={doctor.id} onMarkRead={handleMarkNotifications}/>;
            case "settings":
                return <SettingsPage doctor={doctor} onUpdate={(updated) => { setCurrentDoctor(updated); forceUpdate((n) => n + 1); }}/>;
            default:
                return (<div style={{ padding: 40, textAlign: "center", color: "var(--doc-text-muted)" }}>
            <div style={{ fontSize: 40 }}>🚧</div>
            <p>Section under construction. Coming soon.</p>
          </div>);
        }
    };
    return (<div className="doc-app">
      <div className="doc-layout">
        <Sidebar activeSection={activeSection} onSelectSection={(s) => { setActiveSection(s); setIsMobileOpen(false); }} pendingAppointmentsCount={pendingCount} unreadNotificationsCount={unreadCount} onLogout={handleLogout} isMobileOpen={isMobileOpen}/>
        <div className="doc-main">
          {activeSection !== "dashboard" && (
            <TopNav doctor={doctor} allDoctors={allDoctors} onSwitchDoctor={handleSwitchDoctor} unreadCount={unreadCount} onOpenNotifications={() => setActiveSection("notifications")} onOpenProfile={() => setActiveSection("profile")} onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}/>
          )}
          <div className={`doc-content ${activeSection === 'dashboard' ? 'doc-content-dashboard' : ''}`}>
            {renderSection()}
          </div>
        </div>
      </div>
    </div>);
};
export default DoctorApp;
