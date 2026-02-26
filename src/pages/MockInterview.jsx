import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, Square, FileText, CheckCircle, UploadCloud, User, Briefcase, Loader2, Play, Volume2, ArrowRight, AlertCircle, RefreshCw, Cpu, AlertTriangle, BookOpen, Zap, Lock, Trophy } from 'lucide-react';
import axios from 'axios';

const Waveform = ({ active, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '30px' }}>
        {[1, 2, 3, 4, 5, 2, 4, 1, 3, 5].map((h, i) => (
            <div
                key={i}
                style={{
                    width: '3px',
                    height: active ? `${h * 4}px` : '4px',
                    background: color,
                    borderRadius: '10px',
                    transition: 'height 0.2s ease-in-out',
                    animation: active ? `wave 1s ease-in-out infinite ${i * 0.1}s` : 'none'
                }}
            />
        ))}
    </div>
);

const StatRing = ({ value, label, color, icon: Icon }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="stat-ring-container" style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', transition: '0.3s' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1.5rem' }}>
                <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                        cx="50" cy="50" r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 2s ease-out' }}
                    />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>{value}%</span>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: color }}>
                <Icon size={14} />
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
            </div>
        </div>
    );
};

const MockInterview = () => {
    // Stage: 'setup', 'interviewing', 'analysing', 'results'
    const [stage, setStage] = useState('setup');
    const [jobProfile, setJobProfile] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [isAITyping, setIsAITyping] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState('');

    const [isPro, setIsPro] = useState(false);
    const [freeAiInterviewCount, setFreeAiInterviewCount] = useState(0);
    const navigate = useNavigate();

    // Check Pro limits on mount by fetching fresh data from backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const user = res.data;
                setIsPro(user.hasProAccess || user.isPro === true);
                setFreeAiInterviewCount(user.freeAiInterviewCount || 0);

                // Keep local storage in sync with DB truth
                const localUserString = localStorage.getItem('user');
                let localUser;
                if (localUserString) {
                    try {
                        localUser = JSON.parse(localUserString);
                    } catch (e) {
                        localUser = {};
                    }
                } else {
                    localUser = {};
                }
                localUser.freeAiInterviewCount = user.freeAiInterviewCount;
                localUser.hasProAccess = user.hasProAccess;
                localUser.isPro = user.isPro;
                localStorage.setItem('user', JSON.stringify(localUser));
            } catch (err) {
                console.error("Failed to fetch fresh user profile", err);
                // Fallback to local storage if network request fails
                const userString = localStorage.getItem('user');
                if (userString) {
                    try {
                        const user = JSON.parse(userString);
                        setIsPro(user.hasProAccess || user.isPro === true);
                        setFreeAiInterviewCount(user.freeAiInterviewCount || 0);
                    } catch (e) { }
                }
            }
        };
        fetchProfile();
    }, []);

    const recognitionRef = useRef(null);
    const transcriptEndRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Scroll transcript to bottom
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    // Handle Camera Stream
    useEffect(() => {
        if (stage === 'interviewing' && isCameraOn) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [stage, isCameraOn]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access denied", err);
            setError("Camera access denied. You can still continue with voice only.");
            setIsCameraOn(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data: order } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment/create-order`,
                { type: 'pro', amount: 99 },
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
                        const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment/verify-payment`, {
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
                                user.hasProAccess = true;
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

    // Handle Resume Upload
    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setError('');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(`${import.meta.env.VITE_AI_URL || 'http://localhost:8000'}/parse_resume`, formData);
            setResumeText(res.data.text);
        } catch (err) {
            setError('Failed to parse resume. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    // Speech Recognition Setup
    const setupSpeech = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support speech recognition. Please use Chrome.");
            return null;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            handleUserResponse(text);
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error", event.error);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        return recognition;
    };

    // AI Voice Synthesis
    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    // Start Phase
    const startInterview = async () => {
        if (!jobProfile || !resumeText) {
            setError('Please provide both Job Profile and Resume.');
            return;
        }
        setStage('interviewing');
        setTranscript([]);

        // Initial Greeting from AI
        const greeting = `Hello! I see you are applying for the ${jobProfile} position. I've reviewed your resume. Let's start the interview. Can you tell me a bit about your experience related to this role?`;
        setTranscript([{ role: 'interviewer', text: greeting }]);
        speakText(greeting);
    };

    // Capture User Voice
    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            if (!recognitionRef.current) {
                recognitionRef.current = setupSpeech();
            }
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    // Process User Input -> AI Output
    const handleUserResponse = async (text) => {
        const newTranscript = [...transcript, { role: 'user', text }];
        setTranscript(newTranscript);
        setIsAITyping(true);

        try {
            // Get AI Response from Python Backend
            const response = await fetch(`${import.meta.env.VITE_AI_URL || 'http://localhost:8000'}/interview_chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    role: jobProfile,
                    resume_context: resumeText,
                    transcript: newTranscript
                })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiMsg = '';

            // Temporary message object to update
            setTranscript(prev => [...prev, { role: 'interviewer', text: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                aiMsg += chunk;

                setTranscript(prev => {
                    const last = [...prev];
                    last[last.length - 1].text = aiMsg;
                    return last;
                });
            }

            // Speak the completed AI message
            speakText(aiMsg);

        } catch (err) {
            console.error(err);
        } finally {
            setIsAITyping(false);
        }
    };

    // Finish & Eval
    const finishInterview = async () => {
        window.speechSynthesis.cancel(); // Stop talking
        setStage('analysing');
        try {
            // 1. Get AI Evaluation from Python Service
            const res = await axios.post(`${import.meta.env.VITE_AI_URL || 'http://localhost:8000'}/mock_interview_eval`, {
                domain: jobProfile,
                role: jobProfile,
                transcript: transcript
            });
            const evalData = res.data;
            setAnalysis(evalData);

            // 2. Save result to Node.js Backend for persistence
            try {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/interviews`, {
                    role: jobProfile,
                    domain: jobProfile,
                    score: evalData.score,
                    technicalScore: evalData.technical,
                    communicationScore: evalData.communication,
                    hireProbability: evalData.hireProbability,
                    feedback: evalData.feedback,
                    improvements: evalData.improvements,
                    studyPlan: evalData.studyPlan,
                    transcript: transcript
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                console.log('✅ Interview result saved to dashboard');

                // Update local storage so the UI reflects the attempt immediately
                const userString = localStorage.getItem('user');
                if (userString) {
                    try {
                        const userObj = JSON.parse(userString);
                        if (!userObj.hasProAccess && !userObj.isPro) {
                            userObj.freeAiInterviewCount = (userObj.freeAiInterviewCount || 0) + 1;
                            localStorage.setItem('user', JSON.stringify(userObj));
                            setFreeAiInterviewCount(userObj.freeAiInterviewCount);
                        }
                    } catch (e) {
                        console.error("Error updating local storage", e);
                    }
                }
            } catch (err) {
                console.warn('❌ Failed to save interview to dashboard:', err);
                // We still show the results even if saving fails
            }

            setStage('results');
        } catch (err) {
            setError('Evaluation failed. Please try again.');
            setStage('interviewing');
        }
    };

    // ── Setup Stage UI ──
    if (stage === 'setup') {
        return (
            <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3.5rem', borderLeft: '4px solid var(--accent-primary)', paddingLeft: '1.5rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 850,
                        marginBottom: '0.5rem',
                        color: '#fff',
                        letterSpacing: '-1.5px'
                    }}>
                        AI Mock Interview
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.4)', maxWidth: '600px', lineHeight: 1.6 }}>
                        Simulate high-pressure technical interviews with our neural engine and get real-time feedback.
                    </p>
                </div>

                <div className="card glass-panel" style={{ padding: '3rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

                    <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                            <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}><Briefcase size={18} className="text-muted" /></div>
                            Job Profile you're targeting
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Senior Frontend Engineer, DevOps Specialist..."
                            value={jobProfile}
                            onChange={(e) => setJobProfile(e.target.value)}
                            className="glass-input-premium"
                            style={{ width: '100%', padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', color: '#fff', fontSize: '1rem', fontWeight: '500', transition: '0.3s', outline: 'none' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '3rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                            <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}><FileText size={18} className="text-muted" /></div>
                            Resume Data (Optional but Recommended)
                        </label>
                        {!resumeText ? (
                            <label className={`upload-zone-premium flex-center`} style={{ flexDirection: 'column', height: '200px', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '24px', cursor: 'pointer', background: 'rgba(255,255,255,0.01)', transition: '0.4s cubic-bezier(0.165, 0.84, 0.44, 1)' }}>
                                {isUploading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={40} color="var(--accent-primary)" />
                                        <p style={{ marginTop: '1.5rem', fontWeight: 600 }}>Analyzing resume structure...</p>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                            <UploadCloud size={28} color="var(--accent-primary)" />
                                        </div>
                                        <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Upload your Resume</p>
                                        <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>PDF or DOCX supported (Maximum 5MB)</p>
                                        <input type="file" hidden accept=".pdf,.docx" onChange={handleResumeUpload} />
                                    </>
                                )}
                            </label>
                        ) : (
                            <div className="flex-between glass-panel" style={{ padding: '1.5rem 2rem', borderRadius: '20px', background: 'rgba(129, 140, 248, 0.05)', border: '1px solid rgba(129, 140, 248, 0.1)' }}>
                                <div className="flex-center" style={{ gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(129, 140, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckCircle size={20} color="#818cf8" />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700, color: '#818cf8' }}>Resume Analyzed</p>
                                        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Contextual questions enabled</p>
                                    </div>
                                </div>
                                <button style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer' }} onClick={() => setResumeText('')}>Remove</button>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    {!isPro && freeAiInterviewCount >= 3 ? (
                        <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem', background: 'rgba(255, 255, 255, 0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Lock size={32} style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }} />
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Free Limit Reached (3/3)</h3>
                            <p className="text-muted" style={{ textAlign: 'center', maxWidth: '400px', fontSize: '0.95rem' }}>
                                You have used all your free AI Mock Interviews. Upgrade to Pro for unlimited sessions and full access to Company Playloads.
                            </p>
                            <button
                                className="premium-btn"
                                onClick={handleCheckout}
                                style={{
                                    marginTop: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '100px',
                                    background: 'linear-gradient(45deg, var(--accent-primary), #ff00ff)',
                                    border: 'none',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
                                }}
                            >
                                <Trophy size={18} /> Get Pro for ₹99 (1 Year Access)
                            </button>
                        </div>
                    ) : (
                        <div>
                            {!isPro && (
                                <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
                                        {3 - freeAiInterviewCount} Free Attempts Remaining
                                    </span>
                                </div>
                            )}
                            <button
                                className="btn-premium-large flex-center"
                                style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', gap: '1rem' }}
                                onClick={startInterview}
                                disabled={!jobProfile}
                            >
                                Enter Interview Room <ArrowRight size={20} />
                            </button>
                        </div>
                    )}
                </div>

                <style>{`
                    .glass-input-premium:focus {
                        background: rgba(255,255,255,0.04);
                        border-color: var(--accent-primary);
                        box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);
                    }
                    .upload-zone-premium:hover {
                        border-color: var(--accent-primary) !important;
                        background: rgba(99, 102, 241, 0.05) !important;
                        transform: translateY(-2px);
                    }
                    .btn-premium-large {
                        background: linear-gradient(135deg, var(--accent-primary), #818cf8);
                        color: #fff;
                        border: none;
                        border-radius: 16px;
                        font-weight: 800;
                        cursor: pointer;
                        transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
                    }
                    .btn-premium-large:hover:not(:disabled) {
                        transform: scale(1.02);
                        box-shadow: 0 15px 40px rgba(99, 102, 241, 0.6);
                    }
                    .btn-premium-large:disabled {
                        opacity: 0.3;
                        cursor: not-allowed;
                        filter: grayscale(1);
                    }
                `}</style>
            </div>
        );
    }

    // ── Interviewing Stage UI ──
    if (stage === 'interviewing') {
        return (
            <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', height: 'calc(100vh - 100px)', display: 'flex', gap: '2rem' }}>

                {/* Visualizer & Camera Section */}
                <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#09090e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                        {isCameraOn ? (
                            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', borderRadius: '24px' }}
                                />

                                {/* Professional HUD/Viewfinder Overlay */}
                                <div style={{ position: 'absolute', inset: '2rem', border: '1px solid rgba(255,255,255,0.1)', pointerEvents: 'none', borderRadius: '12px' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: '2px solid var(--accent-primary)', borderLeft: '2px solid var(--accent-primary)' }} />
                                    <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: '2px solid var(--accent-primary)', borderRight: '2px solid var(--accent-primary)' }} />
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: '2px solid var(--accent-primary)', borderLeft: '2px solid var(--accent-primary)' }} />
                                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: '2px solid var(--accent-primary)', borderRight: '2px solid var(--accent-primary)' }} />

                                    <div style={{ position: 'absolute', top: '50%', left: '1rem', height: '100px', width: '2px', background: 'rgba(255,255,255,0.1)', transform: 'translateY(-50%)' }}>
                                        <div style={{ position: 'absolute', top: '20%', left: '-4px', width: '10px', height: '2px', background: 'var(--accent-primary)' }} />
                                    </div>
                                </div>

                                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', padding: '0.6rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', margin: 0, letterSpacing: '1px' }}>CANDIDATE: YOU</p>
                                </div>

                                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                                    <div className="pulse-dot" style={{ background: '#ef4444' }} />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#ef4444' }}>REC • LIVE</span>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div className={`avatar-pulse ${isAITyping ? 'active' : ''}`} style={{ width: '180px', height: '180px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', margin: '0 auto', boxShadow: '0 0 50px rgba(99, 102, 241, 0.3)' }}>
                                    <User size={80} />
                                </div>
                                <h2 style={{ marginTop: '2.5rem', letterSpacing: '3px', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>Interview Room</h2>
                                <p className="text-muted" style={{ marginTop: '1rem' }}>Camera is currently disabled</p>
                            </div>
                        )}

                        {isAITyping && (
                            <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', background: 'rgba(99, 102, 241, 0.95)', padding: '0.8rem 1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 40px rgba(99, 102, 241, 0.4)', border: '1px solid rgba(255,255,255,0.2)', animation: 'slideUp 0.3s ease-out' }}>
                                <Loader2 size={20} className="spin" />
                                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Dev2Dev AI is thinking...</span>
                            </div>
                        )}
                    </div>

                    {/* Control Bar - Glassmorphic */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.25rem 2rem',
                        background: 'rgba(15, 15, 25, 0.7)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', gap: '1.25rem' }}>
                            <button
                                className={`mic-btn ${isRecording ? 'recording' : ''}`}
                                onClick={toggleRecording}
                                disabled={isAITyping}
                                style={{
                                    width: '64px', height: '64px', borderRadius: '50%', border: 'none',
                                    background: isRecording ? '#ef4444' : (isAITyping ? 'rgba(255,255,255,0.05)' : 'var(--accent-primary)'),
                                    color: '#fff', cursor: isAITyping ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    boxShadow: isRecording ? '0 0 30px rgba(239, 68, 68, 0.4)' : '0 10px 25px rgba(0,0,0,0.2)'
                                }}
                            >
                                {isRecording ? <MicOff size={28} /> : <Mic size={28} />}
                            </button>

                            <button
                                onClick={() => setIsCameraOn(!isCameraOn)}
                                style={{
                                    width: '64px', height: '64px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)',
                                    background: isCameraOn ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.05)',
                                    color: isCameraOn ? 'var(--accent-primary)' : '#fff', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {isCameraOn ? <Video size={28} /> : <VideoOff size={28} />}
                            </button>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '0.25rem' }}>
                                <Waveform active={isRecording || isAITyping} color={isRecording ? '#ef4444' : 'var(--accent-primary)'} />
                                <p style={{ fontWeight: 800, margin: 0, fontSize: '1.2rem', color: isRecording ? '#ef4444' : '#fff', letterSpacing: '0.5px' }}>
                                    {isRecording ? 'LISTENING' : (isAITyping ? 'AI SPEAKING' : 'IDLE')}
                                </p>
                                <Waveform active={isRecording || isAITyping} color={isRecording ? '#ef4444' : 'var(--accent-primary)'} />
                            </div>
                            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {isRecording ? 'Capturing High-Fidelity Audio' : 'Speak clearly and confidently'}
                            </p>
                        </div>

                        <button
                            className="btn"
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '14px',
                                fontWeight: 700,
                                fontSize: '0.9rem'
                            }}
                            onClick={finishInterview}
                        >
                            Complete Session
                        </button>
                    </div>
                </div>

                {/* AI & Transcript Sidebar */}
                <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* AI Profile Card */}
                    <div className="card glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Loader2 className={isAITyping ? 'spin' : ''} size={28} color="#fff" />
                                </div>
                                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '16px', height: '16px', borderRadius: '50%', background: '#818cf8', border: '3px solid #0f172a' }} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontWeight: 800 }}>Dev2Dev AI</h4>
                                <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.6, fontWeight: 700, textTransform: 'uppercase' }}>Senior Technical Interviewer</p>
                            </div>
                        </div>
                    </div>

                    <div className="card glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', overflow: 'hidden' }}>
                        <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem' }}>
                                <RefreshCw size={18} className={isAITyping ? 'spin' : ''} style={{ color: 'var(--accent-primary)' }} /> Live Transcript
                            </h3>
                            <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '8px', fontWeight: 800 }}>{transcript.length} TURNS</span>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
                            {transcript.map((msg, idx) => (
                                <div key={idx} className={`msg-bubble ${msg.role} animate-fade-in`} style={{
                                    padding: '1.25rem',
                                    borderRadius: '18px',
                                    background: msg.role === 'interviewer' ? 'rgba(255,255,255,0.04)' : 'rgba(99, 102, 241, 0.15)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderLeft: msg.role === 'interviewer' ? '4px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)',
                                    borderRight: msg.role === 'user' ? '4px solid #818cf8' : '1px solid rgba(255,255,255,0.05)',
                                    alignSelf: msg.role === 'interviewer' ? 'flex-start' : 'flex-end',
                                    width: '95%',
                                    position: 'relative'
                                }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: msg.role === 'interviewer' ? 'var(--accent-primary)' : '#818cf8', marginBottom: '0.5rem', letterSpacing: '1px' }}>
                                        {msg.role === 'interviewer' ? 'Dev2Dev AI' : 'Your Answer'}
                                    </div>
                                    <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}>{msg.text}</div>
                                </div>
                            ))}
                            <div ref={transcriptEndRef} />
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    .avatar-pulse.active { animation: avatarPulse 2s infinite; }
                    @keyframes avatarPulse {
                        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
                        70% { transform: scale(1.05); box-shadow: 0 0 0 40px rgba(99, 102, 241, 0); }
                        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
                    }
                    .mic-btn.recording { animation: recPulse 1s infinite alternate; }
                    @keyframes recPulse { 
                        from { transform: scale(1); opacity: 1; } 
                        to { transform: scale(1.15); opacity: 0.9; } 
                    }
                    .pulse-dot { width: 10px; height: 10px; borderRadius: 50%; animation: blink 1s infinite; }
                    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
                `}</style>
            </div>
        );
    }

    // ── Analyzing Stage ──
    if (stage === 'analysing') {
        return (
            <div className="container flex-center" style={{ height: '80vh', flexDirection: 'column', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem' }}>
                    <div className="spin-slow" style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px dashed rgba(99, 102, 241, 0.3)' }} />
                    <div style={{ position: 'absolute', width: '80%', height: '80%', borderRadius: '50%', border: '4px solid rgba(99, 102, 241, 0.1)', borderTopColor: 'var(--accent-primary)', animation: 'spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite' }} />
                    <Loader2 size={48} className="spin" color="var(--accent-primary)" />
                </div>
                <h2 style={{ fontWeight: 900, fontSize: '2rem', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Synthesizing Feedback</h2>
                <p className="text-muted" style={{ fontSize: '1.1rem' }}>Dev2Dev Neural Engine is processing your technical depth...</p>
            </div>
        );
    }

    if (stage === 'results' && analysis) {
        return (
            <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '1100px' }}>

                {/* Header Section */}
                <div className="card glass-panel animate-fade-in" style={{
                    padding: '3rem 2rem',
                    marginBottom: '2rem',
                    background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(99, 102, 241, 0.05) 100%)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div className="flex-between" style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ background: 'rgba(129, 140, 248, 0.1)', color: '#818cf8', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid rgba(129, 140, 248, 0.2)' }}>
                                    SESSION COMPLETE
                                </div>
                                <span style={{ opacity: 0.4, fontSize: '0.8rem' }}>• {new Date().toLocaleDateString()}</span>
                            </div>
                            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '0.5rem' }}>Interview Insights</h1>
                            <p className="text-muted" style={{ fontSize: '1.2rem' }}>Technical evaluation for <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{jobProfile}</span></p>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                padding: '1.5rem 2.5rem',
                                background: analysis.hireProbability === 'High' ? 'rgba(129, 140, 248, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                                borderRadius: '24px',
                                border: `1px solid ${analysis.hireProbability === 'High' ? 'rgba(129, 140, 248, 0.2)' : 'rgba(251, 191, 36, 0.2)'}`
                            }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.6, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Hiring Status</p>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: analysis.hireProbability === 'High' ? '#818cf8' : '#fbbf24', margin: 0 }}>{analysis.hireProbability}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score Dashboard */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <StatRing value={analysis.score} label="Overall Match" color="var(--accent-primary)" icon={CheckCircle} />
                    <StatRing value={analysis.technical} label="Technical Depth" color="#818cf8" icon={Briefcase} />
                    <StatRing value={analysis.communication} label="Communication" color="#c084fc" icon={Volume2} />

                    {/* Achievement Badges Card */}
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>Achievements</span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                            <div className="badge-item" title="Technical Titan" style={{ textAlign: 'center' }}>
                                <div style={{ width: '45px', height: '45px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', color: 'var(--accent-primary)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                    <Briefcase size={20} />
                                </div>
                                <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Pro Level</span>
                            </div>
                            <div className="badge-item" title="Quick Thinker" style={{ textAlign: 'center' }}>
                                <div style={{ width: '45px', height: '45px', background: 'rgba(129, 140, 248, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', color: '#818cf8', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
                                    <RefreshCw size={20} />
                                </div>
                                <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Fast Response</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                    <div className="card glass-panel" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.01)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.1 }}>
                            <Zap size={60} />
                        </div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem', fontSize: '1.4rem' }}>
                            <Cpu color="var(--accent-primary)" size={24} /> Neural Feedback Engine
                        </h3>
                        <p style={{ lineHeight: 1.8, fontSize: '1.1rem', opacity: 0.9, position: 'relative', zIndex: 1 }}>{analysis.feedback}</p>

                        <div style={{ marginTop: '3rem' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f87171', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', marginBottom: '1.5rem' }}>
                                <AlertTriangle size={18} /> Optimization Required
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {analysis.improvements?.map((item, i) => (
                                    <div key={i} style={{ padding: '1rem 1.5rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '15px', border: '1px solid rgba(239, 68, 68, 0.1)', fontSize: '0.95rem' }}>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="card glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                            <h3 style={{ color: '#818cf8', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <BookOpen size={20} /> Accelerated Study Plan
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {analysis.studyPlan?.map((topic, i) => (
                                    <div key={topic} style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem' }}>{i + 1}</div>
                                        <span style={{ fontWeight: 600 }}>{topic}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            className="btn"
                            style={{
                                marginTop: 'auto',
                                padding: '1.5rem',
                                borderRadius: '20px',
                                background: 'var(--accent-primary)',
                                color: '#fff',
                                fontWeight: 900,
                                fontSize: '1.1rem',
                                boxShadow: '0 10px 40px rgba(99, 102, 241, 0.3)',
                                transition: '0.3s'
                            }}
                            onClick={() => setStage('setup')}
                        >
                            RESTART SIMULATION
                        </button>
                    </div>
                </div>

                <style>{`
                    @keyframes wave {
                        0%, 100% { height: 4px; }
                        50% { height: 25px; }
                    }
                    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    .spin-slow { animation: spin-slow 8s linear infinite; }
                    
                    .stat-ring-container:hover {
                        background: rgba(255,255,255,0.05) !important;
                        transform: translateY(-5px);
                        border-color: rgba(99, 102, 241, 0.3) !important;
                    }
                    
                    .badge-item:hover div {
                        transform: scale(1.1) rotate(5deg);
                        box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
                    }

                    .avatar-pulse.active { animation: avatarPulse 2s infinite; }
                    @keyframes avatarPulse {
                        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
                        70% { transform: scale(1.05); box-shadow: 0 0 0 40px rgba(99, 102, 241, 0); }
                        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
                    }
                    .mic-btn.recording { animation: recPulse 1s infinite alternate; }
                    @keyframes recPulse { 
                        from { transform: scale(1); opacity: 1; } 
                        to { transform: scale(1.15); opacity: 0.9; } 
                    }
                    .pulse-dot { width: 10px; height: 10px; borderRadius: 50%; animation: blink 1s infinite; }
                    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
                `}</style>
            </div>
        );
    }

    return null;
};

export default MockInterview;
