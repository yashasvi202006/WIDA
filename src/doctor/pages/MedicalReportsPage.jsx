import React, { useState } from "react";
import { doctorApi } from "../services/doctorApi.js";
export const MedicalReportsPage = ({ doctorId }) => {
    const [filterStatus, setFilterStatus] = useState("ALL");
    const reports = doctorApi.getMedicalReports(doctorId).filter((r) => filterStatus === "ALL" || r.resultStatus === filterStatus);
    const statusColor = { NORMAL: "doc-badge-completed", ABNORMAL: "doc-badge-pending", CRITICAL: "doc-badge-rejected" };
    return (<div>
      <div className="doc-page-header">
        <div className="doc-page-title">
          <h1>Medical Reports</h1>
          <p>Lab-generated diagnostic reports for your patients — review results and findings</p>
        </div>
      </div>

      <div className="doc-card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--doc-text-muted)" }}>Filter by result:</span>
          {["ALL", "NORMAL", "ABNORMAL", "CRITICAL"].map((s) => (<button key={s} type="button" className={`doc-btn doc-btn-sm ${filterStatus === s ? "doc-btn-primary" : "doc-btn-outline"}`} onClick={() => setFilterStatus(s)}>
              {s === "ALL" ? "All Results" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>))}
        </div>
      </div>

      {reports.length === 0 ? (<div className="doc-card" style={{ textAlign: "center", padding: 40, color: "var(--doc-text-muted)" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📄</div>
          <p>No medical reports available. Reports appear here once the laboratory processes your diagnostic requests.</p>
        </div>) : (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {reports.map((r) => (<div key={r.id} className="doc-card" style={{ borderLeft: `4px solid ${r.resultStatus === "NORMAL" ? "var(--doc-teal)" : r.resultStatus === "CRITICAL" ? "var(--doc-danger)" : "var(--doc-warning)"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{r.testName}</div>
                  <div style={{ fontSize: 12, color: "var(--doc-text-muted)" }}>{r.reportNumber} &bull; {r.reportDate}</div>
                </div>
                <span className={`doc-badge ${statusColor[r.resultStatus]}`}>{r.resultStatus}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, padding: "12px 14px", background: "var(--doc-surface-muted)", borderRadius: 8, fontSize: 13, marginBottom: 10 }}>
                <div><span style={{ color: "var(--doc-text-muted)" }}>Patient:</span> <strong>{r.patientName}</strong> <span style={{ color: "var(--doc-text-muted)", fontSize: 11 }}>({r.patientId})</span></div>
                {r.labTechnicianName && <div><span style={{ color: "var(--doc-text-muted)" }}>Lab Technician:</span> {r.labTechnicianName}</div>}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600, color: "var(--doc-text-main)" }}>Result Summary: </span>
                <span style={{ color: r.resultStatus === "CRITICAL" ? "var(--doc-danger)" : "var(--doc-text-main)" }}>{r.resultSummary}</span>
              </div>
              {r.reportFileUrl && (<div style={{ marginTop: 10 }}>
                  <a href={r.reportFileUrl} style={{ color: "var(--doc-primary)", fontSize: 13, fontWeight: 600 }}>📥 Download Report PDF</a>
                </div>)}
            </div>))}
        </div>)}
    </div>);
};
