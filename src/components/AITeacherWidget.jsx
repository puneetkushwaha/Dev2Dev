import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import axios from 'axios';

const AITeacherWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hi! I am your Dev2Dev AI Teacher. How can I help you learn today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            // Connect to Python AI microservice
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/ai-chat`, { message: userMsg, domain: 'Software Engineering' });
            setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting to the Dev2Dev AI service.' }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                className="btn btn-primary"
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    borderRadius: '50%', width: '60px', height: '60px',
                    padding: 0, boxShadow: '0 8px 24px var(--accent-glow)', zIndex: 100
                }}
            >
                <MessageSquare size={28} />
            </button>
        );
    }

    return (
        <div className="glass-panel" style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100,
            width: '350px', height: '500px', display: 'flex', flexDirection: 'column',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)', overflow: 'hidden'
        }}>
            {/* Header */}
            <div className="flex-between" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(99, 102, 241, 0.1)' }}>
                <div className="flex-center" style={{ gap: '0.5rem' }}>
                    <Bot size={24} color="var(--accent-primary)" />
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>AI Teacher</h3>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((m, i) => (
                    <div key={i} style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        background: m.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                        maxWidth: '85%', border: m.role === 'ai' ? '1px solid var(--border-color)' : 'none'
                    }}>
                        {m.text}
                    </div>
                ))}
                {loading && <div className="text-muted" style={{ fontSize: '0.9rem' }}>Typing...</div>}
            </div>

            {/* Input Area */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask a question..."
                    style={{
                        flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)', outline: 'none'
                    }}
                />
                <button className="btn btn-primary" onClick={sendMessage} style={{ padding: '0 1rem' }}>
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};

export default AITeacherWidget;
