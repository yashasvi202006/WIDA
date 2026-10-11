import React, { useEffect } from 'react';
export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md', }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return (<div className="doc-modal-overlay" onClick={onClose}>
      <div className={`doc-modal ${size === 'lg' ? 'modal-lg' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="doc-modal-header">
          <h2>{title}</h2>
          <button type="button" className="doc-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="doc-modal-body">{children}</div>

        {footer && <div className="doc-modal-footer">{footer}</div>}
      </div>
    </div>);
};
