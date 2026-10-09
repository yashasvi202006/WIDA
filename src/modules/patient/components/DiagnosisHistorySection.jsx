import React, { useState } from 'react';
import { Calendar, Activity, Heart, Droplets, Plus, Minus, RotateCw, ChevronDown, ZoomIn } from 'lucide-react';
import { DiagnosticScanModal } from './DiagnosticScanModal';
const DIAGNOSES = [
    {
        id: 'diag-heart',
        category: 'Heart Problem',
        iconBg: '#DCFCE7',
        iconColor: '#16A34A',
        title: 'Heart Problem',
        description: 'Coronary artery disease is a common heart condition that affects the major blood vessels that supply the heart muscle.',
        doctor: {
            name: 'Dr. Sharad Richard',
            specialty: 'Lead Cardiologist',
            avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150'
        },
        pinCoords: { x: 50, y: 28 },
        scans: {
            primary: '/assets/diagnosis/heart.jpg',
            secondary: '/assets/diagnosis/heart.jpg',
            findings: 'Coronary artery CTA indicates mild focal calcification at mid-LAD. Blood flow hemodynamics maintained with normal fractional flow reserve (FFR > 0.88).'
        }
    },
    {
        id: 'diag-kidney',
        category: 'Kidney Problem',
        iconBg: '#DBEAFE',
        iconColor: '#2563EB',
        title: 'Kidney Problem',
        description: 'Renal artery perfusion and bilateral nephron glomerular filtration monitoring within stable clinical bounds.',
        doctor: {
            name: 'Dr. Leslie Alexander',
            specialty: 'Nephrology Specialist',
            avatar: 'https://images.unsplash.com/photo-1594824813627-8490a6e76192?auto=format&fit=crop&q=80&w=150'
        },
        pinCoords: { x: 50, y: 44 },
        scans: {
            primary: '/assets/diagnosis/kidney.jpg',
            secondary: '/assets/diagnosis/kidney.jpg',
            findings: 'High-resolution renal ultrasound shows symmetric kidneys with preserved corticomedullary differentiation. No nephrolithiasis or hydronephrosis observed.'
        }
    },
    {
        id: 'diag-knee',
        category: 'Knee Problem',
        iconBg: '#EEF2FF',
        iconColor: '#4F46E5',
        title: 'Knee Problem',
        description: 'Medial collateral ligament (MCL) inflammation and patellar cartilage wear under orthopedic rehabilitation.',
        doctor: {
            name: 'Dr. Robert Fox',
            specialty: 'Orthopedic Consultant',
            avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150'
        },
        pinCoords: { x: 44, y: 68 },
        scans: {
            primary: '/assets/diagnosis/knee.jpg',
            secondary: '/assets/diagnosis/knee.jpg',
            findings: 'Sagittal MRI sequence demonstrates Grade 1 medial collateral ligament sprain with minimal localized joint effusion. Cruciate ligaments (ACL/PCL) intact.'
        }
    }
];
export const DiagnosisHistorySection = () => {
    const [selectedDiagnosisId, setSelectedDiagnosisId] = useState('diag-heart');
    const [timeFilter, setTimeFilter] = useState('Today');
    const [zoomLevel, setZoomLevel] = useState(1.0);
    const [viewAngle, setViewAngle] = useState('front');
    const [activeModalScan, setActiveModalScan] = useState({
        isOpen: false,
        title: '',
        category: '',
        imageUrl: '',
        doctorName: '',
        findings: ''
    });
    const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.45));
    const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.85));
    const handleToggleAngle = () => {
        setViewAngle((prev) => (prev === 'front' ? 'angled' : prev === 'angled' ? 'lateral' : 'front'));
    };
    return (<div className="patient-card p-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--p-border-subtle)' }}>
        <div>
          <h5 className="font-heading mb-1" style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            History of Diagnosis
          </h5>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            Interactive 3D anatomical localization with verified clinical diagnostics
          </span>
        </div>

        {/* Time Filter Dropdown */}
        <div className="dropdown">
          <button className="patient-btn patient-btn-outline patient-btn-sm d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <Calendar size={14} style={{ color: 'var(--p-primary)' }}/>
            <span>{timeFilter}</span>
            <ChevronDown size={14} className="text-muted"/>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-sm">
            {['Today', 'Last 30 Days', 'Past Year'].map((opt) => (<li key={opt}>
                <button className={`dropdown-item ${timeFilter === opt ? 'active' : ''}`} onClick={() => setTimeFilter(opt)} style={{ fontSize: '0.82rem' }}>
                  {opt}
                </button>
              </li>))}
          </ul>
        </div>
      </div>

      {/* Main Grid: Anatomical 3D Body + Diagnosis Details */}
      <div className="row g-4 align-items-center">
        {/* Left Column: 3D Anatomical Human Model */}
        <div className="col-lg-5 col-xl-4 d-flex flex-column align-items-center">
          <div className="position-relative d-flex align-items-center justify-content-center p-3 rounded-4 overflow-hidden w-100" style={{
            minHeight: 460,
            maxHeight: 520,
            backgroundColor: 'var(--p-surface-alt)',
            background: 'radial-gradient(ellipse at center, rgba(13, 148, 136, 0.08) 0%, rgba(240, 247, 247, 0.5) 70%, transparent 100%)',
            border: '1px solid var(--p-border-subtle)'
        }}>
            {/* SVG Connecting Curves */}
            <svg className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none" style={{ zIndex: 2, pointerEvents: 'none' }}>
              {DIAGNOSES.map((d) => {
            const isSelected = d.id === selectedDiagnosisId;
            const startX = `${d.pinCoords.x}%`;
            const startY = `${d.pinCoords.y}%`;
            return (<g key={d.id}>
                    {/* Pulsing indicator anchor */}
                    <circle cx={startX} cy={startY} r={isSelected ? 6 : 4} fill={isSelected ? 'var(--p-primary)' : 'rgba(13, 148, 136, 0.5)'}/>
                  </g>);
        })}
            </svg>

            {/* Model Wrapper with dynamic scale & rotation */}
            <div className="position-relative text-center transition-all" style={{
            transform: `scale(${zoomLevel}) ${viewAngle === 'angled' ? 'rotateY(16deg)' : viewAngle === 'lateral' ? 'rotateY(38deg)' : 'none'}`,
            transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            maxHeight: 420
        }}>
              <img src="/assets/diagnosis/body.jpg" alt="3D Anatomical Model" style={{
            maxHeight: 400,
            maxWidth: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 12px 24px rgba(13, 148, 136, 0.15))'
        }}/>

              {/* Pin Hotspots overlaid on the body image */}
              {DIAGNOSES.map((d) => {
            const isSelected = d.id === selectedDiagnosisId;
            return (<button key={d.id} onClick={() => setSelectedDiagnosisId(d.id)} className="position-absolute border-0 rounded-circle p-0 d-flex align-items-center justify-content-center" style={{
                    left: `${d.pinCoords.x}%`,
                    top: `${d.pinCoords.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: isSelected ? 24 : 18,
                    height: isSelected ? 24 : 18,
                    backgroundColor: isSelected ? 'var(--p-primary)' : 'rgba(13, 148, 136, 0.85)',
                    boxShadow: isSelected
                        ? '0 0 0 6px rgba(13, 148, 136, 0.3), 0 0 12px rgba(13, 148, 136, 0.6)'
                        : '0 0 0 3px rgba(13, 148, 136, 0.2)',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: 'all 0.25s ease'
                }} title={`${d.title} - Click to focus`} aria-label={`Highlight ${d.title}`}>
                    <span style={{
                    width: isSelected ? 8 : 6,
                    height: isSelected ? 8 : 6,
                    borderRadius: '50%',
                    backgroundColor: '#ffffff'
                }}/>
                  </button>);
        })}
            </div>

            {/* Bottom 3D Pedestal Controls */}
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex align-items-center gap-2 p-1 px-2 rounded-pill shadow-sm" style={{
            backgroundColor: 'var(--p-surface)',
            border: '1px solid var(--p-border)',
            zIndex: 20
        }}>
              <button onClick={handleZoomOut} className="btn btn-sm btn-light rounded-circle p-1 d-flex align-items-center justify-content-center border-0 text-muted" style={{ width: 26, height: 26 }} title="Zoom Out" aria-label="Zoom Out">
                <Minus size={13}/>
              </button>
              <button onClick={handleToggleAngle} className="btn btn-sm btn-light rounded-circle p-1 d-flex align-items-center justify-content-center border-0 text-teal" style={{ width: 26, height: 26, color: 'var(--p-primary)' }} title="Rotate 3D Perspective" aria-label="Rotate 3D Perspective">
                <RotateCw size={13}/>
              </button>
              <button onClick={handleZoomIn} className="btn btn-sm btn-light rounded-circle p-1 d-flex align-items-center justify-content-center border-0 text-muted" style={{ width: 26, height: 26 }} title="Zoom In" aria-label="Zoom In">
                <Plus size={13}/>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnosis Cards List */}
        <div className="col-lg-7 col-xl-8 d-flex flex-column gap-3">
          {DIAGNOSES.map((d) => {
            const isSelected = d.id === selectedDiagnosisId;
            return (<div key={d.id} onClick={() => setSelectedDiagnosisId(d.id)} className={`p-3 rounded-4 transition-all border ${isSelected ? 'shadow-sm' : ''}`} style={{
                    backgroundColor: isSelected ? 'var(--p-surface)' : 'var(--p-surface-alt)',
                    borderColor: isSelected ? 'var(--p-primary)' : 'var(--p-border-subtle)',
                    cursor: 'pointer',
                    borderWidth: isSelected ? '2px' : '1px'
                }}>
                <div className="row g-3 align-items-center">
                  {/* Diagnosis Details */}
                  <div className="col-md-7 col-xl-8">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{
                    width: 32,
                    height: 32,
                    backgroundColor: d.iconBg,
                    color: d.iconColor
                }}>
                        {d.id === 'diag-heart' && <Heart size={16}/>}
                        {d.id === 'diag-kidney' && <Droplets size={16}/>}
                        {d.id === 'diag-knee' && <Activity size={16}/>}
                      </div>
                      <h6 className="font-heading mb-0 fw-bold" style={{ fontSize: '1rem', color: 'var(--p-text-main)' }}>
                        {d.title}
                      </h6>
                      {isSelected && (<span className="patient-badge patient-badge-teal ms-auto" style={{ fontSize: '0.65rem' }}>
                          Active Pin Focus
                        </span>)}
                    </div>

                    <p className="text-muted mb-3" style={{ fontSize: '0.82rem', lineHeight: 1.45 }}>
                      {d.description}
                    </p>

                    {/* Attending Doctor */}
                    <div className="d-flex align-items-center gap-2">
                      <img src={d.doctor.avatar} alt={d.doctor.name} onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(d.doctor.name)}&background=0D9488&color=fff&bold=true`;
                }} className="rounded-circle" style={{ width: 28, height: 28, objectFit: 'cover' }}/>
                      <span className="fw-semibold text-truncate" style={{ fontSize: '0.82rem', color: 'var(--p-text-main)' }}>
                        {d.doctor.name}
                      </span>
                      <span className="text-muted small">• {d.doctor.specialty}</span>
                    </div>
                  </div>

                  {/* Diagnostic Scan Thumbnails */}
                  <div className="col-md-5 col-xl-4">
                    <div className="d-flex gap-2">
                      {/* Scan 1 */}
                      <div className="position-relative rounded-3 overflow-hidden border flex-fill" style={{
                    height: 80,
                    backgroundColor: '#0a0f1d',
                    cursor: 'pointer'
                }} onClick={(e) => {
                    e.stopPropagation();
                    setActiveModalScan({
                        isOpen: true,
                        title: `${d.title} - Diagnostic Cross-Section`,
                        category: d.category,
                        imageUrl: d.scans.primary,
                        doctorName: d.doctor.name,
                        findings: d.scans.findings
                    });
                }} title="Click to view full scan">
                        <img src={d.scans.primary} alt="Scan thumbnail" className="w-100 h-100" style={{ objectFit: 'cover' }}/>
                        <div className="position-absolute bottom-0 end-0 m-1 p-1 rounded bg-black bg-opacity-70 text-white d-flex align-items-center" style={{ fontSize: '0.6rem' }}>
                          <ZoomIn size={10}/>
                        </div>
                      </div>

                      {/* Scan 2 */}
                      <div className="position-relative rounded-3 overflow-hidden border flex-fill" style={{
                    height: 80,
                    backgroundColor: '#0a0f1d',
                    cursor: 'pointer'
                }} onClick={(e) => {
                    e.stopPropagation();
                    setActiveModalScan({
                        isOpen: true,
                        title: `${d.title} - Telemetry Analysis`,
                        category: d.category,
                        imageUrl: d.scans.secondary,
                        doctorName: d.doctor.name,
                        findings: d.scans.findings
                    });
                }} title="Click to view full scan">
                        <img src={d.scans.secondary} alt="Scan thumbnail" className="w-100 h-100" style={{ objectFit: 'cover' }}/>
                        <div className="position-absolute bottom-0 end-0 m-1 p-1 rounded bg-black bg-opacity-70 text-white d-flex align-items-center" style={{ fontSize: '0.6rem' }}>
                          <ZoomIn size={10}/>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-1">
                      <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                        Click scan for DICOM details
                      </span>
                    </div>
                  </div>
                </div>
              </div>);
        })}
        </div>
      </div>

      {/* High-Resolution Scan Modal */}
      <DiagnosticScanModal isOpen={activeModalScan.isOpen} onClose={() => setActiveModalScan((prev) => ({ ...prev, isOpen: false }))} title={activeModalScan.title} category={activeModalScan.category} imageUrl={activeModalScan.imageUrl} doctorName={activeModalScan.doctorName} date="10 Oct 2026" findings={activeModalScan.findings}/>
    </div>);
};
