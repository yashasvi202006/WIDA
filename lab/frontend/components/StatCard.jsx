import React from 'react';

export const StatCard = ({ title, value, icon: Icon, subtext, iconColor = 'var(--lab-primary)', iconBg = 'var(--lab-primary-subtle)', alert = false }) => {
    return (
        <div className={`lab-stat-card ${alert ? 'border-warning' : ''}`}>
            <div className="lab-stat-header">
                <span className="lab-stat-label">{title}</span>
                <div className="lab-stat-icon" style={{ backgroundColor: iconBg, color: iconColor }}>
                    {Icon && <Icon size={20} />}
                </div>
            </div>
            <div>
                <div className="lab-stat-value">{value}</div>
                {subtext && (
                    <div className="lab-stat-subtext">
                        <span>{subtext}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
