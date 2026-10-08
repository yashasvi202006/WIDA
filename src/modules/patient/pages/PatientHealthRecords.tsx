import React from 'react';
import type { PatientHealthRecord, PatientCareJourneyStep } from '../types/patientTypes';
import { HealthTimeline } from '../components/HealthTimeline';
import { CareJourney } from '../components/CareJourney';
import { ShieldCheck, Download } from 'lucide-react';

interface PatientHealthRecordsProps {
  records: PatientHealthRecord[];
  careJourney: PatientCareJourneyStep[];
  onSelectStep?: (step: PatientCareJourneyStep) => void;
}

export const PatientHealthRecords: React.FC<PatientHealthRecordsProps> = ({
  records,
  careJourney,
  onSelectStep
}) => {
  return (
    <div className="patient-health-records d-flex flex-column gap-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h3 className="font-heading mb-1">Unified Health Record (UHR)</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Single longitudinal patient timeline integrating doctor visits, prescriptions, labs, and dispensing
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="patient-btn patient-btn-outline"
            onClick={() => alert('Exporting full longitudinal health summary PDF...')}
          >
            <Download size={14} /> Export UHR Record
          </button>
        </div>
      </div>

      {/* Security notice */}
      <div className="p-3 rounded border d-flex align-items-center justify-content-between" style={{ backgroundColor: 'var(--p-surface)', borderColor: 'var(--p-border)' }}>
        <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.82rem' }}>
          <ShieldCheck size={18} className="text-success" />
          <span>
            <strong>ABDM & ABHA Compliant Record Vault:</strong> Your health records are encrypted and access is audited under explicit patient consent.
          </span>
        </div>
        <span className="patient-badge patient-badge-teal">Consent Enforced</span>
      </div>

      {/* Reusable Care Journey */}
      <CareJourney steps={careJourney} onStepClick={onSelectStep} />

      {/* Chronological Health Timeline */}
      <HealthTimeline
        records={records}
        onSelectRecord={(rec) => alert(`Selected record: ${rec.title}\nProvider: ${rec.provider}\nSummary: ${rec.summary}`)}
      />
    </div>
  );
};
