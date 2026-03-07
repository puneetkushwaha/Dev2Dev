import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Trophy, Clock, Users, Calendar, ArrowRight, Zap, Target, Star, Award } from 'lucide-react';

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
                className="contest-card-premium" 
                style={{ '--accent': colors.main, '--accent-rgb': colors.rgb }}
                onMouseMove={handleMouseMove}
            >
                <div className="card-inner">
                    <div className="card-glow"></div>
                    {c.image && (
                        <div className="card-brand">
                            <img src={c.image} alt="" />
                        </div>
                    )}
                    <div className="card-content">
                        <div className="card-header-meta">
                            <span className="type-tag">{c.contestType?.toUpperCase() || 'OFFICIAL'}</span>
                            <span className="duration-tag"><Clock size={14} /> {c.durationMinutes}M</span>
                        </div>
                        <h3>{c.title}</h3>
                        <p className="desc">{c.description || "The ultimate test for elite developers. Compete now."}</p>
                        
                        <div className="card-footer-meta">
                            <div className="meta-pill"><Calendar size={14} /> {new Date(c.startTime).toLocaleDateString()}</div>
                            <div className="meta-pill"><Users size={14} /> {c.participants?.length || 0}</div>
                        </div>

                        <Link to={`/exams?contestId=${c._id}`} className="action-button">
                            <span>ENTER ARENA</span>
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div style={{ background: '#020204', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <div className="loader-mesh"></div>
            <p style={{ opacity: 0.5, fontWeight: 900, letterSpacing: '4px', textTransform: 'uppercase' }}>Synchronizing Arena...</p>
        </div>
    );

    return (
        <div className="contest-p-root">
            <div className="mesh-gradient"></div>
            <div className="vignette"></div>
            
            <main className="contest-p-content">
                {featuredContest && (
                    <section className="hero-section animate-slide-up">
                        <div className="hero-badge"><Zap size={16} /> LIVE CHALLENGE ACTIVE</div>
                        <div className="hero-card elite-glass" onMouseMove={handleMouseMove}>
                            <div className="card-glow"></div>
                            <div className="hero-info">
                                <h1>{featuredContest.title}</h1>
                                <p>{featuredContest.description || "Rise to the top of the global leaderboard. Solve complex algorithms in real-time."}</p>
                                <div className="hero-meta">
                                    <div className="h-m-item"><Trophy size={24} /> <span>Rank Up</span></div>
                                    <div className="h-m-item"><Users size={24} /> <span>{featuredContest.participants?.length || 0} DEVS</span></div>
                                    <div className="h-m-item"><Target size={24} /> <span>ELITE XP</span></div>
                                </div>
                                <div className="hero-actions">
                                    <Link to={`/exams?contestId=${featuredContest._id}`} className="hero-button">
                                        JOIN NOW <ArrowRight size={22} />
                                    </Link>
                                    <div className="live-indicator">
                                        <div className="pulse-dot"></div>
                                        <span>SYSTEMS ONLINE</span>
                                    </div>
                                </div>
                            </div>
                            <div className="hero-visual">
                                <div className="trophy-halo"></div>
                                <Trophy size={180} className="floating-trophy" />
                            </div>
                        </div>
                    </section>
                )}

                <div className="contest-nav-container animate-fade-in delay-1">
                    <nav className="p-tabs">
                        <button className={activeTab === 'global' ? 'active' : ''} onClick={() => setActiveTab('global')}>
                            Global Arena
                        </button>
                        <button className={activeTab === 'company' ? 'active' : ''} onClick={() => setActiveTab('company')}>
                            Company Tracks
                        </button>
                    </nav>
                    
                    <div className="stats-strip">
                        <div className="s-bit"><strong>{activeContests.length}</strong> LIVE</div>
                        <div className="s-bit"><strong>{contests.length}</strong> TOTAL</div>
                    </div>
                </div>

                <div className="tab-content animate-fade-in delay-2">
                    {activeTab === 'global' ? (
                        <div className="global-tracks">
                            <div className="track-row">
                                <div className="track-label"><Zap size={20} color="#fbbf24" /> Daily Sprints</div>
                                <div className="p-grid">
                                    {dailyContests.length > 0 ? dailyContests.map(c => renderContestCard(c)) : <div className="empty-mini">No daily sprints available.</div>}
                                </div>
                            </div>
                            <div className="track-row">
                                <div className="track-label"><Award size={20} color="#818cf8" /> Major Events</div>
                                <div className="p-grid">
                                    {[...weeklyContests, ...monthlyContests].length > 0 ? 
                                        [...weeklyContests, ...monthlyContests].map(c => renderContestCard(c)) : 
                                        <div className="empty-mini">Scanning for upcoming majors...</div>
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="company-tracks">
                            <div className="track-label"><Star size={20} color="#34d399" /> Elite Prep Tracks</div>
                            <div className="p-grid">
                                {companyContests.length > 0 ? 
                                    companyContests.map(c => renderContestCard(c)) : 
                                    <div className="empty-mini">No active company tracks found.</div>
                                }
                            </div>
                        </div>
                    )}
                </div>

                {pastContests.length > 0 && (
                    <section className="past-sec animate-fade-in delay-3">
                        <div className="sec-h"><h2>Legacy Hall</h2> <p>Archive of historic competitions</p></div>
                        <div className="past-grid">
                            {pastContests.slice(0, 8).map(c => (
                                <div key={c._id} className="past-item-glass">
                                    <div className="p-i-top">
                                        <h4>{c.title}</h4>
                                        <span>{new Date(c.startTime).toLocaleDateString()}</span>
                                    </div>
                                    <Link to={`/leaderboard?contestId=${c._id}`} className="p-link">VIEW RESULTS <ArrowRight size={16} /></Link>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer style={{ padding: '6rem 1.5rem 4rem', textAlign: 'center', opacity: 0.2, fontSize: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.05)', letterSpacing: '2px' }}>
                <p>DEV2DEV QUANTUM ENGINE V2.0 // 2026</p>
            </footer>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&family=Space+Mono:wght@700&display=swap');

                .contest-p-root {
                    background: #020204;
                    min-height: 100vh;
                    color: #fff;
                    position: relative;
                    overflow-x: hidden;
                    font-family: 'Outfit', sans-serif;
                }
                .vignette {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%);
                    pointer-events: none; z-index: 10;
                }
                .mesh-gradient {
                    position: fixed;
                    top: -50%; left: -50%; width: 200%; height: 200%;
                    background: 
                        radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
                        radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.12) 0%, transparent 40%),
                        radial-gradient(circle at 50% 50%, rgba(52, 211, 153, 0.05) 0%, transparent 50%);
                    pointer-events: none;
                    animation: meshMove 20s ease-in-out infinite alternate;
                    filter: blur(80px);
                }
                @keyframes meshMove {
                    0% { transform: rotate(0deg) scale(1); }
                    100% { transform: rotate(15deg) scale(1.1); }
                }
                
                .contest-p-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 100px 1.5rem 100px;
                    position: relative;
                    z-index: 1;
                }

                .hero-section { margin-bottom: 6rem; }
                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.6rem;
                    background: rgba(251, 191, 36, 0.1);
                    border: 1px solid rgba(251, 191, 36, 0.3);
                    color: #fbbf24;
                    padding: 0.6rem 1.4rem;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: 950;
                    letter-spacing: 2px;
                    margin-bottom: 2rem;
                }
                .hero-card {
                    background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 40px;
                    padding: 4.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    backdrop-filter: blur(30px);
                    box-shadow: 0 40px 100px rgba(0,0,0,0.7);
                    position: relative;
                    overflow: hidden;
                }
                .hero-info { max-width: 650px; z-index: 2; }
                .hero-info h1 { 
                    font-size: 4.5rem; font-weight: 950; margin-bottom: 1.5rem; line-height: 0.9; letter-spacing: -3px; 
                    background: linear-gradient(to right, #fff, #818cf8, #fff);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shine 5s linear infinite;
                }
                @keyframes shine { to { background-position: 200% center; } }
                .hero-info p { font-size: 1.25rem; opacity: 0.6; margin-bottom: 3.5rem; line-height: 1.6; }
                .hero-meta { display: flex; gap: 4rem; margin-bottom: 4rem; }
                .h-m-item { display: flex; flex-direction: column; gap: 0.5rem; }
                .h-m-item span { font-size: 0.7rem; text-transform: uppercase; opacity: 0.4; font-weight: 900; letter-spacing: 2px; }
                .h-m-item svg { color: #818cf8; }
                
                .hero-actions { display: flex; align-items: center; gap: 3rem; }
                .hero-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 1.5rem;
                    background: #fff;
                    color: #000;
                    padding: 1.5rem 3.5rem;
                    border-radius: 20px;
                    font-weight: 900;
                    text-decoration: none;
                    transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    font-size: 1.1rem;
                    box-shadow: 0 20px 40px rgba(255,255,255,0.15);
                }
                .hero-button:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 30px 60px rgba(255,255,255,0.25); }
                
                .live-indicator { display: flex; align-items: center; gap: 0.75rem; font-size: 0.7rem; font-weight: 900; color: #34d399; letter-spacing: 1px; }
                .pulse-dot { width: 8px; height: 8px; background: #34d399; border-radius: 50%; box-shadow: 0 0 10px #34d399; animation: pulse 2s infinite; }
                @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }

                .trophy-halo { position: absolute; width: 300px; height: 300px; background: radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); animation: haloScale 4s infinite alternate; }
                @keyframes haloScale { from { transform: translate(-50%, -50%) scale(0.8); } to { transform: translate(-50%, -50%) scale(1.2); } }
                .floating-trophy { filter: drop-shadow(0 0 50px rgba(251,191,36,0.6)); animation: float 6s ease-in-out infinite; color: #fbbf24; position: relative; z-index: 2; }
                @keyframes float { 0%, 100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-30px) rotate(5deg); } }

                .contest-nav-container {
                    display: flex; justify-content: space-between; align-items: flex-end;
                    margin-bottom: 4rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 2.5rem;
                }
                .p-tabs { display: flex; gap: 4rem; }
                .p-tabs button {
                    background: none; border: none; color: #fff;
                    font-size: 1.4rem; font-weight: 950; opacity: 0.3;
                    cursor: pointer; transition: 0.4s; position: relative; padding: 0;
                }
                .p-tabs button.active { opacity: 1; transform: scale(1.1); }
                .p-tabs button.active::after {
                    content: ''; position: absolute; bottom: -2.6rem; left: 0;
                    width: 100%; height: 5px; background: #6366f1;
                    box-shadow: 0 5px 20px rgba(99,102,241,0.8); border-radius: 5px;
                }
                .stats-strip { display: flex; gap: 3rem; opacity: 0.3; font-weight: 900; letter-spacing: 2px; font-size: 0.85rem; font-family: 'Space Mono', monospace; }
                .s-bit strong { color: #fff; font-size: 1.2rem; margin-right: 0.4rem; }

                .p-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2.5rem; }
                .track-row { margin-bottom: 8rem; }
                .track-label { font-size: 1.6rem; font-weight: 950; margin-bottom: 3.5rem; display: flex; align-items: center; gap: 1rem; color: #fff; letter-spacing: -1px; text-transform: uppercase; }

                .contest-card-premium { --accent: #6366f1; --accent-rgb: 99, 102, 241; perspective: 1000px; }
                .card-inner {
                    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 36px;
                    padding: 2.5rem; height: 100%; display: flex; flex-direction: column;
                    transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    backdrop-filter: blur(20px); position: relative; overflow: hidden;
                }
                .card-glow {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(var(--accent-rgb), 0.15), transparent 40%);
                    pointer-events: none; opacity: 0; transition: opacity 0.5s;
                }
                .contest-card-premium:hover .card-glow { opacity: 1; }
                .contest-card-premium:hover .card-inner {
                    transform: translateY(-15px) rotateX(4deg) rotateY(2deg);
                    border-color: var(--accent);
                    box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 30px rgba(var(--accent-rgb), 0.2);
                    background: rgba(255,255,255,0.07);
                }

                .card-brand { height: 40px; margin-bottom: 2rem; }
                .card-brand img { max-height: 100%; opacity: 0.4; filter: contrast(0) brightness(2); transition: 0.5s; }
                .contest-card-premium:hover .card-brand img { opacity: 1; filter: none; }

                .card-header-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .type-tag { font-size: 0.7rem; font-weight: 950; color: var(--accent); background: rgba(var(--accent-rgb), 0.1); padding: 0.5rem 1rem; border-radius: 10px; border: 1px solid rgba(var(--accent-rgb), 0.2); letter-spacing: 1px; }
                .duration-tag { font-size: 0.8rem; opacity: 0.3; display: flex; align-items: center; gap: 0.5rem; font-weight: 900; }
                
                .contest-card-premium h3 { font-size: 1.6rem; font-weight: 950; margin-bottom: 1.25rem; line-height: 1.1; letter-spacing: -0.5px; }
                .desc { font-size: 1rem; opacity: 0.5; line-height: 1.6; margin-bottom: 3rem; flex: 1; font-weight: 500; }

                .card-footer-meta { display: flex; gap: 2.5rem; margin-bottom: 2.5rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.08); }
                .meta-pill { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; opacity: 0.4; font-weight: 900; }
                
                .action-button {
                    width: 100%; background: var(--accent); color: #fff;
                    padding: 1.4rem; border-radius: 20px; text-decoration: none;
                    display: flex; align-items: center; justify-content: center;
                    gap: 1rem; font-weight: 950; transition: 0.4s; font-size: 1.05rem;
                    box-shadow: 0 10px 20px rgba(var(--accent-rgb), 0.3);
                }
                .contest-card-premium:hover .action-button { background: #fff; color: #000; box-shadow: 0 20px 40px rgba(255,255,255,0.3); transform: scale(1.02); }

                .past-sec { margin-top: 12rem; }
                .sec-h { margin-bottom: 5rem; }
                .sec-h h2 { font-size: 2.6rem; font-weight: 950; letter-spacing: -2px; margin-bottom: 1rem; }
                .sec-h p { font-size: 1.2rem; opacity: 0.4; }
                .past-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2.5rem; }
                .past-item-glass {
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08);
                    padding: 3rem; border-radius: 36px; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .past-item-glass:hover { background: rgba(255,255,255,0.06); transform: translateY(-8px); border-color: #818cf8; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
                .p-i-top h4 { font-size: 1.3rem; font-weight: 900; margin-bottom: 0.8rem; letter-spacing: -0.5px; }
                .p-i-top span { font-size: 0.9rem; opacity: 0.3; display: block; margin-bottom: 2.5rem; font-weight: 900; }
                .p-link { font-size: 0.95rem; font-weight: 950; color: #818cf8; text-decoration: none; display: flex; align-items: center; gap: 0.75rem; letter-spacing: 1px; }

                .empty-mini { padding: 6rem; background: rgba(255,255,255,0.02); border-radius: 40px; border: 1px dashed rgba(255,255,255,0.15); opacity: 0.3; font-weight: 950; font-size: 1.25rem; text-align: center; letter-spacing: 2px; text-transform: uppercase; }

                .animate-slide-up { animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in { animation: fadeIn 1s ease-out forwards; opacity: 0; }
                .delay-1 { animation-delay: 0.3s; }
                .delay-2 { animation-delay: 0.6s; }
                .delay-3 { animation-delay: 0.9s; }

                @keyframes slideUp { from { opacity: 0; transform: translateY(80px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                @media (max-width: 1200px) {
                    .hero-info h1 { font-size: 3.5rem; }
                    .p-grid { grid-template-columns: 1fr 1fr; }
                    .past-grid { grid-template-columns: 1fr 1fr; }
                }
                @media (max-width: 768px) {
                    .hero-card { padding: 3.5rem 2rem; flex-direction: column; text-align: center; border-radius: 36px; }
                    .hero-visual { display: none; }
                    .hero-info h1 { font-size: 2.8rem; }
                    .hero-meta { justify-content: center; gap: 2.5rem; flex-wrap: wrap; }
                    .hero-actions { flex-direction: column; gap: 2rem; }
                    .p-tabs { gap: 2.5rem; width: 100%; overflow-x: auto; padding-bottom: 2rem; }
                    .p-tabs button { font-size: 1.2rem; white-space: nowrap; }
                    .stats-strip { display: none; }
                    .past-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default Contest;
