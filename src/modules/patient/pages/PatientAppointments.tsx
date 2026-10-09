import React, { useState } from 'react';
import type { PatientAppointment } from '../types/patientTypes';
import { AppointmentCard } from '../components/AppointmentCard';
import { Calendar, Plus, Search } from 'lucide-react';

interface PatientAppointmentsProps {
  appointments: PatientAppointment[];
  onOpenBooking: () => void;
  onCancelAppointment: (id: string) => void;
}

export const PatientAppointments: React.FC<PatientAppointmentsProps> = ({
  appointments,
  onOpenBooking,
  onCancelAppointment
}) => {
  const [tab, setTab] = useState<'All' | 'Upcoming' | 'Pending' | 'Completed' | 'Cancelled'>('Upcoming');
  const [search, setSearch] = useState('');

  const filtered = appointments.filter((apt) => {
    const matchesTab =
      tab === 'All'
        ? true
        : tab === 'Upcoming'
        ? apt.status === 'Confirmed'
        : apt.status === tab;

    const matchesSearch =
      apt.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      apt.doctorSpecialization.toLowerCase().includes(search.toLowerCase()) ||
      apt.reason.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="patient-appointments d-flex flex-column gap-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h3 className="font-heading mb-1">My Appointments</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Schedule, manage, and attend hospital OPD and online teleconsultations
          </p>
        </div>
        <button className="patient-btn patient-btn-primary" onClick={onOpenBooking}>
          <Plus size={16} /> Book New Appointment
        </button>
      </div>

      {/* Filter Bar */}
      <div className="patient-card p-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex flex-wrap gap-1">
          {(['Upcoming', 'Pending', 'Completed', 'Cancelled', 'All'] as const).map((t) => (
            <button
              key={t}
              className={`patient-btn patient-btn-sm ${tab === t ? 'patient-btn-primary' : 'patient-btn-outline'}`}
              onClick={() => setTab(t)}
            >
              {t} ({appointments.filter((a) => (t === 'All' ? true : t === 'Upcoming' ? a.status === 'Confirmed' : a.status === t)).length})
            </button>
          ))}
        </div>

        <div className="position-relative" style={{ minWidth: 260 }}>
          <Search size={14} className="position-absolute text-muted" style={{ top: '50%', transform: 'translateY(-50%)', left: 10 }} />
          <input
            type="text"
            className="patient-input ps-4 py-1"
            style={{ fontSize: '0.85rem' }}
            placeholder="Search by doctor or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Appointment Grid */}
      {filtered.length === 0 ? (
        <div className="patient-card p-5 text-center text-muted">
          <Calendar size={48} className="mb-3 text-muted mx-auto" />
          <h5 className="font-heading">No appointments in this view</h5>
          <p style={{ fontSize: '0.85rem' }}>
            You do not have any {tab.toLowerCase()} appointments matching your criteria.
          </p>
          <button className="patient-btn patient-btn-primary patient-btn-sm mt-2" onClick={onOpenBooking}>
            Book an Appointment
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((apt) => (
            <div key={apt.id} className="col-md-6 col-lg-4">
              <AppointmentCard
                appointment={apt}
                onCancel={onCancelAppointment}
                onJoin={(a) => alert(`Launching Telehealth video room for appointment #${a.id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
