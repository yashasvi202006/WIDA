import React, { useState, useEffect, useMemo } from 'react';
import { PATIENT_MOCK_SCHEMES } from '../data/patientMockData';
import { patientApiService } from '../services/patientApiService';
import { GovernmentPortalModal } from '../components/GovernmentPortalModal';
import {
  Landmark,
  ExternalLink,
  Search,
  X,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  FileText,
  BadgeCheck,
  Info,
  Building,
  HeartPulse,
  Pill,
  Video,
  Baby,
  Users,
  Globe,
  Brain,
  Sparkles,
  Activity,
  Dna,
  HeartHandshake,
  Building2,
  HelpCircle,
  Eye
} from 'lucide-react';

const FEATURED_PORTALS = [
  {
    name: 'Ayushman Bharat PM-JAY',
    shortName: 'PM-JAY',
    domain: 'pmjay.gov.in',
    url: 'https://pmjay.gov.in',
    officialSource: 'https://pmjay.gov.in',
    description: '₹5 Lakh free health cover per family per year across 29,000+ hospitals.',
    category: 'Hospital Care',
    badge: 'National Assurance',
    ministry: 'National Health Authority & MoHFW',
    coverageAmount: '₹5,00,000 per family/year',
    benefits: [
      '100% cashless hospitalization across empanelled public and private hospitals',
      'Over 1,949 critical packages including oncology, neurology, and cardiology',
      'Covers pre-existing diseases from day one with zero waiting period',
      'Pre & post hospitalization expenses covered'
    ],
    requiredDocuments: ['Aadhaar Card', 'Ration Card / PM-JAY Letter', 'Family ID']
  },
  {
    name: 'Ayushman Bharat Digital Mission (ABDM)',
    shortName: 'ABHA Health ID',
    domain: 'abdm.gov.in',
    url: 'https://abdm.gov.in',
    officialSource: 'https://abdm.gov.in',
    description: 'Universal 14-digit ABHA ID for digital medical records & OPD fast-track.',
    category: 'Digital Health',
    badge: 'Digital Identity',
    ministry: 'National Health Authority',
    coverageAmount: 'Universal Digital Healthcare Account',
    benefits: [
      'Single digital record for prescriptions, diagnostics, and discharge summaries',
      'Scan-and-Share QR code for instantaneous hospital OPD token registration',
      'Consent-governed digital record sharing with trusted healthcare professionals'
    ],
    requiredDocuments: ['Aadhaar Number or Mobile OTP']
  },
  {
    name: 'eSanjeevani Teleconsultation Portal',
    shortName: 'eSanjeevani OPD',
    domain: 'esanjeevani.mohfw.gov.in',
    url: 'https://esanjeevani.mohfw.gov.in',
    officialSource: 'https://esanjeevani.mohfw.gov.in',
    description: '100% free nationwide video consultation with government doctors & specialists.',
    category: 'Teleconsultation',
    badge: 'Free Video OPD',
    ministry: 'Ministry of Health & Family Welfare',
    coverageAmount: 'Free Video Consultations Nationwide',
    benefits: [
      'Direct audio-video consult with qualified MBBS and specialist government physicians',
      'Instant digital prescriptions valid at all registered pharmacies and clinics',
      'Available across urban and remote rural areas without registration fees'
    ],
    requiredDocuments: ['Mobile Number for OTP Verification']
  },
  {
    name: 'PM Bhartiya Janaushadhi Pariyojana',
    shortName: 'Jan Aushadhi',
    domain: 'janaushadhi.gov.in',
    url: 'https://janaushadhi.gov.in',
    officialSource: 'https://janaushadhi.gov.in',
    description: 'Subsidized WHO-GMP certified generic medicines up to 90% cheaper.',
    category: 'Affordable Medicines',
    badge: 'Generic Meds',
    ministry: 'Department of Pharmaceuticals',
    coverageAmount: 'Up to 90% discount on 1,965+ generic drugs',
    benefits: [
      'High-grade WHO-GMP certified affordable pharmaceuticals',
      'Jan Aushadhi Sugam app for nearby store locator and pricing transparency',
      'Essential chronic disease medications for diabetes, cardiac, and respiratory health'
    ],
    requiredDocuments: ['Doctor Prescription with generic chemical names']
  },
  {
    name: 'Tele-MANAS Mental Health Assistance',
    shortName: 'Tele-MANAS',
    domain: 'telemanas.mohfw.gov.in',
    url: 'https://telemanas.mohfw.gov.in',
    officialSource: 'https://telemanas.mohfw.gov.in',
    description: '24x7 toll-free mental wellness & psychiatric counseling in 20+ languages.',
    category: 'Mental Health',
    badge: '24x7 Helpline',
    ministry: 'Ministry of Health & Family Welfare',
    coverageAmount: '100% Free Confidential Counseling',
    benefits: [
      'Round-the-clock psychological first-aid and clinical counseling',
      'Available in 20+ Indian languages and dialects via toll-free number 14416',
      'Seamless referral loop to NIMHANS and regional tertiary psychiatric centers'
    ],
    requiredDocuments: ['None required (Anonymous & Confidential)']
  },
  {
    name: 'U-WIN Universal Immunization Registry',
    shortName: 'U-WIN Registry',
    domain: 'uwin.mohfw.gov.in',
    url: 'https://uwin.mohfw.gov.in',
    officialSource: 'https://uwin.mohfw.gov.in',
    description: 'Complete digital tracking of vaccinations for mothers & children (0-5 yrs).',
    category: 'Maternal & Child Health',
    badge: 'Vaccine Certificates',
    ministry: 'Ministry of Health & Family Welfare',
    coverageAmount: 'Universal Free Immunization',
    benefits: [
      'Digital vaccination tracking for pregnant women and children aged 0-5',
      'Automatic SMS reminders for upcoming vaccine doses',
      'Downloadable QR-coded national vaccine certificates'
    ],
    requiredDocuments: ['Parent Aadhaar / Mobile Number']
  },
  {
    name: 'NOTTO National Organ & Tissue Registry',
    shortName: 'NOTTO Organs',
    domain: 'notto.mohfw.gov.in',
    url: 'https://notto.mohfw.gov.in',
    officialSource: 'https://notto.mohfw.gov.in',
    description: 'Apex national registry for organ allocation and instant donor pledge cards.',
    category: 'Critical Care & Organ Donation',
    badge: 'Donor Registry',
    ministry: 'Directorate General of Health Services (DGHS)',
    coverageAmount: 'National Organ Allocation & Donor Pledge',
    benefits: [
      'Transparent national waiting list for kidney, liver, heart, and corneal transplants',
      'Instant online pledge form and ABHA-linked official Organ Donor Card issuance',
      '24x7 organ coordination and green corridor emergency transport logistics'
    ],
    requiredDocuments: ['Aadhaar ID', 'Emergency Contact / Next of Kin consent']
  },
  {
    name: 'Ni-kshay National TB Elimination Portal',
    shortName: 'Ni-kshay Poshan',
    domain: 'nikshay.in',
    url: 'https://nikshay.in',
    officialSource: 'https://nikshay.in',
    description: '₹500/month DBT nutrition assistance & free treatment for TB patients.',
    category: 'Chronic Disease & Critical Care',
    badge: 'DBT Nutrition',
    ministry: 'Central TB Division, MoHFW',
    coverageAmount: '₹500/month Direct Benefit Transfer + Free Medicines',
    benefits: [
      'Direct monthly cash transfer to patient bank accounts for nutritional support',
      '100% free frontline anti-tubercular medication regimens',
      'Longitudinal treatment monitoring and DOTS provider assignment'
    ],
    requiredDocuments: ['Bank Account Details', 'Aadhaar ID', 'TB Diagnostic Report']
  }
];

