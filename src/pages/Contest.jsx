import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Trophy, Clock, Users, Calendar, ArrowRight, Brain, Zap, Bell } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

    const activeContests = contests.filter(c => c.isActive && new Date(c.endTime) > new Date());
    const pastContests = contests.filter(c => !c.isActive || new Date(c.endTime) <= new Date());

    return (
        <div className="contest-page-root">
            <Navbar />
            <main className="contest-main">
                <header className="contest-header">
                    <div className="header-content animate-fade-in">
                        <div className="trophy-badge"><Trophy size={40} /></div>
                        <h1>Elevate Coding Contests</h1>
                        <p>Compete with the best developers, solve challenging problems, and climb the leaderboard.</p>
                    </div>
                    <div className="header-stats animate-fade-in delay-1">
                        <div className="h-stat">
                            <strong>{activeContests.length}</strong>
                            <span>Live Now</span>
                        </div>
                        <div className="h-stat">
                            <strong>{contests.length}</strong>
                            <span>Total Hosted</span>
                        </div>
                        <div className="h-stat">
                            <strong>{contests.reduce((acc, c) => acc + (c.participants?.length || 0), 0)}</strong>
                            <span>Participants</span>
                        </div>
                    </div>
                </header>

                <section className="contests-section animate-fade-in delay-2">
                    <div className="section-title">
                        <div className="dot live"></div>
                        <h2>Live & Upcoming Contests</h2>
                    </div>
                    {loading ? (
                        <div className="loading-grid">
                            {[1, 2, 3].map(i => <div key={i} className="skeleton-card"></div>)}
                        </div>
                    ) : activeContests.length > 0 ? (
                        <div className="contest-grid">
                            {activeContests.map(c => (
                                <div key={c._id} className="contest-card elite-glass">
                                    <div className="card-top">
                                        <div className="type-pill">Official Contest</div>
                                        <div className="timer-pill"><Clock size={14} /> {c.durationMinutes} mins</div>
                                    </div>
                                    <h3>{c.title}</h3>
                                    <p>{c.description || "Test your skills in this coding challenge."}</p>
                                    <div className="card-meta">
                                        <div className="meta-item"><Calendar size={14} /> {new Date(c.startTime).toLocaleDateString()}</div>
                                        <div className="meta-item"><Users size={14} /> {c.participants?.length || 0} Joined</div>
                                    </div>
                                    <Link to={`/exams?contestId=${c._id}`} className="join-btn">
                                        Enter Arena <ArrowRight size={16} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Bell size={48} opacity={0.2} />
                            <h3>No Active Contests</h3>
                            <p>Check back soon or follow our notifications for upcoming events.</p>
                        </div>
                    )}
                </section>

                {pastContests.length > 0 && (
                    <section className="contests-section past-section animate-fade-in delay-3">
                        <div className="section-title">
                            <div className="dot"></div>
                            <h2>Past Challenges</h2>
                        </div>
                        <div className="contest-grid mini">
                            {pastContests.slice(0, 6).map(c => (
                                <div key={c._id} className="contest-card glass-mini">
                                    <h4>{c.title}</h4>
                                    <div className="mini-meta">
                                        <span>{new Date(c.startTime).toLocaleDateString()}</span>
                                        <span>{c.participants?.length || 0} dev2devs</span>
                                    </div>
                                    <Link to={`/leaderboard?contestId=${c._id}`} className="view-results">Leaderboard</Link>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer />

            <style>{`
                .contest-page-root {
                    background: #050508;
                    min-height: 100vh;
                    color: #fff;
                }
                .contest-main {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 120px 2rem 60px;
                }
                .contest-header {
                    text-align: center;
                    margin-bottom: 5rem;
                }
                .trophy-badge {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #6366f1, #a855f7);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
                    color: #fff;
                }
                .contest-header h1 { font-size: 3rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -1px; }
                .contest-header p { font-size: 1.1rem; opacity: 0.6; max-width: 600px; margin: 0 auto 3rem; }
                
                .header-stats {
                    display: flex;
                    justify-content: center;
                    gap: 4rem;
                    padding: 2rem;
                    background: rgba(255,255,255,0.02);
                    border-radius: 24px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .h-stat { display: flex; flex-direction: column; gap: 0.25rem; }
                .h-stat strong { font-size: 2rem; font-weight: 800; color: #818cf8; }
                .h-stat span { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.4; font-weight: 700; }

                .section-title { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; }
                .section-title h2 { font-size: 1.5rem; font-weight: 700; }
                .dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.2); }
                .dot.live { background: #10b981; box-shadow: 0 0 15px #10b981; animation: pulse 2s infinite; }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

                .contest-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
                .contest-card.elite-glass {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 24px;
                    padding: 2rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                .contest-card.elite-glass:hover {
                    background: rgba(255,255,255,0.05);
                    border-color: rgba(99, 102, 241, 0.4);
                    transform: translateY(-8px);
                }
                .card-top { display: flex; justify-content: space-between; margin-bottom: 1.5rem; }
                .type-pill { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; background: rgba(99, 102, 241, 0.1); color: #818cf8; padding: 0.3rem 0.7rem; border-radius: 8px; }
                .timer-pill { font-size: 0.75rem; opacity: 0.5; display: flex; align-items: center; gap: 0.4rem; }
                .contest-card h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; }
                .contest-card p { font-size: 0.95rem; opacity: 0.5; line-height: 1.6; margin-bottom: 2rem; }
                .card-meta { display: flex; gap: 1.5rem; margin-bottom: 2rem; }
                .meta-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; opacity: 0.4; }
                .join-btn {
                    width: 100%;
                    background: #6366f1;
                    color: #fff;
                    padding: 1rem;
                    border-radius: 14px;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    font-weight: 700;
                    transition: 0.2s;
                }
                .join-btn:hover { background: #4f46e5; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.25); }

                .past-section { margin-top: 6rem; opacity: 0.8; }
                .contest-grid.mini { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
                .glass-mini {
                    background: rgba(255,255,255,0.015);
                    border: 1px solid rgba(255,255,255,0.05);
                    padding: 1.25rem;
                    border-radius: 16px;
                }
                .glass-mini h4 { font-size: 1rem; margin-bottom: 0.5rem; opacity: 0.9; }
                .mini-meta { display: flex; justify-content: space-between; font-size: 0.75rem; opacity: 0.4; margin-bottom: 1rem; }
                .view-results { font-size: 0.8rem; font-weight: 700; color: #818cf8; text-decoration: none; }

                .empty-state { text-align: center; padding: 4rem; background: rgba(255,255,255,0.01); border-radius: 24px; border: 1px dashed rgba(255,255,255,0.1); }
                .empty-state h3 { margin: 1.5rem 0 0.5rem; opacity: 0.6; }
                .empty-state p { opacity: 0.3; }

                .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .delay-1 { animation-delay: 0.1s; }
                .delay-2 { animation-delay: 0.2s; }
                .delay-3 { animation-delay: 0.3s; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default Contest;
