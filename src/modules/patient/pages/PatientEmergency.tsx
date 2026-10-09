import React from 'react';
import type { PatientProfile, PatientEmergencyRequest } from '../types/patientTypes';
import { EmergencySosCard } from '../components/EmergencySosCard';
interface PatientEmergencyProps {
  patient: PatientProfile;
  onRequestEmergency: (location: string) => void;
  activeRequest?: PatientEmergencyRequest | null;
  onAdvanceStatus?: (id: string, nextStatus: PatientEmergencyRequest['status']) => void;
}

export const PatientEmergency: React.FC<PatientEmergencyProps> = ({
  patient,
  onRequestEmergency,
  activeRequest,
  onAdvanceStatus
}) => {
  return (
    <div className="patient-emergency d-flex flex-column gap-4">
      <div>
        <h3 className="font-heading mb-1 text-danger">Emergency Medical Services & SOS</h3>
        <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
          One-touch high-priority emergency dispatch connecting ambulances, trauma centers, and family contacts
        </p>
      </div>

      <EmergencySosCard
        patient={patient}
        onRequestEmergency={onRequestEmergency}
        activeRequest={activeRequest}
        onAdvanceStatus={onAdvanceStatus}
      />

      {/* Emergency Helpline Contacts */}
      <div className="patient-card p-4">
        <h5 className="font-heading mb-3">Official National Emergency Helplines (India)</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="p-3 rounded border text-center" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
              <span className="text-muted d-block" style={{ fontSize: '0.78rem' }}>National Emergency Helpline</span>
              <span className="fw-bold fs-4 text-danger">112</span>
              <span className="text-muted d-block mt-1" style={{ fontSize: '0.72rem' }}>All-in-One Emergency Services</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 rounded border text-center" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
              <span className="text-muted d-block" style={{ fontSize: '0.78rem' }}>Ambulance Dispatch</span>
              <span className="fw-bold fs-4 text-danger">102 / 108</span>
              <span className="text-muted d-block mt-1" style={{ fontSize: '0.72rem' }}>Emergency Medical Transport</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 rounded border text-center" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
              <span className="text-muted d-block" style={{ fontSize: '0.78rem' }}>Senior Citizen Helpline</span>
              <span className="fw-bold fs-4 text-primary">14567</span>
              <span className="text-muted d-block mt-1" style={{ fontSize: '0.72rem' }}>Elderly Medical & Social Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
