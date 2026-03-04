import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User as UserIcon, BookOpen, Target, Activity, GraduationCap,
    Briefcase, Award, Loader2, ArrowRight, Edit3, Save, X, LogOut, CheckCircle,
    Trophy, ChevronDown, ChevronUp, Sparkles, AlertCircle, Mail, AtSign, MapPin,
    Building2, Hash, School, Globe, ShieldAlert,
    Info, Code, FileText, Download, Github, Linkedin, Twitter, Youtube, Instagram, HelpCircle
} from 'lucide-react';
import GlobalLoader from '../components/Loader';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import ProfileStats from '../components/profile/ProfileStats';
import ActivityHeatmap from '../components/profile/ActivityHeatmap';
import LanguageStats from '../components/profile/LanguageStats';
import SkillBreakdown from '../components/profile/SkillBreakdown';
import ProfileBadges from '../components/profile/ProfileBadges';
import { generateCertificate, isEligibleForCertificate } from '../utils/certificateGenerator';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingDomain, setIsChangingDomain] = useState(false);
    const [editData, setEditData] = useState({});
    const [saveLoading, setSaveLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [showAllExams, setShowAllExams] = useState(false);
    const [activeTab, setActiveTab] = useState('stats');
    const [domainTopics, setDomainTopics] = useState([]);
    const [isDomainMaster, setIsDomainMaster] = useState(false);
    // 'stats' or 'certificates'
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const [profileRes, domainsRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/profile`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/domains`)
                ]);

                if (profileRes.ok && domainsRes.ok) {
                    const profileData = await profileRes.json();
                    const domainData = await domainsRes.json();

                    setUserData(profileData);
                    setDomains(domainData);

                    // Sync localStorage
                    localStorage.setItem('user', JSON.stringify(profileData));
                    localStorage.setItem('userRole', profileData.role);

                    setEditData({
                        name: profileData.name,
                        education: profileData.education || '',
                        experience: profileData.experience || 'Beginner',
                        skills: (profileData.skills || []).join(', '),
                        bio: profileData.bio || 'N/A',
                        company: profileData.company || 'N/A',
                        jobTitle: profileData.jobTitle || 'N/A',
                        location: profileData.location || 'N/A',
                        institution: profileData.institution || 'N/A',
                        website: profileData.website || 'N/A',
                        socials: {
                            github: profileData.socials?.github || 'N/A',
                            linkedin: profileData.socials?.linkedin || 'N/A',
                            twitter: profileData.socials?.twitter || 'N/A',
                            youtube: profileData.socials?.youtube || 'N/A',
                            instagram: profileData.socials?.instagram || 'N/A',
                            leetcode: profileData.socials?.leetcode || 'N/A'
                        }
                    });
                } else if (!profileRes.ok) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } catch (err) {
                console.error("Profile fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    useEffect(() => {
        const checkDomainMastery = async () => {
            if (!userData || !userData.selectedDomain) return;

            try {
                // 1. Get Domain ID
                const domainsRes = await fetch(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/domains`);
                const domainsData = await domainsRes.json();
                const domain = domainsData.find(d => d.name === userData.selectedDomain);

                if (domain) {
                    // 2. Get All Topics for this Domain
                    const topicsRes = await fetch(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/domains/topics/by-domain/${domain._id}`);
                    const allTopics = await topicsRes.json();
                    setDomainTopics(allTopics);

                    // 3. Check if all topics are completed
                    if (allTopics.length > 0) {
                        const completed = userData.progress?.completedTopics || [];
                        const allCompleted = allTopics.every(topic =>
                            completed.some(ct => ct.toLowerCase() === topic.title.toLowerCase())
                        );
                        setIsDomainMaster(allCompleted);
                    }
                }
            } catch (err) {
                console.error("Error checking domain mastery:", err);
            }
        };

        checkDomainMastery();
    }, [userData]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSave = async () => {
        setSaveLoading(true);
        setMessage(null);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/update-profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: editData.name,
                    education: editData.education,
                    experience: editData.experience,
                    skills: editData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
                    bio: editData.bio,
                    company: editData.company,
                    jobTitle: editData.jobTitle,
                    location: editData.location,
                    institution: editData.institution,
                    website: editData.website,
                    socials: editData.socials
                })
            });

            if (response.ok) {
                const updated = await response.json();
                setUserData(prev => ({ ...prev, ...updated.user }));
                setIsEditing(false);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Connection error.' });
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDomainChange = async (domainName) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/select-domain`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ domainName })
            });
            if (response.ok) {
                setUserData(prev => ({ ...prev, selectedDomain: domainName }));
                setIsChangingDomain(false);
                setMessage({ type: 'success', text: `Track switched to ${domainName}` });
                setTimeout(() => setMessage(null), 3000);
            }
        } catch (err) {
            console.error("Domain switch error", err);
        }
    };

    const handleDownloadCertificate = (exam) => {
        generateCertificate(userData, {
            examName: exam.examName,
            score: exam.score,
            totalMarks: exam.totalMarks,
            dateRun: exam.dateRun
        });
    };

    const handleDownloadDomainCertificate = () => {
        generateCertificate(userData, {
            examName: `${userData.selectedDomain} Mastery`,
            score: 'Mastered',
            totalMarks: 'Elite',
            dateRun: new Date()
        }, 'DOMAIN');
    };

    if (loading) {
        return <GlobalLoader text="Loading elite profile..." />;
    }

    if (!userData) return null;

    return (
        <div style={{ padding: '4rem 2rem', minHeight: '100vh', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Background Effects */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden', background: '#050505' }}>
                <div style={{ position: 'absolute', top: '10%', right: '5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', filter: 'blur(100px)' }}></div>
                <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '35vw', height: '35vw', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)', filter: 'blur(100px)' }}></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '3rem' }}>

                {/* Message Toast */}
                {message && (
                    <div style={{
                        position: 'fixed', top: '2rem', right: '2rem', zIndex: 2000,
                        padding: '1rem 2rem', borderRadius: '16px', backdropFilter: 'blur(10px)',
                        background: message.type === 'success' ? 'rgba(129, 140, 248,0.1)' : 'rgba(239,68,68,0.1)',
                        border: `1px solid ${message.type === 'success' ? 'rgba(129, 140, 248,0.2)' : 'rgba(239,68,68,0.2)'} `,
                        color: message.type === 'success' ? '#818cf8' : '#ef4444',
                        fontWeight: 700, boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        animation: 'slideIn 0.3s ease-out'
                    }}>
                        {message.text}
                    </div>
                )}

                {/* SIDEBAR: Personal Info */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '32px', padding: '2.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(20px)', position: 'sticky', top: '2rem'
                    }}>
                        {/* Avatar & Identifiers */}
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                width: '120px', height: '120px', margin: '0 auto 1.5rem',
                                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 10px 30px rgba(99,102,241,0.4)', border: '4px solid rgba(255,255,255,0.1)'
                            }}>
                                <UserIcon size={64} color="#fff" />
                            </div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: '0 0 0.2rem 0' }}>{userData.name}</h1>
                            <p style={{ opacity: 0.4, fontSize: '0.95rem', margin: 0 }}>{userData.username || `@${userData.name.toLowerCase().replace(/\s/g, '')}`}</p>
                        </div>

                        {/* Bio & Location Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
                            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.7, textAlign: 'center', margin: 0 }}>{userData.bio || 'Product designer and software engineer building the future of DevElevate.'}</p>

                            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '0.5rem 0' }} />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <SidebarItem icon={<MapPin size={16} />} text={userData.location} />
                                <SidebarItem icon={<GraduationCap size={16} />} text={userData.education} />
                                <SidebarItem icon={<Globe size={16} />} text={userData.website} link={userData.website} />
                                <SidebarItem icon={<Mail size={16} />} text={userData.email} />
                            </div>
                        </div>

                        {/* Social Row */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            {['github', 'linkedin', 'twitter', 'leetcode'].map(social => (
                                <a key={social} href={userData.socials?.[social]} target="_blank" rel="noreferrer" style={{
                                    width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)',
                                    color: 'rgba(255,255,255,0.6)', transition: '0.3s'
                                }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#fff'; }}>
                                    {getSocialIcon(social)}
                                </a>
                            ))}
                        </div>

                        <button onClick={() => setIsEditing(true)} style={{
                            width: '100%', padding: '1rem', borderRadius: '16px', border: 'none',
                            background: 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 700,
                            cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem'
                        }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                            <Edit3 size={18} /> Edit Profile
                        </button>

                        <button onClick={handleLogout} style={{
                            width: '100%', marginTop: '1rem', padding: '0.8rem', borderRadius: '16px', border: '1px solid rgba(239,68,68,0.2)',
                            background: 'transparent', color: '#ef4444', fontWeight: 600, fontSize: '0.9rem',
                            cursor: 'pointer', transition: '0.3s'
                        }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}>
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* MAIN CONTENT: Stats & Dashboard */}
                <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Top Row: Quick Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        <div style={{
                            background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)',
                            borderRadius: '32px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem'
                        }}>
                            <div style={{ padding: '1rem', background: '#6366f1', borderRadius: '20px', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                                <Sparkles size={28} color="#fff" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', letterSpacing: '1px' }}>CURRENT STREAK</div>
                                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>{userData.streak || 0} Days</div>
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)',
                            borderRadius: '32px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem'
                        }}>
                            <div style={{ padding: '1rem', background: '#f59e0b', borderRadius: '20px', boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}>
                                <Trophy size={28} color="#fff" />
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', letterSpacing: '1px' }}>
                                    TOTAL POINTS
                                    <div style={{ cursor: 'help', display: 'flex', alignItems: 'center', opacity: 0.6 }} title="Easy: 10pts | Medium: 20pts | Hard: 50pts">
                                        <HelpCircle size={14} />
                                    </div>
                                </div>
                                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>{userData.totalPoints?.toLocaleString() || 0}</div>
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(129, 140, 248,0.05)', border: '1px solid rgba(129, 140, 248,0.1)',
                            borderRadius: '32px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem',
                            position: 'relative', transition: '0.3s'
                        }}>
                            <div style={{ padding: '1rem', background: '#818cf8', borderRadius: '20px', boxShadow: '0 0 20px rgba(129, 140, 248,0.4)' }}>
                                <BookOpen size={28} color="#fff" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', letterSpacing: '1px' }}>ACTIVE TRACK</div>
                                    <button
                                        onClick={() => setIsChangingDomain(!isChangingDomain)}
                                        style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', padding: '4px 8px', color: '#34d399', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        Change
                                    </button>
                                </div>
                                {isChangingDomain ? (
                                    <select
                                        onChange={(e) => handleDomainChange(e.target.value)}
                                        value={userData.selectedDomain || ''}
                                        style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '1rem', outline: 'none' }}
                                    >
                                        <option value="" disabled>Select a track</option>
                                        {domains.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                                        <option value="Self Learning">Self Learning</option>
                                    </select>
                                ) : (
                                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>{userData.selectedDomain || 'Self Learning'}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginTop: '1rem' }}>
                        <button
                            onClick={() => setActiveTab('stats')}
                            style={{
                                background: 'transparent', border: 'none', color: activeTab === 'stats' ? '#818cf8' : 'rgba(255,255,255,0.4)',
                                fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', position: 'relative', padding: '0.5rem 0'
                            }}
                        >
                            Analytics
                            {activeTab === 'stats' && <div style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '3px', background: '#818cf8', borderRadius: '10px' }}></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('certificates')}
                            style={{
                                background: 'transparent', border: 'none', color: activeTab === 'certificates' ? '#818cf8' : 'rgba(255,255,255,0.4)',
                                fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', position: 'relative', padding: '0.5rem 0',
                                display: 'flex', alignItems: 'center', gap: '0.6rem'
                            }}
                        >
                            Certificates
                            <div style={{ background: 'rgba(129, 140, 248, 0.2)', color: '#818cf8', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '100px' }}>
                                {((userData.examScores || []).filter(e => e.passed && isEligibleForCertificate(e.examName)).length) + (isDomainMaster ? 1 : 0) + (userData.earnedCertificates || []).length}
                            </div>
                            {activeTab === 'certificates' && <div style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '3px', background: '#818cf8', borderRadius: '10px' }}></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('badges')}
                            style={{
                                background: 'transparent', border: 'none', color: activeTab === 'badges' ? '#facc15' : 'rgba(255,255,255,0.4)',
                                fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', position: 'relative', padding: '0.5rem 0',
                                display: 'flex', alignItems: 'center', gap: '0.6rem'
                            }}
                        >
                            Badges
                            <div style={{ background: 'rgba(250, 204, 21, 0.2)', color: '#facc15', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '100px' }}>
                                {(userData.badges || []).length}
                            </div>
                            {activeTab === 'badges' && <div style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '3px', background: '#facc15', borderRadius: '10px' }}></div>}
                        </button>
                    </div>

                    {activeTab === 'stats' && (
                        <>
                            {/* Problems Stats */}
                            <ProfileStats solvedStats={userData.solvedStats} totalAvailableStats={userData.totalAvailableStats} />

                            {/* Activity Heatmap */}
                            <ActivityHeatmap heatmap={userData.activityHeatmap || {}} />

                            {/* Bottom Split: Skills & Recent Submissions */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <SkillBreakdown stats={userData.skillStats} />
                                    <LanguageStats stats={userData.languageStats} />
                                </div>

                                <div style={{
                                    background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '32px',
                                    border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1.5rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <CheckCircle size={20} color="#818cf8" /> Recent AC
                                        </h3>
                                        <button onClick={() => setShowAllExams(true)} style={{ background: 'transparent', border: 'none', color: '#818cf8', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>View all</button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {(userData.examScores || []).filter(e => e.passed).slice(-2).reverse().map((exam, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{exam.examName}</div>
                                                    <div style={{ fontSize: '0.8rem', opacity: 0.4 }}>{new Date(exam.dateRun).toLocaleDateString()}</div>
                                                </div>
                                                <div style={{
                                                    padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900,
                                                    background: exam.difficulty === 'Easy' ? 'rgba(129, 140, 248,0.1)' : exam.difficulty === 'Medium' ? 'rgba(251,191,36,0.1)' : 'rgba(239,68,68,0.1)',
                                                    color: exam.difficulty === 'Easy' ? '#818cf8' : exam.difficulty === 'Medium' ? '#fbbf24' : '#ef4444'
                                                }}>
                                                    {exam.difficulty}
                                                </div>
                                            </div>
                                        ))}
                                        {!(userData.examScores || []).some(e => e.passed) && <div style={{ opacity: 0.2, textAlign: 'center', padding: '2rem' }}>No solutions yet.</div>}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'certificates' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                            {/* Domain Mastery Certificate */}
                            {isDomainMaster && (
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(64, 123, 255, 0.1), rgba(129, 140, 248, 0.1))',
                                    padding: '2rem', borderRadius: '24px',
                                    border: '1px solid rgba(64, 123, 255, 0.3)', position: 'relative', overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(64, 123, 255, 0.2) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>
                                    <div style={{ position: 'absolute', bottom: '0', right: '0', opacity: 0.1 }}><Award size={120} /></div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', position: 'relative' }}>
                                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(64, 123, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(64, 123, 255, 0.4)' }}>
                                            <Trophy size={28} color="#407BFF" />
                                        </div>
                                        <div>
                                            <h4 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>{userData.selectedDomain} Master</h4>
                                            <span style={{ fontSize: '0.8rem', color: '#407BFF', fontWeight: 700 }}>PREMIUM CERTIFICATION</span>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: '2rem' }}>
                                        Official recognition for mastering the entire {userData.selectedDomain} curriculum and all technical modules.
                                    </p>

                                    <button
                                        onClick={handleDownloadDomainCertificate}
                                        style={{
                                            width: '100%', background: '#407BFF', border: 'none',
                                            color: '#fff', padding: '0.8rem', borderRadius: '12px',
                                            fontSize: '0.9rem', fontWeight: 900, cursor: 'pointer', transition: '0.3s',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                            boxShadow: '0 4px 15px rgba(64, 123, 255, 0.3)'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <Download size={18} /> Claim Master Certificate
                                    </button>
                                </div>
                            )}

                            {(userData.examScores || []).filter(e => e.passed && isEligibleForCertificate(e.examName)).length > 0 || isDomainMaster ? (
                                (userData.examScores || []).filter(e => e.passed && isEligibleForCertificate(e.examName)).reverse().map((exam, i) => (
                                    <div key={i} style={{
                                        background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px',
                                        border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden',
                                        transition: '0.3s'
                                    }} onMouseEnter={e => e.currentTarget.style.border = '1px solid rgba(129, 140, 248, 0.3)'}>
                                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(129, 140, 248, 0.1) 0%, transparent 70%)', filter: 'blur(20px)' }}></div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(129, 140, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
                                                <Award size={24} color="#818cf8" />
                                            </div>
                                            <div>
                                                <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{exam.examName}</h4>
                                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Issued on {new Date(exam.dateRun).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                                                Score: <span style={{ color: '#34d399', fontWeight: 800 }}>{exam.score}/{exam.totalMarks}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDownloadCertificate(exam)}
                                                style={{
                                                    background: 'rgba(129, 140, 248, 0.1)', border: '1px solid rgba(129, 140, 248, 0.2)',
                                                    color: '#818cf8', padding: '0.6rem 1.2rem', borderRadius: '12px',
                                                    fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', transition: '0.3s',
                                                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#818cf8'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(129, 140, 248, 0.1)'; e.currentTarget.style.color = '#818cf8'; }}
                                            >
                                                <Download size={16} /> Download
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : null}

                            {/* Tutorial Completion Certificates */}
                            {(userData.earnedCertificates || []).map((cert, i) => (
                                <div key={`tut-${i}`} style={{
                                    background: 'rgba(168,85,247,0.04)', padding: '2rem', borderRadius: '24px',
                                    border: '1px solid rgba(168,85,247,0.15)', position: 'relative', overflow: 'hidden',
                                    transition: '0.3s'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.border = '1px solid rgba(168,85,247,0.4)'}
                                    onMouseLeave={e => e.currentTarget.style.border = '1px solid rgba(168,85,247,0.15)'}
                                >
                                    <div style={{ position: 'absolute', bottom: 0, right: 0, opacity: 0.05 }}><Award size={120} /></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(168,85,247,0.3)' }}>
                                            <Trophy size={24} color="#a855f7" />
                                        </div>
                                        <div>
                                            <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>{cert.tutorialTitle}</h4>
                                            <span style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 600 }}>TUTORIAL COMPLETION</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                                            Completed on {new Date(cert.earnedAt).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={() => generateCertificate(userData, { examName: cert.tutorialTitle, score: 'Complete', totalMarks: 'All Lessons', dateRun: cert.earnedAt }, 'TUTORIAL')}
                                            style={{
                                                background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)',
                                                color: '#a855f7', padding: '0.6rem 1.2rem', borderRadius: '12px',
                                                fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', transition: '0.3s',
                                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#a855f7'; e.currentTarget.style.color = '#fff'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(168,85,247,0.1)'; e.currentTarget.style.color = '#a855f7'; }}
                                        >
                                            <Download size={16} /> Download
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Empty state — only if truly nothing earned */}
                            {(userData.examScores || []).filter(e => e.passed && isEligibleForCertificate(e.examName)).length === 0 &&
                             !isDomainMaster &&
                             (userData.earnedCertificates || []).length === 0 && (
                                <div style={{
                                    gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem',
                                    background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px dashed rgba(255,255,255,0.1)'
                                }}>
                                    <div style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
                                        <Award size={40} />
                                    </div>
                                    <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Certificates Earned Yet</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '400px', margin: '0 auto 2rem' }}>
                                        Complete tutorials or pass assessments to earn official certificates.
                                    </p>
                                    <button
                                        onClick={() => navigate('/tutorials')}
                                        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '16px', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}
                                    >
                                        Browse Tutorials
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'badges' && (
                        <ProfileBadges user={userData} />
                    )}
                </main>
            </div>

            {/* Edit Modal (Keeping it clean) */}
            {isEditing && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '40px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', margin: 0 }}>Edit Profile</h2>
                            <button onClick={() => setIsEditing(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <EditField label="Full Name" value={editData.name} onChange={v => setEditData({ ...editData, name: v })} />
                            <EditField label="Location" value={editData.location} onChange={v => setEditData({ ...editData, location: v })} />
                            <EditField label="Education" value={editData.education} onChange={v => setEditData({ ...editData, education: v })} />
                            <EditField label="Institution" value={editData.institution} onChange={v => setEditData({ ...editData, institution: v })} />
                            <EditField label="Experience" type="select" options={['Beginner', 'Intermediate', 'Advanced']} value={editData.experience} onChange={v => setEditData({ ...editData, experience: v })} />
                            <EditField label="Skills (comma separated)" value={editData.skills} onChange={v => setEditData({ ...editData, skills: v })} />
                            <div style={{ gridColumn: '1 / -1' }}>
                                <EditField label="Bio" type="textarea" value={editData.bio} onChange={v => setEditData({ ...editData, bio: v })} />
                            </div>
                            {['github', 'linkedin', 'twitter', 'leetcode'].map(social => (
                                <EditField key={social} label={social.charAt(0).toUpperCase() + social.slice(1)} value={editData.socials?.[social]} onChange={v => setEditData({ ...editData, socials: { ...editData.socials, [social]: v } })} />
                            ))}
                        </div>

                        <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem' }}>
                            <button onClick={handleSave} disabled={saveLoading} style={{ flex: 1, padding: '1.2rem', borderRadius: '20px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {saveLoading ? <GlobalLoader text="Updating profile parameters..." /> : 'Save Profiles'}
                            </button>
                            <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '1.2rem', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* All History Modal */}
            {showAllExams && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '40px', width: '100%', maxWidth: '800px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0 }}>Submission History</h2>
                            <button onClick={() => setShowAllExams(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[...userData.examScores].reverse().map((exam, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem', marginBottom: '0.3rem' }}>{exam.examName}</div>
                                        <div style={{ fontSize: '0.85rem', opacity: 0.5 }}>{new Date(exam.dateRun).toLocaleDateString()} • {exam.language || 'Code'}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: exam.passed ? '#818cf8' : '#ef4444', fontWeight: 900, fontSize: '1rem' }}>{exam.passed ? 'ACCEPTED' : 'REJECTED'}</div>
                                        <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>{exam.score} / {exam.totalMarks} points</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SidebarItem = ({ icon, text, link }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
        <span style={{ color: '#818cf8' }}>{icon}</span>
        {link ? <a href={link} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{text || 'N/A'}</a> : <span>{text || 'N/A'}</span>}
    </div>
);

const EditField = ({ label, value, onChange, type = 'text', options = [] }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</label>
        {type === 'select' ? (
            <select value={value} onChange={e => onChange(e.target.value)} style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontSize: '1rem', outline: 'none' }}>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        ) : type === 'textarea' ? (
            <textarea value={value} onChange={e => onChange(e.target.value)} style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontSize: '1rem', outline: 'none', minHeight: '120px', resize: 'vertical' }} />
        ) : (
            <input type={type} value={value} onChange={e => onChange(e.target.value)} style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', fontSize: '1rem', outline: 'none' }} />
        )}
    </div>
);

const getSocialIcon = (name) => {
    switch (name) {
        case 'github': return <Github size={18} />;
        case 'linkedin': return <Linkedin size={18} />;
        case 'twitter': return <Twitter size={18} />;
        case 'leetcode': return <Code size={18} />;
        default: return <Globe size={18} />;
    }
};

export default Profile;
