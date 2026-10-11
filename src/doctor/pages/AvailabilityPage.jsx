import React, { useState } from "react";
import { doctorApi } from "../services/doctorApi.js";
const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
export const AvailabilityPage = ({ doctorId }) => {
    const [schedule, setSchedule] = useState(() => doctorApi.getAvailability(doctorId).weeklySchedule);
    const [saved, setSaved] = useState(false);
    const toggleDay = (day) => {
        setSchedule((prev) => prev.map((s) => s.dayOfWeek === day ? { ...s, isAvailable: !s.isAvailable } : s));
        setSaved(false);
    };
    const updateSlot = (day, field, val) => {
        setSchedule((prev) => prev.map((s) => s.dayOfWeek === day ? { ...s, [field]: val } : s));
        setSaved(false);
    };
    const handleSave = () => {
        doctorApi.saveAvailability(doctorId, { doctorId, weeklySchedule: schedule });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };
    return (<div>
      {saved && (<div style={{ position: "fixed", top: 80, right: 24, background: "#0d9488", color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 14px rgba(0,0,0,.15)" }}>
          ✓ Availability schedule saved!
        </div>)}

      <div className="doc-page-header">
        <div className="doc-page-title">
          <h1>Availability Schedule</h1>
          <p>Set your weekly consultation hours, break times, and appointment slot durations</p>
        </div>
        <button type="button" className="doc-btn doc-btn-primary" onClick={handleSave}>💾 Save Schedule</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {DAYS.map((day) => {
            const slot = schedule.find((s) => s.dayOfWeek === day) || { dayOfWeek: day, isAvailable: false, startTime: "09:00", endTime: "17:00", breakStartTime: "13:00", breakEndTime: "14:00", slotDurationMinutes: 30 };
            return (<div key={day} className="doc-card" style={{ borderLeft: `4px solid ${slot.isAvailable ? "var(--doc-teal)" : "var(--doc-border-strong)"}`, opacity: slot.isAvailable ? 1 : 0.65 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ minWidth: 120, display: "flex", alignItems: "center", gap: 10 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input type="checkbox" checked={slot.isAvailable} onChange={() => toggleDay(day)} style={{ width: 18, height: 18, accentColor: "var(--doc-teal)" }}/>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{day.charAt(0) + day.slice(1).toLowerCase()}</span>
                  </label>
                </div>

                {slot.isAvailable && (<>
                    <div className="doc-form-group" style={{ margin: 0, minWidth: 130 }}>
                      <label className="doc-label">Start Time</label>
                      <input type="time" className="doc-input" value={slot.startTime} onChange={(e) => updateSlot(day, "startTime", e.target.value)}/>
                    </div>
                    <div className="doc-form-group" style={{ margin: 0, minWidth: 130 }}>
                      <label className="doc-label">End Time</label>
                      <input type="time" className="doc-input" value={slot.endTime} onChange={(e) => updateSlot(day, "endTime", e.target.value)}/>
                    </div>
                    <div className="doc-form-group" style={{ margin: 0, minWidth: 130 }}>
                      <label className="doc-label">Break Start</label>
                      <input type="time" className="doc-input" value={slot.breakStartTime || ""} onChange={(e) => updateSlot(day, "breakStartTime", e.target.value)}/>
                    </div>
                    <div className="doc-form-group" style={{ margin: 0, minWidth: 130 }}>
                      <label className="doc-label">Break End</label>
                      <input type="time" className="doc-input" value={slot.breakEndTime || ""} onChange={(e) => updateSlot(day, "breakEndTime", e.target.value)}/>
                    </div>
                    <div className="doc-form-group" style={{ margin: 0, minWidth: 160 }}>
                      <label className="doc-label">Slot Duration (mins)</label>
                      <select className="doc-select" value={slot.slotDurationMinutes} onChange={(e) => updateSlot(day, "slotDurationMinutes", Number(e.target.value))}>
                        {[10, 15, 20, 30, 45, 60].map((m) => <option key={m} value={m}>{m} minutes</option>)}
                      </select>
                    </div>
                  </>)}
                {!slot.isAvailable && (<span style={{ fontSize: 13, color: "var(--doc-text-muted)" }}>— Not Available</span>)}
              </div>
            </div>);
        })}
      </div>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <button type="button" className="doc-btn doc-btn-primary doc-btn-lg" onClick={handleSave}>💾 Save Availability Schedule</button>
      </div>
    </div>);
};
