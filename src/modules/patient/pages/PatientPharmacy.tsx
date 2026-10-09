import React, { useState } from 'react';
import type { PatientPharmacyOrder, PatientPrescription } from '../types/patientTypes';
import { PharmacyOrderCard } from '../components/PharmacyOrderCard';
import { Store, Pill, Clock, ShoppingBag, ShieldCheck } from 'lucide-react';

interface PatientPharmacyProps {
  orders: PatientPharmacyOrder[];
  prescriptions: PatientPrescription[];
  onOrderPrescription: (prescriptionId: string) => void;
}

export const PatientPharmacy: React.FC<PatientPharmacyProps> = ({
  orders,
  prescriptions,
  onOrderPrescription
}) => {
  const [tab, setTab] = useState<'orders' | 'current' | 'refills'>('orders');

  return (
    <div className="patient-pharmacy d-flex flex-column gap-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h3 className="font-heading mb-1">Pharmacy & Prescription Fulfillment</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Direct prescription dispensing with licensed pharmacies, batch tracking, and refill automation
          </p>
        </div>

        <span className="patient-badge patient-badge-teal py-2 px-3">
          <ShieldCheck size={14} /> GPP Compliant Licensed Pharmacies
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="patient-card p-3 d-flex gap-2">
        <button
          className={`patient-btn ${tab === 'orders' ? 'patient-btn-primary' : 'patient-btn-outline'}`}
          onClick={() => setTab('orders')}
        >
          <ShoppingBag size={14} /> Orders & Track Deliveries ({orders.length})
        </button>
        <button
          className={`patient-btn ${tab === 'current' ? 'patient-btn-primary' : 'patient-btn-outline'}`}
          onClick={() => setTab('current')}
        >
          <Pill size={14} /> Current Active Courses
        </button>
        <button
          className={`patient-btn ${tab === 'refills' ? 'patient-btn-primary' : 'patient-btn-outline'}`}
          onClick={() => setTab('refills')}
        >
          <Clock size={14} /> Refill Reminders
        </button>
      </div>

      {/* Tab: Orders */}
      {tab === 'orders' && (
        <div className="d-flex flex-column gap-3">
          {orders.length === 0 ? (
            <div className="patient-card p-5 text-center text-muted">
              <Store size={44} className="mb-2 text-muted mx-auto" />
              <h5 className="font-heading">No active orders</h5>
              <p style={{ fontSize: '0.85rem' }}>Send a digital prescription to the pharmacy to begin fulfillment.</p>
            </div>
          ) : (
            orders.map((ord) => <PharmacyOrderCard key={ord.id} order={ord} />)
          )}
        </div>
      )}

      {/* Tab: Current Active Medicines */}
      {tab === 'current' && (
        <div className="row g-3">
          {prescriptions
            .filter((p) => p.status === 'Active')
            .flatMap((p) => p.medicines)
            .map((med) => (
              <div key={med.id} className="col-md-6 col-lg-4">
                <div className="patient-card p-3 h-100">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-bold font-heading" style={{ fontSize: '0.98rem' }}>{med.name}</span>
                    <span className="patient-badge patient-badge-teal">{med.dosage}</span>
                  </div>
                  <div className="text-muted mb-2" style={{ fontSize: '0.82rem' }}>
                    <Clock size={12} className="me-1" />
                    {med.frequency} • Duration: {med.duration}
                  </div>
                  <p className="text-muted mb-3" style={{ fontSize: '0.78rem' }}>
                    {med.instructions}
                  </p>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>Timing: {med.timing.join(', ')}</span>
                    <button
                      className="patient-btn patient-btn-outline patient-btn-sm"
                      onClick={() => onOrderPrescription('rx-201')}
                    >
                      Refill
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Tab: Refill Reminders */}
      {tab === 'refills' && (
        <div className="patient-card p-4">
          <h5 className="font-heading mb-3">Automated Prescription Refill Schedule</h5>
          <div className="p-3 rounded border mb-3" style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1 font-heading">Telmisartan 40mg (90-Day Supply)</h6>
                <div className="text-muted" style={{ fontSize: '0.82rem' }}>
                  Next refill projection: <strong>05 Jan 2027</strong> (82 days remaining)
                </div>
              </div>
              <span className="patient-badge patient-badge-success">Adequate Stock</span>
            </div>
          </div>

          <div className="p-3 rounded border" style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border)' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1 font-heading">Atorvastatin 10mg (90-Day Supply)</h6>
                <div className="text-muted" style={{ fontSize: '0.82rem' }}>
                  Next refill projection: <strong>05 Jan 2027</strong> (82 days remaining)
                </div>
              </div>
              <span className="patient-badge patient-badge-success">Adequate Stock</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
