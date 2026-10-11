import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Siren,
  ArrowRight,
  AlertCircle,
  Volume2,
  VolumeX,
  PhoneCall,
  MapPin,
  Clock,
  ShieldAlert,
  HeartPulse,
  Activity,
  Radio,
  FileText,
  UserCheck,
  Check,
  Flame,
  Truck
} from 'lucide-react';

const EMERGENCY_PRESETS = [
  { id: 'cardiac', label: 'Chest Pain / Cardiac Emergency', icon: '🫀', color: '#EF4444', advice: 'Keep patient in half-sitting position. Loosen tight collar. Administer 300mg chewable Aspirin if conscious and not allergic. Do not give water.' },
  { id: 'trauma', label: 'Road Accident / Severe Trauma', icon: '🚗', color: '#F97316', advice: 'Do not move patient unless in immediate danger of fire. Apply firm direct pressure to bleeding with clean cloth. Keep cervical spine still.' },
  { id: 'respiratory', label: 'Acute Breathing Distress / Asthma', icon: '🫁', color: '#0EA5E9', advice: 'Sit upright leaning forward. Help patient use rescue inhaler (Salbutamol). Keep room well ventilated. Stay calm.' },
  { id: 'seizure', label: 'Stroke / Seizure / Unconscious', icon: '⚡', color: '#8B5CF6', advice: 'Clear area of sharp objects. Turn patient onto their side (recovery position) to protect airway. Never place anything in their mouth.' },
  { id: 'general', label: 'Critical Medical Crisis / Collapse', icon: '⚠️', color: '#DC2626', advice: 'Verify breathing and pulse. Maintain open airway. Keep warm. Prepare patient medical summary for arriving paramedics.' }
];

