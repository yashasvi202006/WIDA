import React, { useState } from 'react';
export const NotificationsView = ({ notifications, onMarkAsRead, onClearAll }) => {
    const [filterType, setFilterType] = useState('all');
    const filtered = notifications.filter(n => {
        if (filterType === 'unread')
            return !n.read;
        if (filterType === 'high')
            return n.priority === 'high';
        return true;
    });
    return (<div className="ph-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            System Notifications & Alerts Hub
          </h2>
          <span className="card-subtitle">Real-time alerts for stock levels, expiry warnings, and incoming prescriptions</span>
        </div>

        <button className="btn-ph btn-ph-outline btn-ph-sm" onClick={onClearAll}>
          Mark All as Read
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button className={`btn-ph ${filterType === 'all' ? 'btn-ph-secondary' : 'btn-ph-outline'} btn-ph-sm`} onClick={() => setFilterType('all')}>
          All Notifications ({notifications.length})
        </button>
        <button className={`btn-ph ${filterType === 'unread' ? 'btn-ph-secondary' : 'btn-ph-outline'} btn-ph-sm`} onClick={() => setFilterType('unread')}>
          Unread ({notifications.filter(n => !n.read).length})
        </button>
        <button className={`btn-ph ${filterType === 'high' ? 'btn-ph-danger' : 'btn-ph-outline'} btn-ph-sm`} onClick={() => setFilterType('high')}>
          High Priority ({notifications.filter(n => n.priority === 'high').length})
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 ? (<div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
            No notifications match the active filter.
          </div>) : (filtered.map(n => (<div key={n.id} style={{
                padding: '14px 18px',
                borderRadius: '10px',
                backgroundColor: n.read ? '#ffffff' : '#f0fdfa',
                border: `1.5px solid ${n.priority === 'high' ? '#fca5a5' : n.read ? '#e2e8f0' : '#ccfbf1'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{n.title}</span>
                  <span className={`badge-ph ${n.priority === 'high' ? 'badge-danger' : 'badge-neutral'}`}>
                    {n.priority}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>{n.description}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>{n.timestamp}</div>
              </div>

              {!n.read && (<button className="btn-ph btn-ph-secondary btn-ph-sm" onClick={() => onMarkAsRead(n.id)}>
                  Mark Read
                </button>)}
            </div>)))}
      </div>
    </div>);
};
