import React, { useState } from 'react';
import type { PatientLabReport } from '../types/patientTypes';
import { FileCheck, ShieldCheck, Download, ChevronDown, ChevronUp } from 'lucide-react';

interface LabReportCardProps {
  report: PatientLabReport;
  onDownload?: (report: PatientLabReport) => void;
}

export const LabReportCard: React.FC<LabReportCardProps> = ({ report, onDownload }) => {
  const [expanded, setExpanded] = useState(false);

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
            <FileCheck size={22} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h6 className="mb-0 font-heading" style={{ fontSize: '1rem' }}>{report.testName}</h6>
              <span className="patient-badge patient-badge-success">{report.status}</span>
              {report.isVerified && (
                <span className="text-success d-flex align-items-center gap-1" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  <ShieldCheck size={13} /> NABL Verified
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--p-text-muted)' }}>
              {report.labName} • Reported on {report.date} • Ordering Physician: {report.doctorName}
            </span>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button
            className="patient-btn patient-btn-outline patient-btn-sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />} {expanded ? 'Collapse' : 'View Parameters'}
          </button>
          <button
            className="patient-btn patient-btn-primary patient-btn-sm"
            onClick={() => {
              if (onDownload) {
                onDownload(report);
              } else {
                alert(`Downloading certified PDF report: ${report.testName}`);
              }
            }}
          >
            <Download size={13} /> PDF
          </button>
        </div>
      </div>

      <div className="p-3 rounded mb-2" style={{ backgroundColor: 'var(--p-surface-alt)', border: '1px solid var(--p-border-subtle)' }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--p-text-main)', fontWeight: 600 }} className="mb-1">
          Pathological Interpretation:
        </div>
        <p className="mb-1 text-muted" style={{ fontSize: '0.8rem' }}>
          {report.overallConclusion}
        </p>
        {report.doctorNotes && (
          <div className="mt-2 pt-2 border-top text-muted" style={{ fontSize: '0.78rem', borderColor: 'var(--p-border)' }}>
            <strong>Physician Remark:</strong> {report.doctorNotes}
          </div>
        )}
      </div>

      {expanded && (
        <div className="mt-3 table-responsive">
          <table className="table table-sm table-bordered mb-0" style={{ fontSize: '0.8rem' }}>
            <thead style={{ backgroundColor: 'var(--p-surface-hover)' }}>
              <tr>
                <th>Test Parameter</th>
                <th>Observed Value</th>
                <th>Reference Range</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {report.parameters.map((param, i) => (
                <tr key={i}>
                  <td className="fw-semibold">{param.name}</td>
                  <td>{param.value} {param.unit}</td>
                  <td className="text-muted">{param.normalRange} {param.unit}</td>
                  <td>
                    <span
                      className={`patient-badge ${
                        param.status === 'Normal' ? 'patient-badge-success' : 'patient-badge-warning'
                      }`}
                    >
                      {param.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
