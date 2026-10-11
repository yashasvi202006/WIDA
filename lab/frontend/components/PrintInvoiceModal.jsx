import React from 'react';
import { Modal } from './Modal.jsx';
import { Printer, CheckCircle2, Receipt } from 'lucide-react';

export const PrintInvoiceModal = ({ isOpen, onClose, invoice, lab }) => {
    if (!invoice) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Tax Invoice & Bill of Supply — ${invoice.invoice_number}`}
            maxWidth={760}
            footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.8rem' }}>
                        <Receipt size={16} style={{ color: 'var(--lab-primary)' }} />
                        <span>Official Hospital & Diagnostic Accounts Voucher</span>
                    </div>
                    <div className="d-flex gap-2">
                        <button type="button" className="lab-btn lab-btn-outline" onClick={onClose}>
                            Close
                        </button>
                        <button type="button" className="lab-btn lab-btn-primary" onClick={handlePrint}>
                            <Printer size={16} /> Print Official Invoice
                        </button>
                    </div>
                </div>
            }
        >
            <div className="printable-invoice" style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', color: '#172033', fontFamily: 'var(--lab-font-sans)' }}>
                {/* Header */}
                <div style={{ borderBottom: '2px solid var(--lab-primary)', paddingBottom: '1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lab-primary-dark)', marginBottom: '0.2rem' }}>
                            {lab?.name || 'HealthFirst Diagnostics & Pathology Labs'}
                        </h2>
                        <div style={{ fontSize: '0.8rem', color: 'var(--lab-text-secondary)', lineHeight: 1.4 }}>
                            {lab?.address || 'Plot B-12, Sector 62, Electronic City, Noida, UP - 201309'}<br />
                            GSTIN: 07AAACH0001Z1ZB | PAN: AAACH0001Z<br />
                            Email: billing@healthfirst.lab | Ph: +91 120 4455667
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--lab-text-main)', marginBottom: '0.2rem' }}>
                            TAX INVOICE
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--lab-text-secondary)' }}>
                            Invoice No: <strong style={{ color: 'var(--lab-primary-dark)' }}>{invoice.invoice_number}</strong><br />
                            Date: <strong>{invoice.invoice_date || new Date().toISOString().split('T')[0]}</strong><br />
                            Booking Ref: <strong>{invoice.booking_reference || invoice.booking_id}</strong>
                        </div>
                    </div>
                </div>

                {/* Patient / Bill To */}
                <div style={{ backgroundColor: 'var(--lab-surface-muted)', borderRadius: 'var(--lab-radius-md)', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <div>
                        <span style={{ color: 'var(--lab-text-secondary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>BILL TO PATIENT</span>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{invoice.patient_name}</div>
                        <span style={{ color: 'var(--lab-text-secondary)' }}>Patient ID: {invoice.booking?.patient_id || 'Registered WIDA Patient'}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ color: 'var(--lab-text-secondary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>PAYMENT STATUS</span>
                        <div style={{ marginTop: '0.2rem' }}>
                            <span className={`lab-badge ${invoice.payment_status === 'PAID' ? 'lab-badge-success' : 'lab-badge-warning'}`}>
                                {invoice.payment_status}
                            </span>
                        </div>
                        {invoice.payment_method && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--lab-text-secondary)', display: 'block', marginTop: '0.2rem' }}>
                                Method: {invoice.payment_method}
                            </span>
                        )}
                    </div>
                </div>

                {/* Itemized Table */}
                <div className="lab-table-container" style={{ marginBottom: '1.25rem' }}>
                    <table className="lab-table">
                        <thead>
                            <tr>
                                <th>Sl</th>
                                <th>Diagnostic Service Description</th>
                                <th>SAC Code</th>
                                <th>Unit Price</th>
                                <th>Qty</th>
                                <th style={{ textAlign: 'right' }}>Total (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(invoice.items && invoice.items.length > 0 ? invoice.items : [
                                { item_description: invoice.test_names || 'Comprehensive Diagnostic Investigation', unit_price: invoice.subtotal || invoice.total_amount, quantity: 1, total_price: invoice.subtotal || invoice.total_amount }
                            ]).map((item, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{item.item_description || item.desc}</td>
                                    <td style={{ color: 'var(--lab-text-secondary)', fontSize: '0.8rem' }}>999312</td>
                                    <td>₹{parseFloat(item.unit_price || item.price).toFixed(2)}</td>
                                    <td>{item.quantity || item.qty || 1}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{parseFloat(item.total_price || item.price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Breakdown */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                    <div style={{ width: 280, fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', color: 'var(--lab-text-secondary)' }}>
                            <span>Subtotal:</span>
                            <span>₹{parseFloat(invoice.subtotal).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', color: 'var(--lab-text-secondary)' }}>
                            <span>Healthcare GST (0% Exempt):</span>
                            <span>₹0.00</span>
                        </div>
                        {invoice.discount_amount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', color: 'var(--lab-success)' }}>
                                <span>Discount / Concession:</span>
                                <span>-₹{parseFloat(invoice.discount_amount).toFixed(2)}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderTop: '2px solid var(--lab-border)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--lab-primary-dark)' }}>
                            <span>Total Payable:</span>
                            <span>₹{parseFloat(invoice.total_amount).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', color: 'var(--lab-text-secondary)' }}>
                            <span>Amount Paid:</span>
                            <span>₹{parseFloat(invoice.amount_paid).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', fontWeight: 700, color: invoice.balance_due > 0 ? 'var(--lab-danger)' : 'var(--lab-success)' }}>
                            <span>Balance Due:</span>
                            <span>₹{parseFloat(invoice.balance_due).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Regulatory Note & Signature */}
                <div style={{ borderTop: '1px solid var(--lab-border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--lab-text-secondary)' }}>
                    <div>
                        <CheckCircle2 size={14} style={{ color: 'var(--lab-success)', display: 'inline', marginRight: '4px' }} />
                        Healthcare Services are exempt from GST under Notification No. 12/2017 - Central Tax (Rate).<br />
                        Computer generated bill. No physical signature required.
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <strong>Authorized Billing Signatory</strong><br />
                        HealthFirst Diagnostic Accounts Dept.
                    </div>
                </div>
            </div>
        </Modal>
    );
};
