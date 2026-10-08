import React, { useState } from 'react';
import type { PatientProfile as IPatientProfile } from '../types/patientTypes';
import { User, Heart, ShieldCheck, Phone, Mail, Calendar, Save } from 'lucide-react';

interface PatientProfileProps {
  profile: IPatientProfile;
  onUpdateProfile: (updates: Partial<IPatientProfile>) => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({ profile, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'health'>('personal');
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [weight, setWeight] = useState(profile.weight);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateProfile({ phone, address, weight });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="patient-profile d-flex flex-column gap-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h3 className="font-heading mb-1">Patient Identity & Clinical Profile</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Unified demographic registry and verified clinical baseline connected to your ABHA health account
          </p>
        </div>

        <button className="patient-btn patient-btn-primary" onClick={handleSave}>
          <Save size={14} /> {savedSuccess ? 'Changes Saved!' : 'Save Updates'}
        </button>
      </div>

      {/* Top Banner Card */}
      <div className="patient-card p-4">
        <div className="d-flex flex-wrap align-items-center gap-4">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=0D9488&color=fff&bold=true`;
            }}
            style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--p-primary)' }}
          />

          <div className="flex-fill">
            <div className="d-flex align-items-center gap-2 mb-1">
              <h4 className="font-heading mb-0">{profile.name}</h4>
              <span className="patient-badge patient-badge-teal">
                <ShieldCheck size={13} /> ABHA ID: {profile.abhaId}
              </span>
            </div>
            <div className="d-flex flex-wrap gap-3 text-muted" style={{ fontSize: '0.85rem' }}>
              <span className="d-flex align-items-center gap-1"><Mail size={13} /> {profile.email}</span>
              <span className="d-flex align-items-center gap-1"><Phone size={13} /> {profile.phone}</span>
              <span className="d-flex align-items-center gap-1"><Calendar size={13} /> DOB: {profile.dob}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="patient-card p-3 d-flex gap-2">
        <button
          className={`patient-btn ${activeTab === 'personal' ? 'patient-btn-primary' : 'patient-btn-outline'}`}
          onClick={() => setActiveTab('personal')}
        >
          <User size={14} /> Personal Demographic Profile
        </button>
        <button
          className={`patient-btn ${activeTab === 'health' ? 'patient-btn-primary' : 'patient-btn-outline'}`}
          onClick={() => setActiveTab('health')}
        >
          <Heart size={14} /> Clinical Health Profile & Allergies
        </button>
      </div>

      {/* Personal Tab */}
      {activeTab === 'personal' && (
        <div className="patient-card p-4">
          <h5 className="font-heading mb-3">Personal Contact Details</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Full Legal Name</label>
              <input type="text" className="patient-input" value={profile.name} disabled />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Gender</label>
              <input type="text" className="patient-input" value={profile.gender} disabled />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Primary Phone Number</label>
              <input type="text" className="patient-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Email Address</label>
              <input type="text" className="patient-input" value={profile.email} disabled />
            </div>
            <div className="col-12">
              <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Permanent Address</label>
              <input type="text" className="patient-input" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* Health Profile Tab */}
      {activeTab === 'health' && (
        <div className="patient-card p-4">
          <h5 className="font-heading mb-3">Clinical Baseline & Critical Indicators</h5>
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-md-3">
              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
                <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Blood Group</span>
                <span className="fw-bold text-danger fs-5">{profile.bloodGroup}</span>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
                <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Height</span>
                <span className="fw-bold fs-5">{profile.height}</span>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
                <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Weight</span>
                <input
                  type="text"
                  className="patient-input py-1 px-2 mt-1 fw-bold"
                  style={{ height: '32px' }}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
                <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>BMI Index</span>
                <span className="fw-bold fs-5 text-success">{profile.bmi}</span>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="p-3 rounded border h-100" style={{ backgroundColor: 'var(--p-surface)' }}>
                <h6 className="font-heading text-danger mb-2">Known Clinical Allergies</h6>
                <div className="d-flex flex-wrap gap-2">
                  {profile.allergies.map((alg) => (
                    <span key={alg} className="patient-badge patient-badge-danger">
                      {alg}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 rounded border h-100" style={{ backgroundColor: 'var(--p-surface)' }}>
                <h6 className="font-heading mb-2">Chronic Conditions Under Care</h6>
                <div className="d-flex flex-wrap gap-2">
                  {profile.chronicConditions.map((cond) => (
                    <span key={cond} className="patient-badge patient-badge-teal">
                      {cond}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 rounded border h-100" style={{ backgroundColor: 'var(--p-surface)' }}>
                <h6 className="font-heading mb-2">Current Regimen Medications</h6>
                <ul className="mb-0 ps-3 text-muted" style={{ fontSize: '0.85rem' }}>
                  {profile.currentMedications.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 rounded border h-100" style={{ backgroundColor: 'var(--p-surface)' }}>
                <h6 className="font-heading mb-2">Emergency Primary Contact</h6>
                <div style={{ fontSize: '0.85rem' }}>
                  <div><strong>Name:</strong> {profile.emergencyContact.name} ({profile.emergencyContact.relationship})</div>
                  <div><strong>Phone:</strong> {profile.emergencyContact.phone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
