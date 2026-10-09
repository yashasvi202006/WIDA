import React from 'react';
import { PATIENT_MOCK_SCHEMES } from '../data/patientMockData';
import { Landmark, ExternalLink } from 'lucide-react';

export const PatientGovernmentSchemes: React.FC = () => {
  return (
    <div className="patient-government-schemes d-flex flex-column gap-4">
      <div>
        <h3 className="font-heading mb-1">Government Healthcare Schemes & Benefits</h3>
        <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
          National health initiatives, financial assistance programs, and ABHA digital entitlements (Public Guidance)
        </p>
      </div>

      {/* Academic Disclaimer */}
      <div className="p-3 rounded border" style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)', fontSize: '0.82rem', color: 'var(--p-text-muted)' }}>
        <strong>Information Disclaimer:</strong> WIDA provides guidance on public health policies. This platform is an independent digital health solution for academic evaluation and does not claim official governmental agency endorsement.
      </div>

      {/* Schemes Grid */}
      <div className="d-flex flex-column gap-3">
        {PATIENT_MOCK_SCHEMES.map((scheme) => (
          <div key={scheme.id} className="patient-card p-4">
            <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-3 border-bottom pb-2" style={{ borderColor: 'var(--p-border-subtle)' }}>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <Landmark size={20} style={{ color: 'var(--p-primary)' }} />
                  <h5 className="font-heading mb-0">{scheme.name}</h5>
                </div>
                <div className="text-muted mt-1" style={{ fontSize: '0.82rem' }}>
                  Coverage: <strong className="text-success">{scheme.coverageAmount}</strong>
                </div>
              </div>

              <span className={`patient-badge ${scheme.status === 'Enrolled' ? 'patient-badge-success' : 'patient-badge-teal'}`}>
                {scheme.status}
              </span>
            </div>

            <p className="text-muted mb-3" style={{ fontSize: '0.86rem' }}>
              {scheme.tagline}
            </p>

            <div className="row g-3 mb-3" style={{ fontSize: '0.82rem' }}>
              <div className="col-md-6">
                <div className="p-3 rounded border h-100" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
                  <h6 className="font-heading mb-2">Key Entitlements & Benefits</h6>
                  <ul className="mb-0 ps-3 text-muted">
                    {scheme.benefits.map((b, idx) => (
                      <li key={idx} className="mb-1">{b}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 rounded border h-100" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
                  <h6 className="font-heading mb-2">Eligibility Criteria</h6>
                  <ul className="mb-0 ps-3 text-muted">
                    {scheme.eligibility.map((e, idx) => (
                      <li key={idx} className="mb-1">{e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2 border-top" style={{ borderColor: 'var(--p-border-subtle)', fontSize: '0.78rem' }}>
              <span className="text-muted">
                Required Documents: {scheme.requiredDocuments.join(', ')}
              </span>

              <a
                href={scheme.officialSource}
                target="_blank"
                rel="noopener noreferrer"
                className="patient-btn patient-btn-outline patient-btn-sm"
              >
                Official Portal <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
