import React, { useState } from 'react';
import type { PatientNotification, PatientNotificationType } from '../types/patientTypes';
import { Bell, Check, Trash2, Calendar, Pill, FlaskConical, AlertTriangle, ShieldCheck, HeartPulse } from 'lucide-react';

interface PatientNotificationsProps {
  notifications: PatientNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onNavigateTab: (tabId: string) => void;
}

export const PatientNotifications: React.FC<PatientNotificationsProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onNavigateTab
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = [
    'All',
    'Appointments',
    'Medicines',
    'Diagnostics',
    'Pharmacy',
    'Wellness',
    'Security',
    'Emergency'
  ];

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Appointments') return n.type === 'appointment';
    if (activeFilter === 'Medicines') return n.type === 'medicine';
    if (activeFilter === 'Diagnostics') return n.type === 'diagnostic';
    if (activeFilter === 'Pharmacy') return n.type === 'pharmacy';
    if (activeFilter === 'Wellness') return n.type === 'wellness';
    if (activeFilter === 'Security') return n.type === 'security';
    if (activeFilter === 'Emergency') return n.type === 'emergency';
    return true;
  });

  const getIcon = (type: PatientNotificationType) => {
    switch (type) {
      case 'appointment':
        return <Calendar size={18} style={{ color: 'var(--p-primary)' }} />;
      case 'medicine':
        return <Pill size={18} style={{ color: 'var(--p-primary)' }} />;
      case 'diagnostic':
        return <FlaskConical size={18} style={{ color: '#0284C7' }} />;
      case 'emergency':
        return <AlertTriangle size={18} style={{ color: 'var(--p-danger)' }} />;
      case 'security':
        return <ShieldCheck size={18} style={{ color: 'var(--p-purple)' }} />;
      default:
        return <HeartPulse size={18} style={{ color: 'var(--p-primary)' }} />;
    }
  };

  return (
    <div className="patient-notifications d-flex flex-column gap-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h3 className="font-heading mb-1">Notification Center</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Event-driven clinical alerts, appointments, lab results, and pharmacy status updates
          </p>
        </div>

        <button className="patient-btn patient-btn-outline" onClick={onMarkAllAsRead}>
          <Check size={14} /> Mark All as Read
        </button>
      </div>

      {/* Tabs */}
      <div className="patient-card p-3 d-flex flex-wrap gap-1">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`patient-btn patient-btn-sm ${activeFilter === cat ? 'patient-btn-primary' : 'patient-btn-outline'}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="patient-card p-5 text-center text-muted">
          <Bell size={40} className="mb-2 text-muted mx-auto" />
          <h5 className="font-heading">You're all caught up</h5>
          <p style={{ fontSize: '0.85rem' }}>No notifications found under {activeFilter.toLowerCase()}.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {filtered.map((n) => (
            <div
              key={n.id}
              className="patient-card p-3 d-flex align-items-center justify-content-between gap-3 patient-card-hover"
              style={{
                backgroundColor: !n.isRead ? 'var(--p-primary-subtle)' : 'var(--p-surface)',
                borderLeft: !n.isRead ? '4px solid var(--p-primary)' : '1px solid var(--p-border)'
              }}
            >
              <div className="d-flex align-items-start gap-3">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'var(--p-surface)',
                    border: '1px solid var(--p-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {getIcon(n.type)}
                </div>

                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`fw-${!n.isRead ? 'bold' : 'normal'}`} style={{ fontSize: '0.92rem', color: 'var(--p-text-main)' }}>
                      {n.title}
                    </span>
                    {!n.isRead && (
                      <span className="patient-badge patient-badge-teal" style={{ fontSize: '0.65rem' }}>
                        New
                      </span>
                    )}
                    {n.priority === 'urgent' && (
                      <span className="patient-badge patient-badge-danger" style={{ fontSize: '0.65rem' }}>
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="mb-1 text-muted" style={{ fontSize: '0.82rem' }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--p-text-subtle)' }}>
                    {n.timestamp}
                  </span>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                {n.actionUrl && (
                  <button
                    className="patient-btn patient-btn-soft patient-btn-sm"
                    onClick={() => onNavigateTab(n.actionUrl!)}
                  >
                    View Details
                  </button>
                )}
                {!n.isRead && (
                  <button
                    className="patient-btn patient-btn-outline patient-btn-sm"
                    onClick={() => onMarkAsRead(n.id)}
                    title="Mark as read"
                  >
                    <Check size={13} />
                  </button>
                )}
                <button
                  className="patient-btn patient-btn-outline patient-btn-sm text-muted"
                  onClick={() => onDeleteNotification(n.id)}
                  title="Delete notification"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
