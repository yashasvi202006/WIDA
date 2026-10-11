import React, { useState, useMemo } from 'react';
import anatomyModelImg from '../../assets/dashboard/anatomy_model.jpg';
import heartScanImg from '../../assets/dashboard/heart_scan.jpg';
import kidneyScanImg from '../../assets/dashboard/kidney_scan.jpg';
import kneeScanImg from '../../assets/dashboard/knee_scan.jpg';
import brainScanImg from '../../assets/dashboard/brain_scan.jpg';
import { doctorApi } from '../services/doctorApi.js';

export const DoctorDashboard = ({
  doctor,
  summary,
  onNavigate,
  onAcceptAppointment,
  onRejectAppointment,
  onStartConsultationForAppointment,
  onOpenNewPrescription,
  onOpenNewTestRequest,
}) => {
  // State for interactive features
  const [activeDateFilter, setActiveDateFilter] = useState('Today');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [selectedDay, setSelectedDay] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [activeDiagnosis, setActiveDiagnosis] = useState('heart');

  // AI Care Chat State
  const [aiInput, setAiInput] = useState('');
  const [aiChatMessages, setAiChatMessages] = useState([
    {
      id: 1,
      sender: 'user',
      name: 'Doctor',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      text: 'Cranial and neuro-vascular diagnostic indicators assessment request.',
      image: brainScanImg,
    },
    {
      id: 2,
      sender: 'ai',
      name: 'AI Care',
      text: '• Neuro-vascular perfusion mapping is optimal. Intracranial pressure within standard limits. Recommend standard bi-annual follow-up.',
      hasDownload: true,
    },
  ]);

  // Real Clinical Appointments for the Registered Doctor
  const appointmentsList = useMemo(() => {
    try {
      const list = doctorApi.getAppointments(doctor?.id) || [];
      if (list.length > 0) return list.slice(0, 5);
    } catch {}
    return [
      {
        id: 101,
        appointmentNumber: 'APT-101',
        title: 'Cardiac Evaluation Follow-up',
        patientName: 'Rahul Verma',
        patientAge: 38,
        patientGender: 'Male',
        chiefComplaint: 'Chest tightness under exertion',
        time: '10:30 AM',
        appointmentTime: '10:30 AM',
        status: 'ACCEPTED',
        consultationType: 'TELECONSULT',
      },
      {
        id: 102,
        appointmentNumber: 'APT-102',
        title: 'Hypertension Clinical Review',
        patientName: 'Priya Sharma',
        patientAge: 46,
        patientGender: 'Female',
        chiefComplaint: 'BP tracking & medication review',
        time: '11:45 AM',
        appointmentTime: '11:45 AM',
        status: 'ACCEPTED',
        consultationType: 'IN_PERSON',
      },
      {
        id: 103,
        appointmentNumber: 'APT-103',
        title: 'General Wellness Consultation',
        patientName: 'Amit Saxena',
        patientAge: 52,
        patientGender: 'Male',
        chiefComplaint: 'Routine bi-annual health evaluation',
        time: '02:15 PM',
        appointmentTime: '02:15 PM',
        status: 'ACCEPTED',
        consultationType: 'TELECONSULT',
      },
    ];
  }, [doctor?.id]);

  const handleZoom = (delta) => {
    setZoomLevel((prev) => Math.min(1.4, Math.max(0.8, +(prev + delta).toFixed(1))));
  };

  const handleRotate = () => {
    setRotationAngle((prev) => (prev === 0 ? 15 : prev === 15 ? -15 : 0));
  };

  const handleSendAiMessage = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      name: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: aiInput.trim(),
    };

    setAiChatMessages((prev) => [...prev, userMsg]);
    const query = aiInput.trim();
    setAiInput('');

    setTimeout(() => {
      let responseText = `WIDA AI Clinical Analysis for: "${query}"\nBased on clinical markers and recent patient diagnostics, vital indicators are within standard parameters. Recommend continuing current medication schedule.`;
      if (/headache|migraine|brain/i.test(query)) {
        responseText = '• Cranial neuro-vascular assessment indicates tension-type pattern with no signs of intracranial pressure. Hydration and rest recommended.';
      } else if (/heart|pulse|chest/i.test(query)) {
        responseText = '• Cardiovascular perfusion map indicates stable sinus rhythm at 120 bpm with good ventricular ejection fraction.';
      } else if (/knee|joint|bone/i.test(query)) {
        responseText = '• Orthopedic joint scan indicates resolving inflammation around the lateral meniscus. Continue targeted physical therapy.';
      }

      setAiChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          name: 'AI Care',
          text: responseText,
          hasDownload: true,
        },
      ]);
    }, 600);
  };

  return (
    <div className="wida-dashboard-container">
      {/* ── Top Header Navigation Bar ────────────────────────── */}
      <header className="wida-header-bar">
        <div className="wida-greeting-box">
          <h1 className="wida-greeting-title">Good Morning, {doctor?.fullName || 'Doctor'}! 👋</h1>
          <div className="wida-doc-reg-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '13px', color: '#007C77', fontWeight: 600 }}>
            <span style={{ background: '#CCFBF1', color: '#0F766E', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
              🆔 Reg ID: {doctor?.medicalRegistrationNumber || `DOC-${doctor?.id || '101'}`}
            </span>
            <span style={{ color: '#94A3B8' }}>•</span>
            <span style={{ color: '#475569' }}>{doctor?.specializationName || doctor?.specialization || 'Clinical Practice'}</span>
            {doctor?.hospitalClinicName && (
              <>
                <span style={{ color: '#94A3B8' }}>•</span>
                <span style={{ color: '#64748B' }}>{doctor.hospitalClinicName}</span>
              </>
            )}
          </div>
        </div>

        <div className="wida-header-actions">
          {/* Search Box */}
          <div className="wida-search-wrapper">
            <span className="wida-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search now"
              className="wida-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Email / Messages Icon */}
          <button
            type="button"
            className="wida-header-icon-btn"
            title="Messages"
            onClick={() => onNavigate('consultations')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </button>

          {/* Notification Bell with Red Dot */}
          <button
            type="button"
            className="wida-header-icon-btn relative"
            title="Notifications"
            onClick={() => onNavigate('notifications')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="wida-notif-dot"></span>
          </button>

          {/* User Profile Avatar */}
          <div
            className="wida-avatar-wrapper"
            title="Open Doctor Profile"
            onClick={() => onNavigate('profile')}
          >
            <img
              src={doctor?.profilePhotoUrl || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"}
              alt={doctor?.fullName || "Doctor Avatar"}
              className="wida-avatar-img"
            />
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Content Grid ─────────────────────── */}
      <div className="wida-main-layout">
        {/* ═══ LEFT / CENTER MAIN COLUMN ══════════════════════ */}
        <div className="wida-col-main">
          {/* ── Card 1: History of Diagnosis ────────────────── */}
          <section className="wida-card wida-diagnosis-card">
            <div className="wida-card-header">
              <h2 className="wida-card-title">History of Diagnosis</h2>
              <div className="wida-date-pill">
                <span>📅</span>
                <span>{activeDateFilter}</span>
                <span className="arrow">▾</span>
              </div>
            </div>

            <div className="wida-diagnosis-body">
              {/* Left: 3D Anatomical Body Model with Glowing Interactive Pins */}
              <div className="wida-anatomy-viewport">
                <div
                  className="wida-anatomy-figure-wrapper"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotationAngle}deg)`,
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <img
                    src={anatomyModelImg}
                    alt="3D Human Anatomy Model"
                    className="wida-anatomy-img"
                  />

                  {/* Pulsing Target Pin 1: Heart */}
                  <div
                    className={`wida-target-pin pin-heart ${activeDiagnosis === 'heart' ? 'active-pin' : ''}`}
                    onClick={() => setActiveDiagnosis('heart')}
                    title="Heart - Click to focus"
                  >
                    <span className="wida-pin-pulse"></span>
                    <span className="wida-pin-core"></span>
                    <span className="wida-pin-label">Heart</span>
                  </div>

                  {/* Pulsing Target Pin 2: Kidney */}
                  <div
                    className={`wida-target-pin pin-kidney ${activeDiagnosis === 'kidney' ? 'active-pin' : ''}`}
                    onClick={() => setActiveDiagnosis('kidney')}
                    title="Kidneys - Click to focus"
                  >
                    <span className="wida-pin-pulse"></span>
                    <span className="wida-pin-core"></span>
                    <span className="wida-pin-label">Kidney</span>
                  </div>

                  {/* Pulsing Target Pin 3: Knee */}
                  <div
                    className={`wida-target-pin pin-knee ${activeDiagnosis === 'knee' ? 'active-pin' : ''}`}
                    onClick={() => setActiveDiagnosis('knee')}
                    title="Knee Joint - Click to focus"
                  >
                    <span className="wida-pin-pulse"></span>
                    <span className="wida-pin-core"></span>
                    <span className="wida-pin-label">Knee</span>
                  </div>
                </div>

                {/* Bottom Zoom & Rotate Controls */}
                <div className="wida-anatomy-controls">
                  <button
                    type="button"
                    className="wida-ctrl-btn"
                    onClick={() => handleZoom(-0.1)}
                    title="Zoom Out"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="wida-ctrl-btn wida-ctrl-rotate"
                    onClick={handleRotate}
                    title="Rotate / Perspective"
                  >
                    ⟨ ⟩
                  </button>
                  <button
                    type="button"
                    className="wida-ctrl-btn"
                    onClick={() => handleZoom(0.1)}
                    title="Zoom In"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Right: 3 Diagnosis Issue Cards */}
              <div className="wida-diagnosis-list">
                {/* Issue 1: Heart Problem */}
                <div
                  className={`wida-diag-item ${activeDiagnosis === 'heart' ? 'highlighted' : ''}`}
                  onClick={() => setActiveDiagnosis('heart')}
                >
                  <div className="wida-diag-info">
                    <div className="wida-diag-title-row">
                      <div className="wida-diag-icon heart-ico">🫀</div>
                      <h3 className="wida-diag-name">Heart Problem</h3>
                    </div>
                    <p className="wida-diag-desc">
                      Coronary artery disease is a common heart condition that affects the major blood
                      vessels that supply the heart muscle.
                    </p>
                    <div className="wida-doctor-tag">
                      <span style={{ fontSize: '12px', color: '#007C77', fontWeight: 600 }}>
                        🩺 Attending: {doctor?.fullName || 'Dr. Aarav Sharma'} (Cardiology)
                      </span>
                    </div>
                  </div>
                  <div
                    className="wida-diag-scan-box"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEnlargedImage(heartScanImg);
                    }}
                    title="Click to expand scan"
                  >
                    <img src={heartScanImg} alt="Coronary Artery Scan" className="wida-scan-thumb" />
                  </div>
                </div>

                {/* Issue 2: Kidney Problem */}
                <div
                  className={`wida-diag-item ${activeDiagnosis === 'kidney' ? 'highlighted' : ''}`}
                  onClick={() => setActiveDiagnosis('kidney')}
                >
                  <div className="wida-diag-info">
                    <div className="wida-diag-title-row">
                      <div className="wida-diag-icon kidney-ico">🫘</div>
                      <h3 className="wida-diag-name">Kidney Problem</h3>
                    </div>
                    <p className="wida-diag-desc">
                      Renal vascular assessment and nephron filtration study shows mild perfusion obstruction
                      in right upper renal artery branch.
                    </p>
                    <div className="wida-doctor-tag">
                      <span style={{ fontSize: '12px', color: '#007C77', fontWeight: 600 }}>
                        🩺 Attending: {doctor?.fullName || 'Dr. Aarav Sharma'} (Nephrology)
                      </span>
                    </div>
                  </div>
                  <div
                    className="wida-diag-scan-box"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEnlargedImage(kidneyScanImg);
                    }}
                    title="Click to expand scan"
                  >
                    <img src={kidneyScanImg} alt="Kidney Nephrology Scan" className="wida-scan-thumb" />
                  </div>
                </div>

                {/* Issue 3: Knee Problem */}
                <div
                  className={`wida-diag-item ${activeDiagnosis === 'knee' ? 'highlighted' : ''}`}
                  onClick={() => setActiveDiagnosis('knee')}
                >
                  <div className="wida-diag-info">
                    <div className="wida-diag-title-row">
                      <div className="wida-diag-icon knee-ico">🦵</div>
                      <h3 className="wida-diag-name">Knee Problem</h3>
                    </div>
                    <p className="wida-diag-desc">
                      Patellofemoral inflammation and minor meniscus stress detected following physical training;
                      joint physiotherapy initiated.
                    </p>
                    <div className="wida-doctor-tag">
                      <span style={{ fontSize: '12px', color: '#007C77', fontWeight: 600 }}>
                        🩺 Attending: {doctor?.fullName || 'Dr. Aarav Sharma'} (Orthopedics)
                      </span>
                    </div>
                  </div>
                  <div
                    className="wida-diag-scan-box"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEnlargedImage(kneeScanImg);
                    }}
                    title="Click to expand scan"
                  >
                    <img src={kneeScanImg} alt="Knee MRI Scan" className="wida-scan-thumb" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Card 2: Clinical Practice & Patient Activity Overview ─────────────────── */}
          <section className="wida-card wida-clinical-overview-card">
            <div className="wida-card-header">
              <div>
                <h2 className="wida-card-title">Clinical Practice Overview</h2>
                <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#64748B' }}>
                  Real-time clinical consultations, ABDM patient encounters &amp; electronic records
                </p>
              </div>
              <div className="wida-date-pill">
                <span>📅</span>
                <span>{activeDateFilter}</span>
                <span className="arrow">▾</span>
              </div>
            </div>

            {/* Clinical Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginTop: '16px' }}>
              <div style={{ background: '#F0FDFA', border: '1px solid #CCFBF1', borderRadius: '14px', padding: '14px 16px' }}>
                <div style={{ fontSize: '12px', color: '#0F766E', fontWeight: 700 }}>TODAY'S PATIENTS</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#134E4A', marginTop: '4px' }}>
                  {summary?.todayAppointmentsCount ?? appointmentsList.length}
                </div>
                <div style={{ fontSize: '11px', color: '#0D9488', marginTop: '2px' }}>Scheduled for consultation</div>
              </div>

              <div style={{ background: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: '14px', padding: '14px 16px' }}>
                <div style={{ fontSize: '12px', color: '#1E40AF', fontWeight: 700 }}>COMPLETED CASES</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#1E3A8A', marginTop: '4px' }}>
                  {summary?.completedConsultationsCount ?? 14}
                </div>
                <div style={{ fontSize: '11px', color: '#2563EB', marginTop: '2px' }}>Consultations finished</div>
              </div>

              <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '14px', padding: '14px 16px' }}>
                <div style={{ fontSize: '12px', color: '#92400E', fontWeight: 700 }}>PENDING REVIEWS</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#78350F', marginTop: '4px' }}>
                  {summary?.pendingRequestsCount ?? 3}
                </div>
                <div style={{ fontSize: '11px', color: '#D97706', marginTop: '2px' }}>Awaiting clinical triage</div>
              </div>

              <div style={{ background: '#F3E8FF', border: '1px solid #E9D5FF', borderRadius: '14px', padding: '14px 16px' }}>
                <div style={{ fontSize: '12px', color: '#6B21A8', fontWeight: 700 }}>PRACTITIONER RATING</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#581C87', marginTop: '4px' }}>
                  ★ {doctor?.averageRating ? Number(doctor.averageRating).toFixed(1) : '5.0'}
                </div>
                <div style={{ fontSize: '11px', color: '#9333EA', marginTop: '2px' }}>Verified patient score</div>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
              <button
                type="button"
                className="wida-join-btn"
                style={{ padding: '8px 16px', fontSize: '13px' }}
                onClick={() => onOpenNewPrescription?.()}
              >
                + New Prescription
              </button>
              <button
                type="button"
                className="wida-ctrl-btn"
                style={{ padding: '8px 16px', width: 'auto', fontSize: '13px', borderRadius: '10px' }}
                onClick={() => onOpenNewTestRequest?.()}
              >
                🔬 Request Lab Test
              </button>
              <button
                type="button"
                className="wida-ctrl-btn"
                style={{ padding: '8px 16px', width: 'auto', fontSize: '13px', borderRadius: '10px' }}
                onClick={() => onNavigate?.('patients')}
              >
                👥 Patient Directory
              </button>
              <button
                type="button"
                className="wida-ctrl-btn"
                style={{ padding: '8px 16px', width: 'auto', fontSize: '13px', borderRadius: '10px' }}
                onClick={() => onNavigate?.('appointments')}
              >
                📅 Full Schedule
              </button>
            </div>
          </section>
        </div>

        {/* ═══ RIGHT COLUMN: APPOINTMENTS & AI CARE ═══════════ */}
        <div className="wida-col-sidebar">
          {/* ── Upcoming Appointments ───────────────────────── */}
          <section className="wida-card wida-appointments-card">
            <div className="wida-card-header">
              <h2 className="wida-card-title">Upcoming Appointments</h2>
              <div className="wida-date-pill">
                <span>📅</span>
                <span>{activeDateFilter}</span>
                <span className="arrow">▾</span>
              </div>
            </div>

            {/* Weekly Days Bar */}
            <div className="wida-calendar-strip">
              {[
                { day: '08', name: 'Sun' },
                { day: '09', name: 'Mon' },
                { day: '10', name: 'Tue' },
                { day: '11', name: 'Wed' },
                { day: '12', name: 'Thu' },
                { day: '13', name: 'Fri' },
                { day: '14', name: 'Sat' },
              ].map((d) => (
                <div
                  key={d.day}
                  className={`wida-cal-day ${Number(d.day) === selectedDay ? 'selected-day' : ''}`}
                  onClick={() => setSelectedDay(Number(d.day))}
                >
                  <span className="day-number">{d.day}</span>
                  <span className="day-name">{d.name}</span>
                </div>
              ))}
            </div>

            {/* Appointments List */}
            <div className="wida-appointment-items">
              {appointmentsList.map((apt) => (
                <div key={apt.id} className="wida-apt-row">
                  <div className="wida-apt-header-row">
                    <div>
                      <h4 className="wida-apt-subject">{apt.title || apt.chiefComplaint || 'Clinical Consultation'}</h4>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        Patient: <strong style={{ color: '#1E293B' }}>{apt.patientName || 'Authorized Patient'}</strong>
                        {apt.patientAge && ` • ${apt.patientAge}y (${apt.patientGender || 'Adult'})`}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="wida-join-btn"
                      onClick={() => {
                        if (onStartConsultationForAppointment) {
                          onStartConsultationForAppointment(apt);
                        } else {
                          onNavigate?.('consultations');
                        }
                      }}
                    >
                      Start Consult
                    </button>
                  </div>
                  <div className="wida-apt-footer-row">
                    <div className="wida-apt-doc-info">
                      <div className="wida-apt-badge-pill" style={{
                        background: apt.consultationType === 'TELECONSULT' ? '#E0F2FE' : '#F0FDF4',
                        color: apt.consultationType === 'TELECONSULT' ? '#0369A1' : '#15803D',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        {apt.consultationType === 'TELECONSULT' ? '📹 Teleconsult' : '🏥 In-Clinic'}
                      </div>
                    </div>
                    <div className="wida-apt-time">
                      <span>🕒</span>
                      <span>{apt.time || apt.appointmentTime || apt.timeSlot || 'Scheduled'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── AI Care Interactive Medical Widget ──────────── */}
          <section className="wida-card wida-aicare-card">
            <div className="wida-card-header">
              <div className="wida-aicare-badge">
                <span className="aicare-loop-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                      fill="#007c77"
                    />
                  </svg>
                </span>
                <h3 className="wida-aicare-title">AI Care</h3>
              </div>
              <div className="wida-aicare-actions">
                <button type="button" className="aicare-btn" title="Search Medical Knowledge">🔍</button>
                <button type="button" className="aicare-btn" title="Options">•••</button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="wida-aicare-chat">
              {aiChatMessages.map((msg) => (
                <div key={msg.id} className={`wida-chat-msg ${msg.sender}`}>
                  <div className="wida-msg-header">
                    <div className="wida-msg-author">
                      {msg.avatar ? (
                        <img src={msg.avatar} alt={msg.name} className="chat-avatar" />
                      ) : (
                        <span className="chat-ai-ico">✦</span>
                      )}
                      <span className="chat-author-name">{msg.name}</span>
                    </div>
                    <span className="wida-msg-action-icon">{msg.sender === 'user' ? '✏️' : '🔖'}</span>
                  </div>

                  <p className="wida-msg-text">{msg.text}</p>

                  {/* Attached Diagnostic Visual if available */}
                  {msg.image && (
                    <div
                      className="wida-msg-image-wrap"
                      onClick={() => setEnlargedImage(msg.image)}
                      title="Click to expand scan"
                    >
                      <img src={msg.image} alt="Diagnostic Scan" className="wida-msg-img" />
                    </div>
                  )}

                  {msg.hasDownload && (
                    <div className="wida-msg-attachment-bar">
                      <div className="attachment-info">
                        <img src={brainScanImg} alt="Thumbnail" className="attachment-thumb" />
                        <span>Diagnostic_Assessment_Summary.pdf</span>
                      </div>
                      <button
                        type="button"
                        className="attachment-download-btn"
                        onClick={() => alert('Downloading WIDA AI diagnostic report...')}
                        title="Download report"
                      >
                        ⬇
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendAiMessage} className="wida-aicare-input-bar">
              <button type="button" className="wida-mic-btn" title="Voice Input" onClick={() => alert('Voice input active')}>
                🎙️
              </button>
              <input
                type="text"
                placeholder="Search now / Ask AI Care..."
                className="wida-chat-input"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
              />
              <button type="submit" className="wida-send-btn" title="Send message">
                ➤
              </button>
            </form>
          </section>
        </div>
      </div>

      {/* ── Enlarged Scan Image Modal ──────────────────────── */}
      {enlargedImage && (
        <div className="wida-img-modal-overlay" onClick={() => setEnlargedImage(null)}>
          <div className="wida-img-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="wida-img-modal-close"
              onClick={() => setEnlargedImage(null)}
            >
              ✕
            </button>
            <img src={enlargedImage} alt="Expanded Diagnostic Scan" className="wida-modal-scan-img" />
            <div className="wida-img-modal-caption">
              WIDA High-Resolution Clinical Diagnostic Scan
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
