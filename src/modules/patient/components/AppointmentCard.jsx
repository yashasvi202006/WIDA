import React from 'react';
import { Calendar, Clock, MapPin, Video, CheckCircle2, AlertCircle } from 'lucide-react';
export const AppointmentCard = ({ appointment, onCancel, onJoin }) => {
    const getStatusBadge = () => {
        switch (appointment.status) {
            case 'Confirmed':
                return <span className="patient-badge patient-badge-teal"><CheckCircle2 size={12}/> Confirmed</span>;
            case 'Pending':
                return <span className="patient-badge patient-badge-warning"><AlertCircle size={12}/> Pending</span>;
            case 'Completed':
                return <span className="patient-badge patient-badge-success">Completed</span>;
            case 'Cancelled':
                return <span className="patient-badge patient-badge-danger">Cancelled</span>;
            default:
                return <span className="patient-badge patient-badge-neutral">{appointment.status}</span>;
        }
    };
    return (<div className="patient-card patient-card-hover p-3">
      <div className="d-flex align-items-start justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3">
          <img src={appointment.doctorAvatar} alt={appointment.doctorName} onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.doctorName)}&background=0D9488&color=fff&bold=true`;
        }} style={{ width: 48, height: 48, borderRadius: 'var(--p-radius-md)', objectFit: 'cover' }}/>
          <div>
            <h6 className="mb-0 font-heading" style={{ fontSize: '0.98rem' }}>{appointment.doctorName}</h6>
            <span style={{ fontSize: '0.82rem', color: 'var(--p-text-muted)' }}>{appointment.doctorSpecialization}</span>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="p-2 mb-3 rounded" style={{ backgroundColor: 'var(--p-surface-alt)', border: '1px solid var(--p-border-subtle)', fontSize: '0.85rem' }}>
        <div className="d-flex align-items-center gap-2 mb-1 text-muted">
          <Calendar size={14} style={{ color: 'var(--p-primary)' }}/>
          <span style={{ color: 'var(--p-text-main)', fontWeight: 500 }}>{appointment.date}</span>
          <span className="mx-1">•</span>
          <Clock size={14} style={{ color: 'var(--p-primary)' }}/>
          <span style={{ color: 'var(--p-text-main)', fontWeight: 500 }}>{appointment.time}</span>
        </div>
        <div className="d-flex align-items-center gap-2 text-muted">
          {appointment.type === 'Online' ? (<>
              <Video size={14} style={{ color: '#0284C7' }}/>
              <span style={{ color: '#0284C7', fontWeight: 600 }}>Online Video Consultation</span>
            </>) : (<>
              <MapPin size={14} style={{ color: 'var(--p-primary)' }}/>
              <span style={{ color: 'var(--p-text-muted)' }}>{appointment.location}</span>
            </>)}
        </div>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--p-text-muted)' }} className="mb-3">
        <strong>Reason:</strong> {appointment.reason}
      </p>

      <div className="d-flex align-items-center justify-content-between pt-2 border-top" style={{ borderColor: 'var(--p-border-subtle)' }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--p-text-main)' }}>
          ₹{appointment.fee}
        </span>
        <div className="d-flex gap-2">
          {appointment.status === 'Confirmed' && appointment.type === 'Online' && (<button className="patient-btn patient-btn-primary patient-btn-sm" onClick={() => onJoin && onJoin(appointment)}>
              <Video size={13}/> Join Call
            </button>)}
          {appointment.status === 'Confirmed' && (<button className="patient-btn patient-btn-outline patient-btn-sm text-danger" style={{ borderColor: 'var(--p-danger)', color: 'var(--p-danger)' }} onClick={() => onCancel && onCancel(appointment.id)}>
              Cancel
            </button>)}
        </div>
      </div>
    </div>);
};
