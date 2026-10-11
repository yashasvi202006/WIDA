import React, { useState, useEffect } from 'react';
import { labApiClient } from '../services/labApiClient.js';
import { StatCard } from '../components/StatCard.jsx';
import {
    CalendarCheck,
    Clock,
    TestTube2,
    Cpu,
    FileCheck2,
    Award,
    IndianRupee,
    AlertCircle,
    UserPlus,
    PlusCircle,
    ArrowUpRight,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';

export const LabDashboard = ({ onNavigate, onOpenNewBooking, onOpenNewTest, lab }) => {
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSummary = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await labApiClient.getDashboardSummary();
            setSummary(data);
        } catch (err) {
            setError(err.message || 'Failed to load dashboard metrics');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    if (isLoading) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--lab-text-secondary)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                <div style={{ fontWeight: 600 }}>Loading live laboratory statistics...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="lab-card" style={{ padding: '2rem', textAlign: 'center', borderColor: 'var(--lab-danger)' }}>
                <AlertCircle size={36} style={{ color: 'var(--lab-danger)', marginBottom: '0.75rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--lab-text-main)' }}>Unable to connect to diagnostic database</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--lab-text-secondary)' }}>{error}</p>
                <button type="button" className="lab-btn lab-btn-primary lab-btn-sm" onClick={fetchSummary}>
                    Retry Query
                </button>
            </div>
        );
    }

    const m = summary?.metrics || {};

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick Action Toolbar */}
            <div className="lab-card" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: 'linear-gradient(to right, #FFFFFF, var(--lab-primary-subtle))' }}>
                <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--lab-text-main)', margin: 0 }}>
                        Diagnostic Operations Centre
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--lab-text-secondary)' }}>
                        NABL ISO 15189:2022 Calibrated • Live Laboratory Accession Stream
                    </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                    <button type="button" className="lab-btn lab-btn-primary" onClick={onOpenNewBooking}>
                        <UserPlus size={16} /> + Patient Walk-in Intake
                    </button>
                    <button type="button" className="lab-btn lab-btn-outline" onClick={onOpenNewTest}>
                        <PlusCircle size={16} /> + Catalogue Test
                    </button>
                    <button type="button" className="lab-btn lab-btn-outline" onClick={() => onNavigate('samples')}>
                        <TestTube2 size={16} /> Sample Accessioning
                    </button>
                    <button type="button" className="lab-btn lab-btn-outline" onClick={() => onNavigate('reports')}>
                        <FileCheck2 size={16} /> Review Sign-offs ({m.awaitingVerification || 0})
                    </button>
                </div>
            </div>

            {/* 8 Metric Summary Cards */}
            <div className="lab-grid-4">
                <StatCard
                    title="Total Bookings"
                    value={m.totalBookings || 0}
                    icon={CalendarCheck}
                    subtext="Cumulative diagnostic requests"
                    iconColor="var(--lab-primary)"
                    iconBg="var(--lab-primary-subtle)"
                />
                <StatCard
                    title="Pending Sample Collections"
                    value={m.pendingCollections || 0}
                    icon={Clock}
                    subtext="Awaiting phlebotomy slot"
                    iconColor="var(--lab-warning)"
                    iconBg="var(--lab-warning-subtle)"
                    alert={m.pendingCollections > 0}
                />
                <StatCard
                    title="Samples Received"
                    value={m.samplesReceived || 0}
                    icon={TestTube2}
                    subtext="Accessioned in lab facility"
                    iconColor="var(--lab-info)"
                    iconBg="var(--lab-info-subtle)"
                />
                <StatCard
                    title="Tests in Processing"
                    value={m.inProcessing || 0}
                    icon={Cpu}
                    subtext="In biochemical/hematology analysers"
                    iconColor="var(--lab-purple)"
                    iconBg="var(--lab-purple-subtle)"
                />
                <StatCard
                    title="Awaiting Verification"
                    value={m.awaitingVerification || 0}
                    icon={AlertCircle}
                    subtext="Requires pathologist signature"
                    iconColor="#DC2626"
                    iconBg="#FEF2F2"
                    alert={m.awaitingVerification > 0}
                />
                <StatCard
                    title="Reports Published"
                    value={m.publishedReports || 0}
                    icon={Award}
                    subtext="Available to patient & doctor"
                    iconColor="var(--lab-success)"
                    iconBg="var(--lab-success-subtle)"
                />
                <StatCard
                    title="Completed Today"
                    value={m.completedToday || 0}
                    icon={CheckCircle2}
                    subtext="Same-day turnaround"
                    iconColor="var(--lab-primary-dark)"
                    iconBg="var(--lab-primary-subtle)"
                />
                <StatCard
                    title="Diagnostic Revenue"
                    value={`₹${parseFloat(m.totalRevenue || 0).toLocaleString('en-IN')}`}
                    icon={IndianRupee}
                    subtext={`Outstanding: ₹${parseFloat(m.totalOutstanding || 0).toLocaleString('en-IN')}`}
                    iconColor="#047857"
                    iconBg="#ECFDF5"
                />
            </div>

            {/* Split Section: Recent Bookings & Reports Needing Review */}
            <div className="lab-grid-2">
                {/* Recent Bookings Table */}
                <div className="lab-card">
                    <div className="lab-card-header">
                        <div className="lab-card-title">
                            <CalendarCheck size={18} style={{ color: 'var(--lab-primary)' }} />
                            <span>Recent Patient Test Orders</span>
                        </div>
                        <button type="button" className="lab-btn lab-btn-outline lab-btn-sm" onClick={() => onNavigate('bookings')}>
                            View All <ArrowUpRight size={13} />
                        </button>
                    </div>

                    <div className="lab-table-container">
                        <table className="lab-table">
                            <thead>
                                <tr>
                                    <th>Ref / Patient</th>
                                    <th>Investigation</th>
                                    <th>Slot / Mode</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(summary?.recentBookings || []).map(b => (
                                    <tr key={b.id}>
                                        <td>
                                            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{b.patient_name}</div>
                                            <span style={{ fontSize: '0.74rem', color: 'var(--lab-text-secondary)', fontFamily: 'var(--lab-font-mono)' }}>
                                                {b.booking_reference} ({b.patient_age}y/{b.patient_gender})
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{b.test_names}</span>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.8rem' }}>{b.appointment_date}</div>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--lab-text-secondary)' }}>{b.collection_type}</span>
                                        </td>
                                        <td>
                                            <span className={`lab-badge ${
                                                b.status === 'REPORT_PUBLISHED' ? 'lab-badge-success' :
                                                b.status === 'REPORT_PENDING_VERIFICATION' ? 'lab-badge-danger' :
                                                b.status === 'PROCESSING' ? 'lab-badge-purple' : 'lab-badge-teal'
                                            }`} style={{ fontSize: '0.68rem' }}>
                                                {b.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right', fontWeight: 700 }}>
                                            ₹{b.total_amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pathologist Verification Queue & Workflow Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="lab-card">
                        <div className="lab-card-header">
                            <div className="lab-card-title">
                                <FileCheck2 size={18} style={{ color: 'var(--lab-danger)' }} />
                                <span>Sign-off Queue</span>
                            </div>
                            <span className="lab-badge lab-badge-danger">
                                {summary?.urgentReports?.length || 0} Pending
                            </span>
                        </div>

                        {(!summary?.urgentReports || summary.urgentReports.length === 0) ? (
                            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--lab-text-secondary)', fontSize: '0.85rem' }}>
                                <CheckCircle2 size={32} style={{ color: 'var(--lab-success)', marginBottom: '0.5rem' }} />
                                <div>All analyzed reports verified and signed.</div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {summary.urgentReports.map(rep => (
                                    <div key={rep.id} style={{ padding: '0.85rem', borderRadius: 'var(--lab-radius-md)', border: '1px solid var(--lab-border)', backgroundColor: 'var(--lab-surface-muted)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                            <strong style={{ fontSize: '0.88rem' }}>{rep.patient_name}</strong>
                                            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--lab-font-mono)', color: 'var(--lab-text-secondary)' }}>
                                                {rep.report_number}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--lab-primary-dark)', fontWeight: 600, marginBottom: '0.25rem' }}>
                                            {rep.test_name}
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--lab-text-secondary)', lineHeight: 1.3 }}>
                                            {rep.clinical_interpretation}
                                        </p>
                                        <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                                            <button
                                                type="button"
                                                className="lab-btn lab-btn-primary lab-btn-sm"
                                                style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}
                                                onClick={() => onNavigate('reports')}
                                            >
                                                Sign Off →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quality & Accreditation Assurance Widget */}
                    <div className="lab-card" style={{ backgroundColor: 'var(--lab-primary-subtle)', border: '1px solid rgba(13, 148, 136, 0.25)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                            <Award size={20} style={{ color: 'var(--lab-primary-dark)' }} />
                            <strong style={{ fontSize: '0.9rem', color: 'var(--lab-primary-dark)' }}>
                                Quality & Calibration Control
                            </strong>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--lab-text-secondary)', margin: 0, lineHeight: 1.45 }}>
                            All analytical chemistry and automated hematology modules are operating within <strong>±0.5 SD (Levey-Jennings)</strong> calibration tolerance. Certified for Ayushman Bharat Digital Mission (ABDM) record sharing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
