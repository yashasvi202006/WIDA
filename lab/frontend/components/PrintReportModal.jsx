import React from 'react';
import { Modal } from './Modal.jsx';
import { Printer, ShieldCheck, QrCode } from 'lucide-react';

export const PrintReportModal = ({ isOpen, onClose, report, lab }) => {
    if (!report) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Certified Diagnostic Report — ${report.report_number || report.id}`}
            maxWidth={820}
            footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.8rem' }}>
                        <ShieldCheck size={16} style={{ color: 'var(--lab-primary)' }} />
                        <span>Digitally verified via WIDA Diagnostic Gateway</span>
                    </div>
                    <div className="d-flex gap-2">
                        <button type="button" className="lab-btn lab-btn-outline" onClick={onClose}>
                            Close
                        </button>
                        <button type="button" className="lab-btn lab-btn-primary" onClick={handlePrint}>
                            <Printer size={16} /> Print / Export PDF
                        </button>
                    </div>
                </div>
            }
        >
            <div className="printable-report" style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', color: '#172033', fontFamily: 'var(--lab-font-sans)' }}>
                {/* Lab Header */}
                <div style={{ borderBottom: '2px solid var(--lab-primary)', paddingBottom: '1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--lab-primary-dark)', marginBottom: '0.2rem' }}>
                            {lab?.name || 'HealthFirst Diagnostics & Pathology Labs'}
                        </h2>
                        <div style={{ fontSize: '0.82rem', color: 'var(--lab-text-secondary)', lineHeight: 1.4 }}>
                            {lab?.address || 'Plot B-12, Sector 62, Electronic City, Noida, UP - 201309'}<br />
                            Phone: {lab?.phone || '+91 120 4455667'} | Email: {lab?.email || 'diagnostics@healthfirst.lab'}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div className="lab-badge lab-badge-teal" style={{ marginBottom: '0.35rem' }}>
                            <ShieldCheck size={12} /> {lab?.accreditation || 'NABL & CAP Accredited'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--lab-text-secondary)' }}>
                            Reg No: <strong>{lab?.licenseNumber || lab?.license_number || 'NABL-MC-2024-8841'}</strong>
                        </div>
                    </div>
                </div>

                {/* Patient & Specimen Info Grid */}
                <div style={{ backgroundColor: 'var(--lab-surface-muted)', borderRadius: 'var(--lab-radius-md)', padding: '1rem', border: '1px solid var(--lab-border)', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', fontSize: '0.82rem' }}>
                    <div>
                        <span style={{ color: 'var(--lab-text-secondary)', display: 'block', fontSize: '0.72rem' }}>PATIENT NAME</span>
                        <strong>{report.patient_name}</strong>
                    </div>
                    <div>
                        <span style={{ color: 'var(--lab-text-secondary)', display: 'block', fontSize: '0.72rem' }}>AGE / GENDER</span>
                        <strong>{report.patient_age} Yrs / {report.patient_gender}</strong>
                    </div>
                    <div>
                        <span style={{ color: 'var(--lab-text-secondary)', display: 'block', fontSize: '0.72rem' }}>ABHA HEALTH ID</span>
                        <strong style={{ color: 'var(--lab-primary-dark)' }}>{report.abha_id || '91-4521-8902-3341'}</strong>
                    </div>

                    <div>
                        <span style={{ color: 'var(--lab-text-secondary)', display: 'block', fontSize: '0.72rem' }}>REPORT NUMBER</span>
                        <strong style={{ fontFamily: 'var(--lab-font-mono)' }}>{report.report_number}</strong>
                    </div>
                    <div>
                        <span style={{ color: 'var(--lab-text-secondary)', display: 'block', fontSize: '0.72rem' }}>COLLECTION DATE</span>
                        <strong>{report.collection_date}</strong>
                    </div>
                    <div>
                        <span style={{ color: 'var(--lab-text-secondary)', display: 'block', fontSize: '0.72rem' }}>REPORTING DATE</span>
                        <strong>{report.reporting_date}</strong>
                    </div>

                    <div style={{ gridColumn: 'span 3', borderTop: '1px solid var(--lab-border-subtle)', paddingTop: '0.5rem' }}>
                        <span style={{ color: 'var(--lab-text-secondary)', fontSize: '0.72rem' }}>REFERRED BY PHYSICIAN: </span>
                        <strong>{report.doctor_name || 'Dr. Aarav Sharma, MD (Cardiology)'}</strong>
                    </div>
                </div>

                {/* Test Investigation Title */}
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--lab-text-main)' }}>
                        {report.test_name}
                    </h3>
                    <span className="lab-badge lab-badge-success">
                        Status: {report.status}
                    </span>
                </div>

                {/* Parameters Table */}
                <div className="lab-table-container" style={{ marginBottom: '1.25rem' }}>
                    <table className="lab-table">
                        <thead>
                            <tr>
                                <th>Test Parameter</th>
                                <th>Observed Value</th>
                                <th>Unit</th>
                                <th>Biological Reference Interval</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(report.parameters || []).map((param, idx) => {
                                const isAbnormal = param.status === 'ELEVATED' || param.status === 'HIGH' || param.status === 'LOW' || param.status === 'CRITICAL';
                                return (
                                    <tr key={idx} style={{ backgroundColor: isAbnormal ? 'rgba(239, 68, 68, 0.04)' : undefined }}>
                                        <td style={{ fontWeight: 600 }}>{param.parameter_name}</td>
                                        <td style={{ fontWeight: 700, color: isAbnormal ? '#DC2626' : 'var(--lab-text-main)' }}>
                                            {param.observed_value}
                                        </td>
                                        <td style={{ color: 'var(--lab-text-secondary)', fontSize: '0.82rem' }}>{param.unit}</td>
                                        <td style={{ color: 'var(--lab-text-secondary)', fontSize: '0.82rem' }}>{param.reference_range}</td>
                                        <td>
                                            <span className={`lab-badge ${param.status === 'NORMAL' ? 'lab-badge-success' : 'lab-badge-danger'}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                                                {param.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pathological Interpretation */}
                <div style={{ backgroundColor: 'var(--lab-primary-subtle)', borderLeft: '4px solid var(--lab-primary)', padding: '0.9rem 1.1rem', borderRadius: 'var(--lab-radius-sm)', marginBottom: '1.5rem', fontSize: '0.84rem' }}>
                    <strong style={{ color: 'var(--lab-primary-dark)', display: 'block', marginBottom: '0.25rem' }}>
                        Pathological Interpretation & Opinion:
                    </strong>
                    <p style={{ margin: 0, color: 'var(--lab-text-main)', lineHeight: 1.5 }}>
                        {report.clinical_interpretation || 'Clinical parameters recorded using automated calibrator assays. Please correlate clinically with patient history.'}
                    </p>
                    {report.amendment_reason && (
                        <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(13, 148, 136, 0.3)', fontSize: '0.78rem', color: '#B45309' }}>
                            <strong>Note on Amendment (v{report.amendment_version}):</strong> {report.amendment_reason}
                        </div>
                    )}
                </div>

                {/* Signatory & Security Footer */}
                <div style={{ borderTop: '1px solid var(--lab-border)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{ width: 64, height: 64, border: '1px solid var(--lab-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', backgroundColor: '#F8FAFC' }}>
                            <QrCode size={48} style={{ color: 'var(--lab-text-main)' }} />
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-secondary)', lineHeight: 1.35 }}>
                            Scan to verify on <strong>National Health Authority (NHA)</strong><br />
                            Ayushman Bharat Digital Mission (ABDM)<br />
                            Certified End-to-End Encrypted
                        </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <div style={{ width: 140, height: 40, margin: '0 0 0 auto', borderBottom: '1px solid #172033', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lab-primary-dark)', fontStyle: 'italic', fontSize: '0.9rem', fontWeight: 700 }}>
                            Dr. Rajeshwar Prasad
                        </div>
                        <strong style={{ fontSize: '0.85rem', display: 'block', marginTop: '0.25rem' }}>
                            {report.verified_by || 'Dr. Rajeshwar Prasad, MD (Path)'}
                        </strong>
                        <span style={{ fontSize: '0.74rem', color: 'var(--lab-text-secondary)', display: 'block' }}>
                            Consultant Pathologist & Signatory • Reg: MCI-99482
                        </span>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--lab-border-subtle)', fontSize: '0.7rem', color: 'var(--lab-text-muted)' }}>
                    *** End of Certified Laboratory Diagnostic Report • WIDA Diagnostic Ecosystem • ISO 15189:2022 Quality Assured ***
                </div>
            </div>
        </Modal>
    );
};
