import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ChevronDown
} from 'lucide-react';
import { TelehealthRoomModal } from './TelehealthRoomModal';

interface AppointmentSlot {
  id: string;
  day: number; // 8 to 14
  title: string;
  doctor: {
    name: string;
    specialty: string;
    avatar: string;
  };
  time: string;
}

const WEEK_DAYS = [
  { date: 8, day: 'Sun' },
  { date: 9, day: 'Mon' },
  { date: 10, day: 'Tue' },
  { date: 11, day: 'Wed' },
  { date: 12, day: 'Thu' },
  { date: 13, day: 'Fri' },
  { date: 14, day: 'Sat' }
];

const SCHEDULED_APPOINTMENTS: AppointmentSlot[] = [
  {
    id: 'apt-1',
    day: 10,
    title: 'MRI-Right thigh & Joint',
    doctor: {
      name: 'Dr. Damian Lewis',
      specialty: 'Radiology / Cardiology',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150'
    },
    time: '06:30PM'
  },
  {
    id: 'apt-2',
    day: 10,
    title: 'Surgery preparation',
    doctor: {
      name: 'Dr. Dianne Russell',
      specialty: 'Cardiovascular Surgery',
      avatar: 'https://images.unsplash.com/photo-1594824813627-8490a6e76192?auto=format&fit=crop&q=80&w=150'
    },
    time: '08:30PM'
  },
  {
    id: 'apt-3',
    day: 11,
    title: 'Post-Op Knee Checkup',
    doctor: {
      name: 'Dr. Robert Fox',
      specialty: 'Orthopedic Rehabilitation',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150'
    },
    time: '10:00AM'
  },
  {
    id: 'apt-4',
    day: 13,
    title: 'Cardiology Telemetry Review',
    doctor: {
      name: 'Dr. Sharad Richard',
      specialty: 'Lead Cardiologist',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150'
    },
    time: '04:15PM'
  }
];

