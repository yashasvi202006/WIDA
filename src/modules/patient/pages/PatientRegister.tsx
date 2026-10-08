import React, { useState } from 'react';
import { Activity, ShieldCheck, Lock, User, Phone, Mail, Calendar, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { PatientProfile } from '../types/patientTypes';
import { patientApiService } from '../services/patientApiService';

interface PatientRegisterProps {
  onRegisterSuccess: (newProfile: PatientProfile) => void;
  onNavigateLogin: () => void;
}

export const PatientRegister: React.FC<PatientRegisterProps> = ({
  onRegisterSuccess,
  onNavigateLogin
}) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('2000-01-01');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');

  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('None');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consentAbdm, setConsentAbdm] = useState(true);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!name.trim()) {
      setError('Please enter your full legal name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter a valid mobile number for ABHA verification.');
      return;
    }
    setError('');
    setStep(2);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!consentAbdm) {
      setError('Consent to ABDM health records framework is required.');
      return;
    }

    const randomAbha = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProfile: PatientProfile = {
      id: `pat-${Date.now()}`,
      abhaId: randomAbha,
      name,
      gender,
      bloodGroup,
      dob,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@wida.health`,
      address: 'New Delhi, India',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      emergencyContact: {
        name: 'Primary Contact',
        relationship: 'Guardian',
        phone: phone || '+91 98765 43210'
      },
      allergies: allergies.toLowerCase() === 'none' ? [] : allergies.split(',').map((s) => s.trim()),
      chronicConditions: [],
      currentMedications: [],
      height: '175 cm',
      weight: '68 kg',
      bmi: '22.2',
      lifestyle: {
        smoking: 'Non-smoker',
        alcohol: 'Non-drinker',
        activityLevel: 'Moderate'
      }
    };

    setIsLoading(true);
    try {
      const res = await patientApiService.register(newProfile);
      onRegisterSuccess(res.user);
    } catch {
      onRegisterSuccess(newProfile);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 p-3"
      style={{
        backgroundColor: 'var(--p-bg, #F7FAFA)',
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(13, 148, 136, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.06) 0px, transparent 50%)'
      }}
    >
      <div style={{ maxWidth: 500, width: '100%' }}>
        {/* Brand Header */}
        <div className="text-center mb-3">
          <div
            className="d-inline-flex align-items-center justify-content-center mb-2"
            style={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: 'var(--p-primary, #0D9488)',
              color: '#ffffff',
              boxShadow: '0 8px 16px -4px rgba(13, 148, 136, 0.35)'
            }}
          >
            <Activity size={26} />
          </div>
          <h2 className="font-heading fw-bold mb-1" style={{ color: 'var(--p-text-main, #172033)' }}>
            WIDA<span style={{ color: 'var(--p-primary, #0D9488)' }}>.health</span>
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
            ABHA Digital Health Card Registration
          </p>
        </div>

        {/* Card */}
        <div className="patient-card p-4 shadow-sm border">
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <div>
              <h5 className="font-heading mb-0" style={{ fontSize: '1.1rem' }}>Create Account</h5>
              <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                {step === 1 ? 'Step 1: Personal Demographics' : 'Step 2: Clinical Baseline & Security'}
              </span>
            </div>
            <span className="patient-badge patient-badge-teal d-flex align-items-center gap-1">
              <ShieldCheck size={12} /> ABDM Gateway
            </span>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.82rem' }}>
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="d-flex flex-column gap-3">
              <div>
                <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>Full Legal Name</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="patient-input"
                    style={{ paddingLeft: '2.4rem' }}
                    placeholder="e.g. Yashasvi Saini"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <User size={16} className="position-absolute text-muted" style={{ left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="row g-2">
                <div className="col-sm-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>Mobile Number</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="patient-input"
                      style={{ paddingLeft: '2.4rem' }}
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <Phone size={16} className="position-absolute text-muted" style={{ left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>
                <div className="col-sm-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>Date of Birth</label>
                  <div className="position-relative">
                    <input
                      type="date"
                      className="patient-input"
                      style={{ paddingLeft: '2.4rem' }}
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                    <Calendar size={16} className="position-absolute text-muted" style={{ left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>
              </div>

              <div className="row g-2">
                <div className="col-sm-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>Gender</label>
                  <select
                    className="patient-input"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-sm-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>Email (Optional)</label>
                  <div className="position-relative">
                    <input
                      type="email"
                      className="patient-input"
                      style={{ paddingLeft: '2.4rem' }}
                      placeholder="patient@wida.health"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail size={16} className="position-absolute text-muted" style={{ left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="patient-btn patient-btn-primary w-100 py-2 mt-2 justify-content-center"
                onClick={handleNext}
              >
                <span>Continue to Step 2</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleRegister} className="d-flex flex-column gap-3">
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>Blood Group</label>
                  <select
                    className="patient-input"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>Known Allergies</label>
                  <input
                    type="text"
                    className="patient-input"
                    placeholder="e.g. Penicillin, Pollen (or None)"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>Account Password</label>
                <div className="position-relative">
                  <input
                    type="password"
                    className="patient-input"
                    style={{ paddingLeft: '2.4rem' }}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock size={16} className="position-absolute text-muted" style={{ left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div>
                <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>Confirm Password</label>
                <div className="position-relative">
                  <input
                    type="password"
                    className="patient-input"
                    style={{ paddingLeft: '2.4rem' }}
                    placeholder="Re-type password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Lock size={16} className="position-absolute text-muted" style={{ left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="p-2 rounded border" style={{ backgroundColor: 'var(--p-surface-alt)', fontSize: '0.78rem' }}>
                <label className="d-flex align-items-start gap-2 mb-0" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    className="form-check-input mt-1"
                    checked={consentAbdm}
                    onChange={(e) => setConsentAbdm(e.target.checked)}
                  />
                  <span>
                    I consent to linking my clinical records to the Ayushman Bharat Digital Mission (ABDM) and generate my unique ABHA Health ID.
                  </span>
                </label>
              </div>

              <div className="d-flex gap-2 mt-2">
                <button
                  type="button"
                  className="patient-btn patient-btn-outline py-2"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="patient-btn patient-btn-primary flex-fill py-2 justify-content-center"
                >
                  <CheckCircle2 size={16} /> {isLoading ? 'Registering with ABHA...' : 'Generate ABHA & Register'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Switch to Login */}
        <div className="text-center mt-3" style={{ fontSize: '0.85rem' }}>
          <span className="text-muted">Already registered with ABHA? </span>
          <button
            type="button"
            className="border-0 bg-transparent fw-bold p-0 text-teal"
            style={{ color: 'var(--p-primary, #0D9488)', cursor: 'pointer' }}
            onClick={onNavigateLogin}
          >
            Sign In Here →
          </button>
        </div>
      </div>
    </div>
  );
};
