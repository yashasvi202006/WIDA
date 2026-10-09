import React from 'react';
import type { PatientWellnessMetric } from '../types/patientTypes';
import { Activity, Heart, Droplets, Moon, Footprints, Zap } from 'lucide-react';

interface HealthMetricCardProps {
  metric: PatientWellnessMetric;
}

export const HealthMetricCard: React.FC<HealthMetricCardProps> = ({ metric }) => {
  const getIcon = () => {
    switch (metric.id) {
      case 'm-hr':
        return <Heart size={20} className="text-danger" />;
      case 'm-bp':
        return <Activity size={20} style={{ color: 'var(--p-primary)' }} />;
      case 'm-glucose':
        return <Zap size={20} style={{ color: 'var(--p-warning)' }} />;
      case 'm-sleep':
        return <Moon size={20} style={{ color: 'var(--p-purple)' }} />;
      case 'm-steps':
        return <Footprints size={20} style={{ color: 'var(--p-primary)' }} />;
      case 'm-hydration':
        return <Droplets size={20} style={{ color: '#0284C7' }} />;
      default:
        return <Activity size={20} />;
    }
  };

  const getStatusBadge = () => {
    switch (metric.status) {
      case 'Optimal':
        return <span className="patient-badge patient-badge-success">{metric.status}</span>;
      case 'Normal':
        return <span className="patient-badge patient-badge-teal">{metric.status}</span>;
      case 'Attention':
        return <span className="patient-badge patient-badge-warning">{metric.status}</span>;
      default:
        return <span className="patient-badge patient-badge-danger">{metric.status}</span>;
    }
  };

  return (
    <div className="patient-metric-card">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--p-radius-md)',
              backgroundColor: 'var(--p-surface-alt)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {getIcon()}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--p-text-muted)' }}>
            {metric.name}
          </span>
        </div>
        {getStatusBadge()}
      </div>

      <div className="my-2">
        <div className="d-flex align-items-baseline gap-1">
          <span style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--p-text-main)' }}>
            {metric.value}
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--p-text-subtle)' }}>
            {metric.unit}
          </span>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between pt-2 border-top" style={{ borderColor: 'var(--p-border-subtle)' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--p-text-muted)' }}>{metric.trend}</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--p-text-subtle)' }}>{metric.lastUpdated}</span>
      </div>
    </div>
  );
};
