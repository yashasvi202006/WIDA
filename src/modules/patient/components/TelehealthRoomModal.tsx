import React, { useState, useEffect } from 'react';
import {
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  ShieldCheck,
  User,
  Activity
} from 'lucide-react';

interface TelehealthRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentTitle: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  time: string;
}

export const TelehealthRoomModal: React.FC<TelehealthRoomModalProps> = ({
  isOpen,
  onClose,
  appointmentTitle,
  doctorName,
  doctorSpecialty,
  doctorAvatar,
  time
}) => {
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [callDuration, setCallDuration] = useState(124); // in seconds
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: 'Dr. Sharad Richard',
      text: 'Hello Yashasvi! I am reviewing your latest cardiac telemetry and joint scan now.',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      { sender: 'You', text: inputText.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputText('');
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1060,
        padding: '1rem'
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-dark text-white rounded-4 overflow-hidden shadow-2xl d-flex flex-column"
        style={{
          width: '100%',
          maxWidth: 960,
          height: '85vh',
          maxHeight: 700,
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* Call Header */}
        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom border-secondary bg-black bg-opacity-40">
          <div className="d-flex align-items-center gap-3">
            <div className="position-relative">
              <img
                src={doctorAvatar}
                alt={doctorName}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorName)}&background=0D9488&color=fff&bold=true`;
                }}
                className="rounded-circle border border-2 border-teal"
                style={{ width: 44, height: 44, objectFit: 'cover' }}
              />
              <span
                className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                style={{ width: 12, height: 12 }}
              />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h6 className="mb-0 fw-bold">{doctorName}</h6>
                <span className="badge bg-teal text-white" style={{ fontSize: '0.7rem' }}>
                  {doctorSpecialty}
                </span>
              </div>
              <div className="text-secondary small d-flex align-items-center gap-2">
                <span>{appointmentTitle}</span>
                <span>•</span>
                <span className="text-success fw-medium">● Connected: {formatTimer(callDuration)}</span>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span
              className="badge bg-opacity-25 bg-success text-success border border-success border-opacity-50 px-2 py-1 d-none d-sm-flex align-items-center gap-1"
              style={{ fontSize: '0.72rem' }}
            >
              <ShieldCheck size={12} /> ABDM 256-bit Encrypted
            </span>
            <button
              onClick={onClose}
              className="btn btn-sm btn-outline-secondary text-white border-0"
              aria-label="Close telehealth consultation"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-fill position-relative d-flex bg-black overflow-hidden">
          {/* Main Doctor Screen */}
          <div className="flex-fill d-flex flex-column align-items-center justify-content-center position-relative">
            <img
              src={doctorAvatar}
              alt={doctorName}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorName)}&background=0D9488&color=fff&bold=true`;
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.85,
                filter: 'brightness(0.9)'
              }}
            />
            {/* Live vitals overlay */}
            <div
              className="position-absolute top-0 start-0 m-3 p-2 px-3 rounded-3 bg-dark bg-opacity-75 backdrop-blur border border-secondary"
              style={{ fontSize: '0.75rem' }}
            >
              <div className="d-flex align-items-center gap-2 text-warning mb-1">
                <Activity size={14} /> Telemetry Link Active
              </div>
              <div className="text-light">HR: 72 bpm • SpO2: 99% • BP: 120/80</div>
            </div>

            {/* Self Video Floating Window */}
            <div
              className="position-absolute bottom-0 end-0 m-3 rounded-3 overflow-hidden border border-2 border-secondary shadow-lg bg-dark"
              style={{ width: 160, height: 110 }}
            >
              {videoActive ? (
                <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center position-relative">
                  <User size={36} className="text-white-50" />
                  <span
                    className="position-absolute bottom-0 start-0 m-1 px-1 rounded bg-black bg-opacity-75 text-white"
                    style={{ fontSize: '0.65rem' }}
                  >
                    You (Yashasvi)
                  </span>
                </div>
              ) : (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-dark text-muted">
                  <VideoOff size={24} />
                </div>
              )}
            </div>
          </div>

          {/* Side Consultation Chat (Toggleable) */}
          {chatOpen && (
            <div
              className="border-start border-secondary bg-dark bg-opacity-95 d-flex flex-column"
              style={{ width: 280 }}
            >
              <div className="p-2 px-3 border-bottom border-secondary small fw-bold text-muted">
                IN-CALL CHAT & CLINICAL NOTES
              </div>
              <div className="flex-fill p-2 overflow-auto d-flex flex-column gap-2" style={{ fontSize: '0.8rem' }}>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-3 ${
                      m.sender === 'You' ? 'bg-primary text-white ms-4' : 'bg-secondary bg-opacity-50 text-light me-4'
                    }`}
                  >
                    <div className="fw-bold" style={{ fontSize: '0.7rem' }}>
                      {m.sender}
                    </div>
                    <div>{m.text}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-2 border-top border-secondary d-flex gap-1">
                <input
                  type="text"
                  placeholder="Type message..."
                  className="form-control form-control-sm bg-black text-white border-secondary"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit" className="btn btn-sm btn-teal text-white">
                  Send
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Call Controls Bar */}
        <div className="px-4 py-3 bg-black bg-opacity-60 border-top border-secondary d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => setMicActive(!micActive)}
              className={`btn btn-sm rounded-circle p-2 ${micActive ? 'btn-secondary' : 'btn-danger'}`}
              title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {micActive ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            <button
              onClick={() => setVideoActive(!videoActive)}
              className={`btn btn-sm rounded-circle p-2 ${videoActive ? 'btn-secondary' : 'btn-danger'}`}
              title={videoActive ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {videoActive ? <Video size={18} /> : <VideoOff size={18} />}
            </button>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1 ${
                chatOpen ? 'btn-teal text-white' : 'btn-secondary text-white'
              }`}
            >
              <MessageSquare size={16} /> Chat
            </button>
            <button
              onClick={onClose}
              className="btn btn-sm btn-danger rounded-pill px-4 d-flex align-items-center gap-2 fw-bold"
            >
              <PhoneOff size={16} /> End Call
            </button>
          </div>

          <div className="d-none d-sm-block text-muted small">
            Session: #{time.replace(/[^0-9]/g, '')}-WIDA-RX
          </div>
        </div>
      </div>
    </div>
  );
};
