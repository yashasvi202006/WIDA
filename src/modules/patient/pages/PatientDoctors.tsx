import React, { useState } from 'react';
import type { PatientDoctor } from '../types/patientTypes';
import { DoctorCard } from '../components/DoctorCard';
import { Search, ShieldCheck } from 'lucide-react';

interface PatientDoctorsProps {
  doctors: PatientDoctor[];
  onBookDoctor: (doctor: PatientDoctor) => void;
  onViewDoctorProfile?: (doctor: PatientDoctor) => void;
}

export const PatientDoctors: React.FC<PatientDoctorsProps> = ({
  doctors,
  onBookDoctor,
  onViewDoctorProfile
}) => {
  const [search, setSearch] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('All');
  const [selectedSpec, setSelectedSpec] = useState<string>('All');

  const specializations = ['All', 'Cardiologist', 'Dermatologist', 'General Physician', 'Ayurvedic Physician', 'Homeopathy Specialist'];
  const systems = ['All', 'Allopathy', 'Ayurveda', 'Homeopathy'];

  const filtered = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(search.toLowerCase());

    const matchesSystem = selectedSystem === 'All' ? true : doc.medicineSystem === selectedSystem;
    const matchesSpec = selectedSpec === 'All' ? true : doc.specialization === selectedSpec;

    return matchesSearch && matchesSystem && matchesSpec;
  });

  return (
    <div className="patient-doctors d-flex flex-column gap-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h3 className="font-heading mb-1">Find Certified Medical Specialists</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Book in-person hospital visits or digital teleconsultations across Allopathy, Ayurveda, and Homeopathy
          </p>
        </div>
        <span className="patient-badge patient-badge-teal py-2 px-3">
          <ShieldCheck size={14} /> 100% NBE & Medical Council Verified
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="patient-card p-3 d-flex flex-column gap-3">
        <div className="row g-2 align-items-center">
          <div className="col-md-5 position-relative">
            <Search size={15} className="position-absolute text-muted" style={{ top: '50%', transform: 'translateY(-50%)', left: 12 }} />
            <input
              type="text"
              className="patient-input ps-5"
              placeholder="Search by doctor name, specialty, or hospital..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-7 d-flex flex-wrap gap-2 justify-content-md-end">
            <div className="d-flex align-items-center gap-1">
              <span className="text-muted" style={{ fontSize: '0.78rem' }}>System:</span>
              {systems.map((sys) => (
                <button
                  key={sys}
                  className={`patient-btn patient-btn-sm ${selectedSystem === sys ? 'patient-btn-primary' : 'patient-btn-outline'}`}
                  onClick={() => setSelectedSystem(sys)}
                >
                  {sys}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Specialization Pills */}
        <div className="d-flex flex-wrap gap-1 border-top pt-2" style={{ borderColor: 'var(--p-border-subtle)' }}>
          <span className="text-muted me-2" style={{ fontSize: '0.78rem' }}>Specialty:</span>
          {specializations.map((spec) => (
            <button
              key={spec}
              className={`patient-btn patient-btn-sm ${selectedSpec === spec ? 'patient-btn-primary' : 'patient-btn-outline'}`}
              style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem' }}
              onClick={() => setSelectedSpec(spec)}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="row g-3">
        {filtered.map((doc) => (
          <div key={doc.id} className="col-md-6 col-lg-4">
            <DoctorCard
              doctor={doc}
              onBook={onBookDoctor}
              onViewProfile={onViewDoctorProfile}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
