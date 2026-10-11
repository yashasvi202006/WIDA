import React, { useState } from 'react';
import anatomyModelImg from '../../assets/dashboard/anatomy_model.jpg';
import heartScanImg from '../../assets/dashboard/heart_scan.jpg';
import kidneyScanImg from '../../assets/dashboard/kidney_scan.jpg';
import kneeScanImg from '../../assets/dashboard/knee_scan.jpg';
import brainScanImg from '../../assets/dashboard/brain_scan.jpg';

export const DoctorDashboard = ({
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
  const [selectedOrgan, setSelectedOrgan] = useState('Heart');
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
      name: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: 'Brain problems can manifest in various ways, and symptoms may include headaches, memory issues, changes in mood or behavior, difficulty concentrating, or physical coordination problems.',
      image: brainScanImg,
    },
    {
      id: 2,
      sender: 'ai',
      name: 'AI Care',
      text: '• Brain problems can manifest in various ways, and symptoms may include headaches, memory issues, changes in mood or behavior, difficulty concentrating, or physical coordination problems.',
      hasDownload: true,
    },
  ]);

  // Appointments data
  const [appointmentsList, setAppointmentsList] = useState([
    {
      id: 101,
      title: 'MRI-Right thing',
      doctor: 'Dr. Damian Lewis',
      role: 'Cardiologist',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      time: '06:30PM',
      status: 'Ready',
    },
    {
      id: 102,
      title: 'Surgery preparation',
      doctor: 'Dr. Dianne Russell',
      role: 'Cardiologist',
      avatar: 'https://images.unsplash.com/photo-1594824813682-1c2550ec1969?w=150&auto=format&fit=crop&q=80',
      time: '08:30PM',
      status: 'Scheduled',
    },
  ]);

  // Health Overview tabs data
  const healthDataByOrgan = {
    Heart: [
      { label: 'Heart Rate', status: 'Normal', statusType: 'success', val: '120 bpm', icon: '❤️', bgPulse: true },
      { label: 'Blood Count', status: 'Good', statusType: 'success', val: '80-90', icon: '🩸' },
      { label: 'Glucose', status: 'Normal', statusType: 'success', val: '230 /ml', icon: '🧪' },
      { label: 'Hemoglobin', status: 'Low', statusType: 'warning', val: '56 /ml', icon: '🧬' },
    ],
    Lungs: [
      { label: 'SpO2 Oxygen', status: 'Normal', statusType: 'success', val: '98%', icon: '🫁' },
      { label: 'Respiration', status: 'Normal', statusType: 'success', val: '16 /min', icon: '💨' },
      { label: 'Peak Flow', status: 'Good', statusType: 'success', val: '480 L/m', icon: '📊' },
      { label: 'Airway Flow', status: 'Clear', statusType: 'success', val: 'Optimal', icon: '🛡️' },
    ],
    Stomach: [
      { label: 'Gastric Acid', status: 'Normal', statusType: 'success', val: '1.8 pH', icon: '🧪' },
      { label: 'Motility', status: 'Good', statusType: 'success', val: '3 cpm', icon: '⚡' },
      { label: 'Gut Flora', status: 'Healthy', statusType: 'success', val: 'Balanced', icon: '🌱' },
      { label: 'Hydration', status: 'Good', statusType: 'success', val: '2.4 L', icon: '💧' },
    ],
    Body: [
      { label: 'BMI Index', status: 'Normal', statusType: 'success', val: '22.4', icon: '⚖️' },
      { label: 'Body Temp', status: 'Normal', statusType: 'success', val: '98.6 °F', icon: '🌡️' },
      { label: 'Blood Pressure', status: 'Optimal', statusType: 'success', val: '118/76', icon: '🩺' },
      { label: 'Sleep Score', status: 'Good', statusType: 'success', val: '84 pts', icon: '🌙' },
    ],
    Eye: [
      { label: 'Vision Left', status: 'Normal', statusType: 'success', val: '20/20', icon: '👁️' },
      { label: 'Vision Right', status: 'Normal', statusType: 'success', val: '20/25', icon: '👁️' },
      { label: 'Intraocular', status: 'Optimal', statusType: 'success', val: '14 mmHg', icon: '🎯' },
      { label: 'Tear Film', status: 'Good', statusType: 'success', val: 'Stable', icon: '💧' },
    ],
  };

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
          <h1 className="wida-greeting-title">Good Morning! 👋</h1>
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
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Doctor Avatar"
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
                      <img
                        src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80"
                        alt="Dr. Sharad Richard"
                        className="wida-doc-thumb"
                      />
                      <span className="wida-doc-name">Dr.Sharad Richard</span>
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
                      <img
                        src="https://images.unsplash.com/photo-1594824813682-1c2550ec1969?w=100&auto=format&fit=crop&q=80"
                        alt="Dr. Leslie Alexander"
                        className="wida-doc-thumb"
                      />
                      <span className="wida-doc-name">Dr.Leslie Alexander</span>
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
                      <img
                        src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&auto=format&fit=crop&q=80"
                        alt="Dr. Robert Fox"
                        className="wida-doc-thumb"
                      />
                      <span className="wida-doc-name">Dr.Robert Fox</span>
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

          {/* ── Card 2: Health Overview ─────────────────────── */}
          <section className="wida-card wida-overview-card">
            <div className="wida-card-header">
              <h2 className="wida-card-title">Health Overview</h2>
              <div className="wida-date-pill">
                <span>📅</span>
                <span>{activeDateFilter}</span>
                <span className="arrow">▾</span>
              </div>
            </div>

            {/* Organ Tabs */}
            <div className="wida-organ-tabs">
              {['Heart', 'Lungs', 'Stomach', 'Body', 'Eye'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`wida-organ-tab ${selectedOrgan === tab ? 'active-tab' : ''}`}
                  onClick={() => setSelectedOrgan(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Metric Cards Row */}
            <div className="wida-metrics-grid">
              {(healthDataByOrgan[selectedOrgan] || healthDataByOrgan['Heart']).map((metric, idx) => (
                <div key={idx} className="wida-metric-item">
                  <div className="wida-metric-top">
                    <span className="wida-metric-icon">{metric.icon}</span>
                    <div className="wida-metric-meta">
                      <span className="wida-metric-label">{metric.label}</span>
                      <span className={`wida-status-pill ${metric.statusType}`}>
                        {metric.status}
                      </span>
                    </div>
                  </div>
                  <div className="wida-metric-val">{metric.val}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Card 3: Your Prescriptions ──────────────────── */}
          <section className="wida-card wida-prescriptions-card">
            <div className="wida-card-header">
              <h2 className="wida-card-title">Your Prescriptions</h2>
              <div className="wida-date-pill">
                <span>📅</span>
                <span>{activeDateFilter}</span>
                <span className="arrow">▾</span>
              </div>
            </div>

            <div className="wida-rx-grid">
              {/* Prescription 1 */}
              <div className="wida-rx-card">
                <div className="wida-rx-top">
                  <div className="wida-rx-title-group">
                    <span className="wida-rx-icon rx-purple">💊</span>
                    <div>
                      <h4 className="wida-rx-name">Paracetamol - 500mg</h4>
                      <p className="wida-rx-instruction">1 tablet every day for 2 weeks</p>
                    </div>
                  </div>
                  <button type="button" className="wida-rx-more-btn" title="Options">•••</button>
                </div>
                <div className="wida-rx-timing-row">
                  <div className="wida-timing-pill">
                    <span className="timing-icon">☀️</span>
                    <span className="timing-label">Morning</span>
                    <span className="timing-dose">1-pill</span>
                  </div>
                  <div className="wida-timing-pill">
                    <span className="timing-icon">🌤️</span>
                    <span className="timing-label">Afternoon</span>
                    <span className="timing-dose">1-pill</span>
                  </div>
                  <div className="wida-timing-pill">
                    <span className="timing-icon">🌙</span>
                    <span className="timing-label">Evening</span>
                    <span className="timing-dose">1-pill</span>
                  </div>
                </div>
              </div>

              {/* Prescription 2 */}
              <div className="wida-rx-card">
                <div className="wida-rx-top">
                  <div className="wida-rx-title-group">
                    <span className="wida-rx-icon rx-blue">🧴</span>
                    <div>
                      <h4 className="wida-rx-name">Liquifying - 450ml</h4>
                      <p className="wida-rx-instruction">1 teaspoon every day for 2 weeks</p>
                    </div>
                  </div>
                  <button type="button" className="wida-rx-more-btn" title="Options">•••</button>
                </div>
                <div className="wida-rx-timing-row">
                  <div className="wida-timing-pill">
                    <span className="timing-icon">☀️</span>
                    <span className="timing-label">Morning</span>
                    <span className="timing-dose">1-spoon</span>
                  </div>
                  <div className="wida-timing-pill">
                    <span className="timing-icon">🌤️</span>
                    <span className="timing-label">Afternoon</span>
                    <span className="timing-dose">1-spoon</span>
                  </div>
                  <div className="wida-timing-pill">
                    <span className="timing-icon">🌙</span>
                    <span className="timing-label">Evening</span>
                    <span className="timing-dose">1-spoon</span>
                  </div>
                </div>
              </div>
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
                    <h4 className="wida-apt-subject">{apt.title}</h4>
                    <button
                      type="button"
                      className="wida-join-btn"
                      onClick={() => alert(`Starting clinical session for: ${apt.title}`)}
                    >
                      Join Now
                    </button>
                  </div>
                  <div className="wida-apt-footer-row">
                    <div className="wida-apt-doc-info">
                      <img src={apt.avatar} alt={apt.doctor} className="doc-avatar-sm" />
                      <div>
                        <div className="doc-name-bold">{apt.doctor}</div>
                        <div className="doc-specialty-sub">{apt.role}</div>
                      </div>
                    </div>
                    <div className="wida-apt-time">
                      <span>🕒</span>
                      <span>{apt.time}</span>
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
