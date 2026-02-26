import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, Target, Clock, Activity, DivideCircle, Percent, FlaskConical, Hash, Calculator, Scale, BookOpen, CircleDollarSign, Info, User, Code2, Loader2 } from 'lucide-react';

const LogicalReasoning = () => {
    const [logicalReasoningData, setLogicalReasoningData] = useState([]);
    const [activeSection, setActiveSection] = useState('');
    const [userAnswers, setUserAnswers] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/domains/topics/name/Aptitude & Reasoning');
                const qt = res.data.filter(t => t.topicGroup === 'Logical Reasoning');
                const formatted = qt.map(t => ({
                    id: t._id,
                    title: t.title,
                    icon: 'Code2',
                    theory: t.content?.explanation,
                    questions: t.quiz?.map(q => ({
                        question: q.question,
                        options: q.options,
                        ans: q.correctAnswer,
                        answer: q.explanation || q.answer
                    })) || []
                }));
                setLogicalReasoningData(formatted);
                if (formatted.length > 0) setActiveSection(formatted[0].id);
                setLoading(false);
            } catch (e) { console.error('Error fetching data:', e); setLoading(false); }
        };
        fetchTopics();
    }, []);

    useEffect(() => {
        if (!logicalReasoningData.length) return;
        const handleScroll = () => {
            let current = logicalReasoningData[0]?.id;
            for (let section of logicalReasoningData) {
                const element = document.getElementById(section.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 200) {
                        current = section.id;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [logicalReasoningData]);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
    };


    const getIcon = (iconName) => {
        switch (iconName) {
            case 'Hash': return <Hash size={14} className="inline mr-2 opacity-70" />;
            case 'User': return <User size={14} className="inline mr-2 opacity-70" />;
            case 'Code2': return <Code2 size={14} className="inline mr-2 opacity-70" />;
            case 'Target': return <Target size={14} className="inline mr-2 opacity-70" />;
            case 'Scale': return <Scale size={14} className="inline mr-2 opacity-70" />;
            case 'Activity': return <Activity size={14} className="inline mr-2 opacity-70" />;
            case 'BookOpen': return <BookOpen size={14} className="inline mr-2 opacity-70" />;
            case 'DivideCircle': return <DivideCircle size={14} className="inline mr-2 opacity-70" />;
            default: return <Target size={14} className="inline mr-2 opacity-70" />;
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#09090e] text-white">
                <Loader2 size={32} className="animate-spin text-purple-500" />
                <span className="ml-3 font-semibold">Loading Logical Reasoning Topics...</span>
            </div>
        );
    }

    return (
        <div className="oops-page">
            <div className="oops-hero" style={{ background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.05) 0%, var(--bg-primary) 100%)' }}>
                <div className="oops-animated-bg" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 60%)' }}></div>
                <div className="hero-content text-center">
                    <div className="badge" style={{ color: '#a855f7', background: 'rgba(168, 85, 247, 0.1)', borderColor: 'rgba(168, 85, 247, 0.2)' }}>
                        <Calculator size={16} /> Placement Preparation
                    </div>
                    <h1>Master <span>Logical Reasoning</span></h1>
                    <p>Essential reasoning questions and patterns to crack technical interviews and placement exams.</p>
                </div>
            </div>

            <div className="oops-container">
                {/* Sidebar Navigation */}
                <aside className="oops-sidebar custom-scrollbar">
                    <div className="sidebar-sticky">
                        <h3 className="sidebar-title"><Target size={18} /> Topics</h3>
                        <nav className="sidebar-nav">
                            {logicalReasoningData.map(section => (
                                <button
                                    key={section.id}
                                    className={activeSection === section.id ? 'active lr-active' : ''}
                                    onClick={() => scrollTo(section.id)}
                                >
                                    {getIcon(section.icon)} {section.title}
                                </button>
                            ))}
                        </nav>

                        <div className="sidebar-info-card" style={{ background: 'rgba(168, 85, 247, 0.05)', borderColor: 'rgba(168, 85, 247, 0.2)' }}>
                            <Info size={20} color="#a855f7" />
                            <p>This guide features solved problems on frequently asked reasoning topics.</p>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="oops-main">
                    {logicalReasoningData.map(section => (
                        <section id={section.id} key={section.id} className="content-section">
                            <h2 className="section-title">{section.title}</h2>

                            {/* Theory Section */}
                            {section.theory && (
                                <div className="theory-container" dangerouslySetInnerHTML={{ __html: section.theory }} />
                            )}

                            <div className="mcq-list">
                                {section.questions.map((mcq, idx) => {
                                    const questionKey = `${section.id}_${idx}`;
                                    const showResult = userAnswers[questionKey] !== undefined;

                                    return (
                                        <div key={idx} className="mcq-card">
                                            <h4>{idx + 1}. {mcq.question}</h4>
                                            <div className="mcq-options">
                                                {mcq.options.map((opt, oIdx) => {
                                                    const isSelected = userAnswers[questionKey] === oIdx;
                                                    const isCorrect = mcq.ans === oIdx;

                                                    let optClass = "mcq-option";
                                                    if (showResult) {
                                                        if (isCorrect) optClass += " correct";
                                                        else if (isSelected) optClass += " incorrect";
                                                        else optClass += " disabled";
                                                    } else if (isSelected) {
                                                        optClass += " selected lr-selected";
                                                    }

                                                    return (
                                                        <button
                                                            key={oIdx}
                                                            className={optClass}
                                                            onClick={() => !showResult && setUserAnswers(prev => ({ ...prev, [questionKey]: oIdx }))}
                                                            disabled={showResult}
                                                        >
                                                            {String.fromCharCode(65 + oIdx)}. {opt}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Show answer explanation after guessing */}
                                            {showResult && (
                                                <div className="mcq-explanation mt-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(168, 85, 247, 0.3)' }}>
                                                    <div className="flex items-center gap-2 mb-2" style={{ color: '#c084fc', fontWeight: '600', fontSize: '0.9rem' }}>
                                                        <Info size={16} /> Explanation
                                                    </div>
                                                    <div className="qa-text" dangerouslySetInnerHTML={{ __html: mcq.answer }} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </main>
            </div>

            <style>{`
                /* Logical Reasoning Styles (Purple Theme #a855f7) */
                .oops-page { min-height: 100vh; background: var(--bg-primary); color: var(--text-primary); font-family: var(--font-main); }
                .oops-hero { position: relative; padding: 5rem 2rem; display: flex; justify-content: center; align-items: center; overflow: hidden; border-bottom: 1px solid var(--border-color); }
                .oops-animated-bg { position: absolute; width: 600px; height: 600px; top: -200px; left: 50%; transform: translateX(-50%); z-index: 0; }
                .hero-content { position: relative; z-index: 1; max-width: 800px; }
                .hero-content .badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.85rem; font-weight: 700; letter-spacing: 1px; margin-bottom: 1.5rem; border: 1px solid transparent; }
                .hero-content h1 { font-size: 3.5rem; font-weight: 900; margin: 0 0 1rem 0; line-height: 1.1; letter-spacing: -1px; }
                .hero-content h1 span { color: transparent; -webkit-background-clip: text; background-clip: text; background-image: linear-gradient(90deg, #c084fc, #a855f7); }
                .hero-content p { font-size: 1.1rem; color: rgba(255,255,255,0.7); max-width: 600px; margin: 0 auto; }

                .oops-container { display: flex; max-width: 1400px; margin: 0 auto; padding: 3rem 2rem; gap: 3rem; align-items: flex-start; }

                /* Sidebar */
                .oops-sidebar { width: 300px; flex-shrink: 0; position: sticky; top: 100px; max-height: calc(100vh - 120px); overflow-y: auto; }
                .sidebar-sticky { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 16px); padding: 1.5rem; backdrop-filter: blur(12px); }
                .sidebar-title { font-size: 1rem; font-weight: 700; margin: 0 0 1.5rem 0; display: flex; align-items: center; gap: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary); }
                .sidebar-nav { display: flex; flex-direction: column; gap: 0.5rem; }
                .sidebar-nav button { display:flex; align-items:center; background: transparent; border: none; text-align: left; padding: 0.75rem 1rem; border-radius: 10px; color: rgba(255,255,255,0.7); font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: 0.3s; border: 1px solid transparent; }
                .sidebar-nav button:hover { background: rgba(255,255,255,0.03); color: var(--text-primary); }
                .sidebar-nav button.lr-active { background: rgba(168, 85, 247, 0.1) !important; color: #c084fc !important; border-color: rgba(168, 85, 247, 0.2) !important; font-weight: 600; }
                .sidebar-info-card { margin-top: 2rem; padding: 1.25rem; border-radius: 12px; border: 1px dashed; display: flex; gap: 1rem; align-items: flex-start; }
                .sidebar-info-card p { margin: 0; font-size: 0.8rem; color: rgba(255,255,255,0.6); line-height: 1.5; }

                /* Main Content Area */
                .oops-main { flex: 1; min-width: 0; padding-bottom: 5rem; }
                .content-section { margin-bottom: 4rem; }
                .section-title { font-size: 2rem; font-weight: 800; margin: 0 0 2rem 0; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); letter-spacing: -0.5px; }

                /* MCQ Cards */
                .mcq-list { display: flex; flex-direction: column; gap: 1.5rem; }
                .mcq-card { background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 1.5rem; border-radius: var(--radius-lg, 16px); transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
                .mcq-card:hover { transform: translateY(-4px); border-color: #a855f7; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 15px rgba(168, 85, 247, 0.15); }
                .mcq-card h4 { margin: 0 0 1rem 0; font-size: 1.05rem; line-height: 1.4; color: var(--text-primary); }
                .mcq-options { display: flex; flex-direction: column; gap: 0.5rem; }
                .mcq-option { text-align: left; padding: 0.85rem 1rem; border-radius: var(--radius-sm, 8px); border: 1px solid var(--border-color); background: transparent; color: var(--text-secondary); cursor: pointer; transition: 0.2s; font-size: 0.9rem; font-family: inherit; }
                .mcq-option:hover:not(.disabled) { background: rgba(168, 85, 247,0.05); border-color: #7e22ce; color: #7e22ce; }
                .mcq-option.correct { background: rgba(129, 140, 248, 0.1); border-color: var(--success, #818cf8); color: var(--success, #818cf8); font-weight: 600; }
                .mcq-option.incorrect { background: rgba(239, 68, 68, 0.1); border-color: var(--danger, #ef4444); color: var(--danger, #ef4444); }
                .mcq-option.disabled { cursor: not-allowed; opacity: 0.5; }
                .mcq-option.lr-selected { border-color: #a855f7; background: rgba(168, 85, 247,0.05); }

                /* Explanation block & Theory Area Styling */
                .theory-container { background: rgba(168, 85, 247, 0.03); border: 1px solid rgba(168, 85, 247, 0.15); border-radius: var(--radius-lg, 16px); padding: 1.5rem; margin-bottom: 2rem; }
                .theory-container h4 { color: #c084fc; font-size: 1.1rem; margin-top: 0; margin-bottom: 1rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
                .theory-container ul, .theory-container ol { margin: 0; padding-left: 1.5rem; color: rgba(255,255,255,0.8); line-height: 1.6; font-size: 0.95rem; }
                .theory-container li { margin-bottom: 0.5rem; }
                .theory-container b { color: #fff; font-weight: 600; }
                .theory-container code { background: rgba(255,255,255,0.1); padding: 0.1rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: #e9d5ff; }

                .qa-text { font-size: 0.95rem; color: rgba(255,255,255,0.7); line-height: 1.7; }
                .qa-text b { color: #fff; font-weight: 600; }
                .qa-text i { color: #c084fc; }
                .qa-text p { margin: 0.5rem 0; }
                .qa-text ul, .qa-text ol { margin: 0.5rem 0; padding-left: 1.5rem; }
                .qa-text li { margin-bottom: 0.25rem; }
                .qa-text code { background: rgba(255,255,255,0.1); padding: 0.1rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: #e9d5ff; }
                
                @media (max-width: 900px) {
                    .oops-container { flex-direction: column; }
                    .oops-sidebar { width: 100%; position: static; max-height: none; }
                    .hero-content h1 { font-size: 2.5rem; }
                }
            `}</style>
        </div>
    );
};

export default LogicalReasoning;
