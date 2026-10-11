import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toasts, onDismiss }) => {
    if (!toasts || toasts.length === 0) return null;

    const icons = {
        success: <CheckCircle2 size={18} style={{ color: 'var(--lab-success)' }} />,
        error: <AlertCircle size={18} style={{ color: 'var(--lab-danger)' }} />,
        warning: <AlertTriangle size={18} style={{ color: 'var(--lab-warning)' }} />,
        info: <Info size={18} style={{ color: 'var(--lab-info)' }} />
    };

    return (
        <div className="lab-toast-container" aria-live="polite">
            {toasts.map(t => (
                <div key={t.id} className="lab-toast" role="alert">
                    <div>{icons[t.type] || icons.info}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--lab-text-main)' }}>
                            {t.title || (t.type === 'error' ? 'Notice' : 'Success')}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--lab-text-secondary)', marginTop: '0.15rem' }}>
                            {t.message}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => onDismiss(t.id)}
                        className="border-0 bg-transparent p-0 text-muted"
                        style={{ cursor: 'pointer', color: 'var(--lab-text-muted)' }}
                    >
                        <X size={15} />
                    </button>
                </div>
            ))}
        </div>
    );
};
