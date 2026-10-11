import React, { useState } from 'react';
import { AppointmentCard } from '../components/AppointmentCard';
import { Calendar, Plus, Search } from 'lucide-react';
export const PatientAppointments = ({ appointments, onOpenBooking, onCancelAppointment }) => {
    const [tab, setTab] = useState('Upcoming');
    const [search, setSearch] = useState('');

    const isUpcoming = (status) => {
        const s = (status || '').toUpperCase();
        return s === 'CONFIRMED' || s === 'ACCEPTED' || s === 'SCHEDULED';
    };
    const isPending = (status) => {
        const s = (status || '').toUpperCase();
        return s === 'PENDING';
    };
    const isCompleted = (status) => {
        const s = (status || '').toUpperCase();
        return s === 'COMPLETED';
    };
    const isCancelled = (status) => {
        const s = (status || '').toUpperCase();
        return s === 'CANCELLED' || s === 'REJECTED';
    };

    const countMatches = (t) => {
        if (t === 'All') return appointments.length;
        if (t === 'Upcoming') return appointments.filter(a => isUpcoming(a.status)).length;
        if (t === 'Pending') return appointments.filter(a => isPending(a.status)).length;
        if (t === 'Completed') return appointments.filter(a => isCompleted(a.status)).length;
        if (t === 'Cancelled') return appointments.filter(a => isCancelled(a.status)).length;
        return 0;
    };

    const pendingCount = appointments.filter(a => isPending(a.status)).length;

    const filtered = appointments.filter((apt) => {
        let matchesTab = true;
        if (tab === 'Upcoming') matchesTab = isUpcoming(apt.status);
        else if (tab === 'Pending') matchesTab = isPending(apt.status);
        else if (tab === 'Completed') matchesTab = isCompleted(apt.status);
        else if (tab === 'Cancelled') matchesTab = isCancelled(apt.status);

        const searchLower = (search || '').toLowerCase();
        const matchesSearch = !search ||
            (apt.doctorName || '').toLowerCase().includes(searchLower) ||
            (apt.doctorSpecialization || '').toLowerCase().includes(searchLower) ||
            (apt.reason || '').toLowerCase().includes(searchLower);
        return matchesTab && matchesSearch;
    });
    return (<div className="patient-appointments d-flex flex-column gap-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h3 className="font-heading mb-1">My Appointments</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Schedule, manage, and attend hospital OPD and online teleconsultations
          </p>
        </div>
        <button className="patient-btn patient-btn-primary" onClick={onOpenBooking}>
          <Plus size={16}/> Book New Appointment
        </button>
      </div>

      {pendingCount > 0 && tab !== 'Pending' && (
        <div className="p-3 rounded-3 d-flex align-items-center justify-content-between" style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}>
          <div className="d-flex align-items-center gap-2">
            <span>⏳ You have <strong>{pendingCount} appointment request{pendingCount > 1 ? 's' : ''}</strong> pending doctor confirmation.</span>
          </div>
          <button className="patient-btn patient-btn-sm" style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }} onClick={() => setTab('Pending')}>
            View Pending Requests ({pendingCount})
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="patient-card p-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex flex-wrap gap-1">
          {['Upcoming', 'Pending', 'Completed', 'Cancelled', 'All'].map((t) => (<button key={t} className={`patient-btn patient-btn-sm ${tab === t ? 'patient-btn-primary' : 'patient-btn-outline'}`} onClick={() => setTab(t)}>
              {t} ({countMatches(t)})
            </button>))}
        </div>

        <div className="position-relative" style={{ minWidth: 260 }}>
          <Search size={14} className="position-absolute text-muted" style={{ top: '50%', transform: 'translateY(-50%)', left: 10 }}/>
          <input type="text" className="patient-input ps-4 py-1" style={{ fontSize: '0.85rem' }} placeholder="Search by doctor or reason..." value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>
      </div>

      {/* Appointment Grid */}
      {filtered.length === 0 ? (<div className="patient-card p-5 text-center text-muted">
          <Calendar size={48} className="mb-3 text-muted mx-auto"/>
          <h5 className="font-heading">No appointments in this view</h5>
          <p style={{ fontSize: '0.85rem' }}>
            You do not have any {tab.toLowerCase()} appointments matching your criteria.
          </p>
          <button className="patient-btn patient-btn-primary patient-btn-sm mt-2" onClick={onOpenBooking}>
            Book an Appointment
          </button>
        </div>) : (<div className="row g-3">
          {filtered.map((apt) => (<div key={apt.id} className="col-md-6 col-lg-4">
              <AppointmentCard appointment={apt} onCancel={onCancelAppointment} onJoin={(a) => alert(`Launching Telehealth video room for appointment #${a.id}`)}/>
            </div>))}
        </div>)}
    </div>);
};
