import React from 'react';
import type { PatientDoctor } from '../types/patientTypes';
import { Star, ShieldCheck, MapPin, Calendar, Clock } from 'lucide-react';

interface DoctorCardProps {
  doctor: PatientDoctor;
  onBook: (doctor: PatientDoctor) => void;
  onViewProfile?: (doctor: PatientDoctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook, onViewProfile }) => {
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
    <div className="patient-card patient-card-hover p-3 h-100 d-flex flex-direction-column justify-content-between">
      <div>
        <div className="d-flex align-items-start gap-3 mb-3">
          <img
            src={doctor.photo}
            alt={doctor.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0D9488&color=fff&bold=true`;
            }}
            style={{ width: 68, height: 68, borderRadius: 'var(--p-radius-lg)', objectFit: 'cover' }}
          />
          <div className="flex-fill">
            <div className="d-flex align-items-center justify-content-between">
              <h6 className="mb-0 font-heading" style={{ fontSize: '1rem' }}>{doctor.name}</h6>
              {doctor.verified && (
                <span title="Verified Healthcare Practitioner" className="text-success d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                  <ShieldCheck size={14} /> Verified
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--p-primary)', fontWeight: 600 }}>
              {doctor.specialization}
            </div>
            <div className="d-flex align-items-center gap-2 mt-1">
              <span className="d-flex align-items-center gap-1 text-warning" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                <Star size={13} fill="#F59E0B" /> {doctor.rating}
              </span>
              <span className="text-muted" style={{ fontSize: '0.78rem' }}>({doctor.patientsCount}+ patients)</span>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-1 mb-2">
          {getSystemBadge()}
          <span className="patient-badge patient-badge-neutral">{doctor.experience} Yrs Experience</span>
        </div>

        <p className="mb-2 text-muted" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
          {doctor.about.slice(0, 95)}...
        </p>

        <div className="p-2 rounded mb-3" style={{ backgroundColor: 'var(--p-surface-alt)', fontSize: '0.78rem' }}>
          <div className="d-flex align-items-center gap-1 text-muted mb-1">
            <MapPin size={12} style={{ color: 'var(--p-primary)' }} />
            <span className="text-truncate">{doctor.hospital}</span>
          </div>
          <div className="d-flex align-items-center gap-1 text-muted">
            <Clock size={12} style={{ color: 'var(--p-primary)' }} />
            <span>{doctor.availability}</span>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between pt-2 border-top" style={{ borderColor: 'var(--p-border-subtle)' }}>
        <div>
          <span className="text-muted" style={{ fontSize: '0.7rem' }}>Consultation Fee</span>
          <div className="fw-bold" style={{ fontSize: '1rem', color: 'var(--p-text-main)' }}>
            ₹{doctor.consultationFee}
          </div>
        </div>
        <div className="d-flex gap-2">
          {onViewProfile && (
            <button
              className="patient-btn patient-btn-outline patient-btn-sm"
              onClick={() => onViewProfile(doctor)}
            >
              Profile
            </button>
          )}
          <button
            className="patient-btn patient-btn-primary patient-btn-sm"
            onClick={() => onBook(doctor)}
          >
            <Calendar size={13} /> Book Slot
          </button>
        </div>
      </div>
    </div>
  );
};
