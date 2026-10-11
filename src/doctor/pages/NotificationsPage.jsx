import React, { useState } from "react";
import { doctorApi } from "../services/doctorApi.js";
const TYPE_ICONS = {
    APPOINTMENT_REQUEST: "📅", APPOINTMENT_ACCEPTED: "✅", APPOINTMENT_CANCELLED: "❌",
    APPOINTMENT_RESCHEDULED: "🔄", NEW_PATIENT_INTERACTION: "👤", PRESCRIPTION_ALERT: "💊",
    LAB_REPORT_READY: "📄", SYSTEM: "ℹ️",
};
export const NotificationsPage = ({ doctorId, onMarkRead }) => {
    const [, forceUpdate] = useState(0);
    const notifications = doctorApi.getNotifications(doctorId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const handleMarkRead = (id) => {
        doctorApi.markNotificationAsRead(id);
        onMarkRead();
        forceUpdate((n) => n + 1);
    };
    const handleMarkAll = () => {
        doctorApi.markAllNotificationsAsRead(doctorId);
        onMarkRead();
        forceUpdate((n) => n + 1);
    };
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    return (<div>
      <div className="doc-page-header">
        <div className="doc-page-title">
          <h1>Notifications</h1>
          <p>System alerts, appointment updates, lab report arrivals, and prescription confirmations</p>
        </div>
        {unreadCount > 0 && (<button type="button" className="doc-btn doc-btn-outline" onClick={handleMarkAll}>✓ Mark All as Read ({unreadCount})</button>)}
      </div>

      {notifications.length === 0 ? (<div className="doc-card" style={{ textAlign: "center", padding: 40, color: "var(--doc-text-muted)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
          <p>No notifications yet. System events, appointment updates, and lab reports will appear here.</p>
        </div>) : (<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notifications.map((n) => (<div key={n.id} style={{ padding: "14px 18px", background: n.isRead ? "#fff" : "var(--doc-primary-subtle)", border: `1px solid ${n.isRead ? "var(--doc-border)" : "var(--doc-primary-light)"}`, borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 14, transition: "all 0.2s" }}>
              <div style={{ fontSize: 22, lineHeight: 1, marginTop: 2 }}>{TYPE_ICONS[n.type] || "🔔"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontWeight: n.isRead ? 600 : 700, fontSize: 14, color: "var(--doc-text-main)" }}>{n.title}</span>
                  <span style={{ fontSize: 11.5, color: "var(--doc-text-muted)" }}>{n.createdAt}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--doc-text-muted)", margin: "0 0 6px 0" }}>{n.message}</p>
                {n.referenceId && <span style={{ fontSize: 11, color: "var(--doc-primary)", fontWeight: 600 }}>Ref: {n.referenceId}</span>}
              </div>
              {!n.isRead && (<button type="button" className="doc-btn doc-btn-ghost doc-btn-sm" style={{ whiteSpace: "nowrap" }} onClick={() => handleMarkRead(n.id)}>Mark Read</button>)}
              {n.isRead && <span style={{ fontSize: 11, color: "var(--doc-text-soft)", whiteSpace: "nowrap", alignSelf: "center" }}>Read</span>}
            </div>))}
        </div>)}
    </div>);
};
