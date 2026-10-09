import React from 'react';
import type { PatientPrescription } from '../types/patientTypes';
import { FileText, Pill, Clock, ShoppingCart, CheckCircle2 } from 'lucide-react';

interface PrescriptionCardProps {
  prescription: PatientPrescription;
  onOrderToPharmacy: (prescriptionId: string) => void;
  onViewDetails?: (prescription: PatientPrescription) => void;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  onOrderToPharmacy,
  onViewDetails
}) => {
  const getStatusBadge = () => {
    switch (prescription.status) {
      case 'Active':
        return <span className="patient-badge patient-badge-success">Active Course</span>;
      case 'Completed':
        return <span className="patient-badge patient-badge-neutral">Completed</span>;
      default:
        return <span className="patient-badge patient-badge-warning">{prescription.status}</span>;
    }
  };

  return (
    <div className="patient-card patient-card-hover p-4 mb-3">
      <div className="d-flex align-items-start justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: 'var(--p-border-subtle)' }}>
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--p-radius-md)',
              backgroundColor: 'var(--p-primary-subtle)',
              color: 'var(--p-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FileText size={22} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h6 className="mb-0 font-heading" style={{ fontSize: '1rem' }}>Rx #{prescription.id.toUpperCase()}</h6>
              {getStatusBadge()}
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--p-text-muted)' }}>
              Prescribed by {prescription.doctorName} ({prescription.doctorSpecialization}) • {prescription.date}
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          {onViewDetails && (
            <button
              className="patient-btn patient-btn-outline patient-btn-sm"
              onClick={() => onViewDetails(prescription)}
            >
              Details
            </button>
          )}
          {prescription.isSentToPharmacy ? (
            <span className="patient-badge patient-badge-teal d-flex align-items-center gap-1">
              <CheckCircle2 size={12} /> Routed to {prescription.dispensedBy}
            </span>
          ) : (
            <button
              className="patient-btn patient-btn-primary patient-btn-sm"
              onClick={() => onOrderToPharmacy(prescription.id)}
            >
              <ShoppingCart size={13} /> Order to Pharmacy
            </button>
          )}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-muted mb-1" style={{ fontSize: '0.78rem' }}><strong>Diagnosis:</strong> {prescription.diagnosis}</div>
        <div className="text-muted" style={{ fontSize: '0.78rem' }}><strong>Doctor Instructions:</strong> {prescription.instructions}</div>
      </div>

      <div className="row g-2 mb-2">
        {prescription.medicines.map((med) => (
          <div key={med.id} className="col-md-6">
            <div className="p-3 rounded border h-100" style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)' }}>
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fw-bold" style={{ fontSize: '0.9rem', color: 'var(--p-text-main)' }}>
                  <Pill size={14} className="me-1 text-teal" style={{ color: 'var(--p-primary)' }} />
                  {med.name}
                </span>
                <span className="patient-badge patient-badge-neutral" style={{ fontSize: '0.7rem' }}>
                  {med.dosage}
                </span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted mb-1" style={{ fontSize: '0.78rem' }}>
                <Clock size={12} /> {med.frequency} • {med.duration}
              </div>
              <p className="mb-0 text-muted" style={{ fontSize: '0.74rem' }}>
                {med.instructions}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
