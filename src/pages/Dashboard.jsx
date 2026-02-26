import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Target, FileText, Cpu, Brain, Award, ChevronRight, Sparkles, Terminal, Filter, Play } from 'lucide-react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [userData, setUserData] = useState(null);
    const [domains, setDomains] = useState([]);
    const [tutorials, setTutorials] = useState([]);
    const [placeholder, setPlaceholder] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const words = ["Learn Python", "Learn DSA", "Learn Web Dev", "Learn Cyber Security", "Learn Machine Learning"];

    useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % words.length;
            const fullWord = words[i];

            setPlaceholder(isDeleting
                ? fullWord.substring(0, placeholder.length - 1)
                : fullWord.substring(0, placeholder.length + 1)
            );

            setTypingSpeed(isDeleting ? 75 : 150);

            if (!isDeleting && placeholder === fullWord) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && placeholder === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [placeholder, isDeleting, loopNum, typingSpeed]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileRes = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUserData(profileRes.data);

                const [domainsRes, tutorialsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/domains'),
                    axios.get('http://localhost:5000/api/tutorials', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                ]);
                setDomains(domainsRes.data);
                setTutorials(tutorialsRes.data);
            } catch (err) {
                console.error("Dashboard data fetch error:", err);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        // Redirect to learning or specific search results if implemented
        navigate(`/learning`);
    };

    return (
        <div className="dashboard-container animate-fade-in">
            {/* Hero Section */}
            <header className="dashboard-hero">
                <div className="section-container">
                    <h1>Hello, What Do You Want To Learn?</h1>

                    <div className="search-container">
                        <form onSubmit={handleSearch} className="gfg-search-bar">
                            <input
                                type="text"
                                placeholder={placeholder + (placeholder ? "|" : "Learn...")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ textAlign: 'left' }}
                            />
                        </form>
                    </div>

                    <div className="search-badges">
                        {(domains.length > 0 ? domains.slice(0, 5).map(d => d.name) : ['DSA Online', 'Master DS & ML', 'Full Stack Dev', 'Cyber Security', 'DevOps']).map(tag => (
                            <span key={tag} className="search-badge" onClick={() => navigate(`/domain/${tag}`)}>{tag}</span>
                        ))}
                    </div>
                </div>
            </header>

            <div className="section-container">
                {/* Premium AI Career Journey Banner */}
                <div className="promotional-banner">
                    <div className="promo-content">
                        <h2>Propel Your Career <br /> with Dev2Dev AI</h2>
                        <p>Master the skills that matter. Land the job you deserve. Our AI-driven paths provide the unfair advantage you need in today's tech world.</p>
                        <div style={{ marginTop: '2rem' }}>
                            <button onClick={() => navigate('/learning')} className="btn-brand" style={{ background: 'var(--gfg-brand)', border: 'none', color: '#fff', padding: '1rem 2.5rem', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '1.05rem', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)' }}>Resume Your AI Path</button>
                        </div>
                    </div>

                    <div className="promo-steps">
                        <div className="promo-card">
                            <div className="icon-box"><Brain size={20} /></div>
                            <h4>Precision Roadmaps</h4>
                            <p>AI-curated topics tailored specifically to your dream role.</p>
                        </div>
                        <div className="promo-card">
                            <div className="icon-box"><Target size={20} /></div>
                            <h4>Job Readiness</h4>
                            <p>Real-time stats on your interview and coding performance.</p>
                        </div>
                        <div className="promo-card">
                            <div className="icon-box"><Award size={20} /></div>
                            <h4>Elite Certification</h4>
                            <p>Validate your expertise with industry-recognized mocks.</p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content Grid */}
                <div className="dashboard-sections">
                    <main className="main-column">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Recommended for You</h2>
                            <button onClick={() => navigate('/onboarding')} style={{ background: 'transparent', border: 'none', color: 'var(--gfg-brand)', fontWeight: 'bold', cursor: 'pointer' }}>Explore All <ChevronRight size={16} /></button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            {domains.slice(0, 4).map(domain => (
                                <div key={domain._id} className="course-card" onClick={() => navigate(`/domain/${domain.name}`)}>
                                    <div className="course-img">
                                        {domain.name.includes('AI') ? <Cpu /> : <Terminal />}
                                    </div>
                                    <div className="course-info">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span className="badge-tag">Self-Paced</span>
                                            <span style={{ fontSize: '0.75rem', color: '#f1c40f', fontWeight: 'bold' }}>⭐ Premium</span>
                                        </div>
                                        <h3>{domain.name}</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--gfg-text-muted)', marginBottom: '1rem' }}>Master {domain.name} with AI-curated roadmaps and projects.</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gfg-brand)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                            View Roadmap <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>

                    <aside className="sidebar-column">
                        <div className="sidebar-card">
                            <h4>Current Progress</h4>
                            {userData?.selectedDomain ? (
                                <div>
                                    <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{userData.selectedDomain}</p>
                                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                        <div style={{ height: '100%', width: `${userData.progressPercentage || 0}%`, background: 'var(--gfg-brand)', transition: 'width 1s ease-in-out' }}></div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '1rem', opacity: 0.6 }}>
                                        <span>Progress</span>
                                        <span>{userData.progressPercentage || 0}%</span>
                                    </div>
                                    <button onClick={() => navigate('/learning')} className="btn-outline" style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}>Continue Learning</button>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '1rem' }}>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--gfg-text-muted)', marginBottom: '1rem' }}>No active track found.</p>
                                    <button onClick={() => navigate('/onboarding')} className="btn-brand" style={{ background: 'var(--gfg-brand)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Start Onboarding</button>
                                </div>
                            )}
                        </div>

                        <div className="sidebar-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <h4>Recent Performance</h4>
                            {userData?.examScores?.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Last Exam:</span>
                                        <span style={{ fontWeight: '700', color: userData.examScores[userData.examScores.length - 1].passed ? '#818cf8' : '#ef4444', fontSize: '0.9rem' }}>
                                            {userData.examScores[userData.examScores.length - 1].score}/{userData.examScores[userData.examScores.length - 1].totalMarks}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Avg. Accuracy:</span>
                                        <span style={{ fontWeight: '700', color: 'var(--gfg-brand)', fontSize: '0.9rem' }}>{userData.avgScore}%</span>
                                    </div>
                                    <button onClick={() => navigate('/exams')} className="btn-outline" style={{ width: '100%', fontSize: '0.75rem', padding: '0.4rem', marginTop: '0.25rem' }}>View All Results</button>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--gfg-text-muted)', marginBottom: '0.75rem' }}>Take your first exam to see stats.</p>
                                    <button onClick={() => navigate('/exams')} className="btn-brand" style={{ background: 'var(--gfg-brand)', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Browse Exams</button>
                                </div>
                            )}
                        </div>

                        <div className="sidebar-card">
                            <h4>Quick Actions</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div onClick={() => navigate('/exams')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.4rem' }} className="hover-nav">
                                    <Award size={18} color="#f1c40f" /> <span>Certification Exams</span>
                                </div>
                                <div onClick={() => navigate('/interview')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.4rem' }} className="hover-nav">
                                    <Target size={18} color="#e74c3c" /> <span>AI Mock Interview</span>
                                </div>
                                <div onClick={() => navigate('/resume')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.4rem' }} className="hover-nav">
                                    <FileText size={18} color="#3498db" /> <span>Resume Analyzer</span>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(18, 18, 18, 1) 100%)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Sparkles size={18} color="var(--gfg-brand)" />
                                <h4 style={{ margin: 0, border: 'none', color: 'var(--gfg-brand)' }}>Try Dev2Dev AI</h4>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--gfg-text-muted)' }}>Get personalized career guidance and instant code reviews from our Expert AI Teacher.</p>
                        </div>
                    </aside>
                </div>
            </div>

            <style>{`
                .hover-nav:hover { color: var(--gfg-brand); transform: translateX(5px); }
                .dashboard-container { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default Dashboard;
