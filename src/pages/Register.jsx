import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, BookOpen, Briefcase, Loader2, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import Loader from '../components/Loader';
import { GoogleLogin } from '@react-oauth/google';
import './Auth.css';

const allSkills = [
    "JavaScript", "Python", "React", "Node.js", "Docker", "AWS", "ML/AI", "SQL", "Java", "CS Fundamentals"
];

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', education: '', experience: '', skills: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [skillSearch, setSkillSearch] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const toggleSkill = (skill) => {
        if (formData.skills.includes(skill)) {
            setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
        } else if (formData.skills.length < 5) {
            setFormData({ ...formData, skills: [...formData.skills, skill] });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role);
                navigate('/onboarding');
            } else {
                setError(data.message || 'Initialization Failed');
            }
        } catch (err) {
            setError('System Fault During Handshake');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-side-visual">
                <div className="auth-visual-pill">
                    <Sparkles size={14} />
                    <span>Join the 1% Factor</span>
                </div>
                <h1 className="auth-visual-title">
                    Build Your <br />
                    <span className="highlight">Architect</span> Profile.
                </h1>
                <p className="auth-visual-subtitle">
                    Transform your career trajectory with elite assessments and industry-first credentials.
                </p>

                <div className="auth-feature-grid">
                    <div className="auth-feature-card">
                        <CheckCircle size={24} color="#818cf8" />
                        <h4>Verified Badges</h4>
                        <p>Credentials that top recruiters actually trust.</p>
                    </div>
                    <div className="auth-feature-card">
                        <Lock size={24} color="#6366f1" />
                        <h4>Secured Sync</h4>
                        <p>Your progress, synced across every developer node.</p>
                    </div>
                </div>
            </div>

            <div className="auth-side-form" style={{ overflowY: 'auto' }}>
                <div className="auth-form-card" style={{ margin: '2rem 0', maxWidth: '480px' }}>
                    <header className="auth-header">
                        <img src="/logo.png" alt="Dev2Dev" className="auth-logo" />
                        <h2>Identity Genesis</h2>
                        <p>Initialize your global developer profile</p>
                    </header>

                    {error && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.8rem', borderRadius: '12px', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                            <div className="auth-field">
                                <label className="auth-label">Full Name</label>
                                <div className="auth-input-wrapper" style={{ height: '54px' }}>
                                    <User size={16} color="rgba(255,255,255,0.2)" />
                                    <input type="text" name="name" className="auth-input" placeholder="Elite User" value={formData.name} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="auth-field">
                                <label className="auth-label">Vault ID</label>
                                <div className="auth-input-wrapper" style={{ height: '54px' }}>
                                    <Mail size={16} color="rgba(255,255,255,0.2)" />
                                    <input type="email" name="email" className="auth-input" placeholder="id@dev.ai" value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="auth-field">
                            <label className="auth-label">Universal Passkey</label>
                            <div className="auth-input-wrapper" style={{ height: '54px' }}>
                                <Lock size={16} color="rgba(255,255,255,0.2)" />
                                <input type="password" name="password" className="auth-input" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                            <div className="auth-field">
                                <label className="auth-label">Education</label>
                                <div className="auth-input-wrapper" style={{ height: '54px' }}>
                                    <select name="education" className="auth-input" value={formData.education} onChange={handleChange} required style={{ appearance: 'none', background: 'transparent' }}>
                                        <option value="" disabled style={{ background: '#000' }}>Select</option>
                                        <option value="Bachelors" style={{ background: '#000' }}>Bachelors</option>
                                        <option value="Masters" style={{ background: '#000' }}>Masters</option>
                                        <option value="Self-Taught" style={{ background: '#000' }}>Self-Taught</option>
                                    </select>
                                </div>
                            </div>
                            <div className="auth-field">
                                <label className="auth-label">Experience Tier</label>
                                <div className="auth-input-wrapper" style={{ height: '54px' }}>
                                    <select name="experience" className="auth-input" value={formData.experience} onChange={handleChange} required style={{ appearance: 'none', background: 'transparent' }}>
                                        <option value="" disabled style={{ background: '#000' }}>Tier</option>
                                        <option value="Fresher" style={{ background: '#000' }}>Fresher</option>
                                        <option value="1-3 Years" style={{ background: '#000' }}>Junior</option>
                                        <option value="3-5 Years" style={{ background: '#000' }}>Senior</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="auth-field">
                            <label className="auth-label">Stack Core (Max 5)</label>
                            <div style={{ position: 'relative' }}>
                                <div className="auth-input-wrapper" style={{ height: 'auto', minHeight: '54px', padding: '0.6rem 1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {formData.skills.map(skill => (
                                        <span key={skill} onClick={() => toggleSkill(skill)} className="skill-tag" style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}>
                                            {skill}
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        placeholder={formData.skills.length === 0 ? "Identify skills..." : ""}
                                        className="auth-input"
                                        style={{ height: '28px', minWidth: '100px', fontSize: '0.85rem' }}
                                        value={skillSearch}
                                        onChange={(e) => setSkillSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="auth-btn-primary" style={{ height: '54px' }} disabled={loading}>
                            {loading ? <Loader inline={true} text="Initializing..." /> : <>Initialize Journey <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already in? <Link to="/login" className="auth-link">Authenticate</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
