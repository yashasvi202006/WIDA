import React, { useState } from "react";
import { doctorApi } from "../services/doctorApi.js";
export const AppointmentsPage = ({ doctorId, onStartConsultation }) => {
    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState("");
    const [rescheduleApt, setRescheduleApt] = useState(null);
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");
    const [rescheduleReason, setRescheduleReason] = useState("");
    const [rejectApt, setRejectApt] = useState(null);
    const [rejectNote, setRejectNote] = useState("");
    const [toast, setToast] = useState("");
    const [, forceUpdate] = useState(0);
    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
    const today = new Date().toISOString().slice(0, 10);
    const appointments = doctorApi.getAppointments(doctorId, {
        status: filter !== "ALL" && filter !== "TODAY" && filter !== "UPCOMING" ? filter : undefined,
        search: search || undefined,
    })
        .filter((a) => {
        if (filter === "TODAY")
            return a.appointmentDate === today;
        if (filter === "UPCOMING")
            return a.appointmentDate > today;
        return true;
    })
        .sort((a, b) => (b.appointmentDate + b.appointmentTime).localeCompare(a.appointmentDate + a.appointmentTime));
    const handleAccept = (id) => {
        doctorApi.updateAppointmentStatus(id, "ACCEPTED");
        showToast("Appointment accepted.");
        forceUpdate((n) => n + 1);
    };
    const handleReject = () => {
        if (!rejectApt)
            return;
        doctorApi.updateAppointmentStatus(rejectApt.id, "REJECTED", rejectNote || "Declined by doctor");
        showToast("Appointment declined.");
        setRejectApt(null);
        setRejectNote("");
        forceUpdate((n) => n + 1);
    };
    const handleReschedule = () => {
        if (!rescheduleApt || !newDate || !newTime)
            return;
        doctorApi.rescheduleAppointment(rescheduleApt.id, newDate, newTime, rescheduleReason);
        showToast(`Rescheduled to ${newDate} at ${newTime}.`);
        setRescheduleApt(null);
        setNewDate("");
        setNewTime("");
        setRescheduleReason("");
        forceUpdate((n) => n + 1);
    };
    const statusColor = {
        PENDING: "doc-badge-pending", ACCEPTED: "doc-badge-accepted",
        COMPLETED: "doc-badge-completed", REJECTED: "doc-badge-rejected",
        RESCHEDULED: "doc-badge-review", CANCELLED: "doc-badge-rejected",
    };
    return (<div>
      {toast && (<div style={{ position: "fixed", top: 80, right: 24, background: "#0d9488", color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 14px rgba(0,0,0,.15)" }}>
          ✓ {toast}
        </div>)}

      <div className="doc-page-header">
        <div className="doc-page-title">
          <h1>Appointments</h1>
          <p>Manage all patient appointment requests, acceptances, and scheduling</p>
        </div>
      </div>

      <div className="doc-card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input type="text" className="doc-input" placeholder="🔍 Search by patient or reason..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }}/>
          {["ALL", "TODAY", "UPCOMING", "PENDING", "ACCEPTED", "COMPLETED", "RESCHEDULED", "REJECTED"].map((s) => (<button key={s} type="button" className={`doc-btn doc-btn-sm ${filter === s ? "doc-btn-primary" : "doc-btn-outline"}`} onClick={() => setFilter(s)}>
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>))}
        </div>
      </div>

      <div className="doc-card">
        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Ref#</th><th>Patient</th><th>Date & Time</th><th>Type</th><th>Reason</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (<tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "var(--doc-text-muted)" }}>No appointments found.</td></tr>) : appointments.map((apt) => (<tr key={apt.id}>
                  <td style={{ fontSize: 11, color: "var(--doc-text-muted)" }}>{apt.appointmentNumber}</td>
                  <td><strong>{apt.patientName}</strong><div style={{ fontSize: 11, color: "var(--doc-text-muted)" }}>{apt.patientId}</div></td>
                  <td><div>{apt.appointmentDate}</div><small style={{ color: "var(--doc-text-muted)" }}>{apt.appointmentTime}</small></td>
                  <td style={{ fontSize: 12 }}>
                    {apt.appointmentType === "VIDEO_CONSULTATION" ? "📹 Video" : apt.appointmentType === "FOLLOW_UP" ? "🔄 Follow-up" : apt.appointmentType === "EMERGENCY" ? "🚨 Emergency" : "🏥 In-Person"}
                  </td>
                  <td style={{ maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 13 }}>{apt.reasonForVisit}</td>
                  <td><span className={`doc-badge ${statusColor[apt.status] || "doc-badge-pending"}`}>{apt.status}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {apt.status === "PENDING" && (<>
                          <button type="button" className="doc-btn doc-btn-success doc-btn-sm" onClick={() => handleAccept(apt.id)}>✓ Accept</button>
                          <button type="button" className="doc-btn doc-btn-danger doc-btn-sm" onClick={() => { setRejectApt(apt); setRejectNote(""); }}>✕ Reject</button>
                          <button type="button" className="doc-btn doc-btn-outline doc-btn-sm" onClick={() => { setRescheduleApt(apt); setNewDate(apt.appointmentDate); setNewTime(apt.appointmentTime); }}>📅 Reschedule</button>
                        </>)}
                      {apt.status === "ACCEPTED" && (<>
                          <button type="button" className="doc-btn doc-btn-primary doc-btn-sm" onClick={() => onStartConsultation(apt)}>🩺 Start</button>
                          <button type="button" className="doc-btn doc-btn-outline doc-btn-sm" onClick={() => { setRescheduleApt(apt); setNewDate(apt.appointmentDate); setNewTime(apt.appointmentTime); }}>📅 Move</button>
                        </>)}
                      {apt.status === "COMPLETED" && <span style={{ fontSize: 12, color: "var(--doc-teal)" }}>✓ Done</span>}
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: "var(--doc-text-muted)" }}>Total: {appointments.length} appointments</div>
      </div>

      {rescheduleApt && (<div className="doc-modal-overlay">
          <div className="doc-modal">
            <div className="doc-modal-header"><h3>📅 Reschedule Appointment</h3><button type="button" className="doc-modal-close" onClick={() => setRescheduleApt(null)}>✕</button></div>
            <div className="doc-modal-body">
              <p style={{ marginBottom: 16, color: "var(--doc-text-muted)" }}>Rescheduling for <strong>{rescheduleApt.patientName}</strong></p>
              <div className="doc-form-grid">
                <div className="doc-form-group"><label className="doc-label">New Date <span className="req">*</span></label><input type="date" className="doc-input" value={newDate} onChange={(e) => setNewDate(e.target.value)}/></div>
                <div className="doc-form-group"><label className="doc-label">New Time <span className="req">*</span></label><input type="time" className="doc-input" value={newTime} onChange={(e) => setNewTime(e.target.value)}/></div>
                <div className="doc-form-group full-width"><label className="doc-label">Reason</label><input type="text" className="doc-input" placeholder="Emergency, prior commitment..." value={rescheduleReason} onChange={(e) => setRescheduleReason(e.target.value)}/></div>
              </div>
            </div>
            <div className="doc-modal-footer">
              <button type="button" className="doc-btn doc-btn-outline" onClick={() => setRescheduleApt(null)}>Cancel</button>
              <button type="button" className="doc-btn doc-btn-primary" onClick={handleReschedule} disabled={!newDate || !newTime}>Confirm Reschedule</button>
            </div>
          </div>
        </div>)}

      {rejectApt && (<div className="doc-modal-overlay">
          <div className="doc-modal">
            <div className="doc-modal-header"><h3>✕ Decline Appointment</h3><button type="button" className="doc-modal-close" onClick={() => setRejectApt(null)}>✕</button></div>
            <div className="doc-modal-body">
              <p style={{ marginBottom: 16, color: "var(--doc-text-muted)" }}>Declining appointment for <strong>{rejectApt.patientName}</strong> on {rejectApt.appointmentDate}.</p>
              <div className="doc-form-group"><label className="doc-label">Reason (Optional)</label><input type="text" className="doc-input" placeholder="Not available, schedule conflict..." value={rejectNote} onChange={(e) => setRejectNote(e.target.value)}/></div>
            </div>
            <div className="doc-modal-footer">
              <button type="button" className="doc-btn doc-btn-outline" onClick={() => setRejectApt(null)}>Cancel</button>
              <button type="button" className="doc-btn doc-btn-danger" onClick={handleReject}>Confirm Decline</button>
            </div>
          </div>
        </div>)}
    </div>);
};
