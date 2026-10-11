import React, { useState } from "react";
import { doctorApi } from "../services/doctorApi.js";
export const SettingsPage = ({ doctor, onUpdate }) => {
    const [form, setForm] = useState({
        phoneNumber: doctor.phoneNumber, hospitalClinicName: doctor.hospitalClinicName,
        address: doctor.address || "", city: doctor.city || "", state: doctor.state || "",
        pincode: doctor.pincode || "", consultationFee: doctor.consultationFee,
        languagesKnown: doctor.languagesKnown || "", professionalBio: doctor.professionalBio || "",
        profilePhotoUrl: doctor.profilePhotoUrl || "", subSpecialization: doctor.subSpecialization || "",
    });
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const handleSave = () => {
        setError("");
        if (!form.phoneNumber.trim()) {
            setError("Phone number cannot be empty.");
            return;
        }
        if (!form.hospitalClinicName.trim()) {
            setError("Hospital/Clinic name cannot be empty.");
            return;
        }
        if (form.consultationFee < 0) {
            setError("Consultation fee cannot be negative.");
            return;
        }
        const updated = doctorApi.updateProfile(doctor.id, form);
        onUpdate(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };
    return (<div>
      {saved && (<div style={{ position: "fixed", top: 80, right: 24, background: "#0d9488", color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 14px rgba(0,0,0,.15)" }}>
          ✓ Profile settings saved!
        </div>)}

      <div className="doc-page-header">
        <div className="doc-page-title">
          <h1>Settings & Edit Profile</h1>
          <p>Update your practice information, contact details, and profile settings</p>
        </div>
        <button type="button" className="doc-btn doc-btn-primary" onClick={handleSave}>💾 Save Changes</button>
      </div>

      {error && (<div style={{ background: "var(--doc-danger-bg)", border: "1px solid var(--doc-danger-border)", color: "var(--doc-danger)", padding: "12px 16px", borderRadius: 8, marginBottom: 20 }}>
          ⚠️ {error}
        </div>)}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 24 }}>
        <div className="doc-card">
          <div className="doc-card-header"><h3 className="doc-card-title">👤 Personal Information</h3></div>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 20 }}>
            <img src={form.profilePhotoUrl || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80"} alt="profile" style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover", border: "2px solid var(--doc-primary-light)" }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{doctor.fullName}</div>
              <div style={{ color: "var(--doc-primary)", fontSize: 13.5, marginBottom: 4 }}>{doctor.specializationName}</div>
              <div style={{ fontSize: 12, color: "var(--doc-text-muted)" }}>{doctor.qualification} &bull; {doctor.yearsOfExperience} yrs</div>
              <div style={{ fontSize: 12, color: "var(--doc-text-muted)" }}>Reg: {doctor.medicalRegistrationNumber}</div>
            </div>
          </div>

          <div className="doc-form-grid">
            <div className="doc-form-group">
              <label className="doc-label">Phone Number <span className="req">*</span></label>
              <input type="text" className="doc-input" value={form.phoneNumber} onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}/>
            </div>
            <div className="doc-form-group">
              <label className="doc-label">Sub-Specialization</label>
              <input type="text" className="doc-input" placeholder="e.g. Interventional Cardiology" value={form.subSpecialization} onChange={(e) => setForm((p) => ({ ...p, subSpecialization: e.target.value }))}/>
            </div>
            <div className="doc-form-group">
              <label className="doc-label">Languages Known</label>
              <input type="text" className="doc-input" placeholder="English, Hindi" value={form.languagesKnown} onChange={(e) => setForm((p) => ({ ...p, languagesKnown: e.target.value }))}/>
            </div>
            <div className="doc-form-group">
              <label className="doc-label">Consultation Fee (₹)</label>
              <input type="number" className="doc-input" min={0} value={form.consultationFee} onChange={(e) => setForm((p) => ({ ...p, consultationFee: Number(e.target.value) }))}/>
            </div>
            <div className="doc-form-group full-width">
              <label className="doc-label">Profile Photo URL</label>
              <input type="text" className="doc-input" placeholder="https://..." value={form.profilePhotoUrl} onChange={(e) => setForm((p) => ({ ...p, profilePhotoUrl: e.target.value }))}/>
            </div>
            <div className="doc-form-group full-width">
              <label className="doc-label">Professional Bio</label>
              <textarea rows={3} className="doc-textarea" value={form.professionalBio} onChange={(e) => setForm((p) => ({ ...p, professionalBio: e.target.value }))}/>
            </div>
          </div>
        </div>

        <div className="doc-card">
          <div className="doc-card-header"><h3 className="doc-card-title">🏥 Practice & Location</h3></div>
          <div className="doc-form-grid">
            <div className="doc-form-group full-width">
              <label className="doc-label">Hospital / Clinic Name <span className="req">*</span></label>
              <input type="text" className="doc-input" value={form.hospitalClinicName} onChange={(e) => setForm((p) => ({ ...p, hospitalClinicName: e.target.value }))}/>
            </div>
            <div className="doc-form-group full-width">
              <label className="doc-label">Street Address</label>
              <input type="text" className="doc-input" placeholder="Street, Area, Suite..." value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}/>
            </div>
            <div className="doc-form-group">
              <label className="doc-label">City</label>
              <input type="text" className="doc-input" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}/>
            </div>
            <div className="doc-form-group">
              <label className="doc-label">State</label>
              <input type="text" className="doc-input" value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}/>
            </div>
            <div className="doc-form-group">
              <label className="doc-label">Pincode</label>
              <input type="text" className="doc-input" value={form.pincode} onChange={(e) => setForm((p) => ({ ...p, pincode: e.target.value }))}/>
            </div>
          </div>

          {/* Read-only credential info */}
          <div style={{ marginTop: 20, padding: "14px 16px", background: "var(--doc-surface-muted)", borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--doc-text-muted)", marginBottom: 8, textTransform: "uppercase" }}>Fixed Credentials (Contact Admin to Change)</div>
            <div style={{ fontSize: 13, display: "flex", flexDirection: "column", gap: 6 }}>
              <div><span style={{ color: "var(--doc-text-muted)" }}>Email: </span><strong>{doctor.email}</strong></div>
              <div><span style={{ color: "var(--doc-text-muted)" }}>MCI License: </span><strong>{doctor.medicalRegistrationNumber}</strong></div>
              <div><span style={{ color: "var(--doc-text-muted)" }}>Qualification: </span><strong>{doctor.qualification}</strong></div>
              <div><span style={{ color: "var(--doc-text-muted)" }}>Experience: </span><strong>{doctor.yearsOfExperience} years</strong></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <button type="button" className="doc-btn doc-btn-primary doc-btn-lg" onClick={handleSave}>💾 Save All Settings</button>
      </div>
    </div>);
};
