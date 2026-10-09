import React from 'react';
import type { PatientCareJourneyStep } from '../types/patientTypes';
import { Calendar, UserCheck, FileText, FlaskConical, FileCheck, Pill, ShieldCheck, Check } from 'lucide-react';

interface CareJourneyProps {
  steps: PatientCareJourneyStep[];
  onStepClick?: (step: PatientCareJourneyStep) => void;
  compact?: boolean;
}

export const CareJourney: React.FC<CareJourneyProps> = ({ steps, onStepClick, compact = false }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'calendar':
        return <Calendar size={18} />;
      case 'stethoscope':
        return <UserCheck size={18} />;
      case 'file-text':
        return <FileText size={18} />;
      case 'flask':
        return <FlaskConical size={18} />;
      case 'file-check':
        return <FileCheck size={18} />;
      case 'capsule':
        return <Pill size={18} />;
      case 'shield':
        return <ShieldCheck size={18} />;
      default:
        return <Check size={18} />;
    }
  };

  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="patient-card p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h5 className="mb-1 font-heading" style={{ fontSize: '1.1rem' }}>
            Connected Care Journey
          </h5>
          <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
            Unified continuity loop from doctor encounter to health vault sync
          </p>
        </div>
        <div className="text-end">
          <span className="patient-badge patient-badge-teal">
            {completedCount} / {steps.length} Steps Complete ({progressPercent}%)
          </span>
        </div>
      </div>

      <div className="patient-journey-wrapper">
        <div className="patient-journey-bar">
          <div
            className="patient-journey-bar-fill"
            style={{ width: `${(completedCount / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isActive = step.status === 'in_progress';
          return (
            <div
              key={step.id || idx}
              className="patient-journey-step"
              onClick={() => onStepClick && onStepClick(step)}
              title={step.details}
            >
              <div
                className={`patient-step-circle ${
                  isDone ? 'completed' : isActive ? 'active' : 'pending'
                }`}
              >
                {isDone ? <Check size={18} /> : getIcon(step.icon)}
              </div>
              <span
                style={{
                  fontSize: compact ? '0.78rem' : '0.82rem',
                  fontWeight: 600,
                  color: isDone ? 'var(--p-text-main)' : 'var(--p-text-muted)'
                }}
              >
                {step.title}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: isDone ? 'var(--p-primary-dark)' : 'var(--p-text-subtle)'
                }}
              >
                {step.subtitle}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--p-text-subtle)' }} className="mt-1">
                {step.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
