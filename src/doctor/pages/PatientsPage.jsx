import React, { useState } from "react";
import { doctorApi } from "../services/doctorApi.js";
export const PatientsPage = ({ doctorId, onStartConsultationForPatient }) => {
    const [search, setSearch] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [historyData, setHistoryData] = useState(null);
    const [historyError, setHistoryError] = useState("");
    const patients = doctorApi.getAuthorizedPatients(doctorId, search || undefined);
    const handleViewHistory = (patient) => {
        setHistoryError("");
        setHistoryData(null);
        setSelectedPatient(patient);
        try {
            const history = doctorApi.getPatientMedicalHistory(doctorId, patient.patientId);
            setHistoryData(history);
        }
        catch (e) {
            setHistoryError(e instanceof Error ? e.message : "Failed to load history.");
        }
    };
    return (<div>
      <div className="doc-page-header">
        <div className="doc-page-title">
          <h1>Patient Directory</h1>
          <p>View authorized patients, medical history, and initiate consultations</p>
        </div>
      </div>

      <div className="doc-card" style={{ marginBottom: 24 }}>
        <input type="text" className="doc-input" placeholder="🔍 Search patients by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%", maxWidth: 440 }}/>
      </div>

      {patients.length === 0 ? (<div className="doc-card" style={{ textAlign: "center", padding: 40, color: "var(--doc-text-muted)" }}>
          No authorized patients found. Patients appear here after you have accepted their appointments.
        </div>) : (<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {patients.map((p) => (<div key={p.id} className="doc-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{p.fullName}</div>
                  <div style={{ fontSize: 12, color: "var(--doc-text-muted)" }}>{p.patientId}</div>
                </div>
                <span className="doc-badge doc-badge-review" style={{ fontSize: 11 }}>
                  {p.gender}, {p.age} yrs
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
                <div><span style={{ color: "var(--doc-text-muted)" }}>Blood Group:</span> <strong>{p.bloodGroup}</strong></div>
                <div><span style={{ color: "var(--doc-text-muted)" }}>Phone:</span> {p.phone}</div>
                {p.allergies && <div style={{ gridColumn: "1 / -1" }}><span style={{ color: "var(--doc-danger)" }}>⚠ Allergies:</span> {p.allergies}</div>}
                {p.chronicConditions && <div style={{ gridColumn: "1 / -1" }}><span style={{ color: "var(--doc-text-muted)" }}>Chronic:</span> {p.chronicConditions}</div>}
              </div>
              <div style={{ fontSize: 12, color: "var(--doc-text-muted)" }}>
                Last Visit: {p.lastAppointmentDate || "N/A"}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" className="doc-btn doc-btn-outline doc-btn-sm" onClick={() => handleViewHistory(p)}>📋 Medical History</button>
                <button type="button" className="doc-btn doc-btn-primary doc-btn-sm" onClick={() => onStartConsultationForPatient(p)}>🩺 Consult</button>
              </div>
            </div>))}
        </div>)}

      {/* Patient History Modal */}
      {selectedPatient && (<div className="doc-modal-overlay">
          <div className="doc-modal" style={{ maxWidth: 760, width: "95%" }}>
            <div className="doc-modal-header">
              <h3>📋 Medical History — {selectedPatient.fullName}</h3>
              <button type="button" className="doc-modal-close" onClick={() => { setSelectedPatient(null); setHistoryData(null); }}>✕</button>
            </div>
            <div className="doc-modal-body" style={{ maxHeight: 520, overflowY: "auto" }}>
              {historyError && <div style={{ color: "var(--doc-danger)", marginBottom: 16 }}>{historyError}</div>}
              {historyData && (<>
                  {/* Patient Info */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20, padding: 14, background: "var(--doc-surface-muted)", borderRadius: 8 }}>
                    <div><div style={{ fontSize: 11, color: "var(--doc-text-muted)", fontWeight: 600 }}>Age / Gender</div><div style={{ fontWeight: 600 }}>{historyData.patient?.age} / {historyData.patient?.gender}</div></div>
                    <div><div style={{ fontSize: 11, color: "var(--doc-text-muted)", fontWeight: 600 }}>Blood Group</div><div style={{ fontWeight: 600 }}>{historyData.patient?.bloodGroup}</div></div>
                    <div><div style={{ fontSize: 11, color: "var(--doc-text-muted)", fontWeight: 600 }}>Allergies</div><div style={{ color: "var(--doc-danger)", fontWeight: 600 }}>{historyData.patient?.allergies || "None known"}</div></div>
                    <div><div style={{ fontSize: 11, color: "var(--doc-text-muted)", fontWeight: 600 }}>Chronic Conditions</div><div style={{ fontWeight: 600 }}>{historyData.patient?.chronicConditions || "None"}</div></div>
                  </div>

                  {/* Consultations */}
                  <h4 style={{ marginBottom: 10, color: "var(--doc-primary)" }}>🩺 Past Consultations ({historyData.consultations.length})</h4>
                  {historyData.consultations.length === 0 ? (<p style={{ color: "var(--doc-text-muted)", marginBottom: 16 }}>No consultations recorded.</p>) : historyData.consultations.map((c) => (<div key={c.id} style={{ padding: "12px 14px", background: "#fff", border: "1px solid var(--doc-border)", borderRadius: 8, marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <strong style={{ fontSize: 13.5 }}>{c.diagnosis}</strong>
                        <span style={{ fontSize: 12, color: "var(--doc-text-muted)" }}>{c.consultationDate}</span>
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--doc-text-muted)" }}>Chief Complaint: {c.chiefComplaint}</div>
                      {c.doctorRemarks && <div style={{ fontSize: 12, marginTop: 4, color: "var(--doc-primary)" }}>Remarks: {c.doctorRemarks}</div>}
                      {c.followUpDate && <div style={{ fontSize: 12, marginTop: 4, color: "#d97706" }}>Follow-up: {c.followUpDate}</div>}
                    </div>))}

                  {/* Prescriptions */}
                  <h4 style={{ marginBottom: 10, marginTop: 16, color: "var(--doc-primary)" }}>💊 Prescriptions ({historyData.prescriptions.length})</h4>
                  {historyData.prescriptions.length === 0 ? (<p style={{ color: "var(--doc-text-muted)", marginBottom: 16 }}>No prescriptions issued.</p>) : historyData.prescriptions.map((rx) => (<div key={rx.id} style={{ padding: "10px 14px", background: "#f0fdfa", border: "1px solid #a7f3d0", borderRadius: 8, marginBottom: 8, fontSize: 13 }}>
                      <strong>{rx.prescriptionNumber}</strong> — {rx.prescriptionDate}
                      <div style={{ marginTop: 4 }}>{rx.items.map((item, idx) => <span key={idx} style={{ display: "inline-block", background: "#fff", border: "1px solid #a7f3d0", borderRadius: 4, padding: "2px 8px", margin: "2px", fontSize: 11 }}>{item.medicineName} {item.dosage}</span>)}</div>
                    </div>))}

                  {/* Reports */}
                  <h4 style={{ marginBottom: 10, marginTop: 16, color: "var(--doc-primary)" }}>📄 Medical Reports ({historyData.reports.length})</h4>
                  {historyData.reports.length === 0 ? (<p style={{ color: "var(--doc-text-muted)" }}>No lab reports found.</p>) : historyData.reports.map((r) => (<div key={r.id} style={{ padding: "10px 14px", background: "#fff", border: "1px solid var(--doc-border)", borderRadius: 8, marginBottom: 8, fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                      <div><strong>{r.testName}</strong> — {r.reportDate}<div style={{ fontSize: 12, color: "var(--doc-text-muted)" }}>{r.resultSummary}</div></div>
                      <span className={`doc-badge ${r.resultStatus === "NORMAL" ? "doc-badge-completed" : r.resultStatus === "CRITICAL" ? "doc-badge-rejected" : "doc-badge-pending"}`}>{r.resultStatus}</span>
                    </div>))}
                </>)}
            </div>
            <div className="doc-modal-footer">
              <button type="button" className="doc-btn doc-btn-outline" onClick={() => { setSelectedPatient(null); setHistoryData(null); }}>Close</button>
              <button type="button" className="doc-btn doc-btn-primary" onClick={() => { onStartConsultationForPatient(selectedPatient); setSelectedPatient(null); }}>🩺 Start Consultation</button>
            </div>
          </div>
        </div>)}
    </div>);
};
