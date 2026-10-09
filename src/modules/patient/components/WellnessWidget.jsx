import React, { useState } from 'react';
import { Activity, Watch, Droplets, Moon, Footprints, RefreshCw, Sparkles } from 'lucide-react';
export const WellnessWidget = ({ wearable, onSync }) => {
    const [isSyncing, setIsSyncing] = useState(false);
    const handleSyncClick = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            if (onSync)
                onSync();
        }, 1000);
    };
    return (<div className="patient-card p-4">
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: 'var(--p-border-subtle)' }}>
        <div className="d-flex align-items-center gap-2">
          <Activity size={18} style={{ color: 'var(--p-primary)' }}/>
          <h5 className="font-heading mb-0" style={{ fontSize: '1.05rem' }}>Personal Wellness Index</h5>
        </div>
        <span className="patient-badge patient-badge-teal">Daily Target 85%</span>
      </div>

      <div className="row align-items-center mb-4">
        <div className="col-sm-5 text-center py-2 border-end" style={{ borderColor: 'var(--p-border-subtle)' }}>
          <div className="d-inline-flex flex-column align-items-center justify-content-center rounded-circle border" style={{
            width: 100,
            height: 100,
            borderColor: 'var(--p-primary)',
            boxShadow: '0 0 15px rgba(13, 148, 136, 0.2)'
        }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--p-primary)' }}>78</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--p-text-muted)' }}>/ 100</span>
          </div>
          <div className="mt-2 fw-semibold" style={{ fontSize: '0.85rem' }}>General Wellness Score</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--p-text-subtle)' }}>
            General wellness indicator — not a clinical medical assessment.
          </div>
        </div>

        <div className="col-sm-7 ps-sm-4">
          <div className="d-flex flex-column gap-2" style={{ fontSize: '0.82rem' }}>
            <div>
              <div className="d-flex justify-content-between mb-1">
                <span className="d-flex align-items-center gap-1">
                  <Footprints size={13} style={{ color: 'var(--p-primary)' }}/> Steps
                </span>
                <span className="fw-bold">{wearable.metrics.steps} / 10,000</span>
              </div>
              <div className="progress" style={{ height: 6 }}>
                <div className="progress-bar" style={{ width: `${(wearable.metrics.steps / 10000) * 100}%`, backgroundColor: 'var(--p-primary)' }}/>
              </div>
            </div>

            <div>
              <div className="d-flex justify-content-between mb-1">
                <span className="d-flex align-items-center gap-1">
                  <Moon size={13} style={{ color: 'var(--p-purple)' }}/> Sleep Quality
                </span>
                <span className="fw-bold">{wearable.metrics.sleepHours} hrs (Optimal)</span>
              </div>
              <div className="progress" style={{ height: 6 }}>
                <div className="progress-bar" style={{ width: '85%', backgroundColor: 'var(--p-purple)' }}/>
              </div>
            </div>

            <div>
              <div className="d-flex justify-content-between mb-1">
                <span className="d-flex align-items-center gap-1">
                  <Droplets size={13} style={{ color: '#0284C7' }}/> Water Hydration
                </span>
                <span className="fw-bold">2.4L / 3.0L</span>
              </div>
              <div className="progress" style={{ height: 6 }}>
                <div className="progress-bar" style={{ width: '80%', backgroundColor: '#0284C7' }}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Wearable Status */}
      <div className="p-3 rounded mb-3 d-flex align-items-center justify-content-between" style={{ backgroundColor: 'var(--p-surface-alt)', border: '1px solid var(--p-border)' }}>
        <div className="d-flex align-items-center gap-3">
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--p-radius-md)',
            backgroundColor: 'var(--p-surface)',
            border: '1px solid var(--p-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--p-primary)'
        }}>
            <Watch size={20}/>
          </div>
          <div>
            <div className="fw-bold" style={{ fontSize: '0.88rem' }}>{wearable.name}</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--p-text-muted)' }}>
              Battery: {wearable.battery} • Last Synced: {wearable.lastSynced}
            </div>
          </div>
        </div>

        <button className="patient-btn patient-btn-outline patient-btn-sm" onClick={handleSyncClick} disabled={isSyncing}>
          <RefreshCw size={12} className={isSyncing ? 'spin-icon' : ''}/>
          {isSyncing ? 'Syncing...' : 'Sync Device'}
        </button>
      </div>

      {/* Daily Wellness Tip */}
      <div className="p-2 px-3 rounded d-flex align-items-center gap-2" style={{ backgroundColor: 'var(--p-primary-subtle)', color: 'var(--p-primary-dark)', fontSize: '0.78rem' }}>
        <Sparkles size={14} className="flex-shrink-0"/>
        <span>
          <strong>Daily Care Tip:</strong> Limiting dietary sodium intake under 2,000mg helps stabilize systolic blood pressure alongside your prescribed medication.
        </span>
      </div>
    </div>);
};
