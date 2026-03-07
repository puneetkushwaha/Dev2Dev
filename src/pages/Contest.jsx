import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Trophy, Clock, Users, Calendar, ArrowRight, Zap, Target, Star, Award, Shield, Cpu, Activity } from 'lucide-react';

const Contest = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('global');
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const getApiUrl = (path) => {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        return `${backendUrl}${path}`;
    };

    const authConfig = () => {
        const token = localStorage.getItem('token');
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    };

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const res = await axios.get(getApiUrl('/api/contests'), authConfig());
                setContests(res.data);
            } catch (err) {
                console.error("Failed to fetch contests:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchContests();
    }, []);

    const activeContests = contests.filter(c => c.isActive && (!c.endTime || new Date(c.endTime) > new Date()));
    const pastContests = contests.filter(c => !c.isActive || new Date(c.endTime) <= new Date());
    const featuredContest = activeContests.find(c => c.contestType === 'daily') || activeContests[0];
    
    const dailyContests = activeContests.filter(c => c.contestType === 'daily');
    const weeklyContests = activeContests.filter(c => c.contestType === 'weekly');
    const monthlyContests = activeContests.filter(c => c.contestType === 'monthly');
    const companyContests = activeContests.filter(c => c.tags && c.tags.length > 0);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        setMousePos({ x: clientX, y: clientY });
        
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    const getCompanyColor = (tags) => {
        if (!tags || tags.length === 0) return { main: '#6366f1', secondary: '#4f46e5', rgb: '99, 102, 241' };
        const tag = tags[0].toLowerCase();
        if (tag.includes('microsoft')) return { main: '#00a4ef', secondary: '#0078d4', rgb: '0, 164, 239' };
        if (tag.includes('google')) return { main: '#ea4335', secondary: '#c5221f', rgb: '234, 67, 53' };
        if (tag.includes('amazon')) return { main: '#ff9900', secondary: '#e47911', rgb: '255, 153, 0' };
        if (tag.includes('meta')) return { main: '#0668E1', secondary: '#004daa', rgb: '6, 104, 225' };
        return { main: '#34d399', secondary: '#059669', rgb: '52, 211, 153' };
    };

    const renderContestCard = (c) => {
        const colors = getCompanyColor(c.tags);
        return (
            <div 
                key={c._id} 
                className="cyber-card" 
                style={{ '--accent': colors.main, '--accent-secondary': colors.secondary, '--accent-rgb': colors.rgb }}
                onMouseMove={handleMouseMove}
            >
                <div className="card-scanner"></div>
                <div className="card-glitch-overlay"></div>
                
                <div className="card-header">
                    <div className="status-indicator">
                        <div className="dot"></div>
                        <span>{c.isActive ? 'OPERATIONAL' : 'ARCHIVED'}</span>
                    </div>
                    {c.image && <img src={c.image} alt="" className="brand-logo" />}
                </div>

                <div className="card-body">
                    <div className="type-badge">{c.contestType?.toUpperCase() || 'CORE'}</div>
                    <h3 data-text={c.title}>{c.title}</h3>
                    <p>{c.description || "The ultimate test for elite developers. Compete now."}</p>
                </div>

                <div className="card-stats">
                    <div className="stat-node">
                        <Users size={14} />
                        <span>{c.participants?.length || 0} DEVS</span>
                    </div>
                    <div className="stat-node">
                        <Clock size={14} />
                        <span>{c.durationMinutes}M</span>
                    </div>
                </div>

                <Link to={`/exams?contestId=${c._id}`} className="cyber-button">
                    <span className="btn-glitch-content">ENTER THE ARENA</span>
                    <ArrowRight size={18} />
                </Link>
            </div>
        );
    };

    if (loading) return (
        <div className="arena-loader">
            <div className="cyber-spinner"></div>
            <h2 className="glitch" data-text="INITIALIZING_ARENA">INITIALIZING_ARENA</h2>
            <div className="loading-bar"><div className="progress"></div></div>
        </div>
    );

    return (
        <div className="arena-root">
            {/* Particle System */}
            <div className="particle-layer">
                {[...Array(30)].map((_, i) => (
                    <div key={i} className="particle" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${5 + Math.random() * 10}s`
                    }}></div>
                ))}
            </div>

            {/* Live Feed Ticker */}
            <div className="arena-ticker">
                <div className="ticker-content">
                    <span className="ticker-item"><Activity size={12}/> ARENA_STATUS: 100% OPERATIONAL</span>
                    <span className="ticker-item"><Zap size={12}/> RECENT_WINNER: USER_42_DSA @ GOOGLE_PREP</span>
                    <span className="ticker-item"><Trophy size={12}/> HIGH_SCORE: 2840pts @ WEEKLY_ARENA</span>
                    <span className="ticker-item"><Shield size={12}/> SECURITY: QUANTUM_ENCRYPTION_ACTIVE</span>
                    {/* Repeat for continuous scroll */}
                    <span className="ticker-item"><Activity size={12}/> ARENA_STATUS: 100% OPERATIONAL</span>
                    <span className="ticker-item"><Zap size={12}/> RECENT_WINNER: USER_42_DSA @ GOOGLE_PREP</span>
                </div>
            </div>

            <main className="arena-content">
                {featuredContest && (
                    <section className="arena-hero">
                        <div className="hero-cyber-frame">
                            <div className="frame-corner tl"></div>
                            <div className="frame-corner tr"></div>
                            <div className="frame-corner bl"></div>
                            <div className="frame-corner br"></div>
                            
                            <div className="hero-main">
                                <div className="hero-info">
                                    <div className="hero-label">
                                        <Zap size={16} />
                                        <span>SYSTEM_PRIORITY_TARGET</span>
                                    </div>
                                    <h1 className="glitch" data-text={featuredContest.title}>
                                        {featuredContest.title}
                                    </h1>
                                    <p className="hero-desc">
                                        {featuredContest.description || "Rise to the top of the global leaderboard. Solve complex algorithms in real-time."}
                                    </p>
                                    
                                    <div className="hero-hud">
                                        <div className="hud-bit">
                                            <span className="hud-label">PARTICIPANTS</span>
                                            <span className="hud-val">{featuredContest.participants?.length || 0}</span>
                                        </div>
                                        <div className="hud-bit">
                                            <span className="hud-label">TIME_LIMIT</span>
                                            <span className="hud-val">{featuredContest.durationMinutes}M</span>
                                        </div>
                                        <div className="hud-bit">
                                            <span className="hud-label">XP_REWARD</span>
                                            <span className="hud-val">+1200</span>
                                        </div>
                                    </div>

                                    <div className="hero-actions">
                                        <Link to={`/exams?contestId=${featuredContest._id}`} className="hero-cyber-btn">
                                            DEPLOY NOW <ArrowRight size={24} />
                                        </Link>
                                    </div>
                                </div>
                                <div className="hero-visual">
                                    <div className="visual-core">
                                        <Trophy size={200} className="trophy-energy" />
                                        <div className="energy-rings">
                                            <div className="ring"></div>
                                            <div className="ring"></div>
                                            <div className="ring"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <div className="arena-nav">
                    <div className="nav-tabs">
                        <button 
                            className={`nav-tab ${activeTab === 'global' ? 'active' : ''}`}
                            onClick={() => setActiveTab('global')}
                        >
                            <Cpu size={18} />
                            <span>GLOBAL_ARENA</span>
                        </button>
                        <button 
                            className={`nav-tab ${activeTab === 'company' ? 'active' : ''}`}
                            onClick={() => setActiveTab('company')}
                        >
                            <Shield size={18} />
                            <span>COMPANY_READY</span>
                        </button>
                    </div>
                </div>

                <div className="arena-grid-section">
                    {activeTab === 'global' ? (
                        <div className="track-stack">
                            <div className="track-group">
                                <div className="track-header">
                                    <span className="slash-decor">//</span>
                                    <h2>DAILY_OPERATIONS</h2>
                                </div>
                                <div className="cyber-grid">
                                    {dailyContests.length > 0 ? dailyContests.map(c => renderContestCard(c)) : <div className="empty-state">NO_ACTIVE_TASKS</div>}
                                </div>
                            </div>
                            <div className="track-group">
                                <div className="track-header">
                                    <span className="slash-decor">//</span>
                                    <h2>MAJOR_CAMPAIGNS</h2>
                                </div>
                                <div className="cyber-grid">
                                    {[...weeklyContests, ...monthlyContests].length > 0 ? 
                                        [...weeklyContests, ...monthlyContests].map(c => renderContestCard(c)) : 
                                        <div className="empty-state">SCANNING_FOR_MAJORS...</div>
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="track-group">
                            <div className="track-header">
                                <span className="slash-decor">//</span>
                                <h2>CORPORATE_SIMULATIONS</h2>
                            </div>
                            <div className="cyber-grid">
                                {companyContests.length > 0 ? 
                                    companyContests.map(c => renderContestCard(c)) : 
                                    <div className="empty-state">CORPORATE_CHANNELS_OFFLINE</div>
                                }
                            </div>
                        </div>
                    )}
                </div>

                {pastContests.length > 0 && (
                    <section className="legacy-section">
                        <div className="track-header">
                            <span className="slash-decor">//</span>
                            <h2>ARCHIVE_DECRYPTED</h2>
                        </div>
                        <div className="legacy-grid">
                            {pastContests.slice(0, 6).map(c => (
                                <div key={c._id} className="legacy-item">
                                    <div className="l-meta">
                                        <span className="l-date">{new Date(c.startTime).toLocaleDateString()}</span>
                                        <h4>{c.title}</h4>
                                    </div>
                                    <Link to={`/leaderboard?contestId=${c._id}`} className="l-link">
                                        ACCESS_STATS <ArrowRight size={14} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer className="arena-footer">
                <div className="footer-line"></div>
                <div className="footer-content">
                    <p>ENGINE_v2.4 // ARENA_ACCESS_GRANTED // 2026</p>
                </div>
            </footer>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Orbitron:wght@400;900&family=Outfit:wght@400;900&display=swap');

                .arena-root {
                    background: #050508;
                    min-height: 100vh;
                    color: #fff;
                    position: relative;
                    overflow-x: hidden;
                    font-family: 'Space Mono', monospace;
                }

                /* Particle Layer */
                .particle-layer {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none; z-index: 0;
                }
                .particle {
                    position: absolute; width: 2px; height: 2px;
                    background: rgba(99, 102, 241, 0.4); border-radius: 50%;
                    animation: drift linear infinite;
                }
                @keyframes drift {
                    0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
                    20% { opacity: 0.8; }
                    80% { opacity: 0.8; }
                    100% { transform: translateY(-1000px) translateX(200px) scale(0.5); opacity: 0; }
                }

                /* Arena Ticker */
                .arena-ticker {
                    background: #6366f1; height: 32px; display: flex; align-items: center;
                    overflow: hidden; position: sticky; top: 0; z-index: 100;
                    border-bottom: 2px solid #000;
                }
                .ticker-content {
                    display: flex; white-space: nowrap; animation: ticker 40s linear infinite;
                }
                .ticker-item {
                    color: #000; font-weight: 900; font-size: 0.75rem;
                    padding: 0 4rem; display: flex; align-items: center; gap: 0.5rem;
                }
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                /* Arena Content */
                .arena-content {
                    max-width: 1400px; margin: 0 auto;
                    padding: 60px 2rem 100px; position: relative; z-index: 1;
                }

                /* Hero Section */
                .arena-hero { margin-bottom: 8rem; }
                .hero-cyber-frame {
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    position: relative; padding: 1px;
                }
                .frame-corner {
                    position: absolute; width: 24px; height: 24px;
                    border: 3px solid #6366f1; z-index: 5;
                }
                .frame-corner.tl { top: -2px; left: -2px; border-right: none; border-bottom: none; }
                .frame-corner.tr { top: -2px; right: -2px; border-left: none; border-bottom: none; }
                .frame-corner.bl { bottom: -2px; left: -2px; border-right: none; border-top: none; }
                .frame-corner.br { bottom: -2px; right: -2px; border-left: none; border-top: none; }

                .hero-main { 
                    background: #0a0a0f; padding: 5rem; display: flex; 
                    justify-content: space-between; align-items: center;
                    clip-path: polygon(0 0, 100% 0, 100% 90%, 95% 100%, 0 100%);
                }
                .hero-label {
                    display: flex; align-items: center; gap: 0.75rem; color: #6366f1;
                    font-size: 0.8rem; font-weight: 900; margin-bottom: 2rem;
                    letter-spacing: 2px;
                }
                .hero-info h1 {
                    font-family: 'Orbitron', sans-serif; font-size: 5rem; font-weight: 900;
                    margin-bottom: 1.5rem; line-height: 0.9; letter-spacing: -2px;
                }
                .hero-desc { font-size: 1.25rem; opacity: 0.5; max-width: 600px; margin-bottom: 4rem; }

                .hero-hud { display: flex; gap: 5rem; margin-bottom: 5rem; }
                .hud-bit { display: flex; flex-direction: column; gap: 0.5rem; }
                .hud-label { font-size: 0.65rem; opacity: 0.3; letter-spacing: 2px; }
                .hud-val { font-size: 2rem; font-weight: 900; font-family: 'Orbitron'; color: #6366f1; }

                .hero-cyber-btn {
                    display: inline-flex; align-items: center; gap: 2rem;
                    background: #fff; color: #000; padding: 1.6rem 4rem;
                    font-weight: 950; font-size: 1.2rem; text-decoration: none;
                    clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
                    transition: 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .hero-cyber-btn:hover {
                    background: #6366f1; color: #fff; transform: skewX(-5deg);
                    box-shadow: 0 0 40px rgba(99, 102, 241, 0.5);
                }

                .hero-visual { position: relative; padding-right: 5rem; }
                .visual-core { position: relative; z-index: 2; }
                .trophy-energy { color: #fbbf24; filter: drop-shadow(0 0 60px rgba(251, 191, 36, 0.4)); animation: float 6s ease-in-out infinite; }
                .energy-rings .ring {
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 50%;
                    animation: ringPulse 4s infinite;
                }
                .energy-rings .ring:nth-child(1) { width: 300px; height: 300px; animation-delay: 0s; }
                .energy-rings .ring:nth-child(2) { width: 450px; height: 450px; animation-delay: 1s; }
                .energy-rings .ring:nth-child(3) { width: 600px; height: 600px; animation-delay: 2s; }
                @keyframes ringPulse {
                    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
                }

                /* Glitch Effect */
                .glitch { position: relative; }
                .glitch::before, .glitch::after {
                    content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                }
                .glitch::before { left: 2px; text-shadow: -2px 0 #ff00c1; clip: rect(44px, 450px, 56px, 0); animation: glitch-anim 5s infinite linear alternate-reverse; }
                .glitch::after { left: -2px; text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1; clip: rect(44px, 450px, 56px, 0); animation: glitch-anim2 5s infinite linear alternate-reverse; }
                @keyframes glitch-anim {
                    0% { clip: rect(31px, 9999px, 94px, 0); }
                    20% { clip: rect(62px, 9999px, 42px, 0); }
                    40% { clip: rect(10px, 9999px, 52px, 0); }
                    60% { clip: rect(98px, 9999px, 12px, 0); }
                    80% { clip: rect(43px, 9999px, 84px, 0); }
                    100% { clip: rect(15px, 9999px, 66px, 0); }
                }
                @keyframes glitch-anim2 {
                    0% { clip: rect(65px, 9999px, 23px, 0); }
                    20% { clip: rect(12px, 9999px, 87px, 0); }
                    40% { clip: rect(92px, 9999px, 15px, 0); }
                    60% { clip: rect(45px, 9999px, 67px, 0); }
                    80% { clip: rect(32px, 9999px, 98px, 0); }
                    100% { clip: rect(78px, 9999px, 43px, 0); }
                }

                /* Arena Navigation */
                .arena-nav { margin-bottom: 6rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .nav-tabs { display: flex; gap: 0; }
                .nav-tab {
                    background: none; border: none; color: #fff; padding: 2rem 4rem;
                    display: flex; align-items: center; gap: 1rem; cursor: pointer;
                    font-family: 'Orbitron'; font-weight: 900; font-size: 1.1rem;
                    opacity: 0.3; transition: 0.3s; position: relative;
                }
                .nav-tab.active { opacity: 1; background: rgba(99, 102, 241, 0.05); }
                .nav-tab.active::after {
                    content: ''; position: absolute; bottom: -1px; left: 0; width: 100%;
                    height: 4px; background: #6366f1; box-shadow: 0 -4px 20px #6366f1;
                }

                /* Grid Layout */
                .cyber-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 3rem; }
                .track-group { margin-bottom: 8rem; }
                .track-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 4rem; }
                .slash-decor { color: #6366f1; font-weight: 900; font-size: 1.5rem; }
                .track-header h2 { font-family: 'Orbitron'; font-weight: 900; letter-spacing: 1px; font-size: 1.6rem; }

                /* Cyber Card */
                .cyber-card {
                    background: #0a0a0f; border: 1px solid rgba(255,255,255,0.05);
                    position: relative; padding: 2.5rem; display: flex; flex-direction: column;
                    clip-path: polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%);
                    transition: 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .cyber-card:hover {
                    border-color: var(--accent); transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(var(--accent-rgb), 0.1);
                }
                .card-scanner {
                    position: absolute; top: 0; left: 0; width: 100%; height: 2px;
                    background: linear-gradient(to right, transparent, var(--accent), transparent);
                    animation: scanning 3s linear infinite; opacity: 0;
                }
                .cyber-card:hover .card-scanner { opacity: 1; }
                @keyframes scanning { 0% { top: 0; } 100% { top: 100%; } }

                .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .status-indicator { display: flex; align-items: center; gap: 0.5rem; font-size: 0.6rem; font-weight: 900; color: #34d399; }
                .status-indicator .dot { width: 6px; height: 6px; background: #34d399; border-radius: 50%; animation: pulse 2s infinite; }
                .brand-logo { height: 24px; filter: contrast(0) brightness(2); }

                .type-badge { font-size: 0.65rem; font-weight: 900; color: var(--accent); margin-bottom: 1rem; letter-spacing: 1px; }
                .cyber-card h3 { font-family: 'Orbitron'; font-size: 1.6rem; font-weight: 900; margin-bottom: 1rem; line-height: 1.2; }
                .cyber-card p { font-size: 0.95rem; opacity: 0.5; line-height: 1.5; margin-bottom: 2.5rem; flex: 1; }

                .card-stats { display: flex; gap: 2.5rem; margin-bottom: 2.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); }
                .stat-node { display: flex; align-items: center; gap: 0.6rem; font-size: 0.8rem; opacity: 0.4; font-weight: 900; }

                .cyber-button {
                    background: var(--accent); color: #fff; padding: 1.2rem;
                    text-decoration: none; display: flex; align-items: center;
                    justify-content: center; gap: 1rem; font-weight: 950;
                    clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
                    transition: 0.3s;
                }
                .cyber-card:hover .cyber-button { background: #fff; color: #000; box-shadow: 0 10px 20px rgba(255,255,255,0.2); }

                /* Legacy Section */
                .legacy-section { margin-top: 5rem; }
                .legacy-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
                .legacy-item {
                    background: #0a0a0f; border-left: 3px solid #6366f1; padding: 2rem;
                    display: flex; justify-content: space-between; align-items: center;
                }
                .l-meta h4 { font-family: 'Orbitron'; font-size: 1.1rem; margin-bottom: 0.5rem; }
                .l-date { font-size: 0.75rem; opacity: 0.3; display: block; margin-bottom: 0.5rem; }
                .l-link { color: #6366f1; text-decoration: none; font-weight: 900; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; }

                /* Loader */
                .arena-loader {
                    background: #050508; min-height: 100vh; display: flex; 
                    flex-direction: column; align-items: center; justify-content: center;
                }
                .cyber-spinner {
                    width: 60px; height: 60px; border: 4px solid rgba(99, 102, 241, 0.1);
                    border-top-color: #6366f1; border-radius: 50%;
                    animation: spin 1s linear infinite; margin-bottom: 2rem;
                }
                .loading-bar { width: 300px; height: 4px; background: rgba(255,255,255,0.05); margin-top: 1.5rem; position: relative; }
                .loading-bar .progress { width: 60%; height: 100%; background: #6366f1; animation: loading 3s infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes loading { 0% { width: 0; left: 0; } 50% { width: 100%; left: 0; } 100% { width: 0; left: 100%; } }

                /* Responsiveness */
                @media (max-width: 1200px) {
                    .hero-info h1 { font-size: 3.5rem; }
                    .hero-main { padding: 3rem; }
                    .cyber-grid { grid-template-columns: 1fr 1fr; }
                }
                @media (max-width: 900px) {
                    .hero-main { flex-direction: column; text-align: center; }
                    .hero-visual { display: none; }
                    .hero-hud { justify-content: center; gap: 3rem; }
                    .cyber-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default Contest;
