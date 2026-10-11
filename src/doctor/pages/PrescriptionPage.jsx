import React, { useState } from "react";
import { doctorApi } from "../services/doctorApi.js";
const EMPTY_ITEM = { medicineName: "", dosage: "", frequency: "", duration: "", instructions: "" };
export const PrescriptionPage = ({ doctorId, prefillPatientId, prefillPatientName, onClear }) => {
    const [showForm, setShowForm] = useState(false);
    const [patientId, setPatientId] = useState(prefillPatientId || "");
    const [patientName, setPatientName] = useState(prefillPatientName || "");
    const [generalAdvice, setGeneralAdvice] = useState("Take all medication as prescribed. Complete full course. Rest and stay hydrated.");
    const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
    const [toast, setToast] = useState("");
    const [, forceUpdate] = useState(0);
    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3500); };
    const patients = doctorApi.getAuthorizedPatients(doctorId);
    const prescriptions = doctorApi.getPrescriptions(doctorId);
    const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
    const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));
    const updateItem = (idx, field, val) => setItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
    const handlePatientChange = (pid) => {
        const p = patients.find((pt) => pt.patientId === pid);
        setPatientId(pid);
        setPatientName(p?.fullName || "");
    };
    const handleCreate = () => {
        if (!patientId) {
            showToast("Please select a patient.");
            return;
        }
        if (items.some((it) => !it.medicineName.trim())) {
            showToast("Medicine name is required for all prescription items.");
            return;
        }
        doctorApi.createPrescription(doctorId, { patientId, patientName, items, generalAdvice });
        showToast("Prescription created successfully!");
        setItems([{ ...EMPTY_ITEM }]);
        setPatientId(prefillPatientId || "");
        setPatientName(prefillPatientName || "");
        setGeneralAdvice("Take all medication as prescribed. Complete full course. Rest and stay hydrated.");
        setShowForm(false);
        onClear();
        forceUpdate((n) => n + 1);
    };
    return (<div>
      {toast && (<div style={{ position: "fixed", top: 80, right: 24, background: "#0d9488", color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 14px rgba(0,0,0,.15)" }}>
          ✓ {toast}
        </div>)}

      <div className="doc-page-header">
        <div className="doc-page-title">
          <h1>Prescriptions</h1>
          <p>Create, manage, and review medication prescriptions for authorized patients</p>
        </div>
        <button type="button" className="doc-btn doc-btn-primary" onClick={() => setShowForm(true)}>💊 Create Prescription</button>
      </div>

      {(showForm || prefillPatientId) && (<div className="doc-card" style={{ marginBottom: 28, borderColor: "var(--doc-primary-light)" }}>
          <div className="doc-card-header">
            <h2 className="doc-card-title">💊 New Prescription</h2>
            <button type="button" className="doc-btn doc-btn-ghost doc-btn-sm" onClick={() => { setShowForm(false); onClear(); }}>✕ Close</button>
          </div>

          <div className="doc-form-grid">
            <div className="doc-form-group full-width">
              <label className="doc-label">Select Patient <span className="req">*</span></label>
              <select className="doc-select" value={patientId} onChange={(e) => handlePatientChange(e.target.value)}>
                <option value="">-- Select authorized patient --</option>
                {patients.map((p) => <option key={p.patientId} value={p.patientId}>{p.fullName} ({p.patientId})</option>)}
              </select>
            </div>
            <div className="doc-form-group full-width">
              <label className="doc-label">General Advice / Instructions</label>
              <textarea rows={2} className="doc-textarea" value={generalAdvice} onChange={(e) => setGeneralAdvice(e.target.value)}/>
            </div>
          </div>

          <h4 style={{ marginTop: 20, marginBottom: 12, color: "var(--doc-primary)" }}>Prescription Items</h4>
          {items.map((item, idx) => (<div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr auto", gap: 10, marginBottom: 10, alignItems: "flex-end" }}>
              <div className="doc-form-group" style={{ margin: 0 }}>
                {idx === 0 && <label className="doc-label">Medicine Name <span className="req">*</span></label>}
                <input type="text" className="doc-input" placeholder="e.g. Metformin 500mg" value={item.medicineName} onChange={(e) => updateItem(idx, "medicineName", e.target.value)}/>
              </div>
              <div className="doc-form-group" style={{ margin: 0 }}>
                {idx === 0 && <label className="doc-label">Dosage</label>}
                <input type="text" className="doc-input" placeholder="500mg" value={item.dosage} onChange={(e) => updateItem(idx, "dosage", e.target.value)}/>
              </div>
              <div className="doc-form-group" style={{ margin: 0 }}>
                {idx === 0 && <label className="doc-label">Frequency</label>}
                <input type="text" className="doc-input" placeholder="Twice daily" value={item.frequency} onChange={(e) => updateItem(idx, "frequency", e.target.value)}/>
              </div>
              <div className="doc-form-group" style={{ margin: 0 }}>
                {idx === 0 && <label className="doc-label">Duration</label>}
                <input type="text" className="doc-input" placeholder="7 days" value={item.duration} onChange={(e) => updateItem(idx, "duration", e.target.value)}/>
              </div>
              <div className="doc-form-group" style={{ margin: 0 }}>
                {idx === 0 && <label className="doc-label">Special Instructions</label>}
                <input type="text" className="doc-input" placeholder="After meals, with water" value={item.instructions} onChange={(e) => updateItem(idx, "instructions", e.target.value)}/>
              </div>
              <div>
                {idx === 0 && <label className="doc-label" style={{ visibility: "hidden" }}>X</label>}
                {items.length > 1 && <button type="button" className="doc-btn doc-btn-danger doc-btn-sm" onClick={() => removeItem(idx)}>✕</button>}
              </div>
            </div>))}
          <button type="button" className="doc-btn doc-btn-outline doc-btn-sm" onClick={addItem}>+ Add Another Medicine</button>

          <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button type="button" className="doc-btn doc-btn-outline" onClick={() => { setShowForm(false); onClear(); }}>Cancel</button>
            <button type="button" className="doc-btn doc-btn-primary" onClick={handleCreate}>💊 Issue Prescription</button>
          </div>
        </div>)}

      {/* Prescription History */}
      <div className="doc-card">
        <div className="doc-card-header"><h2 className="doc-card-title">📋 Prescription Records</h2></div>
        {prescriptions.length === 0 ? (<div style={{ textAlign: "center", padding: 32, color: "var(--doc-text-muted)" }}>No prescriptions issued yet.</div>) : (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {prescriptions.map((rx) => (<div key={rx.id} style={{ background: "#fff", border: "1px solid var(--doc-border)", borderRadius: 10, padding: "14px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                  <div>
                    <span style={{ fontWeight: 700, color: "var(--doc-primary)", fontSize: 13 }}>{rx.prescriptionNumber}</span>
                    <span style={{ margin: "0 8px", color: "var(--doc-text-muted)" }}>|</span>
                    <strong style={{ fontSize: 14 }}>{rx.patientName}</strong>
                    <span style={{ fontSize: 12, color: "var(--doc-text-muted)", marginLeft: 8 }}>{rx.patientId}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "var(--doc-text-muted)" }}>{rx.prescriptionDate}</span>
                    <span className={`doc-badge ${rx.pharmacyStatus === "DISPENSED" ? "doc-badge-completed" : "doc-badge-pending"}`} style={{ fontSize: 11 }}>{rx.pharmacyStatus}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {rx.items.map((item, idx) => (<div key={idx} style={{ background: "var(--doc-surface-muted)", border: "1px solid var(--doc-border)", borderRadius: 8, padding: "6px 12px", fontSize: 12 }}>
                      <strong>{item.medicineName}</strong>
                      {item.dosage && <span style={{ color: "var(--doc-text-muted)" }}> {item.dosage}</span>}
                      {item.frequency && <span style={{ color: "var(--doc-primary)" }}> · {item.frequency}</span>}
                      {item.duration && <span style={{ color: "var(--doc-text-muted)" }}> for {item.duration}</span>}
                    </div>))}
                </div>
                {rx.generalAdvice && <p style={{ fontSize: 12, color: "var(--doc-text-muted)", marginTop: 8, marginBottom: 0, fontStyle: "italic" }}>💬 {rx.generalAdvice}</p>}
              </div>))}
          </div>)}
      </div>
    </div>);
};
