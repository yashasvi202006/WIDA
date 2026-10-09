import React from 'react';
import type { PatientConsentPermission, PatientAuditLog } from '../types/patientTypes';
import { Lock, Check } from 'lucide-react';

interface PatientPrivacyProps {
  permissions: PatientConsentPermission[];
  auditLogs: PatientAuditLog[];
  onToggleConsent: (id: string) => void;
}

export const PatientPrivacy: React.FC<PatientPrivacyProps> = ({
  permissions,
  auditLogs,
  onToggleConsent
}) => {
  return (
    <div className="patient-privacy d-flex flex-column gap-4">
      <div>
        <h3 className="font-heading mb-1">Privacy, Consent & Audit Trail</h3>
        <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
          Dynamic ABDM consent manager: control who can read your medical records, prescriptions, and lab reports
        </p>
      </div>

      {/* Active Consent Grants */}
      <div className="patient-card p-4">
        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: 'var(--p-border-subtle)' }}>
          <div>
            <h5 className="font-heading mb-0">Active Practitioner & Facility Authorizations</h5>
            <span className="text-muted" style={{ fontSize: '0.78rem' }}>
              Granular access scopes granted to healthcare institutions
            </span>
          </div>
          <span className="patient-badge patient-badge-teal">Consent-Driven Architecture</span>
        </div>

        <div className="d-flex flex-column gap-3">
          {permissions.map((perm) => (
            <div
              key={perm.id}
              className="p-3 rounded border d-flex flex-wrap align-items-center justify-content-between gap-3"
              style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)' }}
            >
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h6 className="mb-0 font-heading" style={{ fontSize: '0.95rem' }}>{perm.providerName}</h6>
                  <span className="patient-badge patient-badge-neutral">{perm.providerType}</span>
                  <span
                    className={`patient-badge ${
                      perm.status === 'Active' ? 'patient-badge-success' : 'patient-badge-danger'
                    }`}
                  >
                    {perm.status}
                  </span>
                </div>

                <div className="d-flex flex-wrap gap-2 text-muted" style={{ fontSize: '0.78rem' }}>
                  <span>Medical History: {perm.accessScopes.medicalHistory ? '✓' : '✗'}</span>
                  <span>•</span>
                  <span>Prescriptions: {perm.accessScopes.prescriptions ? '✓' : '✗'}</span>
                  <span>•</span>
                  <span>Lab Reports: {perm.accessScopes.labReports ? '✓' : '✗'}</span>
                  <span>•</span>
                  <span>Wellness: {perm.accessScopes.wellnessData ? '✓' : '✗'}</span>
                </div>
                <div className="text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                  Valid until: {perm.expiryDate}
                </div>
              </div>

              <button
                className={`patient-btn patient-btn-sm ${
                  perm.status === 'Active' ? 'patient-btn-outline text-danger' : 'patient-btn-primary'
                }`}
                style={perm.status === 'Active' ? { borderColor: 'var(--p-danger)', color: 'var(--p-danger)' } : {}}
                onClick={() => onToggleConsent(perm.id)}
              >
                {perm.status === 'Active' ? 'Revoke Access' : 'Reactivate Access'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Access History / Audit Trail */}
      <div className="patient-card p-4">
        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: 'var(--p-border-subtle)' }}>
          <div>
            <h5 className="font-heading mb-0">Record Access Audit Trail</h5>
            <span className="text-muted" style={{ fontSize: '0.78rem' }}>
              Immutable logging of every practitioner query to your health documents
            </span>
          </div>
          <span className="patient-badge patient-badge-teal">
            <Lock size={12} /> Cryptographically Signed Log
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.82rem' }}>
            <thead style={{ backgroundColor: 'var(--p-surface-hover)' }}>
              <tr>
                <th>Accessor / Organization</th>
                <th>Action & Resource</th>
                <th>Access Purpose</th>
                <th>Timestamp</th>
                <th>Security Status</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <div className="fw-semibold">{log.accessorName}</div>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>{log.accessorRole}</div>
                  </td>
                  <td>
                    <div>{log.action}</div>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>{log.resourceAccessed}</div>
                  </td>
                  <td>{log.purpose}</td>
                  <td className="text-muted">{log.timestamp}</td>
                  <td>
                    <span className="patient-badge patient-badge-success">
                      <Check size={11} /> {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
