import React from 'react';
import { Calendar, Pill, FlaskConical, AlertTriangle, ShieldCheck, HeartPulse, X } from 'lucide-react';
export const NotificationDropdown = ({ notifications, onMarkAsRead, onMarkAllAsRead, onViewAll, onClose }) => {
    const recent = notifications.slice(0, 5);
    const getIcon = (type) => {
        switch (type) {
            case 'appointment':
                return <Calendar size={14} style={{ color: 'var(--p-primary)' }}/>;
            case 'medicine':
                return <Pill size={14} style={{ color: 'var(--p-primary)' }}/>;
            case 'diagnostic':
                return <FlaskConical size={14} style={{ color: '#0284C7' }}/>;
            case 'emergency':
                return <AlertTriangle size={14} style={{ color: 'var(--p-danger)' }}/>;
            case 'security':
                return <ShieldCheck size={14} style={{ color: 'var(--p-purple)' }}/>;
            default:
                return <HeartPulse size={14} style={{ color: 'var(--p-primary)' }}/>;
        }
    };
    return (<div className="position-absolute end-0 mt-2 bg-white rounded shadow-lg border" style={{
            width: 340,
            zIndex: 1050,
            backgroundColor: 'var(--p-surface)',
            borderColor: 'var(--p-border)',
            borderRadius: 'var(--p-radius-lg)',
            overflow: 'hidden'
        }}>
      <div className="p-3 border-bottom d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--p-border-subtle)' }}>
        <h6 className="mb-0 font-heading" style={{ fontSize: '0.92rem' }}>Notifications</h6>
        <div className="d-flex align-items-center gap-2">
          <button onClick={onMarkAllAsRead} className="border-0 bg-transparent p-0 text-muted" style={{ fontSize: '0.75rem', cursor: 'pointer' }}>
            Mark all as read
          </button>
          <button onClick={onClose} className="border-0 bg-transparent p-0 text-muted" style={{ cursor: 'pointer', lineHeight: 1 }} aria-label="Close">
            <X size={15}/>
          </button>
        </div>
      </div>

      <div style={{ maxHeight: 340, overflowY: 'auto' }}>
        {recent.length === 0 ? (<div className="p-4 text-center text-muted" style={{ fontSize: '0.85rem' }}>
            You're all caught up!
          </div>) : (recent.map((n) => (<div key={n.id} onClick={() => onMarkAsRead(n.id)} className="p-3 border-bottom d-flex gap-2 align-items-start" style={{
                borderColor: 'var(--p-border-subtle)',
                backgroundColor: !n.isRead ? 'var(--p-primary-subtle)' : 'transparent',
                cursor: 'pointer'
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: 'var(--p-surface-alt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                {getIcon(n.type)}
              </div>
              <div className="flex-fill" style={{ fontSize: '0.82rem' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <span className={`fw-${!n.isRead ? 'bold' : 'normal'}`} style={{ color: 'var(--p-text-main)' }}>
                    {n.title}
                  </span>
                  {!n.isRead && (<span style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: 'var(--p-primary)',
                    display: 'inline-block'
                }}/>)}
                </div>
                <p className="mb-1 text-muted" style={{ fontSize: '0.75rem', lineHeight: 1.3 }}>
                  {n.message}
                </p>
                <span style={{ fontSize: '0.7rem', color: 'var(--p-text-subtle)' }}>{n.timestamp}</span>
              </div>
            </div>)))}
      </div>

      <div className="p-2 border-top text-center" style={{ borderColor: 'var(--p-border-subtle)', backgroundColor: 'var(--p-surface-alt)' }}>
        <button onClick={onViewAll} className="border-0 bg-transparent fw-bold" style={{ fontSize: '0.82rem', color: 'var(--p-primary)', cursor: 'pointer' }}>
          View all notifications →
        </button>
      </div>
    </div>);
};
