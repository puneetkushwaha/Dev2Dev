import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, Clock, Target, ArrowRight, Loader2, Code2, Database, Shield, Cloud, Smartphone, Cpu } from 'lucide-react';

// Helper to map domain names to specific icons and gradient colors
const getDomainStyling = (name) => {
    switch (name) {
        case 'Web Development':
            return { icon: <Code2 size={28} color="#60A5FA" />, gradient: 'linear-gradient(135deg, rgba(96,165,250,0.1) 0%, rgba(96,165,250,0) 100%)', borderColor: '#60A5FA' };
        case 'Data Science':
            return { icon: <Database size={28} color="#34D399" />, gradient: 'linear-gradient(135deg, rgba(52,211,153,0.1) 0%, rgba(52,211,153,0) 100%)', borderColor: '#34D399' };
        case 'Cyber Security':
            return { icon: <Shield size={28} color="#F87171" />, gradient: 'linear-gradient(135deg, rgba(248,113,113,0.1) 0%, rgba(248,113,113,0) 100%)', borderColor: '#F87171' };
        case 'Cloud Computing':
            return { icon: <Cloud size={28} color="#A78BFA" />, gradient: 'linear-gradient(135deg, rgba(167,139,250,0.1) 0%, rgba(167,139,250,0) 100%)', borderColor: '#A78BFA' };
        case 'Mobile App Development':
            return { icon: <Smartphone size={28} color="#FBBF24" />, gradient: 'linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(251,191,36,0) 100%)', borderColor: '#FBBF24' };
        case 'Artificial Intelligence':
            return { icon: <Cpu size={28} color="#F472B6" />, gradient: 'linear-gradient(135deg, rgba(244,114,182,0.1) 0%, rgba(244,114,182,0) 100%)', borderColor: '#F472B6' };
        default:
            return { icon: <Code2 size={28} color="#818CF8" />, gradient: 'linear-gradient(135deg, rgba(129,140,248,0.1) 0%, rgba(129,140,248,0) 100%)', borderColor: '#818CF8' };
    }
};

// Internal styles to avoid external CSS dependency and enforce the Dark aesthetic
const styles = {
    pageBg: {
        padding: '4rem 2rem 8rem 2rem',
        minHeight: '100vh',
        overflowY: 'auto',
        background: '#0B0F19',
        position: 'relative',
        zIndex: 1,
        fontFamily: "'Inter', sans-serif"
    },
    bgOrb1: {
        position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)', zIndex: -1
    },
    bgOrb2: {
        position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw',
        background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(80px)', zIndex: -1
    },
    bgPattern: {
        position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '100vw', height: '100vh',
        background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        zIndex: -1
    }
};

