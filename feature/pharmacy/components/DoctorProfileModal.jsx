import React from 'react';

export const DoctorProfileModal = ({ user, onClose, onEditProfile, onLogout }) => {
    if (!user) return null;

    const initials = (user.fullName || 'Dr. Doctor')
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div style={modalStyles.overlay} onClick={onClose}>
            <div style={modalStyles.card} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button style={modalStyles.closeBtn} onClick={onClose} title="Close Profile">
                    ✕
                </button>

                {/* Banner Header */}
                <div style={modalStyles.banner}>
                    <div style={modalStyles.avatarContainer}>
                        {user.profileImage ? (
                            <img src={user.profileImage} alt={user.fullName} style={modalStyles.avatarImg} />
                        ) : (
                            <div style={modalStyles.avatarInitials}>{initials}</div>
                        )}
                        <span style={modalStyles.activeDot} title="Online & Authorized Session" />
                    </div>
                </div>

                {/* Doctor Identity */}
                <div style={modalStyles.body}>
                    <div style={modalStyles.identitySection}>
                        <h2 style={modalStyles.doctorName}>{user.fullName}</h2>
                        <div style={modalStyles.roleBadge}>
                            {user.role || 'Clinical Specialist'}
                        </div>
                        <p style={modalStyles.subText}>
                            {user.specialization || 'Clinical Pharmacology & Pharmacy Management'}
                        </p>
                    </div>

                    <div style={modalStyles.divider} />

                    {/* Details Grid */}
                    <div style={modalStyles.grid}>
                        <div style={modalStyles.infoBox}>
                            <span style={modalStyles.label}>🪪 Doctor / User ID</span>
                            <span style={modalStyles.value}>{user.id || 'DOC-1001'}</span>
                        </div>

                        <div style={modalStyles.infoBox}>
                            <span style={modalStyles.label}>📜 Medical License</span>
                            <span style={modalStyles.value}>{user.licenseNumber || 'WIDA-PH-8092'}</span>
                        </div>

                        <div style={modalStyles.infoBox}>
                            <span style={modalStyles.label}>✉️ Email Address</span>
                            <span style={modalStyles.value}>{user.email}</span>
                        </div>

                        <div style={modalStyles.infoBox}>
                            <span style={modalStyles.label}>📞 Contact Phone</span>
                            <span style={modalStyles.value}>{user.phone || '+91 98765 43210'}</span>
                        </div>

                        <div style={modalStyles.infoBox}>
                            <span style={modalStyles.label}>🎓 Qualifications</span>
                            <span style={modalStyles.value}>{user.qualifications || 'PharmD, MBBS, MD'}</span>
                        </div>

                        <div style={modalStyles.infoBox}>
                            <span style={modalStyles.label}>⏱️ Experience</span>
                            <span style={modalStyles.value}>{user.experience || '12+ Years Clinical Practice'}</span>
                        </div>

                        <div style={modalStyles.infoBox}>
                            <span style={modalStyles.label}>🏥 Department</span>
                            <span style={modalStyles.value}>{user.department || 'Central Pharmacy & Clinical Care'}</span>
                        </div>

                        <div style={modalStyles.infoBox}>
                            <span style={modalStyles.label}>🏬 Facility</span>
                            <span style={modalStyles.value}>{user.pharmacyName || 'WIDA Ecosystem Hospital & Pharmacy'}</span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div style={modalStyles.footerActions}>
                        <button style={modalStyles.editBtn} onClick={onEditProfile}>
                            ✏️ Edit Profile Settings
                        </button>
                        <button style={modalStyles.logoutBtn} onClick={onLogout}>
                            🚪 Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
    },
    card: {
        width: '100%',
        maxWidth: '520px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(13, 148, 136, 0.15)',
        position: 'relative',
        animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    closeBtn: {
        position: 'absolute',
        top: '14px',
        right: '14px',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        color: '#ffffff',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        backdropFilter: 'blur(4px)',
        transition: 'all 0.2s ease',
    },
    banner: {
        height: '110px',
        background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
    },
    avatarContainer: {
        position: 'absolute',
        bottom: '-42px',
        width: '84px',
        height: '84px',
        borderRadius: '50%',
        border: '4px solid #ffffff',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
        backgroundColor: '#0d9488',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    avatarInitials: {
        color: '#ffffff',
        fontSize: '1.8rem',
        fontWeight: 800,
        fontFamily: "'Inter', sans-serif",
    },
    activeDot: {
        position: 'absolute',
        bottom: '4px',
        right: '4px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: '#10b981',
        border: '3px solid #ffffff',
        boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)',
    },
    body: {
        padding: '52px 28px 28px 28px',
    },
    identitySection: {
        textAlign: 'center',
    },
    doctorName: {
        fontSize: '1.45rem',
        fontWeight: 800,
        color: '#0f172a',
        marginBottom: '4px',
    },
    roleBadge: {
        display: 'inline-block',
        padding: '4px 14px',
        borderRadius: '20px',
        backgroundColor: '#e6f4f1',
        color: '#0d9488',
        fontSize: '0.82rem',
        fontWeight: 700,
        marginBottom: '6px',
    },
    subText: {
        fontSize: '0.82rem',
        color: '#64748b',
    },
    divider: {
        height: '1px',
        backgroundColor: '#e2e8f0',
        margin: '18px 0',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '24px',
    },
    infoBox: {
        backgroundColor: '#f8fafc',
        border: '1px solid #f1f5f9',
        borderRadius: '10px',
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    label: {
        fontSize: '0.72rem',
        fontWeight: 600,
        color: '#64748b',
    },
    value: {
        fontSize: '0.82rem',
        fontWeight: 700,
        color: '#0f172a',
        wordBreak: 'break-word',
    },
    footerActions: {
        display: 'flex',
        gap: '12px',
    },
    editBtn: {
        flex: 1,
        padding: '11px 0',
        borderRadius: '10px',
        border: '1px solid #cbd5e1',
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        fontSize: '0.85rem',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    logoutBtn: {
        flex: 1,
        padding: '11px 0',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        fontSize: '0.85rem',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    }
};
