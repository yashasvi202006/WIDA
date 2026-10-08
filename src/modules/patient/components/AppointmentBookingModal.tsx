import React, { useState } from 'react';
import type { PatientDoctor, AppointmentType } from '../types/patientTypes';
import { PATIENT_MOCK_DOCTORS } from '../data/patientMockData';
import { X, Calendar, Clock, MapPin, Video, Check, ChevronRight } from 'lucide-react';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookSuccess: (data: {
    doctorId: string;
    doctorName: string;
    doctorSpecialization: string;
    doctorAvatar: string;
    date: string;
    time: string;
    type: AppointmentType;
    reason: string;
    fee: number;
    location?: string;
  }) => void;
  preselectedDoctorId?: string;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  onBookSuccess,
  preselectedDoctorId
}) => {
  const [step, setStep] = useState(1);
  const [specialization, setSpecialization] = useState('Cardiology');
  const [selectedDoctor, setSelectedDoctor] = useState<PatientDoctor | null>(() => {
    return PATIENT_MOCK_DOCTORS.find((d) => d.id === preselectedDoctorId) || PATIENT_MOCK_DOCTORS[0];
  });
  const [selectedDate, setSelectedDate] = useState('2026-10-14');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [consultType, setConsultType] = useState<AppointmentType>('In-person');
  const [reason, setReason] = useState('Regular checkup and cardiology review');

  if (!isOpen) return null;

  const specializations = ['Cardiology', 'Dermatology', 'General Medicine', 'Ayurveda', 'Homeopathy'];

  const filteredDoctors = PATIENT_MOCK_DOCTORS.filter((d) =>
    d.specialization.toLowerCase().includes(specialization.toLowerCase().slice(0, 4))
  );
  const doctorsToDisplay = filteredDoctors.length > 0 ? filteredDoctors : PATIENT_MOCK_DOCTORS;

  const handleConfirm = () => {
    if (!selectedDoctor) return;
    onBookSuccess({
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialization: selectedDoctor.specialization,
      doctorAvatar: selectedDoctor.photo,
      date: selectedDate,
      time: selectedTime,
      type: consultType,
      reason,
      fee: selectedDoctor.consultationFee,
      location: selectedDoctor.location
    });
    onClose();
  };

  return (
    <div className="patient-modal-backdrop">
      <div className="patient-modal-box">
        <div className="patient-card-header">
          <div className="d-flex align-items-center gap-2">
            <Calendar size={18} style={{ color: 'var(--p-primary)' }} />
            <h5 className="mb-0 font-heading" style={{ fontSize: '1.1rem' }}>Book Doctor Appointment</h5>
          </div>
          <button
            onClick={onClose}
            className="border-0 bg-transparent p-1 text-muted"
            style={{ cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Multi-step progress indicator */}
        <div className="px-4 py-2 border-bottom" style={{ borderColor: 'var(--p-border-subtle)', backgroundColor: 'var(--p-surface-alt)' }}>
          <div className="d-flex align-items-center justify-content-between" style={{ fontSize: '0.8rem' }}>
            <span className={step >= 1 ? 'fw-bold text-success' : 'text-muted'}>1. Specialization</span>
            <ChevronRight size={14} className="text-muted" />
            <span className={step >= 2 ? 'fw-bold text-success' : 'text-muted'}>2. Doctor</span>
            <ChevronRight size={14} className="text-muted" />
            <span className={step >= 3 ? 'fw-bold text-success' : 'text-muted'}>3. Schedule</span>
            <ChevronRight size={14} className="text-muted" />
            <span className={step >= 4 ? 'fw-bold text-success' : 'text-muted'}>4. Mode & Confirm</span>
          </div>
        </div>

        <div className="patient-card-body">
          {step === 1 && (
            <div>
              <h6 className="mb-3 font-heading">Step 1: Choose Medical Specialization</h6>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {specializations.map((spec) => (
                  <button
                    key={spec}
                    type="button"
                    className={`patient-btn ${specialization === spec ? 'patient-btn-primary' : 'patient-btn-outline'}`}
                    onClick={() => {
                      setSpecialization(spec);
                      const doc = PATIENT_MOCK_DOCTORS.find((d) => d.specialization.includes(spec.slice(0, 4))) || PATIENT_MOCK_DOCTORS[0];
                      setSelectedDoctor(doc);
                    }}
                  >
                    {spec}
                  </button>
                ))}
              </div>
              <div className="d-flex justify-content-end">
                <button className="patient-btn patient-btn-primary" onClick={() => setStep(2)}>
                  Next: Select Doctor <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h6 className="mb-3 font-heading">Step 2: Choose Doctor</h6>
              <div className="d-flex flex-column gap-2 mb-4">
                {doctorsToDisplay.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className="p-3 rounded d-flex align-items-center justify-content-between border"
                    style={{
                      cursor: 'pointer',
                      borderColor: selectedDoctor?.id === doc.id ? 'var(--p-primary)' : 'var(--p-border)',
                      backgroundColor: selectedDoctor?.id === doc.id ? 'var(--p-primary-subtle)' : 'var(--p-surface)'
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <img src={doc.photo} alt={doc.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div className="fw-bold" style={{ color: 'var(--p-text-main)' }}>{doc.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--p-text-muted)' }}>
                          {doc.specialization} • {doc.experience} yrs exp • ₹{doc.consultationFee}
                        </div>
                      </div>
                    </div>
                    {selectedDoctor?.id === doc.id && <Check size={18} style={{ color: 'var(--p-primary)' }} />}
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between">
                <button className="patient-btn patient-btn-outline" onClick={() => setStep(1)}>Back</button>
                <button className="patient-btn patient-btn-primary" onClick={() => setStep(3)}>Next: Select Slot</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h6 className="mb-3 font-heading">Step 3: Select Date & Time</h6>
              <div className="mb-3">
                <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Appointment Date</label>
                <input
                  type="date"
                  className="patient-input"
                  value={selectedDate}
                  min="2026-10-08"
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Available Time Slots</label>
                <div className="d-flex flex-wrap gap-2">
                  {selectedDoctor?.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`patient-btn patient-btn-sm ${selectedTime === slot ? 'patient-btn-primary' : 'patient-btn-outline'}`}
                      onClick={() => setSelectedTime(slot)}
                    >
                      <Clock size={13} /> {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <button className="patient-btn patient-btn-outline" onClick={() => setStep(2)}>Back</button>
                <button className="patient-btn patient-btn-primary" onClick={() => setStep(4)}>Next: Consultation Mode</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h6 className="mb-3 font-heading">Step 4: Consultation Type & Confirm</h6>
              <div className="d-flex gap-3 mb-3">
                <div
                  className="flex-fill p-3 rounded border text-center"
                  onClick={() => setConsultType('In-person')}
                  style={{
                    cursor: 'pointer',
                    borderColor: consultType === 'In-person' ? 'var(--p-primary)' : 'var(--p-border)',
                    backgroundColor: consultType === 'In-person' ? 'var(--p-primary-subtle)' : 'transparent'
                  }}
                >
                  <MapPin size={22} className="mb-2 text-teal" style={{ color: 'var(--p-primary)' }} />
                  <div className="fw-bold" style={{ fontSize: '0.9rem' }}>In-Person Visit</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--p-text-muted)' }}>Hospital / Clinic OPD</div>
                </div>

                <div
                  className="flex-fill p-3 rounded border text-center"
                  onClick={() => setConsultType('Online')}
                  style={{
                    cursor: 'pointer',
                    borderColor: consultType === 'Online' ? 'var(--p-primary)' : 'var(--p-border)',
                    backgroundColor: consultType === 'Online' ? 'var(--p-primary-subtle)' : 'transparent'
                  }}
                >
                  <Video size={22} className="mb-2" style={{ color: '#0284C7' }} />
                  <div className="fw-bold" style={{ fontSize: '0.9rem' }}>Online Video Call</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--p-text-muted)' }}>WIDA Telehealth Room</div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Reason for Consultation</label>
                <textarea
                  className="patient-input"
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe your symptoms or reason for visit..."
                />
              </div>

              {selectedDoctor && (
                <div className="p-3 rounded mb-4" style={{ backgroundColor: 'var(--p-surface-alt)', border: '1px solid var(--p-border)' }}>
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.85rem' }}>
                    <span className="text-muted">Doctor:</span>
                    <span className="fw-bold">{selectedDoctor.name} ({selectedDoctor.specialization})</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.85rem' }}>
                    <span className="text-muted">Slot:</span>
                    <span className="fw-bold">{selectedDate} at {selectedTime}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.85rem' }}>
                    <span className="text-muted">Consultation Fee:</span>
                    <span className="fw-bold text-success">₹{selectedDoctor.consultationFee}</span>
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-between">
                <button className="patient-btn patient-btn-outline" onClick={() => setStep(3)}>Back</button>
                <button className="patient-btn patient-btn-primary" onClick={handleConfirm}>
                  <Check size={16} /> Confirm & Book Appointment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
