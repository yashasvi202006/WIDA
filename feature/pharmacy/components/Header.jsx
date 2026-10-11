import React, { useState } from 'react';

export const Header = ({
    notifications,
    onNotificationClick,
    searchTerm,
    setSearchTerm,
    currentUser,
    onOpenProfileModal,
    onNavigateProfile
}) => {
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    const doctorName = currentUser?.fullName || 'Dr. Yogita Chugh';
    const initials = doctorName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <header className="pharmacy-header" style={headerStyles.header}>
            {/* Left Header Title */}
            <div style={headerStyles.headerLeft}>
                <h1 style={headerStyles.title}>Pharmacy & Clinical Overview</h1>
                <span style={headerStyles.subtitle}>
                    WIDA Ecosystem • Pharmacy Portal
                </span>
            </div>

            {/* Center Search Bar */}
            <div style={headerStyles.headerCenter}>
                <div style={headerStyles.searchBox}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} style={{ color: '#94a3b8', flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        style={headerStyles.searchInput}
                        placeholder="Search doctors, reports, medicines..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Right Status & Doctor Profile Bar */}
            <div style={headerStyles.headerRight}>
                {/* Java DB Badge */}
                <div style={headerStyles.dbBadge}>
                    <span style={headerStyles.greenDot} />
                    <span>Java DB (8080) Active</span>
                </div>

                {/* AI Assistant Button */}
                <button
                    style={headerStyles.aiButton}
                    title="Open WIDA AI Healthcare Assistant"
                    onClick={() => alert('🤖 WIDA AI Healthcare Assistant ready! Ask about drug interactions, dosage calculators, or inventory forecasts.')}
                >
                    <span>🤖</span> AI Assistant
                </button>

                {/* Dark Mode Toggle */}
                <button
                    style={headerStyles.iconButton}
                    title="Toggle Theme"
                    onClick={() => setDarkMode(!darkMode)}
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>

                {/* Notifications Bell */}
                <div style={{ position: 'relative' }}>
                    <button
                        style={headerStyles.iconButton}
                        title="Notifications"
                        onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                    >
                        <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {unreadCount > 0 && <span style={headerStyles.notifBadge}>{unreadCount}</span>}
                    </button>

                    {showNotifDropdown && (
                        <div style={headerStyles.notifDropdown}>
                            <div style={headerStyles.notifHeader}>
                                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                                    Notifications ({unreadCount} unread)
                                </span>
                                <button
                                    style={headerStyles.viewAllBtn}
                                    onClick={() => {
                                        onNotificationClick();
                                        setShowNotifDropdown(false);
                                    }}
                                >
                                    View All
                                </button>
                            </div>

                            <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                                {notifications.slice(0, 4).map(n => (
                                    <div
                                        key={n.id}
                                        style={{
                                            padding: '10px 14px',
                                            borderBottom: '1px solid #f1f5f9',
                                            backgroundColor: n.read ? '#ffffff' : '#f0fdfa'
                                        }}
                                    >
                                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{n.title}</div>
                                        <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '2px' }}>{n.description}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>{n.timestamp}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Doctor Profile Widget (Clickable to open Full Profile Modal) */}
                <div
                    style={headerStyles.profileWidget}
                    onClick={onOpenProfileModal}
                    title="Click to view full Doctor Profile"
                >
                    {currentUser?.profileImage ? (
                        <img src={currentUser.profileImage} alt={doctorName} style={headerStyles.profileImg} />
                    ) : (
                        <div style={headerStyles.profileAvatar}>{initials}</div>
                    )}
                    <span style={headerStyles.doctorNameText}>{doctorName}</span>
                </div>
            </div>
        </header>
    );
};

const headerStyles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    },
    headerLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 800,
        color: '#0f172a',
        letterSpacing: '-0.3px',
    },
    subtitle: {
        fontSize: '0.76rem',
        color: '#64748b',
        fontWeight: 500,
    },
    headerCenter: {
        flex: 1,
        maxWidth: '420px',
    },
    searchBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '8px 16px',
        transition: 'all 0.2s ease',
    },
    searchInput: {
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        fontSize: '0.85rem',
        width: '100%',
        color: '#0f172a',
        fontFamily: "'Inter', sans-serif",
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    dbBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 12px',
        borderRadius: '16px',
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        color: '#166534',
        fontSize: '0.76rem',
        fontWeight: 700,
    },
    greenDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#16a34a',
        boxShadow: '0 0 6px rgba(22, 163, 74, 0.6)',
    },
    aiButton: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        border: '1px solid #0d9488',
        color: '#0d9488',
        fontSize: '0.78rem',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    iconButton: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        color: '#475569',
        fontSize: '1rem',
    },
    notifBadge: {
        position: 'absolute',
        top: '-2px',
        right: '-2px',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        backgroundColor: '#0d9488',
        color: '#ffffff',
        fontSize: '0.68rem',
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #ffffff',
    },
    notifDropdown: {
        position: 'absolute',
        right: 0,
        top: '44px',
        width: '320px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
        border: '1px solid #e2e8f0',
        zIndex: 60,
        overflow: 'hidden',
    },
    notifHeader: {
        padding: '10px 14px',
        backgroundColor: '#f0fdfa',
        borderBottom: '1px solid #cbd5e1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    viewAllBtn: {
        background: 'none',
        border: 'none',
        fontSize: '0.75rem',
        color: '#0d9488',
        fontWeight: 700,
        cursor: 'pointer',
    },
    profileWidget: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 10px 4px 4px',
        borderRadius: '20px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    profileAvatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#0369a1',
        color: '#ffffff',
        fontSize: '0.82rem',
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImg: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    doctorNameText: {
        fontSize: '0.85rem',
        fontWeight: 700,
        color: '#0f172a',
        whiteSpace: 'nowrap',
    },
};
