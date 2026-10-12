import React, { useState, useEffect, useRef } from 'react';
import { 
    Bot, 
    Send, 
    X, 
    Sparkles, 
    Copy, 
    Check, 
    RefreshCw, 
    ShieldAlert, 
    Stethoscope, 
    TestTube2, 
    Pill, 
    User,
    CornerDownLeft
} from 'lucide-react';
import { widaAiAssistant } from '../services/widaAiAssistantService';

export const WidaAIAssistantModal = ({ 
    isOpen, 
    onClose, 
    initialModule,
    initialDomain 
}) => {
    const targetModule = initialDomain || initialModule || 'patient';
    const [activeModule, setActiveModule] = useState(targetModule);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const messagesEndRef = useRef(null);

    // Initial greeting per module
    const getWelcomeMessage = (mod) => {
        switch (mod) {
            case 'doctor':
                return {
                    id: 'welcome-doc',
                    sender: 'ai',
                    text: `Hello Doctor! I am your WIDA Clinical AI Co-Pilot. I can assist with differential diagnoses, evidence-based treatment guidelines (AHA/ACC, KDIGO, ADA), drug-drug interaction matrix checks, and renal/hepatic dosage adjustments. How may I assist your clinical workflow today?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
            case 'lab':
                return {
                    id: 'welcome-lab',
                    sender: 'ai',
                    text: `Welcome to the WIDA Diagnostic Laboratory AI Assistant. I can assist with NABL ISO 15189 standards, critical panic alert values, specimen collection tube color protocols, and Westgard multi-rule quality control troubleshooting. How can I help your laboratory team?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
            case 'pharmacy':
                return {
                    id: 'welcome-pharmacy',
                    sender: 'ai',
                    text: `Greetings Pharmacist! I am your WIDA Pharmacotherapy AI Specialist. I can review prescription interactions, verify generic substitutions, check cold chain storage specs, and provide CDSCO Schedule H1 regulatory guidance. How can I assist with dispensing today?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
            case 'patient':
            default:
                return {
                    id: 'welcome-patient',
                    sender: 'ai',
                    text: `Hello! I am your WIDA AI Healthcare Navigator. I can explain your blood test results, explain your prescribed medications, prepare questions for your doctor visit, and offer lifestyle tips. What would you like to explore today?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
        }
    };

    const [messages, setMessages] = useState(() => [getWelcomeMessage(targetModule)]);

    useEffect(() => {
        const mod = initialDomain || initialModule || 'patient';
        setActiveModule(mod);
        setMessages([getWelcomeMessage(mod)]);
    }, [initialDomain, initialModule, isOpen]);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    if (!isOpen) return null;

    const handleSwitchModule = (mod) => {
        setActiveModule(mod);
        setMessages([getWelcomeMessage(mod)]);
    };

    const handleSend = async (customText) => {
        const textToSend = (customText || inputText).trim();
        if (!textToSend || isLoading) return;

        const userMsg = {
            id: `usr-${Date.now()}`,
            sender: 'user',
            text: textToSend,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedHistory = [...messages, userMsg];
        setMessages(updatedHistory);
        if (!customText) setInputText('');
        setIsLoading(true);

        try {
            const aiReply = await widaAiAssistant.sendMessage(textToSend, activeModule, updatedHistory);
            setMessages(prev => [
                ...prev,
                {
                    id: `ai-${Date.now()}`,
                    sender: 'ai',
                    text: aiReply,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    id: `ai-err-${Date.now()}`,
                    sender: 'ai',
                    text: '⚠️ I encountered an error processing your query. Please check your network connection or try rephrasing.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text, idx) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setCopiedIndex(idx);
            setTimeout(() => setCopiedIndex(null), 2000);
        }
    };

    const quickPrompts = widaAiAssistant.getQuickPrompts(activeModule);

    return (
        <div 
            className="wida-ai-modal-backdrop"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                backgroundColor: 'rgba(15, 23, 42, 0.72)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px'
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div 
                className="wida-ai-modal-box"
                style={{
                    width: '100%',
                    maxWidth: '780px',
                    height: '88vh',
                    maxHeight: '740px',
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid rgba(226, 232, 240, 0.9)'
                }}
            >
                {/* Modal Header */}
                <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #e2e8f0',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #007C77 0%, #0369a1 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0, 124, 119, 0.4)'
                        }}>
                            <Bot size={24} color="#ffffff" />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h4 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                                    WIDA Healthcare AI Assistant
                                </h4>
                                <span style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    backgroundColor: '#007C77',
                                    color: '#ffffff',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em'
                                }}>
                                    Active 24/7
                                </span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                                <span>Multi-Domain Clinical Knowledge Engine • Connected to WIDA Ecosystem</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="button"
                        onClick={onClose}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: '#cbd5e1',
                            cursor: 'pointer',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = '#cbd5e1'; }}
                        title="Close Assistant"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Module Switcher Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    overflowX: 'auto'
                }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginRight: '6px' }}>
                        Domain Context:
                    </span>
                    {[
                        { id: 'patient', label: 'Patient Care', icon: User, color: '#007C77' },
                        { id: 'doctor', label: 'Doctor Clinical', icon: Stethoscope, color: '#0284c7' },
                        { id: 'lab', label: 'Diagnostic Lab', icon: TestTube2, color: '#7c3aed' },
                        { id: 'pharmacy', label: 'Pharmacy & Rx', icon: Pill, color: '#059669' }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isSelected = activeModule === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => handleSwitchModule(tab.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '0.76rem',
                                    fontWeight: isSelected ? 700 : 500,
                                    padding: '5px 12px',
                                    borderRadius: '8px',
                                    border: isSelected ? `1.5px solid ${tab.color}` : '1px solid #e2e8f0',
                                    backgroundColor: isSelected ? '#ffffff' : 'transparent',
                                    color: isSelected ? tab.color : '#64748b',
                                    boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <Icon size={14} color={isSelected ? tab.color : '#94a3b8'} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Quick Suggestion Pills */}
                <div style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px'
                }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={12} color="#007C77" /> Quick Inquiries:
                    </span>
                    {quickPrompts.map((p, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => handleSend(p.query)}
                            style={{
                                fontSize: '0.72rem',
                                padding: '3px 9px',
                                borderRadius: '14px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#f8fafc',
                                color: '#334155',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e0f2fe'; e.currentTarget.style.borderColor = '#0284c7'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                {/* Message Log */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    backgroundColor: '#f8fafc'
                }}>
                    {messages.map((m, idx) => {
                        const isUser = m.sender === 'user';
                        return (
                            <div 
                                key={m.id || idx}
                                style={{
                                    display: 'flex',
                                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                                    gap: '10px'
                                }}
                            >
                                {!isUser && (
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '10px',
                                        backgroundColor: '#007C77',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        marginTop: '2px'
                                    }}>
                                        <Bot size={18} />
                                    </div>
                                )}

                                <div style={{
                                    maxWidth: '82%',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        padding: '12px 16px',
                                        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                        backgroundColor: isUser ? '#007C77' : '#ffffff',
                                        color: isUser ? '#ffffff' : '#1e293b',
                                        fontSize: '0.88rem',
                                        lineHeight: 1.55,
                                        whiteSpace: 'pre-line',
                                        boxShadow: isUser ? '0 2px 8px rgba(0, 124, 119, 0.25)' : '0 1px 4px rgba(0, 0, 0, 0.06)',
                                        border: isUser ? 'none' : '1px solid #e2e8f0'
                                    }}>
                                        {m.text}
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: isUser ? 'flex-end' : 'space-between',
                                        marginTop: '4px',
                                        padding: '0 4px',
                                        fontSize: '0.7rem',
                                        color: '#94a3b8'
                                    }}>
                                        <span>{m.timestamp}</span>
                                        {!isUser && (
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(m.text, idx)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: copiedIndex === idx ? '#10b981' : '#94a3b8',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '3px',
                                                    fontSize: '0.68rem',
                                                    padding: '2px 4px'
                                                }}
                                                title="Copy Response"
                                            >
                                                {copiedIndex === idx ? <Check size={12} /> : <Copy size={12} />}
                                                <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {isLoading && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '10px',
                                backgroundColor: '#007C77',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Bot size={18} />
                            </div>
                            <div style={{
                                padding: '10px 16px',
                                borderRadius: '16px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#64748b',
                                fontSize: '0.82rem'
                            }}>
                                <RefreshCw size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                                <span>Consulting WIDA Clinical Intelligence Engine...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Safety & Compliance Bar */}
                <div style={{
                    padding: '6px 16px',
                    backgroundColor: '#fffbeb',
                    borderTop: '1px solid #fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.72rem',
                    color: '#92400e'
                }}>
                    <ShieldAlert size={14} color="#d97706" style={{ flexShrink: 0 }} />
                    <span>
                        <strong>Clinical Advisory:</strong> WIDA AI Assistant provides educational clinical decision support. Always verify critical decisions with licensed medical authorities.
                    </span>
                </div>

                {/* Input Workspace */}
                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    style={{
                        padding: '12px 16px',
                        backgroundColor: '#ffffff',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    <input 
                        type="text"
                        placeholder={
                            activeModule === 'doctor' 
                                ? "Ask about clinical protocols, differential diagnosis, drug interactions..."
                                : activeModule === 'lab'
                                ? "Inquire about panic ranges, tube guidelines, sample rejection criteria..."
                                : activeModule === 'pharmacy'
                                ? "Search drug-drug contraindications, generic equivalents, Schedule H1..."
                                : "Ask about your CBC report, medications, doctor questions, diet..."
                        }
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: '1.5px solid #cbd5e1',
                            outline: 'none',
                            fontSize: '0.88rem',
                            color: '#1e293b',
                            backgroundColor: '#f8fafc',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#007C77'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim() || isLoading}
                        style={{
                            padding: '10px 18px',
                            borderRadius: '10px',
                            backgroundColor: '#007C77',
                            color: '#ffffff',
                            border: 'none',
                            cursor: (!inputText.trim() || isLoading) ? 'not-allowed' : 'pointer',
                            opacity: (!inputText.trim() || isLoading) ? 0.6 : 1,
                            fontWeight: 600,
                            fontSize: '0.88rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 6px rgba(0, 124, 119, 0.3)',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <span>Send</span>
                        <Send size={15} />
                    </button>
                </form>
            </div>
        </div>
    );
};
