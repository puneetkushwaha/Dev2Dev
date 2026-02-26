import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Target, MonitorPlay, ChevronRight, Activity, Users, FileText, Code2, Briefcase, Loader2, Lock, Sparkles, Trophy, Star, Search, LogIn, Clock, Zap, ArrowRight } from 'lucide-react';

const InterviewPrep = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedMock, setSelectedMock] = useState(null);
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/users/mock-stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data || {});
            } catch (err) {
                console.error("Failed to fetch mock stats:", err);
            } finally {
                const userString = localStorage.getItem('user');
                if (userString) {
                    try {
                        const user = JSON.parse(userString);
                        setIsPro(user.hasProAccess || user.isPro === true);
                    } catch (e) { }
                }
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const freeMocks = [
        {
            type: 'Online Assessment',
            title: 'Digital Qualifier',
            desc: 'Simulate the first hurdle. 2 questions, 60 minutes. Randomized for every attempt.',
            path: 'Online Assessment',
            color: 'hsl(250, 100%, 70%)'
        },
        {
            type: 'Phone Interview',
            title: 'Technical Screen',
            desc: 'Deep dive into 1 core problem. Focus on communication and clean logic.',
            path: 'Phone Interview',
            color: 'hsl(180, 100%, 45%)'
        },
        {
            type: 'Onsite Interview',
            title: 'Onsite Loop',
            desc: 'The final boss. 3 questions back-to-back. Tests endurance and edge cases.',
            path: 'Onsite Interview',
            color: 'hsl(320, 100%, 65%)'
        }
    ];

    const premiumCompanies = [
        { name: 'Google', sets: 13, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
        { name: 'Meta', sets: 12, logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
        { name: 'Amazon', sets: 13, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
        { name: 'Microsoft', sets: 8, logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
        { name: 'Apple', sets: 7, logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
        { name: 'Netflix', sets: 5, logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
        { name: 'Uber', sets: 4, logo: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg' },
        { name: 'Airbnb', sets: 3, logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Belo.svg' }
    ];

    const getStat = (id) => stats[id] || { attempts: 0, successRate: "0%" };

    const handleStartMock = (mock) => {
        setSelectedMock(mock);
        setShowModal(true);
    };

    const confirmStart = () => {
        if (selectedMock) {
            navigate(`/mock-assessment?type=${encodeURIComponent(selectedMock.path)}`);
            setShowModal(false);
        }
    };

    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data: order } = await axios.post('http://localhost:5000/api/payment/create-order',
                { type: 'pro', amount: 49 }, // e.g. 49 INR for Pro
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Dev2Dev",
                description: "Pro Interview Prep (1 Year Access)",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post('http://localhost:5000/api/payment/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            type: 'pro'
                        }, { headers: { Authorization: `Bearer ${token}` } });

                        if (verifyRes.data.isPro) {
                            setIsPro(true);
                            // Update local storage
                            const userString = localStorage.getItem('user');
                            if (userString) {
                                const user = JSON.parse(userString);
                                user.isPro = true;
                                localStorage.setItem('user', JSON.stringify(user));
                            }
                            alert("Payment Successful! You are now a Pro member.");
                        }
                    } catch (error) {
                        console.error("Payment verification failed", error);
                        alert("Payment verification failed.");
                    }
                },
                theme: {
                    color: "#6366f1"
                }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp1.open();
        } catch (error) {
            console.error("Error initiating checkout:", error);
            alert("Could not initiate checkout. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ height: '100vh', background: '#020205' }}>
                <div className="loader-container">
                    <Loader2 size={48} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
                    <div className="pulse-circle"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="ip-main">
            {/* Background Decorative Elements */}
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>

            <div className="container" style={{ position: 'relative', zIndex: 10, padding: '4rem 1.5rem' }}>
                {/* Hero section */}
                <div className="ip-hero animate-fade-in">
                    <div className="flex" style={{ gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
                        <Sparkles size={18} />
                        <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.2em' }}>NEXT-GEN MOCK PLATFORM</span>
                    </div>
                    <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                        Ace Your <span className="gradient-text">Dream Interview</span>
                    </h1>
                    <p className="text-muted" style={{ maxWidth: '600px', fontSize: '1.2rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                        Battle-tested assessment sets from the world's most innovative tech giants. Randomized logic. Real-world constraints.
                    </p>
                </div>

                {/* Free Tier */}
                <div className="ip-grid" style={{ marginTop: '4rem' }}>
                    {freeMocks.map((mock, idx) => {
                        const s = getStat(mock.path);
                        return (
                            <div key={idx} className="premium-card animate-fade-in" style={{ animationDelay: `${idx * 0.15}s` }}>
                                <div className="card-accent" style={{ background: mock.color }}></div>
                                <div className="card-top">
                                    <span className="type-badge" style={{ color: mock.color }}>{mock.type}</span>
                                    <h3 className="card-title">{mock.title}</h3>
                                </div>
                                <p className="card-desc">{mock.desc}</p>

                                <div className="card-stats">
                                    <div className="card-stat">
                                        <Users size={14} />
                                        <span>{s.attempts} Global Attempts</span>
                                    </div>
                                    <div className="card-stat">
                                        <Activity size={14} />
                                        <span>{s.successRate} Pass Rate</span>
                                    </div>
                                </div>

                                <button className="start-btn-v2" onClick={() => handleStartMock(mock)}>
                                    <span>Practice Now</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Company Grid */}
                <div style={{ marginTop: '6rem' }}>
                    <div className="flex-between" style={{ marginBottom: '3rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Company Playloads</h2>
                            <p className="text-muted">Unlock deep-insights into specific company hiring bars.</p>
                        </div>
                        {!isPro && (
                            <button className="premium-btn" onClick={handleCheckout}>
                                <Trophy size={16} />
                                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
                                    <span>Go Pro for ₹49</span>
                                    <span style={{ fontSize: '0.65rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>1 Year Access</span>
                                </span>
                            </button>
                        )}
                    </div>

                    <div className="comp-grid">
                        {premiumCompanies.map((comp, idx) => {
                            const s = getStat(comp.name);
                            return (
                                <div
                                    key={idx}
                                    className={`comp-card glass-panel animate-fade-in ${!isPro ? 'locked-state' : ''}`}
                                    style={{ animationDelay: `${(idx + 4) * 0.05}s`, cursor: isPro ? 'pointer' : 'not-allowed' }}
                                    onClick={() => {
                                        if (isPro) {
                                            handleStartMock({ title: `${comp.name} Playload`, desc: `Full ${comp.name} interview simulation`, path: 'Onsite Interview', type: 'Pro Set' });
                                        } else {
                                            handleCheckout();
                                        }
                                    }}
                                >
                                    <div className="comp-logo-box">
                                        <img src={comp.logo} alt={comp.name} />
                                    </div>
                                    <div className="comp-info">
                                        <h4>{comp.name}</h4>
                                        <div className="comp-meta">
                                            <span style={{ color: 'var(--accent-primary)' }}>{comp.sets} Sets</span>
                                            <span className="dot"></span>
                                            <span style={{ color: 'var(--success)' }}>{s.successRate}</span>
                                        </div>
                                    </div>
                                    {!isPro && (
                                        <div className="comp-lock">
                                            <Lock size={14} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Start Mock Confirmation Modal */}
            {showModal && selectedMock && (
                <div className="modal-overlay animate-fade-in" onClick={(e) => e.target.className.includes('modal-overlay') && setShowModal(false)}>
                    <div className="modal-container glass-panel animate-slide-up">
                        <div className="modal-header">
                            <h2>Start Mock Assessment</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="category-tag">{selectedMock.type.toUpperCase()}</div>

                            <ul className="modal-bullets">
                                <li>Each session will include up to {selectedMock.path === 'Onsite Interview' ? '3' : selectedMock.path === 'Phone Interview' ? '1' : '2'} questions.</li>
                                <li>You will have 1 hour and 15 minutes to complete all questions.</li>
                                <li>Once a mock assessment session begins, you <strong>cannot</strong> pause the timer.</li>
                                <li>The mock assessment session will end when you have successfully submitted code for each question, the allotted time has expired, or you end the session manually.</li>
                            </ul>

                            <p className="good-luck">Good Luck!</p>
                        </div>

                        <div className="modal-footer">
                            <button className="cancel-link" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="confirm-start-btn" onClick={confirmStart}>
                                Start Mock Assessment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .ip-main {
                    background: #020205;
                    min-height: 100vh;
                    overflow: hidden;
                    position: relative;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(8px);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                }

                .modal-container {
                    width: 100%;
                    max-width: 580px;
                    background: var(--bg-secondary) !important;
                    border: 1px solid rgba(255, 255, 255, 0.15) !important;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .modal-header h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0;
                    color: #fff;
                }

                .close-btn {
                    background: transparent;
                    border: none;
                    color: #666;
                    font-size: 1.5rem;
                    cursor: pointer;
                    line-height: 1;
                }

                .modal-body {
                    padding: 2rem;
                }

                .category-tag {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--text-secondary);
                    margin-bottom: 1.5rem;
                    letter-spacing: 0.05em;
                }

                .modal-bullets {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 2rem 0;
                }

                .modal-bullets li {
                    position: relative;
                    padding-left: 1.5rem;
                    margin-bottom: 1rem;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.95rem;
                    line-height: 1.5;
                }

                .modal-bullets li::before {
                    content: "•";
                    position: absolute;
                    left: 0;
                    color: #fff;
                    font-size: 1.2rem;
                }

                .good-luck {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.95rem;
                }

                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 2rem;
                    padding: 1.5rem 2rem;
                    background: rgba(255, 255, 255, 0.02);
                }

                .cancel-link {
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    font-weight: 500;
                    cursor: pointer;
                    padding: 0.5rem;
                    transition: color 0.2s;
                }

                .cancel-link:hover {
                    color: #fff;
                }

                .confirm-start-btn {
                    background: #394d5d;
                    color: #fff;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .confirm-start-btn:hover {
                    background: #475d6f;
                    transform: translateY(-1px);
                }

                .animate-slide-up {
                    animation: slideUp 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
                }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(120px);
                    z-index: 1;
                    opacity: 0.15;
                }

                .orb-1 {
                    width: 400px;
                    height: 400px;
                    background: var(--accent-primary);
                    top: -100px;
                    right: -100px;
                }

                .orb-2 {
                    width: 300px;
                    height: 300px;
                    background: #ff00ff;
                    bottom: 100px;
                    left: -50px;
                }

                .gradient-text {
                    background: linear-gradient(135deg, #fff 0%, var(--accent-primary) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .stat-pill {
                    display: flex;
                    flex-direction: column;
                }

                .stat-val {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #fff;
                }

                .stat-label {
                    font-size: 0.7rem;
                    color: var(--text-secondary);
                    letter-spacing: 0.1em;
                    font-weight: 700;
                }

                .ip-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 2rem;
                }

                .premium-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 24px;
                    padding: 2.5rem;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .premium-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    transform: translateY(-10px);
                    border-color: rgba(255, 255, 255, 0.2);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }

                .card-accent {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 100px;
                    height: 100px;
                    filter: blur(60px);
                    opacity: 0.2;
                    transition: opacity 0.4s;
                }

                .premium-card:hover .card-accent {
                    opacity: 0.5;
                }

                .type-badge {
                    font-size: 0.7rem;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 0.5rem;
                    display: block;
                }

                .card-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }

                .card-desc {
                    color: var(--text-secondary);
                    font-size: 1rem;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }

                .card-stats {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                }

                .card-stat {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                }

                .start-btn-v2 {
                    width: 100%;
                    padding: 1rem;
                    border-radius: 14px;
                    background: #fff;
                    color: #000;
                    border: none;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .start-btn-v2:hover {
                    gap: 1.2rem;
                    background: var(--accent-primary);
                    color: #fff;
                }

                .premium-btn {
                    padding: 0.6rem 1.2rem;
                    border-radius: 100px;
                    background: linear-gradient(45deg, var(--accent-primary), #ff00ff);
                    border: none;
                    color: #fff;
                    font-weight: 700;
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
                }

                .comp-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 1.5rem;
                }

                .comp-card {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    padding: 1.25rem;
                    position: relative;
                    transition: all 0.3s;
                }

                .locked-state {
                    cursor: not-allowed;
                    filter: grayscale(0.5);
                }

                .comp-card:hover {
                    filter: grayscale(0);
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .comp-logo-box {
                    width: 48px;
                    height: 48px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px;
                }

                .comp-logo-box img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    filter: brightness(1.2);
                }

                .comp-info h4 {
                    font-size: 1.1rem;
                    margin: 0 0 0.25rem 0;
                }

                .comp-meta {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .dot {
                    width: 3px;
                    height: 3px;
                    background: var(--text-secondary);
                    border-radius: 50%;
                }

                .comp-lock {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    color: var(--text-secondary);
                    opacity: 0.5;
                }

                .loader-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pulse-circle {
                    position: absolute;
                    width: 80px;
                    height: 80px;
                    border: 2px solid var(--accent-primary);
                    border-radius: 50%;
                    animation: pulse 1.5s infinite;
                    opacity: 0;
                }

                @keyframes pulse {
                    0% { transform: scale(0.5); opacity: 0.5; }
                    100% { transform: scale(1.5); opacity: 0; }
                }

                @media (max-width: 768px) {
                    h1 { font-size: 2.5rem !important; }
                    .comp-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default InterviewPrep;
