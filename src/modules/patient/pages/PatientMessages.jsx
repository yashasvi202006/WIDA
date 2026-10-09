import React, { useState } from 'react';
import { Send, Search, Paperclip, CheckCheck } from 'lucide-react';
export const PatientMessages = () => {
    const [threads] = useState([
        {
            id: 'th-1',
            name: 'Dr. Sharma',
            role: 'Cardiologist (Max Hospital)',
            avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
            lastMessage: 'Your blood count parameters look optimal. Please maintain the 40mg dosage.',
            time: '11:45 AM',
            unread: 1,
            online: true
        },
        {
            id: 'th-2',
            name: 'HealthFirst Diagnostics Desk',
            role: 'Pathology Lab Support',
            avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300',
            lastMessage: 'Certified CBC report has been signed and delivered to your vault.',
            time: 'Yesterday',
            unread: 0,
            online: false
        },
        {
            id: 'th-3',
            name: 'HealthPlus Pharmacy Dispatch',
            role: 'Dispensing Pharmacist',
            avatar: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&q=80&w=300',
            lastMessage: 'Batch #DL-7821 verified and dispatched for delivery.',
            time: '12 Oct',
            unread: 0,
            online: true
        }
    ]);
    const [activeThreadId, setActiveThreadId] = useState('th-1');
    const [chatMessages, setChatMessages] = useState([
        { id: '1', sender: 'me', text: 'Hello Dr. Sharma, I uploaded my recent CBC lab report for review.', time: '11:30 AM' },
        { id: '2', sender: 'other', text: 'Hello Yashasvi. I have reviewed the differential counts. Hemoglobin is 15.2 g/dL and platelets are normal.', time: '11:42 AM' },
        { id: '3', sender: 'other', text: 'Your blood count parameters look optimal. Please maintain the 40mg dosage.', time: '11:45 AM' }
    ]);
    const [inputText, setInputText] = useState('');
    const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];
    const handleSendMessage = () => {
        if (!inputText.trim())
            return;
        const newMsg = {
            id: `msg-${Date.now()}`,
            sender: 'me',
            text: inputText,
            time: 'Just now'
        };
        setChatMessages((prev) => [...prev, newMsg]);
        setInputText('');
    };
    return (<div className="patient-messages d-flex flex-column gap-4">
      <div>
        <h3 className="font-heading mb-1">Care Team Communication</h3>
        <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
          Secure, direct messaging with your attending doctors, diagnostic centers, and dispensing pharmacies
        </p>
      </div>

      <div className="patient-card row g-0" style={{ minHeight: 560 }}>
        {/* Left: Threads List */}
        <div className="col-md-4 border-end" style={{ borderColor: 'var(--p-border-subtle)' }}>
          <div className="p-3 border-bottom" style={{ borderColor: 'var(--p-border-subtle)' }}>
            <div className="position-relative">
              <Search size={14} className="position-absolute text-muted" style={{ top: '50%', transform: 'translateY(-50%)', left: 10 }}/>
              <input type="text" className="patient-input ps-4 py-1" placeholder="Search conversations..." style={{ fontSize: '0.82rem' }}/>
            </div>
          </div>

          <div className="d-flex flex-column" style={{ maxHeight: 480, overflowY: 'auto' }}>
            {threads.map((t) => {
            const isActive = t.id === activeThreadId;
            return (<div key={t.id} onClick={() => setActiveThreadId(t.id)} className="p-3 border-bottom d-flex gap-3 align-items-center" style={{
                    cursor: 'pointer',
                    borderColor: 'var(--p-border-subtle)',
                    backgroundColor: isActive ? 'var(--p-primary-subtle)' : 'transparent'
                }}>
                  <div className="position-relative">
                    <img src={t.avatar} alt={t.name} onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=0D9488&color=fff&bold=true`;
                }} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}/>
                    {t.online && (<span className="position-absolute bottom-0 end-0 rounded-circle bg-success border border-white" style={{ width: 10, height: 10 }}/>)}
                  </div>

                  <div className="flex-fill overflow-hidden" style={{ fontSize: '0.82rem' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-truncate" style={{ color: 'var(--p-text-main)' }}>
                        {t.name}
                      </span>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>{t.time}</span>
                    </div>
                    <div className="text-muted text-truncate" style={{ fontSize: '0.74rem' }}>
                      {t.role}
                    </div>
                    <div className="text-muted text-truncate mt-1" style={{ fontSize: '0.76rem' }}>
                      {t.lastMessage}
                    </div>
                  </div>

                  {t.unread > 0 && (<span className="badge rounded-pill" style={{ backgroundColor: 'var(--p-primary)' }}>
                      {t.unread}
                    </span>)}
                </div>);
        })}
          </div>
        </div>

        {/* Right: Active Conversation */}
        <div className="col-md-8 d-flex flex-column">
          {/* Header */}
          <div className="p-3 border-bottom d-flex align-items-center gap-3" style={{ borderColor: 'var(--p-border-subtle)', backgroundColor: 'var(--p-surface)' }}>
            <img src={activeThread.avatar} alt={activeThread.name} onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeThread.name)}&background=0D9488&color=fff&bold=true`;
        }} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}/>
            <div>
              <div className="fw-bold font-heading" style={{ fontSize: '0.95rem' }}>{activeThread.name}</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>{activeThread.role}</div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="p-4 flex-fill d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: 400, backgroundColor: 'var(--p-surface-alt)' }}>
            {chatMessages.map((msg) => (<div key={msg.id} className={`d-flex ${msg.sender === 'me' ? 'justify-content-end' : 'justify-content-start'}`}>
                <div className="p-3 rounded" style={{
                maxWidth: '75%',
                fontSize: '0.84rem',
                backgroundColor: msg.sender === 'me' ? 'var(--p-primary)' : 'var(--p-surface)',
                color: msg.sender === 'me' ? '#ffffff' : 'var(--p-text-main)',
                border: msg.sender === 'other' ? '1px solid var(--p-border)' : 'none',
                borderRadius: 'var(--p-radius-lg)'
            }}>
                  <div>{msg.text}</div>
                  <div className={`mt-1 text-end d-flex align-items-center justify-content-end gap-1 ${msg.sender === 'me' ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.68rem' }}>
                    <span>{msg.time}</span>
                    {msg.sender === 'me' && <CheckCheck size={12}/>}
                  </div>
                </div>
              </div>))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-top d-flex gap-2" style={{ borderColor: 'var(--p-border-subtle)', backgroundColor: 'var(--p-surface)' }}>
            <button className="patient-btn patient-btn-outline p-2" title="Attach document" onClick={() => alert('Document vault attachment ready.')}>
              <Paperclip size={18}/>
            </button>
            <input type="text" className="patient-input flex-fill" placeholder={`Message ${activeThread.name}...`} value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => {
            if (e.key === 'Enter')
                handleSendMessage();
        }}/>
            <button className="patient-btn patient-btn-primary" onClick={handleSendMessage} disabled={!inputText.trim()}>
              <Send size={16}/>
            </button>
          </div>
        </div>
      </div>
    </div>);
};
