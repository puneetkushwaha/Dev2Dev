import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Trophy, Clock, Users, Calendar, ArrowRight, Zap, Target, Star, Award, Shield, BarChart3, Search } from 'lucide-react';

const Contest = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('global');
    const [searchTerm, setSearchTerm] = useState('');

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
    
    const filteredContests = activeContests.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.tags && c.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    const dailyContests = filteredContests.filter(c => c.contestType === 'daily');
    const weeklyContests = filteredContests.filter(c => c.contestType === 'weekly');
    const monthlyContests = filteredContests.filter(c => c.contestType === 'monthly');
    const companyContests = filteredContests.filter(c => c.tags && c.tags.length > 0);

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    const renderContestCard = (c) => {
        return (
            <div 
                key={c._id} 
                className="premium-contest-card" 
                onMouseMove={handleMouseMove}
            >
                <div className="card-ambient-glow"></div>
                <div className="card-top">
                    <span className="type-badge">{c.contestType || 'Offical'}</span>
                    {c.isActive && <div className="live-pill"><div className="pulse-dot"></div> LIVE</div>}
                </div>
                
                <div className="card-main">
                    <h3 className="card-title">{c.title}</h3>
                    <p className="card-description">{c.description || "Challenge your limits in our high-stakes arena."}</p>
                </div>

                <div className="card-stats">
                    <div className="stat-pill"><Users size={14} /> <span>{c.participants?.length || 0}</span></div>
                    <div className="stat-pill"><Clock size={14} /> <span>{c.durationMinutes}m</span></div>
                    <div className="stat-pill"><BarChart3 size={14} /> <span>XP+</span></div>
                </div>

                <Link to={`/exams?contestId=${c._id}`} className="card-action-btn">
                    <span>Participate Now</span>
                    <ArrowRight size={18} />
                </Link>
            </div>
        );
    };

    if (loading) return (
        <div className="premium-loader">
            <div className="loader-mesh"></div>
            <div className="spinner"></div>
            <p>Syncing Arena Assets...</p>
        </div>
    );

    return (
        <div className="premium-arena-root">
            {/* Background elements to match About/Tutorials */}
            <div className="bg-gradient-blob b1"></div>
            <div className="bg-gradient-blob b2"></div>
            
            <header className="premium-header">
                <div className="header-container">
                    <div className="header-left">
                        <span className="mission-badge">Arena Competition</span>
                        <h1 className="header-title">The <span className="gradient-text">Premium Contest</span> Arena</h1>
                        <p className="header-subtitle">Battle-test your architecture skills against the global vanguard.</p>
                    </div>
                    {featuredContest && (
                        <div className="featured-mini-card">
                            <div className="f-badge">Featured Target</div>
                            <h4>{featuredContest.title}</h4>
                            <div className="f-meta">
                                <span><Users size={12}/> {featuredContest.participants?.length || 0} Operatives</span>
                                <span><Clock size={12}/> {featuredContest.durationMinutes}m</span>
                            </div>
                            <Link to={`/exams?contestId=${featuredContest._id}`} className="f-btn">
                                Join Now <ArrowRight size={14} />
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            <main className="premium-content">
                <section className="controls-box">
                    <div className="nav-tabs">
                        <button className={`tab-btn ${activeTab === 'global' ? 'active' : ''}`} onClick={() => setActiveTab('global')}>
                            Global Tracks
                        </button>
                        <button className={`tab-btn ${activeTab === 'company' ? 'active' : ''}`} onClick={() => setActiveTab('company')}>
                            Company Prep
                        </button>
                    </div>
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Find specific challenges..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </section>

                <div className="grid-section">
                    {activeTab === 'global' ? (
                        <>
                            <div className="track-group">
                                <div className="track-head">
                                    <Zap size={20} color="#6366f1" />
                                    <h2>Daily Operations</h2>
                                </div>
                                <div className="card-grid">
                                    {dailyContests.length > 0 ? dailyContests.map(c => renderContestCard(c)) : <div className="empty-state">No active daily tasks.</div>}
                                </div>
                            </div>
                            <div className="track-group">
                                <div className="track-head">
                                    <Star size={20} color="#6366f1" />
                                    <h2>Major Campaigns</h2>
                                </div>
                                <div className="card-grid">
                                    {[...weeklyContests, ...monthlyContests].length > 0 ? 
                                        [...weeklyContests, ...monthlyContests].map(c => renderContestCard(c)) : 
                                        <div className="empty-state">Major channels are currently idle.</div>
                                    }
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="track-group">
                            <div className="track-head">
                                <Shield size={20} color="#6366f1" />
                                <h2>Corporate Simulations</h2>
                            </div>
                            <div className="card-grid">
                                {companyContests.length > 0 ? 
                                    companyContests.map(c => renderContestCard(c)) : 
                                    <div className="empty-state">No company-specific tracks found.</div>
                                }
                            </div>
                        </div>
                    )}
                </div>

                {pastContests.length > 0 && (
                    <section className="legacy-archive">
                        <div className="track-head">
                            <Calendar size={20} color="#6366f1" />
                            <h2>Hall of Records</h2>
                        </div>
                        <div className="legacy-list">
                            {pastContests.slice(0, 10).map(c => (
                                <div key={c._id} className="legacy-card">
                                    <div className="l-main">
                                        <span className="l-date">{new Date(c.startTime).toLocaleDateString()}</span>
                                        <h4>{c.title}</h4>
                                    </div>
                                    <Link to={`/leaderboard?contestId=${c._id}`} className="l-action">
                                        View Results <ArrowRight size={14} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

                .premium-arena-root {
                    background: #0a0a0a;
                    min-height: 100vh;
                    color: #fff;
                    font-family: 'Inter', sans-serif;
                    position: relative;
                    overflow-x: hidden;
                    padding-bottom: 5rem;
                }

                /* Gradient Blobs to match site theme */
                .bg-gradient-blob {
                    position: fixed; width: 600px; height: 600px;
                    border-radius: 50%; filter: blur(120px); opacity: 0.15;
                    pointer-events: none; z-index: 0;
                }
                .b1 { background: #6366f1; top: -100px; right: -100px; }
                .b2 { background: #a855f7; bottom: -100px; left: -100px; }

                .header-container {
                    max-width: 1300px; margin: 0 auto;
                    padding: 8rem 2rem 5rem; display: flex;
                    justify-content: space-between; align-items: flex-end;
                    position: relative; z-index: 1;
                }

                .mission-badge {
                    display: inline-block; background: rgba(99, 102, 241, 0.1);
                    color: #818cf8; padding: 0.5rem 1.2rem; border-radius: 99px;
                    font-size: 0.75rem; font-weight: 800; letter-spacing: 2px;
                    margin-bottom: 2rem; border: 1px solid rgba(99, 102, 241, 0.2);
                }

                .header-title {
                    font-size: 4.5rem; font-weight: 900; line-height: 1.1;
                    letter-spacing: -2px; margin-bottom: 1.5rem;
                }
                .gradient-text {
                    background: linear-gradient(to right, #6366f1, #a855f7);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                }
                .header-subtitle {
                    font-size: 1.25rem; color: rgba(255,255,255,0.5);
                    max-width: 500px; line-height: 1.6;
                }

                .featured-mini-card {
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
                    padding: 2.5rem; border-radius: 32px; backdrop-filter: blur(20px);
                    max-width: 400px; width: 100%;
                }
                .f-badge { color: #818cf8; font-size: 0.7rem; font-weight: 900; letter-spacing: 1px; margin-bottom: 1rem; }
                .featured-mini-card h4 { font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; }
                .f-meta { display: flex; gap: 2rem; opacity: 0.3; font-size: 0.8rem; margin-bottom: 2rem; }
                .f-btn {
                    display: flex; align-items: center; justify-content: center; gap: 1rem;
                    background: #fff; color: #000; text-decoration: none;
                    padding: 1rem; border-radius: 16px; font-weight: 800;
                    transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .f-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,255,255,0.1); }

                .premium-content {
                    max-width: 1300px; margin: 0 auto;
                    padding: 0 2rem; position: relative; z-index: 1;
                }

                .controls-box {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 5rem; padding-bottom: 2rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .nav-tabs { display: flex; gap: 3rem; }
                .tab-btn {
                    background: none; border: none; color: #fff; opacity: 0.25;
                    font-size: 1.5rem; font-weight: 800; cursor: pointer;
                    transition: 0.3s; padding: 0.5rem 0; position: relative;
                }
                .tab-btn:hover { opacity: 0.5; }
                .tab-btn.active { opacity: 1; }
                .tab-btn.active::after {
                    content: ''; position: absolute; bottom: -33px; left: 0;
                    width: 100%; height: 4px; background: #6366f1; border-radius: 4px;
                }

                .search-wrapper { position: relative; width: 320px; }
                .search-icon { position: absolute; left: 1.2rem; top: 50%; transform: translateY(-50%); opacity: 0.3; }
                .search-wrapper input {
                    width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
                    padding: 1rem 1.2rem 1rem 3.5rem; border-radius: 16px; color: #fff; font-size: 0.9rem;
                    outline: none; transition: 0.3s;
                }
                .search-wrapper input:focus { border-color: rgba(99, 102, 241, 0.4); background: rgba(255,255,255,0.05); }

                .track-group { margin-bottom: 6rem; }
                .track-head { display: flex; align-items: center; gap: 1rem; margin-bottom: 3rem; }
                .track-head h2 { font-size: 1.75rem; font-weight: 900; letter-spacing: -1px; }

                .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 2.5rem; }

                .premium-contest-card {
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 28px; padding: 2.5rem; position: relative;
                    transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); overflow: hidden;
                    display: flex; flex-direction: column; height: 100%;
                }
                .premium-contest-card:hover {
                    background: rgba(255,255,255,0.04); transform: translateY(-10px);
                    border-color: rgba(99, 102, 241, 0.3);
                    box-shadow: 0 40px 100px -30px rgba(0,0,0,0.6);
                }
                .card-ambient-glow {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(99, 102, 241, 0.05), transparent 60%);
                    pointer-events: none; opacity: 0; transition: opacity 0.5s;
                }
                .premium-contest-card:hover .card-ambient-glow { opacity: 1; }

                .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .type-badge { font-size: 0.7rem; font-weight: 800; color: #818cf8; text-transform: uppercase; letter-spacing: 1px; }
                .live-pill {
                    background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);
                    padding: 0.4rem 0.8rem; border-radius: 99px; font-size: 0.65rem; font-weight: 900;
                    display: flex; align-items: center; gap: 0.5rem;
                }
                .pulse-dot { width: 6px; height: 6px; background: #ef4444; border-radius: 50%; animation: pulseRed 1.5s infinite; }
                @keyframes pulseRed { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.3; } 100% { transform: scale(1); opacity: 1; } }

                .card-title { font-size: 1.75rem; font-weight: 800; margin-bottom: 1rem; line-height: 1.2; }
                .card-description { font-size: 1.05rem; color: rgba(255,255,255,0.4); line-height: 1.6; margin-bottom: 3rem; flex: 1; }

                .card-stats { display: flex; gap: 2rem; margin-bottom: 3rem; }
                .stat-pill { display: flex; align-items: center; gap: 0.6rem; opacity: 0.3; font-size: 0.85rem; font-weight: 700; }

                .card-action-btn {
                    width: 100%; display: flex; align-items: center; justify-content: center; gap: 1rem;
                    background: rgba(99, 102, 241, 0.1); color: #818cf8; text-decoration: none;
                    padding: 1.2rem; border-radius: 18px; font-weight: 800;
                    transition: 0.3s; border: 1px solid rgba(99, 102, 241, 0.15);
                }
                .premium-contest-card:hover .card-action-btn {
                    background: #6366f1; color: #fff; border-color: transparent;
                    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
                }

                .legacy-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
                .legacy-card {
                    background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.05);
                    padding: 2rem; border-radius: 20px; display: flex; justify-content: space-between; align-items: center;
                    transition: 0.3s;
                }
                .legacy-card:hover { background: rgba(255,255,255,0.03); transform: translateX(8px); }
                .l-main h4 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.2rem; }
                .l-date { font-size: 0.7rem; opacity: 0.2; font-weight: 800; letter-spacing: 1px; }
                .l-action { color: #818cf8; text-decoration: none; font-weight: 800; font-size: 0.8rem; display: flex; align-items: center; gap: 0.5rem; }

                .refined-footer { text-align: center; margin-top: 8rem; opacity: 0.2; font-size: 0.8rem; }

                .premium-loader {
                    min-height: 100vh; display: flex; flex-direction: column; align-items: center;
                    justify-content: center; background: #0a0a0a; color: #fff;
                }
                .spinner {
                    width: 40px; height: 40px; border: 2px solid rgba(255,255,255,0.05);
                    border-top-color: #6366f1; border-radius: 50%;
                    animation: spin 0.8s linear infinite; margin-bottom: 2rem;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .empty-state { padding: 4rem; text-align: center; opacity: 0.2; font-weight: 800; border: 1px dashed rgba(255,255,255,0.1); border-radius: 24px; }

                @media (max-width: 1100px) {
                    .header-title { font-size: 3.5rem; }
                    .header-container { flex-direction: column; align-items: flex-start; gap: 4rem; }
                    .card-grid { grid-template-columns: 1fr 1fr; }
                }
                @media (max-width: 768px) {
                    .header-title { font-size: 2.8rem; }
                    .controls-box { flex-direction: column; align-items: flex-start; gap: 2rem; }
                    .search-wrapper { width: 100%; }
                    .card-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default Contest;