const DomainSelection = () => {
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recommendation, setRecommendation] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            try {
                const domRes = await fetch('http://localhost:5000/api/domains');
                const domData = await domRes.json();
                setDomains(Array.isArray(domData) ? domData.filter(d => d.name !== 'Core Computer Science' && d.name !== 'CoreCS') : []);

                const userRes = await fetch('http://localhost:5000/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const userData = await userRes.json();

                // Removed automatic redirect to dashboard so user can always see domains

                if (userData.aiRecommendation) {
                    setRecommendation(userData.aiRecommendation);
                    setLoading(false);
                } else {
                    setLoading(false);
                    if (Array.isArray(domData) && domData.length > 0) {
                        triggerAiRecommendation(userData, domData, token);
                    }
                }

            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const triggerAiRecommendation = async (user, availableDomains, token) => {
        setAiLoading(true);
        try {
            const domainNames = availableDomains.map(d => d.name);
            const res = await fetch('http://localhost:8000/recommend_domain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    education: user.education || "Unknown",
                    experience: user.experience || "Unknown",
                    skills: user.skills || [],
                    available_domains: domainNames
                })
            });
            const data = await res.json();
            setRecommendation(data);

            // Save recommendation to backend for future caching
            await fetch('http://localhost:5000/api/users/save-recommendation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ recommendation: data })
            });

        } catch (err) {
            console.error("AI Recommendation failed", err);
        } finally {
            setAiLoading(false);
        }
    };

    const handleSelectDomain = (domainName) => {
        navigate(`/domain/${encodeURIComponent(domainName)}`);
    };

    if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0B0F19' }}><Loader2 className="animate-spin" size={48} color="#818CF8" /></div>;

    return (
        <div style={styles.pageBg}>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden' }}>
                <div style={styles.bgOrb1}></div>
                <div style={styles.bgOrb2}></div>
                <div style={styles.bgPattern}></div>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10, animation: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>

                {/* Hero Header */}
                <div style={{ textAlign: 'center', marginBottom: '5rem', marginTop: '2rem' }}>
                    <div style={{
                        marginBottom: '1.5rem',
                        display: 'inline-flex',
                        padding: '0.6rem 1.4rem',
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '30px',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)'
                    }}>
                        <Brain size={16} color="#818CF8" />
                        <span style={{ fontWeight: 600, letterSpacing: '2px', color: '#818CF8', textTransform: 'uppercase', fontSize: '0.8rem' }}>Phase 1: Intelligence Mapping</span>
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                        fontWeight: 800,
                        marginBottom: '1.5rem',
                        lineHeight: 1.1,
                        background: 'linear-gradient(to right, #ffffff, #a5b4fc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0px 4px 20px rgba(165,180,252,0.15))'
                    }}>
                        Select Your Dev Pathway
                    </h1>
                    <p style={{
                        maxWidth: '700px',
                        margin: '0 auto',
                        fontSize: '1.2rem',
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.7
                    }}>
                        Our AI has analyzed your skills and experience. Below is your personalized roadmap recommendation alongside other high-growth industry tracks.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 400px) 1fr', gap: '4rem', alignItems: 'start' }}>

                    {/* Sidebar: Premium AI Box */}
                    <div style={{
                        position: 'sticky',
                        top: '2rem',
                        padding: '3px',
                        borderRadius: '24px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.5) 0%, rgba(139, 92, 246, 0.1) 100%)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(99, 102, 241, 0.15)'
                    }}>
                        <div style={{
                            background: '#0F1222',
                            borderRadius: '21px',
                            padding: '3rem 2rem',
                            height: '100%',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Inner ambient glow */}
                            <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', background: 'rgba(99, 102, 241, 0.2)', filter: 'blur(50px)', borderRadius: '50%', pointerEvents: 'none' }}></div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', marginBottom: '2rem', position: 'relative', zIndex: 2 }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                                    padding: '1.5rem',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                    boxShadow: '0 0 30px rgba(99, 102, 241, 0.3) inset'
                                }}>
                                    <Sparkles size={40} color="#A5B4FC" />
                                </div>
                                <div>
                                    <h3 style={{ color: '#fff', fontSize: '1.6rem', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
                                        AI Recommendation
                                    </h3>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: 0 }}>Tailored to your unique profile</p>
                                </div>
                            </div>

                            <div style={{ position: 'relative', zIndex: 2 }}>
                                {aiLoading ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '3rem 0' }}>
                                        <Loader2 size={40} className="animate-spin" color="#818CF8" />
                                        <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontSize: '1rem', lineHeight: 1.6 }}>Scanning global tech trends<br />and matching with your skills...</p>
                                    </div>
                                ) : recommendation ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.5s ease-out' }}>
                                        <div style={{
                                            background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
                                            color: '#fff',
                                            padding: '1rem 2rem',
                                            borderRadius: '16px',
                                            fontWeight: 800,
                                            fontSize: '1.3rem',
                                            textAlign: 'center',
                                            marginBottom: '2rem',
                                            boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)',
                                            width: '100%',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {recommendation.recommended_domain}
                                        </div>
                                        <div style={{
                                            background: 'rgba(255,255,255,0.02)',
                                            padding: '2rem',
                                            borderRadius: '20px',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.02)'
                                        }}>
                                            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontSize: '1.05rem', margin: 0, fontStyle: 'italic' }}>
                                                "{recommendation.reason}"
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ padding: '3rem 0', textAlign: 'center' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Recommendation temporarily offline.</p>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    <Brain size={14} /> Driven by Dev2Dev Engine
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Premium Grid */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>Explore Tracks</h2>
                                <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.95rem' }}>Select any path to begin your specialized training.</p>
                            </div>
                            <span style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', color: '#A5B4FC', fontWeight: 600 }}>
                                {domains.length} Options
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                            {Array.isArray(domains) && domains.map((domain) => {
                                const style = getDomainStyling(domain.name);

                                return (
                                    <div
                                        key={domain._id}
                                        className="domain-card-wrapper"
                                        style={{
                                            position: 'relative',
                                            borderRadius: '24px',
                                            padding: '2px', // Border width serving as glowing border
                                            background: 'rgba(255,255,255,0.03)',
                                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            cursor: 'pointer',
                                            zIndex: 1
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-12px)';
                                            e.currentTarget.style.background = style.gradient;
                                            e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.5), 0 0 30px ${style.borderColor}30`;
                                            e.currentTarget.querySelector('.domain-glow').style.opacity = '0.2';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.querySelector('.domain-glow').style.opacity = '0';
                                        }}
                                    >
                                        <div style={{
                                            background: '#121626',
                                            borderRadius: '22px',
                                            padding: '2.5rem 2rem',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            zIndex: 2,
                                            overflow: 'hidden'
                                        }}>
                                            {/* Subdued corner glow on hover */}
                                            <div className="domain-glow" style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: style.borderColor, filter: 'blur(60px)', opacity: 0, transition: 'opacity 0.4s ease', pointerEvents: 'none' }}></div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.5rem', position: 'relative', zIndex: 3 }}>
                                                <div style={{
                                                    background: 'rgba(0,0,0,0.3)',
                                                    padding: '1.2rem',
                                                    borderRadius: '16px',
                                                    border: `1px solid ${style.borderColor}40`,
                                                    boxShadow: `0 4px 15px ${style.borderColor}20`
                                                }}>
                                                    {style.icon}
                                                </div>
                                                <h3 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{domain.name}</h3>
                                            </div>

                                            <p style={{ flex: 1, marginBottom: '2.5rem', lineHeight: 1.7, fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', position: 'relative', zIndex: 3 }}>
                                                {domain.description || "Comprehensive curriculum designed by industry experts to take you from beginner to advanced."}
                                            </p>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem', position: 'relative', zIndex: 3 }}>
                                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                                    <span style={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 600 }}>Scope</span>
                                                    <strong style={{ color: '#818cf8', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                                                        <Target size={16} /> {domain.scope || "High"}
                                                    </strong>
                                                </div>
                                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                                    <span style={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 600 }}>Time</span>
                                                    <strong style={{ color: '#F59E0B', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                                                        <Clock size={16} /> {domain.estimatedTime || "3-6 mos"}
                                                    </strong>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleSelectDomain(domain.name)}
                                                style={{
                                                    width: '100%',
                                                    padding: '1.2rem',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    border: `1px solid rgba(255,255,255,0.1)`,
                                                    borderRadius: '14px',
                                                    color: '#fff',
                                                    fontSize: '1rem',
                                                    fontWeight: 600,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    position: 'relative',
                                                    zIndex: 3
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = `${style.borderColor}20`;
                                                    e.currentTarget.style.borderColor = `${style.borderColor}60`;
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = `0 10px 20px ${style.borderColor}20`;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                Select Path <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
            {/* End Container */}

            <style jsx="true">{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default DomainSelection;
