import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, Network, BookOpen, TerminalSquare, Info, Target, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Tutorials.css';

const CNTutorial = () => {
    const [activeSection, setActiveSection] = useState('tutorial');
    const [userAnswers, setUserAnswers] = useState({});
    const [showMcqs, setShowMcqs] = useState(false);
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/domains/topics/corecs?subject=CN&lessonType=theory');
                if (res.data && res.data.length > 0) {
                    setTopic(res.data[0]);
                }
                setLoading(false);
            } catch (e) {
                console.error('Error fetching CN data:', e);
                setLoading(false);
            }
        };
        fetchTopics();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['tutorial', 'mcqs'];
            let current = 'tutorial';

            for (let id of sections) {
                const element = document.getElementById(id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 200) {
                        current = id;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        if (id === 'mcqs') setShowMcqs(true);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
    };

    const QA = ({ q, a, code, lang = 'bash' }) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <div className={`tp-qa-card ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
                <div className="tp-qa-header">
                    <h3>{q}</h3>
                    <div className="tp-qa-toggle">
                        <ChevronDown size={20} />
                    </div>
                </div>
                <div className="tp-qa-body" onClick={(e) => e.stopPropagation()}>
                    <div className="tp-content-text">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {a}
                        </ReactMarkdown>
                    </div>
                    {code && (
                        <div className="tp-code-snippet">
                            <div className="tp-code-head">
                                <span>{lang.toUpperCase()}</span>
                                <TerminalSquare size={14} opacity={0.5} />
                            </div>
                            <pre className="tp-custom-scroll">
                                <code>{code}</code>
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const parseQAs = (explanation) => {
        if (!explanation) return [];
        return explanation.split('### ').filter(Boolean).map(block => {
            const lines = block.trim().split('\n');
            const q = lines[0];
            const rest = lines.slice(1).join('\n');
            let a = rest;
            let code = null;
            const codeMatch = rest.match(/```(\w*)\n([\s\S]*?)```/);
            if (codeMatch) {
                a = rest.replace(codeMatch[0], '').trim();
                code = codeMatch[2].trim();
            }
            return { q, a, code };
        });
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#09090e] text-white">
                <Loader2 size={32} className="animate-spin text-blue-500" />
                <span className="ml-3 font-semibold">Loading CN Tutorial...</span>
            </div>
        );
    }

    const qas = parseQAs(topic?.content?.explanation);
    const mcqs = topic?.quiz || [];

    return (
        <div className="tutorial-page tp-theme-cn">
            <div className="tp-hero">
                <div className="tp-animated-bg"></div>
                <div className="tp-hero-content">
                    <div className="tp-badge">
                        <Sparkles size={14} /> CORE CS Concepts
                    </div>
                    <h1>Master <span className="tp-gradient-text">Computer Networks</span></h1>
                    <p>TCP/IP, OSI Layers, Network Security, Protocols, and modern architecture.</p>
                </div>
            </div>

            <div className="tp-container">
                <aside className="tp-sidebar tp-custom-scroll">
                    <span className="tp-sidebar-label">Contents</span>
                    <nav className="tp-nav">
                        <button
                            className={`tp-nav-item ${activeSection === 'tutorial' ? 'active' : ''}`}
                            onClick={() => scrollTo('tutorial')}
                        >
                            Full Tutorial
                        </button>
                        <button
                            className={`tp-nav-item ${activeSection === 'mcqs' ? 'active' : ''}`}
                            onClick={() => scrollTo('mcqs')}
                        >
                            Practice MCQs
                        </button>
                    </nav>
                </aside>

                <main className="tp-main">
                    <section id="tutorial" className="tp-section">
                        <div className="tp-section-header">
                            <h2 className="tp-section-title">Networking Fundamentals</h2>
                            <p className="tp-section-subtitle">Deep dive into data transmission and network topolgies.</p>
                        </div>
                        <div className="tp-qa-grid">
                            {qas.length > 0 ? qas.map((qa, i) => (
                                <QA key={i} q={qa.q} a={qa.a} code={qa.code} />
                            )) : (
                                <p className="tp-text-muted text-center py-10">No tutorial content added yet.</p>
                            )}
                        </div>
                    </section>

                    <section id="mcqs" className="tp-section">
                        <div className="tp-section-header">
                            <h2 className="tp-section-title">Computer Networks Quiz</h2>
                            <p className="tp-section-subtitle">Practice with {mcqs.length} handpicked challenge questions.</p>
                        </div>

                        {!showMcqs ? (
                            <div className="tp-mcq-card text-center flex flex-col items-center gap-6 py-16">
                                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500">
                                    <Target size={48} />
                                </div>
                                <div className="max-w-md">
                                    <h3 className="text-2xl font-bold mb-4">Ready to test your knowledge?</h3>
                                    <p className="tp-text-muted mb-8">Challenge yourself with questions on IP Addressing, DNS, SMTP, and Network Security.</p>
                                    <button
                                        className="btn btn-primary px-10 py-4 rounded-full text-lg"
                                        onClick={() => setShowMcqs(true)}
                                        style={{ backgroundColor: '#2563eb', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}
                                    >
                                        Start CN Quiz
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="tp-mcq-grid">
                                {mcqs.map((mcq, idx) => {
                                    const isAnswered = userAnswers[idx] !== undefined;
                                    return (
                                        <div key={idx} className="tp-mcq-card">
                                            <h4>{idx + 1}. {mcq.question}</h4>
                                            <div className="tp-options">
                                                {mcq.options.map((opt, oIdx) => {
                                                    const isSelected = userAnswers[idx] === oIdx;
                                                    const isCorrect = mcq.correctAnswer === oIdx;

                                                    let optClass = "tp-option-btn";
                                                    if (isAnswered) {
                                                        if (isCorrect) optClass += " correct";
                                                        else if (isSelected) optClass += " incorrect";
                                                        else optClass += " disabled";
                                                    } else if (isSelected) {
                                                        optClass += " selected";
                                                    }

                                                    return (
                                                        <button
                                                            key={oIdx}
                                                            className={optClass}
                                                            onClick={() => !isAnswered && setUserAnswers(prev => ({ ...prev, [idx]: oIdx }))}
                                                            disabled={isAnswered}
                                                        >
                                                            <div className="tp-option-btn-circle"></div>
                                                            <span>{opt}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {isAnswered && (
                                                <div className="tp-explanation">
                                                    <div className="tp-expl-header">
                                                        <Info size={16} /> Explanation
                                                    </div>
                                                    <div className="tp-content-text">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {mcq.explanation || 'No detailed explanation provided.'}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default CNTutorial;
