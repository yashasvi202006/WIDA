import React, { useState } from 'react';
import { updateUserProfile, changePassword } from '../database/pharmacyDB';
export const ProfileUpdate = ({ user, onUserUpdate }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [profileForm, setProfileForm] = useState({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        pharmacyName: user.pharmacyName,
        licenseNumber: user.licenseNumber,
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [message, setMessage] = useState(null);
    const [saving, setSaving] = useState(false);
    const handleProfileChange = (e) => {
        setProfileForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setMessage(null);
    };
    const handlePasswordChange = (e) => {
        setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setMessage(null);
    };
    const saveProfile = (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        setTimeout(() => {
            const result = updateUserProfile(profileForm);
            setSaving(false);
            if (result.success && result.user) {
                setMessage({ type: 'success', text: '✅ Profile updated successfully!' });
                onUserUpdate(result.user);
            }
            else {
                setMessage({ type: 'error', text: result.message });
            }
        }, 500);
    };
    const savePassword = (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            setSaving(false);
            return;
        }
        setTimeout(() => {
            const result = changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            setSaving(false);
            if (result.success) {
                setMessage({ type: 'success', text: '✅ Password changed successfully!' });
                setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            }
            else {
                setMessage({ type: 'error', text: result.message });
            }
        }, 500);
    };
    const initials = user.fullName
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    return (<div style={s.page}>
      {/* Profile Header Card */}
      <div style={s.headerCard}>
        <div style={s.headerLeft}>
          <div style={s.avatarLarge}>{initials}</div>
          <div>
            <h2 style={s.userName}>{user.fullName}</h2>
            <p style={s.userRole}>{user.role}</p>
            <p style={s.userEmail}>{user.email}</p>
          </div>
        </div>
        <div style={s.headerRight}>
          <div style={s.statBox}>
            <span style={s.statLabel}>Member Since</span>
            <span style={s.statValue}>{new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}</span>
          </div>
          <div style={s.statBox}>
            <span style={s.statLabel}>Last Login</span>
            <span style={s.statValue}>{new Date(user.lastLogin).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          </div>
          <div style={s.statBox}>
            <span style={s.statLabel}>License</span>
            <span style={s.statValue}>{user.licenseNumber || 'Not Set'}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabBar}>
        {['profile', 'password', 'preferences'].map(tab => (<button key={tab} onClick={() => { setActiveTab(tab); setMessage(null); }} style={activeTab === tab ? { ...s.tab, ...s.tabActive } : s.tab}>
            {tab === 'profile' && '👤 '}
            {tab === 'password' && '🔐 '}
            {tab === 'preferences' && '⚙️ '}
            {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'profile' ? 'Details' : tab === 'password' ? 'Security' : ''}
          </button>))}
      </div>

      {/* Alert */}
      {message && (<div style={message.type === 'success' ? s.alertSuccess : s.alertError}>
          {message.text}
        </div>)}

      {/* Profile Tab */}
      {activeTab === 'profile' && (<form onSubmit={saveProfile} style={s.formCard}>
          <h3 style={s.sectionTitle}>Personal Information</h3>
          <div style={s.gridRow2}>
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input name="fullName" value={profileForm.fullName} onChange={handleProfileChange} required style={s.input}/>
            </div>
            <div style={s.field}>
              <label style={s.label}>Email Address</label>
              <input name="email" type="email" value={profileForm.email} onChange={handleProfileChange} required style={s.input}/>
            </div>
          </div>
          <div style={s.gridRow2}>
            <div style={s.field}>
              <label style={s.label}>Phone Number</label>
              <input name="phone" type="tel" value={profileForm.phone} onChange={handleProfileChange} style={s.input}/>
            </div>
            <div style={s.field}>
              <label style={s.label}>Role</label>
              <select name="role" value={profileForm.role} onChange={handleProfileChange} style={s.select}>
                <option value="Head Pharmacist">Head Pharmacist</option>
                <option value="Senior Pharmacist">Senior Pharmacist</option>
                <option value="Assistant Pharmacist">Assistant Pharmacist</option>
                <option value="Inventory Specialist">Inventory Specialist</option>
              </select>
            </div>
          </div>

          <h3 style={{ ...s.sectionTitle, marginTop: '24px' }}>Pharmacy Details</h3>
          <div style={s.gridRow2}>
            <div style={s.field}>
              <label style={s.label}>Pharmacy Name</label>
              <input name="pharmacyName" value={profileForm.pharmacyName} onChange={handleProfileChange} style={s.input}/>
            </div>
            <div style={s.field}>
              <label style={s.label}>License Number</label>
              <input name="licenseNumber" value={profileForm.licenseNumber} onChange={handleProfileChange} style={s.input} placeholder="PH-2026-XXXX"/>
            </div>
          </div>

          <div style={s.btnRow}>
            <button type="submit" disabled={saving} style={saving ? { ...s.saveBtn, opacity: 0.6 } : s.saveBtn}>
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>)}

      {/* Password Tab */}
      {activeTab === 'password' && (<form onSubmit={savePassword} style={s.formCard}>
          <h3 style={s.sectionTitle}>Change Password</h3>
          <p style={{ color: '#64748b', fontSize: '0.84rem', marginBottom: '18px' }}>
            Ensure your account stays secure by using a strong password.
          </p>
          <div style={s.field}>
            <label style={s.label}>Current Password</label>
            <input name="currentPassword" type="password" required value={passwordForm.currentPassword} onChange={handlePasswordChange} style={s.input}/>
          </div>
          <div style={s.gridRow2}>
            <div style={s.field}>
              <label style={s.label}>New Password</label>
              <input name="newPassword" type="password" required value={passwordForm.newPassword} onChange={handlePasswordChange} style={s.input} placeholder="Min 6 characters"/>
            </div>
            <div style={s.field}>
              <label style={s.label}>Confirm New Password</label>
              <input name="confirmNewPassword" type="password" required value={passwordForm.confirmNewPassword} onChange={handlePasswordChange} style={s.input}/>
            </div>
          </div>

          {/* Password strength visual */}
          {passwordForm.newPassword && (<div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[1, 2, 3, 4].map(i => {
                    const strength = passwordForm.newPassword.length >= 12 ? 4 : passwordForm.newPassword.length >= 8 ? 3 : passwordForm.newPassword.length >= 6 ? 2 : 1;
                    return (<div key={i} style={{
                            flex: 1, height: '4px', borderRadius: '2px',
                            background: i <= strength ? (strength >= 3 ? '#10b981' : strength >= 2 ? '#f59e0b' : '#ef4444') : '#e2e8f0',
                            transition: 'background 0.3s ease',
                        }}/>);
                })}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {passwordForm.newPassword.length < 6 ? 'Too short' : passwordForm.newPassword.length < 8 ? 'Fair' : passwordForm.newPassword.length < 12 ? 'Good' : 'Strong'}
              </span>
            </div>)}

          <div style={s.btnRow}>
            <button type="submit" disabled={saving} style={saving ? { ...s.saveBtn, opacity: 0.6 } : s.saveBtn}>
              {saving ? 'Updating...' : '🔐 Update Password'}
            </button>
          </div>
        </form>)}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (<div style={s.formCard}>
          <h3 style={s.sectionTitle}>Account Preferences</h3>
          <div style={s.prefRow}>
            <div>
              <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Email Notifications</strong>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>Receive stock alerts and order updates via email</p>
            </div>
            <ToggleSwitch defaultChecked/>
          </div>
          <div style={s.prefRow}>
            <div>
              <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Low Stock Alerts</strong>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>Get notified when medicines fall below reorder level</p>
            </div>
            <ToggleSwitch defaultChecked/>
          </div>
          <div style={s.prefRow}>
            <div>
              <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Expiry Reminders</strong>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>Receive 30-day advance expiry warnings</p>
            </div>
            <ToggleSwitch defaultChecked/>
          </div>
          <div style={s.prefRow}>
            <div>
              <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Dark Mode</strong>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>Use dark theme for the dashboard</p>
            </div>
            <ToggleSwitch defaultChecked={false}/>
          </div>
          <div style={s.prefRow}>
            <div>
              <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Two-Factor Authentication</strong>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>Add extra security to your account</p>
            </div>
            <ToggleSwitch defaultChecked={false}/>
          </div>
        </div>)}
    </div>);
};
// Simple toggle switch component
const ToggleSwitch = ({ defaultChecked = false }) => {
    const [on, setOn] = useState(defaultChecked);
    return (<div onClick={() => setOn(!on)} style={{
            width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer',
            background: on ? '#0d9488' : '#cbd5e1',
            position: 'relative', transition: 'background 0.2s ease', flexShrink: 0,
        }}>
      <div style={{
            width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
            position: 'absolute', top: '3px', left: on ? '23px' : '3px',
            transition: 'left 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}/>
    </div>);
};
// ---------- Styles ----------
const s = {
    page: {
        padding: '0',
    },
    headerCard: {
        background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
        borderRadius: '16px',
        padding: '28px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '20px',
        border: '1px solid #99f6e4',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    avatarLarge: {
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0d9488, #0f766e)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.6rem',
        fontWeight: 800,
        border: '3px solid #ffffff',
        boxShadow: '0 4px 12px rgba(13,148,136,0.3)',
    },
    userName: {
        fontSize: '1.35rem',
        fontWeight: 800,
        color: '#0f172a',
        margin: '0 0 2px 0',
    },
    userRole: {
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#0d9488',
        margin: '0 0 2px 0',
    },
    userEmail: {
        fontSize: '0.8rem',
        color: '#64748b',
        margin: 0,
    },
    headerRight: {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
    },
    statBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: '10px 16px',
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '10px',
        minWidth: '110px',
    },
    statLabel: {
        fontSize: '0.68rem',
        fontWeight: 600,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    statValue: {
        fontSize: '0.82rem',
        fontWeight: 700,
        color: '#0f172a',
    },
    tabBar: {
        display: 'flex',
        gap: '4px',
        background: '#f0fdfa',
        borderRadius: '12px',
        padding: '4px',
        marginBottom: '20px',
    },
    tab: {
        flex: 1,
        padding: '10px 0',
        border: 'none',
        borderRadius: '10px',
        fontSize: '0.84rem',
        fontWeight: 600,
        cursor: 'pointer',
        background: 'transparent',
        color: '#64748b',
        transition: 'all 0.2s ease',
        fontFamily: "'Inter', sans-serif",
    },
    tabActive: {
        background: '#ffffff',
        color: '#0d9488',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    alertSuccess: {
        background: '#ecfdf5',
        color: '#065f46',
        border: '1px solid #a7f3d0',
        borderRadius: '10px',
        padding: '12px 16px',
        fontSize: '0.84rem',
        marginBottom: '16px',
        fontWeight: 600,
    },
    alertError: {
        background: '#fef2f2',
        color: '#991b1b',
        border: '1px solid #fecaca',
        borderRadius: '10px',
        padding: '12px 16px',
        fontSize: '0.84rem',
        marginBottom: '16px',
        fontWeight: 600,
    },
    formCard: {
        background: '#ffffff',
        borderRadius: '16px',
        padding: '28px 32px',
        border: '1px solid #e2ecec',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
    },
    sectionTitle: {
        fontSize: '1rem',
        fontWeight: 700,
        color: '#0f172a',
        marginBottom: '16px',
        paddingBottom: '10px',
        borderBottom: '1px solid #e2ecec',
        margin: '0 0 16px 0',
    },
    gridRow2: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '16px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        marginBottom: '4px',
    },
    label: {
        fontSize: '0.78rem',
        fontWeight: 600,
        color: '#374151',
    },
    input: {
        padding: '10px 14px',
        border: '1.5px solid #d1e7e4',
        borderRadius: '10px',
        fontSize: '0.85rem',
        color: '#0f172a',
        background: '#f8fffe',
        fontFamily: "'Inter', sans-serif",
        outline: 'none',
        transition: 'border-color 0.2s ease',
    },
    select: {
        padding: '10px 14px',
        border: '1.5px solid #d1e7e4',
        borderRadius: '10px',
        fontSize: '0.85rem',
        color: '#0f172a',
        background: '#f8fffe',
        fontFamily: "'Inter', sans-serif",
        outline: 'none',
        cursor: 'pointer',
    },
    btnRow: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '20px',
    },
    saveBtn: {
        padding: '10px 28px',
        background: 'linear-gradient(135deg, #0d9488, #0f766e)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '0.88rem',
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        boxShadow: '0 4px 12px rgba(13,148,136,0.25)',
        transition: 'all 0.2s ease',
    },
    prefRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 0',
        borderBottom: '1px solid #f1f5f9',
        gap: '16px',
    },
};
