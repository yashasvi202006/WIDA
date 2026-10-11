import React, { useEffect } from 'react';
export const Toast = ({ toasts, onDismiss }) => {
    useEffect(() => {
        if (toasts.length > 0) {
            const timer = setTimeout(() => {
                onDismiss(toasts[0].id);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [toasts, onDismiss]);
    if (toasts.length === 0)
        return null;
    return (<div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 200,
            maxWidth: '380px',
        }}>
      {toasts.map((t) => (<div key={t.id} style={{
                backgroundColor: '#ffffff',
                border: `1px solid ${t.type === 'success'
                    ? '#10b981'
                    : t.type === 'error'
                        ? '#ef4444'
                        : '#0284c7'}`,
                borderLeft: `5px solid ${t.type === 'success'
                    ? '#10b981'
                    : t.type === 'error'
                        ? '#ef4444'
                        : '#0284c7'}`,
                borderRadius: 'var(--doc-radius)',
                padding: '12px 16px',
                boxShadow: 'var(--doc-shadow-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                fontSize: '13.5px',
                color: 'var(--doc-text-main)',
            }}>
          <span>{t.message}</span>
          <button type="button" style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                fontSize: '16px',
            }} onClick={() => onDismiss(t.id)}>
            &times;
          </button>
        </div>))}
    </div>);
};
