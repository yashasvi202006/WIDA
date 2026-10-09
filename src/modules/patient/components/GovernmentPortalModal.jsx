import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  FileText,
  BadgeCheck,
  Building,
  Copy,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  Lock,
  Download,
  Users,
  Search
} from 'lucide-react';

export const GovernmentPortalModal = ({ portal, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [eligibilityCheck, setEligibilityCheck] = useState({
    annualIncome: '< 2.5 Lakhs (BPL / SECC Deprived)',
    ageGroup: 'Adult (18-59)',
    hasRationCard: true,
    hasAbha: true,
    result: null
  });
  const [searchSimText, setSearchSimText] = useState('');

  if (!portal) return null;

  const handleCopyUrl = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigator.clipboard.writeText(portal.officialSource || portal.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleLaunchExternal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const targetUrl = portal.officialSource || portal.url;
    try {
      const win = window.open(targetUrl, '_blank', 'noopener,noreferrer');
      if (!win) {
        window.location.assign(targetUrl);
      }
    } catch {
      window.location.assign(targetUrl);
    }
  };

  const handleCheckEligibility = (e) => {
    if (e) e.preventDefault();
    setEligibilityCheck(prev => ({
      ...prev,
      result: {
        eligible: true,
        scheme: portal.shortName || portal.name,
        confidence: '98% High Probability Match',
        entitlement: portal.coverageAmount || 'Full Government Subsidy & Cashless Treatment',
        verificationCode: `NHA-ABHA-${Math.floor(100000 + Math.random() * 900000)}`
      }
    }));
  };

  const cleanUrl = (portal.officialSource || portal.url || '').replace('https://', '').replace('http://', '').replace(/\/$/, '');

  return (
    <div className="patient-modal-backdrop" role="dialog" aria-modal="true">
      <div
        className="patient-modal-box p-0 overflow-hidden"
        style={{
          maxWidth: '850px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* National Emblem & Official Government Header */}
        <div
          className="p-3 px-4 d-flex align-items-center justify-content-between"
          style={{
            background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
            color: '#ffffff'
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: 42,
                height: 42,
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <Globe size={22} className="text-white" />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-white text-dark fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                  GOVERNMENT OF INDIA
                </span>
                <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.74rem', opacity: 0.9 }}>
                  <ShieldCheck size={13} /> Verified Public Health Portal
                </span>
              </div>
              <h5 className="font-heading mb-0 text-white fw-bold mt-1" style={{ fontSize: '1.15rem' }}>
                {portal.name}
              </h5>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm text-white p-1 rounded-circle"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: 'none' }}
            title="Close portal viewer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Browser URL Simulation Bar */}
        <div
          className="p-2 px-3 d-flex align-items-center justify-content-between gap-2 border-bottom flex-wrap"
          style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)' }}
        >
          <div
            className="d-flex align-items-center gap-2 flex-grow-1 bg-white px-3 py-1 rounded border"
            style={{ fontSize: '0.8rem', maxWidth: '540px' }}
          >
            <Lock size={13} className="text-success flex-shrink-0" />
            <span className="text-success fw-semibold font-monospace" style={{ fontSize: '0.75rem' }}>
              https://
            </span>
            <span className="fw-semibold text-dark font-monospace text-truncate" style={{ fontSize: '0.78rem' }}>
              {cleanUrl}
            </span>
            <span className="badge bg-success-subtle text-success ms-auto border border-success-subtle" style={{ fontSize: '0.68rem' }}>
              .gov.in Verified
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              onClick={handleCopyUrl}
              className="patient-btn patient-btn-outline patient-btn-sm d-flex align-items-center gap-1"
              style={{ fontSize: '0.76rem', padding: '4px 10px' }}
              title="Copy official website link"
            >
              {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
              <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleLaunchExternal}
              className="patient-btn patient-btn-primary patient-btn-sm d-flex align-items-center gap-1"
              style={{ fontSize: '0.76rem', padding: '4px 12px' }}
              title="Open verified website in a new browser window"
            >
              <ExternalLink size={13} />
              <span>Open in New Window</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="d-flex border-bottom px-3 pt-2" style={{ backgroundColor: 'var(--p-surface)' }}>
          <button
            type="button"
            className={`btn btn-link text-decoration-none px-3 py-2 border-bottom border-2 ${
              activeTab === 'overview' ? 'border-teal fw-bold text-teal' : 'border-transparent text-muted'
            }`}
            style={{ fontSize: '0.85rem' }}
            onClick={() => setActiveTab('overview')}
          >
            Scheme Overview & Coverage
          </button>
          <button
            type="button"
            className={`btn btn-link text-decoration-none px-3 py-2 border-bottom border-2 ${
              activeTab === 'eligibility' ? 'border-teal fw-bold text-teal' : 'border-transparent text-muted'
            }`}
            style={{ fontSize: '0.85rem' }}
            onClick={() => setActiveTab('eligibility')}
          >
            Live ABHA Eligibility Check
          </button>
          <button
            type="button"
            className={`btn btn-link text-decoration-none px-3 py-2 border-bottom border-2 ${
              activeTab === 'application' ? 'border-teal fw-bold text-teal' : 'border-transparent text-muted'
            }`}
            style={{ fontSize: '0.85rem' }}
            onClick={() => setActiveTab('application')}
          >
            How to Apply & Documents
          </button>
          <button
            type="button"
            className={`btn btn-link text-decoration-none px-3 py-2 border-bottom border-2 ${
              activeTab === 'simulator' ? 'border-teal fw-bold text-teal' : 'border-transparent text-muted'
            }`}
            style={{ fontSize: '0.85rem' }}
            onClick={() => setActiveTab('simulator')}
          >
            Interactive Portal Sandbox
          </button>
        </div>

        {/* Modal Body with Scroll */}
        <div className="p-4" style={{ overflowY: 'auto', maxHeight: 'calc(90vh - 200px)' }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="d-flex flex-column gap-3">
              <div
                className="p-3 rounded border d-flex align-items-center justify-content-between flex-wrap gap-2"
                style={{ backgroundColor: 'rgba(13, 148, 136, 0.06)', borderColor: 'rgba(13, 148, 136, 0.2)' }}
              >
                <div>
                  <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                    Nodal Ministry & Implementing Authority
                  </span>
                  <div className="fw-bold d-flex align-items-center gap-1" style={{ color: 'var(--p-primary-dark)' }}>
                    <Building size={15} /> {portal.ministry || 'National Health Authority & MoHFW'}
                  </div>
                </div>

                <div className="text-end">
                  <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                    Entitlement Cap / Financial Benefit
                  </span>
                  <div className="fw-bold text-success fs-5">
                    {portal.coverageAmount || '100% Cashless Medical Coverage'}
                  </div>
                </div>
              </div>

              <div>
                <h6 className="font-heading fw-bold mb-2">Key Policy Description</h6>
                <p className="text-muted" style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>
                  {portal.tagline || portal.description}
                </p>
              </div>

              {portal.benefits && portal.benefits.length > 0 && (
                <div>
                  <h6 className="font-heading fw-bold mb-2 d-flex align-items-center gap-1" style={{ color: 'var(--p-primary)' }}>
                    <CheckCircle2 size={16} /> Verified Citizen Entitlements
                  </h6>
                  <div className="row g-2">
                    {portal.benefits.map((b, idx) => (
                      <div key={idx} className="col-md-6">
                        <div
                          className="p-2 px-3 rounded border h-100"
                          style={{ backgroundColor: 'var(--p-surface-alt)', fontSize: '0.82rem' }}
                        >
                          • {b}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {portal.eligibility && portal.eligibility.length > 0 && (
                <div>
                  <h6 className="font-heading fw-bold mb-2 d-flex align-items-center gap-1" style={{ color: 'var(--p-primary)' }}>
                    <Users size={16} /> Eligibility Criteria
                  </h6>
                  <ul className="ps-3 mb-0 text-muted" style={{ fontSize: '0.84rem' }}>
                    {portal.eligibility.map((el, idx) => (
                      <li key={idx} className="mb-1">{el}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Direct Helpline Strip */}
              <div
                className="p-3 rounded border mt-2 d-flex align-items-center justify-content-between flex-wrap gap-2"
                style={{ backgroundColor: 'var(--p-surface-alt)' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-circle bg-danger-subtle text-danger">
                    <PhoneCall size={18} />
                  </div>
                  <div>
                    <span className="fw-bold d-block" style={{ fontSize: '0.84rem' }}>
                      Official 24x7 Toll-Free Citizen Helpline
                    </span>
                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                      Speak directly with government medical desk officers
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <a
                    href="tel:14555"
                    className="patient-badge patient-badge-success text-decoration-none px-3 py-2 fw-bold"
                  >
                    Dial 14555 (Toll-Free)
                  </a>
                  <a
                    href="tel:1075"
                    className="patient-badge patient-badge-teal text-decoration-none px-3 py-2 fw-bold"
                  >
                    Dial 1075 (National)
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ELIGIBILITY CHECK */}
          {activeTab === 'eligibility' && (
            <div className="d-flex flex-column gap-3">
              <div className="p-3 rounded border" style={{ backgroundColor: 'rgba(13, 148, 136, 0.05)' }}>
                <h6 className="font-heading fw-bold mb-1">Instant ABHA & Demographic Eligibility Verifier</h6>
                <p className="text-muted mb-0" style={{ fontSize: '0.82rem' }}>
                  Simulate your real-time eligibility status against National Health Authority databases using your profile credentials.
                </p>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>
                    Household Income Category:
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={eligibilityCheck.annualIncome}
                    onChange={(e) => setEligibilityCheck({ ...eligibilityCheck, annualIncome: e.target.value })}
                  >
                    <option value="< 2.5 Lakhs (BPL / SECC Deprived)">&lt; ₹2.5 Lakhs (BPL / SECC Deprived)</option>
                    <option value="₹2.5 Lakhs - ₹5 Lakhs">₹2.5 Lakhs - ₹5 Lakhs (Middle Income)</option>
                    <option value="> ₹5 Lakhs">&gt; ₹5 Lakhs</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>
                    Age Category:
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={eligibilityCheck.ageGroup}
                    onChange={(e) => setEligibilityCheck({ ...eligibilityCheck, ageGroup: e.target.value })}
                  >
                    <option value="Senior Citizen (70+ years)">Senior Citizen (70+ years - 100% Covered)</option>
                    <option value="Adult (18-59)">Adult (18-59 years)</option>
                    <option value="Child / Infant (0-17)">Child / Infant (0-17 years)</option>
                  </select>
                </div>
              </div>

              <div className="d-flex align-items-center gap-4 py-2">
                <label className="d-flex align-items-center gap-2" style={{ fontSize: '0.84rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={eligibilityCheck.hasRationCard}
                    onChange={(e) => setEligibilityCheck({ ...eligibilityCheck, hasRationCard: e.target.checked })}
                  />
                  <span>Valid Ration Card / Family ID</span>
                </label>

                <label className="d-flex align-items-center gap-2" style={{ fontSize: '0.84rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={eligibilityCheck.hasAbha}
                    onChange={(e) => setEligibilityCheck({ ...eligibilityCheck, hasAbha: e.target.checked })}
                  />
                  <span>Linked ABHA ID (14-8921-4309-8812)</span>
                </label>
              </div>

              <button
                type="button"
                className="patient-btn patient-btn-primary d-inline-flex align-items-center justify-content-center gap-2"
                onClick={handleCheckEligibility}
              >
                <ShieldCheck size={16} />
                <span>Verify Citizen Eligibility Now</span>
              </button>

              {eligibilityCheck.result && (
                <div
                  className="p-3 rounded border border-success mt-2"
                  style={{ backgroundColor: 'rgba(34, 197, 94, 0.08)' }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge bg-success d-flex align-items-center gap-1">
                      <BadgeCheck size={13} /> ELIGIBLE BENEFICIARY
                    </span>
                    <span className="text-muted font-monospace" style={{ fontSize: '0.75rem' }}>
                      Token: {eligibilityCheck.result.verificationCode}
                    </span>
                  </div>
                  <h6 className="font-heading mb-1 text-success fw-bold">
                    Entitled to {portal.shortName || portal.name} Cashless Benefits
                  </h6>
                  <p className="text-muted mb-2" style={{ fontSize: '0.82rem' }}>
                    Based on your active ABHA ID and demographic profile, you are entitled to {eligibilityCheck.result.entitlement}. You may present your ABHA QR card at any empanelled hospital for instantaneous cashless admission.
                  </p>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="patient-btn patient-btn-outline patient-btn-sm"
                      onClick={() => alert(`Entitlement Certificate #${eligibilityCheck.result.verificationCode} verified for Rahul Sharma.`)}
                    >
                      <Download size={13} /> Download Entitlement Slip
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: APPLICATION GUIDE */}
          {activeTab === 'application' && (
            <div className="d-flex flex-column gap-3">
              <h6 className="font-heading fw-bold mb-2">Step-by-Step Beneficiary Process</h6>
              
              <div className="d-flex flex-column gap-2">
                <div className="p-3 rounded border" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
                  <div className="fw-bold d-flex align-items-center gap-2 mb-1" style={{ color: 'var(--p-primary-dark)', fontSize: '0.88rem' }}>
                    <span className="badge bg-teal rounded-circle p-1 px-2">1</span> Check Eligibility & Identity
                  </div>
                  <p className="text-muted mb-0 ps-4" style={{ fontSize: '0.82rem' }}>
                    Verify your family ID or Aadhaar details online through {cleanUrl} or via your local Ayushman Mitra kiosk.
                  </p>
                </div>

                <div className="p-3 rounded border" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
                  <div className="fw-bold d-flex align-items-center gap-2 mb-1" style={{ color: 'var(--p-primary-dark)', fontSize: '0.88rem' }}>
                    <span className="badge bg-teal rounded-circle p-1 px-2">2</span> Generate Ayushman Card / Health ID
                  </div>
                  <p className="text-muted mb-0 ps-4" style={{ fontSize: '0.82rem' }}>
                    Complete eKYC via OTP or biometric scan at any Common Service Center (CSC) or empanelled hospital counter to receive your Golden Card.
                  </p>
                </div>

                <div className="p-3 rounded border" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
                  <div className="fw-bold d-flex align-items-center gap-2 mb-1" style={{ color: 'var(--p-primary-dark)', fontSize: '0.88rem' }}>
                    <span className="badge bg-teal rounded-circle p-1 px-2">3</span> Cashless Hospital Admission
                  </div>
                  <p className="text-muted mb-0 ps-4" style={{ fontSize: '0.82rem' }}>
                    Present your card at the hospital Ayushman Helpdesk. Pre-authorization is sent automatically; all diagnostics, medicines, and bed charges are settled directly.
                  </p>
                </div>
              </div>

              {portal.requiredDocuments && (
                <div className="mt-2">
                  <h6 className="font-heading fw-bold mb-2 d-flex align-items-center gap-1">
                    <FileText size={16} className="text-teal" /> Required Official Documentation
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {portal.requiredDocuments.map((doc, idx) => (
                      <span key={idx} className="patient-badge patient-badge-teal py-1 px-3" style={{ fontSize: '0.8rem' }}>
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INTERACTIVE SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="d-flex flex-column gap-3">
              <div className="p-3 rounded border" style={{ backgroundColor: '#F8FAFC' }}>
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                      {portal.shortName || portal.name} Online Citizen Services
                    </span>
                    <span className="badge bg-success" style={{ fontSize: '0.68rem' }}>Live Simulation</span>
                  </div>
                  <span className="text-muted font-monospace" style={{ fontSize: '0.74rem' }}>
                    Server: gov-in-cluster-04.delhi
                  </span>
                </div>

                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search empanelled hospitals, packages, or claim status..."
                    value={searchSimText}
                    onChange={(e) => setSearchSimText(e.target.value)}
                  />
                  <button className="btn btn-primary btn-sm" type="button">
                    <Search size={14} /> Search
                  </button>
                </div>

                <div className="row g-2">
                  <div className="col-md-4">
                    <div className="p-3 bg-white rounded border text-center h-100">
                      <div className="fw-bold text-primary mb-1">Hospital Empanelled</div>
                      <div className="fs-5 fw-bold text-dark">29,482+</div>
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>Public & Private Pan-India</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-white rounded border text-center h-100">
                      <div className="fw-bold text-success mb-1">Authorised Claims</div>
                      <div className="fs-5 fw-bold text-dark">₹78,400 Cr+</div>
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>100% Cashless Treatment</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-white rounded border text-center h-100">
                      <div className="fw-bold text-purple mb-1">Golden Cards Issued</div>
                      <div className="fs-5 fw-bold text-dark">34.8 Crore+</div>
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>Verified Citizens</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-white rounded border">
                  <h6 className="fw-bold mb-1" style={{ fontSize: '0.84rem' }}>
                    Nearest Empanelled Hospitals in your Region (Noida / NCR):
                  </h6>
                  <ul className="mb-0 ps-3 text-muted" style={{ fontSize: '0.8rem', lineHeight: '1.6' }}>
                    <li>District Combined Hospital, Sector 39, Noida (Government Civil Hospital) - 100% Free</li>
                    <li>Jaypee Hospital, Sector 128, Noida (Empanelled Private Multispeciality)</li>
                    <li>Fortis Hospital, Sector 62, Noida (Cardiology & Oncology Package Empanelled)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Direct Link Launch Actions */}
        <div
          className="p-3 px-4 border-top d-flex align-items-center justify-content-between flex-wrap gap-2"
          style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)' }}
        >
          <div className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
            <AlertCircle size={14} className="text-primary flex-shrink-0" />
            <span>Official Government Domain: <strong>{portal.officialSource || portal.url}</strong></span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="patient-btn patient-btn-outline"
              onClick={onClose}
              style={{ fontSize: '0.84rem' }}
            >
              Close Inspector
            </button>
            <button
              type="button"
              className="patient-btn patient-btn-primary d-flex align-items-center gap-2"
              onClick={handleLaunchExternal}
              style={{ fontSize: '0.84rem' }}
            >
              <Globe size={15} />
              <span>Launch Official Portal</span>
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
