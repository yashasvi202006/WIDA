import React from 'react';
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="text-success" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-warning" />;
      case 'danger':
        return <AlertCircle size={18} className="text-danger" />;
      default:
        return <Info size={18} style={{ color: 'var(--p-primary)' }} />;
    }
  };

  return (
    <div className="patient-toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className="patient-toast-item">
          <div>{getIcon(toast.type)}</div>
          <div className="flex-fill" style={{ fontSize: '0.85rem' }}>
            <div className="fw-bold" style={{ color: 'var(--p-text-main)' }}>{toast.title}</div>
            <div style={{ color: 'var(--p-text-muted)', fontSize: '0.78rem' }}>{toast.message}</div>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="border-0 bg-transparent text-muted p-0"
            style={{ cursor: 'pointer' }}
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
};
