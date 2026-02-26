import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, Send, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.devMode ? 'Dev Mode: Access link logged to Server Terminal!' : 'Recovery link dispatched to your inbox.');
            } else {
                setError(data.message || 'Transmission error');
            }
        } catch (err) {
            setError('System fault. Please check back later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-side-visual">
                <div className="auth-visual-pill">
                    <ShieldCheck size={14} />
                    <span>Secure Your Legacy</span>
                </div>
                <h1 className="auth-visual-title">
                    Reclaim Your <br />
                    <span className="highlight">Identity.</span>
                </h1>
                <p className="auth-visual-subtitle">
                    We've got your back. Securely recover your Vault ID and get back to building the future.
                </p>

                <div className="auth-feature-grid">
                    <div className="auth-feature-card">
                        <Lock size={24} color="#818cf8" />
                        <h4>Encrypted Recovery</h4>
                        <p>Military-grade encryption protects your authorization protocols.</p>
                    </div>
                    <div className="auth-feature-card">
                        <Sparkles size={24} color="var(--auth-accent)" />
                        <h4>Instant Access</h4>
                        <p>Resume your roadmap exactly where you left off.</p>
                    </div>
                </div>
            </div>

            <div className="auth-side-form">
                <div className="auth-form-card">
                    <header className="auth-header">
                        <img src="/logo.png" alt="Dev2Dev" className="auth-logo" />
                        <h2>Recover Access</h2>
                        <p>Enter your registered Vault ID</p>
                    </header>

                    {message && (
                        <div style={{ background: 'rgba(129, 140, 248, 0.1)', border: '1px solid rgba(129, 140, 248, 0.2)', color: '#818cf8', padding: '1rem', borderRadius: '18px', marginBottom: '2.5rem', textAlign: 'center', fontWeight: 600 }}>
                            {message}
                        </div>
                    )}

                    {error && <div className="auth-error-badge">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label className="auth-label">Registered Email</label>
                            <div className="auth-input-wrapper">
                                <Mail size={20} color="rgba(255,255,255,0.2)" style={{ marginRight: '1rem' }} />
                                <input
                                    type="email"
                                    className="auth-input"
                                    placeholder="nexus@dev.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? <Loader2 size={24} className="animate-spin" /> : <>Dispatch Link <Send size={20} /></>}
                        </button>
                    </form>

                    <footer className="auth-footer-text" style={{ marginTop: '3.5rem' }}>
                        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', color: 'var(--auth-accent)', textDecoration: 'none', fontWeight: 800 }}>
                            <ArrowLeft size={18} /> Return to Home
                        </Link>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
