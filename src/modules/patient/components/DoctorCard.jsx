import React from 'react';
import { Star, ShieldCheck, MapPin, Calendar, Clock, Award } from 'lucide-react';

export const DoctorCard = ({ doctor, onBook, onViewProfile }) => {
    const docName = doctor.name || doctor.fullName || 'Dr. Specialist';
    const docSpec = doctor.specialization || doctor.specializationName || 'General Physician';
    const docHospital = doctor.hospital || doctor.hospitalClinicName || 'WIDA Apex Medical Center';
    const docPhoto = doctor.photo || doctor.avatarUrl || doctor.profilePhotoUrl;
    const docFee = doctor.consultationFee || 750;
    const docRating = doctor.rating || doctor.averageRating || 4.9;
    const docExperience = doctor.experience || doctor.yearsOfExperience || 5;
    const docAvailability = doctor.availability || 'Mon - Sat (10:00 AM - 05:00 PM)';
    const isRegistered = doctor.isRegistered || Boolean(doctor.medicalRegistrationNumber);

    const getSystemBadge = () => {
        switch (doctor.medicineSystem) {
            case 'Ayurveda':
                return <span className="patient-badge patient-badge-purple">Ayurveda</span>;
            case 'Homeopathy':
                return <span className="patient-badge patient-badge-warning">Homeopathy</span>;
            default:
                return <span className="patient-badge patient-badge-teal">Allopathy</span>;
        }
    };

    return (
        <div className="patient-card patient-card-hover p-3 h-100 d-flex flex-column justify-content-between position-relative">
            {isRegistered && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: '#007C77',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 4px rgba(0, 124, 119, 0.25)'
                }}>
                    <Award size={11} /> Registered Practitioner
                </div>
            )}

            <div>
                <div className="d-flex align-items-start gap-3 mb-3" style={{ marginTop: isRegistered ? '14px' : '0' }}>
                    <img 
                        src={docPhoto} 
                        alt={docName} 
                        onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(docName)}&background=007C77&color=fff&bold=true`;
                        }} 
                        style={{ width: 68, height: 68, borderRadius: 'var(--p-radius-lg)', objectFit: 'cover' }}
                    />
                    <div className="flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                            <h6 className="mb-0 font-heading" style={{ fontSize: '1rem' }}>{docName}</h6>
                            {(doctor.verified !== false) && !isRegistered && (
                                <span title="Verified Healthcare Practitioner" className="text-success d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                    <ShieldCheck size={14}/> Verified
                                </span>
                            )}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--p-primary)', fontWeight: 600 }}>
                            {docSpec}
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-1">
                            <span className="d-flex align-items-center gap-1 text-warning" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                                <Star size={13} fill="#F59E0B"/> {docRating}
                            </span>
                            <span className="text-muted" style={{ fontSize: '0.78rem' }}>({doctor.patientsCount || 120}+ patients)</span>
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-wrap gap-1 mb-2">
                    {getSystemBadge()}
                    <span className="patient-badge patient-badge-neutral">{docExperience} Yrs Experience</span>
                    {doctor.medicalRegistrationNumber && (
                        <span className="patient-badge patient-badge-neutral" style={{ fontSize: '0.7rem' }}>
                            ID: {doctor.medicalRegistrationNumber}
                        </span>
                    )}
                </div>

                <p className="mb-2 text-muted" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                    {(doctor.about || doctor.professionalBio || doctor.qualification || docSpec || 'Certified Healthcare Specialist').slice(0, 95)}...
                </p>

                <div className="p-2 rounded mb-3" style={{ backgroundColor: 'var(--p-surface-alt)', fontSize: '0.78rem' }}>
                    <div className="d-flex align-items-center gap-1 text-muted mb-1">
                        <MapPin size={12} style={{ color: 'var(--p-primary)' }}/>
                        <span className="text-truncate">{docHospital}</span>
                    </div>
                    <div className="d-flex align-items-center gap-1 text-muted">
                        <Clock size={12} style={{ color: 'var(--p-primary)' }}/>
                        <span>{docAvailability}</span>
                    </div>
                </div>
            </div>

            <div className="d-flex align-items-center justify-content-between pt-2 border-top" style={{ borderColor: 'var(--p-border-subtle)' }}>
                <div>
                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>Consultation Fee</span>
                    <div className="fw-bold" style={{ fontSize: '1rem', color: 'var(--p-text-main)' }}>
                        ₹{docFee}
                    </div>
                </div>
                <div className="d-flex gap-2">
                    {onViewProfile && (
                        <button className="patient-btn patient-btn-outline patient-btn-sm" onClick={() => onViewProfile(doctor)}>
                            Profile
                        </button>
                    )}
                    <button className="patient-btn patient-btn-primary patient-btn-sm" onClick={() => onBook(doctor)}>
                        <Calendar size={13}/> Book Slot
                    </button>
                </div>
            </div>
        </div>
    );
};
