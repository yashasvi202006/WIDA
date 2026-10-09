import React from 'react';
import { Pill, Check, X, Clock, Calendar } from 'lucide-react';
export const ReminderWidget = ({ reminders, onStatusChange, onViewAll }) => {
    const todayReminders = reminders.slice(0, 4);
    return (<div className="patient-card p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <Clock size={18} style={{ color: 'var(--p-primary)' }}/>
          <h5 className="mb-0 font-heading" style={{ fontSize: '1.05rem' }}>Today's Medication & Schedule</h5>
        </div>
        {onViewAll && (<button onClick={onViewAll} className="border-0 bg-transparent p-0 text-decoration-none fw-bold" style={{ fontSize: '0.82rem', color: 'var(--p-primary)', cursor: 'pointer' }}>
            Manage Schedule →
          </button>)}
      </div>

      <div className="d-flex flex-column gap-2">
        {todayReminders.map((rem) => {
            const isTaken = rem.status === 'Taken';
            const isSkipped = rem.status === 'Skipped';
            return (<div key={rem.id} className="p-3 rounded d-flex align-items-center justify-content-between border" style={{
                    backgroundColor: isTaken
                        ? 'var(--p-success-light)'
                        : isSkipped
                            ? 'var(--p-surface-hover)'
                            : 'var(--p-surface-alt)',
                    borderColor: isTaken ? 'rgba(22, 163, 74, 0.3)' : 'var(--p-border-subtle)'
                }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: isTaken ? 'var(--p-success)' : 'var(--p-primary-subtle)',
                    color: isTaken ? '#ffffff' : 'var(--p-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                  {isTaken ? <Check size={18}/> : rem.type === 'Medicine' ? <Pill size={18}/> : <Calendar size={18}/>}
                </div>

                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold" style={{ fontSize: '0.9rem', color: 'var(--p-text-main)' }}>
                      {rem.title}
                    </span>
                    {rem.dosage && (<span className="patient-badge patient-badge-teal" style={{ fontSize: '0.7rem' }}>
                        {rem.dosage}
                      </span>)}
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.78rem' }}>
                    <Clock size={12}/>
                    <span>{rem.time}</span>
                    <span>•</span>
                    <span>{rem.repeat}</span>
                    {isTaken && <span className="text-success fw-bold">• Taken</span>}
                    {isSkipped && <span className="text-muted fw-bold">• Skipped</span>}
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                {!isTaken && (<button className="patient-btn patient-btn-sm patient-btn-primary" onClick={() => onStatusChange(rem.id, 'Taken')} title="Mark dosage as taken">
                    <Check size={13}/> Mark Taken
                  </button>)}
                {isTaken && (<button className="patient-btn patient-btn-sm patient-btn-outline" onClick={() => onStatusChange(rem.id, 'Upcoming')} title="Reset dosage">
                    Undo
                  </button>)}
                {!isTaken && !isSkipped && (<button className="patient-btn patient-btn-sm patient-btn-outline text-muted" style={{ borderColor: 'var(--p-border)' }} onClick={() => onStatusChange(rem.id, 'Skipped')} title="Skip this dose">
                    <X size={13}/>
                  </button>)}
              </div>
            </div>);
        })}
      </div>
    </div>);
};
