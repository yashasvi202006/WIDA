import React from 'react';
import { LayoutDashboard, Calendar, UserCheck, MessageSquare, Sparkles, FileHeart, Pill, FlaskConical, Store, Activity, AlertTriangle, Landmark, Flower2, Bell, ShieldCheck, Settings, FolderLock, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
export const PatientSidebar = ({ currentTab, onSelectTab, collapsed, onToggleCollapse, patient, mobileOpen, onCloseMobile, onLogout }) => {
    const navSections = [
        {
            title: 'MAIN',
            items: [
                { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
                { id: 'appointments', label: 'Appointments', icon: <Calendar size={18}/> },
                { id: 'doctors', label: 'Doctors', icon: <UserCheck size={18}/> },
                { id: 'messages', label: 'Messages', icon: <MessageSquare size={18}/> },
                { id: 'ai-care', label: 'AI Care', icon: <Sparkles size={18} style={{ color: 'var(--p-purple)' }}/> }
            ]
        },
        {
            title: 'HEALTH',
            items: [
                { id: 'records', label: 'Health Records', icon: <FileHeart size={18}/> },
                { id: 'prescriptions', label: 'Prescriptions', icon: <Pill size={18}/> },
                { id: 'diagnostics', label: 'Diagnostics', icon: <FlaskConical size={18}/> },
                { id: 'pharmacy', label: 'Pharmacy', icon: <Store size={18}/> },
                { id: 'wellness', label: 'Wellness', icon: <Activity size={18}/> },
                { id: 'vault', label: 'Medical Vault', icon: <FolderLock size={18}/> }
            ]
        },
        {
            title: 'SERVICES',
            items: [
                {
                    id: 'emergency',
                    label: 'Emergency / SOS',
                    icon: <AlertTriangle size={18} className="text-danger"/>,
                    isDanger: true
                },
                { id: 'government', label: 'Gov Schemes', icon: <Landmark size={18}/> },
                { id: 'alternative', label: 'Alternative Med', icon: <Flower2 size={18} style={{ color: 'var(--p-purple)' }}/> }
            ]
        },
        {
            title: 'SYSTEM',
            items: [
                { id: 'notifications', label: 'Notifications', icon: <Bell size={18}/> },
                { id: 'privacy', label: 'Privacy & Consent', icon: <ShieldCheck size={18}/> },
                { id: 'settings', label: 'Settings', icon: <Settings size={18}/> }
            ]
        }
    ];
    return (<aside className={`patient-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`} aria-label="Patient Portal Navigation">
      {/* Brand Header */}
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom" style={{ height: 72, borderColor: 'var(--p-border)' }}>
        <div className="d-flex align-items-center gap-2 overflow-hidden">
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--p-radius-md)',
            backgroundColor: 'var(--p-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0
        }}>
            <Activity size={22}/>
          </div>
          {!collapsed && (<div>
              <div className="fw-bold font-heading" style={{ fontSize: '1.15rem', color: 'var(--p-text-main)', letterSpacing: '-0.02em' }}>
                WIDA<span style={{ color: 'var(--p-primary)' }}>.health</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--p-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Integrated Ecosystem
              </div>
            </div>)}
        </div>

        <button onClick={onToggleCollapse} className="border-0 bg-transparent text-muted p-1 d-none d-lg-block" style={{ cursor: 'pointer' }} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-fill py-2" style={{ overflowY: 'auto' }}>
        {navSections.map((sec) => (<div key={sec.title} className="mb-2">
            {!collapsed && <div className="patient-section-label">{sec.title}</div>}
            {sec.items.map((item) => {
                const isActive = currentTab === item.id;
                return (<button key={item.id} onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                    }} className={`patient-nav-item ${isActive ? 'active' : ''} ${item.isDanger ? 'text-danger' : ''}`} title={collapsed ? item.label : undefined}>
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && (<span className="flex-fill text-truncate" style={{ fontSize: '0.88rem' }}>
                      {item.label}
                    </span>)}
                  {!collapsed && item.isDanger && (<span className="patient-badge patient-badge-danger" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                      SOS
                    </span>)}
                </button>);
            })}
          </div>))}
      </div>

      {/* Bottom Profile Section */}
      <div className="p-3 border-top mt-auto" style={{ borderColor: 'var(--p-border)', backgroundColor: 'var(--p-surface-alt)' }}>
        <div className="d-flex align-items-center justify-content-between gap-1">
          <div className="d-flex align-items-center gap-2 overflow-hidden flex-fill" onClick={() => onSelectTab('profile')} style={{ cursor: 'pointer' }}>
            <img src={patient.avatarUrl} alt={patient.name} onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=0D9488&color=fff&bold=true`;
        }} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}/>
            {!collapsed && (<div className="flex-fill overflow-hidden">
                <div className="fw-semibold text-truncate" style={{ fontSize: '0.85rem', color: 'var(--p-text-main)' }}>
                  {patient.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--p-text-muted)' }} className="text-truncate">
                  ABHA: {patient.abhaId}
                </div>
              </div>)}
          </div>
          {!collapsed && onLogout && (<button onClick={onLogout} className="border-0 bg-transparent text-muted p-1 rounded hover-danger" style={{ cursor: 'pointer' }} title="Sign Out" aria-label="Sign Out">
              <LogOut size={16}/>
            </button>)}
        </div>
      </div>
    </aside>);
};
