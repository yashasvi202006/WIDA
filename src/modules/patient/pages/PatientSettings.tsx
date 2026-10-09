import React, { useState } from 'react';
import { Bell, Moon, Sun, Shield, Check } from 'lucide-react';

interface PatientSettingsProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const PatientSettings: React.FC<PatientSettingsProps> = ({
  darkMode,
  onToggleDarkMode,
  onNavigateTab
}) => {
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [medicineReminders, setMedicineReminders] = useState(true);
  const [labAlerts, setLabAlerts] = useState(true);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [fontSize, setFontSize] = useState<'Default' | 'Large'>('Default');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="patient-settings d-flex flex-column gap-4">
      <div>
        <h3 className="font-heading mb-1">Preferences & Platform Settings</h3>
        <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
          Manage your notification channels, theme appearance, accessibility, and bilingual options
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="patient-card p-4">
        <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2" style={{ borderColor: 'var(--p-border-subtle)' }}>
          <Bell size={18} style={{ color: 'var(--p-primary)' }} />
          <h5 className="font-heading mb-0">Notification Channels & Delivery</h5>
        </div>

        <div className="d-flex flex-column gap-3" style={{ fontSize: '0.88rem' }}>
          <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
            <div>
              <div className="fw-semibold">In-App Notification Alerts</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Receive real-time banners and topbar badges</div>
            </div>
            <input
              type="checkbox"
              className="form-check-input"
              checked={inAppNotifs}
              onChange={(e) => setInAppNotifs(e.target.checked)}
            />
          </div>

          <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
            <div>
              <div className="fw-semibold">Medication Dosage Reminders</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Push daily dosage alerts per prescribed schedule</div>
            </div>
            <input
              type="checkbox"
              className="form-check-input"
              checked={medicineReminders}
              onChange={(e) => setMedicineReminders(e.target.checked)}
            />
          </div>

          <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
            <div>
              <div className="fw-semibold">Diagnostic Lab Report Readiness</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Notify immediately when certified PDF report is released</div>
            </div>
            <input
              type="checkbox"
              className="form-check-input"
              checked={labAlerts}
              onChange={(e) => setLabAlerts(e.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Appearance & Accessibility */}
      <div className="patient-card p-4">
        <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2" style={{ borderColor: 'var(--p-border-subtle)' }}>
          <Moon size={18} style={{ color: 'var(--p-primary)' }} />
          <h5 className="font-heading mb-0">Theme & Accessibility</h5>
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Display Theme</label>
            <div className="d-flex gap-2">
              <button
                className={`patient-btn flex-fill ${!darkMode ? 'patient-btn-primary' : 'patient-btn-outline'}`}
                onClick={onToggleDarkMode}
              >
                <Sun size={15} /> Light Theme
              </button>
              <button
                className={`patient-btn flex-fill ${darkMode ? 'patient-btn-primary' : 'patient-btn-outline'}`}
                onClick={onToggleDarkMode}
              >
                <Moon size={15} /> Dark Theme
              </button>
            </div>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Interface Language</label>
            <div className="d-flex gap-2">
              <button
                className={`patient-btn flex-fill ${language === 'English' ? 'patient-btn-primary' : 'patient-btn-outline'}`}
                onClick={() => setLanguage('English')}
              >
                English
              </button>
              <button
                className={`patient-btn flex-fill ${language === 'Hindi' ? 'patient-btn-primary' : 'patient-btn-outline'}`}
                onClick={() => setLanguage('Hindi')}
              >
                हिंदी (Hindi)
              </button>
            </div>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Text Size</label>
            <div className="d-flex gap-2">
              <button
                className={`patient-btn flex-fill ${fontSize === 'Default' ? 'patient-btn-primary' : 'patient-btn-outline'}`}
                onClick={() => setFontSize('Default')}
              >
                Default
              </button>
              <button
                className={`patient-btn flex-fill ${fontSize === 'Large' ? 'patient-btn-primary' : 'patient-btn-outline'}`}
                onClick={() => setFontSize('Large')}
              >
                Large
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & ABDM Integration Quick Link */}
      <div className="patient-card p-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <Shield size={20} style={{ color: 'var(--p-primary)' }} />
            <div>
              <h5 className="font-heading mb-0">ABDM Health Data & Privacy Controls</h5>
              <p className="text-muted mb-0" style={{ fontSize: '0.82rem' }}>Manage clinical consent granted to doctors, diagnostic labs, and pharmacies</p>
            </div>
          </div>
          <button className="patient-btn patient-btn-outline" onClick={() => onNavigateTab('privacy')}>
            Manage Consents
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <button className="patient-btn patient-btn-primary" onClick={handleSave}>
          <Check size={16} /> {savedSuccess ? 'Settings Saved Successfully!' : 'Save All Preferences'}
        </button>
      </div>
    </div>
  );
};
