import React from 'react';
import { X, Download, ShieldCheck } from 'lucide-react';

interface DiagnosticScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  imageUrl: string;
  doctorName: string;
  date: string;
  findings: string;
}

export const DiagnosticScanModal: React.FC<DiagnosticScanModalProps> = ({
  isOpen,
  onClose,
  title,
  category,
  imageUrl,
  doctorName,
  date,
  findings
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(6px)',
        zIndex: 1060,
        padding: '1rem'
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="patient-card overflow-hidden shadow-2xl d-flex flex-column"
        style={{
          width: '100%',
          maxWidth: 820,
          maxHeight: '90vh',
          backgroundColor: 'var(--p-surface)'
        }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between p-3 px-4 border-bottom" style={{ borderColor: 'var(--p-border)' }}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="patient-badge patient-badge-teal">{category}</span>
              <span className="text-muted small">Recorded: {date}</span>
            </div>
            <h5 className="font-heading mb-0">{title}</h5>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-outline-secondary rounded-circle p-1"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-3 p-md-4 overflow-auto d-flex flex-column gap-3">
          <div
            className="rounded-3 overflow-hidden border position-relative d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: '#0a0f1d',
              minHeight: 340,
              maxHeight: 460
            }}
          >
            <img
              src={imageUrl}
              alt={title}
              style={{
                maxWidth: '100%',
                maxHeight: 440,
                objectFit: 'contain'
              }}
            />
            <div
              className="position-absolute bottom-0 start-0 m-2 px-2 py-1 rounded bg-black bg-opacity-75 text-white"
              style={{ fontSize: '0.72rem' }}
            >
              DICOM Clinical Telemetry Archive • 1080p
            </div>
          </div>

          <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
            <h6 className="font-heading mb-1" style={{ fontSize: '0.9rem' }}>
              Clinical Findings & Radiologist Impression:
            </h6>
            <p className="mb-2 text-muted" style={{ fontSize: '0.84rem', lineHeight: 1.5 }}>
              {findings}
            </p>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 border-top pt-2" style={{ borderColor: 'var(--p-border-subtle)', fontSize: '0.78rem' }}>
              <div>
                <strong>Reporting Clinician:</strong> {doctorName}
              </div>
              <div className="text-teal d-flex align-items-center gap-1">
                <ShieldCheck size={14} /> Certified Digital Signature Attached
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 px-4 border-top d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--p-border)' }}>
          <button
            onClick={() => alert('Diagnostic report downloaded with ABHA authentication.')}
            className="patient-btn patient-btn-outline patient-btn-sm"
          >
            <Download size={14} /> Download Scan (PDF)
          </button>
          <button onClick={onClose} className="patient-btn patient-btn-primary patient-btn-sm">
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
