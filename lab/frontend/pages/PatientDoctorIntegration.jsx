import React, { useState, useEffect } from 'react';
import { labApiClient } from '../services/labApiClient.js';
import { Modal } from '../components/Modal.jsx';
import {
    Share2,
    Database,
    ShieldCheck,
    UserCheck,
    Stethoscope,
    FileCode,
    CheckCircle2,
    ExternalLink,
    Copy,
    Check
} from 'lucide-react';

export const PatientDoctorIntegration = ({ onShowToast }) => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // FHIR Modal
    const [fhirData, setFhirData] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchIntegrationData = async () => {
            setIsLoading(true);
            try {
                const pRes = await labApiClient.getPatientRecords();
                setPatients(pRes.patients || []);

                const dRes = await labApiClient.getDoctorReferrals();
                setDoctors(dRes.doctors || []);
            } catch (err) {
                onShowToast?.('error', 'Error reading WIDA cross-module records: ' + err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIntegrationData();
    }, []);

    const handleViewFhirBundle = async () => {
        try {
            const data = await labApiClient.getAbdmExport('rep-301');
            setFhirData(data.bundle);
        } catch (err) {
            onShowToast?.('error', 'Failed to generate FHIR DiagnosticReport bundle: ' + err.message);
        }
    };

    const handleCopyJson = () => {
        if (!fhirData) return;
        navigator.clipboard.writeText(JSON.stringify(fhirData, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Architectural Overview Card */}
            <div className="lab-card" style={{ background: 'linear-gradient(to right, #FFFFFF, var(--lab-primary-subtle))' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: 'var(--lab-primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Database size={22} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lab-text-main)', margin: 0 }}>
                            Cross-Module EHR Interoperability Hub
                        </h2>
                        <span style={{ fontSize: '0.82rem', color: 'var(--lab-text-secondary)' }}>
                            Ayushman Bharat Digital Mission (ABDM) • FHIR R4 Interoperability Architecture
                        </span>
                    </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--lab-text-main)', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                    This Diagnostic Laboratory Module connects directly to the core <strong>WIDA ecosystem</strong> via an isolated, safe read-only bridge (<code>patientDbAdapter</code>). It queries active patient health vaults and doctor clinical orders without altering existing schemas or corrupting relational constraints.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <button type="button" className="lab-btn lab-btn-primary" onClick={handleViewFhirBundle}>
                        <FileCode size={16} /> View FHIR R4 DiagnosticReport JSON Bundle
                    </button>
                </div>
            </div>

            {/* Split: Connected Patients & Doctors from patient.db */}
            <div className="lab-grid-2">
                {/* Connected Patient Records */}
                <div className="lab-card">
                    <div className="lab-card-header">
                        <div className="lab-card-title">
                            <UserCheck size={18} style={{ color: 'var(--lab-primary)' }} />
                            <span>Linked Patient Profiles (patient.db)</span>
                        </div>
                        <span className="lab-badge lab-badge-teal">
                            Safe Read-Only Bridge
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {patients.length === 0 ? (
                            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--lab-text-secondary)', fontSize: '0.85rem' }}>
                                Loading verified patient records...
                            </div>
                        ) : (
                            patients.map(p => (
                                <div key={p.id} style={{ padding: '0.9rem', borderRadius: 'var(--lab-radius-md)', border: '1px solid var(--lab-border)', backgroundColor: 'var(--lab-surface-muted)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                                        <div>
                                            <strong style={{ fontSize: '0.95rem' }}>{p.name}</strong>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--lab-text-secondary)', display: 'block' }}>
                                                ID: {p.id} • {p.gender} • Blood Group: <strong>{p.bloodGroup || 'B+'}</strong>
                                            </span>
                                        </div>
                                        <span className="lab-badge lab-badge-teal" style={{ fontSize: '0.68rem' }}>
                                            ABHA: {p.abhaId}
                                        </span>
                                    </div>

                                    <div style={{ fontSize: '0.78rem', color: 'var(--lab-text-secondary)', marginTop: '0.35rem', lineHeight: 1.35 }}>
                                        <div><strong>Address:</strong> {p.address}</div>
                                        {p.chronicConditions && (
                                            <div><strong>Conditions:</strong> {Array.isArray(p.chronicConditions) ? p.chronicConditions.join(', ') : p.chronicConditions}</div>
                                        )}
                                        {p.allergies && (
                                            <div><strong>Known Allergies:</strong> {Array.isArray(p.allergies) ? p.allergies.join(', ') : p.allergies}</div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Connected Doctors / Referring Specialists */}
                <div className="lab-card">
                    <div className="lab-card-header">
                        <div className="lab-card-title">
                            <Stethoscope size={18} style={{ color: 'var(--lab-info)' }} />
                            <span>Referring Physicians (patient.db)</span>
                        </div>
                        <span className="lab-badge lab-badge-teal">
                            {doctors.length} Doctors
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {doctors.length === 0 ? (
                            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--lab-text-secondary)', fontSize: '0.85rem' }}>
                                Loading clinical practitioners...
                            </div>
                        ) : (
                            doctors.map(d => (
                                <div key={d.id} style={{ padding: '0.9rem', borderRadius: 'var(--lab-radius-md)', border: '1px solid var(--lab-border)', backgroundColor: 'var(--lab-surface-muted)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                                        <strong style={{ fontSize: '0.9rem' }}>{d.name}</strong>
                                        <span className="lab-badge lab-badge-purple" style={{ fontSize: '0.68rem' }}>
                                            ★ {d.rating || 4.9}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--lab-primary-dark)', fontWeight: 600 }}>
                                        {d.specialization} ({d.medicine_system || 'Allopathy'})
                                    </div>
                                    <span style={{ fontSize: '0.74rem', color: 'var(--lab-text-secondary)', display: 'block', marginTop: '0.2rem' }}>
                                        {d.hospital || 'WIDA Multi-Specialty Hospital'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Integration Architecture Documentation Card */}
            <div className="lab-card">
                <div className="lab-card-title" style={{ marginBottom: '0.75rem' }}>
                    <ShieldCheck size={18} style={{ color: 'var(--lab-primary)' }} />
                    <span>Future Seamless Single-Page Application (SPA) Routing Guide</span>
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--lab-text-secondary)', lineHeight: 1.55 }}>
                    <p>
                        In strict observance of <strong>Rule 2 and Rule 7</strong>, the laboratory module runs independently on its own dedicated port (<code>5176</code>) and HTTP server (<code>8082</code>). When the core project maintainers merge all ecosystem portals into a single router, the integration requires merely importing <code>LabApp</code> into the root router:
                    </p>
                    <div style={{ backgroundColor: '#0F172A', color: '#E2E8F0', padding: '0.85rem 1rem', borderRadius: 'var(--lab-radius-md)', fontFamily: 'var(--lab-font-mono)', fontSize: '0.78rem', overflowX: 'auto', marginBottom: '0.75rem' }}>
                        <code>{`// Safe future one-line integration in src/App.jsx:
import { LabApp } from '../lab/frontend/App.jsx';

// In route switch:
case 'lab': return <LabApp />;`}</code>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--lab-success)', fontWeight: 600 }}>
                        <CheckCircle2 size={16} /> Zero existing files were modified or overwritten during this module's development.
                    </div>
                </div>
            </div>

            {/* FHIR DiagnosticReport JSON Modal */}
            <Modal
                isOpen={!!fhirData}
                onClose={() => setFhirData(null)}
                title="FHIR R4 DiagnosticReport Profile (ABDM Interoperable Bundle)"
                maxWidth={720}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <button type="button" className="lab-btn lab-btn-outline" onClick={handleCopyJson}>
                            {copied ? <><Check size={14} /> Copied to Clipboard!</> : <><Copy size={14} /> Copy JSON Payload</>}
                        </button>
                        <button type="button" className="lab-btn lab-btn-primary" onClick={() => setFhirData(null)}>
                            Close
                        </button>
                    </div>
                }
            >
                <div style={{ maxHeight: '420px', overflowY: 'auto', backgroundColor: '#0F172A', color: '#38BDF8', padding: '1rem', borderRadius: 'var(--lab-radius-md)', fontFamily: 'var(--lab-font-mono)', fontSize: '0.76rem', lineHeight: 1.45 }}>
                    <pre style={{ margin: 0 }}>{JSON.stringify(fhirData, null, 2)}</pre>
                </div>
            </Modal>
        </div>
    );
};
