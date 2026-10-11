import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = 680 }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="lab-modal-backdrop" onClick={onClose}>
            <div
                className="lab-modal-content"
                style={{ maxWidth: `${maxWidth}px` }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="lab-modal-header">
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--lab-text-main)' }}>
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="lab-btn lab-btn-outline lab-btn-sm"
                        style={{ padding: '0.35rem', borderRadius: '50%' }}
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="lab-modal-body">
                    {children}
                </div>
                {footer && (
                    <div className="lab-modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
