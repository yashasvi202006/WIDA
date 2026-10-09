import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  MoreHorizontal,
  Edit2,
  Send,
  Bot,
  ArrowRight
} from 'lucide-react';
import type { PatientProfile } from '../types/patientTypes';

interface AICareWidgetProps {
  patient: PatientProfile;
  onOpenFullAIChat: () => void;
}

interface ChatSnippet {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AICareWidget: React.FC<AICareWidgetProps> = ({
  patient,
  onOpenFullAIChat
}) => {
  const [messages, setMessages] = useState<ChatSnippet[]>([
    {
      id: 'msg-1',
      sender: 'user',
      text: 'Can you review my latest coronary artery scan and knee MRI results?',
      time: '10:45 AM'
    },
    {
      id: 'msg-2',
      sender: 'ai',
      text: 'Dr. Sharad Richard confirmed normal myocardial perfusion with stable LAD flow. For your knee, Dr. Robert Fox noted mild MCL inflammation; cryotherapy and gentle quadriceps isometrics are recommended.',
      time: '10:46 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMsg: ChatSnippet = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = "I have cross-checked your ABHA health record. Your vitals (BP 120/80, SpO2 99%) are optimal. Please take your prescribed morning medication as scheduled.";
      if (userText.toLowerCase().includes('heart') || userText.toLowerCase().includes('ecg')) {
        aiReply = "Your ECG from Dr. Sharad Richard shows normal sinus rhythm. Heart rate is steady at 72 BPM.";
      } else if (userText.toLowerCase().includes('knee') || userText.toLowerCase().includes('pain') || userText.toLowerCase().includes('mri')) {
        aiReply = "Your knee MRI indicates Grade 1 ligament strain without tear. Keep the joint elevated and apply cold compresses twice daily.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="patient-card p-4 d-flex flex-column gap-3">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between border-bottom pb-2" style={{ borderColor: 'var(--p-border-subtle)' }}>
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white"
            style={{
              width: 34,
              height: 34,
              backgroundColor: 'var(--p-primary, #0D9488)',
              boxShadow: '0 2px 8px rgba(13, 148, 136, 0.35)'
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <h5 className="font-heading mb-0" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              AI Care
            </h5>
            <span className="text-muted" style={{ fontSize: '0.72rem' }}>
              Real-time clinical intelligence
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-1">
          <button
            onClick={onOpenFullAIChat}
            className="btn btn-sm btn-light border-0 rounded-circle p-1 text-muted"
            title="Search clinical queries"
            aria-label="Search clinical queries"
          >
            <Search size={16} />
          </button>
          <button
            onClick={onOpenFullAIChat}
            className="btn btn-sm btn-light border-0 rounded-circle p-1 text-muted"
            title="Options"
            aria-label="More options"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Chat Messages Preview */}
      <div
        className="d-flex flex-column gap-3 overflow-y-auto pr-1"
        style={{ maxHeight: 250, minHeight: 180 }}
      >
        {messages.map((m) => {
          if (m.sender === 'user') {
            return (
              <div key={m.id} className="d-flex flex-column gap-1">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={patient.avatarUrl}
                      alt={patient.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=0D9488&color=fff&bold=true`;
                      }}
                      className="rounded-circle border"
                      style={{ width: 22, height: 22, objectFit: 'cover' }}
                    />
                    <span className="fw-bold" style={{ fontSize: '0.82rem', color: 'var(--p-text-main)' }}>
                      You
                    </span>
                  </div>
                  <button
                    onClick={() => setInputText(m.text)}
                    className="btn btn-sm p-0 text-muted border-0"
                    title="Edit query"
                    aria-label="Edit query"
                  >
                    <Edit2 size={13} />
                  </button>
                </div>
                <div
                  className="p-3 rounded-4"
                  style={{
                    backgroundColor: 'var(--p-surface-alt)',
                    fontSize: '0.82rem',
                    lineHeight: 1.45,
                    border: '1px solid var(--p-border-subtle)'
                  }}
                >
                  {m.text}
                </div>
              </div>
            );
          }

          return (
            <div key={m.id} className="d-flex flex-column gap-1">
              <div className="d-flex align-items-center gap-1">
                <Bot size={15} style={{ color: 'var(--p-primary)' }} />
                <span className="fw-bold" style={{ fontSize: '0.78rem', color: 'var(--p-primary)' }}>
                  WIDA Clinical AI
                </span>
                <span className="text-muted small ms-auto">{m.time}</span>
              </div>
              <div
                className="p-3 rounded-4 text-white"
                style={{
                  background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
                  fontSize: '0.82rem',
                  lineHeight: 1.45,
                  boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)'
                }}
              >
                {m.text}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="d-flex align-items-center gap-2 text-muted small p-2">
            <Sparkles size={14} className="text-teal animate-spin" />
            <span>AI analyzing clinical telemetry...</span>
          </div>
        )}
      </div>

      {/* Quick Input Box */}
      <form onSubmit={handleSend} className="position-relative">
        <input
          type="text"
          className="patient-input pe-5"
          placeholder="Ask AI about scans, medicine, or symptoms..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ fontSize: '0.82rem', padding: '0.65rem 0.85rem' }}
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="position-absolute end-0 top-50 translate-middle-y me-2 btn btn-sm rounded-circle p-1 d-flex align-items-center justify-content-center text-white"
          style={{
            width: 28,
            height: 28,
            backgroundColor: inputText.trim() ? 'var(--p-primary)' : 'var(--p-text-muted)',
            border: 'none',
            cursor: inputText.trim() ? 'pointer' : 'default'
          }}
          title="Send query"
        >
          <Send size={13} />
        </button>
      </form>

      {/* Button to open full modal */}
      <button
        onClick={onOpenFullAIChat}
        className="patient-btn patient-btn-outline patient-btn-sm w-100 justify-content-center"
        style={{ fontSize: '0.8rem' }}
      >
        <span>Open Full AI Care Consultation</span>
        <ArrowRight size={13} />
      </button>
    </div>
  );
};