export const UpcomingAppointmentsWidget: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<number>(10);
  const [filterPeriod, setFilterPeriod] = useState<'Today' | 'This Week' | 'All'>('Today');

  // Telehealth modal state
  const [telehealthState, setTelehealthState] = useState<{
    isOpen: boolean;
    appointmentTitle: string;
    doctorName: string;
    doctorSpecialty: string;
    doctorAvatar: string;
    time: string;
  }>({
    isOpen: false,
    appointmentTitle: '',
    doctorName: '',
    doctorSpecialty: '',
    doctorAvatar: '',
    time: ''
  });

  const appointmentsForSelectedDate = SCHEDULED_APPOINTMENTS.filter((a) => a.day === selectedDate);

  const handleJoinNow = (apt: AppointmentSlot) => {
    setTelehealthState({
      isOpen: true,
      appointmentTitle: apt.title,
      doctorName: apt.doctor.name,
      doctorSpecialty: apt.doctor.specialty,
      doctorAvatar: apt.doctor.avatar,
      time: apt.time
    });
  };

  return (
    <div className="patient-card p-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: 'var(--p-border-subtle)' }}>
        <h5 className="font-heading mb-0" style={{ fontSize: '1.15rem', fontWeight: 600 }}>
          Upcoming Appointments
        </h5>

        {/* Period Filter Dropdown */}
        <div className="dropdown">
          <button
            className="patient-btn patient-btn-outline patient-btn-sm d-flex align-items-center gap-2"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <Calendar size={13} style={{ color: 'var(--p-primary)' }} />
            <span>{filterPeriod}</span>
            <ChevronDown size={13} className="text-muted" />
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-sm">
            {(['Today', 'This Week', 'All'] as const).map((period) => (
              <li key={period}>
                <button
                  className={`dropdown-item ${filterPeriod === period ? 'active' : ''}`}
                  onClick={() => setFilterPeriod(period)}
                  style={{ fontSize: '0.82rem' }}
                >
                  {period}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Date Strip / Calendar Day Selector */}
      <div className="d-flex align-items-center justify-content-between gap-1 mb-4 pb-1 overflow-x-auto">
        {WEEK_DAYS.map((item) => {
          const isSelected = item.date === selectedDate;
          const hasAppts = SCHEDULED_APPOINTMENTS.some((a) => a.day === item.date);

          return (
            <button
              key={item.date}
              onClick={() => setSelectedDate(item.date)}
              className="border-0 rounded-4 p-2 text-center flex-fill transition-all position-relative"
              style={{
                minWidth: 44,
                backgroundColor: isSelected ? 'var(--p-primary, #0D9488)' : 'var(--p-surface-alt)',
                color: isSelected ? '#ffffff' : 'var(--p-text-main)',
                boxShadow: isSelected ? '0 4px 12px rgba(13, 148, 136, 0.35)' : 'none',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  fontSize: '0.98rem',
                  fontWeight: isSelected ? 700 : 600,
                  lineHeight: 1.2
                }}
              >
                {item.date < 10 ? `0${item.date}` : item.date}
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  opacity: isSelected ? 0.9 : 0.65,
                  fontWeight: 500
                }}
              >
                {item.day}
              </div>

              {/* Indicator dot if appointments exist on this day and not selected */}
              {hasAppts && !isSelected && (
                <span
                  className="position-absolute bottom-0 start-50 translate-middle-x mb-1 rounded-circle"
                  style={{
                    width: 4,
                    height: 4,
                    backgroundColor: 'var(--p-primary)'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Appointments List for Day */}
      <div className="d-flex flex-column gap-3">
        {appointmentsForSelectedDate.length === 0 ? (
          <div className="text-center py-4 text-muted rounded-3" style={{ backgroundColor: 'var(--p-surface-alt)' }}>
            <Calendar size={28} className="text-muted mb-2 opacity-50" />
            <div style={{ fontSize: '0.86rem' }}>No consultations scheduled for {selectedDate} Oct.</div>
            <span style={{ fontSize: '0.74rem' }}>Select 10 Oct to view upcoming surgery & MRI sessions.</span>
          </div>
        ) : (
          appointmentsForSelectedDate.map((apt) => (
            <div
              key={apt.id}
              className="p-3 rounded-4 border d-flex align-items-center justify-content-between gap-3 transition-all"
              style={{
                backgroundColor: 'var(--p-surface-alt)',
                borderColor: 'var(--p-border-subtle)'
              }}
            >
              {/* Doctor & Consultation Details */}
              <div className="d-flex align-items-center gap-3 overflow-hidden">
                <img
                  src={apt.doctor.avatar}
                  alt={apt.doctor.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor.name)}&background=0D9488&color=fff&bold=true`;
                  }}
                  className="rounded-circle border"
                  style={{ width: 42, height: 42, objectFit: 'cover', flexShrink: 0 }}
                />
                <div className="overflow-hidden">
                  <h6 className="font-heading mb-0 text-truncate fw-bold" style={{ fontSize: '0.95rem' }}>
                    {apt.title}
                  </h6>
                  <div className="text-muted text-truncate" style={{ fontSize: '0.78rem' }}>
                    {apt.doctor.name}
                  </div>
                  <div className="text-muted text-truncate" style={{ fontSize: '0.72rem' }}>
                    {apt.doctor.specialty}
                  </div>
                </div>
              </div>

              {/* Join Button & Scheduled Time */}
              <div className="d-flex flex-column align-items-end gap-1 flex-shrink-0">
                <button
                  onClick={() => handleJoinNow(apt)}
                  className="patient-btn patient-btn-sm rounded-pill px-3 py-1 fw-bold text-white shadow-sm"
                  style={{
                    backgroundColor: 'var(--p-primary, #0D9488)',
                    fontSize: '0.78rem'
                  }}
                  title="Launch ABDM Telehealth Video Room"
                >
                  Join Now
                </button>
                <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.72rem' }}>
                  <Clock size={12} />
                  <span>{apt.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Telehealth Room Modal */}
      <TelehealthRoomModal
        isOpen={telehealthState.isOpen}
        onClose={() => setTelehealthState((prev) => ({ ...prev, isOpen: false }))}
        appointmentTitle={telehealthState.appointmentTitle}
        doctorName={telehealthState.doctorName}
        doctorSpecialty={telehealthState.doctorSpecialty}
        doctorAvatar={telehealthState.doctorAvatar}
        time={telehealthState.time}
      />
    </div>
  );
};
