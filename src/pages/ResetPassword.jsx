import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Loader2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Loader from '../components/Loader';
import './Auth.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Mismatch in security keys');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Security system updated! Redirecting...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(data.message || 'Invalid or expired restoration token');
            }
        } catch (err) {
            setError('System synchronization failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-side-visual">
                <div className="auth-visual-pill">
                    <Zap size={14} />
                    <span>System Override</span>
                </div>
                <h1 className="auth-visual-title">
                    Establish New <br />
                    <span className="highlight">Parameters.</span>
                </h1>
                <p className="auth-visual-subtitle">
                    Create a new, highly secure access key for your Dev2Dev ecosystem profile.
                </p>

                <div className="auth-feature-grid">
                    <div className="auth-feature-card">
                        <ShieldCheck size={24} color="#6366f1" />
                        <h4>Vault Secured</h4>
                        <p>Your data integrity is maintained through key rotation.</p>
                    </div>
                </div>
            </div>

            <div className="auth-side-form">
                <div className="auth-form-card">
                    <header className="auth-header">
                        <img src="/logo.png" alt="Dev2Dev" className="auth-logo" />
                        <h2>Reset Vault</h2>
                        <p>Establish a specialized new access key</p>
                    </header>

                    {message && (
                        <div style={{ background: 'rgba(129, 140, 248, 0.1)', border: '1px solid rgba(129, 140, 248, 0.2)', color: '#818cf8', padding: '1rem', borderRadius: '18px', marginBottom: '2.5rem', textAlign: 'center', fontWeight: 600 }}>
                            {message}
                        </div>
                    )}

                    {error && <div className="auth-error-badge">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label className="auth-label">New Access Key</label>
                            <div className="auth-input-wrapper">
                                <Lock size={20} color="rgba(255,255,255,0.2)" style={{ marginRight: '1rem' }} />
                                <input
                                    type="password"
                                    className="auth-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label className="auth-label">Verify New Key</label>
                            <div className="auth-input-wrapper">
                                <Lock size={20} color="rgba(255,255,255,0.2)" style={{ marginRight: '1rem' }} />
                                <input
                                    type="password"
                                    className="auth-input"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-btn-primary" disabled={loading}>
                            {loading ? <Loader text="Updating security parameters..." /> : <>Update Vault <ArrowRight size={20} /></>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
