import React, { useState } from 'react';
import { DiagnosticCard } from '../components/DiagnosticCard';
import { LabReportCard } from '../components/LabReportCard';
import { FlaskConical, FileCheck, Calendar, Check, X, Search, ShieldCheck } from 'lucide-react';
export const PatientDiagnostics = ({ tests, labs, reports, bookings, onBookTest, onSimulateReportReady }) => {
    const [activeTab, setActiveTab] = useState('tests');
    const [search, setSearch] = useState('');
    const [bookingTest, setBookingTest] = useState(null);
    const [selectedLab, setSelectedLab] = useState(labs[0]);
    const [selectedDate, setSelectedDate] = useState('2026-10-15');
    const [selectedTime, setSelectedTime] = useState('08:30 AM');
    const [collectionType, setCollectionType] = useState('Home Sample Collection');
    const filteredTests = tests.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()));
    const handleConfirmBooking = () => {
        if (!bookingTest || !selectedLab)
            return;
        onBookTest({
            testId: bookingTest.id,
            testName: bookingTest.name,
            labId: selectedLab.id,
            labName: selectedLab.name,
            date: selectedDate,
            time: selectedTime,
            collectionType,
            price: bookingTest.price,
            preparationNotes: bookingTest.preparation
        });
        setBookingTest(null);
        setActiveTab('bookings');
    };
    return (<div className="patient-diagnostics d-flex flex-column gap-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h3 className="font-heading mb-1">Diagnostic Laboratory & Reports</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Book accredited pathology tests with home sample collection and receive verified digital reports
          </p>
        </div>

        <div className="d-flex gap-2">
          <span className="patient-badge patient-badge-teal py-2 px-3">
            <ShieldCheck size={14}/> NABL & CAP Accredited Labs
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="patient-card p-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex gap-2">
          <button className={`patient-btn ${activeTab === 'tests' ? 'patient-btn-primary' : 'patient-btn-outline'}`} onClick={() => setActiveTab('tests')}>
            <FlaskConical size={14}/> Available Tests ({tests.length})
          </button>
          <button className={`patient-btn ${activeTab === 'bookings' ? 'patient-btn-primary' : 'patient-btn-outline'}`} onClick={() => setActiveTab('bookings')}>
            <Calendar size={14}/> My Bookings ({bookings.length})
          </button>
          <button className={`patient-btn ${activeTab === 'reports' ? 'patient-btn-primary' : 'patient-btn-outline'}`} onClick={() => setActiveTab('reports')}>
            <FileCheck size={14}/> Verified Reports ({reports.length})
          </button>
        </div>

        {activeTab === 'tests' && (<div className="position-relative" style={{ minWidth: 260 }}>
            <Search size={14} className="position-absolute text-muted" style={{ top: '50%', transform: 'translateY(-50%)', left: 10 }}/>
            <input type="text" className="patient-input ps-4 py-1" placeholder="Search diagnostic tests..." value={search} onChange={(e) => setSearch(e.target.value)}/>
          </div>)}
      </div>

      {/* Tab: Tests Catalog */}
      {activeTab === 'tests' && (<div className="row g-3">
          {filteredTests.map((t) => (<div key={t.id} className="col-md-6 col-lg-3">
              <DiagnosticCard test={t} onBook={(test) => setBookingTest(test)}/>
            </div>))}
        </div>)}

      {/* Tab: My Bookings */}
      {activeTab === 'bookings' && (<div className="d-flex flex-column gap-3">
          {bookings.length === 0 ? (<div className="patient-card p-5 text-center text-muted">
              <FlaskConical size={40} className="mb-2 text-muted mx-auto"/>
              <h5 className="font-heading">No diagnostic bookings</h5>
              <p style={{ fontSize: '0.85rem' }}>You have not booked any lab tests yet.</p>
            </div>) : (bookings.map((bk) => (<div key={bk.id} className="patient-card p-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--p-radius-md)',
                    backgroundColor: 'var(--p-surface-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--p-primary)'
                }}>
                    <FlaskConical size={22}/>
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="mb-0 font-heading">{bk.testName}</h6>
                      <span className="patient-badge patient-badge-teal">{bk.status}</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--p-text-muted)' }}>
                      {bk.labName} • {bk.date} at {bk.time} • {bk.collectionType}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold text-success" style={{ fontSize: '1rem' }}>₹{bk.price}</span>
                  {bk.status === 'Booked' && onSimulateReportReady && (<button className="patient-btn patient-btn-outline patient-btn-sm" onClick={() => onSimulateReportReady(bk.id)}>
                      Simulate Report Ready
                    </button>)}
                </div>
              </div>)))}
        </div>)}

      {/* Tab: Verified Reports */}
      {activeTab === 'reports' && (<div>
          {reports.map((rep) => (<LabReportCard key={rep.id} report={rep}/>))}
        </div>)}

      {/* Lab Booking Modal */}
      {bookingTest && (<div className="patient-modal-backdrop">
          <div className="patient-modal-box">
            <div className="patient-card-header">
              <div className="d-flex align-items-center gap-2">
                <FlaskConical size={18} style={{ color: 'var(--p-primary)' }}/>
                <h5 className="mb-0 font-heading" style={{ fontSize: '1.05rem' }}>Book {bookingTest.name}</h5>
              </div>
              <button onClick={() => setBookingTest(null)} className="border-0 bg-transparent p-1 text-muted" style={{ cursor: 'pointer' }}>
                <X size={20}/>
              </button>
            </div>

            <div className="patient-card-body">
              {/* Lab Selection */}
              <div className="mb-3">
                <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Select Laboratory</label>
                <div className="d-flex flex-column gap-2">
                  {labs.map((lab) => (<div key={lab.id} onClick={() => setSelectedLab(lab)} className="p-3 rounded border d-flex justify-content-between align-items-center" style={{
                    cursor: 'pointer',
                    borderColor: selectedLab.id === lab.id ? 'var(--p-primary)' : 'var(--p-border)',
                    backgroundColor: selectedLab.id === lab.id ? 'var(--p-primary-subtle)' : 'var(--p-surface)'
                }}>
                      <div>
                        <div className="fw-bold" style={{ fontSize: '0.9rem' }}>{lab.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--p-text-muted)' }}>{lab.accreditation} • Rating {lab.rating}★</div>
                      </div>
                      {selectedLab.id === lab.id && <Check size={18} style={{ color: 'var(--p-primary)' }}/>}
                    </div>))}
                </div>
              </div>

              {/* Sample Collection Mode */}
              <div className="mb-3">
                <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Sample Collection Mode</label>
                <div className="d-flex gap-2">
                  <button type="button" className={`patient-btn flex-fill ${collectionType === 'Home Sample Collection' ? 'patient-btn-primary' : 'patient-btn-outline'}`} onClick={() => setCollectionType('Home Sample Collection')}>
                    Home Sample Collection
                  </button>
                  <button type="button" className={`patient-btn flex-fill ${collectionType === 'Visit Lab' ? 'patient-btn-primary' : 'patient-btn-outline'}`} onClick={() => setCollectionType('Visit Lab')}>
                    Visit Lab Facility
                  </button>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--p-text-subtle)' }} className="mt-1">
                  Home phlebotomy certified cold-chain sample preservation included.
                </div>
              </div>

              {/* Date & Time */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Date</label>
                  <input type="date" className="patient-input" value={selectedDate} min="2026-10-08" onChange={(e) => setSelectedDate(e.target.value)}/>
                </div>
                <div className="col-6">
                  <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Preferred Slot</label>
                  <select className="patient-input" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                    {selectedLab.availableSlots.map((slot) => (<option key={slot} value={slot}>{slot}</option>))}
                  </select>
                </div>
              </div>

              {/* Test Preparation Advice */}
              <div className="p-3 rounded mb-3" style={{ backgroundColor: 'var(--p-surface-alt)', border: '1px solid var(--p-border-subtle)', fontSize: '0.82rem' }}>
                <div className="fw-bold mb-1">Preparation Instructions:</div>
                <div className="text-muted">{bookingTest.preparation}</div>
              </div>

              <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>Total Cost</span>
                  <div className="fw-bold text-success" style={{ fontSize: '1.1rem' }}>₹{bookingTest.price}</div>
                </div>
                <div className="d-flex gap-2">
                  <button className="patient-btn patient-btn-outline" onClick={() => setBookingTest(null)}>Cancel</button>
                  <button className="patient-btn patient-btn-primary" onClick={handleConfirmBooking}>
                    <Check size={16}/> Confirm Test Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>)}
    </div>);
};
