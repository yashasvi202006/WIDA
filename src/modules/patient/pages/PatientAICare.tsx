import React, { useState } from 'react';
import type { AIChatMessage } from '../types/patientTypes';
import { Sparkles, Send, AlertTriangle, FileText, Pill, HelpCircle } from 'lucide-react';

export const PatientAICare: React.FC = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Welcome to WIDA AI Care Assistant! I can explain your blood test results, summarize clinical instructions, or help you formulate concise questions for your upcoming cardiology consultation with Dr. Sharma.',
      timestamp: 'Today, 10:00 AM'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (presetText?: string) => {
    const text = presetText || input;
    if (!text.trim()) return;

    const userMsg: AIChatMessage = {
      id: `um-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!presetText) setInput('');

    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();
      if (lower.includes('cbc') || lower.includes('report') || lower.includes('blood')) {
        reply = 'Your CBC report from HealthFirst Diagnostics indicates a Hemoglobin of 15.2 g/dL (reference: 13-17 g/dL) and Total Leukocyte Count of 6,800 /cu.mm (reference: 4,000-11,000). Platelets are 240,000 /cu.mm. All cell lines demonstrate balanced bone marrow production with no markers of acute infection or anemia.';
      } else if (lower.includes('medicine') || lower.includes('telmisartan') || lower.includes('statin')) {
        reply = 'You are currently prescribed Telmisartan 40mg (morning with water) and Atorvastatin 10mg (at bedtime). These agents work synergistically to reduce arterial resistance and manage blood lipid plaque progression. Be sure to stay adequately hydrated.';
      } else if (lower.includes('doctor') || lower.includes('question')) {
        reply = 'Recommended questions for Dr. Sharma:\n1. Are my blood pressure numbers (currently averaging 120/80 mmHg) at the long-term therapeutic target?\n2. When should we repeat the lipid panel to measure the statin efficacy?\n3. Are there any dietary restrictions regarding potassium-rich salt substitutes?';
      } else {
        reply = 'I am here to support your holistic healthcare journey across WIDA. You can view lab records, schedule follow-ups with specialists, or review your active medication schedule in your dashboard.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `am-${Date.now()}`,
          sender: 'ai',
          text: reply,
          timestamp: 'Just now'
        }
      ]);
    }, 600);
  };

  return (
    <div className="patient-ai-care d-flex flex-column gap-4">
      <div>
        <div className="d-flex align-items-center gap-2 mb-1">
          <Sparkles size={22} style={{ color: 'var(--p-purple)' }} />
          <h3 className="font-heading mb-0">WIDA AI Care Health Assistant</h3>
        </div>
        <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
          Interactive informational assistant for clinical report interpretation and consultation preparation
        </p>
      </div>

      {/* Safety Notice */}
      <div
        className="p-3 rounded border d-flex align-items-center gap-2"
        style={{
          backgroundColor: 'var(--p-warning-light)',
          borderColor: 'rgba(245, 158, 11, 0.4)',
          color: '#92400E',
          fontSize: '0.82rem'
        }}
      >
        <AlertTriangle size={18} className="flex-shrink-0" />
        <span>
          <strong>Informational Guidance Only:</strong> AI Care is engineered strictly to explain terminology and summarize records. It cannot diagnose disease or prescribe therapy. Always consult your attending physician for medical decisions.
        </span>
      </div>

      {/* Main Chat Workspace */}
      <div className="patient-card d-flex flex-column" style={{ minHeight: 520 }}>
        {/* Preset Prompt Buttons */}
        <div className="p-3 border-bottom d-flex flex-wrap gap-2" style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border-subtle)' }}>
          <button
            className="patient-btn patient-btn-sm patient-btn-outline"
            onClick={() => handleSend('Interpret my recent CBC Blood Count report')}
          >
            <FileText size={13} /> Interpret CBC Report
          </button>
          <button
            className="patient-btn patient-btn-sm patient-btn-outline"
            onClick={() => handleSend('Explain medication mechanism for Telmisartan')}
          >
            <Pill size={13} /> Explain Telmisartan & Statin
          </button>
          <button
            className="patient-btn patient-btn-sm patient-btn-outline"
            onClick={() => handleSend('Formulate questions for Dr. Sharma')}
          >
            <HelpCircle size={13} /> Doctor Visit Preparation
          </button>
        </div>

        {/* Message Log */}
        <div className="p-4 flex-fill d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: 420 }}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`d-flex ${m.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                className="p-3 rounded"
                style={{
                  maxWidth: '80%',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line',
                  backgroundColor: m.sender === 'user' ? 'var(--p-primary)' : 'var(--p-surface-alt)',
                  color: m.sender === 'user' ? '#ffffff' : 'var(--p-text-main)',
                  border: m.sender === 'ai' ? '1px solid var(--p-border)' : 'none',
                  borderRadius: 'var(--p-radius-lg)'
                }}
              >
                {m.text}
                <div
                  className={`mt-1 text-end ${m.sender === 'user' ? 'text-white-50' : 'text-muted'}`}
                  style={{ fontSize: '0.7rem' }}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-3 border-top d-flex gap-2" style={{ borderColor: 'var(--p-border-subtle)' }}>
          <input
            type="text"
            className="patient-input flex-fill"
            placeholder="Type your healthcare question (e.g., 'What does HDL mean?')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button
            className="patient-btn patient-btn-primary"
            onClick={() => handleSend()}
            disabled={!input.trim()}
          >
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    </div>
  );
};
