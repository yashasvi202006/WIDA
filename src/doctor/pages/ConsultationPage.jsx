import React, { useState } from "react";
import { doctorApi } from "../services/doctorApi.js";
const EMPTY_FORM = { chiefComplaint: "", symptoms: "", clinicalNotes: "", diagnosis: "", doctorRemarks: "", followUpDate: "", additionalNotes: "", patientId: "", patientName: "" };
export const ConsultationPage = ({ doctorId, prefillAppointment, prefillPatient, onClear }) => {
    const [showForm, setShowForm] = useState(!!(prefillAppointment || prefillPatient));
    const [form, setForm] = useState({ ...EMPTY_FORM, patientId: prefillAppointment?.patientId || prefillPatient?.patientId || "", patientName: prefillAppointment?.patientName || prefillPatient?.fullName || "" });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState("");
    const [, setSavedConsultation] = useState(null);
    const [, forceUpdate] = useState(0);
    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3500); };
    const consultations = doctorApi.getConsultations(doctorId);
    const patients = doctorApi.getAuthorizedPatients(doctorId);
    const handleSave = (isDraft) => {
        if (!form.chiefComplaint.trim()) {
            showToast("Chief complaint is required.");
            return;
        }
        if (!form.diagnosis.trim() && !isDraft) {
            showToast("Diagnosis is required to complete consultation.");
            return;
        }
        if (!form.patientId) {
            showToast("Please select a patient.");
            return;
        }
        setSaving(true);
        try {
            const c = doctorApi.saveConsultation(doctorId, { ...form, appointmentId: prefillAppointment?.id }, isDraft);
            setSavedConsultation(c);
            showToast(isDraft ? "Consultation saved as draft." : "Consultation completed and saved!");
            setForm({ ...EMPTY_FORM });
            setShowForm(false);
            onClear();
            forceUpdate((n) => n + 1);
        }
        finally {
            setSaving(false);
        }
    };
    const handlePatientChange = (patientId) => {
        const p = patients.find((pt) => pt.patientId === patientId);
        setForm((prev) => ({ ...prev, patientId, patientName: p?.fullName || "" }));
    };
    return (<div>
      {toast && (<div style={{ position: "fixed", top: 80, right: 24, background: "#0d9488", color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 14px rgba(0,0,0,.15)" }}>
          {toast}
        </div>)}

      <div className="doc-page-header">
        <div className="doc-page-title">
          <h1>Consultations</h1>
          <p>Record clinical consultation notes, diagnosis, remarks, and follow-up instructions</p>
        </div>
        <button type="button" className="doc-btn doc-btn-primary" onClick={() => { setShowForm(true); setForm({ ...EMPTY_FORM }); onClear(); }}>
          + New Consultation
        </button>
      </div>

      {(showForm || prefillAppointment || prefillPatient) && (<div className="doc-card" style={{ marginBottom: 28, borderColor: "var(--doc-primary-light)" }}>
          <div className="doc-card-header">
            <h2 className="doc-card-title">?? {prefillAppointment || prefillPatient ? "Start Clinical Consultation" : "New Consultation Record"}</h2>
            <button type="button" className="doc-btn doc-btn-ghost doc-btn-sm" onClick={() => { setShowForm(false); onClear(); }}>? Close</button>
          </div>

          {(prefillAppointment || prefillPatient) && (<div style={{ padding: "10px 14px", background: "var(--doc-primary-subtle)", borderRadius: 8, marginBottom: 16, fontSize: 13.5 }}>
              <strong>Patient:</strong> {prefillAppointment?.patientName || prefillPatient?.fullName}
              {prefillAppointment && <> &bull; <strong>Appointment:</strong> {prefillAppointment.appointmentNumber} ({prefillAppointment.appointmentDate})</>}
              {prefillAppointment?.reasonForVisit && <> &bull; <strong>Reason:</strong> {prefillAppointment.reasonForVisit}</>}
            </div>)}

          {!prefillAppointment && !prefillPatient && (<div className="doc-form-group" style={{ marginBottom: 16 }}>
              <label className="doc-label">Select Patient <span className="req">*</span></label>
              <select className="doc-select" value={form.patientId} onChange={(e) => handlePatientChange(e.target.value)}>
                <option value="">-- Select authorized patient --</option>
                {patients.map((p) => <option key={p.patientId} value={p.patientId}>{p.fullName} ({p.patientId})</option>)}
              </select>
            </div>)}

          <div className="doc-form-grid">
            <div className="doc-form-group full-width">
              <label className="doc-label">Chief Complaint <span className="req">*</span></label>
              <input type="text" className="doc-input" placeholder="Patient's primary presenting complaint" value={form.chiefComplaint} onChange={(e) => setForm((p) => ({ ...p, chiefComplaint: e.target.value }))}/>
            </div>
            <div className="doc-form-group full-width">
              <label className="doc-label">Symptoms</label>
              <textarea rows={2} className="doc-textarea" placeholder="Detailed symptoms..." value={form.symptoms} onChange={(e) => setForm((p) => ({ ...p, symptoms: e.target.value }))}/>
            </div>
            <div className="doc-form-group full-width">
              <label className="doc-label">Clinical Notes / Examination Findings</label>
              <textarea rows={3} className="doc-textarea" placeholder="Physical examination findings, vitals, clinical notes..." value={form.clinicalNotes} onChange={(e) => setForm((p) => ({ ...p, clinicalNotes: e.target.value }))}/>
            </div>
            <div className="doc-form-group full-width">
              <label className="doc-label">Diagnosis <span className="req">*</span></label>
              <input type="text" className="doc-input" placeholder="Primary diagnosis / differential diagnoses" value={form.diagnosis} onChange={(e) => setForm((p) => ({ ...p, diagnosis: e.target.value }))}/>
            </div>
            <div className="doc-form-group full-width">
              <label className="doc-label">Doctor Remarks / Treatment Plan</label>
              <textarea rows={3} className="doc-textarea" placeholder="Treatment plan, medication advice, lifestyle modifications, remarks for patient..." value={form.doctorRemarks} onChange={(e) => setForm((p) => ({ ...p, doctorRemarks: e.target.value }))}/>
            </div>
            <div className="doc-form-group">
              <label className="doc-label">Follow-up Date (if needed)</label>
              <input type="date" className="doc-input" value={form.followUpDate} onChange={(e) => setForm((p) => ({ ...p, followUpDate: e.target.value }))}/>
            </div>
            <div className="doc-form-group">
              <label className="doc-label">Additional Notes</label>
              <input type="text" className="doc-input" placeholder="Referral, bed rest, diet..." value={form.additionalNotes} onChange={(e) => setForm((p) => ({ ...p, additionalNotes: e.target.value }))}/>
            </div>
          </div>

          <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button type="button" className="doc-btn doc-btn-outline" onClick={() => handleSave(true)} disabled={saving}>?? Save as Draft</button>
            <button type="button" className="doc-btn doc-btn-primary" onClick={() => handleSave(false)} disabled={saving}>{saving ? "Saving..." : "? Complete Consultation"}</button>
          </div>
        </div>)}

      {/* Past Consultations */}
      <div className="doc-card">
        <div className="doc-card-header">
          <h2 className="doc-card-title">?? Consultation History</h2>
        </div>
        {consultations.length === 0 ? (<div style={{ textAlign: "center", padding: 32, color: "var(--doc-text-muted)" }}>No consultations recorded yet.</div>) : (<div className="doc-table-wrapper">
            <table className="doc-table">
              <thead>
                <tr><th>Ref#</th><th>Patient</th><th>Date</th><th>Chief Complaint</th><th>Diagnosis</th><th>Status</th><th>Follow-up</th></tr>
              </thead>
              <tbody>
                {consultations.map((c) => (<tr key={c.id}>
                    <td style={{ fontSize: 11, color: "var(--doc-text-muted)" }}>{c.consultationNumber}</td>
                    <td><strong>{c.patientName}</strong></td>
                    <td>{c.consultationDate}</td>
                    <td style={{ maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 13 }}>{c.chiefComplaint}</td>
                    <td style={{ fontWeight: 600, color: "var(--doc-primary)", fontSize: 13 }}>{c.diagnosis}</td>
                    <td><span className={`doc-badge ${c.status === "COMPLETED" ? "doc-badge-completed" : c.status === "DRAFT" ? "doc-badge-pending" : "doc-badge-rejected"}`}>{c.status}</span></td>
                    <td style={{ fontSize: 12, color: c.followUpDate ? "#d97706" : "var(--doc-text-muted)" }}>{c.followUpDate || "?"}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>)}
      </div>
    </div>);
};
