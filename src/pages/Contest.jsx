import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Trophy, Clock, Users, Calendar, ArrowRight, Zap } from 'lucide-react';

const Contest = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);

    const getApiUrl = (path) => {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        return `${backendUrl}${path}`;
    };

    const authConfig = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
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

    const [activeTab, setActiveTab] = useState('global'); // 'global' or 'company'

    const activeContests = contests.filter(c => c.isActive && (!c.endTime || new Date(c.endTime) > new Date()));
    const pastContests = contests.filter(c => !c.isActive || new Date(c.endTime) <= new Date());

    const featuredContest = activeContests.find(c => c.contestType === 'daily') || activeContests[0];
    
    const dailyContests = activeContests.filter(c => c.contestType === 'daily');
    const weeklyContests = activeContests.filter(c => c.contestType === 'weekly');
    const monthlyContests = activeContests.filter(c => c.contestType === 'monthly');
    const companyContests = activeContests.filter(c => c.tags && c.tags.length > 0);

    const getCompanyColor = (tags) => {
        if (!tags || tags.length === 0) return '#6366f1';
        const tag = tags[0].toLowerCase();
        if (tag.includes('microsoft')) return '#00a4ef';
        if (tag.includes('google')) return '#ea4335';
        if (tag.includes('amazon')) return '#ff9900';
        if (tag.includes('meta') || tag.includes('facebook')) return '#0668E1';
        return '#34d399';
    };

    const renderContestCard = (c, isCompact = false) => {
        const accentColor = getCompanyColor(c.tags);
        return (
            <div key={c._id} className={`contest-card-premium ${isCompact ? 'compact' : ''}`} style={{ '--accent': accentColor }}>
                <div className="card-inner">
                    {c.image && (
                        <div className="card-brand">
                            <img src={c.image} alt="" />
                        </div>
                    )}
                    <div className="card-content">
                        <div className="card-header-meta">
                            <span className="type-tag">{c.contestType?.toUpperCase() || 'OFFICIAL'}</span>
                            <span className="duration-tag"><Clock size={12} /> {c.durationMinutes}m</span>
                        </div>
                        <h3>{c.title}</h3>
                        {!isCompact && <p className="desc">{c.description || "Challenge your limits in this high-stakes arena."}</p>}
                        
                        <div className="card-footer-meta">
                            <div className="meta-pill"><Calendar size={12} /> {new Date(c.startTime).toLocaleDateString()}</div>
                            <div className="meta-pill"><Users size={12} /> {c.participants?.length || 0}</div>
                        </div>

                        <Link to={`/exams?contestId=${c._id}`} className="action-button">
                            <span>{isCompact ? 'Join' : 'Enter Arena'}</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div style={{ background: '#020204', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <div className="loader-mesh"></div>
            <p style={{ opacity: 0.5, fontWeight: 800, letterSpacing: '2px' }}>INITIALIZING ARENA...</p>
        </div>
    );

    return (
        <div className="contest-p-root">
            <div className="mesh-gradient"></div>
            
            <main className="contest-p-content">
                {featuredContest && (
                    <section className="hero-section animate-slide-up">
                        <div className="hero-badge"><Zap size={16} /> FEATURED CHALLENGE</div>
                        <div className="hero-card elite-glass">
                            <div className="hero-info">
                                <h1>{featuredContest.title}</h1>
                                <p>{featuredContest.description || "The ultimate test for elite developers. Compete now."}</p>
                                <div className="hero-meta">
                                    <div className="h-m-item"><Trophy size={20} /> <span>Rank Up</span></div>
                                    <div className="h-m-item"><Users size={20} /> <span>{featuredContest.participants?.length || 0} Competing</span></div>
                                    <div className="h-m-item"><Clock size={20} /> <span>{featuredContest.durationMinutes} Mins</span></div>
                                </div>
                                <Link to={`/exams?contestId=${featuredContest._id}`} className="hero-button">
                                    Claim Your Spot <ArrowRight size={20} />
                                </Link>
                            </div>
                            <div className="hero-visual">
                                <Trophy size={180} className="floating-trophy" />
                            </div>
                        </div>
                    </section>
                )}

                <div className="contest-nav-container animate-fade-in delay-1">
                    <nav className="p-tabs">
                        <button className={activeTab === 'global' ? 'active' : ''} onClick={() => setActiveTab('global')}>
                            Global Contests
                        </button>
                        <button className={activeTab === 'company' ? 'active' : ''} onClick={() => setActiveTab('company')}>
                            Company Prep Tracks
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
                                <div className="track-label"><Zap size={18} color="#fbbf24" /> Daily Challenges</div>
                                <div className="p-grid">
                                    {dailyContests.length > 0 ? dailyContests.map(c => renderContestCard(c)) : <div className="empty-mini">No daily challenges scheduled.</div>}
                                </div>
                            </div>
                            <div className="track-row">
                                <div className="track-label"><Calendar size={18} color="#818cf8" /> Weekly & Monthly</div>
                                <div className="p-grid">
                                    {[...weeklyContests, ...monthlyContests].length > 0 ? 
                                        [...weeklyContests, ...monthlyContests].map(c => renderContestCard(c)) : 
                                        <div className="empty-mini">Check back later for major events.</div>
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="company-tracks">
                            <div className="p-grid wide">
                                {companyContests.length > 0 ? 
                                    companyContests.map(c => renderContestCard(c)) : 
                                    <div className="empty-mini">No company-specific tracks available yet.</div>
                                }
                            </div>
                        </div>
                    )}
                </div>

                {pastContests.length > 0 && (
                    <section className="past-sec animate-fade-in delay-3">
                        <div className="sec-h"><h2>Legacy Hall</h2> <p>Past results and leaderboards</p></div>
                        <div className="past-grid">
                            {pastContests.slice(0, 8).map(c => (
                                <div key={c._id} className="past-item-glass">
                                    <div className="p-i-top">
                                        <h4>{c.title}</h4>
                                        <span>{new Date(c.startTime).toLocaleDateString()}</span>
                                    </div>
                                    <Link to={`/leaderboard?contestId=${c._id}`} className="p-link">View Stats <ArrowRight size={14} /></Link>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer style={{ padding: '4rem 1rem', textAlign: 'center', opacity: 0.2, fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p>© 2026 Dev2Dev Engine. Precision-engineered for Pioneers.</p>
            </footer>

            <style>{`
                .contest-p-root {
                    background: #020204;
                    min-height: 100vh;
                    color: #fff;
                    position: relative;
                    overflow-x: hidden;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }
                .mesh-gradient {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: 
                        radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.12) 0%, transparent 40%),
                        radial-gradient(circle at 90% 90%, rgba(168, 85, 247, 0.08) 0%, transparent 40%);
                    pointer-events: none;
                }
                .contest-p-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 60px 1.5rem 80px;
                    position: relative;
                    z-index: 1;
                }

                .hero-section { margin-bottom: 4rem; }
                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    background: rgba(251, 191, 36, 0.1);
                    color: #fbbf24;
                    padding: 0.5rem 1rem;
                    border-radius: 99px;
                    font-size: 0.7rem;
                    font-weight: 800;
                    letter-spacing: 1px;
                    margin-bottom: 1.5rem;
                }
                .hero-card {
                    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 32px;
                    padding: 3rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.4);
                }
                .hero-info { max-width: 600px; }
                .hero-info h1 { font-size: 3rem; font-weight: 900; margin-bottom: 1rem; line-height: 1; letter-spacing: -2px; }
                .hero-info p { font-size: 1.1rem; opacity: 0.5; margin-bottom: 2.5rem; line-height: 1.5; }
                .hero-meta { display: flex; gap: 3rem; margin-bottom: 3rem; }
                .h-m-item { display: flex; flex-direction: column; gap: 0.3rem; }
                .h-m-item span { font-size: 0.65rem; text-transform: uppercase; opacity: 0.4; font-weight: 800; letter-spacing: 1px; }
                .h-m-item svg { color: #818cf8; width: 18px; height: 18px; }
                .hero-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 1rem;
                    background: #fff;
                    color: #000;
                    padding: 1.2rem 2.5rem;
                    border-radius: 16px;
                    font-weight: 900;
                    text-decoration: none;
                    transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    font-size: 1rem;
                }
                .hero-button:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(255,255,255,0.1); }
                
                .floating-trophy { width: 120px; height: 120px; filter: drop-shadow(0 0 40px rgba(99,102,241,0.4)); animation: float 6s ease-in-out infinite; color: #fbbf24; }
                @keyframes float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-15px) rotate(3deg); } }

                .contest-nav-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 3.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    padding-bottom: 2rem;
                }
                .p-tabs { display: flex; gap: 3rem; }
                .p-tabs button {
                    background: none; border: none; color: #fff;
                    font-size: 1.3rem; font-weight: 800; opacity: 0.3;
                    cursor: pointer; transition: 0.3s;
                    position: relative; padding: 0;
                }
                .p-tabs button.active { opacity: 1; }
                .p-tabs button.active::after {
                    content: ''; position: absolute; bottom: -33px; left: 0;
                    width: 100%; height: 4px; background: #6366f1;
                    box-shadow: 0 0 20px rgba(99,102,241,0.6);
                    border-radius: 4px;
                }
                .stats-strip { display: flex; gap: 2rem; opacity: 0.3; font-weight: 800; letter-spacing: 1px; font-size: 0.85rem; }
                .s-bit strong { color: #fff; font-size: 1.1rem; margin-right: 0.4rem; }

                .p-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
                .track-row { margin-bottom: 6rem; }
                .track-label { font-size: 1.4rem; font-weight: 900; margin-bottom: 2.5rem; display: flex; align-items: center; gap: 0.8rem; color: #fff; letter-spacing: -0.5px; }

                .contest-card-premium { --accent: #6366f1; }
                .card-inner {
                    background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 28px;
                    padding: 2rem;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    backdrop-filter: blur(15px);
                }
                .contest-card-premium:hover .card-inner {
                    background: rgba(255,255,255,0.06);
                    border-color: var(--accent);
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }

                .card-brand { height: 32px; margin-bottom: 1.5rem; }
                .card-brand img { max-height: 100%; opacity: 0.4; filter: brightness(0) invert(1); transition: 0.4s; }
                .contest-card-premium:hover .card-brand img { opacity: 1; filter: none; }

                .card-header-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
                .type-tag { font-size: 0.65rem; font-weight: 900; color: var(--accent); background: rgba(255,255,255,0.06); padding: 0.4rem 0.8rem; border-radius: 8px; letter-spacing: 1px; }
                .duration-tag { font-size: 0.75rem; opacity: 0.3; display: flex; align-items: center; gap: 0.4rem; font-weight: 800; }
                
                .contest-card-premium h3 { font-size: 1.35rem; font-weight: 900; margin-bottom: 0.75rem; line-height: 1.2; letter-spacing: -0.5px; }
                .desc { font-size: 0.9rem; opacity: 0.5; line-height: 1.5; margin-bottom: 2rem; flex: 1; font-weight: 500; }

                .card-footer-meta { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.06); }
                .meta-pill { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; opacity: 0.3; font-weight: 800; }
                
                .action-button {
                    width: 100%; background: #6366f1; color: #fff;
                    padding: 1rem; border-radius: 14px; text-decoration: none;
                    display: flex; align-items: center; justify-content: center;
                    gap: 0.75rem; font-weight: 900; transition: 0.3s; font-size: 0.95rem;
                }
                .contest-card-premium:hover .action-button { background: #fff; color: #000; }

                .past-sec { margin-top: 8rem; }
                .sec-h { margin-bottom: 3rem; }
                .sec-h h2 { font-size: 1.8rem; font-weight: 950; letter-spacing: -1px; margin-bottom: 0.75rem; }
                .sec-h p { font-size: 1rem; opacity: 0.4; }
                .past-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
                .past-item-glass {
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
                    padding: 2rem; border-radius: 24px; transition: 0.3s;
                }
                .past-item-glass:hover { background: rgba(255,255,255,0.04); transform: translateY(-5px); }
                .p-i-top h4 { font-size: 1.1rem; font-weight: 800; margin-bottom: 0.5rem; }
                .p-i-top span { font-size: 0.75rem; opacity: 0.25; display: block; margin-bottom: 1.5rem; font-weight: 800; }
                .p-link { font-size: 0.85rem; font-weight: 900; color: #818cf8; text-decoration: none; display: flex; align-items: center; gap: 0.75rem; }

                .empty-mini { padding: 4rem; background: rgba(255,255,255,0.01); border-radius: 28px; border: 1px dashed rgba(255,255,255,0.1); opacity: 0.3; font-weight: 800; font-size: 1rem; text-align: center; }

                .animate-slide-up { animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; opacity: 0; }
                .delay-1 { animation-delay: 0.2s; }
                .delay-2 { animation-delay: 0.4s; }
                .delay-3 { animation-delay: 0.6s; }

                @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                @media (max-width: 1200px) {
                    .p-grid { grid-template-columns: 1fr 1fr; }
                    .past-grid { grid-template-columns: 1fr 1fr; }
                }
                @media (max-width: 768px) {
                    .hero-card { padding: 2rem; flex-direction: column; text-align: center; border-radius: 24px; }
                    .hero-visual { display: none; }
                    .hero-info h1 { font-size: 2.2rem; }
                    .hero-meta { justify-content: center; gap: 2rem; }
                    .p-tabs { gap: 2rem; width: 100%; overflow-x: auto; padding-bottom: 1.5rem; }
                    .p-tabs button { font-size: 1.1rem; white-space: nowrap; }
                    .stats-strip { display: none; }
                    .past-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default Contest;
