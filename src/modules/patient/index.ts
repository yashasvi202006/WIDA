// WIDA Patient Module - Public API Entry Point
// Total isolation: export all pages, components, services, and the unified PatientModule

export { PatientModule } from './PatientModule';

// Pages
export { PatientDashboard } from './pages/PatientDashboard';
export { PatientAppointments } from './pages/PatientAppointments';
export { PatientDoctors } from './pages/PatientDoctors';
export { PatientHealthRecords } from './pages/PatientHealthRecords';
export { PatientPrescriptions } from './pages/PatientPrescriptions';
export { PatientDiagnostics } from './pages/PatientDiagnostics';
export { PatientPharmacy } from './pages/PatientPharmacy';
export { PatientWellness } from './pages/PatientWellness';
export { PatientEmergency } from './pages/PatientEmergency';
export { PatientNotifications } from './pages/PatientNotifications';
export { PatientReminders } from './pages/PatientReminders';
export { PatientProfile } from './pages/PatientProfile';
export { PatientPrivacy } from './pages/PatientPrivacy';
export { PatientSettings } from './pages/PatientSettings';
export { PatientAICare } from './pages/PatientAICare';
export { PatientMessages } from './pages/PatientMessages';
export { PatientGovernmentSchemes } from './pages/PatientGovernmentSchemes';
export { PatientAlternativeMedicine } from './pages/PatientAlternativeMedicine';
export { PatientMedicalVault } from './pages/PatientMedicalVault';
export { PatientLogin } from './pages/PatientLogin';
export { PatientRegister } from './pages/PatientRegister';

// Reusable Components
export { PatientSidebar } from './components/PatientSidebar';
export { PatientTopbar } from './components/PatientTopbar';
export { HealthMetricCard } from './components/HealthMetricCard';
export { AppointmentCard } from './components/AppointmentCard';
export { AppointmentBookingModal } from './components/AppointmentBookingModal';
export { ReminderWidget } from './components/ReminderWidget';
export { CareJourney } from './components/CareJourney';
export { HealthTimeline } from './components/HealthTimeline';
export { PrescriptionCard } from './components/PrescriptionCard';
export { DoctorCard } from './components/DoctorCard';
export { DiagnosticCard } from './components/DiagnosticCard';
export { LabReportCard } from './components/LabReportCard';
export { PharmacyOrderCard } from './components/PharmacyOrderCard';
export { EmergencySosCard } from './components/EmergencySosCard';
export { WellnessWidget } from './components/WellnessWidget';
export { NotificationBell } from './components/NotificationBell';
export { NotificationDropdown } from './components/NotificationDropdown';
export { NotificationToast } from './components/NotificationToast';
export { AICareModal } from './components/AICareModal';
export { DiagnosisHistorySection } from './components/DiagnosisHistorySection';
export { UpcomingAppointmentsWidget } from './components/UpcomingAppointmentsWidget';
export { AICareWidget } from './components/AICareWidget';
export { TelehealthRoomModal } from './components/TelehealthRoomModal';
export { DiagnosticScanModal } from './components/DiagnosticScanModal';
export { MSWDiagnosticsModal } from './components/MSWDiagnosticsModal';

// Services
export { patientNotificationService } from './services/patientNotificationService';
export { patientReminderService } from './services/patientReminderService';
export { patientLocalStorageService } from './services/patientLocalStorageService';
export { patientApiClient } from './services/patientApiClient';
export { patientApiService } from './services/patientApiService';

// Hooks
export { usePatientNotifications } from './hooks/usePatientNotifications';
export { usePatientReminders } from './hooks/usePatientReminders';

// Types
export type * from './types/patientTypes';
