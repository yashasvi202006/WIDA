import React from 'react';
import type { PatientDiagnosticTest } from '../types/patientTypes';
import { FlaskConical, Clock, AlertCircle, Calendar } from 'lucide-react';

interface DiagnosticCardProps {
  test: PatientDiagnosticTest;
  onBook: (test: PatientDiagnosticTest) => void;
}

export const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ test, onBook }) => {
  return (
    <div className="patient-card patient-card-hover p-3 h-100 d-flex flex-column justify-content-between">
      <div>
        <div className="d-flex align-items-start justify-content-between mb-2">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--p-radius-md)',
              backgroundColor: 'var(--p-info-light, #E0F2FE)',
              color: '#0284C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FlaskConical size={20} />
          </div>
          <span className="patient-badge patient-badge-teal">{test.category}</span>
        </div>

        <h6 className="font-heading mb-1" style={{ fontSize: '0.98rem' }}>{test.name}</h6>
        <p className="text-muted mb-3" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
          {test.description}
        </p>

        <div className="p-2 rounded mb-3" style={{ backgroundColor: 'var(--p-surface-alt)', fontSize: '0.78rem' }}>
          <div className="d-flex align-items-center gap-1 text-muted mb-1">
            <Clock size={12} />
            <span>Turnaround: {test.turnaroundTime}</span>
          </div>
          <div className="d-flex align-items-center gap-1 text-muted mb-1">
            <span>Sample: {test.sampleType}</span>
          </div>
          <div className="d-flex align-items-center gap-1 text-muted">
            <AlertCircle size={12} className="text-warning" />
            <span className="text-truncate">{test.preparation}</span>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between pt-2 border-top" style={{ borderColor: 'var(--p-border-subtle)' }}>
        <div>
          <span className="text-muted" style={{ fontSize: '0.7rem' }}>Price</span>
          <div className="fw-bold" style={{ fontSize: '1.05rem', color: 'var(--p-text-main)' }}>
            ₹{test.price}
          </div>
        </div>
        <button
          className="patient-btn patient-btn-primary patient-btn-sm"
          onClick={() => onBook(test)}
        >
          <Calendar size={13} /> Book Test
        </button>
      </div>
    </div>
  );
};
