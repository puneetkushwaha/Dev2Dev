import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Briefcase, DollarSign, Activity, CheckCircle, ShieldCheck, Cpu, Code2, Cloud, Database, Smartphone, Loader2, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { domainDetails, defaultDomain } from '../data/domainData';

const DomainOverview = () => {
    const { domainName } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dbTopics, setDbTopics] = useState([]);
    const [topicsLoading, setTopicsLoading] = useState(true);

    // Decode URL param
    const decodedName = decodeURIComponent(domainName);
    const details = domainDetails[decodedName] || defaultDomain;

    // Fetch topics from MongoDB
    useEffect(() => {
        const fetchTopics = async () => {
            setTopicsLoading(true);
            try {
                const domainsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/domains`);
                const domain = domainsRes.data.find(d => d.name === decodedName);
                if (!domain) { setDbTopics([]); return; }
                const topicsRes = await axios.get(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/domains/topics/by-domain/${domain._id}`
                );
                setDbTopics(topicsRes.data || []);
            } catch (err) {
                console.warn('Could not load topics from DB', err.message);
                setDbTopics([]);
            } finally {
                setTopicsLoading(false);
            }
        };
        fetchTopics();
    }, [decodedName]);

    const handleConfirm = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/select-domain`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ domainName: decodedName })
            });
            if (res.ok) {
                // Persist domain selection locally for refresh persistence
                localStorage.setItem('selectedDomain', decodedName);
                navigate('/learning');
            } else {
                alert('Failed to save your track. Try again.');
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div style={{
            padding: '4rem 2rem 8rem 2rem',
            minHeight: '100vh',
            overflowY: 'auto',
            background: '#0B0F19',
            position: 'relative',
            zIndex: 1,
            fontFamily: "'Inter', sans-serif",
            color: '#fff'
        }}>
            {/* Background */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '60vw',
                    background: `radial-gradient(circle, ${details.color}15 0%, rgba(0,0,0,0) 70%)`,
                    filter: 'blur(80px)'
                }}></div>
                <div style={{
                    position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '100vw', height: '100vh',
                    background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                }}></div>
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 10, animation: 'fadeIn 0.5s ease' }}>

                <button
                    onClick={() => navigate('/onboarding')}
                    style={{
                        background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                        padding: '0.5rem 0', marginBottom: '2rem', fontSize: '1rem',
                        transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >
                    <ArrowLeft size={18} /> Back to Domains
                </button>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.4)',
                        padding: '1.5rem',
                        borderRadius: '24px',
                        border: `1px solid ${details.color}40`,
                        boxShadow: `0 0 40px ${details.color}20`
                    }}>
                        {details.icon}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-1px' }}>{decodedName}</h1>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', margin: 0 }}>Track Overview & Curriculum</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
                    {/* Intro & Roles */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontSize: '1.3rem', margin: '0 0 1rem 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <BookOpen size={20} color={details.color} /> About This Track
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '1.05rem', margin: 0 }}>
                                {details.description}
                            </p>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontSize: '1.3rem', margin: '0 0 1.5rem 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={20} color={details.color} /> What You Will Learn (A-Z)
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {topicsLoading ? (
                                    <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.4 }}>
                                        <Loader2 size={20} className="animate-spin" style={{ margin: '0 auto' }} />
                                        <p style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>Loading curriculum...</p>
                                    </div>
                                ) : dbTopics.length > 0 ? (
                                    dbTopics.map((topic, idx) => (
                                        <div key={topic._id || idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ minWidth: '8px', height: '8px', borderRadius: '50%', background: details.color }}></div>
                                                <div>
                                                    <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem' }}>{topic.title}</span>
                                                    {topic.level && <span style={{ marginLeft: '0.6rem', fontSize: '0.72rem', opacity: 0.4, fontWeight: 600 }}>{topic.level}</span>}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/learning?topic=${encodeURIComponent(topic.title)}`, { state: { domain: decodedName, topic: topic } })}
                                                style={{ background: 'transparent', border: 'none', color: details.color, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                            >
                                                Start <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.35 }}>
                                        <p style={{ fontSize: '0.95rem' }}>No topics added yet.</p>
                                        <p style={{ fontSize: '0.8rem', marginTop: '0.4rem' }}>Add topics via Admin Panel → Course Data → {decodedName}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Stats & CTA */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                <DollarSign size={24} color="#818cf8" style={{ margin: '0 auto 0.5rem auto' }} />
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Avg Salary</div>
                                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#818cf8' }}>{details.salary}</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                <Activity size={24} color="#F59E0B" style={{ margin: '0 auto 0.5rem auto' }} />
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Difficulty</div>
                                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#F59E0B' }}>{details.difficulty}</div>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontSize: '1.3rem', margin: '0 0 1.5rem 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Briefcase size={20} color={details.color} /> Career Options (Job Roles)
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                {details.roles.map((role, idx) => (
                                    <span key={idx} style={{
                                        background: `rgba(255,255,255,0.05)`,
                                        border: `1px solid rgba(255,255,255,0.1)`,
                                        padding: '0.6rem 1rem',
                                        borderRadius: '30px',
                                        fontSize: '0.95rem',
                                        color: '#fff'
                                    }}>
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            background: details.gradient,
                            borderRadius: '24px',
                            padding: '3rem 2rem',
                            border: `1px solid ${details.color}40`,
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1.5rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.6rem', margin: '0 0 0.5rem 0', fontWeight: 800 }}>Ready to Master This?</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                                    Lock in your track. We will tailor your entire learning experience, exams, and mock interviews for <strong style={{ color: '#fff' }}>{decodedName}</strong>.
                                </p>
                            </div>
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    maxWidth: '300px',
                                    padding: '1.2rem',
                                    background: details.color,
                                    border: 'none',
                                    borderRadius: '16px',
                                    color: '#000',
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    boxShadow: `0 10px 30px ${details.color}40`,
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-3px)' }}
                                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(0)' }}
                            >
                                {loading ? <Loader2 size={24} className="animate-spin" /> : "Continue & Start Learning"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx="true">{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default DomainOverview;
