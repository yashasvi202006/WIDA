import React, { useState } from 'react';
import { PATIENT_MOCK_DOCTORS } from '../data/patientMockData';
import { DoctorCard } from '../components/DoctorCard';
import type { PatientDoctor, MedicineSystem } from '../types/patientTypes';
import { Flower2 } from 'lucide-react';

interface PatientAlternativeMedicineProps {
  onBookDoctor: (doctor: PatientDoctor) => void;
}

export const PatientAlternativeMedicine: React.FC<PatientAlternativeMedicineProps> = ({ onBookDoctor }) => {
  const [selectedSystem, setSelectedSystem] = useState<MedicineSystem>('Ayurveda');

  const filteredDoctors = PATIENT_MOCK_DOCTORS.filter((d) => d.medicineSystem === selectedSystem);

  return (
    <div className="patient-alternative-medicine d-flex flex-column gap-4">
      <div>
        <div className="d-flex align-items-center gap-2 mb-1">
          <Flower2 size={22} style={{ color: 'var(--p-purple)' }} />
          <h3 className="font-heading mb-0">Integrative & Alternative Medicine (AYUSH)</h3>
        </div>
        <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
          Explore validated traditional medical systems alongside conventional evidence-based healthcare
        </p>
      </div>

      {/* Distinction notice */}
      <div className="p-3 rounded border" style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)', fontSize: '0.82rem', color: 'var(--p-text-muted)' }}>
        <strong>Clinical Distinction:</strong> Alternative medicine therapies are complementary systems under the Ministry of AYUSH. Educational articles are informational and do not replace comprehensive medical evaluations.
      </div>

      {/* System Tabs */}
      <div className="patient-card p-3 d-flex gap-2">
        {(['Ayurveda', 'Homeopathy', 'Allopathy'] as MedicineSystem[]).map((sys) => (
          <button
            key={sys}
            className={`patient-btn ${selectedSystem === sys ? 'patient-btn-primary' : 'patient-btn-outline'}`}
            onClick={() => setSelectedSystem(sys)}
          >
            {sys}
          </button>
        ))}
      </div>

      {/* System Overview */}
      <div className="patient-card p-4">
        {selectedSystem === 'Ayurveda' && (
          <div>
            <h5 className="font-heading mb-2">Ayurvedic Holistic Medicine</h5>
            <p className="text-muted mb-3" style={{ fontSize: '0.86rem', lineHeight: 1.5 }}>
              Ayurveda is a 5,000-year-old traditional Indian system focusing on balancing the three fundamental doshas (Vata, Pitta, Kapha) through individualized dietetics, herbal pharmacology, and detoxifying Panchakarma procedures.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className="patient-badge patient-badge-purple">Panchakarma Detox</span>
              <span className="patient-badge patient-badge-teal">Metabolic Gut Rebalance</span>
              <span className="patient-badge patient-badge-neutral">Herbal Formulations</span>
            </div>
          </div>
        )}

        {selectedSystem === 'Homeopathy' && (
          <div>
            <h5 className="font-heading mb-2">Classical Constitutional Homeopathy</h5>
            <p className="text-muted mb-3" style={{ fontSize: '0.86rem', lineHeight: 1.5 }}>
              Homeopathy is a system founded on the principle of 'similia similibus curentur' (like cures like), utilizing micro-diluted natural substances to stimulate the body's innate self-healing immune response.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className="patient-badge patient-badge-purple">Chronic Allergies</span>
              <span className="patient-badge patient-badge-teal">Dermatological Relief</span>
              <span className="patient-badge patient-badge-neutral">Gentle Pediatric Care</span>
            </div>
          </div>
        )}

        {selectedSystem === 'Allopathy' && (
          <div>
            <h5 className="font-heading mb-2">Evidence-Based Modern Allopathic Medicine</h5>
            <p className="text-muted mb-3" style={{ fontSize: '0.86rem', lineHeight: 1.5 }}>
              Modern pharmaceutical medicine and surgical specialties utilizing randomized clinical trial evidence, advanced laboratory pathology, and targeted pharmacotherapy.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className="patient-badge patient-badge-teal">Interventional Cardiology</span>
              <span className="patient-badge patient-badge-teal">Clinical Dermatology</span>
              <span className="patient-badge patient-badge-teal">Internal Medicine</span>
            </div>
          </div>
        )}
      </div>

      {/* Practitioners in this System */}
      <div>
        <h5 className="font-heading mb-3">Empanelled Practitioners ({selectedSystem})</h5>
        <div className="row g-3">
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="col-md-6 col-lg-4">
              <DoctorCard doctor={doc} onBook={onBookDoctor} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
