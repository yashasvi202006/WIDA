import React from "react";
import { doctorApi } from "../services/doctorApi.js";
export const RatingsPage = ({ doctor }) => {
    const ratings = doctorApi.getRatings(doctor.id);
    const achievements = doctorApi.getAchievements(doctor.id);
    const starBar = (val) => {
        const full = Math.round(val);
        return Array.from({ length: 5 }).map((_, i) => (<span key={i} style={{ color: i < full ? "#f59e0b" : "#e2e8f0", fontSize: 14 }}>
        *
      </span>));
    };
    const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: ratings.filter((r) => Math.round(r.ratingValue) === star).length,
    }));
    const total = ratings.length || 1;
    return (<div>
      <div className="doc-page-header">
        <div className="doc-page-title">
          <h1>Ratings & Achievements</h1>
          <p>Patient feedback, reviews, clinical milestones, and earned badges (demo data)</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginBottom: 28 }}>
        <div className="doc-card" style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
        }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: "var(--doc-text-main)", lineHeight: 1 }}>
            {doctor.averageRating.toFixed(1)}
          </div>
          <div style={{ fontSize: 22 }}>{starBar(doctor.averageRating)}</div>
          <div style={{ fontSize: 13, color: "var(--doc-text-muted)" }}>
            Based on {doctor.totalRatings} patient reviews
          </div>
        </div>
        <div className="doc-card">
          <h3 className="doc-card-title" style={{ marginBottom: 14 }}>
            Rating Breakdown
          </h3>
          {ratingCounts.map(({ star, count }) => (<div key={star} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ width: 32, fontSize: 13, fontWeight: 600 }}>{star} star</span>
              <div style={{ flex: 1, height: 8, background: "var(--doc-surface-muted)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                width: `${(count / total) * 100}%`,
                height: "100%",
                background: star >= 4 ? "var(--doc-teal)" : star >= 3 ? "#f59e0b" : "var(--doc-danger)",
                borderRadius: 4,
                transition: "width .5s",
            }}/>
              </div>
              <span style={{ width: 28, fontSize: 12, color: "var(--doc-text-muted)" }}>{count}</span>
            </div>))}
        </div>
      </div>

      <div className="doc-card" style={{ marginBottom: 28 }}>
        <div className="doc-card-header">
          <h2 className="doc-card-title">Clinical Achievements & Badges</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14 }}>
          {achievements.map((a) => (<div key={a.id} style={{
                padding: "14px 16px",
                background: a.isUnlocked ? "linear-gradient(135deg, #f0fdfa 0%, #e0f7fa 100%)" : "var(--doc-surface-muted)",
                border: `1px solid ${a.isUnlocked ? "var(--doc-teal-light)" : "var(--doc-border)"}`,
                borderRadius: 10,
                opacity: a.isUnlocked ? 1 : 0.65,
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--doc-teal)" }}>{a.isUnlocked ? "UNLOCKED" : "LOCKED"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: a.isUnlocked ? "var(--doc-text-main)" : "var(--doc-text-muted)" }}>
                  {a.title}
                </div>
                <div style={{ fontSize: 12, color: "var(--doc-text-muted)", marginBottom: 6 }}>{a.description}</div>
                <div style={{ height: 6, background: "var(--doc-border)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                width: `${Math.min((a.progress / a.maxProgress) * 100, 100)}%`,
                height: "100%",
                background: a.isUnlocked ? "var(--doc-teal)" : "var(--doc-primary)",
                borderRadius: 3,
            }}/>
                </div>
                <div style={{ fontSize: 11, color: "var(--doc-text-muted)", marginTop: 4 }}>
                  {a.progress} / {a.maxProgress}
                  {a.awardedDate && (<span style={{ color: "var(--doc-teal)", fontWeight: 600 }}> - Earned {a.awardedDate}</span>)}
                </div>
              </div>
            </div>))}
        </div>
      </div>

      <div className="doc-card">
        <div className="doc-card-header">
          <h2 className="doc-card-title">Patient Reviews</h2>
        </div>
        {ratings.length === 0 ? (<div style={{ textAlign: "center", padding: 32, color: "var(--doc-text-muted)" }}>No patient reviews yet.</div>) : (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {ratings.map((r) => (<div key={r.id} style={{ padding: "14px 16px", background: "#fff", border: "1px solid var(--doc-border)", borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{r.patientName}</span>
                    <span style={{ fontSize: 12, color: "var(--doc-text-muted)", marginLeft: 8 }}>({r.appointmentType})</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 14 }}>{starBar(r.ratingValue)}</span>
                    <span style={{ fontSize: 12, color: "var(--doc-text-muted)", marginLeft: 6 }}>{r.createdAt}</span>
                  </div>
                </div>
                <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 4 }}>{r.reviewTitle}</div>
                <p style={{ fontSize: 13, color: "var(--doc-text-muted)", margin: 0 }}>{r.reviewComment}</p>
              </div>))}
          </div>)}
      </div>
    </div>);
};
