import React, { useState, useEffect } from 'react';
import { labApiClient } from '../services/labApiClient.js';
import { Modal } from '../components/Modal.jsx';
import {
    TestTube2,
    Barcode,
    AlertTriangle,
    CheckCircle,
    Cpu,
    UserCheck,
    Search,
    RefreshCw
} from 'lucide-react';

export const SampleManagement = ({ onShowToast }) => {
    const [samples, setSamples] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Sample Status Update Modal
    const [selectedSample, setSelectedSample] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [assignedAnalyzer, setAssignedAnalyzer] = useState('Roche Cobas 6000 #CH-01');

    // Reject Modal
    const [rejectSampleModal, setRejectSampleModal] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('Specimen Hemolyzed (Gross hemolysis interfering with spectrophotometry)');

    const fetchSamples = async () => {
        setIsLoading(true);
        try {
            const data = await labApiClient.getSamples();
            setSamples(data.samples || []);
        } catch (err) {
            onShowToast?.('error', 'Failed to load samples: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSamples();
    }, []);

    const handleUpdateSampleStatus = async () => {
        if (!selectedSample || !newStatus) return;
        try {
            await labApiClient.updateSampleStatus(selectedSample.id, newStatus, assignedAnalyzer);
            onShowToast?.('success', `Sample ${selectedSample.sample_barcode} status updated to ${newStatus}`);
            setSelectedSample(null);
            fetchSamples();
        } catch (err) {
            onShowToast?.('error', 'Error updating sample: ' + err.message);
        }
    };

    const handleRejectSample = async () => {
        if (!rejectSampleModal || !rejectionReason) return;
        try {
            await labApiClient.rejectSample(rejectSampleModal.id, rejectionReason);
            onShowToast?.('warning', `Sample ${rejectSampleModal.sample_barcode} marked REJECTED. Redraw notification dispatched.`);
            setRejectSampleModal(null);
            fetchSamples();
        } catch (err) {
            onShowToast?.('error', 'Failed to reject sample: ' + err.message);
        }
    };

    const filteredSamples = samples.filter(s =>
        s.sample_barcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.test_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header and Controls */}
            <div className="lab-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lab-text-main)', margin: 0 }}>
                            Specimen Accessioning & Analyzer Processing
                        </h2>
                        <span style={{ fontSize: '0.82rem', color: 'var(--lab-text-secondary)' }}>
                            2D Barcode verification, sample condition diagnostics, and analyzer tracking
                        </span>
                    </div>

                    <div style={{ position: 'relative', minWidth: '260px' }}>
                        <input
                            type="text"
                            className="lab-input"
                            style={{ paddingLeft: '2.4rem', height: '36px', fontSize: '0.84rem' }}
                            placeholder="Scan or enter barcode / patient..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)' }} />
                    </div>
                </div>

                {/* Analytical Quality Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--lab-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: 'var(--lab-primary-subtle)', color: 'var(--lab-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Barcode size={18} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--lab-text-secondary)' }}>ACTIVE SAMPLES</div>
                            <strong style={{ fontSize: '1.1rem' }}>{samples.length} Accessioned</strong>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: 'var(--lab-purple-subtle)', color: 'var(--lab-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Cpu size={18} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--lab-text-secondary)' }}>ANALYZER WORKLIST</div>
                            <strong style={{ fontSize: '1.1rem' }}>Roche Cobas & Sysmex</strong>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: 'var(--lab-success-subtle)', color: 'var(--lab-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle size={18} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--lab-text-secondary)' }}>ACCEPTANCE RATE</div>
                            <strong style={{ fontSize: '1.1rem' }}>98.4% Quality OK</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Samples Table */}
            <div className="lab-card">
                <div className="lab-table-container">
                    <table className="lab-table">
                        <thead>
                            <tr>
                                <th>Barcode / Specimen ID</th>
                                <th>Patient Name</th>
                                <th>Investigation</th>
                                <th>Tube & Specimen Type</th>
                                <th>Condition</th>
                                <th>Processing Status</th>
                                <th>Analyzer / Tech</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSamples.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--lab-text-secondary)' }}>
                                        No laboratory samples accessioned.
                                    </td>
                                </tr>
                            ) : (
                                filteredSamples.map(s => {
                                    const isPurple = s.tube_color?.toLowerCase().includes('purple');
                                    const isGold = s.tube_color?.toLowerCase().includes('gold') || s.tube_color?.toLowerCase().includes('yellow');
                                    return (
                                        <tr key={s.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <Barcode size={16} style={{ color: 'var(--lab-text-muted)' }} />
                                                    <strong style={{ fontFamily: 'var(--lab-font-mono)', color: 'var(--lab-text-main)', fontSize: '0.86rem' }}>
                                                        {s.sample_barcode}
                                                    </strong>
                                                </div>
                                                <span style={{ fontSize: '0.72rem', color: 'var(--lab-text-secondary)' }}>
                                                    Ref: {s.booking_reference}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{s.patient_name}</div>
                                            </td>
                                            <td>
                                                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{s.test_name}</span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <div style={{
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: '50%',
                                                        backgroundColor: isPurple ? '#9333EA' : isGold ? '#EAB308' : '#EF4444'
                                                    }} />
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{s.tube_color}</span>
                                                </div>
                                                <span style={{ fontSize: '0.72rem', color: 'var(--lab-text-secondary)' }}>
                                                    {s.sample_type}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`lab-badge ${s.condition === 'ACCEPTED' ? 'lab-badge-success' : 'lab-badge-danger'}`} style={{ fontSize: '0.68rem' }}>
                                                    {s.condition}
                                                </span>
                                                {s.rejection_reason && (
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--lab-danger)', marginTop: '0.2rem', maxWidth: '160px', lineHeight: 1.2 }}>
                                                        {s.rejection_reason}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`lab-badge ${
                                                    s.processing_status === 'RESULTS_ENTERED' ? 'lab-badge-success' :
                                                    s.processing_status === 'IN_PROCESSING' ? 'lab-badge-purple' : 'lab-badge-teal'
                                                }`} style={{ fontSize: '0.68rem' }}>
                                                    {s.processing_status.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                                                    {s.analyzer_id || 'Awaiting Batch'}
                                                </div>
                                                <span style={{ fontSize: '0.72rem', color: 'var(--lab-text-secondary)' }}>
                                                    {s.assigned_technician || 'Technician Queue'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                                                    <button
                                                        type="button"
                                                        className="lab-btn lab-btn-outline lab-btn-sm"
                                                        onClick={() => {
                                                            setSelectedSample(s);
                                                            setNewStatus(s.processing_status);
                                                        }}
                                                    >
                                                        Advance
                                                    </button>
                                                    {s.condition !== 'REJECTED' && (
                                                        <button
                                                            type="button"
                                                            className="lab-btn lab-btn-outline lab-btn-sm"
                                                            style={{ color: 'var(--lab-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                                            onClick={() => setRejectSampleModal(s)}
                                                            title="Reject sample if clotted or hemolyzed"
                                                        >
                                                            Reject
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Advance Status Modal */}
            <Modal
                isOpen={!!selectedSample}
                onClose={() => setSelectedSample(null)}
                title={`Advance Sample Processing — ${selectedSample?.sample_barcode}`}
                maxWidth={500}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
                        <button type="button" className="lab-btn lab-btn-outline" onClick={() => setSelectedSample(null)}>
                            Cancel
                        </button>
                        <button type="button" className="lab-btn lab-btn-primary" onClick={handleUpdateSampleStatus}>
                            Update Processing Stage
                        </button>
                    </div>
                }
            >
                <div>
                    <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                        <div>Patient: <strong>{selectedSample?.patient_name}</strong></div>
                        <div>Investigation: <strong>{selectedSample?.test_name}</strong></div>
                    </div>

                    <div className="lab-form-group">
                        <label className="lab-label">Processing Stage</label>
                        <select
                            className="lab-select"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            <option value="ACCESSIONED">ACCESSIONED (Sample Received)</option>
                            <option value="IN_PROCESSING">IN_PROCESSING (Loaded in Analyzer)</option>
                            <option value="ANALYSER_COMPLETE">ANALYSER_COMPLETE (Raw Optical Data Ready)</option>
                            <option value="RESULTS_ENTERED">RESULTS_ENTERED (Values Transcribed)</option>
                        </select>
                    </div>

                    <div className="lab-form-group">
                        <label className="lab-label">Assigned Analytical Equipment / Analyzer</label>
                        <select
                            className="lab-select"
                            value={assignedAnalyzer}
                            onChange={(e) => setAssignedAnalyzer(e.target.value)}
                        >
                            <option value="Roche Cobas 6000 #CH-01">Roche Cobas 6000 #CH-01 (Biochemistry)</option>
                            <option value="Sysmex XN-1000 #HM-02">Sysmex XN-1000 #HM-02 (Hematology)</option>
                            <option value="Beckman Coulter AU480 #CH-03">Beckman Coulter AU480 #CH-03 (Immunoassays)</option>
                            <option value="Cobas e411 #IM-01">Roche Cobas e411 #IM-01 (Endocrinology / Vit D)</option>
                        </select>
                    </div>
                </div>
            </Modal>

            {/* Rejection Modal */}
            <Modal
                isOpen={!!rejectSampleModal}
                onClose={() => setRejectSampleModal(null)}
                title={`Reject Specimen — ${rejectSampleModal?.sample_barcode}`}
                maxWidth={500}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
                        <button type="button" className="lab-btn lab-btn-outline" onClick={() => setRejectSampleModal(null)}>
                            Cancel
                        </button>
                        <button type="button" className="lab-btn lab-btn-danger" onClick={handleRejectSample}>
                            Confirm Rejection & Dispatch Redraw
                        </button>
                    </div>
                }
            >
                <div>
                    <div style={{ backgroundColor: 'var(--lab-danger-subtle)', padding: '0.85rem', borderRadius: 'var(--lab-radius-md)', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '1rem', fontSize: '0.82rem', color: '#B91C1C' }}>
                        <AlertTriangle size={16} style={{ display: 'inline', marginRight: '5px' }} />
                        Rejection invalidates this physical tube and automatically registers an urgent phlebotomy redraw request for <strong>{rejectSampleModal?.patient_name}</strong>.
                    </div>

                    <div className="lab-form-group">
                        <label className="lab-label">Clinical Rejection Reason *</label>
                        <select
                            className="lab-select"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        >
                            <option value="Specimen Hemolyzed (Gross hemolysis interfering with spectrophotometry)">
                                Specimen Hemolyzed (Red cell lysis)
                            </option>
                            <option value="Specimen Clotted (Micro-clots in EDTA anticoagulated whole blood)">
                                Specimen Clotted (Micro-clots in whole blood)
                            </option>
                            <option value="Quantity Not Sufficient (QNS - Insufficient volume for duplicate run)">
                                Quantity Not Sufficient (QNS)
                            </option>
                            <option value="Lipemic Specimen (Turbid serum exceeding interference limits)">
                                Lipemic Specimen (Severe turbidity)
                            </option>
                            <option value="Improper Container / Incorrect Anticoagulant Tube">
                                Incorrect Anticoagulant Tube
                            </option>
                        </select>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
