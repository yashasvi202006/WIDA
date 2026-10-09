import React from 'react';
import { Pill, CheckCircle2, Truck } from 'lucide-react';
export const PharmacyOrderCard = ({ order }) => {
    const steps = ['Prescription received', 'Verification', 'Processing', 'Ready', 'Delivered'];
    const currentIndex = steps.indexOf(order.status);
    return (<div className="patient-card patient-card-hover p-4 mb-3">
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: 'var(--p-border-subtle)' }}>
        <div className="d-flex align-items-center gap-3">
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--p-radius-md)',
            backgroundColor: 'var(--p-primary-subtle)',
            color: 'var(--p-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Pill size={22}/>
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h6 className="mb-0 font-heading" style={{ fontSize: '1rem' }}>Order #{order.id}</h6>
              <span className="patient-badge patient-badge-teal">{order.status}</span>
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--p-text-muted)' }}>
              Fulfilled by {order.pharmacyName} • {order.date}
            </span>
          </div>
        </div>
        <div className="text-end">
          <span style={{ fontSize: '0.78rem', color: 'var(--p-text-muted)' }}>Total Amount</span>
          <div className="fw-bold text-success" style={{ fontSize: '1.05rem' }}>₹{order.totalAmount}</div>
        </div>
      </div>

      {/* Workflow Tracker */}
      <div className="p-3 rounded mb-3" style={{ backgroundColor: 'var(--p-surface-alt)', border: '1px solid var(--p-border-subtle)' }}>
        <div className="d-flex align-items-center justify-content-between" style={{ fontSize: '0.78rem' }}>
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            return (<div key={step} className="d-flex flex-column align-items-center text-center flex-fill">
                <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? 'var(--p-primary)' : 'var(--p-border)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    marginBottom: 4
                }}>
                  {isCompleted ? <CheckCircle2 size={12}/> : idx + 1}
                </div>
                <span style={{
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? 'var(--p-primary-dark)' : 'var(--p-text-muted)'
                }}>
                  {step}
                </span>
              </div>);
        })}
        </div>
      </div>

      <div className="mb-2">
        <h6 style={{ fontSize: '0.85rem' }} className="fw-bold mb-2">Medications in Order:</h6>
        <div className="d-flex flex-column gap-1">
          {order.medicines.map((m, idx) => (<div key={idx} className="d-flex justify-content-between text-muted" style={{ fontSize: '0.8rem' }}>
              <span>{m.name} ({m.quantity})</span>
              <span className="fw-semibold">₹{m.price}</span>
            </div>))}
        </div>
      </div>

      <div className="pt-2 border-top d-flex justify-content-between align-items-center" style={{ borderColor: 'var(--p-border-subtle)', fontSize: '0.78rem' }}>
        <span className="text-muted d-flex align-items-center gap-1">
          <Truck size={14}/> {order.deliveryType}
        </span>
        <span className="text-muted">{order.estimatedReadyTime}</span>
      </div>
    </div>);
};
