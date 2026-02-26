import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Layers, Database, Cpu, Network, Box, Layout,
    ChevronRight, BookOpen, Clock, BarChart, ArrowRight,
    Search, RotateCcw, ArrowLeft, Circle, CheckCircle2
} from 'lucide-react';
import axios from 'axios';

const subjects = [
    { id: 'dsa', name: 'Data Structures & Algorithms', dbKey: 'DSA', icon: Layers, color: '#6366f1' },
    { id: 'os', name: 'Operating Systems', dbKey: 'OS', icon: Cpu, color: '#f59e0b' },
    { id: 'dbms', name: 'Database Mgt Systems', dbKey: 'DBMS', icon: Database, color: '#818cf8' },
    { id: 'cn', name: 'Computer Networks', dbKey: 'CN', icon: Network, color: '#3b82f6' },
    { id: 'oops', name: 'Object Oriented Prog.', dbKey: 'OOP', icon: Box, color: '#ec4899' },
    { id: 'sd', name: 'System Design', dbKey: 'SD', icon: Layout, color: '#8b5cf6' },
];

const CoreCSSubject = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const problemsPerPage = 10;

    const [completedTopics, setCompletedTopics] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCompletedTopics(res.data.completedTopics || []);
            } catch (err) {
                console.error('Failed to fetch user progress', err);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const currentSub = subjects.find(s => s.id === subjectId);
        if (!currentSub) {
            navigate('/core-cs');
            return;
        }
        setSubject(currentSub);
    }, [subjectId, navigate]);

    useEffect(() => {
        const fetchProblems = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:5000/api/domains/topics/corecs');
                const mappedProblems = res.data
                    .filter(t => t.topicGroup)
                    .map(topic => ({
                        _id: topic._id,
                        name: topic.title,
                        subject: topic.subject || 'DSA',
                        topicGroup: topic.topicGroup,
                        topic: topic.topicGroup,
                        difficulty: topic.difficulty,
                        level: topic.level
                    }));
                setProblems(mappedProblems);
            } catch (err) {
                console.error('Failed to fetch problems', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    // Reset page when topic or search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedTopic, searchQuery]);

    if (!subject) return null;

    const subjectProblems = problems.filter(p => p.subject === subject.dbKey);
    const topics = [...new Set(subjectProblems.map(p => p.topicGroup).filter(Boolean))];

    const filteredProblems = subjectProblems.filter(p =>
        p.topic === selectedTopic &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);
    const indexOfLastProblem = currentPage * problemsPerPage;
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
    const currentProblems = filteredProblems.slice(indexOfFirstProblem, indexOfLastProblem);

    const handleStudyTopic = (problemName) => {
        navigate('/learning', {
            state: {
                domain: 'Core Computer Science',
                topic: problemName
            }
        });
    };

    const getDifficultyColor = (diff) => {
        switch (diff?.toLowerCase()) {
            case 'easy': return '#818cf8';
            case 'medium': return '#f59e0b';
            case 'hard': return '#ef4444';
            default: return '#6366f1';
        }
    };

    return (
        <div className="animate-fade-in" style={{
            minHeight: 'calc(100vh - 80px)',
            background: 'radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), #050508',
            padding: '2rem'
        }}>
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
                    <button
                        onClick={() => selectedTopic ? setSelectedTopic(null) : navigate('/core-cs')}
                        style={{
                            padding: '0.8rem',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: `${subject.color}`, opacity: 0.8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.3rem' }}>
                            CORE CURRICULUM
                        </div>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: '#fff', letterSpacing: '-1px' }}>
                            {selectedTopic ? selectedTopic : subject.name}
                        </h1>
                    </div>
                </div>

                <main className="glass-panel" style={{ borderRadius: '32px', padding: '2.5rem', minHeight: '600px', border: `1px solid ${subject.color}20` }}>
                    {loading ? (
                        <div className="flex-center" style={{ height: '400px' }}>
                            <div className="animate-spin"><RotateCcw size={40} color={subject.color} /></div>
                        </div>
                    ) : !selectedTopic ? (
                        <div className="animate-fade-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <subject.icon color={subject.color} size={28} />
                                    Available Topic Sets
                                </h3>
                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', fontWeight: 600 }}>
                                    {topics.length} Modules Found
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                                {topics.length > 0 ? topics.map(topic => (
                                    <div
                                        key={topic}
                                        onClick={() => setSelectedTopic(topic)}
                                        style={{
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            padding: '2rem',
                                            borderRadius: '24px',
                                            cursor: 'pointer',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                            e.currentTarget.style.borderColor = subject.color;
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.boxShadow = `0 10px 30px ${subject.color}15`;
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div>
                                            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>{topic}</h4>
                                            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <BookOpen size={14} /> {subjectProblems.filter(p => p.topic === topic).length} Challenges
                                            </div>
                                        </div>
                                        <div style={{
                                            background: `${subject.color}20`,
                                            padding: '0.75rem',
                                            borderRadius: '16px',
                                            color: subject.color
                                        }}>
                                            <ChevronRight size={20} fontWeight={800} />
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: 'rgba(255,255,255,0.3)' }}>
                                        <RotateCcw size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                        <p>Preparing modules for this subject...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <div style={{ position: 'relative', width: '400px' }}>
                                    <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} size={20} />
                                    <input
                                        type="text"
                                        placeholder={`Search in ${selectedTopic}...`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="edit-input"
                                        style={{ paddingLeft: '3.5rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Problems</div>
                                        <div style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800 }}>{filteredProblems.length}</div>
                                    </div>
                                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Difficulty</div>
                                        <div style={{ color: '#818cf8', fontSize: '1.25rem', fontWeight: 800 }}>Mixed</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                                            <th style={{ padding: '1.5rem' }}>Challenge Name</th>
                                            <th style={{ padding: '1.5rem', width: '180px' }}>Difficulty</th>
                                            <th style={{ padding: '1.5rem', width: '150px' }}>Status</th>
                                            <th style={{ padding: '1.5rem', width: '120px' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProblems.map((prob, idx) => (
                                            <tr
                                                key={prob._id || idx}
                                                style={{
                                                    borderBottom: idx === currentProblems.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                                                    transition: 'all 0.2s'
                                                }}
                                                className="hover-bg-glass"
                                            >
                                                <td style={{ padding: '1.5rem' }}>
                                                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>{prob.name}</div>
                                                </td>
                                                <td style={{ padding: '1.5rem' }}>
                                                    <span style={{
                                                        color: getDifficultyColor(prob.difficulty),
                                                        fontSize: '0.9rem',
                                                        fontWeight: 800,
                                                        background: `${getDifficultyColor(prob.difficulty)}15`,
                                                        padding: '0.4rem 0.8rem',
                                                        borderRadius: '8px',
                                                        border: `1px solid ${getDifficultyColor(prob.difficulty)}30`
                                                    }}>
                                                        {prob.difficulty?.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.5rem' }}>
                                                    {completedTopics.includes(prob.name) ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#818cf8', fontSize: '0.9rem', fontWeight: 700 }}>
                                                            <CheckCircle2 size={16} /> Solved
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
                                                            <Circle size={16} /> Ready
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '1.5rem' }}>
                                                    <button
                                                        onClick={() => handleStudyTopic(prob.name)}
                                                        className="btn btn-primary"
                                                        style={{
                                                            padding: '0.6rem 1.2rem',
                                                            fontSize: '0.9rem',
                                                            borderRadius: '12px',
                                                            background: subject.color
                                                        }}
                                                    >
                                                        Solve <ArrowRight size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '12px',
                                            background: currentPage === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: currentPage === 1 ? 'rgba(255,255,255,0.2)' : '#fff',
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.3s',
                                            fontWeight: 700
                                        }}
                                        onMouseEnter={e => currentPage !== 1 && (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                                        onMouseLeave={e => currentPage !== 1 && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                                    >
                                        <ArrowLeft size={18} /> Previous
                                    </button>

                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.9rem' }}>
                                        Page <span style={{ color: subject.color }}>{currentPage}</span> of {totalPages}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '12px',
                                            background: currentPage === totalPages ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: currentPage === totalPages ? 'rgba(255,255,255,0.2)' : '#fff',
                                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.3s',
                                            fontWeight: 700
                                        }}
                                        onMouseEnter={e => currentPage !== totalPages && (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                                        onMouseLeave={e => currentPage !== totalPages && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                                    >
                                        Next <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            <style jsx="true">{`
                .hover-bg-glass:hover {
                    background: rgba(255,255,255,0.03);
                }
                .edit-input {
                    width: 100%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #fff;
                    font-size: 1rem;
                    padding: 1rem;
                    border-radius: 16px;
                    outline: none;
                    transition: all 0.3s;
                    font-family: inherit;
                }
                .edit-input:focus {
                    border-color: ${subject?.color || '#6366f1'};
                    background: rgba(99,102,241,0.05);
                    box-shadow: 0 0 15px ${subject?.color || '#6366f1'}20;
                }
            `}</style>
        </div>
    );
};

export default CoreCSSubject;
