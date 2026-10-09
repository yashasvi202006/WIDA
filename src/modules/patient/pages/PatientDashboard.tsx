import React from 'react';
import type {
  PatientProfile,
  PatientAppointment,
  PatientReminder,
  PatientCareJourneyStep,
  PatientPrescription,
  PatientWellnessMetric,
  PatientWearable,
  PatientNotification
} from '../types/patientTypes';
import { HealthMetricCard } from '../components/HealthMetricCard';
import { CareJourney } from '../components/CareJourney';
import { ReminderWidget } from '../components/ReminderWidget';
import { PrescriptionCard } from '../components/PrescriptionCard';
import { WellnessWidget } from '../components/WellnessWidget';
import { DiagnosisHistorySection } from '../components/DiagnosisHistorySection';
import { UpcomingAppointmentsWidget } from '../components/UpcomingAppointmentsWidget';
import { AICareWidget } from '../components/AICareWidget';
import {
  Calendar,
  FlaskConical,
  Pill,
  FileHeart,
  Activity,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface PatientDashboardProps {
  patient: PatientProfile;
  metrics: PatientWellnessMetric[];
  appointments: PatientAppointment[];
  reminders: PatientReminder[];
  careJourney: PatientCareJourneyStep[];
  prescriptions: PatientPrescription[];
  wearable: PatientWearable[];
  notifications: PatientNotification[];
  onNavigateTab: (tabId: string) => void;
  onOpenBooking: () => void;
  onReminderStatusChange: (id: string, newStatus: 'Taken' | 'Skipped' | 'Upcoming') => void;
  onCancelAppointment: (id: string) => void;
  onOrderPrescription: (id: string) => void;
  onOpenAIChat: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patient,
  metrics,
  reminders,
  careJourney,
  prescriptions,
  wearable,
  onNavigateTab,
  onOpenBooking,
  onReminderStatusChange,
  onOrderPrescription,
  onOpenAIChat
}) => {
  const activePrescriptions = prescriptions.filter((p) => p.status === 'Active').slice(0, 1);

  return (
    <div className="patient-dashboard d-flex flex-column gap-4">
      {/* Header Banner */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h2 className="font-heading mb-1" style={{ fontSize: '1.75rem' }}>
            Good Morning, {patient.name.split(' ')[0]} 👋
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.92rem' }}>
            Here is your integrated healthcare overview for today. Your vitals and continuity care loop are in sync.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="patient-badge patient-badge-teal py-2 px-3">
            <CheckCircle2 size={14} /> ABHA ID: {patient.abhaId}
          </span>
          <button className="patient-btn patient-btn-primary" onClick={onOpenBooking}>
            <Calendar size={15} /> Book Appointment
          </button>
        </div>
      </div>

      {/* Demo Health Data Notice */}
      <div
        className="p-2 px-3 rounded border"
        style={{
          backgroundColor: 'var(--p-surface-alt)',
          borderColor: 'var(--p-border-subtle)',
          fontSize: '0.78rem',
          color: 'var(--p-text-muted)'
        }}
      >
        <strong>Note:</strong> Displayed biometric values are prototype demo measurements for demonstration and academic evaluation. Real-time telemetry is simulated via connected wearable profiles.
      </div>

      {/* Quick Action Shortcuts */}
      <div className="row g-2">
        <div className="col-6 col-md-3 col-xl">
          <button
            className="patient-btn patient-btn-outline w-100 py-2 text-start justify-content-start"
            onClick={onOpenBooking}
          >
            <Calendar size={16} style={{ color: 'var(--p-primary)' }} />
            <span>Book Doctor</span>
          </button>
        </div>
        <div className="col-6 col-md-3 col-xl">
          <button
            className="patient-btn patient-btn-outline w-100 py-2 text-start justify-content-start"
            onClick={() => onNavigateTab('diagnostics')}
          >
            <FlaskConical size={16} style={{ color: '#0284C7' }} />
            <span>Book Lab Test</span>
          </button>
        </div>
        <div className="col-6 col-md-3 col-xl">
          <button
            className="patient-btn patient-btn-outline w-100 py-2 text-start justify-content-start"
            onClick={() => onNavigateTab('pharmacy')}
          >
            <Pill size={16} style={{ color: 'var(--p-success)' }} />
            <span>Order Medicine</span>
          </button>
        </div>
        <div className="col-6 col-md-3 col-xl">
          <button
            className="patient-btn patient-btn-outline w-100 py-2 text-start justify-content-start"
            onClick={() => onNavigateTab('records')}
          >
            <FileHeart size={16} style={{ color: 'var(--p-primary)' }} />
            <span>Health Journey</span>
          </button>
        </div>
        <div className="col-6 col-md-3 col-xl">
          <button
            className="patient-btn patient-btn-outline w-100 py-2 text-start justify-content-start"
            onClick={() => onNavigateTab('wellness')}
          >
            <Activity size={16} style={{ color: 'var(--p-purple)' }} />
            <span>Wellness</span>
          </button>
        </div>
        <div className="col-6 col-md-3 col-xl">
          <button
            className="patient-btn patient-btn-danger w-100 py-2 text-start justify-content-start"
            onClick={() => onNavigateTab('emergency')}
          >
            <AlertTriangle size={16} />
            <span>Emergency SOS</span>
          </button>
        </div>
      </div>

      {/* Health Summary Vitals Cards */}
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="font-heading mb-0" style={{ fontSize: '1.15rem' }}>
            Health Summary Vitals
          </h5>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            Biometrics synchronized
          </span>
        </div>
        <div className="row g-3">
          {metrics.map((m) => (
            <div key={m.id} className="col-6 col-md-4 col-xl-2">
              <HealthMetricCard metric={m} />
            </div>
          ))}
        </div>
      </div>

      {/* Connected Care Journey Highlight */}
      <CareJourney
        steps={careJourney}
        onStepClick={(s) => {
          if (s.routeLink) onNavigateTab(s.routeLink);
        }}
      />

      {/* Main Grid: Diagnosis History + Appointments & AI Care */}
      <div className="row g-4">
        {/* Left Column: History of Diagnosis with 3D Anatomical Model */}
        <div className="col-lg-7 col-xl-8 d-flex flex-column gap-4">
          <DiagnosisHistorySection />

          {/* Active Prescription Quick Card */}
          {activePrescriptions.length > 0 && (
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h5 className="font-heading mb-0" style={{ fontSize: '1.1rem' }}>
                  Active Prescriptions
                </h5>
                <button
                  className="patient-btn patient-btn-outline patient-btn-sm"
                  onClick={() => onNavigateTab('prescriptions')}
                >
                  View All Prescriptions →
                </button>
              </div>
              <PrescriptionCard
                prescription={activePrescriptions[0]}
                onOrderToPharmacy={onOrderPrescription}
              />
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Appointments Date Strip + AI Care + Reminders */}
        <div className="col-lg-5 col-xl-4 d-flex flex-column gap-4">
          {/* Upcoming Consultations with Weekday Date Picker & Telehealth Join */}
          <UpcomingAppointmentsWidget />

          {/* AI Care Interactive Assistant Widget */}
          <AICareWidget patient={patient} onOpenFullAIChat={onOpenAIChat} />

          {/* Today's Reminders Widget */}
          <ReminderWidget
            reminders={reminders}
            onStatusChange={onReminderStatusChange}
            onViewAll={() => onNavigateTab('reminders')}
          />

          {/* Personal Wellness Widget */}
          <WellnessWidget
            wearable={wearable[0]}
            onSync={() => alert('Fitbit Sense 2 Pro synchronized successfully.')}
          />
        </div>
      </div>
    </div>
  );
};
