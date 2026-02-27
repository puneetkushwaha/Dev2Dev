import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Book, Zap, Clock, CheckCircle2, Trophy, Lock, ArrowLeftRight, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Tag, Building2, HelpCircle } from 'lucide-react';
import axios from 'axios';
import './Problems.css';

const Problems = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All Topics');
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [userPoints, setUserPoints] = useState(0);
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const filterRef = useRef(null);
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const tagSliderRef = useRef(null);

    // Mouse Drag-to-Scroll Logic
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeftInitial = useRef(0);
    const [hasMoved, setHasMoved] = useState(false);

    const handleMouseDown = (e) => {
        if (isExpanded) return;
        isDown.current = true;
        setHasMoved(false);
        startX.current = e.pageX - sliderRef.current.offsetLeft;
        scrollLeftInitial.current = sliderRef.current.scrollLeft;
        sliderRef.current.style.cursor = 'grabbing';
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilterDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            isDown.current = false;
            if (sliderRef.current) sliderRef.current.style.cursor = 'grab';
        };

        const handleGlobalMouseMove = (e) => {
            if (!isDown.current || isExpanded || !sliderRef.current) return;
            e.preventDefault();
            const x = e.pageX - sliderRef.current.offsetLeft;
            const walk = (x - startX.current) * 2;
            if (Math.abs(walk) > 5) setHasMoved(true);
            sliderRef.current.scrollLeft = scrollLeftInitial.current - walk;
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
            window.removeEventListener('mousemove', handleGlobalMouseMove);
        };
    }, [isExpanded]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [problemsRes, profileRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/problems`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setProblems(problemsRes.data);
                setUserPoints(profileRes.data.totalPoints || 0);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Dynamically calculate topic tags and counts from both category and questions[0].tags
    const tagCounts = problems.reduce((acc, p) => {
        const problemTags = p.questions?.[0]?.tags || [];
        const uniqueProblemTopics = new Set([p.category, ...problemTags].filter(Boolean));

        uniqueProblemTopics.forEach(topic => {
            acc[topic] = (acc[topic] || 0) + 1;
        });
        return acc;
    }, {});

    // Main filter tabs should include All Topics + everything from tagCounts
    const categories = ['All Topics', ...Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])];

    const filteredProblems = problems.filter(p => {
        const lowerSearch = searchTerm.toLowerCase();
        const problemTags = p.questions?.[0]?.tags || [];

        const matchesSearch =
            p.title.toLowerCase().includes(lowerSearch) ||
            (p.category && p.category.toLowerCase().includes(lowerSearch)) ||
            problemTags.some(tag => tag.toLowerCase().includes(lowerSearch));

        const matchesCategory =
            activeTab === 'All Topics' ||
            p.category === activeTab ||
            problemTags.includes(activeTab);

        const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
        const matchesStatus = statusFilter === 'All' || (statusFilter === 'Solved' ? p.isAttempted : !p.isAttempted);

        return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
    });

    return (
        <div className="problems-container">
            {/* Sidebar */}
            <aside className="problems-sidebar">
                <div style={{ padding: '0 1rem', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navigation</div>
                {[
                    { icon: <Book size={18} />, label: 'Library', active: true },
                    { icon: <Zap size={18} />, label: 'Quest', badge: 'New' },
                    { icon: <Clock size={18} />, label: 'Study Plan', badge: 'New' },
                    { icon: <Trophy size={18} />, label: 'Contest' },
                ].map((item, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            if (item.label === 'Library') return;
                            setShowComingSoon(item.label);
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.8rem 1rem',
                            borderRadius: '12px',
                            background: item.active ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
                            color: item.active ? '#818cf8' : 'rgba(255,255,255,0.6)',
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            fontWeight: item.active ? 600 : 500,
                            border: item.active ? '1px solid rgba(79, 70, 229, 0.3)' : '1px solid transparent'
                        }}
                        onMouseEnter={e => {
                            if (!item.active) {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.color = '#fff';
                            }
                        }}
                        onMouseLeave={e => {
                            if (!item.active) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                            }
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            {item.icon}
                            <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
                        </div>
                        {item.badge && <span style={{ fontSize: '10px', fontWeight: 800, color: '#fff', background: '#4f46e5', padding: '2px 8px', borderRadius: '6px', boxShadow: '0 2px 10px rgba(79, 70, 229, 0.4)' }}>{item.badge}</span>}
                    </div>
                ))}
            </aside>

            {/* Main Content Area */}
            <div className="problems-main-area">
                <main className="problems-content">
                    {/* Header Toolbar */}
                    <header style={{ marginBottom: '3rem' }}>
                        <div className="header-toolbar-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Problem Set</h1>
                            <div className="points-solved-container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.2rem' }}>Solved</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#818cf8' }}>
                                        {problems.filter(p => p.isAttempted).length} <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>/ {problems.length}</span>
                                    </div>
                                </div>
                                <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.2rem' }}>
                                        Points
                                        <div style={{ cursor: 'help', display: 'flex', alignItems: 'center' }} title="Easy: 10pts | Medium: 20pts | Hard: 50pts">
                                            <HelpCircle size={10} />
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b' }}>{userPoints.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                                <input
                                    type="text"
                                    placeholder="Search questions by title or tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '14px',
                                        padding: '1rem 1.5rem 1rem 3.5rem',
                                        color: '#fff',
                                        outline: 'none',
                                        fontSize: '1rem',
                                        transition: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                    onFocus={e => {
                                        e.target.style.background = 'rgba(255,255,255,0.05)';
                                        e.target.style.borderColor = 'rgba(79, 70, 229, 0.4)';
                                        e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)';
                                    }}
                                    onBlur={e => {
                                        e.target.style.background = 'rgba(255,255,255,0.02)';
                                        e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                            <div style={{ position: 'relative' }} ref={filterRef}>
                                <button
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    style={{
                                        background: showFilterDropdown ? 'rgba(79, 70, 229, 0.2)' : 'rgba(255,255,255,0.03)',
                                        border: '1px solid',
                                        borderColor: showFilterDropdown ? 'rgba(79, 70, 229, 0.4)' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        color: showFilterDropdown ? '#818cf8' : 'rgba(255,255,255,0.5)',
                                        cursor: 'pointer',
                                        transition: '0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                    onMouseEnter={e => { if (!showFilterDropdown) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
                                    onMouseLeave={e => { if (!showFilterDropdown) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                                >
                                    <Filter size={18} />
                                    {(difficultyFilter !== 'All' || statusFilter !== 'All') && (
                                        <div style={{ width: '8px', height: '8px', background: '#818cf8', borderRadius: '50%', boxShadow: '0 0 10px rgba(129, 140, 248, 0.6)' }} />
                                    )}
                                </button>

                                {showFilterDropdown && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 12px)',
                                        right: 0,
                                        width: '280px',
                                        background: '#111',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        padding: '1.5rem',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                        zIndex: 1000,
                                        backdropFilter: 'blur(20px)'
                                    }}>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Difficulty</div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                                                    <button
                                                        key={d}
                                                        onClick={() => setDifficultyFilter(d)}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '8px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            transition: '0.2s',
                                                            background: difficultyFilter === d ? 'rgba(79, 70, 229, 0.2)' : 'rgba(255,255,255,0.03)',
                                                            color: difficultyFilter === d ? '#818cf8' : 'rgba(255,255,255,0.6)',
                                                            border: '1px solid',
                                                            borderColor: difficultyFilter === d ? 'rgba(79, 70, 229, 0.4)' : 'transparent'
                                                        }}
                                                    >{d}</button>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Status</div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {['All', 'Solved', 'Unsolved'].map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setStatusFilter(s)}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '8px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            transition: '0.2s',
                                                            background: statusFilter === s ? 'rgba(79, 70, 229, 0.2)' : 'rgba(255,255,255,0.03)',
                                                            color: statusFilter === s ? '#818cf8' : 'rgba(255,255,255,0.6)',
                                                            border: '1px solid',
                                                            borderColor: statusFilter === s ? 'rgba(79, 70, 229, 0.4)' : 'transparent'
                                                        }}
                                                    >{s}</button>
                                                ))}
                                            </div>
                                        </div>

                                        {(difficultyFilter !== 'All' || statusFilter !== 'All') && (
                                            <button
                                                onClick={() => { setDifficultyFilter('All'); setStatusFilter('All'); }}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    borderRadius: '10px',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#ef4444',
                                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    transition: '0.2s'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                            >Reset Filters</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Filter Row */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <Tag size={14} color="rgba(255,255,255,0.3)" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filter by Topic</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div
                                ref={sliderRef}
                                onMouseDown={handleMouseDown}
                                style={{
                                    display: 'flex',
                                    gap: '0.75rem',
                                    overflowX: 'auto',
                                    paddingBottom: '0.5rem',
                                    paddingRight: '100px',
                                    cursor: 'grab',
                                    userSelect: 'none',
                                    scrollBehavior: isDown.current ? 'auto' : 'smooth',
                                }}
                                className="hide-scrollbar"
                            >
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => { if (!hasMoved) setActiveTab(cat); }}
                                        style={{
                                            background: activeTab === cat ? '#fff' : 'rgba(255,255,255,0.04)',
                                            color: activeTab === cat ? '#000' : 'rgba(255,255,255,0.6)',
                                            border: '1px solid',
                                            borderColor: activeTab === cat ? '#fff' : 'rgba(255,255,255,0.08)',
                                            borderRadius: '100px',
                                            padding: '0.6rem 1.25rem',
                                            fontSize: '0.9rem',
                                            fontWeight: activeTab === cat ? 600 : 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            whiteSpace: 'nowrap',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.6rem'
                                        }}
                                        onMouseEnter={e => { if (activeTab !== cat) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                                        onMouseLeave={e => { if (activeTab !== cat) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                    >
                                        {cat === 'All Topics' && <Filter size={14} />}
                                        {cat === 'Algorithms' && <Zap size={14} />}
                                        {cat}
                                        <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{tagCounts[cat] || problems.length}</span>
                                    </button>
                                ))}
                            </div>
                            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', background: 'linear-gradient(to right, transparent, #0a0a0a)', pointerEvents: 'none', zIndex: 5 }} />
                            <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                                <button onClick={() => sliderRef.current?.scrollBy({ left: -200, behavior: 'smooth' })} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
                                <button onClick={() => sliderRef.current?.scrollBy({ left: 200, behavior: 'smooth' })} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}><ChevronRight size={16} /></button>
                            </div>
                        </div>
                    </div>

                    {/* Problem Table */}
                    <div className="problem-table-container">
                        <table className="problem-table">
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '1.25rem 2rem', fontWeight: 600, width: '60px' }}>#</th>
                                    <th style={{ padding: '1.25rem 1rem', fontWeight: 600 }}>Title</th>
                                    <th style={{ padding: '1.25rem 1rem', fontWeight: 600 }}>Difficulty</th>
                                    <th style={{ padding: '1.25rem 1rem', fontWeight: 600 }}>Acceptance</th>
                                    <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontWeight: 600 }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i}><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}><div className="shimmer" style={{ height: '20px', width: '80%', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', margin: '0 auto' }} /></td></tr>
                                    ))
                                ) : filteredProblems.length === 0 ? (
                                    <tr><td colSpan="5" style={{ padding: '6rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
                                        <Book size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                        <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>No problems found</div>
                                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>Try adjusting your search or filters.</p>
                                    </td></tr>
                                ) : filteredProblems.map((prob, index) => {
                                    const diffColor = prob.difficulty === 'Easy' ? '#818cf8' : (prob.difficulty === 'Medium' ? '#f59e0b' : '#ef4444');

                                    // Extract number if title starts with digits followed by dot (e.g., "1. Two Sum")
                                    const match = prob.title.match(/^(\d+)\.\s*(.*)$/);
                                    const displayTitle = match ? match[2] : prob.title;
                                    const displayNumber = match ? match[1] : (index + 1);

                                    return (
                                        <tr
                                            key={prob._id}
                                            onClick={() => navigate(`/problems/${prob._id}`)}
                                            style={{
                                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative'
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                                e.currentTarget.querySelector('.title-text').style.color = '#818cf8';
                                                e.currentTarget.style.paddingLeft = '5px';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.querySelector('.title-text').style.color = prob.isAttempted ? 'rgba(255,255,255,0.5)' : '#fff';
                                                e.currentTarget.style.paddingLeft = '0px';
                                            }}
                                        >
                                            <td style={{ padding: '1.25rem 2rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500, fontSize: '0.95rem' }}>
                                                {displayNumber}
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '4px', height: '20px', background: diffColor, borderRadius: '2px', opacity: 0, transition: '0.2s' }} className="diff-indicator" />
                                                    <span className="title-text" style={{ fontWeight: 600, color: prob.isAttempted ? 'rgba(255,255,255,0.5)' : '#fff', fontSize: '1.05rem', transition: '0.2s' }}>
                                                        {displayTitle}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                <span style={{ color: diffColor, fontSize: '0.9rem', fontWeight: 700, background: `${diffColor}15`, padding: '4px 10px', borderRadius: '6px' }}>
                                                    {prob.difficulty || 'Medium'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', fontWeight: 500 }}>
                                                {prob.acceptanceRate != null ? `${prob.acceptanceRate}%` : '62.4%'}
                                            </td>
                                            <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                                {prob.isAttempted ? (
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#818cf8', fontSize: '0.9rem', fontWeight: 600 }}>
                                                        <CheckCircle2 size={16} /> Solved
                                                    </div>
                                                ) : (
                                                    <Lock size={16} color="rgba(255,255,255,0.1)" />
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Coming Soon Toast / Popup */}
            < div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 1000,
                background: '#111',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                opacity: showComingSoon ? 1 : 0,
                transform: showComingSoon ? 'translateY(0)' : 'translateY(20px)',
                pointerEvents: showComingSoon ? 'auto' : 'none',
                transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(79,70,229,0.1)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4f46e5',
                    flexShrink: 0
                }}>
                    {showComingSoon === 'Study Plan' ? <Clock size={20} /> : <Zap size={20} />}
                </div>
                <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.2rem 0' }}>{showComingSoon} Coming Soon</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.8rem' }}>We're building this feature for you.</p>
                </div>
                <button
                    onClick={() => setShowComingSoon(false)}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.6)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.4rem 0.8rem',
                        cursor: 'pointer',
                        marginLeft: '1rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        transition: '0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >Dismiss</button>
            </div >

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                input::placeholder { color: rgba(255,255,255,0.2); }
                
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .shimmer {
                    background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite linear;
                }

                /* Difficulty Glows */
                tr:hover .diff-indicator {
                    opacity: 1 !important;
                }
            `}</style>
        </div >
    );
};

export default Problems;
