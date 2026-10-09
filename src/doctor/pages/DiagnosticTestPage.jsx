import React, { useState } from "react";
import { doctorApi } from "../services/doctorApi.js";
const COMMON_TESTS = ["Complete Blood Count (CBC)", "Blood Glucose (Fasting)", "HbA1c", "Lipid Profile", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid Function Test (TFT)", "Urine Routine & Microscopy", "ECG", "Chest X-Ray", "Echocardiogram", "MRI Brain", "CT Scan Abdomen", "Ultrasound Abdomen", "Bone Density (DEXA)", "Sputum Culture", "Blood Culture", "COVID-19 RT-PCR", "Dengue NS1 Antigen", "HbsAg (Hepatitis B)", "Vitamin D Levels", "Vitamin B12 Levels", "Iron Studies"];
export const DiagnosticTestPage = ({ doctorId, prefillPatientId, prefillPatientName, onClear }) => {
    const [showForm, setShowForm] = useState(false);
    const [patientId, setPatientId] = useState(prefillPatientId || "");
    const [patientName, setPatientName] = useState(prefillPatientName || "");
    const [testName, setTestName] = useState("");
    const [customTest, setCustomTest] = useState("");
    const [priority, setPriority] = useState("ROUTINE");
    const [clinicalReason, setClinicalReason] = useState("");
    const [specialInstructions, setSpecialInstructions] = useState("");
    const [toast, setToast] = useState("");
    const [, forceUpdate] = useState(0);
    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3500); };
    const patients = doctorApi.getAuthorizedPatients(doctorId);
    const requests = doctorApi.getDiagnosticRequests(doctorId);
    const handlePatientChange = (pid) => {
        const p = patients.find((pt) => pt.patientId === pid);
        setPatientId(pid);
        setPatientName(p?.fullName || "");
    };
    const handleRequest = () => {
        const finalTestName = testName === "custom" ? customTest.trim() : testName;
        if (!patientId) {
            showToast("Please select a patient.");
            return;
        }
        if (!finalTestName) {
            showToast("Please select or enter a test name.");
            return;
        }
        if (!clinicalReason.trim()) {
            showToast("Clinical reason is required.");
            return;
        }
        doctorApi.requestDiagnosticTest(doctorId, { patientId, patientName, testName: finalTestName, priority, clinicalReason, specialInstructions });
        showToast("Diagnostic test requested! Lab queue notified.");
        setPatientId(prefillPatientId || "");
        setPatientName(prefillPatientName || "");
        setTestName("");
        setCustomTest("");
        setPriority("ROUTINE");
        setClinicalReason("");
        setSpecialInstructions("");
        setShowForm(false);
        onClear();
        forceUpdate((n) => n + 1);
    };
    const priorityColor = { ROUTINE: "doc-badge-pending", URGENT: "doc-badge-review", STAT: "doc-badge-rejected" };
    const statusColor = { REQUESTED: "doc-badge-pending", SAMPLE_COLLECTED: "doc-badge-review", IN_ANALYSIS: "doc-badge-review", COMPLETED: "doc-badge-completed", CANCELLED: "doc-badge-rejected" };
    return (<div>
      {toast && (<div style={{ position: "fixed", top: 80, right: 24, background: "#0d9488", color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 14px rgba(0,0,0,.15)" }}>
          ✓ {toast}
        </div>)}

      <div className="doc-page-header">
        <div className="doc-page-title">
          <h1>Diagnostic Test Requests</h1>
          <p>Order lab investigations and diagnostic tests for authorized patients</p>
        </div>
        <button type="button" className="doc-btn doc-btn-secondary" onClick={() => setShowForm(true)}>🧪 Request Test</button>
      </div>

      {(showForm || prefillPatientId) && (<div className="doc-card" style={{ marginBottom: 28, borderColor: "var(--doc-teal-light)" }}>
          <div className="doc-card-header">
            <h2 className="doc-card-title">🧪 New Diagnostic Test Request</h2>
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
            <div className="doc-form-group">
              <label className="doc-label">Select Test <span className="req">*</span></label>
              <select className="doc-select" value={testName} onChange={(e) => setTestName(e.target.value)}>
                <option value="">-- Select diagnostic test --</option>
                {COMMON_TESTS.map((t) => <option key={t} value={t}>{t}</option>)}
                <option value="custom">Other (specify below)</option>
              </select>
            </div>
            {testName === "custom" && (<div className="doc-form-group">
                <label className="doc-label">Custom Test Name <span className="req">*</span></label>
                <input type="text" className="doc-input" placeholder="Enter test name" value={customTest} onChange={(e) => setCustomTest(e.target.value)}/>
              </div>)}
            <div className="doc-form-group">
              <label className="doc-label">Priority Level</label>
              <select className="doc-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="ROUTINE">Routine</option>
                <option value="URGENT">Urgent</option>
                <option value="STAT">STAT (Critical)</option>
              </select>
            </div>
            <div className="doc-form-group full-width">
              <label className="doc-label">Clinical Reason / Indication <span className="req">*</span></label>
              <input type="text" className="doc-input" placeholder="Reason for ordering this test" value={clinicalReason} onChange={(e) => setClinicalReason(e.target.value)}/>
            </div>
            <div className="doc-form-group full-width">
              <label className="doc-label">Special Instructions (Optional)</label>
              <input type="text" className="doc-input" placeholder="Fasting required, special sample handling..." value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)}/>
            </div>
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button type="button" className="doc-btn doc-btn-outline" onClick={() => { setShowForm(false); onClear(); }}>Cancel</button>
            <button type="button" className="doc-btn doc-btn-secondary" onClick={handleRequest}>🧪 Submit Request to Lab</button>
          </div>
        </div>)}

      <div className="doc-card">
        <div className="doc-card-header"><h2 className="doc-card-title">📋 Test Request History</h2></div>
        {requests.length === 0 ? (<div style={{ textAlign: "center", padding: 32, color: "var(--doc-text-muted)" }}>No diagnostic test requests made yet.</div>) : (<div className="doc-table-wrapper">
            <table className="doc-table">
              <thead>
                <tr><th>Request#</th><th>Patient</th><th>Test Name</th><th>Priority</th><th>Clinical Reason</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {requests.map((tr) => (<tr key={tr.id}>
                    <td style={{ fontSize: 11, color: "var(--doc-text-muted)" }}>{tr.requestNumber}</td>
                    <td><strong>{tr.patientName}</strong><div style={{ fontSize: 11, color: "var(--doc-text-muted)" }}>{tr.patientId}</div></td>
                    <td style={{ fontWeight: 600 }}>{tr.testName}</td>
                    <td><span className={`doc-badge ${priorityColor[tr.priority]}`} style={{ fontSize: 11 }}>{tr.priority}</span></td>
                    <td style={{ maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 13 }}>{tr.clinicalReason}</td>
                    <td style={{ fontSize: 12 }}>{tr.requestedDate}</td>
                    <td><span className={`doc-badge ${statusColor[tr.status] || "doc-badge-pending"}`} style={{ fontSize: 11 }}>{tr.status.replace("_", " ")}</span></td>
                  </tr>))}
              </tbody>
            </table>
          </div>)}
      </div>
    </div>);
};
