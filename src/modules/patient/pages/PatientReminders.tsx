import React, { useState } from 'react';
import type { PatientReminder, ReminderType, RepeatInterval, ReminderStatus } from '../types/patientTypes';
import { Clock, Plus, Check, X, Pill, Trash2 } from 'lucide-react';

interface PatientRemindersProps {
  reminders: PatientReminder[];
  onUpdateStatus: (id: string, status: ReminderStatus) => void;
  onAddReminder: (data: {
    type: ReminderType;
    title: string;
    description: string;
    date: string;
    time: string;
    repeat: RepeatInterval;
    dosage?: string;
  }) => void;
  onDeleteReminder: (id: string) => void;
}

export const PatientReminders: React.FC<PatientRemindersProps> = ({
  reminders,
  onUpdateStatus,
  onAddReminder,
  onDeleteReminder
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ReminderType>('Medicine');
  const [date, setDate] = useState('2026-10-08');
  const [time, setTime] = useState('08:00 AM');
  const [repeat, setRepeat] = useState<RepeatInterval>('Daily');
  const [dosage, setDosage] = useState('');

  const handleCreate = () => {
    if (!title.trim()) return;
    onAddReminder({
      type,
      title,
      description,
      date,
      time,
      repeat,
      dosage: dosage || undefined
    });
    setShowAddModal(false);
    setTitle('');
    setDescription('');
    setDosage('');
  };

  return (
    <div className="patient-reminders d-flex flex-column gap-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h3 className="font-heading mb-1">Medication & Schedule Reminders</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Daily adherence tracking for prescribed medications, lab appointments, and wellness habits
          </p>
        </div>

        <button className="patient-btn patient-btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add Custom Reminder
        </button>
      </div>

      {/* Reminder List */}
      <div className="d-flex flex-column gap-3">
        {reminders.map((rem) => {
          const isTaken = rem.status === 'Taken';
          const isSkipped = rem.status === 'Skipped';

          return (
            <div
              key={rem.id}
              className="patient-card p-3 d-flex align-items-center justify-content-between gap-3"
              style={{
                backgroundColor: isTaken ? 'var(--p-success-light)' : 'var(--p-surface)',
                borderLeft: isTaken ? '4px solid var(--p-success)' : '1px solid var(--p-border)'
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: isTaken ? 'var(--p-success)' : 'var(--p-primary-subtle)',
                    color: isTaken ? '#ffffff' : 'var(--p-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isTaken ? <Check size={20} /> : rem.type === 'Medicine' ? <Pill size={20} /> : <Clock size={20} />}
                </div>

                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold font-heading" style={{ fontSize: '0.98rem' }}>
                      {rem.title}
                    </span>
                    {rem.dosage && (
                      <span className="patient-badge patient-badge-teal">{rem.dosage}</span>
                    )}
                    <span className="patient-badge patient-badge-neutral">{rem.repeat}</span>
                  </div>

                  <p className="mb-1 text-muted" style={{ fontSize: '0.82rem' }}>
                    {rem.description}
                  </p>

                  <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.78rem' }}>
                    <Clock size={12} /> {rem.time}
                    <span>•</span>
                    <span>Status: <strong>{rem.status}</strong></span>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2 align-items-center">
                {!isTaken && (
                  <button
                    className="patient-btn patient-btn-sm patient-btn-primary"
                    onClick={() => onUpdateStatus(rem.id, 'Taken')}
                  >
                    <Check size={14} /> Mark Taken
                  </button>
                )}
                {isTaken && (
                  <button
                    className="patient-btn patient-btn-sm patient-btn-outline"
                    onClick={() => onUpdateStatus(rem.id, 'Upcoming')}
                  >
                    Undo
                  </button>
                )}
                {!isTaken && !isSkipped && (
                  <button
                    className="patient-btn patient-btn-sm patient-btn-outline text-muted"
                    onClick={() => onUpdateStatus(rem.id, 'Skipped')}
                  >
                    <X size={14} /> Skip
                  </button>
                )}
                <button
                  className="patient-btn patient-btn-sm patient-btn-outline text-muted p-1"
                  onClick={() => onDeleteReminder(rem.id)}
                  title="Delete reminder"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="patient-modal-backdrop">
          <div className="patient-modal-box">
            <div className="patient-card-header">
              <h5 className="font-heading mb-0" style={{ fontSize: '1.05rem' }}>Create Schedule Reminder</h5>
              <button onClick={() => setShowAddModal(false)} className="border-0 bg-transparent text-muted" style={{ cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="patient-card-body">
              <div className="mb-3">
                <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Reminder Type</label>
                <div className="d-flex flex-wrap gap-2">
                  {(['Medicine', 'Appointment', 'Lab', 'Wellness', 'Custom'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`patient-btn patient-btn-sm ${type === t ? 'patient-btn-primary' : 'patient-btn-outline'}`}
                      onClick={() => setType(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Title</label>
                <input
                  type="text"
                  className="patient-input"
                  placeholder="e.g. Paracetamol 500mg, Drink 500ml Water"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {type === 'Medicine' && (
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Dosage</label>
                  <input
                    type="text"
                    className="patient-input"
                    placeholder="e.g. 1 Tablet, 10ml Syrup"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Instructions / Description</label>
                <textarea
                  className="patient-input"
                  rows={2}
                  placeholder="e.g. Take with water after breakfast"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-4">
                  <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Start Date</label>
                  <input
                    type="date"
                    className="patient-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Time</label>
                  <input
                    type="text"
                    className="patient-input"
                    placeholder="08:00 AM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label fw-bold" style={{ fontSize: '0.85rem' }}>Repeat</label>
                  <select
                    className="patient-input"
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value as RepeatInterval)}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Once">Once</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <button className="patient-btn patient-btn-outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button className="patient-btn patient-btn-primary" onClick={handleCreate} disabled={!title.trim()}>
                  <Check size={16} /> Save Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
