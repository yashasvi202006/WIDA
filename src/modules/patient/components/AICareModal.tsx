import React, { useState } from 'react';
import type { AIChatMessage } from '../types/patientTypes';
import { Sparkles, Send, X, AlertTriangle, FileText, Pill, HelpCircle } from 'lucide-react';

interface AICareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICareModal: React.FC<AICareModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Hello Yashasvi! I am your WIDA AI Care Assistant. I can help summarize your clinical reports, explain prescription schedules, or prepare intelligent questions for your upcoming appointment with Dr. Sharma.',
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Simulated responsive AI assistance
    setTimeout(() => {
      let reply: string;
      const lower = text.toLowerCase();
      if (lower.includes('report') || lower.includes('cbc')) {
        reply = 'Based on your CBC report dated 12 Oct from HealthFirst Diagnostics, all blood cell lines are within standard reference ranges (Hemoglobin: 15.2 g/dL, Platelets: 240,000/cu.mm). There are no pathological signs of acute inflammation or anemia.';
      } else if (lower.includes('prescription') || lower.includes('telmisartan') || lower.includes('medicine')) {
        reply = 'Your active prescription from Dr. Sharma includes Telmisartan 40mg (taken once daily in the morning after food for blood pressure) and Atorvastatin 10mg (taken at bedtime for lipid regulation). Please remember never to alter your dosage without speaking with your doctor.';
      } else if (lower.includes('question') || lower.includes('doctor')) {
        reply = 'Here are 3 tailored questions to ask Dr. Sharma during your cardiology consultation:\n1. How have my current blood pressure readings responded compared to the baseline?\n2. Are my borderline LDL levels (124 mg/dL) showing improvement under the 10mg statin therapy?\n3. Would you recommend any adjustments to my aerobic exercise routine?';
      } else {
        reply = 'I am here to support your healthcare journey across WIDA. You can view your lab results under Diagnostics, reorder medicines via Pharmacy, or track your daily medication reminders in the Reminders tab.';
      }

      const aiMsg: AIChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="patient-modal-backdrop">
      <div className="patient-modal-box" style={{ maxWidth: 640 }}>
        <div className="patient-card-header" style={{ backgroundColor: 'var(--p-surface)' }}>
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'var(--p-purple-light)',
                color: 'var(--p-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h5 className="font-heading mb-0" style={{ fontSize: '1rem' }}>WIDA AI Care Health Assistant</h5>
              <span style={{ fontSize: '0.72rem', color: 'var(--p-text-muted)' }}>Continuous Care Intelligence</span>
            </div>
          </div>
          <button onClick={onClose} className="border-0 bg-transparent text-muted p-1" style={{ cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Mandatory Medical Safety Disclaimer */}
        <div
          className="p-2 px-3 border-bottom d-flex align-items-center gap-2"
          style={{
            backgroundColor: 'var(--p-warning-light)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            color: '#92400E',
            fontSize: '0.76rem'
          }}
        >
          <AlertTriangle size={14} className="flex-shrink-0" />
          <span>
            <strong>Informational Support Only:</strong> AI Care provides educational health explanations and does not substitute professional medical diagnosis, prescribing, or clinical advice.
          </span>
        </div>

        {/* Quick Prompts */}
        <div className="p-2 px-3 border-bottom d-flex gap-2 overflow-auto" style={{ backgroundColor: 'var(--p-surface-alt)', borderColor: 'var(--p-border-subtle)' }}>
          <button
            className="patient-btn patient-btn-sm patient-btn-outline"
            style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            onClick={() => handleSend('Explain my latest CBC lab report')}
          >
            <FileText size={12} /> Explain CBC Report
          </button>
          <button
            className="patient-btn patient-btn-sm patient-btn-outline"
            style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            onClick={() => handleSend('Explain my prescription instructions')}
          >
            <Pill size={12} /> Explain Prescriptions
          </button>
          <button
            className="patient-btn patient-btn-sm patient-btn-outline"
            style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            onClick={() => handleSend('Prepare questions for my doctor visit')}
          >
            <HelpCircle size={12} /> Questions for Doctor
          </button>
        </div>

        {/* Chat History */}
        <div className="p-3 d-flex flex-column gap-3" style={{ height: 320, overflowY: 'auto', backgroundColor: 'var(--p-surface)' }}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`d-flex ${m.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                className="p-3 rounded"
                style={{
                  maxWidth: '85%',
                  fontSize: '0.84rem',
                  backgroundColor: m.sender === 'user' ? 'var(--p-primary)' : 'var(--p-surface-alt)',
                  color: m.sender === 'user' ? '#ffffff' : 'var(--p-text-main)',
                  border: m.sender === 'ai' ? '1px solid var(--p-border)' : 'none',
                  borderRadius: 'var(--p-radius-lg)',
                  whiteSpace: 'pre-line'
                }}
              >
                {m.text}
                <div
                  className={`mt-1 text-end ${m.sender === 'user' ? 'text-white-50' : 'text-muted'}`}
                  style={{ fontSize: '0.65rem' }}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-top d-flex gap-2" style={{ borderColor: 'var(--p-border-subtle)', backgroundColor: 'var(--p-surface)' }}>
          <input
            type="text"
            className="patient-input flex-fill"
            placeholder="Ask about your lab report, medicines, or health overview..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button
            className="patient-btn patient-btn-primary"
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
