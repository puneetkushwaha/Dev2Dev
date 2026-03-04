import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Play, CheckCircle, Clock, ChevronLeft, Lock, BookOpen,
    Share2, Award, Zap, Loader2, Trophy, Star, Sparkles
} from 'lucide-react';
import axios from 'axios';
import Loader from '../components/Loader';
import { generateCertificate } from '../utils/certificateGenerator';

const API = import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com';

// ── Confetti particle component ───────────────────────────────────────────────
const Confetti = () => {
    const colors = ['#6366f1', '#a855f7', '#f59e0b', '#10b981', '#ef4444', '#3b82f6'];
    const pieces = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        color: colors[i % colors.length],
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
        duration: `${2 + Math.random() * 2}s`,
        size: `${6 + Math.random() * 10}px`,
    }));

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            <style>{`
                @keyframes confettiFall {
                    0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                }
            `}</style>
            {pieces.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: p.left,
                        top: '-20px',
                        width: p.size,
                        height: p.size,
                        background: p.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
                    }}
                />
            ))}
        </div>
    );
};

// ── Celebration Modal ──────────────────────────────────────────────────────────
const CelebrationModal = ({ tutorialTitle, user, tutorial, onClose, onClaim }) => (
    <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, backdropFilter: 'blur(8px)'
    }}>
        <Confetti />
        <div style={{
            position: 'relative', zIndex: 1,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '24px', padding: '3rem', maxWidth: '520px', width: '90%',
            textAlign: 'center', boxShadow: '0 30px 80px rgba(99,102,241,0.3)',
            animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
            <style>{`
                @keyframes popIn {
                    0%   { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1);   opacity: 1; }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50%       { transform: scale(1.1); }
                }
            `}</style>

            <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
                animation: 'pulse 1.5s ease-in-out infinite',
                boxShadow: '0 0 30px rgba(245,158,11,0.5)'
            }}>
                <Trophy size={36} color="#fff" />
            </div>

            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
                Course Complete!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                You've completed <strong style={{ color: '#a78bfa' }}>{tutorialTitle}</strong>!<br />
                Your certificate of completion is ready to download.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                    onClick={onClaim}
                    style={{
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        border: 'none', padding: '1rem', borderRadius: '12px',
                        color: '#fff', fontWeight: 700, fontSize: '1rem',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '0.5rem',
                        boxShadow: '0 10px 30px rgba(99,102,241,0.4)',
                        transition: '0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                    <Award size={18} /> Download Certificate
                </button>
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        padding: '0.75rem', borderRadius: '12px', color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s'
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const TutorialPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tutorial, setTutorial] = useState(null);
    const [activeVideo, setActiveVideo] = useState(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [loading, setLoading] = useState(true);

    // Completion state
    const [completedLessonIds, setCompletedLessonIds] = useState([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [alreadyCertified, setAlreadyCertified] = useState(false);
    const [markingComplete, setMarkingComplete] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);

    const token = localStorage.getItem('token');

    // ── Fetch tutorial + user progress ──────────────────────────────────────
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [tutRes, progressRes] = await Promise.all([
                    axios.get(`${API}/api/tutorials/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    token
                        ? axios.get(`${API}/api/tutorials/${id}/progress`, {
                            headers: { Authorization: `Bearer ${token}` }
                        }).catch(() => ({ data: { completedLessonIds: [], isCompleted: false, alreadyCertified: false } }))
                        : { data: { completedLessonIds: [], isCompleted: false, alreadyCertified: false } }
                ]);

                const tut = tutRes.data;
                setTutorial(tut);

                const sortedLessons = [...tut.lessons].sort((a, b) => a.order - b.order);
                setActiveVideo(sortedLessons[0] || null);

                // Access check
                const userStr = localStorage.getItem('user');
                let unlockedList = [], isUserPremium = false;
                if (userStr) {
                    try {
                        const u = JSON.parse(userStr);
                        unlockedList = (u.unlockedTutorials || []).map(t =>
                            typeof t === 'object' ? t.tutorialId?.toString() : t?.toString()
                        );
                        isUserPremium = u.isPremium === true || (u.proExpiry && new Date(u.proExpiry) > new Date());
                    } catch (_) { }
                }
                setIsUnlocked(isUserPremium || unlockedList.includes(tut._id) || !tut.isPremium);

                // Progress
                const prog = progressRes.data;
                setCompletedLessonIds(prog.completedLessonIds || []);
                setIsCompleted(prog.isCompleted || false);
                setAlreadyCertified(prog.alreadyCertified || false);
            } catch (err) {
                console.error('Error fetching tutorial:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    // ── Helpers ──────────────────────────────────────────────────────────────
    const sortedLessons = tutorial ? [...tutorial.lessons].sort((a, b) => a.order - b.order) : [];

    // A video is accessible if it's the first one, already completed, or right after the last completed
    const getMaxUnlockedIndex = () => {
        // Find how far the user has gotten
        for (let i = sortedLessons.length - 1; i >= 0; i--) {
            if (completedLessonIds.includes(sortedLessons[i]._id?.toString())) {
                return Math.min(i + 1, sortedLessons.length - 1);
            }
        }
        return 0; // Only first video unlocked if nothing completed
    };
    const maxUnlockedIndex = getMaxUnlockedIndex();

    const isLessonUnlocked = (index) => isCompleted || index <= maxUnlockedIndex;
    const isLessonDone = (lesson) => completedLessonIds.includes(lesson._id?.toString());
    const activeIndex = sortedLessons.findIndex(l => l._id === activeVideo?._id);
    const isCurrentDone = activeVideo ? isLessonDone(activeVideo) : false;
    const allDone = isCompleted || (sortedLessons.length > 0 && completedLessonIds.length >= sortedLessons.length);

    // ── Mark current lesson complete ─────────────────────────────────────────
    const handleMarkComplete = async () => {
        if (!activeVideo || isCurrentDone || markingComplete) return;
        setMarkingComplete(true);
        try {
            const res = await axios.post(
                `${API}/api/tutorials/${id}/complete-lesson`,
                { lessonId: activeVideo._id?.toString() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = res.data;
            setCompletedLessonIds(data.completedLessonIds);
            if (data.isCompleted) {
                setIsCompleted(true);
                if (data.justCompleted) {
                    setShowCelebration(true);
                }
            }
            // Auto-advance to next video if there's one and not the last
            if (!data.isCompleted && activeIndex < sortedLessons.length - 1) {
                setActiveVideo(sortedLessons[activeIndex + 1]);
            }
        } catch (err) {
            console.error('Mark complete error:', err);
        } finally {
            setMarkingComplete(false);
        }
    };

    // ── Download certificate ──────────────────────────────────────────────────
    const handleDownloadCertificate = () => {
        if (!tutorial) return;
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : { name: 'Developer' };
        generateCertificate(user, {
            examName: tutorial.title,
            score: 'Complete',
            totalMarks: sortedLessons.length,
            dateRun: new Date()
        }, 'TUTORIAL');
    };

    // ── Checkout ──────────────────────────────────────────────────────────────
    const handleCheckout = async () => {
        try {
            const { data: order } = await axios.post(
                `${API}/api/payment/create-order`,
                { type: 'tutorial', tutorialId: tutorial._id, amount: tutorial.price },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount, currency: order.currency,
                name: 'dev to dev',
                description: `Unlock ${tutorial.title}`,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        await axios.post(`${API}/api/payment/verify-payment`, {
                            ...response, type: 'tutorial', tutorialId: tutorial._id
                        }, { headers: { Authorization: `Bearer ${token}` } });
                        setIsUnlocked(true);
                    } catch { alert('Payment verification failed.'); }
                },
                theme: { color: '#6366f1' }
            };
            new window.Razorpay(options).open();
        } catch { alert('Could not initiate checkout. Please try again.'); }
    };

    if (loading) return <Loader text="Loading tutorial content..." />;
    if (!tutorial) return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <h2>Tutorial not found</h2>
            <button onClick={() => navigate('/tutorials')} style={{ marginTop: '1rem', background: '#6366f1', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Go Back</button>
        </div>
    );

    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : { name: 'Developer' };

    return (
        <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

            {/* Celebration Modal */}
            {showCelebration && (
                <CelebrationModal
                    tutorialTitle={tutorial.title}
                    user={currentUser}
                    tutorial={tutorial}
                    onClose={() => setShowCelebration(false)}
                    onClaim={() => { handleDownloadCertificate(); setShowCelebration(false); }}
                />
            )}

            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(10,10,10,1) 100%)',
                padding: '1.5rem 3rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div>
                    <button onClick={() => navigate('/tutorials')} style={{ background: 'none', border: 'none', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '0.75rem', padding: 0 }}>
                        <ChevronLeft size={16} /> Back to Tutorials
                    </button>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Zap size={24} color="#6366f1" /> {tutorial.title}
                        {allDone && <span style={{ fontSize: '0.75rem', background: 'linear-gradient(135deg,#6366f1,#a855f7)', padding: '0.25rem 0.75rem', borderRadius: '100px', fontWeight: 600 }}>✓ Completed</span>}
                    </h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>PROGRESS</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#6366f1' }}>
                        {completedLessonIds.length}/{sortedLessons.length} lessons
                    </div>
                    {/* Progress bar */}
                    <div style={{ width: '120px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '0.4rem', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', borderRadius: '2px',
                            background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                            width: `${sortedLessons.length > 0 ? (completedLessonIds.length / sortedLessons.length) * 100 : 0}%`,
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex' }}>
                {/* Main content */}
                <main style={{ flex: 1, padding: '2rem 3rem' }}>

                    {/* Video player */}
                    {activeVideo ? (
                        (tutorial.isPremium && !isUnlocked) ? (
                            <div style={{ borderRadius: '24px', aspectRatio: '16/9', background: 'linear-gradient(135deg,#1e1e2f,#0a0a0a)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Lock size={48} color="#fbbf24" style={{ marginBottom: '1rem' }} />
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Premium Series</h2>
                                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Unlock this complete series to access all lessons.</p>
                                <button onClick={handleCheckout} style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', color: '#000', border: 'none', padding: '0.8rem 2.5rem', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
                                    Unlock for ₹{tutorial.price} (1 Year Access)
                                </button>
                            </div>
                        ) : (
                            <div style={{ borderRadius: '24px', overflow: 'hidden', aspectRatio: '16/9', background: '#000', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem', position: 'relative' }}>
                                <iframe
                                    width="100%" height="100%"
                                    src={`https://www.youtube.com/embed/${activeVideo.ytId}?rel=0&modestbranding=1&showinfo=0`}
                                    title={activeVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ border: 'none' }}
                                />
                            </div>
                        )
                    ) : (
                        <div style={{ aspectRatio: '16/9', background: '#111', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <p style={{ color: 'rgba(255,255,255,0.4)' }}>No lessons available.</p>
                        </div>
                    )}

                    {/* Video info + Mark as Watched */}
                    {activeVideo && isUnlocked && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {isCurrentDone && <CheckCircle size={20} color="#10b981" />}
                                    {activeVideo.title}
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '700px' }}>{activeVideo.description}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0 }}>
                                <button style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem 1rem', borderRadius: '10px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                    <Share2 size={16} /> Share
                                </button>
                                <button style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem 1rem', borderRadius: '10px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                    <BookOpen size={16} /> Resources
                                </button>
                                {/* Mark as Watched button */}
                                {!isCurrentDone ? (
                                    <button
                                        onClick={handleMarkComplete}
                                        disabled={markingComplete}
                                        style={{
                                            background: markingComplete ? 'rgba(16,185,129,0.1)' : 'linear-gradient(135deg,#10b981,#059669)',
                                            border: 'none', padding: '0.7rem 1.4rem', borderRadius: '10px',
                                            color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                                            cursor: markingComplete ? 'wait' : 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                                            transition: '0.2s'
                                        }}
                                        onMouseEnter={e => !markingComplete && (e.currentTarget.style.transform = 'translateY(-1px)')}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                                    >
                                        {markingComplete ? <Loader2 size={16} className="spin" /> : <CheckCircle size={16} />}
                                        {markingComplete ? 'Saving...' : 'Mark as Watched'}
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>
                                        <CheckCircle size={16} /> Watched
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>

                {/* Sidebar */}
                <aside style={{ width: '380px', background: '#0a0a0a', borderLeft: '1px solid rgba(255,255,255,0.05)', padding: '2rem 1.5rem', overflowY: 'auto', height: 'calc(100vh - 56px)', position: 'sticky', top: '56px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Curriculum <span style={{ fontSize: '0.8rem', opacity: 0.4 }}>({sortedLessons.length} Lessons)</span>
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {sortedLessons.map((video, index) => {
                            const unlocked = isLessonUnlocked(index);
                            const done = isLessonDone(video);
                            const isActive = activeVideo?._id === video._id;

                            return (
                                <div
                                    key={video._id}
                                    onClick={() => unlocked ? setActiveVideo(video) : null}
                                    title={!unlocked ? 'Complete the previous lesson first' : ''}
                                    style={{
                                        padding: '0.9rem 1rem',
                                        borderRadius: '12px',
                                        background: isActive ? 'rgba(99,102,241,0.12)' : done ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${isActive ? 'rgba(99,102,241,0.3)' : done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)'}`,
                                        cursor: unlocked ? 'pointer' : 'not-allowed',
                                        opacity: unlocked ? 1 : 0.45,
                                        transition: '0.2s',
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        {/* Status icon */}
                                        <div style={{
                                            width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                                            background: done ? 'rgba(16,185,129,0.2)' : isActive ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {done ? <CheckCircle size={14} color="#10b981" /> :
                                                !unlocked ? <Lock size={12} color="rgba(255,255,255,0.3)" /> :
                                                    isActive ? <Play size={14} color="#6366f1" fill="#6366f1" /> :
                                                        <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>{index + 1}</span>}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h5 style={{ margin: '0 0 0.2rem', fontSize: '0.85rem', fontWeight: 600, color: isActive ? '#fff' : done ? '#86efac' : 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {video.title}
                                            </h5>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>
                                                <Clock size={11} /> {video.duration || 'N/A'} • Video
                                                {!unlocked && <span style={{ color: '#f59e0b', fontSize: '0.7rem' }}>🔒 Locked</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Certificate Panel */}
                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#111', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                            <Award size={16} color="#f59e0b" /> Certificate
                        </h4>

                        {allDone ? (
                            <>
                                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: '1rem' }}>
                                    🎉 You've completed this course! Download your official certificate of completion.
                                </p>
                                <button
                                    onClick={handleDownloadCertificate}
                                    style={{
                                        width: '100%', background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                                        border: 'none', padding: '0.85rem', borderRadius: '12px',
                                        color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        boxShadow: '0 8px 20px rgba(99,102,241,0.3)', transition: '0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                                >
                                    <Award size={16} /> Claim Certificate
                                </button>
                            </>
                        ) : (
                            <>
                                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, marginBottom: '1rem' }}>
                                    Complete all {sortedLessons.length} lessons to unlock your certificate.
                                    <br />
                                    <span style={{ color: '#6366f1' }}>{completedLessonIds.length}/{sortedLessons.length} done</span>
                                </p>
                                <button
                                    disabled
                                    style={{
                                        width: '100%', background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.07)', padding: '0.75rem',
                                        borderRadius: '12px', color: 'rgba(255,255,255,0.2)',
                                        fontSize: '0.85rem', fontWeight: 600, cursor: 'not-allowed',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                    }}
                                >
                                    <Lock size={14} /> Complete Course to Unlock
                                </button>
                            </>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default TutorialPlayer;
