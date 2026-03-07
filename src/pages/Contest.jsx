import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Trophy, Clock, Users, Calendar, ArrowRight, Zap, Target, Star, Award, Shield, Monitor, Activity } from 'lucide-react';

const Contest = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('global');

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
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    const getCompanyColor = (tags) => {
        if (!tags || tags.length === 0) return { main: '#6366f1', rgb: '99, 102, 241' };
        const tag = tags[0].toLowerCase();
        if (tag.includes('microsoft')) return { main: '#00a4ef', rgb: '0, 164, 239' };
        if (tag.includes('google')) return { main: '#ea4335', rgb: '234, 67, 53' };
        if (tag.includes('amazon')) return { main: '#ff9900', rgb: '255, 153, 0' };
        if (tag.includes('meta')) return { main: '#0668E1', rgb: '6, 104, 225' };
        return { main: '#34d399', rgb: '52, 211, 153' };
    };

    const renderContestCard = (c) => {
        const colors = getCompanyColor(c.tags);
        return (
            <div 
                key={c._id} 
                className="master-card" 
                style={{ '--accent': colors.main, '--accent-rgb': colors.rgb }}
                onMouseMove={handleMouseMove}
            >
                <div className="card-border-glow"></div>
                <div className="card-inner-glass">
                    <div className="card-spotlight"></div>
                    <div className="card-top-row">
                        <div className="type-pill">{c.contestType?.toUpperCase() || 'CORE'}</div>
                        {c.image && <img src={c.image} alt="" className="card-comp-logo" />}
                    </div>
                    
                    <h3 className="card-title">{c.title}</h3>
                    <p className="card-desc">{c.description || "The ultimate test for elite developers. Compete now."}</p>
                    
                    <div className="card-metrics">
                        <div className="metric"><Users size={14} /> <span>{c.participants?.length || 0}</span></div>
                        <div className="metric"><Clock size={14} /> <span>{c.durationMinutes}M</span></div>
                        <div className="metric"><Target size={14} /> <span>XP+</span></div>
                    </div>

                    <Link to={`/exams?contestId=${c._id}`} className="card-enter-btn">
                        <span>INITIATE TASK</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="master-loader">
            <div className="neural-grid"></div>
            <div className="loader-content">
                <div className="shimmer-logo">ARENA</div>
                <div className="status-line">SYNCHRONIZING_ENVIRONMENT...</div>
            </div>
        </div>
    );

    return (
        <div className="master-root">
            <div className="global-vignette"></div>
            <div className="background-mesh"></div>
            
            <div className="master-status-bar">
                <div className="ticker-track">
                    <span className="ticker-val"><Activity size={12}/> ARENA_ACTIVE</span>
                    <span className="ticker-val"><Shield size={12}/> ENCRYPTION: SECURE</span>
                    <span className="ticker-val"><Star size={12}/> NEW_CHALLENGES_LOADED</span>
                    <span className="ticker-val"><Users size={12}/> 2.4k_DEVS_ONLINE</span>
                    {/* Repeated for continuity */}
                    <span className="ticker-val"><Activity size={12}/> ARENA_ACTIVE</span>
                    <span className="ticker-val"><Shield size={12}/> ENCRYPTION: SECURE</span>
                </div>
            </div>

            <main className="master-container">
                {featuredContest && (
                    <section className="master-hero">
                        <div className="hero-hud-frame">
                            <div className="hud-corner tl"></div>
                            <div className="hud-corner tr"></div>
                            <div className="hud-corner bl"></div>
                            <div className="hud-corner br"></div>
                            
                            <div className="hero-body">
                                <div className="hero-main-content">
                                    <div className="hero-status-pill">
                                        <div className="pulse-circle"></div>
                                        <span>PRIORITY_OBJECTIVE_LIVE</span>
                                    </div>
                                    <h1 className="master-glitch-text" data-text={featuredContest.title}>
                                        {featuredContest.title}
                                    </h1>
                                    <p className="hero-description">
                                        {featuredContest.description || "Rise to the top. Solve complex algorithms in our flagship arena."}
                                    </p>
                                    
                                    <div className="hero-data-grid">
                                        <div className="data-node">
                                            <span className="node-label">OPERATIVES</span>
                                            <span className="node-value">{featuredContest.participants?.length || 0}</span>
                                        </div>
                                        <div className="data-node">
                                            <span className="node-label">DURATION</span>
                                            <span className="node-value">{featuredContest.durationMinutes}M</span>
                                        </div>
                                        <div className="data-node">
                                            <span className="node-label">DIFFICULTY</span>
                                            <span className="node-value">ELITE</span>
                                        </div>
                                    </div>

                                    <Link to={`/exams?contestId=${featuredContest._id}`} className="hero-primary-btn">
                                        <span>ACCESS ARENA</span>
                                        <ArrowRight size={24} />
                                    </Link>
                                </div>
                                <div className="hero-visual-area">
                                    <div className="visual-orb">
                                        <Trophy size={160} className="hero-trophy-icon" />
                                        <div className="orb-rings">
                                            <div className="ring-1"></div>
                                            <div className="ring-2"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <div className="master-nav-section">
                    <nav className="master-tabs">
                        <button 
                            className={`m-tab ${activeTab === 'global' ? 'active' : ''}`}
                            onClick={() => setActiveTab('global')}
                        >
                            <Monitor size={18} />
                            <span>GLOBAL_ARENA</span>
                        </button>
                        <button 
                            className={`m-tab ${activeTab === 'company' ? 'active' : ''}`}
                            onClick={() => setActiveTab('company')}
                        >
                            <Target size={18} />
                            <span>CORP_PREP</span>
                        </button>
                    </nav>
                    <div className="nav-accent-bar"></div>
                </div>

                <div className="master-grid-area">
                    {activeTab === 'global' ? (
                        <div className="section-stack">
                            <div className="section-group">
                                <div className="sec-header">
                                    <div className="sec-tag">01</div>
                                    <h2>DAILY_OPERATIONS</h2>
                                </div>
                                <div className="grid-responsive">
                                    {dailyContests.length > 0 ? dailyContests.map(c => renderContestCard(c)) : <div className="empty-shimmer">NO_ACTIVE_DAILY_TASKS</div>}
                                </div>
                            </div>
                            <div className="section-group">
                                <div className="sec-header">
                                    <div className="sec-tag">02</div>
                                    <h2>MAJOR_EVENTS</h2>
                                </div>
                                <div className="grid-responsive">
                                    {[...weeklyContests, ...monthlyContests].length > 0 ? 
                                        [...weeklyContests, ...monthlyContests].map(c => renderContestCard(c)) : 
                                        <div className="empty-shimmer">MAJOR_CHANNELS_IDLE...</div>
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="section-group">
                            <div className="sec-header">
                                <div className="sec-tag">03</div>
                                <h2>CORPORATE_SIMULATIONS</h2>
                            </div>
                            <div className="grid-responsive">
                                {companyContests.length > 0 ? 
                                    companyContests.map(c => renderContestCard(c)) : 
                                    <div className="empty-shimmer">CORP_FEED_OFFLINE</div>
                                }
                            </div>
                        </div>
                    )}
                </div>

                {pastContests.length > 0 && (
                    <section className="legacy-vault">
                        <div className="sec-header">
                            <div className="sec-tag">04</div>
                            <h2>ARCHIVE_LEGACY</h2>
                        </div>
                        <div className="vault-grid">
                            {pastContests.slice(0, 8).map(c => (
                                <div key={c._id} className="vault-item">
                                    <div className="v-info">
                                        <span className="v-date">{new Date(c.startTime).toLocaleDateString()}</span>
                                        <h4>{c.title}</h4>
                                    </div>
                                    <Link to={`/leaderboard?contestId=${c._id}`} className="v-link">
                                        RETRV_STATS <ArrowRight size={14} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer className="master-footer">
                <div className="footer-line"></div>
                <p>DEV2DEV_CORE_ENGINE_v4.2 // SECURITY_LEVEL_7 // 2026</p>
            </footer>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Orbitron:wght@400;900&family=Inter:wght@400;600;800&display=swap');

                .master-root {
                    background: #020204;
                    min-height: 100vh;
                    color: #fff;
                    position: relative;
                    overflow-x: hidden;
                    font-family: 'Inter', sans-serif;
                }

                .global-vignette {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 100%);
                    pointer-events: none; z-index: 10;
                }

                .background-mesh {
                    position: fixed; top: -50%; left: -50%; width: 200%; height: 200%;
                    background: 
                        radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 40%),
                        radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.08) 0%, transparent 40%);
                    pointer-events: none; filter: blur(100px); animation: meshMove 30s ease-in-out infinite alternate;
                }
                @keyframes meshMove {
                    0% { transform: rotate(0deg) scale(1); }
                    100% { transform: rotate(10deg) scale(1.1); }
                }

                .master-status-bar {
                    height: 28px; background: #6366f1; border-bottom: 2px solid #000;
                    display: flex; align-items: center; overflow: hidden; position: sticky; top: 0; z-index: 100;
                }
                .ticker-track {
                    display: flex; white-space: nowrap; animation: tickerScroll 40s linear infinite;
                }
                .ticker-val {
                    color: #000; font-family: 'Space Mono'; font-weight: 700; font-size: 0.7rem;
                    padding: 0 4rem; display: flex; align-items: center; gap: 0.5rem; letter-spacing: 1px;
                }
                @keyframes tickerScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                .master-container {
                    max-width: 1300px; margin: 0 auto; padding: 60px 1.5rem 100px; position: relative; z-index: 1;
                }

                /* Hero HUD */
                .master-hero { margin-bottom: 8rem; }
                .hero-hud-frame {
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
                    position: relative; padding: 1px; backdrop-filter: blur(20px);
                }
                .hud-corner { position: absolute; width: 20px; height: 20px; border: 2px solid #6366f1; z-index: 5; }
                .hud-corner.tl { top: -2px; left: -2px; border-right: none; border-bottom: none; }
                .hud-corner.tr { top: -2px; right: -2px; border-left: none; border-bottom: none; }
                .hud-corner.bl { bottom: -2px; left: -2px; border-right: none; border-top: none; }
                .hud-corner.br { bottom: -2px; right: -2px; border-left: none; border-top: none; }

                .hero-body {
                    background: #06060c; padding: 5rem; display: flex; justify-content: space-between; align-items: center;
                    clip-path: polygon(0 0, 100% 0, 100% 90%, 97% 100%, 0 100%);
                }
                .hero-status-pill {
                    display: inline-flex; align-items: center; gap: 0.75rem; background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.3); color: #6366f1;
                    padding: 0.6rem 1.25rem; border-radius: 99px; font-size: 0.7rem; font-weight: 800;
                    letter-spacing: 2px; margin-bottom: 2.5rem; font-family: 'Space Mono';
                }
                .pulse-circle { width: 8px; height: 8px; background: #6366f1; border-radius: 50%; animation: pulseLight 2s infinite; }
                @keyframes pulseLight { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.8); opacity: 0.3; } 100% { transform: scale(1); opacity: 1; } }

                .hero-main-content h1 {
                    font-family: 'Orbitron', sans-serif; font-size: 4.5rem; font-weight: 900;
                    line-height: 1; letter-spacing: -2px; margin-bottom: 1.5rem;
                    background: linear-gradient(to right, #fff, #818cf8, #fff);
                    background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    animation: shineAnim 5s linear infinite;
                }
                @keyframes shineAnim { to { background-position: 200% center; } }

                .hero-description { font-size: 1.2rem; opacity: 0.5; max-width: 600px; margin-bottom: 4rem; line-height: 1.6; }

                .hero-data-grid { display: flex; gap: 4rem; margin-bottom: 5rem; }
                .data-node { display: flex; flex-direction: column; gap: 0.5rem; }
                .node-label { font-size: 0.65rem; opacity: 0.3; letter-spacing: 2px; font-weight: 800; }
                .node-value { font-size: 1.8rem; font-family: 'Orbitron'; font-weight: 900; color: #818cf8; }

                .hero-primary-btn {
                    display: inline-flex; align-items: center; gap: 2rem; background: #fff; color: #000;
                    padding: 1.5rem 4rem; font-weight: 900; text-decoration: none; font-size: 1.1rem;
                    clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
                    transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .hero-primary-btn:hover { background: #6366f1; color: #fff; transform: translateY(-5px) skewX(-5deg); box-shadow: 0 0 40px rgba(99, 102, 241, 0.4); }

                .hero-visual-area { position: relative; padding-right: 3rem; }
                .visual-orb { position: relative; width: 300px; height: 300px; display: flex; align-items: center; justify-content: center; }
                .hero-trophy-icon { color: #fbbf24; filter: drop-shadow(0 0 50px rgba(251, 191, 36, 0.4)); animation: floatHero 6s ease-in-out infinite; z-index: 2; }
                @keyframes floatHero { 0%, 100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
                .orb-rings .ring-1, .orb-rings .ring-2 {
                    position: absolute; border: 1px solid rgba(99, 102, 241, 0.15); border-radius: 50%;
                }
                .ring-1 { width: 260px; height: 260px; animation: rotateRing 15s linear infinite; }
                .ring-2 { width: 320px; height: 320px; animation: rotateRing 20s linear infinite reverse; }
                @keyframes rotateRing { to { transform: rotate(360deg); } }

                /* Nav Tabs */
                .master-nav-section { margin-bottom: 5rem; position: relative; }
                .master-tabs { display: flex; gap: 4rem; }
                .m-tab {
                    background: none; border: none; color: #fff; padding: 1.5rem 0;
                    display: flex; align-items: center; gap: 1rem; cursor: pointer;
                    font-family: 'Orbitron'; font-weight: 900; font-size: 1.1rem;
                    opacity: 0.3; transition: 0.3s;
                }
                .m-tab.active { opacity: 1; transform: translateY(-5px); }
                .nav-accent-bar { height: 1px; background: rgba(255,255,255,0.1); width: 100%; position: absolute; bottom: 0; }
                .m-tab.active::after {
                    content: ''; position: absolute; bottom: -1px; left: 0; width: 100%;
                    height: 3px; background: #6366f1; box-shadow: 0 0 20px #6366f1;
                }

                /* Grid & Section Headers */
                .section-group { margin-bottom: 7rem; }
                .sec-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 3.5rem; }
                .sec-tag { font-family: 'Space Mono'; font-size: 0.8rem; color: #6366f1; font-weight: 700; padding: 4px 8px; border: 1px solid rgba(99,102,241,0.3); }
                .sec-header h2 { font-family: 'Orbitron'; font-size: 1.4rem; font-weight: 900; letter-spacing: 1px; }

                .grid-responsive { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 2.5rem; }

                /* Master Card */
                .master-card {
                    --accent: #6366f1; --accent-rgb: 99, 102, 241;
                    position: relative; perspective: 1000px;
                }
                .card-inner-glass {
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 32px; padding: 2.5rem; height: 100%; position: relative; overflow: hidden;
                    display: flex; flex-direction: column; transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    backdrop-filter: blur(40px);
                }
                .card-spotlight {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(var(--accent-rgb), 0.1), transparent 40%);
                    pointer-events: none; opacity: 0; transition: opacity 0.5s;
                }
                .master-card:hover .card-spotlight { opacity: 1; }
                .master-card:hover .card-inner-glass {
                    transform: translateY(-12px) rotateX(4deg); border-color: var(--accent);
                    box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 30px rgba(var(--accent-rgb), 0.15);
                    background: rgba(255,255,255,0.04);
                }

                .card-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .type-pill { font-size: 0.65rem; font-weight: 900; color: var(--accent); background: rgba(var(--accent-rgb), 0.1); padding: 0.5rem 1rem; border-radius: 10px; font-family: 'Space Mono'; }
                .card-comp-logo { height: 26px; filter: contrast(0) brightness(2); opacity: 0.5; }

                .card-title { font-family: 'Orbitron'; font-size: 1.6rem; font-weight: 900; margin-bottom: 1rem; line-height: 1.2; letter-spacing: -0.5px; }
                .card-desc { font-size: 1rem; opacity: 0.5; line-height: 1.6; margin-bottom: 3rem; flex: 1; }

                .card-metrics { display: flex; gap: 2.5rem; margin-bottom: 2.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); }
                .metric { display: flex; align-items: center; gap: 0.6rem; font-size: 0.8rem; opacity: 0.35; font-weight: 800; }

                .card-enter-btn {
                    background: var(--accent); color: #fff; padding: 1.25rem;
                    text-decoration: none; display: flex; align-items: center; justify-content: center;
                    gap: 1rem; font-weight: 900; font-size: 1rem; letter-spacing: 1px;
                    clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
                    transition: 0.3s;
                }
                .master-card:hover .card-enter-btn { background: #fff; color: #000; scale: 1.02; box-shadow: 0 10px 30px rgba(255,255,255,0.2); }

                /* Legacy Vault */
                .legacy-vault { margin-top: 5rem; }
                .vault-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
                .vault-item {
                    background: rgba(255,255,255,0.02); border-left: 3px solid #6366f1; padding: 2rem;
                    display: flex; justify-content: space-between; align-items: center; transition: 0.3s;
                }
                .vault-item:hover { background: rgba(99,102,241,0.05); transform: translateX(10px); }
                .v-info h4 { font-family: 'Orbitron'; font-size: 1rem; margin-bottom: 0.4rem; }
                .v-date { font-size: 0.75rem; opacity: 0.25; display: block; margin-bottom: 0.5rem; font-weight: 800; }
                .v-link { color: #818cf8; text-decoration: none; font-weight: 900; font-size: 0.8rem; display: flex; align-items: center; gap: 0.5rem; font-family: 'Space Mono'; }

                /* Loader */
                .master-loader { background: #020204; min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; }
                .neural-grid { position: absolute; width: 100%; height: 100%; background-image: radial-gradient(rgba(99,102,241,0.1) 1px, transparent 1px); background-size: 30px 30px; }
                .loader-content { text-align: center; position: relative; z-index: 2; }
                .shimmer-logo { font-family: 'Orbitron'; font-size: 3rem; font-weight: 950; letter-spacing: 10px; color: rgba(255,255,255,0.15); background: linear-gradient(90deg, transparent, #fff, transparent); background-size: 200%; background-clip: text; -webkit-background-clip: text; animation: shimmer 2s infinite; }
                @keyframes shimmer { 0% { background-position: -200%; } 100% { background-position: 200%; } }
                .status-line { font-family: 'Space Mono'; font-size: 0.7rem; opacity: 0.4; letter-spacing: 3px; margin-top: 1rem; }

                .empty-shimmer { padding: 5rem; text-align: center; background: rgba(255,255,255,0.01); border: 1px dashed rgba(255,255,255,0.1); border-radius: 20px; opacity: 0.3; font-family: 'Space Mono'; font-size: 0.9rem; }

                /* Glitch Text */
                .master-glitch-text { position: relative; }
                .master-glitch-text::before, .master-glitch-text::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.8; }
                .master-glitch-text::before { left: 2px; text-shadow: -1px 0 #ff00c1; clip: rect(44px, 450px, 56px, 0); animation: glitch-1 5s infinite linear alternate-reverse; }
                @keyframes glitch-1 { 0% { clip: rect(31px, 9999px, 94px, 0); } 100% { clip: rect(15px, 9999px, 66px, 0); } }

                /* Responsiveness */
                @media (max-width: 1100px) {
                    .hero-main-content h1 { font-size: 3.2rem; }
                    .hero-body { padding: 3rem; }
                    .grid-responsive { grid-template-columns: 1fr 1fr; }
                }
                @media (max-width: 800px) {
                    .hero-body { flex-direction: column; text-align: center; }
                    .hero-visual-area { display: none; }
                    .hero-data-grid { justify-content: center; gap: 2rem; }
                    .grid-responsive { grid-template-columns: 1fr; }
                    .master-tabs { gap: 2rem; overflow-x: auto; padding-bottom: 1rem; }
                }
            `}</style>
        </div>
    );
};

export default Contest;
