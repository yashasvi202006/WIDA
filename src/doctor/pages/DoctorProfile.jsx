import React, { useState, useRef } from 'react';
import medicalCertDefault from '../../assets/dashboard/medical_certificate.jpg';
import fellowshipAwardDefault from '../../assets/dashboard/fellowship_award.jpg';

export const DoctorProfile = ({
  doctor,
  achievements = [],
  onOpenEditProfile,
  onOpenVerificationModal,
}) => {
  // Initial demo certificates and achievements for the practitioner
  const defaultCertificates = [
    {
      id: 'cert-1',
      title: 'Certificate of Medical Registration',
      issuingBody: 'National Medical Commission & GMC',
      issueDate: 'October 14, 2023',
      credentialNumber: doctor.medicalRegistrationNumber || 'UK-2023-MC-8874',
      status: 'VERIFIED',
      imageUrl: medicalCertDefault,
      category: 'Medical License',
    },
    {
      id: 'cert-2',
      title: 'Fellowship in Clinical Excellence (FACP)',
      issuingBody: 'American Fellowship of Clinical Excellence',
      issueDate: 'October 24, 2023',
      credentialNumber: 'AFCE-FELLOW-9921',
      status: 'VERIFIED',
      imageUrl: fellowshipAwardDefault,
      category: 'Fellowship & Honors',
    },
    {
      id: 'cert-3',
      title: 'Distinguished Clinical Specialist & Healthcare Award',
      issuingBody: 'International Council of Clinical Neurologists',
      issueDate: 'January 12, 2024',
      credentialNumber: 'ICCN-AWARD-2024',
      status: 'VERIFIED',
      imageUrl: fellowshipAwardDefault,
      category: 'Clinical Excellence Award',
    },
  ];

  const storageKey = `wida_doc_certificates_${doctor.id}`;
  const [certificates, setCertificates] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultCertificates;
    } catch {
      return defaultCertificates;
    }
  });

  // State for modals & image previews
  const [selectedFullPhoto, setSelectedFullPhoto] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [docFilterCategory, setDocFilterCategory] = useState('ALL');

  // Form state for certificate upload/edit
  const [certTitle, setCertTitle] = useState('');
  const [certIssuingBody, setCertIssuingBody] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certNumber, setCertNumber] = useState('');
  const [certCategory, setCertCategory] = useState('Medical License');
  const [certImagePreview, setCertImagePreview] = useState(medicalCertDefault);
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // Profile Avatar State
  const [profileAvatar, setProfileAvatar] = useState(
    doctor.profilePhotoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80'
  );

  const saveCertificates = (newList) => {
    setCertificates(newList);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to save certificates', e);
    }
  };

  const handleOpenUploadModal = (certToEdit = null, defaultCat = 'Medical License') => {
    if (certToEdit) {
      setEditingCert(certToEdit);
      setCertTitle(certToEdit.title);
      setCertIssuingBody(certToEdit.issuingBody);
      setCertDate(certToEdit.issueDate);
      setCertNumber(certToEdit.credentialNumber);
      setCertCategory(certToEdit.category || defaultCat);
      setCertImagePreview(certToEdit.imageUrl);
    } else {
      setEditingCert(null);
      setCertTitle('');
      setCertIssuingBody('');
      setCertDate(new Date().toISOString().split('T')[0]);
      setCertNumber(`WIDA-${Math.floor(100000 + Math.random() * 900000)}`);
      setCertCategory(defaultCat);
      setCertImagePreview(
        defaultCat.includes('Award') || defaultCat.includes('Honors')
          ? fellowshipAwardDefault
          : medicalCertDefault
      );
    }
    setIsUploadModalOpen(true);
  };

  const handleCertificateFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCertImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCertificate = (e) => {
    e.preventDefault();
    if (!certTitle.trim()) {
      alert('Please enter a certificate title');
      return;
    }

    if (editingCert) {
      const updated = certificates.map((c) =>
        c.id === editingCert.id
          ? {
              ...c,
              title: certTitle.trim(),
              issuingBody: certIssuingBody.trim(),
              issueDate: certDate,
              credentialNumber: certNumber.trim(),
              category: certCategory,
              imageUrl: certImagePreview,
            }
          : c
      );
      saveCertificates(updated);
    } else {
      const newCert = {
        id: `cert-${Date.now()}`,
        title: certTitle.trim(),
        issuingBody: certIssuingBody.trim() || 'Medical Accreditation Authority',
        issueDate: certDate,
        credentialNumber: certNumber.trim() || `CERT-${Date.now()}`,
        status: 'VERIFIED',
        imageUrl: certImagePreview,
        category: certCategory,
      };
      saveCertificates([newCert, ...certificates]);
    }

    setIsUploadModalOpen(false);
  };

  const handleDeleteCertificate = (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      const filtered = certificates.filter((c) => c.id !== id);
      saveCertificates(filtered);
    }
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileAvatar(event.target.result);
        setIsAvatarModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Default badges list if achievements are empty
  const defaultBadges = [
    {
      id: 1,
      title: 'State Medical Council Registered',
      description: `Verified Practitioner License: ${doctor.medicalRegistrationNumber}`,
      icon: '🛡️',
    },
    {
      id: 2,
      title: 'Top Rated Clinical Specialist',
      description: `Maintains ${doctor.averageRating} star rating across ${doctor.totalRatings} patient evaluations`,
      icon: '⭐',
    },
    {
      id: 3,
      title: 'Senior Clinical Consultant',
      description: `${doctor.yearsOfExperience}+ Years of Dedicated Healthcare Service in ${doctor.specializationName}`,
      icon: '🩺',
    },
    {
      id: 4,
      title: 'Distinguished Healthcare Provider',
      description: `Successfully attended to ${doctor.totalPatients}+ patients across hospital & tele-consultations`,
      icon: '🏆',
    },
  ];

  const activeBadges = achievements.length > 0 ? achievements : defaultBadges;

  return (
    <div className="doc-profile-view wida-profile-full">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="doc-page-header">
        <div className="doc-page-title">
          <h1>Doctor Practitioner Profile</h1>
          <p>Verified clinical provider credentials, certificates, and practice information</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="doc-btn doc-btn-outline"
            onClick={() => handleOpenUploadModal()}
          >
            📜 Upload Certificate
          </button>
          <button
            type="button"
            className="doc-btn doc-btn-primary"
            onClick={onOpenEditProfile}
          >
            ✏️ Edit Profile
          </button>
        </div>
      </div>

      {/* ── Top Doctor Banner Card ──────────────────────────── */}
      <div className="doc-card wida-profile-banner">
        <div className="wida-avatar-column">
          <div className="wida-avatar-image-container">
            <img
              src={profileAvatar}
              alt={doctor.fullName}
              className="wida-profile-avatar-img"
            />
            <button
              type="button"
              className="wida-avatar-edit-badge"
              onClick={() => setIsAvatarModalOpen(true)}
              title="Change Profile Photo"
            >
              📷 Edit Photo
            </button>
          </div>
        </div>

        <div className="wida-profile-info-main">
          <div className="wida-profile-name-row">
            <h2 className="wida-profile-name">{doctor.fullName}</h2>
            <span
              className={`doc-badge ${
                doctor.verificationStatus === 'VERIFIED'
                  ? 'doc-badge-verified'
                  : doctor.verificationStatus === 'UNDER_REVIEW'
                  ? 'doc-badge-review'
                  : 'doc-badge-pending'
              }`}
            >
              {doctor.verificationStatus === 'VERIFIED'
                ? 'Verified Practitioner ✓'
                : 'Verification In Review'}
            </span>
          </div>

          <div className="wida-profile-specialty">
            {doctor.specializationName}{' '}
            {doctor.subSpecialization ? `(${doctor.subSpecialization})` : ''}
          </div>

          <p className="wida-profile-subtext">
            {doctor.qualification} &bull; {doctor.yearsOfExperience} Years Experience &bull; License:{' '}
            <strong>{doctor.medicalRegistrationNumber}</strong>
          </p>

          <p className="wida-profile-bio">
            {doctor.professionalBio ||
              'Distinguished medical specialist committed to evidence-based healthcare delivery and clinical excellence on the WIDA healthcare network.'}
          </p>
        </div>

        {/* Quick Stats Column */}
        <div className="wida-profile-stats-card">
          <div className="wida-stat-block">
            <div className="wida-stat-label">Consultation Fee</div>
            <div className="wida-stat-val primary-val">₹{doctor.consultationFee}</div>
          </div>
          <div className="wida-stat-block">
            <div className="wida-stat-label">Patient Rating</div>
            <div className="wida-stat-val">
              ⭐ {doctor.averageRating}{' '}
              <small className="wida-stat-count">({doctor.totalRatings})</small>
            </div>
          </div>
          <div className="wida-stat-block">
            <div className="wida-stat-label">Patients Cared For</div>
            <div className="wida-stat-val">👥 {doctor.totalPatients}</div>
          </div>
        </div>
      </div>

      {/* ── TWO-COLUMN DETAILS LAYOUT ───────────────────────── */}
      <div className="wida-profile-grid-layout">
        {/* Left Column: Facility, Contact & Verified Badges */}
        <div className="wida-profile-left-col">
          {/* Facility & Contact Information Card */}
          <div className="doc-card">
            <div className="doc-card-header">
              <h3 className="doc-card-title">🏥 Facility & Contact Information</h3>
            </div>
            <table className="doc-table wida-info-table">
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600, width: '40%' }}>Hospital / Clinic</td>
                  <td>{doctor.hospitalClinicName}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Address</td>
                  <td>{doctor.address || 'Medical Facility Complex'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>City & State</td>
                  <td>
                    {doctor.city || 'Bengaluru'}, {doctor.state || 'Karnataka'} -{' '}
                    {doctor.pincode || '560034'}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Professional Email</td>
                  <td>{doctor.email}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Phone Number</td>
                  <td>{doctor.phoneNumber}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Languages Known</td>
                  <td>{doctor.languagesKnown || 'English, Hindi, Kannada'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verified Achievements & Badges Card */}
          <div className="doc-card">
            <div className="doc-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="doc-card-title">🏆 Verified Achievements & Badges</h3>
              <button
                type="button"
                className="doc-btn doc-btn-sm doc-btn-outline"
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={() => handleOpenUploadModal(null, 'Clinical Excellence Award')}
              >
                ➕ Add Award
              </button>
            </div>
            <div className="wida-badges-list">
              {activeBadges.map((badge, idx) => (
                <div key={badge.id || idx} className="wida-badge-card">
                  <div className="wida-badge-icon">{badge.icon || '🎖️'}</div>
                  <div className="wida-badge-details">
                    <div className="wida-badge-title">{badge.title}</div>
                    <div className="wida-badge-desc">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Certificates & Document Photos Gallery (Photo Edit Column) */}
        <div className="wida-profile-right-col">
          <div className="doc-card wida-certificates-card">
            <div className="doc-card-header" style={{ alignItems: 'flex-start' }}>
              <div>
                <h3 className="doc-card-title">📜 Certificates & Achievements Photo Column</h3>
                <p className="doc-card-subtitle" style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  Upload, edit, and view full photos of licenses, credentials, and honors
                </p>
              </div>
              <button
                type="button"
                className="doc-btn doc-btn-sm doc-btn-primary"
                onClick={() => handleOpenUploadModal(null, 'Medical License')}
              >
                ➕ Upload Photo & Document
              </button>
            </div>

            {/* Document Filter Category Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`wida-organ-tab ${docFilterCategory === 'ALL' ? 'active-tab' : ''}`}
                style={{ padding: '5px 14px', fontSize: '12px' }}
                onClick={() => setDocFilterCategory('ALL')}
              >
                All Documents ({certificates.length})
              </button>
              <button
                type="button"
                className={`wida-organ-tab ${docFilterCategory === 'CERTIFICATES' ? 'active-tab' : ''}`}
                style={{ padding: '5px 14px', fontSize: '12px' }}
                onClick={() => setDocFilterCategory('CERTIFICATES')}
              >
                📜 Licenses & Degrees
              </button>
              <button
                type="button"
                className={`wida-organ-tab ${docFilterCategory === 'ACHIEVEMENTS' ? 'active-tab' : ''}`}
                style={{ padding: '5px 14px', fontSize: '12px' }}
                onClick={() => setDocFilterCategory('ACHIEVEMENTS')}
              >
                🏆 Awards & Fellowships
              </button>
            </div>

            {/* Certificates & Achievements Gallery List */}
            <div className="wida-cert-gallery">
              {certificates
                .filter((cert) => {
                  if (docFilterCategory === 'CERTIFICATES') {
                    return !cert.category?.toLowerCase().includes('award') && !cert.category?.toLowerCase().includes('honor');
                  }
                  if (docFilterCategory === 'ACHIEVEMENTS') {
                    return cert.category?.toLowerCase().includes('award') || cert.category?.toLowerCase().includes('honor') || cert.category?.toLowerCase().includes('fellowship');
                  }
                  return true;
                })
                .map((cert) => (
                  <div key={cert.id} className="wida-cert-item-card">
                    {/* Full Certificate Photo Thumbnail */}
                    <div
                      className="wida-cert-photo-wrapper"
                      onClick={() => setSelectedFullPhoto(cert)}
                      title="Click to view full photo in high resolution"
                    >
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="wida-cert-photo-img"
                      />
                      <div className="wida-cert-zoom-overlay">
                        <span>🔍 View Full Photo</span>
                      </div>
                    </div>

                    {/* Certificate Information */}
                    <div className="wida-cert-meta">
                      <div className="wida-cert-badge-row">
                        <span className="wida-cert-tag">{cert.category || 'Credential'}</span>
                        <span className="wida-cert-verified-pill">✓ Verified Document</span>
                      </div>

                      <h4 className="wida-cert-heading">{cert.title}</h4>
                      <div className="wida-cert-issuer">
                        <strong>Issued by:</strong> {cert.issuingBody}
                      </div>

                      <div className="wida-cert-details-row">
                        <div>
                          <span className="cert-meta-label">Reg ID:</span> {cert.credentialNumber}
                        </div>
                        <div>
                          <span className="cert-meta-label">Date:</span> {cert.issueDate}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="wida-cert-actions">
                        <button
                          type="button"
                          className="wida-cert-btn-view"
                          onClick={() => setSelectedFullPhoto(cert)}
                        >
                          👁️ Full Photo
                        </button>
                        <button
                          type="button"
                          className="wida-cert-btn-edit"
                          onClick={() => handleOpenUploadModal(cert)}
                        >
                          ✏️ Edit Photo & Details
                        </button>
                        <button
                          type="button"
                          className="wida-cert-btn-del"
                          onClick={() => handleDeleteCertificate(cert.id)}
                          title="Remove Certificate"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FULL PHOTO MODAL / LIGHTBOX ─────────────────────── */}
      {selectedFullPhoto && (
        <div
          className="wida-img-modal-overlay"
          onClick={() => setSelectedFullPhoto(null)}
        >
          <div
            className="wida-img-modal-content wida-cert-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="wida-img-modal-close"
              onClick={() => setSelectedFullPhoto(null)}
            >
              ✕
            </button>
            <img
              src={selectedFullPhoto.imageUrl}
              alt={selectedFullPhoto.title}
              className="wida-modal-scan-img"
              style={{ maxHeight: '75vh', width: '100%', objectFit: 'contain' }}
            />
            <div className="wida-img-modal-caption">
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                {selectedFullPhoto.title}
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                Issued by {selectedFullPhoto.issuingBody} &bull; Reg: {selectedFullPhoto.credentialNumber}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOAD / EDIT CERTIFICATE MODAL ─────────────────── */}
      {isUploadModalOpen && (
        <div
          className="wida-img-modal-overlay"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="wida-modal-card-form"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wida-modal-form-header">
              <h3>{editingCert ? 'Edit Certificate Details' : 'Upload Medical Certificate'}</h3>
              <button
                type="button"
                className="wida-modal-close-icon"
                onClick={() => setIsUploadModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCertificate} className="wida-cert-form">
              {/* Photo Preview & Upload Box */}
              <div className="wida-cert-upload-dropzone">
                <div className="dropzone-preview">
                  <img
                    src={certImagePreview}
                    alt="Preview"
                    className="dropzone-img"
                  />
                </div>
                <div className="dropzone-action">
                  <button
                    type="button"
                    className="doc-btn doc-btn-outline doc-btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📁 Select Photo from Computer
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleCertificateFileChange}
                  />
                  <small style={{ color: '#64748b', fontSize: '11.5px', marginTop: '6px' }}>
                    Upload high-res JPG or PNG photo of your license or degree
                  </small>
                </div>
              </div>

              {/* Form Fields */}
              <div className="doc-form-group">
                <label className="doc-label">
                  Certificate Title <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="doc-input"
                  placeholder="e.g. State Medical Registration Certificate"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  required
                />
              </div>

              <div className="doc-form-group">
                <label className="doc-label">Issuing Medical Body / Authority</label>
                <input
                  type="text"
                  className="doc-input"
                  placeholder="e.g. National Medical Commission / Royal College"
                  value={certIssuingBody}
                  onChange={(e) => setCertIssuingBody(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="doc-form-group">
                  <label className="doc-label">Registration / Credential ID</label>
                  <input
                    type="text"
                    className="doc-input"
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                  />
                </div>
                <div className="doc-form-group">
                  <label className="doc-label">Date of Issue</label>
                  <input
                    type="date"
                    className="doc-input"
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="doc-form-group">
                <label className="doc-label">Credential Category</label>
                <select
                  className="doc-select"
                  value={certCategory}
                  onChange={(e) => setCertCategory(e.target.value)}
                >
                  <option value="Medical License">Medical License / State Registration</option>
                  <option value="Postgraduate Degree">Postgraduate Medical Degree (MD / MS / DM)</option>
                  <option value="Fellowship & Honors">Fellowship & Clinical Honors</option>
                  <option value="Specialist Certification">Board / Specialty Certification</option>
                  <option value="Clinical Excellence Award">Clinical Excellence Award</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="wida-modal-footer">
                <button
                  type="button"
                  className="doc-btn doc-btn-ghost"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="doc-btn doc-btn-primary">
                  {editingCert ? 'Save Changes' : 'Upload & Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── AVATAR PROFILE PHOTO EDIT MODAL ─────────────────── */}
      {isAvatarModalOpen && (
        <div
          className="wida-img-modal-overlay"
          onClick={() => setIsAvatarModalOpen(false)}
        >
          <div
            className="wida-modal-card-form"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wida-modal-form-header">
              <h3>Edit Profile Photo</h3>
              <button
                type="button"
                className="wida-modal-close-icon"
                onClick={() => setIsAvatarModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <img
                src={profileAvatar}
                alt="Avatar Preview"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #007c77',
                  marginBottom: '16px',
                }}
              />
              <div>
                <button
                  type="button"
                  className="doc-btn doc-btn-primary doc-btn-sm"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  📁 Upload New Avatar from Computer
                </button>
                <input
                  type="file"
                  ref={avatarInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarFileChange}
                />
              </div>
            </div>

            <div className="wida-modal-footer">
              <button
                type="button"
                className="doc-btn doc-btn-ghost"
                onClick={() => setIsAvatarModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
