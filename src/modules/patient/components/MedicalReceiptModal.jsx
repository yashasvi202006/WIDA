import React, { useRef } from 'react';
import { X, Printer, ShieldCheck, Download, Award, CheckCircle2, Pill, ShoppingCart, Calendar, User, FileText } from 'lucide-react';

export const MedicalReceiptModal = ({ isOpen, onClose, prescription, patient, onOrderToPharmacy }) => {
    const printRef = useRef(null);

    if (!isOpen || !prescription) return null;

    const rxNum = prescription.prescriptionNumber || prescription.rxNumber || prescription.id || 'RX-2026-4821';
    const docName = prescription.doctorName || 'Dr. Aarav Sharma';
    const docSpecialty = prescription.doctorSpecialization || 'Cardiologist';
    const patientName = patient?.name || prescription.patientName || 'Yashasvi Saini';
    const patientAbha = patient?.abhaId || '91-5371-2563-7119';
    const prescriptionDate = prescription.prescriptionDate || prescription.date || new Date().toISOString().slice(0, 10);
    const medicines = prescription.items || prescription.medicines || [];

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="patient-modal-backdrop" style={{ zIndex: 1100, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)' }}>
            <div className="patient-modal-box" style={{ maxWidth: 760, width: '95%', maxHeight: '92vh', overflowY: 'auto', padding: 0, borderRadius: 16 }}>
                {/* Modal Toolbar (hidden during print) */}
                <div className="p-3 bg-light border-bottom d-flex align-items-center justify-content-between no-print" style={{ backgroundColor: '#f8fafc' }}>
                    <div className="d-flex align-items-center gap-2">
                        <FileText size={18} style={{ color: '#0d9488' }} />
                        <span className="fw-bold" style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                            Online Medical Receipt &amp; Official E-Prescription
                        </span>
                        <span className="badge" style={{ backgroundColor: '#ccfbf1', color: '#0f766e', fontSize: '0.72rem' }}>
                            ABDM Verified
                        </span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                            onClick={handlePrint}
                            style={{ fontSize: '0.8rem' }}
                        >
                            <Printer size={14} /> Print / Save PDF
                        </button>
                        {onOrderToPharmacy && !prescription.isSentToPharmacy && (
                            <button
                                type="button"
                                className="btn btn-sm text-white d-flex align-items-center gap-1"
                                style={{ backgroundColor: '#0d9488', fontSize: '0.8rem' }}
                                onClick={() => {
                                    onOrderToPharmacy(prescription.id);
                                    onClose();
                                }}
                            >
                                <ShoppingCart size={14} /> Order to Pharmacy
                            </button>
                        )}
                        <button
                            type="button"
                            className="btn btn-sm btn-light border-0"
                            onClick={onClose}
                            style={{ padding: '4px 8px' }}
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Printable Medical Receipt Content */}
                <div ref={printRef} className="p-4 p-md-5 bg-white position-relative" style={{ minHeight: 600 }}>
                    {/* Security Watermark Background */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) rotate(-30deg)',
                            fontSize: '4.5rem',
                            fontWeight: 900,
                            color: 'rgba(13, 148, 136, 0.04)',
                            pointerEvents: 'none',
                            whiteSpace: 'nowrap',
                            zIndex: 0
                        }}
                    >
                        WIDA CLINICAL RECORD
                    </div>

                    {/* Official Letterhead */}
                    <div className="border-bottom pb-3 mb-4 d-flex flex-wrap justify-content-between align-items-start gap-3 position-relative" style={{ borderColor: '#0d9488' }}>
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <div style={{ width: 34, height: 34, backgroundColor: '#0d9488', color: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                                    W
                                </div>
                                <h3 className="mb-0 font-heading" style={{ color: '#0f766e', fontSize: '1.35rem', fontWeight: 800 }}>
                                    WIDA HEALTHCARE NETWORK
                                </h3>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                Apex Heart, Vascular &amp; Multi-Speciality Clinical Centre
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                                Ring Road, Sector 5, New Delhi 110001 • NMC &amp; ABDM Accredited
                            </div>
                        </div>

                        <div className="text-md-end">
                            <span className="badge px-3 py-1 mb-1" style={{ backgroundColor: '#0f766e', color: '#fff', fontSize: '0.78rem', letterSpacing: '0.5px' }}>
                                DIGITAL MEDICAL RECEIPT
                            </span>
                            <div className="fw-bold" style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                                #{rxNum.toUpperCase()}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                                Date: <strong>{prescriptionDate}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Doctor & Patient Information Grid */}
                    <div className="row g-3 p-3 rounded mb-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.82rem' }}>
                        <div className="col-sm-6 border-end">
                            <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: '0.7rem' }}>
                                PRESCRIBING PRACTITIONER
                            </div>
                            <div className="fw-bold" style={{ fontSize: '0.98rem', color: '#0f172a' }}>
                                {docName}
                            </div>
                            <div className="text-muted">{docSpecialty} • MBBS, MD, FACC</div>
                            <div style={{ color: '#0d9488', fontSize: '0.76rem', fontWeight: 600 }}>
                                🆔 Reg #: NMC-2009-48291
                            </div>
                        </div>

                        <div className="col-sm-6 ps-sm-3">
                            <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: '0.7rem' }}>
                                PATIENT PARTICULARS
                            </div>
                            <div className="fw-bold" style={{ fontSize: '0.98rem', color: '#0f172a' }}>
                                {patientName}
                            </div>
                            <div className="text-muted">
                                Age: {patient?.age || 24} yrs • Gender: {patient?.gender || 'Male'} • Blood: {patient?.bloodGroup || 'B+'}
                            </div>
                            <div style={{ color: '#0f766e', fontSize: '0.76rem', fontWeight: 600 }}>
                                🆔 ABHA ID: {patientAbha}
                            </div>
                        </div>
                    </div>

                    {/* Clinical Encounter & Diagnosis */}
                    <div className="mb-4">
                        <div className="p-3 rounded border" style={{ backgroundColor: '#f0fdfa', borderColor: '#ccfbf1' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f766e', textTransform: 'uppercase' }}>
                                Primary Diagnosis &amp; Clinical Assessment
                            </div>
                            <div className="fw-bold text-dark mt-1" style={{ fontSize: '0.95rem' }}>
                                {prescription.diagnosis || 'Cardiovascular Follow-up & Treatment Plan'}
                            </div>
                            {prescription.instructions && (
                                <div className="text-muted mt-1" style={{ fontSize: '0.82rem' }}>
                                    <strong>Doctor's Notes:</strong> {prescription.instructions}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Prescribed Medications Table */}
                    <div className="mb-4">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <h6 className="mb-0 fw-bold" style={{ fontSize: '0.92rem', color: '#0f172a' }}>
                                ℞ Prescribed Medications &amp; Dosage Instructions
                            </h6>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                {medicines.length} Medication{medicines.length === 1 ? '' : 's'} Prescribed
                            </span>
                        </div>

                        <div className="table-responsive border rounded" style={{ borderColor: '#e2e8f0' }}>
                            <table className="table table-sm table-hover mb-0" style={{ fontSize: '0.82rem' }}>
                                <thead style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                                    <tr>
                                        <th style={{ width: '5%' }}>#</th>
                                        <th style={{ width: '35%' }}>Medicine &amp; Strength</th>
                                        <th style={{ width: '15%' }}>Dosage</th>
                                        <th style={{ width: '20%' }}>Frequency</th>
                                        <th style={{ width: '25%' }}>Instructions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicines.map((med, idx) => (
                                        <tr key={idx} style={{ verticalAlign: 'middle' }}>
                                            <td className="text-muted">{idx + 1}</td>
                                            <td>
                                                <strong style={{ color: '#0f172a' }}>{med.name || med.medicineName}</strong>
                                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                                    Duration: {med.duration || '7 Days'}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark border">
                                                    {med.dosage || 'Standard'}
                                                </span>
                                            </td>
                                            <td>{med.frequency || 'Once Daily'}</td>
                                            <td className="text-muted">{med.instructions || 'After meals with water'}</td>
                                        </tr>
                                    ))}
                                    {medicines.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-3 text-muted">
                                                No prescription items listed.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Financial Receipt & Fee Breakdown */}
                    <div className="p-3 rounded border mb-4" style={{ backgroundColor: '#fcfcfc', borderColor: '#e2e8f0' }}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="fw-bold" style={{ fontSize: '0.85rem', color: '#0f172a' }}>
                                Official Consultation Financial Receipt
                            </span>
                            <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.72rem' }}>
                                PAID IN FULL
                            </span>
                        </div>
                        <div className="d-flex justify-content-between py-1 border-bottom" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            <span>Specialist Consultation Fee</span>
                            <span>₹800.00</span>
                        </div>
                        <div className="d-flex justify-content-between py-1 border-bottom" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            <span>Digital Health Token &amp; ABDM Record Linking</span>
                            <span>₹0.00 (Waived)</span>
                        </div>
                        <div className="d-flex justify-content-between pt-2 fw-bold" style={{ fontSize: '0.9rem', color: '#0f172a' }}>
                            <span>Total Consultation Amount:</span>
                            <span style={{ color: '#0d9488' }}>₹800.00</span>
                        </div>
                        <div className="text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                            Payment Method: ABHA Digital Health UPI Gateway • Trans ID: TXN-WIDA-{Date.now().toString().slice(-6)}
                        </div>
                    </div>

                    {/* Legal Certification & Digital Sign-off */}
                    <div className="pt-3 border-top d-flex flex-wrap align-items-end justify-content-between gap-3" style={{ borderColor: '#e2e8f0' }}>
                        <div>
                            <div className="d-flex align-items-center gap-1 text-success mb-1" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                                <CheckCircle2 size={14} /> Digitally Signed &amp; ABDM Encrypted
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', maxWidth: 400, lineHeight: 1.4 }}>
                                This is a legally valid computer-generated Electronic Health Record under Section 65B of the Indian Evidence Act 1872 and the National Medical Commission (NMC) Telemedicine Practice Guidelines.
                            </div>
                        </div>

                        <div className="text-md-end">
                            <div style={{ fontFamily: 'cursive', fontSize: '1.25rem', color: '#0f766e', transform: 'rotate(-3deg)' }}>
                                {docName}
                            </div>
                            <div className="border-top pt-1 mt-1" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', borderColor: '#cbd5e1' }}>
                                Authorized Physician Signature
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                                Digital Timestamp: {new Date().toISOString().replace('T', ' ').slice(0, 19)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
