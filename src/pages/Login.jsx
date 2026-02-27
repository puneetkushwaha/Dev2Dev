import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, Sparkles, Target, Zap, ShieldCheck } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role);
                navigate(data.selectedDomain ? '/dashboard' : '/onboarding');
            } else {
                setError(data.message || 'Verification Failed');
            }
        } catch (err) {
            setError('Neural Link Failure');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role);
                navigate(data.selectedDomain ? '/dashboard' : '/onboarding');
            } else {
                setError('Authentication Bypass Denied');
            }
        } catch (err) {
            setError('Auth Protocol Failure');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-side-visual">
                <div className="auth-visual-pill">
                    <Sparkles size={14} />
                    <span>The Frontier of Tech Prep</span>
                </div>
                <h1 className="auth-visual-title">
                    Master Your <br />
                    <span className="highlight">Technical</span> Destiny.
                </h1>
                <p className="auth-visual-subtitle">
                    Leverage AI-orchestrated learning to break through the glass ceiling of modern engineering.
                </p>

                <div className="auth-feature-grid">
                    <div className="auth-feature-card">
                        <Target size={24} color="var(--auth-accent)" />
                        <h4>Precision Roadmap</h4>
                        <p>Adaptive paths that evolve with your progress.</p>
                    </div>
                    <div className="auth-feature-card">
                        <Zap size={24} color="#fbbf24" />
                        <h4>Neural Training</h4>
                        <p>Simulate the world's toughest technical rounds.</p>
                    </div>
                </div>
            </div>

            <div className="auth-side-form">
                <div className="auth-form-card">
                    <header className="auth-header">
                        <img src="/logo.png" alt="Dev2Dev" className="auth-logo" />
                        <h2>Account Access</h2>
                        <p>Welcome back to Dev2Dev Ecosystem</p>
                    </header>

                    {error && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.8rem', borderRadius: '12px', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="auth-field">
                            <label className="auth-label">Vault ID</label>
                            <div className="auth-input-wrapper">
                                <Mail size={18} color="rgba(255,255,255,0.2)" style={{ marginRight: '0.8rem' }} />
                                <input
                                    type="email"
                                    className="auth-input"
                                    placeholder="id@dev2dev.ai"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label className="auth-label" style={{ margin: 0 }}>Passkey</label>
                                <Link to="/forgot-password" style={{ fontSize: '0.7rem', color: 'var(--auth-accent)', textDecoration: 'none', fontWeight: 800 }}>
                                    Reset?
                                </Link>
                            </div>
                            <div className="auth-input-wrapper">
                                <Lock size={18} color="rgba(255,255,255,0.2)" style={{ marginRight: '0.8rem' }} />
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

                        <button type="submit" className="auth-btn-primary" disabled={loading}>
                            {loading ? <Loader2 size={24} className="animate-spin" /> : <>Enter Protocol <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>External Access</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Portal Sync Error')}
                            theme="filled_black"
                            shape="pill"
                            size="large"
                        />
                    </div>

                    <p className="auth-footer">
                        Outsider? <Link to="/register" className="auth-link">Initialize Identity</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
