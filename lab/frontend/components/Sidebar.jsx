import React from 'react';
import {
    LayoutDashboard,
    BookOpen,
    CalendarCheck,
    TestTube2,
    FileCheck,
    Receipt,
    Share2,
    LogOut,
    ShieldCheck,
    Activity
} from 'lucide-react';

export const Sidebar = ({ activeSection, onSelectSection, onLogout, user, lab, counts = {} }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'catalogue', label: 'Test Catalogue', icon: BookOpen },
        { id: 'bookings', label: 'Bookings & Intake', icon: CalendarCheck, badge: counts.pendingBookings },
        { id: 'samples', label: 'Sample Processing', icon: TestTube2, badge: counts.unprocessedSamples },
        { id: 'reports', label: 'Diagnostic Reports', icon: FileCheck, badge: counts.pendingReports },
        { id: 'billing', label: 'Billing & Invoices', icon: Receipt },
        { id: 'integration', label: 'Patient & Doctor Hub', icon: Share2 }
    ];

    return (
        <aside className="lab-sidebar">
            <div className="lab-sidebar-brand">
                <div className="lab-brand-icon">
                    <Activity size={24} />
                </div>
                <div>
                    <div className="lab-brand-title">
                        WIDA<span style={{ color: 'var(--lab-primary)' }}>.lab</span>
                    </div>
                    <span className="lab-brand-badge">Diagnostic Portal</span>
                </div>
            </div>

            <nav className="lab-sidebar-nav">
                <div className="lab-nav-header">CLINICAL WORKFLOWS</div>
                {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={`lab-nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => onSelectSection(item.id)}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                            {item.badge > 0 && (
                                <span className="lab-nav-badge">{item.badge}</span>
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="lab-sidebar-footer">
                <div style={{ marginBottom: '0.85rem' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--lab-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {lab?.name || 'Diagnostic Laboratory'}
                    </div>
                    <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.74rem', color: 'var(--lab-text-secondary)', marginTop: '0.15rem' }}>
                        <ShieldCheck size={13} style={{ color: 'var(--lab-primary)' }} />
                        <span>{lab?.accreditation || 'NABL Accredited'}</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="lab-btn lab-btn-outline lab-btn-sm"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                    onClick={onLogout}
                >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};
