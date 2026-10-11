import React, { useState, useEffect } from 'react';
import './styles/patient.css';
// Services
import { patientLocalStorageService } from './services/patientLocalStorageService';
import { patientApiService } from './services/patientApiService';
import { widaBridge } from '../../services/widaEcosystemBridge';
// Hooks
import { usePatientNotifications } from './hooks/usePatientNotifications';
import { usePatientReminders } from './hooks/usePatientReminders';
// Static / Mock Data
import { PATIENT_MOCK_DOCTORS, PATIENT_MOCK_TESTS, PATIENT_MOCK_LABS, PATIENT_MOCK_REPORTS, PATIENT_MOCK_WELLNESS_METRICS, PATIENT_MOCK_WEARABLE, PATIENT_MOCK_AUDIT_LOGS } from './data/patientMockData';
// Components
import { PatientSidebar } from './components/PatientSidebar';
import { PatientTopbar } from './components/PatientTopbar';
import { PatientMobileNav } from './components/PatientMobileNav';
import { AppointmentBookingModal } from './components/AppointmentBookingModal';
import { AICareModal } from './components/AICareModal';
import { MSWDiagnosticsModal } from './components/MSWDiagnosticsModal';
import { NotificationToast } from './components/NotificationToast';
import { MedicalReceiptModal } from './components/MedicalReceiptModal';
import { emailService } from '../../services/emailService';
import { doctorApi } from '../../doctor/services/doctorApi';
// Pages
import { PatientDashboard } from './pages/PatientDashboard';
import { PatientAppointments } from './pages/PatientAppointments';
import { PatientDoctors } from './pages/PatientDoctors';
import { PatientHealthRecords } from './pages/PatientHealthRecords';
import { PatientPrescriptions } from './pages/PatientPrescriptions';
import { PatientDiagnostics } from './pages/PatientDiagnostics';
import { PatientPharmacy } from './pages/PatientPharmacy';
import { PatientWellness } from './pages/PatientWellness';
import { PatientEmergency } from './pages/PatientEmergency';
import { PatientNotifications } from './pages/PatientNotifications';
import { PatientReminders } from './pages/PatientReminders';
import { PatientProfile as PatientProfilePage } from './pages/PatientProfile';
import { PatientPrivacy } from './pages/PatientPrivacy';
import { PatientSettings } from './pages/PatientSettings';
import { PatientAICare } from './pages/PatientAICare';
import { PatientMessages } from './pages/PatientMessages';
import { PatientGovernmentSchemes } from './pages/PatientGovernmentSchemes';
import { PatientAlternativeMedicine } from './pages/PatientAlternativeMedicine';
import { PatientMedicalVault } from './pages/PatientMedicalVault';
import { PatientLogin } from './pages/PatientLogin';
import { PatientRegister } from './pages/PatientRegister';
export const PatientModule = ({ initialTab = 'dashboard', onLogout }) => {
    // Navigation & Shell State
    const [currentTab, setCurrentTab] = useState(initialTab);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return initialTab !== 'login' && initialTab !== 'register';
    });
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('wida_patient_theme') === 'dark';
    });
    // Modals & Toasts
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [preselectedDoctorId, setPreselectedDoctorId] = useState(undefined);
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [mswModalOpen, setMswModalOpen] = useState(false);
    const [receiptPrescription, setReceiptPrescription] = useState(null);
    const [toasts, setToasts] = useState([]);
    // Core Reactive Data Store
    const [profile, setProfile] = useState(() => patientLocalStorageService.getProfile());
    const [appointments, setAppointments] = useState(() => patientLocalStorageService.getAppointments());
    const [prescriptions, setPrescriptions] = useState(() => patientLocalStorageService.getPrescriptions());
    const [labBookings, setLabBookings] = useState(() => patientLocalStorageService.getLabBookings());
    const [pharmacyOrders, setPharmacyOrders] = useState(() => patientLocalStorageService.getPharmacyOrders());
    const [careJourney, setCareJourney] = useState(() => patientLocalStorageService.getCareJourney());
    const [permissions, setPermissions] = useState(() => patientLocalStorageService.getConsentPermissions());
    const [emergencyRequest, setEmergencyRequest] = useState(null);
    // Load initial reactive collections from MSW REST API
    const loadApiData = async () => {
        try {
            const [prof, apts, rxs, labs, orders, journey, consent, emerg] = await Promise.all([
                patientApiService.getProfile(),
                patientApiService.getAppointments(),
                patientApiService.getPrescriptions(),
                patientApiService.getLabBookings(),
                patientApiService.getPharmacyOrders(),
                patientApiService.getCareJourney(),
                patientApiService.getConsentPermissions(),
                patientApiService.getActiveEmergency()
            ]);
            setProfile(prof);
            setAppointments(apts);
            setPrescriptions(rxs);
            setLabBookings(labs);
            setPharmacyOrders(orders);
            setCareJourney(journey);
            setPermissions(consent);
            setEmergencyRequest(emerg || null);
        }
        catch (err) {
            console.warn('[MSW API] Fallback to cache during initial load:', err);
        }
    };
    useEffect(() => {
        loadApiData();
    }, []);

    // Real-time Ecosystem Event Listeners (Doctor Acceptance, Prescription Issued, Email Dispatch)
    useEffect(() => {
        const handleAppointmentAccepted = (e) => {
            const { appointmentId, doctor, appointment } = e.detail || {};
            setAppointments(prev => prev.map(a => 
                (a.id === appointmentId || a.id === String(appointmentId) || (appointment?.id && a.id === appointment.id)) 
                    ? { ...a, status: 'Confirmed' } 
                    : a
            ));
            refreshNotifications();
            refreshReminders();
            const docName = doctor?.fullName ? `Dr. ${doctor.fullName}` : 'Your doctor';
            addToast('success', 'Appointment Confirmed!', `${docName} accepted your appointment request.`);
        };

        const handlePrescriptionCreated = (e) => {
            const { prescription } = e.detail || {};
            if (prescription) {
                setPrescriptions(prev => [prescription, ...prev.filter(p => p.id !== prescription.id)]);
                refreshNotifications();
                addToast('info', 'New Digital Prescription Ready', `Dr. ${prescription.doctorName || 'Doctor'} issued a digital prescription & online medical bill.`);
            }
        };

        const handleAppointmentStatusUpdated = (e) => {
            const { id, status } = e.detail || {};
            setAppointments(prev => prev.map(a => 
                (a.id === id || a.id === String(id)) 
                    ? { ...a, status: status === 'ACCEPTED' ? 'Confirmed' : status } 
                    : a
            ));
            refreshNotifications();
        };

        window.addEventListener('wida:appointment-accepted', handleAppointmentAccepted);
        window.addEventListener('wida:prescription-created', handlePrescriptionCreated);
        window.addEventListener('wida:appointment-status-updated', handleAppointmentStatusUpdated);

        return () => {
            window.removeEventListener('wida:appointment-accepted', handleAppointmentAccepted);
            window.removeEventListener('wida:prescription-created', handlePrescriptionCreated);
            window.removeEventListener('wida:appointment-status-updated', handleAppointmentStatusUpdated);
        };
    }, []);

    // Notifications & Reminders Hooks
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, refresh: refreshNotifications } = usePatientNotifications();
    const { reminders, updateStatus: updateReminderStatus, addReminder, deleteReminder, refresh: refreshReminders } = usePatientReminders();
    // Dark Mode Side-effect
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('patient-dark-theme');
            localStorage.setItem('wida_patient_theme', 'dark');
        }
        else {
            document.body.classList.remove('patient-dark-theme');
            localStorage.setItem('wida_patient_theme', 'light');
        }
    }, [darkMode]);
    // Toast Helper
    const addToast = (type, title, message) => {
        const id = `toast-${Date.now()}`;
        setToasts((prev) => [...prev, { id, type, title, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4500);
    };
    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };
    // Handlers
    const handleBookAppointmentSuccess = async (data) => {
        const appointmentData = {
            ...data,
            status: 'Pending'
        };

        let createdApt = null;
        try {
            createdApt = await patientApiService.bookAppointment(appointmentData);
            setAppointments((prev) => [createdApt, ...prev.filter(a => a.id !== createdApt.id)]);
            const journey = await patientApiService.getCareJourney();
            setCareJourney(journey);
        }
        catch {
            createdApt = patientLocalStorageService.bookAppointment(appointmentData);
            setAppointments(patientLocalStorageService.getAppointments());
            setCareJourney(patientLocalStorageService.getCareJourney());
        }

        const aptPayload = {
            ...appointmentData,
            id: createdApt?.id || `apt-${Date.now()}`,
            patientName: profile?.name || 'Yashasvi Saini',
            patientPhone: profile?.phone || '+91 98765 43210',
            patientAge: profile?.age || 24,
            patientGender: profile?.gender || 'Male'
        };

        // Cross-module bridge sync
        widaBridge.bookAppointment(aptPayload);

        // Notify Doctor in Doctor Module Store
        const targetDoctorId = data.doctorId || 'doc-1';
        doctorApi.addNotification(targetDoctorId, {
            title: 'New Appointment Request',
            message: `${aptPayload.patientName} requested an appointment for ${data.date} at ${data.time} (${data.type || 'Consultation'}).`,
            type: 'APPOINTMENT_REQUEST',
            urgent: false,
            referenceId: aptPayload.id,
            actionUrl: '/appointments'
        });

        // Send Email Alert to Doctor
        const allDocs = widaBridge.getDoctors();
        const docObj = allDocs.find(d => String(d.id) === String(targetDoctorId));
        emailService.notifyDoctorNewAppointment({
            doctor: {
                id: targetDoctorId,
                name: data.doctorName || docObj?.name || 'Doctor',
                email: docObj?.email || 'dr.aarav@wida.health'
            },
            patient: {
                id: profile?.id || 'pat-1',
                name: aptPayload.patientName,
                email: profile?.email || 'patient@wida.health',
                phone: aptPayload.patientPhone
            },
            appointment: aptPayload
        });

        refreshNotifications();
        refreshReminders();
        addToast('success', 'Appointment Request Sent', `Request submitted to ${data.doctorName} for ${data.date} at ${data.time}. Pending doctor confirmation.`);
    };
    const handleCancelAppointment = async (id) => {
        try {
            const updated = await patientApiService.cancelAppointment(id);
            setAppointments((prev) => prev.map(a => a.id === id ? updated : a));
        }
        catch {
            const updated = patientLocalStorageService.cancelAppointment(id);
            setAppointments(updated);
        }
        widaBridge.updateAppointmentStatus(id, 'CANCELLED');
        setCareJourney(patientLocalStorageService.getCareJourney());
        refreshNotifications();
        addToast('warning', 'Appointment Cancelled', 'Your appointment has been cancelled.');
    };
    const handleOrderPrescription = async (rxId) => {
        try {
            const res = await patientApiService.orderPrescription(rxId);
            setPrescriptions((prev) => prev.map(p => p.id === rxId ? res.prescription : p));
            setPharmacyOrders(res.orders);
        }
        catch {
            const updated = patientLocalStorageService.orderPrescriptionToPharmacy(rxId);
            setPrescriptions(updated);
            setPharmacyOrders(patientLocalStorageService.getPharmacyOrders());
        }
        widaBridge.createPharmacyOrder({
            prescriptionId: rxId,
            patientName: profile?.name || 'Yashasvi Saini',
            patientPhone: profile?.phone || '+91 98765 43210',
            medicines: prescriptions.find(p => p.id === rxId)?.medicines || []
        });
        refreshNotifications();
        addToast('success', 'Pharmacy Order Submitted', `Rx #${rxId.toUpperCase()} forwarded to HealthPlus Pharmacy.`);
    };
    const handleBookLabTest = async (bookingData) => {
        try {
            const booking = await patientApiService.bookLabTest(bookingData);
            setLabBookings((prev) => [booking, ...prev]);
        }
        catch {
            patientLocalStorageService.bookLabTest(bookingData);
            setLabBookings(patientLocalStorageService.getLabBookings());
        }
        widaBridge.bookLabTest({
            ...bookingData,
            patientName: profile?.name || 'Yashasvi Saini',
            patientPhone: profile?.phone || '+91 98765 43210'
        });
        setCareJourney(patientLocalStorageService.getCareJourney());
        refreshNotifications();
        refreshReminders();
        addToast('success', 'Lab Test Booked', `${bookingData.testName} scheduled for ${bookingData.date}.`);
    };
    const handleSimulateReportReady = async (bookingId) => {
        try {
            const updated = await patientApiService.simulateReportReady(bookingId);
            setLabBookings((prev) => prev.map(b => b.id === bookingId ? updated : b));
        }
        catch {
            const bookings = patientLocalStorageService.getLabBookings();
            const target = bookings.find((b) => b.id === bookingId);
            if (!target)
                return;
            const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status: 'Report Ready' } : b));
            localStorage.setItem('wida_patient_lab_bookings', JSON.stringify(updated));
            setLabBookings(updated);
        }
        refreshNotifications();
        addToast('info', 'Report Ready', `Certified report available.`);
    };
    const handleRequestEmergency = async (location) => {
        try {
            const req = await patientApiService.triggerEmergencySos(location);
            setEmergencyRequest(req);
        }
        catch {
            const req = {
                id: `sos-${Date.now()}`,
                patientId: profile.id,
                timestamp: 'Just now',
                location,
                status: 'Alert Sent',
                hospitalName: 'Max Super Speciality Trauma Emergency',
                ambulanceNumber: 'DL-01-AMB-9488',
                etaMinutes: 7,
                paramedicContact: '+91 99999 11223',
                criticalDetailsShared: {
                    bloodGroup: profile.bloodGroup,
                    allergies: profile.allergies,
                    chronicConditions: profile.chronicConditions,
                    emergencyContact: `${profile.emergencyContact.name} (${profile.emergencyContact.phone})`
                }
            };
            setEmergencyRequest(req);
        }
        refreshNotifications();
        addToast('danger', 'EMERGENCY ALERT SENT', 'Paramedic response team notified. Telemetry active.');
    };
    const handleAdvanceEmergencyStatus = async (id, nextStatus) => {
        try {
            const updated = await patientApiService.updateEmergencyStatus(id, nextStatus);
            setEmergencyRequest(updated);
        }
        catch {
            if (emergencyRequest && emergencyRequest.id === id) {
                setEmergencyRequest({ ...emergencyRequest, status: nextStatus });
            }
        }
        refreshNotifications();
        addToast('info', 'Emergency Status Updated', `Status: ${nextStatus}`);
    };
    const handleDeactivateEmergency = async (id) => {
        try {
            await patientApiService.deactivateEmergency(id);
            setEmergencyRequest(null);
        }
        catch {
            setEmergencyRequest(null);
        }
        refreshNotifications();
        addToast('warning', 'EMERGENCY SOS DEACTIVATED', 'Emergency dispatch stood down and alert cancelled.');
    };
    const handleToggleConsent = async (permId) => {
        try {
            const updated = await patientApiService.toggleConsent(permId);
            setPermissions((prev) => prev.map(p => p.id === permId ? updated : p));
        }
        catch {
            const updated = patientLocalStorageService.toggleConsent(permId);
            setPermissions(updated);
        }
        refreshNotifications();
        addToast('info', 'Consent Updated', 'Provider access permission has been modified.');
    };
    const handleUpdateProfile = async (updates) => {
        try {
            const updated = await patientApiService.updateProfile(updates);
            setProfile(updated);
        }
        catch {
            const updated = patientLocalStorageService.updateProfile(updates);
            setProfile(updated);
        }
        addToast('success', 'Profile Updated', 'Patient demographic details successfully saved.');
    };
    const handleLogout = async () => {
        try {
            await patientApiService.logout();
        }
        catch {
            // Ignored
        }
        if (onLogout) {
            onLogout();
            return;
        }
        setIsAuthenticated(false);
        setCurrentTab('login');
        addToast('info', 'Signed Out', 'You have been safely signed out from your WIDA account.');
    };
    // Dedicated Register Screen (Checked before login so unauthenticated users can access registration)
    if (currentTab === 'register') {
        return (<div id="patient-module" className="patient-shell" style={{ width: '100%', minHeight: '100vh', display: 'block' }}>
        <PatientRegister onRegisterSuccess={(newProf) => {
                patientLocalStorageService.updateProfile(newProf);
                setProfile(newProf);
                setIsAuthenticated(true);
                setCurrentTab('dashboard');
                addToast('success', 'ABHA Created & Verified', `Welcome to WIDA, ${newProf.name}! Your ABHA ID is ${newProf.abhaId}`);
            }} onNavigateLogin={() => {
                setIsAuthenticated(false);
                setCurrentTab('login');
            }}/>
        <NotificationToast toasts={toasts} onDismiss={removeToast}/>
      </div>);
    }
    // Dedicated Login Screen
    if (!isAuthenticated || currentTab === 'login') {
        return (<div id="patient-module" className="patient-shell" style={{ width: '100%', minHeight: '100vh', display: 'block' }}>
        <PatientLogin onLoginSuccess={(loggedInProfile) => {
                if (loggedInProfile)
                    setProfile(loggedInProfile);
                setIsAuthenticated(true);
                setCurrentTab('dashboard');
                addToast('success', 'Welcome to WIDA', `Signed in as ${loggedInProfile?.name || profile.name}.`);
            }} onNavigateRegister={() => {
                setIsAuthenticated(false);
                setCurrentTab('register');
            }}/>
        <NotificationToast toasts={toasts} onDismiss={removeToast}/>
      </div>);
    }
    return (<div className={`patient-shell ${darkMode ? 'patient-dark-theme' : ''}`} id="patient-module">
      {/* Sidebar Navigation */}
      <PatientSidebar currentTab={currentTab} onSelectTab={setCurrentTab} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} patient={profile} mobileOpen={mobileDrawerOpen} onCloseMobile={() => setMobileDrawerOpen(false)} onLogout={handleLogout}/>

      {/* Main Container */}
      <div className={`patient-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Topbar */}
        <PatientTopbar currentTab={currentTab} onSelectTab={setCurrentTab} onToggleMobileMenu={() => setMobileDrawerOpen(!mobileDrawerOpen)} notifications={notifications} unreadCount={unreadCount} onMarkAsRead={markAsRead} onMarkAllAsRead={markAllAsRead} patient={profile} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} onOpenAIChat={() => setAiModalOpen(true)} onOpenMSWConsole={() => setMswModalOpen(true)} onLogout={handleLogout}/>

        {/* Page Content Body */}
        <main className="patient-content" role="main">
          {currentTab === 'dashboard' && (<PatientDashboard patient={profile} metrics={PATIENT_MOCK_WELLNESS_METRICS} appointments={appointments} reminders={reminders} careJourney={careJourney} prescriptions={prescriptions} wearable={[PATIENT_MOCK_WEARABLE]} notifications={notifications} onNavigateTab={setCurrentTab} onOpenBooking={() => {
                setPreselectedDoctorId(undefined);
                setBookingModalOpen(true);
            }} onReminderStatusChange={updateReminderStatus} onCancelAppointment={handleCancelAppointment} onOrderPrescription={handleOrderPrescription} onOpenAIChat={() => setAiModalOpen(true)}/>)}

          {currentTab === 'appointments' && (<PatientAppointments appointments={appointments} onOpenBooking={() => {
                setPreselectedDoctorId(undefined);
                setBookingModalOpen(true);
            }} onCancelAppointment={handleCancelAppointment}/>)}

          {currentTab === 'doctors' && (<PatientDoctors doctors={widaBridge.getDoctors()} onBookDoctor={(doc) => {
                setPreselectedDoctorId(doc.id);
                setBookingModalOpen(true);
            }}/>)}

          {currentTab === 'records' && (<PatientHealthRecords records={patientLocalStorageService.getCareJourney() ? patientLocalStorageService.getCareJourney().map((s) => ({
                id: s.id,
                category: 'Consultation',
                title: s.title,
                date: s.date.split(',')[0],
                time: s.date.split(',')[1] || '10:30 AM',
                provider: s.provider,
                summary: s.details || s.subtitle,
                verified: true,
                badgeType: 'doctor'
            })) : []} careJourney={careJourney} onSelectStep={(step) => {
                if (step.routeLink)
                    setCurrentTab(step.routeLink);
            }}/>)}

          {currentTab === 'prescriptions' && (<PatientPrescriptions prescriptions={prescriptions} onOrderToPharmacy={handleOrderPrescription} onViewReceipt={(rx) => setReceiptPrescription(rx)}/>)}

          {currentTab === 'diagnostics' && (<PatientDiagnostics tests={PATIENT_MOCK_TESTS} labs={PATIENT_MOCK_LABS} reports={PATIENT_MOCK_REPORTS} bookings={labBookings} onBookTest={handleBookLabTest} onSimulateReportReady={handleSimulateReportReady}/>)}

          {currentTab === 'pharmacy' && (<PatientPharmacy orders={pharmacyOrders} prescriptions={prescriptions} onOrderPrescription={handleOrderPrescription}/>)}

          {currentTab === 'wellness' && (<PatientWellness wearable={PATIENT_MOCK_WEARABLE} metrics={PATIENT_MOCK_WELLNESS_METRICS}/>)}

          {currentTab === 'emergency' && (<PatientEmergency patient={profile} onRequestEmergency={handleRequestEmergency} activeRequest={emergencyRequest} onAdvanceStatus={handleAdvanceEmergencyStatus} onDeactivateEmergency={handleDeactivateEmergency}/>)}

          {currentTab === 'notifications' && (<PatientNotifications notifications={notifications} onMarkAsRead={markAsRead} onMarkAllAsRead={markAllAsRead} onDeleteNotification={deleteNotification} onNavigateTab={setCurrentTab}/>)}

          {currentTab === 'reminders' && (<PatientReminders reminders={reminders} onUpdateStatus={updateReminderStatus} onAddReminder={addReminder} onDeleteReminder={deleteReminder}/>)}

          {currentTab === 'profile' && (<PatientProfilePage profile={profile} onUpdateProfile={handleUpdateProfile}/>)}

          {currentTab === 'privacy' && (<PatientPrivacy permissions={permissions} auditLogs={PATIENT_MOCK_AUDIT_LOGS} onToggleConsent={handleToggleConsent}/>)}

          {currentTab === 'settings' && (<PatientSettings darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} onNavigateTab={setCurrentTab}/>)}

          {currentTab === 'ai-care' && <PatientAICare />}

          {currentTab === 'messages' && <PatientMessages />}

          {currentTab === 'government' && <PatientGovernmentSchemes />}

          {currentTab === 'alternative' && (<PatientAlternativeMedicine onBookDoctor={(doc) => {
                setPreselectedDoctorId(doc.id);
                setBookingModalOpen(true);
            }}/>)}

          {currentTab === 'vault' && <PatientMedicalVault />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <PatientMobileNav currentTab={currentTab} onSelectTab={setCurrentTab} onToggleMobileDrawer={() => setMobileDrawerOpen(true)}/>

      {/* Interactive Modals */}
      <AppointmentBookingModal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} onBookSuccess={handleBookAppointmentSuccess} preselectedDoctorId={preselectedDoctorId}/>

      <AICareModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)}/>

      <MSWDiagnosticsModal isOpen={mswModalOpen} onClose={() => setMswModalOpen(false)} onDataReset={loadApiData}/>

      {/* Printable Digital Prescription & Medical Bill Receipt Modal */}
      <MedicalReceiptModal isOpen={!!receiptPrescription} onClose={() => setReceiptPrescription(null)} prescription={receiptPrescription} patient={profile} onOrderToPharmacy={handleOrderPrescription}/>

      {/* Floating Real-time Notifications */}
      <NotificationToast toasts={toasts} onDismiss={removeToast}/>
    </div>);
};
