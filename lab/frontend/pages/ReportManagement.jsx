import React, { useState, useEffect } from 'react';
import { labApiClient } from '../services/labApiClient.js';
import { Modal } from '../components/Modal.jsx';
import { PrintReportModal } from '../components/PrintReportModal.jsx';
import {
    FileCheck2,
    ShieldCheck,
    Printer,
    Edit3,
    Check,
    AlertCircle,
    Send,
    Award,
    Clock,
    Lock,
    RotateCcw
} from 'lucide-react';

export const ReportManagement = ({ user, lab, onShowToast }) => {
    const [reports, setReports] = useState([]);
    const [activeFilter, setActiveFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Selected Report for Print / Full View
    const [printReport, setPrintReport] = useState(null);

    // Edit Parameters Modal
    const [editingReport, setEditingReport] = useState(null);
    const [editParams, setEditParams] = useState([]);
    const [editConclusion, setEditConclusion] = useState('');

    // Amendment Modal
    const [amendingReport, setAmendingReport] = useState(null);
    const [amendmentReason, setAmendmentReason] = useState('');
    const [revisedConclusion, setRevisedConclusion] = useState('');

    const isAuthorizedSignatory = user?.role === 'PATHOLOGIST' || user?.role === 'LAB_DIRECTOR';

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const data = await labApiClient.getReports(activeFilter);
            setReports(data.reports || []);
        } catch (err) {
            onShowToast?.('error', 'Failed to load diagnostic reports: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [activeFilter]);

    const handleOpenEdit = (report) => {
        if (report.status === 'PUBLISHED') {
            onShowToast?.('warning', 'Published reports are legally locked. Use the Amendment tool to issue a traceable revision.');
            return;
        }

        setEditingReport(report);
        setEditParams(report.parameters && report.parameters.length > 0 ? report.parameters.map(p => ({
            name: p.parameter_name,
            value: p.observed_value,
            unit: p.unit,
            referenceRange: p.reference_range,
            status: p.status
        })) : [
            { name: 'Primary Diagnostic Marker', value: '', unit: 'mg/dL', referenceRange: '0 - 100', status: 'NORMAL' }
        ]);
        setEditConclusion(report.clinical_interpretation || '');
    };

    const handleSaveResults = async (submitForVerification = false) => {
        if (!editingReport) return;
        try {
            await labApiClient.saveReportResults(editingReport.id, editParams, editConclusion, submitForVerification);
            onShowToast?.('success', submitForVerification ? 'Report submitted for Pathologist verification sign-off' : 'Parameters saved to draft');
            setEditingReport(null);
            fetchReports();
        } catch (err) {
            onShowToast?.('error', 'Error saving report: ' + err.message);
        }
    };

    const handleVerifyReport = async (reportId) => {
        if (!isAuthorizedSignatory) {
            onShowToast?.('error', 'Security Violation: Only a Consultant Pathologist or Lab Director can sign verification certificates.');
            return;
        }

        try {
            await labApiClient.verifyReport(reportId);
            onShowToast?.('success', 'Report verified and signed by Consultant Pathologist');
            fetchReports();
        } catch (err) {
            onShowToast?.('error', 'Verification rejected: ' + err.message);
        }
    };

    const handlePublishReport = async (reportId) => {
        if (!isAuthorizedSignatory) {
            onShowToast?.('error', 'Security Violation: Only a Consultant Pathologist can publish certified diagnostic reports.');
            return;
        }

        try {
            await labApiClient.publishReport(reportId);
            onShowToast?.('success', 'Report PUBLISHED! Synchronized to WIDA Patient Vault and Ordering Doctor.');
            fetchReports();
        } catch (err) {
            onShowToast?.('error', 'Publication rejected: ' + err.message);
        }
    };

    const handleIssueAmendment = async () => {
        if (!amendingReport || !amendmentReason.trim()) {
            onShowToast?.('error', 'Clinical amendment reason is mandatory');
            return;
        }

        try {
            const res = await labApiClient.amendReport(amendingReport.id, amendmentReason, revisedConclusion);
            onShowToast?.('success', `Traceable amendment issued: Version ${res.amendmentVersion}`);
            setAmendingReport(null);
            setAmendmentReason('');
            fetchReports();
        } catch (err) {
            onShowToast?.('error', 'Failed to issue amendment: ' + err.message);
        }
    };

    const updateParamValue = (index, newValue) => {
        const next = [...editParams];
        next[index].value = newValue;
        setEditParams(next);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header and Controls */}
            <div className="lab-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lab-text-main)', margin: 0 }}>
                            Diagnostic Reports & Pathologist Verification
                        </h2>
                        <span style={{ fontSize: '0.82rem', color: 'var(--lab-text-secondary)' }}>
                            Digital sign-offs, NABL compliance certificates, and versioned clinical amendments
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={`lab-badge ${isAuthorizedSignatory ? 'lab-badge-teal' : 'lab-badge-warning'}`}>
                            {isAuthorizedSignatory ? 'Signatory Authority Active' : 'Technician Mode (Entry Only)'}
                        </span>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {[
                        { id: '', label: 'All Reports' },
                        { id: 'PENDING_VERIFICATION', label: 'Pending Verification' },
                        { id: 'VERIFIED', label: 'Verified (Ready to Publish)' },
                        { id: 'PUBLISHED', label: 'Published' },
                        { id: 'DRAFT', label: 'Drafts' }
                    ].map(f => (
                        <button
                            key={f.id}
                            type="button"
                            className={`lab-btn lab-btn-sm ${activeFilter === f.id ? 'lab-btn-primary' : 'lab-btn-outline'}`}
                            onClick={() => setActiveFilter(f.id)}
                            style={{ fontSize: '0.78rem' }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reports List */}
            <div className="lab-card">
                <div className="lab-table-container">
                    <table className="lab-table">
                        <thead>
                            <tr>
                                <th>Report No / Date</th>
                                <th>Patient Name</th>
                                <th>Diagnostic Investigation</th>
                                <th>Referring Physician</th>
                                <th>Verification Status</th>
                                <th>Version</th>
                                <th style={{ textAlign: 'right' }}>Clinical Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--lab-text-secondary)' }}>
                                        No diagnostic reports found.
                                    </td>
                                </tr>
                            ) : (
                                reports.map(r => (
                                    <tr key={r.id}>
                                        <td>
                                            <div style={{ fontWeight: 700, fontFamily: 'var(--lab-font-mono)', color: 'var(--lab-primary-dark)' }}>
                                                {r.report_number}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--lab-text-secondary)' }}>
                                                Reported: {r.reporting_date}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.patient_name}</div>
                                            <span style={{ fontSize: '0.74rem', color: 'var(--lab-text-secondary)' }}>
                                                {r.patient_age}y / {r.patient_gender} • ABHA: {r.abha_id || '91-4521-8902-3341'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.test_name}</div>
                                            <div style={{ fontSize: '0.74rem', color: 'var(--lab-text-secondary)' }}>
                                                {r.parameters?.length || 0} biomarkers analyzed
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.82rem', color: 'var(--lab-text-secondary)' }}>
                                            {r.doctor_name || 'Dr. Aarav Sharma'}
                                        </td>
                                        <td>
                                            <span className={`lab-badge ${
                                                r.status === 'PUBLISHED' ? 'lab-badge-success' :
                                                r.status === 'VERIFIED' ? 'lab-badge-teal' :
                                                r.status === 'PENDING_VERIFICATION' ? 'lab-badge-danger' : 'lab-badge-warning'
                                            }`} style={{ fontSize: '0.68rem' }}>
                                                {r.status.replace(/_/g, ' ')}
                                            </span>
                                            {r.is_verified ? (
                                                <div style={{ fontSize: '0.7rem', color: 'var(--lab-success)', marginTop: '0.2rem', fontWeight: 600 }}>
                                                    ✓ Certified by Pathologist
                                                </div>
                                            ) : (
                                                <div style={{ fontSize: '0.7rem', color: '#B91C1C', marginTop: '0.2rem' }}>
                                                    ⚠ Unverified
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--lab-font-mono)', backgroundColor: 'var(--lab-surface-muted)', padding: '0.2rem 0.4rem', borderRadius: '4px', border: '1px solid var(--lab-border)' }}>
                                                v{r.amendment_version || 1}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                                                {/* View / Print */}
                                                <button
                                                    type="button"
                                                    className="lab-btn lab-btn-outline lab-btn-sm"
                                                    onClick={() => setPrintReport(r)}
                                                    title="View and Print Clinical Report"
                                                >
                                                    <Printer size={13} />
                                                </button>

                                                {/* Edit Parameters (Only if not published) */}
                                                {r.status !== 'PUBLISHED' && (
                                                    <button
                                                        type="button"
                                                        className="lab-btn lab-btn-outline lab-btn-sm"
                                                        onClick={() => handleOpenEdit(r)}
                                                        title="Enter or edit parameter results"
                                                    >
                                                        <Edit3 size={13} />
                                                    </button>
                                                )}

                                                {/* Verify Button (Pathologist only) */}
                                                {!r.is_verified && isAuthorizedSignatory && (
                                                    <button
                                                        type="button"
                                                        className="lab-btn lab-btn-primary lab-btn-sm"
                                                        onClick={() => handleVerifyReport(r.id)}
                                                        style={{ backgroundColor: 'var(--lab-primary-dark)' }}
                                                        title="Verify and stamp with digital signature"
                                                    >
                                                        <ShieldCheck size={13} /> Verify
                                                    </button>
                                                )}

                                                {/* Publish Button (Pathologist only, if verified or pending) */}
                                                {r.status !== 'PUBLISHED' && isAuthorizedSignatory && (
                                                    <button
                                                        type="button"
                                                        className="lab-btn lab-btn-primary lab-btn-sm"
                                                        onClick={() => handlePublishReport(r.id)}
                                                        title="Publish to Patient and Doctor EHR"
                                                    >
                                                        <Send size={13} /> Publish
                                                    </button>
                                                )}

                                                {/* Amend Button (For published reports) */}
                                                {r.status === 'PUBLISHED' && isAuthorizedSignatory && (
                                                    <button
                                                        type="button"
                                                        className="lab-btn lab-btn-outline lab-btn-sm"
                                                        style={{ color: '#B45309', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                                                        onClick={() => {
                                                            setAmendingReport(r);
                                                            setRevisedConclusion(r.clinical_interpretation || '');
                                                        }}
                                                        title="Issue formal clinical amendment"
                                                    >
                                                        <RotateCcw size={13} /> Amend
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Parameters Modal */}
            <Modal
                isOpen={!!editingReport}
                onClose={() => setEditingReport(null)}
                title={`Enter Clinical Test Parameters — ${editingReport?.test_name}`}
                maxWidth={720}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <button type="button" className="lab-btn lab-btn-outline" onClick={() => setEditingReport(null)}>
                            Cancel
                        </button>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="button" className="lab-btn lab-btn-outline" onClick={() => handleSaveResults(false)}>
                                Save Draft
                            </button>
                            <button type="button" className="lab-btn lab-btn-primary" onClick={() => handleSaveResults(true)}>
                                Submit for Pathologist Sign-off
                            </button>
                        </div>
                    </div>
                }
            >
                <div>
                    <div style={{ backgroundColor: 'var(--lab-surface-muted)', padding: '0.85rem', borderRadius: 'var(--lab-radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                        <div>Patient: <strong>{editingReport?.patient_name}</strong></div>
                        <div>Barcode: <strong style={{ fontFamily: 'var(--lab-font-mono)' }}>{editingReport?.sample_id}</strong></div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label className="lab-label">Observed Biomarker Parameters</label>
                        <div className="lab-table-container">
                            <table className="lab-table">
                                <thead>
                                    <tr>
                                        <th>Parameter</th>
                                        <th>Observed Value</th>
                                        <th>Unit</th>
                                        <th>Biological Reference Interval</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {editParams.map((p, idx) => (
                                        <tr key={idx}>
                                            <td style={{ fontWeight: 600 }}>{p.name}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="lab-input"
                                                    style={{ padding: '0.35rem 0.5rem', width: '110px', height: '32px', fontWeight: 700 }}
                                                    value={p.value}
                                                    onChange={(e) => updateParamValue(idx, e.target.value)}
                                                    placeholder="e.g. 15.2"
                                                />
                                            </td>
                                            <td style={{ color: 'var(--lab-text-secondary)', fontSize: '0.8rem' }}>{p.unit}</td>
                                            <td style={{ color: 'var(--lab-text-secondary)', fontSize: '0.8rem' }}>{p.referenceRange}</td>
                                            <td>
                                                <select
                                                    className="lab-select"
                                                    style={{ padding: '0.2rem 0.4rem', height: '30px', fontSize: '0.75rem' }}
                                                    value={p.status}
                                                    onChange={(e) => {
                                                        const next = [...editParams];
                                                        next[idx].status = e.target.value;
                                                        setEditParams(next);
                                                    }}
                                                >
                                                    <option value="NORMAL">NORMAL</option>
                                                    <option value="ELEVATED">ELEVATED</option>
                                                    <option value="LOW">LOW</option>
                                                    <option value="CRITICAL">CRITICAL</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="lab-form-group">
                        <label className="lab-label">Pathological Interpretation & Opinion</label>
                        <textarea
                            rows={3}
                            className="lab-textarea"
                            placeholder="Enter clinical impression and pathological interpretation..."
                            value={editConclusion}
                            onChange={(e) => setEditConclusion(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>

            {/* Issue Amendment Modal */}
            <Modal
                isOpen={!!amendingReport}
                onClose={() => setAmendingReport(null)}
                title={`Issue Formal Clinical Amendment — ${amendingReport?.report_number}`}
                maxWidth={560}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
                        <button type="button" className="lab-btn lab-btn-outline" onClick={() => setAmendingReport(null)}>
                            Cancel
                        </button>
                        <button type="button" className="lab-btn lab-btn-primary" onClick={handleIssueAmendment}>
                            Publish Version {(amendingReport?.amendment_version || 1) + 1}
                        </button>
                    </div>
                }
            >
                <div>
                    <div style={{ backgroundColor: 'var(--lab-warning-subtle)', padding: '0.85rem', borderRadius: 'var(--lab-radius-md)', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#B45309' }}>
                        In compliance with NABL ISO 15189 regulations, published records cannot be overwritten. A versioned amendment preserves all prior records in the audit log.
                    </div>

                    <div className="lab-form-group">
                        <label className="lab-label">Regulatory Amendment Reason *</label>
                        <input
                            type="text"
                            className="lab-input"
                            placeholder="e.g. Dilution re-assay run confirmed updated lipid fraction"
                            value={amendmentReason}
                            onChange={(e) => setAmendmentReason(e.target.value)}
                            required
                        />
                    </div>

                    <div className="lab-form-group">
                        <label className="lab-label">Revised Pathological Opinion</label>
                        <textarea
                            rows={3}
                            className="lab-textarea"
                            value={revisedConclusion}
                            onChange={(e) => setRevisedConclusion(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>

            {/* Print Friendly Report Modal */}
            <PrintReportModal
                isOpen={!!printReport}
                onClose={() => setPrintReport(null)}
                report={printReport}
                lab={lab}
            />
        </div>
    );
};
