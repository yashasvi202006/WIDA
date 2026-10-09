import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
export const NotificationBell = ({ notifications, unreadCount, onMarkAsRead, onMarkAllAsRead, onNavigateToNotifications }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (<div className="position-relative" ref={containerRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="patient-btn patient-btn-outline p-2 position-relative" style={{
            borderRadius: '50%',
            width: 40,
            height: 40,
            borderColor: 'var(--p-border)',
            color: 'var(--p-text-main)'
        }} aria-label={`Notifications, ${unreadCount} unread`}>
        <Bell size={18}/>
        {unreadCount > 0 && (<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{
                backgroundColor: 'var(--p-primary)',
                fontSize: '0.68rem',
                padding: '0.3em 0.55em'
            }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>)}
      </button>

      {isOpen && (<NotificationDropdown notifications={notifications} onMarkAsRead={onMarkAsRead} onMarkAllAsRead={onMarkAllAsRead} onViewAll={() => {
                setIsOpen(false);
                onNavigateToNotifications();
            }} onClose={() => setIsOpen(false)}/>)}
    </div>);
};