export const EmergencySosCard = ({
  patient,
  onRequestEmergency,
  activeRequest,
  onAdvanceStatus,
  onDeactivateEmergency
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState('Emergency Drill / Test Simulation');
  const [selectedPreset, setSelectedPreset] = useState(EMERGENCY_PRESETS[0]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [autoSimulate, setAutoSimulate] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(405); // ~6 mins 45s
  const [actionNotice, setActionNotice] = useState(null);
  
  const audioContextRef = useRef(null);
  const audioTimerRef = useRef(null);

  const stages = [
    'Alert Sent',
    'Request Received',
    'Response Assigned',
    'Ambulance Dispatched',
    'Hospital Notified',
    'Arrived'
  ];

  const currentStageIndex = activeRequest ? stages.indexOf(activeRequest.status) : -1;

  // Audio Dispatch Tone Synthesizer using Web Audio API
  const playEmergencyTone = () => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        }
      }
      const ctx = audioContextRef.current;
      if (!ctx || ctx.state === 'suspended') {
        ctx?.resume();
      }

      if (ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch A5
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.18); // Drop pitch
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Sound loop when active and soundEnabled is true
  useEffect(() => {
    if (activeRequest && soundEnabled) {
      playEmergencyTone();
      audioTimerRef.current = setInterval(() => {
        playEmergencyTone();
      }, 2500);
    } else {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
    }

    return () => {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
    };
  }, [activeRequest, soundEnabled]);

  // ETA countdown tick
  useEffect(() => {
    let timer = null;
    if (activeRequest && currentStageIndex < stages.length - 1) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => (prev > 10 ? prev - 1 : 10));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeRequest, currentStageIndex, stages.length]);

  // Auto simulation advance timer
  useEffect(() => {
    let simTimer = null;
    if (autoSimulate && activeRequest && onAdvanceStatus && currentStageIndex < stages.length - 1) {
      simTimer = setInterval(() => {
        onAdvanceStatus(activeRequest.id, stages[currentStageIndex + 1]);
      }, 8000);
    }
    return () => {
      if (simTimer) clearInterval(simTimer);
    };
  }, [autoSimulate, activeRequest, currentStageIndex, stages, onAdvanceStatus]);

  const handleTrigger = () => {
    setShowConfirm(false);
    onRequestEmergency(`Sector 62, Noida, Uttar Pradesh (GPS Lat: 28.6280° N, Long: 77.3649° E) • Category: ${selectedPreset.label}`);
    setSecondsRemaining(420);
    setSoundEnabled(true);
  };

  const handleNextStage = () => {
    if (activeRequest && onAdvanceStatus && currentStageIndex < stages.length - 1) {
      onAdvanceStatus(activeRequest.id, stages[currentStageIndex + 1]);
    }
  };

  const handleDeactivate = () => {
    if (activeRequest && onDeactivateEmergency) {
      onDeactivateEmergency(activeRequest.id);
    }
    setShowDeactivateConfirm(false);
    setSoundEnabled(false);
    setAutoSimulate(false);
  };

  const handleSimulateCall = (name, number) => {
    setActionNotice(`Initiating direct priority patch call to ${name} (${number})...`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const formatCountdown = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  // Dynamic distance based on stage
  const getDynamicDistance = () => {
    switch (currentStageIndex) {
      case 0:
      case 1:
        return '3.8 km away (At Dispatch Base)';
      case 2:
        return '2.9 km away (Leaving Depot)';
      case 3:
        return '1.8 km away (NH-24 Green Corridor)';
      case 4:
        return '0.4 km away (Turning into Sector 62)';
      case 5:
        return '0.0 km (On Scene / Arrived)';
      default:
        return '2.4 km away';
    }
  };

  return (
    <div
      className="patient-card p-4 border-danger position-relative overflow-hidden"
      style={{
        borderColor: activeRequest ? 'var(--p-danger)' : 'rgba(220, 38, 38, 0.3)',
        boxShadow: activeRequest ? '0 0 25px rgba(239, 68, 68, 0.25)' : 'none'
      }}
    >
      {/* Top Prototype & Academic Evaluation Banner */}
      <div
        className="p-3 mb-4 rounded d-flex align-items-center justify-content-between flex-wrap gap-2 border"
        style={{
          backgroundColor: 'var(--p-warning-light)',
          borderColor: 'rgba(245, 158, 11, 0.4)',
          color: '#92400E',
          fontSize: '0.85rem'
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <span>
            <strong>Prototype Demonstration:</strong> High-fidelity digital emergency dispatch simulation. In a real life-threatening emergency, immediately dial <strong>112 / 102</strong>.
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-warning text-dark border border-warning" style={{ fontSize: '0.72rem' }}>
            Telemetry: ACTIVE GPS
          </span>
        </div>
      </div>

      {/* Main SOS Trigger / Active Dispatch Header */}
      <div className="row align-items-center mb-4 g-3">
        <div className="col-lg-8">
          <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
            <span className={`patient-badge ${activeRequest ? 'patient-badge-danger animate-pulse' : 'patient-badge-danger'}`}>
              <Siren size={14} className={activeRequest ? 'animate-spin' : ''} />
              {activeRequest ? 'CODE RED DISPATCH ACTIVE' : 'Rapid Response SOS Beacon'}
            </span>

            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
              High-Precision GNSS Coordinates & Hospital ER Interop
            </span>

            {activeRequest && (
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`patient-btn patient-btn-sm d-inline-flex align-items-center gap-1 p-1 px-2 ${
                  soundEnabled ? 'patient-btn-danger' : 'patient-btn-outline'
                }`}
                style={{ fontSize: '0.72rem' }}
                title={soundEnabled ? 'Mute emergency sound' : 'Enable emergency beacon sound'}
              >
                {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                <span>{soundEnabled ? 'Siren Audio ON' : 'Audio Muted'}</span>
              </button>
            )}
          </div>

          <h4 className="font-heading mb-2 text-danger fw-bold d-flex align-items-center gap-2">
            <span>Integrated Emergency Medical Telemetry</span>
            {activeRequest && (
              <span className="spinner-grow text-danger spinner-grow-sm" role="status"></span>
            )}
          </h4>

          <p className="text-muted mb-0" style={{ fontSize: '0.88rem', lineHeight: '1.55' }}>
            One-touch activation broadcasts your exact GPS coordinates, blood group ({patient.bloodGroup}), active medications, and severe allergies directly to the nearest Advanced Cardiac Life Support (ACLS) ambulance and trauma emergency room.
          </p>
        </div>

        <div className="col-lg-4 text-center my-2 my-lg-0">
          {!activeRequest ? (
            <div className="d-flex flex-column align-items-center">
              <button
                type="button"
                className="patient-emergency-btn mx-auto shadow-lg"
                onClick={() => setShowConfirm(true)}
                aria-label="Request Emergency Assistance"
                style={{
                  width: '135px',
                  height: '135px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #EF4444 0%, #B91C1C 100%)',
                  boxShadow: '0 0 35px rgba(239, 68, 68, 0.45)',
                  cursor: 'pointer',
                  border: '4px solid #ffffff'
                }}
              >
                <Siren size={36} className="mb-1" />
                <span className="fw-bold fs-4">SOS</span>
                <span style={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                  TAP FOR HELP
                </span>
              </button>
              <span className="text-muted mt-2" style={{ fontSize: '0.74rem' }}>
                Instant satellite beacon & trauma team dispatch
              </span>
            </div>
          ) : (
            <div
              className="p-3 rounded border border-danger text-center shadow-sm"
              style={{
                backgroundColor: 'var(--p-danger-light)',
                borderWidth: '2px'
              }}
            >
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <span
                  className="spinner-grow spinner-grow-sm text-danger"
                  role="status"
                  style={{ width: '0.75rem', height: '0.75rem' }}
                ></span>
                <span className="fw-bold text-danger fs-6">AMBULANCE EN ROUTE</span>
              </div>

              <div className="p-2 bg-white rounded border mb-2">
                <div className="d-flex align-items-center justify-content-between px-2" style={{ fontSize: '0.78rem' }}>
                  <span className="text-muted">Estimated Arrival:</span>
                  <strong className="text-danger fs-6">{formatCountdown(secondsRemaining)}</strong>
                </div>
                <div className="progress mt-1" style={{ height: '5px' }}>
                  <div
                    className="progress-bar bg-danger progress-bar-striped progress-bar-animated"
                    style={{
                      width: `${Math.min(100, Math.max(15, ((stages.length - 1 - currentStageIndex) / (stages.length - 1)) * 100))}%`
                    }}
                  ></div>
                </div>
              </div>

              <div className="text-start mb-2" style={{ fontSize: '0.78rem' }}>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Vehicle:</span>
                  <strong>{activeRequest.ambulanceNumber || 'DL-01-AMB-9488 (ALS)'}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Distance:</span>
                  <strong className="text-primary">{getDynamicDistance()}</strong>
                </div>
              </div>

              <button
                type="button"
                id="btn-deactivate-sos"
                className="patient-btn patient-btn-outline patient-btn-sm w-100 text-danger border-danger d-flex align-items-center justify-content-center gap-1"
                style={{ backgroundColor: 'var(--p-surface)', borderColor: 'var(--p-danger)', fontSize: '0.78rem' }}
                onClick={() => setShowDeactivateConfirm(true)}
                title="Deactivate and cancel this emergency SOS broadcast"
              >
                <AlertCircle size={14} />
                <span>Stand Down / Deactivate SOS</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Preset Selector (When Not Active or When Configuring) */}
      {!activeRequest && (
        <div className="p-3 rounded border mb-4" style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)' }}>
          <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-1">
            <span className="fw-bold font-heading" style={{ fontSize: '0.86rem' }}>
              Select Nature of Crisis (Optimizes Paramedic & Trauma ER Preparation):
            </span>
            <span className="text-muted" style={{ fontSize: '0.74rem' }}>
              Pre-authorizes targeted surgical & telemetry protocol
            </span>
          </div>

          <div className="d-flex flex-wrap gap-2">
            {EMERGENCY_PRESETS.map((p) => {
              const isSelected = selectedPreset.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPreset(p)}
                  className={`patient-btn patient-btn-sm d-flex align-items-center gap-1 ${
                    isSelected ? 'patient-btn-primary' : 'patient-btn-outline'
                  }`}
                  style={{
                    fontSize: '0.78rem',
                    borderRadius: 'var(--p-radius-full)',
                    borderColor: isSelected ? 'var(--p-danger)' : undefined,
                    backgroundColor: isSelected ? '#DC2626' : undefined
                  }}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          <div
            className="p-2 px-3 mt-2 rounded border d-flex align-items-center gap-2"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', fontSize: '0.8rem' }}
          >
            <ShieldAlert size={15} className="text-danger flex-shrink-0" />
            <span className="text-muted">
              <strong>Immediate Bystander Protocol ({selectedPreset.label}):</strong> {selectedPreset.advice}
            </span>
          </div>
        </div>
      )}

      {/* Live Action Toast Notice */}
      {actionNotice && (
        <div
          className="p-2 px-3 mb-3 rounded bg-dark text-white d-flex align-items-center gap-2 shadow"
          style={{ fontSize: '0.82rem' }}
        >
          <PhoneCall size={14} className="text-success animate-pulse" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Real-time Telemetry Grid (GPS, Ambulance, Trauma Center, Critical Medical Profile) */}
      <div className="row g-3 mb-4">
        {/* Box 1: GPS Live Telemetry */}
        <div className="col-md-6 col-xl-3">
          <div
            className="p-3 rounded border h-100"
            style={{ backgroundColor: 'var(--p-surface)', borderColor: 'var(--p-border)' }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fw-semibold text-danger d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
                <MapPin size={14} /> Satellite GPS Telemetry
              </span>
              <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.68rem' }}>
                GNSS LOCKED
              </span>
            </div>
            <div className="fw-bold" style={{ fontSize: '0.84rem' }}>
              Sector 62, Noida, Uttar Pradesh
            </div>
            <div className="font-monospace text-muted mt-1" style={{ fontSize: '0.74rem' }}>
              Lat: 28.6280° N • Long: 77.3649° E
            </div>
            <div className="text-muted mt-1" style={{ fontSize: '0.72rem' }}>
              Accuracy: <strong className="text-success">±3.2 meters</strong> • Route: NH-24 Green Light Corridor
            </div>
          </div>
        </div>

        {/* Box 2: Pre-Authorized Critical Profile */}
        <div className="col-md-6 col-xl-3">
          <div
            className="p-3 rounded border h-100"
            style={{ backgroundColor: 'var(--p-surface)', borderColor: 'var(--p-border)' }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fw-semibold d-flex align-items-center gap-1 text-primary" style={{ fontSize: '0.8rem' }}>
                <HeartPulse size={14} /> Critical Vitals Profile
              </span>
              <span className="badge bg-danger text-white fw-bold" style={{ fontSize: '0.74rem' }}>
                {patient.bloodGroup}
              </span>
            </div>
            <div className="text-muted" style={{ fontSize: '0.76rem' }}>
              Patient: <strong className="text-dark">{patient.name}</strong> ({patient.age || '42'} yrs, {patient.gender})
            </div>
            <div className="text-muted mt-1" style={{ fontSize: '0.74rem' }}>
              Allergies: <strong className="text-danger">{patient.allergies?.join(', ') || 'None reported'}</strong>
            </div>
            <div className="text-muted mt-1" style={{ fontSize: '0.74rem' }}>
              Chronic: <strong className="text-dark">{patient.chronicConditions?.join(', ') || 'Mild Hypertension'}</strong>
            </div>
          </div>
        </div>

        {/* Box 3: Receiving Trauma Hospital Sync */}
        <div className="col-md-6 col-xl-3">
          <div
            className="p-3 rounded border h-100"
            style={{ backgroundColor: 'var(--p-surface)', borderColor: 'var(--p-border)' }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fw-semibold text-teal d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
                <Activity size={14} /> Receiving Trauma ER
              </span>
              <span className="badge bg-danger text-white" style={{ fontSize: '0.68rem' }}>
                CODE RED
              </span>
            </div>
            <div className="fw-bold text-truncate" style={{ fontSize: '0.82rem' }}>
              Max Super Speciality Trauma
            </div>
            <div className="text-muted mt-1" style={{ fontSize: '0.74rem' }}>
              Bed: <strong className="text-success">Resuscitation Bay #3</strong>
            </div>
            <div className="text-muted mt-1" style={{ fontSize: '0.72rem' }}>
              On-Duty: Dr. Rajesh Mehta (ER MD) • Blood: 4 units {patient.bloodGroup} matched
            </div>
          </div>
        </div>

        {/* Box 4: Emergency Contacts & Hotlines */}
        <div className="col-md-6 col-xl-3">
          <div
            className="p-3 rounded border h-100"
            style={{ backgroundColor: 'var(--p-surface)', borderColor: 'var(--p-border)' }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fw-semibold text-secondary d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
                <PhoneCall size={14} /> Immediate Hotlinks
              </span>
              <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.68rem' }}>
                24x7 DIRECT
              </span>
            </div>
            <div className="d-flex flex-column gap-1">
              <button
                type="button"
                className="btn btn-sm btn-outline-danger p-1 text-start d-flex align-items-center justify-content-between"
                style={{ fontSize: '0.74rem' }}
                onClick={() => handleSimulateCall(patient.emergencyContact?.name || 'Primary Contact', patient.emergencyContact?.phone || '+91 98765 43210')}
              >
                <span>Call {patient.emergencyContact?.name?.split(' ')[0] || 'Contact'}</span>
                <span className="fw-bold">{patient.emergencyContact?.phone || '+91 98765 43210'}</span>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline-primary p-1 text-start d-flex align-items-center justify-content-between"
                style={{ fontSize: '0.74rem' }}
                onClick={() => handleSimulateCall('Ambulance Central Dispatch', '108 / 112')}
              >
                <span>National Dispatch</span>
                <span className="fw-bold">112 / 108</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Dispatch Stages when active */}
      {activeRequest && (
        <div
          className="p-4 rounded border mb-4 shadow-sm"
          style={{ backgroundColor: 'var(--p-surface)', borderColor: 'var(--p-border)' }}
        >
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <div>
              <h6 className="font-heading mb-0 fw-bold d-flex align-items-center gap-2" style={{ fontSize: '0.98rem' }}>
                <Radio size={16} className="text-danger animate-pulse" />
                Live Emergency Telemetry & Multi-Agency Dispatch Stages
              </h6>
              <span className="text-muted" style={{ fontSize: '0.76rem' }}>
                Real-time satellite tracking of ALS unit DL-01-AMB-9488 with trauma room sync
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <label
                className="d-flex align-items-center gap-1 me-2"
                style={{ fontSize: '0.76rem', cursor: 'pointer' }}
                title="Automatically step through emergency dispatch simulation"
              >
                <input
                  type="checkbox"
                  checked={autoSimulate}
                  onChange={(e) => setAutoSimulate(e.target.checked)}
                />
                <span className="text-muted">Auto-Simulate Live Stages</span>
              </label>

              {currentStageIndex < stages.length - 1 && (
                <button
                  type="button"
                  className="patient-btn patient-btn-outline patient-btn-sm d-flex align-items-center gap-1"
                  onClick={handleNextStage}
                >
                  <span>Simulate Next Stage</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2" style={{ fontSize: '0.78rem' }}>
            {stages.map((stg, idx) => {
              const isPast = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div key={stg} className="d-flex flex-column align-items-center text-center flex-fill">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: isCurrent ? 'var(--p-danger)' : isPast ? '#059669' : 'var(--p-surface-alt)',
                      color: isPast ? '#ffffff' : 'var(--p-text-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      marginBottom: 6,
                      border: isCurrent ? '3px solid #FECACA' : isPast ? 'none' : '1px solid var(--p-border)',
                      boxShadow: isCurrent ? '0 0 12px rgba(239, 68, 68, 0.4)' : 'none'
                    }}
                  >
                    {isPast && !isCurrent ? <Check size={16} /> : isCurrent ? <Siren size={15} /> : idx + 1}
                  </div>
                  <span
                    style={{
                      fontWeight: isCurrent ? 700 : isPast ? 600 : 500,
                      color: isCurrent ? 'var(--p-danger)' : isPast ? 'var(--p-text-main)' : 'var(--p-text-subtle)'
                    }}
                  >
                    {stg}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Real-time incident telemetry feed */}
          <div
            className="mt-3 p-3 rounded border font-monospace"
            style={{ backgroundColor: '#0F172A', color: '#38BDF8', fontSize: '0.74rem' }}
          >
            <div className="d-flex align-items-center justify-content-between text-muted border-bottom border-secondary pb-1 mb-2">
              <span className="text-secondary fw-bold">DISPATCH TELEMETRY LOG</span>
              <span className="text-success">CONNECTED • 128-BIT ENCRYPTED</span>
            </div>
            <div>[+00:00] Beacon activated by {patient.name} via WIDA Patient Portal</div>
            <div>[+00:04] Satellite GPS locked: 28.6280° N, 77.3649° E (Accuracy: ±3.2m)</div>
            <div>[+00:09] Auto-SMS & voice alert sent to emergency contact: {patient.emergencyContact?.name} ({patient.emergencyContact?.phone})</div>
            {currentStageIndex >= 2 && (
              <div className="text-warning">[+00:15] Advanced Life Support Ambulance DL-01-AMB-9488 dispatched with Paramedic Vikram Singh</div>
            )}
            {currentStageIndex >= 3 && (
              <div className="text-warning">[+00:22] Green Corridor activated on NH-24. Speed: 58 km/h. ETA ~{formatCountdown(secondsRemaining)}</div>
            )}
            {currentStageIndex >= 4 && (
              <div className="text-info">[+00:30] Max Super Speciality ER Resuscitation Bay #3 reserved. Vitals pre-streamed to trauma team.</div>
            )}
            {currentStageIndex >= 5 && (
              <div className="text-success fw-bold">[+00:45] Paramedic team on-scene. Patient triage complete. Resuscitation protocol initiated.</div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="patient-modal-backdrop" role="dialog" aria-modal="true">
          <div className="patient-modal-box p-4" style={{ maxWidth: 500 }}>
            <div className="text-center mb-3">
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: 'var(--p-danger-light)',
                  color: 'var(--p-danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}
              >
                <AlertTriangle size={36} />
              </div>
              <h5 className="font-heading text-danger mb-1 fw-bold">Confirm Emergency SOS Broadcast</h5>
              <p className="text-muted" style={{ fontSize: '0.86rem', lineHeight: '1.5' }}>
                You are about to activate high-priority emergency medical dispatch. This transmits your live GPS coordinates, Blood Group (<strong>{patient.bloodGroup}</strong>), and severe allergies to first responders and emergency contacts.
              </p>
            </div>

            <div className="p-3 bg-light rounded border mb-3" style={{ fontSize: '0.8rem' }}>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Selected Crisis Type:</span>
                <strong>{selectedPreset.label}</strong>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Assigned Emergency Contact:</span>
                <strong>{patient.emergencyContact?.name} ({patient.emergencyContact?.phone})</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">GPS Telemetry:</span>
                <strong className="text-success">Sector 62, Noida (Locked)</strong>
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-center">
              <button
                type="button"
                className="patient-btn patient-btn-outline"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="patient-btn patient-btn-danger d-flex align-items-center gap-2"
                onClick={handleTrigger}
              >
                <Siren size={16} />
                <span>Confirm & Dispatch Immediate Help</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate SOS Confirmation Modal */}
      {showDeactivateConfirm && (
        <div className="patient-modal-backdrop" role="dialog" aria-modal="true">
          <div className="patient-modal-box p-4" style={{ maxWidth: 480 }}>
            <div className="text-center mb-3">
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  color: 'var(--p-danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}
              >
                <AlertCircle size={32} />
              </div>
              <h5 className="font-heading text-danger mb-1 fw-bold">Stand Down Emergency SOS?</h5>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                Are you sure you want to deactivate this emergency broadcast? Paramedics and trauma hospital ER staff will stand down.
              </p>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>
                Reason for Stand Down / Cancellation:
              </label>
              <select
                className="form-select form-select-sm"
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
              >
                <option value="Emergency Drill / Test Simulation">Emergency Drill / Test Simulation</option>
                <option value="Patient Condition Stabilized">Patient Condition Stabilized</option>
                <option value="Alternative Transport / Private Car Used">Alternative Transport / Private Car Used</option>
                <option value="Accidental Tap / False Alarm">Accidental Tap / False Alarm</option>
              </select>
            </div>

            <div className="d-flex gap-2 justify-content-center">
              <button
                type="button"
                className="patient-btn patient-btn-outline"
                onClick={() => setShowDeactivateConfirm(false)}
              >
                Keep SOS Active
              </button>
              <button
                type="button"
                id="btn-confirm-deactivate-sos"
                className="patient-btn patient-btn-danger"
                onClick={handleDeactivate}
              >
                Confirm Stand Down
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