export const PatientGovernmentSchemes = () => {
  const [schemes, setSchemes] = useState(PATIENT_MOCK_SCHEMES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [activePortalModal, setActivePortalModal] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    patientApiService.getGovernmentSchemes()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          if (data.length >= PATIENT_MOCK_SCHEMES.length) {
            setSchemes(data);
          } else {
            setSchemes(PATIENT_MOCK_SCHEMES);
          }
        }
      })
      .catch(() => {
        // Fallback to PATIENT_MOCK_SCHEMES
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    schemes.forEach(s => {
      if (s.category) set.add(s.category);
    });
    return ['All', ...Array.from(set)];
  }, [schemes]);

  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      const inName = (scheme.name || '').toLowerCase().includes(q);
      const inShort = (scheme.shortName || '').toLowerCase().includes(q);
      const inTagline = (scheme.tagline || '').toLowerCase().includes(q);
      const inMinistry = (scheme.ministry || '').toLowerCase().includes(q);
      const inCategory = (scheme.category || '').toLowerCase().includes(q);
      const inBenefits = (scheme.benefits || []).some(b => b.toLowerCase().includes(q));
      const inEligibility = (scheme.eligibility || []).some(e => e.toLowerCase().includes(q));
      const inUrl = (scheme.officialSource || '').toLowerCase().includes(q);

      return inName || inShort || inTagline || inMinistry || inCategory || inBenefits || inEligibility || inUrl;
    });
  }, [schemes, selectedCategory, searchTerm]);

  // Robust portal launcher that never reloads the app or crashes
  const handleOpenPortalSafely = (portalOrUrl, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    let url = '';
    let portalObject = null;

    if (typeof portalOrUrl === 'string') {
      url = portalOrUrl;
      portalObject = schemes.find(s => s.officialSource === url) || FEATURED_PORTALS.find(p => p.url === url || p.officialSource === url);
      if (!portalObject) {
        portalObject = {
          name: 'Official Government Health Portal',
          shortName: 'Government Portal',
          officialSource: url,
          url: url,
          tagline: 'Official public healthcare service portal of the Government of India.'
        };
      }
    } else {
      portalObject = portalOrUrl;
      url = portalOrUrl.officialSource || portalOrUrl.url;
    }

    // Open modal directly for an extraordinary in-app inspector experience
    setActivePortalModal(portalObject);
  };

  // Direct new window launch helper with popup-blocker safety
  const handleDirectLaunchWindow = (url, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      const newWin = window.open(url, '_blank', 'noopener,noreferrer');
      if (!newWin) {
        // Fallback: if browser blocks popup, open inspector modal
        const matching = schemes.find(s => s.officialSource === url) || FEATURED_PORTALS.find(p => p.url === url);
        if (matching) {
          setActivePortalModal(matching);
        }
      }
    } catch {
      const matching = schemes.find(s => s.officialSource === url) || FEATURED_PORTALS.find(p => p.url === url);
      if (matching) {
        setActivePortalModal(matching);
      }
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Hospital Care':
        return <HeartPulse size={16} className="text-danger" />;
      case 'Affordable Medicines':
        return <Pill size={16} className="text-warning" />;
      case 'Teleconsultation':
        return <Video size={16} className="text-primary" />;
      case 'Maternal & Child Health':
        return <Baby size={16} className="text-info" />;
      case 'Mental Health':
        return <Brain size={16} style={{ color: '#8b5cf6' }} />;
      case 'Specialized & Rare Diseases':
        return <Sparkles size={16} style={{ color: '#ec4899' }} />;
      case 'Chronic Disease & Critical Care':
      case 'Chronic Disease & Nutrition':
        return <Activity size={16} className="text-success" />;
      case 'Chronic Disease & Genetics':
        return <Dna size={16} style={{ color: '#0284c7' }} />;
      case 'Critical Care & Organ Donation':
        return <HeartHandshake size={16} style={{ color: '#f59e0b' }} />;
      case 'Healthcare Infrastructure':
        return <Building2 size={16} style={{ color: '#6366f1' }} />;
      case 'Employee & Pensioner Care':
        return <Users size={16} className="text-secondary" />;
      case 'Digital Health':
        return <ShieldCheck size={16} style={{ color: 'var(--p-primary)' }} />;
      default:
        return <Landmark size={16} style={{ color: 'var(--p-primary)' }} />;
    }
  };

  return (
    <div className="patient-government-schemes d-flex flex-column gap-4">
      {/* Page Title & Intro */}
      <div>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <h3 className="font-heading mb-1 d-flex align-items-center gap-2">
              <Landmark size={24} style={{ color: 'var(--p-primary)' }} />
              Government Healthcare Schemes & National Portals
            </h3>
            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
              Official Central & State public health initiatives, medical assistance programs, and verified national portals. Click any portal to launch our verified portal inspector or open official government websites directly.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="patient-badge patient-badge-teal d-flex align-items-center gap-1 py-2 px-3" style={{ fontSize: '0.82rem' }}>
              <ShieldCheck size={14} />
              {schemes.length} Verified National Schemes
            </span>
          </div>
        </div>
      </div>

      {/* Featured National Portals Quick Launch Grid */}
      <div className="patient-card p-3">
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <Globe size={18} style={{ color: 'var(--p-primary)' }} />
            <h6 className="font-heading mb-0 fw-bold">Direct Official Health Portals (1-Click Launch)</h6>
          </div>
          <span className="text-muted" style={{ fontSize: '0.78rem' }}>
            Verified <code style={{ color: 'var(--p-primary)' }}>.gov.in</code> / <code style={{ color: 'var(--p-primary)' }}>.nic.in</code> national portals
          </span>
        </div>

        <div className="row g-2">
          {FEATURED_PORTALS.map((portal, idx) => (
            <div key={idx} className="col-12 col-sm-6 col-lg-3">
              <div className="patient-portal-quick-card">
                <div>
                  <div className="d-flex align-items-center justify-content-between gap-1 mb-2">
                    <span className="badge bg-light text-secondary border" style={{ fontSize: '0.7rem' }}>
                      {portal.badge}
                    </span>
                    <span className="text-muted font-monospace" style={{ fontSize: '0.72rem' }}>
                      {portal.domain}
                    </span>
                  </div>

                  <h6 className="font-heading mb-1 fw-bold" style={{ fontSize: '0.88rem' }}>
                    {portal.shortName}
                  </h6>
                  <p className="text-muted mb-3" style={{ fontSize: '0.76rem', lineHeight: '1.4' }}>
                    {portal.description}
                  </p>
                </div>

                <div className="d-flex align-items-center gap-1 w-100">
                  <button
                    type="button"
                    onClick={(e) => handleOpenPortalSafely(portal, e)}
                    className="patient-btn patient-btn-outline patient-btn-sm d-flex align-items-center justify-content-center gap-1 text-decoration-none flex-grow-1"
                    style={{ fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                    title={`Open ${portal.name} interactive inspector`}
                  >
                    <Eye size={13} />
                    <span>Launch Portal</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDirectLaunchWindow(portal.url, e)}
                    className="patient-btn patient-btn-outline patient-btn-sm p-1 px-2"
                    title={`Direct open ${portal.url} in new tab`}
                  >
                    <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* National Health Helplines Quick Access Banner */}
      <div className="p-3 rounded border" style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded-circle bg-danger-subtle text-danger">
              <PhoneCall size={18} />
            </div>
            <div>
              <div className="fw-semibold" style={{ fontSize: '0.86rem', color: 'var(--p-text-main)' }}>
                National Health & Scheme Toll-Free Helplines (24x7)
              </div>
              <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                Instant guidance on hospital eligibility, claims, mental wellness, and ambulance dispatch
              </div>
            </div>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2">
            <a
              href="tel:14555"
              className="patient-badge patient-badge-success text-decoration-none d-flex align-items-center gap-1 px-3 py-2"
              title="PM-JAY National Call Center (14555)"
            >
              <PhoneCall size={12} />
              <span>PM-JAY: <strong>14555</strong></span>
            </a>
            <a
              href="tel:1075"
              className="patient-badge patient-badge-teal text-decoration-none d-flex align-items-center gap-1 px-3 py-2"
              title="National Health Helpline (1075)"
            >
              <PhoneCall size={12} />
              <span>National: <strong>1075</strong></span>
            </a>
            <a
              href="tel:14416"
              className="patient-badge patient-badge-purple text-decoration-none d-flex align-items-center gap-1 px-3 py-2"
              title="Tele-MANAS 24x7 Mental Health Helpline (14416)"
            >
              <PhoneCall size={12} />
              <span>Tele-MANAS: <strong>14416</strong></span>
            </a>
            <a
              href="tel:104"
              className="patient-badge patient-badge-purple text-decoration-none d-flex align-items-center gap-1 px-3 py-2"
              title="eSanjeevani Teleconsultation / State Health (104)"
            >
              <PhoneCall size={12} />
              <span>Teleconsult: <strong>104</strong></span>
            </a>
            <a
              href="tel:1800114770"
              className="patient-badge patient-badge-teal text-decoration-none d-flex align-items-center gap-1 px-3 py-2"
              title="NOTTO Organ Donation Helpline (1800-11-4770)"
            >
              <PhoneCall size={12} />
              <span>NOTTO Organ: <strong>1800-11-4770</strong></span>
            </a>
            <a
              href="tel:18001808080"
              className="patient-badge patient-badge-warning text-decoration-none d-flex align-items-center gap-1 px-3 py-2"
              title="Jan Aushadhi Generic Medicine Helpline (1800-180-8080)"
            >
              <PhoneCall size={12} />
              <span>Jan Aushadhi: <strong>1800-180-8080</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="patient-card p-3">
        <div className="row g-3 align-items-center">
          <div className="col-lg-5 col-md-12">
            <div className="position-relative">
              <Search
                size={16}
                className="position-absolute text-muted"
                style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="patient-input w-100 ps-5 pe-5"
                placeholder="Search schemes by name, benefits, keywords (e.g., PM-JAY, Tele-MANAS, Dialysis, U-WIN, NOTTO)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: '0.88rem' }}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="btn btn-link position-absolute p-0 text-muted"
                  style={{ right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none' }}
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="col-lg-7 col-md-12">
            <div className="d-flex align-items-center gap-1 overflow-x-auto pb-1" style={{ whiteSpace: 'nowrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`patient-btn patient-btn-sm d-inline-flex align-items-center gap-1 ${selectedCategory === cat ? 'patient-btn-primary' : 'patient-btn-outline'}`}
                  style={{ fontSize: '0.78rem', borderRadius: 'var(--p-radius-full)', padding: '5px 12px' }}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat !== 'All' && getCategoryIcon(cat)}
                  <span>
                    {cat === 'All'
                      ? `All Schemes (${schemes.length})`
                      : `${cat} (${schemes.filter(s => s.category === cat).length})`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="d-flex align-items-center justify-content-between px-1" style={{ fontSize: '0.84rem' }}>
        <span className="text-muted d-flex align-items-center gap-2">
          <span>
            Showing <strong>{filteredSchemes.length}</strong> of {schemes.length} national schemes
            {selectedCategory !== 'All' && <span> in <em>{selectedCategory}</em></span>}
            {searchTerm && <span> matching "<em>{searchTerm}</em>"</span>}
          </span>
          {isLoading && (
            <span className="spinner-border spinner-border-sm text-secondary" role="status" style={{ width: '12px', height: '12px' }}>
              <span className="visually-hidden">Loading...</span>
            </span>
          )}
        </span>
        {(searchTerm || selectedCategory !== 'All') && (
          <button
            type="button"
            className="btn btn-link p-0 text-decoration-none"
            style={{ fontSize: '0.82rem', color: 'var(--p-primary)' }}
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Schemes List */}
      {filteredSchemes.length === 0 ? (
        <div className="patient-card p-5 text-center">
          <Info size={36} className="text-muted mb-2" />
          <h5 className="font-heading mb-1">No matching government schemes found</h5>
          <p className="text-muted mb-3" style={{ fontSize: '0.88rem' }}>
            Try broadening your search term or selecting "All Schemes".
          </p>
          <button
            type="button"
            className="patient-btn patient-btn-primary"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
          >
            View All Schemes
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="patient-card patient-scheme-item p-4"
              style={{
                borderLeft: scheme.status === 'Enrolled' ? '4px solid var(--p-success)' : '4px solid var(--p-primary)',
              }}
            >
              {/* Header: Title, Ministry, Status, Category */}
              <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3 border-bottom pb-3" style={{ borderColor: 'var(--p-border-subtle)' }}>
                <div className="flex-grow-1" style={{ maxWidth: '820px' }}>
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                    <span className="p-1 px-2 rounded d-inline-flex align-items-center gap-1 border" style={{ backgroundColor: 'var(--p-surface-alt)', fontSize: '0.74rem' }}>
                      {getCategoryIcon(scheme.category)}
                      <strong>{scheme.category || 'National Health'}</strong>
                    </span>

                    {scheme.ministry && (
                      <span className="text-muted d-inline-flex align-items-center gap-1" style={{ fontSize: '0.74rem' }}>
                        <Building size={12} />
                        {scheme.ministry}
                      </span>
                    )}
                  </div>

                  {/* Scheme Title with Interactive Modal Opener */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleOpenPortalSafely(scheme, e)}
                      className="btn btn-link p-0 text-start text-decoration-none patient-scheme-link"
                      title={`Inspect ${scheme.name} scheme details & portal`}
                      style={{ color: 'inherit', cursor: 'pointer' }}
                    >
                      <h5 className="font-heading mb-0 d-inline-flex align-items-center gap-2">
                        <span>{scheme.name}</span>
                        <Eye size={16} style={{ color: 'var(--p-primary)', flexShrink: 0 }} />
                      </h5>
                    </button>
                  </div>

                  {/* Popular Name & Direct Official URL Pill */}
                  <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
                    {scheme.shortName && scheme.shortName !== scheme.name && (
                      <span className="badge bg-light text-dark border fw-medium" style={{ fontSize: '0.78rem' }}>
                        Popular name: <strong className="text-dark">{scheme.shortName}</strong>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => handleOpenPortalSafely(scheme, e)}
                      className="patient-portal-url-pill d-inline-flex align-items-center gap-1 px-2 py-1 rounded border text-decoration-none"
                      style={{
                        backgroundColor: 'rgba(13, 148, 136, 0.08)',
                        color: 'var(--p-primary-dark)',
                        borderColor: 'rgba(13, 148, 136, 0.25)',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      title={`Inspect official government portal: ${scheme.officialSource}`}
                    >
                      <Globe size={12} />
                      <span className="font-monospace">{(scheme.officialSource || '').replace('https://', '').replace('http://', '').replace(/\/$/, '')}</span>
                      <ShieldCheck size={12} className="text-success" />
                    </button>

                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                      Official Gov Portal
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column align-items-end gap-2">
                  <span className={`patient-badge ${scheme.status === 'Enrolled' ? 'patient-badge-success' : 'patient-badge-teal'} px-3 py-1`}>
                    <BadgeCheck size={13} className="me-1" />
                    {scheme.status}
                  </span>
                  <div className="text-muted text-end" style={{ fontSize: '0.76rem' }}>
                    Coverage:{' '}
                    <strong className="text-success" style={{ fontSize: '0.84rem' }}>
                      {scheme.coverageAmount}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <p className="mb-3" style={{ fontSize: '0.9rem', color: 'var(--p-text-main)', lineHeight: '1.55' }}>
                {scheme.tagline}
              </p>

              {/* Two-Column Grid: Entitlements & Eligibility */}
              <div className="row g-3 mb-3" style={{ fontSize: '0.82rem' }}>
                <div className="col-md-6">
                  <div className="p-3 rounded border h-100" style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)' }}>
                    <div className="d-flex align-items-center gap-1 mb-2 font-heading fw-semibold" style={{ color: 'var(--p-primary-dark)' }}>
                      <CheckCircle2 size={15} style={{ color: 'var(--p-primary)' }} />
                      Key Entitlements & Benefits
                    </div>
                    <ul className="mb-0 ps-3 text-muted" style={{ lineHeight: '1.55' }}>
                      {scheme.benefits.map((benefit, idx) => (
                        <li key={idx} className="mb-1">{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 rounded border h-100" style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)' }}>
                    <div className="d-flex align-items-center gap-1 mb-2 font-heading fw-semibold" style={{ color: 'var(--p-primary-dark)' }}>
                      <FileText size={15} style={{ color: 'var(--p-primary)' }} />
                      Eligibility Criteria
                    </div>
                    <ul className="mb-0 ps-3 text-muted" style={{ lineHeight: '1.55' }}>
                      {scheme.eligibility.map((el, idx) => (
                        <li key={idx} className="mb-1">{el}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Application Guidance */}
              {scheme.applicationProcedure && (
                <div className="p-2 px-3 rounded mb-3 border" style={{ backgroundColor: 'rgba(13, 148, 136, 0.05)', borderColor: 'rgba(13, 148, 136, 0.2)', fontSize: '0.8rem' }}>
                  <span className="fw-semibold text-teal" style={{ color: 'var(--p-primary-dark)' }}>
                    How to Apply / Access:
                  </span>{' '}
                  <span className="text-muted">{scheme.applicationProcedure}</span>
                </div>
              )}

              {/* Card Footer: Required Documents & Direct Official Portal Link Button */}
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 border-top" style={{ borderColor: 'var(--p-border-subtle)', fontSize: '0.8rem' }}>
                <div className="d-flex align-items-center flex-wrap gap-2 text-muted">
                  <span className="fw-semibold">Required Documents:</span>
                  {scheme.requiredDocuments.map((doc, i) => (
                    <span key={i} className="patient-badge patient-badge-teal py-1 px-2" style={{ fontSize: '0.74rem' }}>
                      {doc}
                    </span>
                  ))}
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleOpenPortalSafely(scheme, e)}
                    className="patient-btn patient-btn-outline d-inline-flex align-items-center gap-2 px-3 py-2 shadow-sm"
                    style={{ fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}
                    title={`Open verified in-app portal inspector for ${scheme.shortName || scheme.name}`}
                  >
                    <Eye size={14} />
                    <span>Inspect Portal</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDirectLaunchWindow(scheme.officialSource, e)}
                    className="patient-btn patient-btn-primary d-inline-flex align-items-center gap-2 px-3 py-2 shadow-sm"
                    style={{ fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}
                    title={`Open official ${scheme.shortName || scheme.name} website in new browser tab`}
                  >
                    <Globe size={14} />
                    <span>Visit Official Website</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Official Health Information Disclaimer */}
      <div className="p-3 rounded border" style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)', fontSize: '0.82rem', color: 'var(--p-text-muted)' }}>
        <div className="d-flex align-items-start gap-2">
          <Info size={16} className="mt-1 flex-shrink-0" style={{ color: 'var(--p-primary)' }} />
          <div>
            <strong>Official Public Information Disclaimer:</strong> WIDA compiles verified public health policy entitlements from National Health Authority (NHA), Ministry of Health & Family Welfare (MoHFW), Ministry of Tribal Affairs, and Ministry of Labour & Employment. Clicking any <em>"Visit Official Website"</em> link takes you directly to the verified Government of India portal (<code style={{ color: 'var(--p-primary)' }}>.gov.in</code> / <code style={{ color: 'var(--p-primary)' }}>.nic.in</code>). WIDA operates independently for academic demonstration and healthcare interoperability.
          </div>
        </div>
      </div>

      {/* Interactive Portal Inspector Modal */}
      {activePortalModal && (
        <GovernmentPortalModal
          portal={activePortalModal}
          onClose={() => setActivePortalModal(null)}
        />
      )}
    </div>
  );
};
