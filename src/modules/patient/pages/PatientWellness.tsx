import React, { useState } from 'react';
import type { PatientWearable, PatientWellnessMetric } from '../types/patientTypes';
import { WellnessWidget } from '../components/WellnessWidget';
import { BookOpen } from 'lucide-react';

interface PatientWellnessProps {
  wearable: PatientWearable;
  metrics: PatientWellnessMetric[];
}

export const PatientWellness: React.FC<PatientWellnessProps> = ({ wearable, metrics }) => {
  const [selectedHygiene, setSelectedHygiene] = useState<string>('Oral Hygiene');

  const hygieneTopics = [
    {
      title: 'Oral Hygiene',
      icon: '🪥',
      summary: 'Brush twice daily for two full minutes using fluoridated paste. Clean interdentally with floss daily to prevent plaque accumulation and periodontal inflammation.'
    },
    {
      title: 'Skin Care',
      icon: '🧴',
      summary: 'Cleanse with a mild soap-free cleanser. Apply broad-spectrum SPF 30+ sunscreen daily. Maintain skin barrier hydration especially in dry winter climates.'
    },
    {
      title: 'Hand Hygiene',
      icon: '🧼',
      summary: 'Wash hands thoroughly with soap for at least 20 seconds before meals, after using restrooms, and after returning from public clinics.'
    },
    {
      title: 'Hair Care',
      icon: '💆',
      summary: 'Maintain scalp sebum balance by gentle washing 2-3 times per week. Avoid high-heat drying to preserve hair follicle cuticle integrity.'
    },
    {
      title: 'Sleep Hygiene',
      icon: '🌙',
      summary: 'Maintain consistent sleep-wake cycles. Limit blue-light exposure 45 minutes prior to sleep and keep ambient room temperatures between 18-21°C.'
    },
    {
      title: 'General Hygiene',
      icon: '🛁',
      summary: 'Daily bathing, washing clothes regularly, and sanitizing frequently touched devices like smartphones prevents microbial colonisation.'
    }
  ];

  const currentTopic = hygieneTopics.find((t) => t.title === selectedHygiene) || hygieneTopics[0];

  return (
    <div className="patient-wellness d-flex flex-column gap-4">
      <div>
        <h3 className="font-heading mb-1">Personal Wellness & Preventive Health</h3>
        <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
          Real-time wearable tracking, wellness score indexing, and evidence-based personal hygiene guidance
        </p>
      </div>

      {/* Wellness Index & Wearable Sync */}
      <WellnessWidget wearable={wearable} onSync={() => alert('Wearable biometric metrics synchronized.')} />

      {/* Tracked Wellness Metrics */}
      {metrics && metrics.length > 0 && (
        <div className="row g-3">
          {metrics.map((m) => (
            <div key={m.id} className="col-sm-6 col-lg-3">
              <div className="patient-card p-3 h-100">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>{m.name}</span>
                  <span className={`patient-badge ${m.status === 'Optimal' || m.status === 'Normal' ? 'patient-badge-teal' : 'patient-badge-warning'}`}>
                    {m.status}
                  </span>
                </div>
                <div className="d-flex align-items-baseline gap-1 mb-1">
                  <span className="fw-bold font-heading" style={{ fontSize: '1.35rem' }}>{m.value}</span>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>{m.unit}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
                  <span>{m.trend}</span>
                  {m.target && <span>Goal: {m.target}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Educational Personal Hygiene Section */}
      <div className="patient-card p-4">
        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: 'var(--p-border-subtle)' }}>
          <div className="d-flex align-items-center gap-2">
            <BookOpen size={18} style={{ color: 'var(--p-primary)' }} />
            <h5 className="font-heading mb-0" style={{ fontSize: '1.05rem' }}>Personal Hygiene Education & Guidelines</h5>
          </div>
          <span className="patient-badge patient-badge-teal">Informational & Preventive</span>
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <div className="d-flex flex-column gap-1">
              {hygieneTopics.map((topic) => (
                <button
                  key={topic.title}
                  className={`patient-btn text-start justify-content-start py-2 ${
                    selectedHygiene === topic.title ? 'patient-btn-primary' : 'patient-btn-outline'
                  }`}
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => setSelectedHygiene(topic.title)}
                >
                  <span className="me-2">{topic.icon}</span>
                  {topic.title}
                </button>
              ))}
            </div>
          </div>

          <div className="col-md-8">
            <div className="p-4 rounded border h-100" style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span style={{ fontSize: '1.5rem' }}>{currentTopic.icon}</span>
                <h5 className="font-heading mb-0">{currentTopic.title} Routine</h5>
              </div>
              <p className="text-muted mb-3" style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>
                {currentTopic.summary}
              </p>

              <div className="p-2 rounded bg-white border" style={{ fontSize: '0.78rem', color: 'var(--p-text-muted)' }}>
                <strong>Clinical Note:</strong> These preventive hygiene routines are educational recommendations to support holistic well-being and are non-diagnostic.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
