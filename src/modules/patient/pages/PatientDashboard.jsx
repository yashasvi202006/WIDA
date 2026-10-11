import React from 'react';
import { HealthMetricCard } from '../components/HealthMetricCard';
import { CareJourney } from '../components/CareJourney';
import { ReminderWidget } from '../components/ReminderWidget';
import { PrescriptionCard } from '../components/PrescriptionCard';
import { WellnessWidget } from '../components/WellnessWidget';
import { DiagnosisHistorySection } from '../components/DiagnosisHistorySection';
import { UpcomingAppointmentsWidget } from '../components/UpcomingAppointmentsWidget';
import { AICareWidget } from '../components/AICareWidget';
import { Calendar, FlaskConical, Pill, FileHeart, Activity, AlertTriangle, CheckCircle2, Landmark, Stethoscope, Microscope, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import { widaBridge } from '../../../services/widaEcosystemBridge';
export const PatientDashboard = ({ patient, metrics, reminders, careJourney, prescriptions, wearable, onNavigateTab, onOpenBooking, onReminderStatusChange, onOrderPrescription, onOpenAIChat }) => {
    const activePrescriptions = prescriptions.filter((p) => p.status === 'Active').slice(0, 1);
    return (<div className="patient-dashboard d-flex flex-column gap-4">
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
            <CheckCircle2 size={14}/> ABHA ID: {patient.abhaId}
          </span>
          <button className="patient-btn patient-btn-primary" onClick={onOpenBooking}>
            <Calendar size={15}/> Book Appointment
          </button>
        </div>
      </div>

      {/* Interconnected Multi-Module Ecosystem Hub */}
      <div className="patient-card p-3 p-md-4" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #f8fafc 100%)', borderColor: '#99f6e4' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0d9488', boxShadow: '0 0 8px #0d9488' }} />
            <h5 className="mb-0 font-heading" style={{ fontSize: '1.05rem', color: '#0f766e' }}>
              Connected Clinical Ecosystem Hub
            </h5>
            <span className="patient-badge patient-badge-teal py-1 px-2" style={{ fontSize: '0.72rem' }}>
              Real-time Cross-Module Telemetry Active
            </span>
          </div>
          <span className="text-muted" style={{ fontSize: '0.78rem' }}>
            Universal Patient Registry: <strong style={{ color: '#0f766e' }}>{patient.name}</strong>
          </span>
        </div>

        <div className="row g-3">
          {/* Doctor Module Card */}
          <div className="col-md-4">
            <div className="p-3 rounded border bg-white h-100 d-flex flex-column justify-content-between shadow-sm" style={{ borderColor: '#ccfbf1' }}>
              <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.25rem' }}>🩺</span>
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>Doctor Module</strong>
                  </div>
                  <span className="badge" style={{ backgroundColor: '#f0fdfa', color: '#007C77', border: '1px solid #99f6e4', fontSize: '0.7rem' }}>
                    WIDA.doc
                  </span>
                </div>
                <p className="text-muted mb-2" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                  Consultation schedules, EHR history, and direct clinical appointments with certified physicians.
                </p>
                <div className="d-flex align-items-center gap-1 text-muted mb-3" style={{ fontSize: '0.76rem' }}>
                  <ShieldCheck size={13} style={{ color: '#007C77' }} />
                  <span>Dr. Aarav Sharma (Cardiology) & 4 Specialists</span>
                </div>
              </div>
              <button
                type="button"
                className="patient-btn w-100 py-2 justify-content-center"
                style={{ backgroundColor: '#007C77', color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}
                onClick={() => widaBridge.switchPortal('doctor')}
              >
                <span>Launch Doctor Workspace</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Diagnostic Lab Module Card */}
          <div className="col-md-4">
            <div className="p-3 rounded border bg-white h-100 d-flex flex-column justify-content-between shadow-sm" style={{ borderColor: '#ccfbf1' }}>
              <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.25rem' }}>🔬</span>
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>Diagnostic Laboratory</strong>
                  </div>
                  <span className="badge" style={{ backgroundColor: '#f0fdf4', color: '#0d9488', border: '1px solid #a7f3d0', fontSize: '0.7rem' }}>
                    WIDA.lab
                  </span>
                </div>
                <p className="text-muted mb-2" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                  NABL accredited pathology testing, barcode accessioning, and certified clinical reports.
                </p>
                <div className="d-flex align-items-center gap-1 text-muted mb-3" style={{ fontSize: '0.76rem' }}>
                  <FlaskConical size={13} style={{ color: '#0d9488' }} />
                  <span>HealthFirst Pathology Labs (Port 8082, SQLite lab.db)</span>
                </div>
              </div>
              <button
                type="button"
                className="patient-btn w-100 py-2 justify-content-center"
                style={{ backgroundColor: '#0D9488', color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}
                onClick={() => widaBridge.switchPortal('lab')}
              >
                <span>Launch Lab Workspace</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Pharmacy Module Card */}
          <div className="col-md-4">
            <div className="p-3 rounded border bg-white h-100 d-flex flex-column justify-content-between shadow-sm" style={{ borderColor: '#ccfbf1' }}>
              <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.25rem' }}>💊</span>
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>Central Pharmacy</strong>
                  </div>
                  <span className="badge" style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: '0.7rem' }}>
                    WIDA.pharmacy
                  </span>
                </div>
                <p className="text-muted mb-2" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                  Hospital dispensing, medicine inventory, barcode verification, and prescription fulfillment.
                </p>
                <div className="d-flex align-items-center gap-1 text-muted mb-3" style={{ fontSize: '0.76rem' }}>
                  <Pill size={13} style={{ color: '#16a34a' }} />
                  <span>WIDA Central Hospital & Pharmacy</span>
                </div>
              </div>
              <button
                type="button"
                className="patient-btn w-100 py-2 justify-content-center"
                style={{ backgroundColor: '#16A34A', color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}
                onClick={() => widaBridge.switchPortal('pharmacy')}
              >
                <span>Launch Pharmacy Workspace</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="row g-2">
        <div className="col-6 col-md-3 col-xl">
          <button className="patient-btn patient-btn-outline w-100 py-2 text-start justify-content-start" onClick={onOpenBooking}>
            <Calendar size={16} style={{ color: 'var(--p-primary)' }}/>
            <span>Book Doctor</span>
          </button>
        </div>
        <div className="col-6 col-md-3 col-xl">
          <button className="patient-btn patient-btn-outline w-100 py-2 text-start justify-content-start" onClick={() => onNavigateTab('diagnostics')}>
            <FlaskConical size={16} style={{ color: '#0284C7' }}/>
            <span>Book Lab Test</span>
          </button>
        </div>
        <div className="col-6 col-md-3 col-xl">
          <button className="patient-btn patient-btn-outline w-100 py-2 text-start justify-content-start" onClick={() => onNavigateTab('pharmacy')}>
            <Pill size={16} style={{ color: 'var(--p-success)' }}/>
            <span>Order Medicine</span>
          </button>
        </div>
        <div className="col-6 col-md-3 col-xl">
          <button className="patient-btn patient-btn-outline w-100 py-2 text-start justify-content-start" onClick={() => onNavigateTab('records')}>
            <FileHeart size={16} style={{ color: 'var(--p-primary)' }}/>
            <span>Health Journey</span>
          </button>
        </div>
        <div className="col-6 col-md-3 col-xl">
          <button className="patient-btn patient-btn-outline w-100 py-2 text-start justify-content-start" onClick={() => onNavigateTab('wellness')}>
            <Activity size={16} style={{ color: 'var(--p-purple)' }}/>
            <span>Wellness</span>
          </button>
        </div>
        <div className="col-6 col-md-3 col-xl">
          <button className="patient-btn patient-btn-outline w-100 py-2 text-start justify-content-start" onClick={() => onNavigateTab('government')}>
            <Landmark size={16} style={{ color: 'var(--p-primary)' }}/>
            <span>Gov Schemes</span>
          </button>
        </div>
        <div className="col-6 col-md-3 col-xl">
          <button className="patient-btn patient-btn-danger w-100 py-2 text-start justify-content-start" onClick={() => onNavigateTab('emergency')}>
            <AlertTriangle size={16}/>
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
          {metrics.map((m) => (<div key={m.id} className="col-6 col-md-4 col-xl-2">
              <HealthMetricCard metric={m}/>
            </div>))}
        </div>
      </div>

      {/* Connected Care Journey Highlight */}
      <CareJourney steps={careJourney} onStepClick={(s) => {
            if (s.routeLink)
                onNavigateTab(s.routeLink);
        }}/>

      {/* Main Grid: Diagnosis History + Appointments & AI Care */}
      <div className="row g-4">
        {/* Left Column: History of Diagnosis with 3D Anatomical Model */}
        <div className="col-lg-7 col-xl-8 d-flex flex-column gap-4">
          <DiagnosisHistorySection />

          {/* Active Prescription Quick Card */}
          {activePrescriptions.length > 0 && (<div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h5 className="font-heading mb-0" style={{ fontSize: '1.1rem' }}>
                  Active Prescriptions
                </h5>
                <button className="patient-btn patient-btn-outline patient-btn-sm" onClick={() => onNavigateTab('prescriptions')}>
                  View All Prescriptions →
                </button>
              </div>
              <PrescriptionCard prescription={activePrescriptions[0]} onOrderToPharmacy={onOrderPrescription}/>
            </div>)}
        </div>

        {/* Right Column: Upcoming Appointments Date Strip + AI Care + Reminders */}
        <div className="col-lg-5 col-xl-4 d-flex flex-column gap-4">
          {/* Upcoming Consultations with Weekday Date Picker & Telehealth Join */}
          <UpcomingAppointmentsWidget />

          {/* AI Care Interactive Assistant Widget */}
          <AICareWidget patient={patient} onOpenFullAIChat={onOpenAIChat}/>

          {/* Today's Reminders Widget */}
          <ReminderWidget reminders={reminders} onStatusChange={onReminderStatusChange} onViewAll={() => onNavigateTab('reminders')}/>

          {/* Personal Wellness Widget */}
          <WellnessWidget wearable={wearable[0]} onSync={() => alert('Fitbit Sense 2 Pro synchronized successfully.')}/>
        </div>
      </div>
    </div>);
};
