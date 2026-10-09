import React, { useState } from 'react';
import type { PatientHealthRecord } from '../types/patientTypes';
import { ShieldCheck, UserCheck, FlaskConical, Pill, Calendar, HeartPulse, Filter } from 'lucide-react';

interface HealthTimelineProps {
  records: PatientHealthRecord[];
  onSelectRecord?: (record: PatientHealthRecord) => void;
}

export const HealthTimeline: React.FC<HealthTimelineProps> = ({ records, onSelectRecord }) => {
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Doctor', 'Lab', 'Pharmacy', 'Prescription', 'Consultation'];

  const filteredRecords = records.filter((r) => {
    if (filter === 'All') return true;
    if (filter === 'Doctor') return r.badgeType === 'doctor';
    if (filter === 'Lab') return r.badgeType === 'lab';
    if (filter === 'Pharmacy') return r.badgeType === 'pharmacy';
    if (filter === 'Prescription') return r.category === 'Prescription';
    if (filter === 'Consultation') return r.category === 'Consultation';
    return true;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Consultation':
        return <UserCheck size={16} style={{ color: 'var(--p-primary)' }} />;
      case 'Lab':
        return <FlaskConical size={16} style={{ color: '#0284C7' }} />;
      case 'Pharmacy':
        return <Pill size={16} style={{ color: 'var(--p-success)' }} />;
      case 'Prescription':
        return <Calendar size={16} style={{ color: 'var(--p-purple)' }} />;
      default:
        return <HeartPulse size={16} style={{ color: 'var(--p-primary)' }} />;
    }
  };

  const getBadgeClass = (badge: string) => {
    switch (badge) {
      case 'doctor':
        return 'patient-badge-teal';
      case 'lab':
        return 'patient-badge-neutral';
      case 'pharmacy':
        return 'patient-badge-success';
      default:
        return 'patient-badge-purple';
    }
  };

  return (
    <div className="patient-card p-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 border-bottom pb-3" style={{ borderColor: 'var(--p-border-subtle)' }}>
        <div>
          <h5 className="font-heading mb-1" style={{ fontSize: '1.15rem' }}>My Health Journey Timeline</h5>
          <p className="text-muted mb-0" style={{ fontSize: '0.82rem' }}>
            Chronological, cryptographically verifiable unified clinical history
          </p>
        </div>

        <div className="d-flex flex-wrap gap-1 align-items-center">
          <Filter size={14} className="text-muted me-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              className={`patient-btn patient-btn-sm ${filter === cat ? 'patient-btn-primary' : 'patient-btn-outline'}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="position-relative">
        {filteredRecords.map((item) => (
          <div key={item.id} className="patient-timeline-item">
            <div className="patient-timeline-dot" />
            <div
              className="p-3 rounded border patient-card-hover"
              style={{
                backgroundColor: 'var(--p-surface)',
                borderColor: 'var(--p-border)',
                cursor: onSelectRecord ? 'pointer' : 'default'
              }}
              onClick={() => onSelectRecord && onSelectRecord(item)}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-2">
                  {getCategoryIcon(item.category)}
                  <span className="fw-bold" style={{ fontSize: '0.92rem', color: 'var(--p-text-main)' }}>
                    {item.title}
                  </span>
                  <span className={`patient-badge ${getBadgeClass(item.badgeType)}`}>
                    {item.category}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.78rem' }}>
                  <span>{item.date}</span>
                  <span>{item.time}</span>
                  {item.verified && (
                    <span className="text-success d-flex align-items-center gap-1 fw-semibold">
                      <ShieldCheck size={13} /> Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                <strong>Provider:</strong> {item.provider}
              </div>

              <p className="mb-0 text-muted" style={{ fontSize: '0.82rem', lineHeight: 1.45 }}>
                {item.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
