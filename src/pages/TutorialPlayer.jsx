import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, CheckCircle, Clock, ChevronLeft, Lock, BookOpen, Share2, Award, Zap, Loader2 } from 'lucide-react';
import axios from 'axios';

const TutorialPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tutorial, setTutorial] = useState(null);
    const [activeVideo, setActiveVideo] = useState(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutorial = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/tutorials/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTutorial(res.data);
                if (res.data.lessons.length > 0) {
                    setActiveVideo(res.data.lessons[0]);
                }

                const userString = localStorage.getItem('user');
                let unlockedList = [];
                if (userString) {
                    try {
                        const user = JSON.parse(userString);
                        unlockedList = user.unlockedTutorials || [];
                    } catch (e) { }
                }
                setIsUnlocked(unlockedList.includes(res.data._id));

                setLoading(false);
            } catch (err) {
                console.error('Error fetching tutorial:', err);
                setLoading(false);
            }
        };
        fetchTutorial();
    }, [id]);

    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data: order } = await axios.post('http://localhost:5000/api/payment/create-order',
                { type: 'tutorial', tutorialId: tutorial._id, amount: tutorial.price },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "dev to dev",
                description: `Unlock ${tutorial.title}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post('http://localhost:5000/api/payment/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            type: 'tutorial',
                            tutorialId: tutorial._id
                        }, { headers: { Authorization: `Bearer ${token}` } });

                        if (verifyRes.data.unlockedTutorials && verifyRes.data.unlockedTutorials.includes(tutorial._id)) {
                            setIsUnlocked(true);

                            // Update local storage
                            const userString = localStorage.getItem('user');
                            if (userString) {
                                const user = JSON.parse(userString);
                                user.unlockedTutorials = verifyRes.data.unlockedTutorials;
                                localStorage.setItem('user', JSON.stringify(user));
                            }
                            alert("Tutorial Unlocked successfully!");
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

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" size={40} color="#6366f1" />
        </div>
    );

    if (!tutorial) return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <h2>Tutorial not found</h2>
            <button onClick={() => navigate('/tutorials')} style={{ marginTop: '1rem', background: '#6366f1', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Go Back</button>
        </div>
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            {/* Header / Breadcrumbs area */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(10, 10, 10, 1) 100%)',
                padding: '1.5rem 3rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <button
                        onClick={() => navigate('/tutorials')}
                        style={{ background: 'none', border: 'none', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '0.75rem', padding: 0 }}
                    >
                        <ChevronLeft size={16} /> Back to Tutorials
                    </button>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Zap size={24} color="#6366f1" /> {tutorial.title}
                    </h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>PLAYING</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#6366f1' }}>Lesson {tutorial.lessons.findIndex(l => l._id === activeVideo?._id) + 1} of {tutorial.lessons.length}</div>
                </div>
            </div>

            <div style={{ display: 'flex', height: 'auto' }}>
                {/* Main Content Area */}
                <main style={{ flex: 1, padding: '2rem 3rem' }}>
                    {/* Video Player Section */}
                    {activeVideo ? (
                        (tutorial.isPremium && !isUnlocked) ? (
                            <div style={{
                                borderRadius: '24px',
                                overflow: 'hidden',
                                aspectRatio: '16/9',
                                background: 'linear-gradient(135deg, #1e1e2f 0%, #0a0a0a 100%)',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                marginBottom: '1.5rem',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Lock size={48} color="#fbbf24" style={{ marginBottom: '1rem' }} />
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Premium Series</h2>
                                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Unlock this complete series to access all lessons and resources.</p>
                                <button style={{
                                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                    color: '#000',
                                    border: 'none',
                                    padding: '0.8rem 2.5rem',
                                    borderRadius: '12px',
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 25px -5px rgba(251, 191, 36, 0.4)'
                                }} onClick={handleCheckout}>Unlock for ₹{tutorial.price} (1 Year Access)</button>
                            </div>
                        ) : (
                            <div style={{
                                borderRadius: '24px',
                                overflow: 'hidden',
                                aspectRatio: '16/9',
                                background: '#000',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                marginBottom: '1.5rem',
                                position: 'relative'
                            }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${activeVideo.ytId}?rel=0&modestbranding=1&showinfo=0`}
                                    title={activeVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ border: 'none' }}
                                ></iframe>
                            </div>
                        )
                    ) : (
                        <div style={{ aspectRatio: '16/9', background: '#111', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <p style={{ color: 'rgba(255,255,255,0.4)' }}>No lessons available for this series.</p>
                        </div>
                    )}

                    {activeVideo && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{activeVideo.title}</h2>
                                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '800px' }}>{activeVideo.description}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.9rem'
                                }}>
                                    <Share2 size={16} /> Share
                                </button>
                                <button style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.9rem'
                                }}>
                                    <BookOpen size={16} /> Resources
                                </button>
                            </div>
                        </div>
                    )}
                </main>

                {/* Sidebar Curriculum */}
                <aside style={{
                    width: '380px',
                    background: '#0a0a0a',
                    borderLeft: '1px solid rgba(255,255,255,0.05)',
                    padding: '2rem 1.5rem',
                    overflowY: 'auto',
                    height: 'calc(100vh - 56px)',
                    position: 'sticky',
                    top: '56px'
                }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Curriculum <span style={{ fontSize: '0.8rem', opacity: 0.4 }}>({tutorial.lessons.length} Lessons)</span>
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {tutorial.lessons.sort((a, b) => a.order - b.order).map((video, index) => (
                            <div
                                key={video._id}
                                onClick={() => setActiveVideo(video)}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '16px',
                                    background: activeVideo?._id === video._id ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${activeVideo?._id === video._id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                                    cursor: 'pointer',
                                    transition: '0.2s cubic-bezier(0.165, 0.84, 0.44, 1)'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '8px',
                                        background: activeVideo?._id === video._id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {activeVideo?._id === video._id ? <Play size={14} color="#6366f1" fill="#6366f1" /> : (
                                            <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>{index + 1}</span>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h5 style={{
                                            margin: '0 0 0.25rem 0',
                                            fontSize: '0.9rem',
                                            fontWeight: 700,
                                            color: activeVideo?._id === video._id ? '#fff' : 'rgba(255,255,255,0.8)'
                                        }}>{video.title}</h5>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {video.duration || 'N/A'}</span>
                                            <span>•</span>
                                            <span>Video</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#111', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Award size={16} color="#f59e0b" /> Certificate
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, marginBottom: '1rem' }}>
                            Complete all {tutorial.lessons.length} lessons to download your certificate of completion.
                        </p>
                        <button style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', padding: '0.6rem', borderRadius: '10px', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'not-allowed' }}>Claim Certificate</button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default TutorialPlayer;
