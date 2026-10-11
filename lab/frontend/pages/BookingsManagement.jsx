import React, { useState, useEffect } from 'react';
import { labApiClient } from '../services/labApiClient.js';
import { Modal } from '../components/Modal.jsx';
import {
    CalendarCheck,
    Search,
    UserPlus,
    Clock,
    User,
    CheckCircle2,
    AlertCircle,
    TestTube,
    ChevronRight,
    MapPin,
    Building2,
    Home
} from 'lucide-react';

export const BookingsManagement = ({ onShowToast }) => {
    const [bookings, setBookings] = useState([]);
    const [activeStatusFilter, setActiveStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // New Booking Modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [availableTests, setAvailableTests] = useState([]);
    const [bookingForm, setBookingForm] = useState({
        patientName: '',
        patientPhone: '',
        patientEmail: '',
        patientAge: '28',
        patientGender: 'Male',
        abhaId: '',
        doctorName: 'Dr. Aarav Sharma (Cardiologist)',
        selectedTestIds: [],
        collectionType: 'Lab Visit',
        collectionAddress: '',
        appointmentDate: new Date().toISOString().split('T')[0],
        appointmentTime: '09:00 AM',
        notes: ''
    });

    // Status Transition Modal
    const [statusModalBooking, setStatusModalBooking] = useState(null);
    const [targetStatus, setTargetStatus] = useState('');
    const [transitionReason, setTransitionReason] = useState('');

    const statusOptions = [
        { id: '', label: 'All Bookings' },
        { id: 'BOOKED', label: 'Booked' },
        { id: 'CONFIRMED', label: 'Confirmed' },
        { id: 'SAMPLE_PENDING', label: 'Sample Pending' },
        { id: 'SAMPLE_COLLECTED', label: 'Sample Collected' },
        { id: 'PROCESSING', label: 'Processing' },
        { id: 'REPORT_PENDING_VERIFICATION', label: 'Awaiting Sign-off' },
        { id: 'REPORT_PUBLISHED', label: 'Published' }
    ];

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const data = await labApiClient.getBookings({
                status: activeStatusFilter,
                search: searchQuery
            });
            setBookings(data.bookings || []);

            const catData = await labApiClient.getCatalogue();
            setAvailableTests(catData.tests || []);
        } catch (err) {
            onShowToast?.('error', 'Failed to load bookings: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [activeStatusFilter, searchQuery]);

    const handleCreateBooking = async (e) => {
        e.preventDefault();
        if (!bookingForm.patientName || !bookingForm.patientPhone || bookingForm.selectedTestIds.length === 0) {
            onShowToast?.('error', 'Please enter patient name, phone, and select at least one test');
            return;
        }

        try {
            const res = await labApiClient.createBooking({
                patientName: bookingForm.patientName,
                patientPhone: bookingForm.patientPhone,
                patientEmail: bookingForm.patientEmail,
                patientAge: parseInt(bookingForm.patientAge, 10),
                patientGender: bookingForm.patientGender,
                abhaId: bookingForm.abhaId,
                doctorName: bookingForm.doctorName,
                testIds: bookingForm.selectedTestIds,
                collectionType: bookingForm.collectionType,
                collectionAddress: bookingForm.collectionAddress,
                appointmentDate: bookingForm.appointmentDate,
                appointmentTime: bookingForm.appointmentTime,
                notes: bookingForm.notes
            });

            onShowToast?.('success', `Booking ${res.booking.bookingReference} created. Barcode: ${res.booking.sampleBarcode}`);
            setIsCreateModalOpen(false);
            setBookingForm({
                patientName: '',
                patientPhone: '',
                patientEmail: '',
                patientAge: '28',
                patientGender: 'Male',
                abhaId: '',
                doctorName: 'Dr. Aarav Sharma',
                selectedTestIds: [],
                collectionType: 'Lab Visit',
                collectionAddress: '',
                appointmentDate: new Date().toISOString().split('T')[0],
                appointmentTime: '09:00 AM',
                notes: ''
            });
            fetchBookings();
        } catch (err) {
            onShowToast?.('error', 'Failed to create booking: ' + err.message);
        }
    };

    const handleStatusTransition = async () => {
        if (!statusModalBooking || !targetStatus) return;
        try {
            await labApiClient.updateBookingStatus(statusModalBooking.id, targetStatus, transitionReason);
            onShowToast?.('success', `Status transitioned to ${targetStatus}`);
            setStatusModalBooking(null);
            setTransitionReason('');
            fetchBookings();
        } catch (err) {
            onShowToast?.('error', 'Status transition rejected: ' + err.message);
        }
    };

    const toggleTestSelection = (testId) => {
        setBookingForm(prev => {
            const current = [...prev.selectedTestIds];
            const idx = current.indexOf(testId);
            if (idx > -1) {
                current.splice(idx, 1);
            } else {
                current.push(testId);
            }
            return { ...prev, selectedTestIds: current };
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header and Controls */}
            <div className="lab-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lab-text-main)', margin: 0 }}>
                            Patient Test Bookings & Phlebotomy Intake
                        </h2>
                        <span style={{ fontSize: '0.82rem', color: 'var(--lab-text-secondary)' }}>
                            End-to-end sample collection tracking and state machine progression
                        </span>
                    </div>

                    <button
                        type="button"
                        className="lab-btn lab-btn-primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <UserPlus size={16} /> + New Walk-in / Order Intake
                    </button>
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {statusOptions.map(opt => (
                            <button
                                key={opt.id}
                                type="button"
                                className={`lab-btn lab-btn-sm ${activeStatusFilter === opt.id ? 'lab-btn-primary' : 'lab-btn-outline'}`}
                                onClick={() => setActiveStatusFilter(opt.id)}
                                style={{ fontSize: '0.78rem' }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ position: 'relative', minWidth: '260px' }}>
                        <input
                            type="text"
                            className="lab-input"
                            style={{ paddingLeft: '2.4rem', height: '36px', fontSize: '0.84rem' }}
                            placeholder="Search patient, ref, test..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)' }} />
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="lab-card">
                <div className="lab-table-container">
                    <table className="lab-table">
                        <thead>
                            <tr>
                                <th>Booking Ref / Date</th>
                                <th>Patient Details</th>
                                <th>Diagnostic Investigation</th>
                                <th>Ordering Physician</th>
                                <th>Collection Mode</th>
                                <th>Status</th>
                                <th>Billing</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--lab-text-secondary)' }}>
                                        No bookings found matching selected filters.
                                    </td>
                                </tr>
                            ) : (
                                bookings.map(b => (
                                    <tr key={b.id}>
                                        <td>
                                            <div style={{ fontWeight: 700, fontFamily: 'var(--lab-font-mono)', color: 'var(--lab-primary-dark)' }}>
                                                {b.booking_reference}
                                            </div>
                                            <div style={{ fontSize: '0.76rem', color: 'var(--lab-text-secondary)' }}>
                                                {b.appointment_date} at {b.appointment_time}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{b.patient_name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--lab-text-secondary)' }}>
                                                {b.patient_age}y / {b.patient_gender} • {b.patient_phone}
                                            </div>
                                            {b.abha_id && (
                                                <span style={{ fontSize: '0.72rem', color: 'var(--lab-primary-dark)', fontWeight: 600 }}>
                                                    ABHA: {b.abha_id}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--lab-text-main)' }}>
                                                {b.test_names}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.82rem', color: 'var(--lab-text-secondary)' }}>
                                            {b.doctor_name || 'Self Request'}
                                        </td>
                                        <td>
                                            <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
                                                {b.collection_type === 'Home Sample Collection' ? (
                                                    <><Home size={13} style={{ color: 'var(--lab-warning)' }} /> Home Phlebotomy</>
                                                ) : (
                                                    <><Building2 size={13} style={{ color: 'var(--lab-primary)' }} /> Lab Facility</>
                                                )}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`lab-badge ${
                                                b.status === 'REPORT_PUBLISHED' ? 'lab-badge-success' :
                                                b.status === 'REPORT_PENDING_VERIFICATION' ? 'lab-badge-danger' :
                                                b.status === 'PROCESSING' ? 'lab-badge-purple' :
                                                b.status === 'SAMPLE_COLLECTED' ? 'lab-badge-teal' : 'lab-badge-warning'
                                            }`} style={{ fontSize: '0.68rem' }}>
                                                {b.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>₹{b.total_amount}</div>
                                            <span className={`lab-badge ${b.payment_status === 'PAID' ? 'lab-badge-success' : 'lab-badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                                                {b.payment_status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                type="button"
                                                className="lab-btn lab-btn-outline lab-btn-sm"
                                                onClick={() => {
                                                    setStatusModalBooking(b);
                                                    setTargetStatus(b.status);
                                                }}
                                            >
                                                Advance Status →
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Walk-in Intake Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Register Walk-in Patient & Create Diagnostic Order"
                maxWidth={700}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
                        <button type="button" className="lab-btn lab-btn-outline" onClick={() => setIsCreateModalOpen(false)}>
                            Cancel
                        </button>
                        <button type="button" className="lab-btn lab-btn-primary" onClick={handleCreateBooking}>
                            Confirm Intake & Print Barcode
                        </button>
                    </div>
                }
            >
                <form onSubmit={handleCreateBooking}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                        <div className="lab-form-group">
                            <label className="lab-label">Patient Legal Name *</label>
                            <input
                                type="text"
                                className="lab-input"
                                placeholder="e.g. Yashasvi Saini"
                                value={bookingForm.patientName}
                                onChange={(e) => setBookingForm({ ...bookingForm, patientName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="lab-form-group">
                            <label className="lab-label">Age *</label>
                            <input
                                type="number"
                                className="lab-input"
                                value={bookingForm.patientAge}
                                onChange={(e) => setBookingForm({ ...bookingForm, patientAge: e.target.value })}
                                required
                            />
                        </div>
                        <div className="lab-form-group">
                            <label className="lab-label">Gender</label>
                            <select
                                className="lab-select"
                                value={bookingForm.patientGender}
                                onChange={(e) => setBookingForm({ ...bookingForm, patientGender: e.target.value })}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="lab-form-group">
                            <label className="lab-label">Phone Number *</label>
                            <input
                                type="text"
                                className="lab-input"
                                placeholder="+91 98765 43210"
                                value={bookingForm.patientPhone}
                                onChange={(e) => setBookingForm({ ...bookingForm, patientPhone: e.target.value })}
                                required
                            />
                        </div>
                        <div className="lab-form-group">
                            <label className="lab-label">ABHA Health ID (Optional)</label>
                            <input
                                type="text"
                                className="lab-input"
                                placeholder="91-4521-8902-3341"
                                value={bookingForm.abhaId}
                                onChange={(e) => setBookingForm({ ...bookingForm, abhaId: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="lab-form-group">
                            <label className="lab-label">Referred by Physician</label>
                            <input
                                type="text"
                                className="lab-input"
                                placeholder="e.g. Dr. Aarav Sharma (Cardiologist)"
                                value={bookingForm.doctorName}
                                onChange={(e) => setBookingForm({ ...bookingForm, doctorName: e.target.value })}
                            />
                        </div>
                        <div className="lab-form-group">
                            <label className="lab-label">Sample Collection Mode</label>
                            <select
                                className="lab-select"
                                value={bookingForm.collectionType}
                                onChange={(e) => setBookingForm({ ...bookingForm, collectionType: e.target.value })}
                            >
                                <option value="Lab Visit">Lab Facility Visit</option>
                                <option value="Home Sample Collection">Home Phlebotomy Collection</option>
                            </select>
                        </div>
                    </div>

                    {/* Test Selection */}
                    <div className="lab-form-group">
                        <label className="lab-label">Select Diagnostic Tests *</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--lab-border)', padding: '0.65rem', borderRadius: 'var(--lab-radius-md)' }}>
                            {availableTests.map(t => (
                                <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={bookingForm.selectedTestIds.includes(t.id)}
                                        onChange={() => toggleTestSelection(t.id)}
                                    />
                                    <span>{t.name} (₹{t.price})</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Status Transition Modal */}
            <Modal
                isOpen={!!statusModalBooking}
                onClose={() => setStatusModalBooking(null)}
                title={`Advance Booking Workflow — ${statusModalBooking?.booking_reference}`}
                maxWidth={520}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
                        <button type="button" className="lab-btn lab-btn-outline" onClick={() => setStatusModalBooking(null)}>
                            Cancel
                        </button>
                        <button type="button" className="lab-btn lab-btn-primary" onClick={handleStatusTransition}>
                            Update Status & Record Audit
                        </button>
                    </div>
                }
            >
                <div>
                    <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                        <div>Patient: <strong>{statusModalBooking?.patient_name}</strong></div>
                        <div>Current Status: <span className="lab-badge lab-badge-teal">{statusModalBooking?.status}</span></div>
                    </div>

                    <div className="lab-form-group">
                        <label className="lab-label">Target Clinical Status</label>
                        <select
                            className="lab-select"
                            value={targetStatus}
                            onChange={(e) => setTargetStatus(e.target.value)}
                        >
                            <option value="BOOKED">BOOKED</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="SAMPLE_PENDING">SAMPLE_PENDING</option>
                            <option value="SAMPLE_COLLECTED">SAMPLE_COLLECTED</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="REPORT_PENDING_VERIFICATION">REPORT_PENDING_VERIFICATION</option>
                            <option value="REPORT_PUBLISHED">REPORT_PUBLISHED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </div>

                    <div className="lab-form-group">
                        <label className="lab-label">Clinical Transition Reason / Audit Note</label>
                        <input
                            type="text"
                            className="lab-input"
                            placeholder="e.g. Sample collected by phlebotomist, transport to lab"
                            value={transitionReason}
                            onChange={(e) => setTransitionReason(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};
