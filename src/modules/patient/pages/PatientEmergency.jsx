import React from 'react';
import { EmergencySosCard } from '../components/EmergencySosCard';
import {
  PhoneCall,
  HeartPulse,
  Flame,
  ShieldAlert,
  AlertTriangle,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  Info
} from 'lucide-react';

export const PatientEmergency = ({
  patient,
  onRequestEmergency,
  activeRequest,
  onAdvanceStatus,
  onDeactivateEmergency
}) => {
  return (
    <div className="patient-emergency d-flex flex-column gap-4">
      <div>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <h3 className="font-heading mb-1 text-danger d-flex align-items-center gap-2">
              <AlertTriangle size={26} />
              Emergency Medical Services & Rapid SOS Dispatch
            </h3>
            <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
              One-touch high-priority emergency dispatch connecting ambulances, trauma centers, and family contacts with real-time GPS telemetry.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="patient-badge patient-badge-danger py-2 px-3">
              24x7 Ambulance Telemetry Active
            </span>
          </div>
        </div>
      </div>

      {/* Main SOS Card */}
      <EmergencySosCard
        patient={patient}
        onRequestEmergency={onRequestEmergency}
        activeRequest={activeRequest}
        onAdvanceStatus={onAdvanceStatus}
        onDeactivateEmergency={onDeactivateEmergency}
      />

      {/* Official Emergency Helplines (India) */}
      <div className="patient-card p-4">
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <h5 className="font-heading mb-0 fw-bold">Official National Emergency Helplines (India)</h5>
          <span className="text-muted" style={{ fontSize: '0.78rem' }}>
            Toll-Free, 24 Hours, All Indian Telecom Operators
          </span>
        </div>

        <div className="row g-3">
          <div className="col-6 col-md-4 col-xl-2">
            <a
              href="tel:112"
              className="p-3 rounded border text-center d-flex flex-column align-items-center justify-content-center text-decoration-none h-100"
              style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)', transition: 'transform 0.2s' }}
              title="Click to dial 112"
            >
              <span className="text-muted d-block" style={{ fontSize: '0.74rem' }}>Unified Emergency</span>
              <span className="fw-bold fs-3 text-danger">112</span>
              <span className="badge bg-danger-subtle text-danger mt-1" style={{ fontSize: '0.68rem' }}>All-in-One</span>
            </a>
          </div>

          <div className="col-6 col-md-4 col-xl-2">
            <a
              href="tel:108"
              className="p-3 rounded border text-center d-flex flex-column align-items-center justify-content-center text-decoration-none h-100"
              style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)', transition: 'transform 0.2s' }}
              title="Click to dial 108"
            >
              <span className="text-muted d-block" style={{ fontSize: '0.74rem' }}>Ambulance Dispatch</span>
              <span className="fw-bold fs-3 text-danger">108</span>
              <span className="badge bg-danger-subtle text-danger mt-1" style={{ fontSize: '0.68rem' }}>Medical Transport</span>
            </a>
          </div>

          <div className="col-6 col-md-4 col-xl-2">
            <a
              href="tel:102"
              className="p-3 rounded border text-center d-flex flex-column align-items-center justify-content-center text-decoration-none h-100"
              style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)', transition: 'transform 0.2s' }}
              title="Click to dial 102"
            >
              <span className="text-muted d-block" style={{ fontSize: '0.74rem' }}>Maternity / Infant</span>
              <span className="fw-bold fs-3 text-info">102</span>
              <span className="badge bg-info-subtle text-info mt-1" style={{ fontSize: '0.68rem' }}>JSSK Transport</span>
            </a>
          </div>

          <div className="col-6 col-md-4 col-xl-2">
            <a
              href="tel:1075"
              className="p-3 rounded border text-center d-flex flex-column align-items-center justify-content-center text-decoration-none h-100"
              style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)', transition: 'transform 0.2s' }}
              title="Click to dial 1075"
            >
              <span className="text-muted d-block" style={{ fontSize: '0.74rem' }}>National Health</span>
              <span className="fw-bold fs-3 text-primary">1075</span>
              <span className="badge bg-primary-subtle text-primary mt-1" style={{ fontSize: '0.68rem' }}>MoHFW Desk</span>
            </a>
          </div>

          <div className="col-6 col-md-4 col-xl-2">
            <a
              href="tel:14416"
              className="p-3 rounded border text-center d-flex flex-column align-items-center justify-content-center text-decoration-none h-100"
              style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)', transition: 'transform 0.2s' }}
              title="Click to dial 14416"
            >
              <span className="text-muted d-block" style={{ fontSize: '0.74rem' }}>Mental Crisis</span>
              <span className="fw-bold fs-3 text-purple" style={{ color: '#8b5cf6' }}>14416</span>
              <span className="badge bg-purple-subtle text-purple mt-1" style={{ fontSize: '0.68rem' }}>Tele-MANAS</span>
            </a>
          </div>

          <div className="col-6 col-md-4 col-xl-2">
            <a
              href="tel:14567"
              className="p-3 rounded border text-center d-flex flex-column align-items-center justify-content-center text-decoration-none h-100"
              style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)', transition: 'transform 0.2s' }}
              title="Click to dial 14567"
            >
              <span className="text-muted d-block" style={{ fontSize: '0.74rem' }}>Senior Citizen</span>
              <span className="fw-bold fs-3 text-success">14567</span>
              <span className="badge bg-success-subtle text-success mt-1" style={{ fontSize: '0.68rem' }}>Elderly Line</span>
            </a>
          </div>
        </div>
      </div>

      {/* Critical First-Aid Protocols & Bystander Guides */}
      <div className="patient-card p-4">
        <h5 className="font-heading mb-3 fw-bold d-flex align-items-center gap-2">
          <HeartPulse size={20} className="text-danger" />
          Immediate Life-Saving Bystander Protocols (While Ambulance is in Transit)
        </h5>

        <div className="row g-3">
          <div className="col-md-6 col-lg-3">
            <div className="p-3 rounded border h-100" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
              <div className="fw-bold text-danger mb-1 d-flex align-items-center gap-1" style={{ fontSize: '0.86rem' }}>
                🫀 Adult CPR (Chest Compressions)
              </div>
              <p className="text-muted mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
                Place heels of both hands in center of chest. Push hard and fast (100-120 beats/minute, depth 5-6 cm) to the beat of "Stayin' Alive". Do not stop until paramedics arrive.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="p-3 rounded border h-100" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
              <div className="fw-bold text-danger mb-1 d-flex align-items-center gap-1" style={{ fontSize: '0.86rem' }}>
                ⚡ Stroke FAST Assessment
              </div>
              <p className="text-muted mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
                <strong>F</strong>ace drooping? <strong>A</strong>rm weakness? <strong>S</strong>peech difficulty? <strong>T</strong>ime to call emergency immediately. Note exact symptom onset time for ER thrombolysis.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="p-3 rounded border h-100" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
              <div className="fw-bold text-danger mb-1 d-flex align-items-center gap-1" style={{ fontSize: '0.86rem' }}>
                🩸 Severe Bleeding Control
              </div>
              <p className="text-muted mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
                Apply direct continuous pressure with clean cloth or gauze. Elevate injured limb if no fracture suspected. Do not remove soaked cloths; place additional layers on top.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="p-3 rounded border h-100" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
              <div className="fw-bold text-danger mb-1 d-flex align-items-center gap-1" style={{ fontSize: '0.86rem' }}>
                🛡️ Recovery Position
              </div>
              <p className="text-muted mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
                If patient is unconscious but breathing, place them gently on their side with tilted head to keep airway clear and prevent aspiration. Never give liquids to an unconscious person.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
