import React, { useState, useEffect } from 'react';
import { labApiClient } from '../services/labApiClient.js';
import { Modal } from '../components/Modal.jsx';
import { PrintInvoiceModal } from '../components/PrintInvoiceModal.jsx';
import {
    Receipt,
    Search,
    CreditCard,
    Printer,
    IndianRupee,
    CheckCircle2,
    Clock,
    DollarSign
} from 'lucide-react';

export const BillingManagement = ({ lab, onShowToast }) => {
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Print Modal
    const [printInvoice, setPrintInvoice] = useState(null);

    // Payment Modal
    const [paymentModalInvoice, setPaymentModalInvoice] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [amountToPay, setAmountToPay] = useState('');
    const [transactionRef, setTransactionRef] = useState('');

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const data = await labApiClient.getInvoices();
            setInvoices(data.invoices || []);
        } catch (err) {
            onShowToast?.('error', 'Failed to load invoices: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleOpenPayment = (inv) => {
        setPaymentModalInvoice(inv);
        setAmountToPay(inv.balance_due || inv.total_amount);
        setTransactionRef('TXN-' + Math.floor(100000 + Math.random() * 900000));
    };

    const handleRecordPayment = async () => {
        if (!paymentModalInvoice) return;
        try {
            await labApiClient.recordInvoicePayment(paymentModalInvoice.id, {
                paymentMethod,
                transactionReference: transactionRef,
                amountPaid: parseFloat(amountToPay)
            });
            onShowToast?.('success', `Payment of ₹${amountToPay} recorded for ${paymentModalInvoice.invoice_number}`);
            setPaymentModalInvoice(null);
            fetchInvoices();
        } catch (err) {
            onShowToast?.('error', 'Failed to record payment: ' + err.message);
        }
    };

    const filteredInvoices = invoices.filter(i =>
        i.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.booking_reference?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalCollected = invoices.reduce((sum, i) => sum + (parseFloat(i.amount_paid) || 0), 0);
    const totalOutstanding = invoices.reduce((sum, i) => sum + (parseFloat(i.balance_due) || 0), 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header & Financial Metrics */}
            <div className="lab-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lab-text-main)', margin: 0 }}>
                            Billing, Invoices & Diagnostic Accounts
                        </h2>
                        <span style={{ fontSize: '0.82rem', color: 'var(--lab-text-secondary)' }}>
                            Decimal-safe payment tracking, itemized bills, and official accounts receipts
                        </span>
                    </div>

                    <div style={{ position: 'relative', minWidth: '260px' }}>
                        <input
                            type="text"
                            className="lab-input"
                            style={{ paddingLeft: '2.4rem', height: '36px', fontSize: '0.84rem' }}
                            placeholder="Search invoice number, patient..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--lab-text-muted)' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--lab-border)' }}>
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--lab-radius-md)', backgroundColor: 'var(--lab-success-subtle)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857' }}>TOTAL COLLECTED</span>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#047857' }}>
                            ₹{totalCollected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    <div style={{ padding: '0.75rem', borderRadius: 'var(--lab-radius-md)', backgroundColor: 'var(--lab-warning-subtle)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309' }}>OUTSTANDING BALANCE</span>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#B45309' }}>
                            ₹{totalOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    <div style={{ padding: '0.75rem', borderRadius: 'var(--lab-radius-md)', backgroundColor: 'var(--lab-primary-subtle)', border: '1px solid rgba(13, 148, 136, 0.2)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lab-primary-dark)' }}>TAX STATUS</span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--lab-primary-dark)', marginTop: '0.2rem' }}>
                            0% Healthcare GST Exempt
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="lab-card">
                <div className="lab-table-container">
                    <table className="lab-table">
                        <thead>
                            <tr>
                                <th>Invoice Number / Date</th>
                                <th>Patient Name</th>
                                <th>Booking Reference</th>
                                <th>Total Amount</th>
                                <th>Paid</th>
                                <th>Balance Due</th>
                                <th>Payment Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--lab-text-secondary)' }}>
                                        No billing invoices found.
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map(inv => (
                                    <tr key={inv.id}>
                                        <td>
                                            <div style={{ fontWeight: 700, fontFamily: 'var(--lab-font-mono)', color: 'var(--lab-primary-dark)' }}>
                                                {inv.invoice_number}
                                            </div>
                                            <div style={{ fontSize: '0.74rem', color: 'var(--lab-text-secondary)' }}>
                                                {inv.invoice_date}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{inv.patient_name}</div>
                                        </td>
                                        <td style={{ fontSize: '0.82rem', fontFamily: 'var(--lab-font-mono)' }}>
                                            {inv.booking_reference || inv.booking_id}
                                        </td>
                                        <td style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                                            ₹{parseFloat(inv.total_amount).toFixed(2)}
                                        </td>
                                        <td style={{ color: 'var(--lab-success)', fontWeight: 700 }}>
                                            ₹{parseFloat(inv.amount_paid).toFixed(2)}
                                        </td>
                                        <td style={{ fontWeight: 700, color: inv.balance_due > 0 ? 'var(--lab-danger)' : 'var(--lab-text-secondary)' }}>
                                            ₹{parseFloat(inv.balance_due).toFixed(2)}
                                        </td>
                                        <td>
                                            <span className={`lab-badge ${
                                                inv.payment_status === 'PAID' ? 'lab-badge-success' :
                                                inv.payment_status === 'PARTIALLY_PAID' ? 'lab-badge-teal' : 'lab-badge-warning'
                                            }`} style={{ fontSize: '0.68rem' }}>
                                                {inv.payment_status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                                                <button
                                                    type="button"
                                                    className="lab-btn lab-btn-outline lab-btn-sm"
                                                    onClick={() => setPrintInvoice(inv)}
                                                    title="Print itemized invoice"
                                                >
                                                    <Printer size={13} />
                                                </button>
                                                {inv.balance_due > 0 && (
                                                    <button
                                                        type="button"
                                                        className="lab-btn lab-btn-primary lab-btn-sm"
                                                        onClick={() => handleOpenPayment(inv)}
                                                    >
                                                        <CreditCard size={13} /> Collect
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

            {/* Collect Payment Modal */}
            <Modal
                isOpen={!!paymentModalInvoice}
                onClose={() => setPaymentModalInvoice(null)}
                title={`Record Payment for ${paymentModalInvoice?.invoice_number}`}
                maxWidth={480}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
                        <button type="button" className="lab-btn lab-btn-outline" onClick={() => setPaymentModalInvoice(null)}>
                            Cancel
                        </button>
                        <button type="button" className="lab-btn lab-btn-primary" onClick={handleRecordPayment}>
                            Confirm Payment & Issue Receipt
                        </button>
                    </div>
                }
            >
                <div>
                    <div style={{ backgroundColor: 'var(--lab-surface-muted)', padding: '0.85rem', borderRadius: 'var(--lab-radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                        <div>Patient: <strong>{paymentModalInvoice?.patient_name}</strong></div>
                        <div>Total Amount: <strong>₹{paymentModalInvoice?.total_amount}</strong></div>
                        <div style={{ color: 'var(--lab-danger)', fontWeight: 700 }}>
                            Balance Due: ₹{paymentModalInvoice?.balance_due}
                        </div>
                    </div>

                    <div className="lab-form-group">
                        <label className="lab-label">Payment Mode</label>
                        <select
                            className="lab-select"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                            <option value="Credit / Debit Card">Credit / Debit Card (POS Terminal)</option>
                            <option value="Cash">Cash at Reception Desk</option>
                            <option value="NetBanking">NetBanking / NEFT</option>
                            <option value="Corporate / Ayushman Bharat">Ayushman Bharat / TPA Insurance</option>
                        </select>
                    </div>

                    <div className="lab-form-group">
                        <label className="lab-label">Amount to Collect (₹) *</label>
                        <input
                            type="number"
                            step="0.01"
                            min="1"
                            className="lab-input"
                            value={amountToPay}
                            onChange={(e) => setAmountToPay(e.target.value)}
                            required
                        />
                    </div>

                    <div className="lab-form-group">
                        <label className="lab-label">Transaction / UTR Reference ID</label>
                        <input
                            type="text"
                            className="lab-input"
                            value={transactionRef}
                            onChange={(e) => setTransactionRef(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>

            {/* Print Modal */}
            <PrintInvoiceModal
                isOpen={!!printInvoice}
                onClose={() => setPrintInvoice(null)}
                invoice={printInvoice}
                lab={lab}
            />
        </div>
    );
};
