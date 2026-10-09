import React, { useState } from 'react';
import type { PatientEmergencyRequest, PatientProfile } from '../types/patientTypes';
import { AlertTriangle, CheckCircle2, Siren, ArrowRight } from 'lucide-react';

interface EmergencySosCardProps {
  patient: PatientProfile;
  onRequestEmergency: (location: string) => void;
  activeRequest?: PatientEmergencyRequest | null;
  onAdvanceStatus?: (id: string, nextStatus: PatientEmergencyRequest['status']) => void;
}

export const EmergencySosCard: React.FC<EmergencySosCardProps> = ({
  patient,
  onRequestEmergency,
  activeRequest,
  onAdvanceStatus
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const stages: ('Alert Sent' | 'Request Received' | 'Response Assigned' | 'Ambulance Dispatched' | 'Hospital Notified' | 'Arrived')[] = [
    'Alert Sent',
    'Request Received',
    'Response Assigned',
    'Ambulance Dispatched',
    'Hospital Notified',
    'Arrived'
  ];

  const currentStageIndex = activeRequest ? stages.indexOf(activeRequest.status) : -1;

  const handleTrigger = () => {
    setShowConfirm(false);
    onRequestEmergency('Sector 62, Noida, Uttar Pradesh (GPS Verified Location)');
  };

  const handleNextStage = () => {
    if (activeRequest && onAdvanceStatus && currentStageIndex < stages.length - 1) {
      onAdvanceStatus(activeRequest.id, stages[currentStageIndex + 1]);
    }
  };

  return (
    <div className="patient-card p-4 border-danger" style={{ borderColor: 'rgba(220, 38, 38, 0.3)' }}>
      {/* College prototype disclaimer as required by Rule 28 */}
      <div
        className="p-3 mb-4 rounded d-flex align-items-center gap-2 border"
        style={{
          backgroundColor: 'var(--p-warning-light)',
          borderColor: 'rgba(245, 158, 11, 0.4)',
          color: '#92400E',
          fontSize: '0.85rem'
        }}
      >
        <AlertTriangle size={18} className="flex-shrink-0" />
        <span>
          <strong>Prototype only:</strong> This feature is a demonstrated digital simulation for academic evaluation and does not replace local emergency services (Dial 112 / 102).
        </span>
      </div>

      <div className="row align-items-center mb-4">
        <div className="col-lg-8">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="patient-badge patient-badge-danger">
              <Siren size={13} /> Rapid Response SOS
            </span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>24x7 Ambulance & Hospital Telemetry</span>
          </div>
          <h4 className="font-heading mb-2 text-danger">Emergency Medical Dispatch</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Broadcasting an emergency alert automatically dispatches the nearest high-acuity life support ambulance and pre-notifies the trauma emergency team with your critical vitals.
          </p>
        </div>

        <div className="col-lg-4 text-center my-3 my-lg-0">
          {!activeRequest ? (
            <button
              className="patient-emergency-btn mx-auto"
              onClick={() => setShowConfirm(true)}
              aria-label="Request Emergency Assistance"
            >
              <Siren size={32} className="mb-1" />
              <span>SOS</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 500 }}>REQUEST HELP</span>
            </button>
          ) : (
            <div className="p-3 rounded border border-danger text-center" style={{ backgroundColor: 'var(--p-danger-light)' }}>
              <span className="fw-bold text-danger d-block mb-1">DISPATCH ACTIVE</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--p-danger)' }}>
                Ambulance: {activeRequest.ambulanceNumber}
              </span>
              <span style={{ fontSize: '0.78rem' }} className="d-block text-muted">
                ETA ~{activeRequest.etaMinutes} mins
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Critical Medical Info Sent to Responders */}
      <div className="p-3 rounded mb-4" style={{ backgroundColor: 'var(--p-surface-alt)', border: '1px solid var(--p-border)' }}>
        <h6 className="font-heading mb-3" style={{ fontSize: '0.9rem' }}>
          🔒 Pre-Authorized Emergency Medical Snapshot
        </h6>
        <div className="row g-2" style={{ fontSize: '0.82rem' }}>
          <div className="col-sm-6 col-md-3">
            <span className="text-muted d-block">Blood Group:</span>
            <span className="fw-bold text-danger">{patient.bloodGroup}</span>
          </div>
          <div className="col-sm-6 col-md-3">
            <span className="text-muted d-block">Emergency Contact:</span>
            <span className="fw-bold">{patient.emergencyContact.name} ({patient.emergencyContact.phone})</span>
          </div>
          <div className="col-sm-6 col-md-3">
            <span className="text-muted d-block">Known Allergies:</span>
            <span className="fw-bold text-danger">{patient.allergies.join(', ') || 'None'}</span>
          </div>
          <div className="col-sm-6 col-md-3">
            <span className="text-muted d-block">Critical Conditions:</span>
            <span className="fw-bold">{patient.chronicConditions.join(', ') || 'None'}</span>
          </div>
        </div>
      </div>

      {/* Live Dispatch Stages when active */}
      {activeRequest && (
        <div className="p-4 rounded border" style={{ backgroundColor: 'var(--p-surface)', borderColor: 'var(--p-border)' }}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="font-heading mb-0" style={{ fontSize: '0.95rem' }}>
              Live Emergency Tracking & Hospital Dispatch Stages
            </h6>
            {currentStageIndex < stages.length - 1 && (
              <button
                className="patient-btn patient-btn-outline patient-btn-sm"
                onClick={handleNextStage}
              >
                Simulate Next Stage <ArrowRight size={13} />
              </button>
            )}
          </div>

          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2" style={{ fontSize: '0.78rem' }}>
            {stages.map((stg, idx) => {
              const isPast = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div key={stg} className="d-flex flex-column align-items-center text-center flex-fill">
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: isPast ? 'var(--p-danger)' : 'var(--p-surface-alt)',
                      color: isPast ? '#ffffff' : 'var(--p-text-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      marginBottom: 4,
                      border: isPast ? 'none' : '1px solid var(--p-border)'
                    }}
                  >
                    {isPast ? <CheckCircle2 size={16} /> : idx + 1}
                  </div>
                  <span
                    style={{
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? 'var(--p-danger)' : isPast ? 'var(--p-text-main)' : 'var(--p-text-subtle)'
                    }}
                  >
                    {stg}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="patient-modal-backdrop">
          <div className="patient-modal-box p-4" style={{ maxWidth: 480 }}>
            <div className="text-center mb-3">
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: 'var(--p-danger-light)',
                  color: 'var(--p-danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}
              >
                <AlertTriangle size={32} />
              </div>
              <h5 className="font-heading text-danger mb-1">Confirm Emergency Request</h5>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                You are about to request emergency assistance. This will broadcast your GPS location, blood group ({patient.bloodGroup}), and emergency contacts to first responders.
              </p>
            </div>

            <div className="d-flex gap-2 justify-content-center">
              <button
                className="patient-btn patient-btn-outline"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="patient-btn patient-btn-danger"
                onClick={handleTrigger}
              >
                Confirm & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
