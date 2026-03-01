import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Play, Send, Loader2, Brain, CheckCircle,
    AlertCircle, Maximize2, FileText, MessageSquare, History,
    Terminal, Info, ChevronDown, Book, Lock, Tag, Building2, Lightbulb, RotateCcw, Settings, FileCode
} from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Loader from '../components/Loader';

const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', icon: 'JS', boilerplate: '/**\n * @param {any} input\n * @return {any}\n */\nvar solution = function(input) {\n     \n       \n    };' },
    { id: 'python', name: 'Python3', icon: 'PY', boilerplate: 'class Solution:\n    def solve(self, input: any) -> any:\n        \n        pass' },
    { id: 'java', name: 'Java', icon: 'JV', boilerplate: 'class Solution {\n    public Object solve(Object input) {\n         \n           \n        }\n}' },
    { id: 'cpp', name: 'C++', icon: 'C++', boilerplate: '#include <iostream>\n#include <vector>\n#include <string>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n         \n           \n    }\n};' },
    { id: 'c', name: 'C', icon: 'C', boilerplate: '#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n\nvoid solve() {\n     \n       \n    }' }
];

const ProblemView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
    const [submitting, setSubmitting] = useState(false);
    const [running, setRunning] = useState(false);
    const [result, setResult] = useState(null);
    const [activeLeftTab, setActiveLeftTab] = useState('Description');
    const [activeBottomTab, setActiveBottomTab] = useState('Testcase');
    const [activeTestCaseTab, setActiveTestCaseTab] = useState(0);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [showHints, setShowHints] = useState(false);
    const [showTags, setShowTags] = useState(false);

    const getCodingQuestion = () => {
        if (!problem) return null;

        // If it's a Topic
        if (problem.content) {
            return {
                ...problem.content,
                title: problem.title,
                isTopic: true,
                _id: problem._id
            };
        }

        // If it's an Exam
        const codingQ = problem.questions?.find(q => q.type === 'coding') || problem.questions?.[0];
        return codingQ ? { ...codingQ, isExam: true } : null;
    };

    const q = getCodingQuestion();

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/problems/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });

                const data = res.data;
                setProblem(data);
                setActiveTestCaseTab(0);

                // Normalize for initial code load
                let codingQ;
                if (data.content) {
                    codingQ = data.content;
                } else {
                    codingQ = data.questions?.find(q => q.type === 'coding') || data.questions?.[0];
                }

                if (codingQ) {
                    const jsCode = codingQ.starterCode || LANGUAGES.find(l => l.id === 'javascript').boilerplate;

                    // 1. Check if problem has language-specific starter code in DB
                    if (codingQ?.starterCodes?.[selectedLang.id]) {
                        setCode(codingQ.starterCodes[selectedLang.id]);
                        return;
                    }

                    // 2. Special case for JavaScript (fallback to starterCode if no starterCodes object)
                    if (selectedLang.id === 'javascript') {
                        setCode(jsCode);
                        return;
                    }

                    // 3. Fallback: Smart Boilerplate Gen
                    const funcMatch = jsCode.match(/var\s+(\w+)\s*=\s*function\s*\(([^)]*)\)/);
                    const funcName = funcMatch ? funcMatch[1] : 'solution';
                    const params = funcMatch ? funcMatch[2].trim() : 'input';

                    let smartCode = selectedLang.boilerplate;

                    if (selectedLang.id === 'python') {
                        smartCode = `class Solution:\n    def ${funcName}(self, ${params}):\n        \n        pass`;
                    } else if (selectedLang.id === 'cpp') {
                        smartCode = `// Update Return Type as needed\nvoid ${funcName}(${params.split(',').map(p => 'auto ' + p.trim()).join(', ')}) {\n     \n       \n    }`;
                    } else if (selectedLang.id === 'java') {
                        smartCode = `class Solution {\n    public Object ${funcName}(${params.split(',').map(p => 'Object ' + p.trim()).join(', ')}) {\n         \n           \n        }\n}`;
                    } else if (selectedLang.id === 'c') {
                        smartCode = `// Update Return Type and types as needed\nvoid ${funcName}(${params.split(',').map(p => 'void* ' + p.trim()).join(', ')}) {\n     \n       \n    }`;
                    }

                    setCode(smartCode);
                }
            } catch (err) {
                console.error("Error fetching problem:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [id]);

    const handleCodeChange = (val) => {
        setCode(val);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const value = e.target.value;

            const newValue = value.substring(0, start) + "    " + value.substring(end);
            handleCodeChange(newValue);

            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 4;
                }
            }, 0);
        }
    };

    const handleLangChange = (lang) => {
        setSelectedLang(lang);
        setShowLangMenu(false);

        let codingQ;
        if (problem.content) {
            codingQ = problem.content;
        } else {
            codingQ = problem.questions?.find(q => q.type === 'coding') || problem.questions?.[0];
        }

        console.log("Language change to:", lang.id, "CodingQ available:", !!codingQ);
        if (codingQ) console.log("StarterCodes present:", Object.keys(codingQ.starterCodes || {}).length > 0);

        const jsCode = codingQ?.starterCode || LANGUAGES.find(l => l.id === 'javascript').boilerplate;

        // 1. Try to get problem-specific starter code from database
        if (codingQ?.starterCodes && codingQ.starterCodes[lang.id]) {
            console.log("Loading starter code from DB for:", lang.id);
            setCode(codingQ.starterCodes[lang.id]);
            return;
        }

        // 2. Logic for JavaScript (Original/Seeded)
        if (lang.id === 'javascript') {
            setCode(jsCode);
            return;
        }

        // --- 3. Smart Boilerplate Generation Logic (Fallback) ---
        const funcMatch = jsCode.match(/var\s+(\w+)\s*=\s*function\s*\(([^)]*)\)/);
        const funcName = funcMatch ? funcMatch[1] : 'solution';
        const params = funcMatch ? funcMatch[2].trim() : 'input';

        let smartCode = lang.boilerplate;

        if (lang.id === 'python') {
            smartCode = `class Solution:\n    def ${funcName}(self, ${params}):\n        \n        pass`;
        } else if (lang.id === 'cpp') {
            smartCode = `// Update Return Type as needed\nvoid ${funcName}(${params.split(',').map(p => 'auto ' + p.trim()).join(', ')}) {\n     \n       \n    }`;
        } else if (lang.id === 'java') {
            smartCode = `class Solution {\n    public Object ${funcName}(${params.split(',').map(p => 'Object ' + p.trim()).join(', ')}) {\n         \n           \n        }\n}`;
        } else if (lang.id === 'c') {
            smartCode = `// Update Return Type and types as needed\nvoid ${funcName}(${params.split(',').map(p => 'void* ' + p.trim()).join(', ')}) {\n     \n       \n    }`;
        }

        setCode(smartCode);
    };

    if (loading) return <Loader text="Synapsing Challenge Architectures..." />;

    if (!problem) return <div style={{ color: '#fff', textAlign: 'center', padding: '4rem' }}>Problem not found.</div>;

    const handleSubmit = async (isRun = false) => {
        if (isRun) setRunning(true);
        else setSubmitting(true);

        setActiveBottomTab('Test Result');
        setResult(null);

        try {
            console.log(`🚀 Sending submission to: ${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/submit-exam`);
            console.log(`📦 Payload:`, {
                examName: problem.title,
                language: selectedLang.id,
                isRun
            });

            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/submit-exam`, {
                examName: problem.title,
                language: selectedLang.id,
                answers: { [codingQIndex !== -1 ? codingQIndex : 0]: code },
                isRun
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setResult(res.data.result);

            if (!isRun && res.data.result?.passed) {
                setTimeout(() => {
                    navigate('/problems');
                }, 1000);
            }
        } catch (err) {
            console.error("❌ Submission failed:", err);
            if (err.response) {
                console.error("📊 Status:", err.response.status);
                console.error("📄 Data:", err.response.data);
            }
            alert(`Execution failed (${err.response?.status || 'Network Error'}). Please try again.`);
        } finally {
            setSubmitting(false);
            setRunning(false);
        }
    };

    const leftTabs = [
        { id: 'Description', icon: <FileText size={16} /> },
        { id: 'Editorial', icon: <Book size={16} /> },
        { id: 'Solutions', icon: <MessageSquare size={16} /> },
        { id: 'Submissions', icon: <History size={16} /> }
    ];

    return (
        <div className="problem-view-layout" style={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            {/* Header Navigation */}
            <div style={{
                height: '45px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 1rem',
                justifyContent: 'space-between',
                background: '#1a1a1a',
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate('/problems')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ChevronLeft size={18} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Problem List</span>
                    </button>
                    <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{problem.title}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '0.5rem' }}>
                        <Info size={18} />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '0.5rem', gap: '0.5rem' }}>
                {/* Left Side: Information & Description */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1a1a1a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    {/* Left Tabs */}
                    <div style={{ display: 'flex', background: '#262626', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '2px 8px' }}>
                        {leftTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveLeftTab(tab.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.6rem 1rem',
                                    background: activeLeftTab === tab.id ? '#1a1a1a' : 'transparent',
                                    color: activeLeftTab === tab.id ? '#fff' : 'rgba(255,255,255,0.4)',
                                    border: 'none',
                                    borderBottom: activeLeftTab === tab.id ? '2px solid #fff' : 'none',
                                    fontSize: '0.78rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: '0.2s'
                                }}
                            >
                                {tab.icon}
                                {tab.id}
                            </button>
                        ))}
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                        {activeLeftTab === 'Description' && (
                            <div className="problem-content">
                                <h1 style={{ fontSize: '1.5rem', marginBottom: '1.25rem', fontWeight: 700 }}>{problem.title}</h1>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '100px',
                                        background: q?.difficulty === 'Easy' ? 'rgba(129, 140, 248, 0.1)' : q?.difficulty === 'Hard' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                                        color: q?.difficulty === 'Easy' ? '#818cf8' : q?.difficulty === 'Hard' ? '#ef4444' : '#f59e0b',
                                        fontSize: '0.72rem',
                                        fontWeight: 700
                                    }}>
                                        {q?.difficulty || 'Medium'}
                                    </span>

                                    <button
                                        onClick={() => setShowTags(!showTags)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            background: showTags ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                                            border: 'none',
                                            borderRadius: '100px',
                                            padding: '0.25rem 0.75rem',
                                            color: showTags ? '#fff' : 'rgba(255,255,255,0.6)',
                                            fontSize: '0.7rem',
                                            cursor: 'pointer',
                                            transition: '0.2s'
                                        }}
                                    >
                                        <Tag size={12} /> Topics {q?.tags?.length > 0 && `(${q.tags.length})`}
                                    </button>

                                    {showTags && q?.tags?.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', width: '100%', marginTop: '0.5rem', animation: 'fadeIn 0.2s ease-out' }}>
                                            {q.tags.map((tag, idx) => (
                                                <span key={idx} style={{
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '100px',
                                                    background: 'rgba(255,255,255,0.08)',
                                                    color: 'rgba(255,255,255,0.8)',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 600
                                                }}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '100px', padding: '0.25rem 0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', cursor: 'pointer' }}>
                                        <Building2 size={12} /> Companies
                                    </button>

                                    <button
                                        onClick={() => setShowHints(!showHints)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            background: showHints ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)',
                                            border: 'none',
                                            borderRadius: '100px',
                                            padding: '0.25rem 0.75rem',
                                            color: showHints ? '#f59e0b' : 'rgba(255,255,255,0.6)',
                                            fontSize: '0.7rem',
                                            cursor: 'pointer',
                                            transition: '0.2s'
                                        }}
                                    >
                                        <Lightbulb size={12} /> Hint {q?.hints?.length > 0 && `(${q.hints.length})`}
                                    </button>
                                </div>

                                <div className="markdown-body" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', lineHeight: '1.7' }}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {q?.questionText || q?.description || "No description available."}
                                    </ReactMarkdown>
                                </div>

                                {q?.constraints && (
                                    <div style={{ marginTop: '2.5rem' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fff' }}>Constraints:</h3>
                                        <div className="markdown-body" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {q.constraints}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )}

                                {showHints && q?.hints?.length > 0 && (
                                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.3s ease-out' }}>
                                        {q.hints.map((hint, idx) => (
                                            <div key={idx} style={{
                                                background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                borderRadius: '8px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    padding: '0.6rem 1rem',
                                                    background: 'rgba(255,255,255,0.02)',
                                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800,
                                                    color: 'rgba(255,255,255,0.4)',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    Hint {idx + 1}
                                                </div>
                                                <div style={{ padding: '1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                                    {hint}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                                        Seen this question in a real interview?
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', padding: '0.25rem 0.75rem', color: '#fff', fontSize: '0.75rem', cursor: 'pointer' }}>Yes</button>
                                        <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', padding: '0.25rem 0.75rem', color: '#fff', fontSize: '0.75rem', cursor: 'pointer' }}>No</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeLeftTab === 'Editorial' && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.3)' }}>
                                <Lock size={48} style={{ marginBottom: '1.5rem', opacity: 0.1 }} />
                                <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Editorial Locked</h3>
                                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>Subscribe to Premium to unlock full editorial and optimal solutions.</p>
                                <button style={{ background: '#f59e0b', color: '#000', border: 'none', borderRadius: '8px', padding: '0.7rem 2rem', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>Go Premium</button>
                            </div>
                        )}
                        {activeLeftTab === 'Solutions' && (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                                <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.1 }} />
                                <p>No community solutions yet. Be the first to share!</p>
                            </div>
                        )}
                        {activeLeftTab === 'Submissions' && (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                                <History size={48} style={{ marginBottom: '1rem', opacity: 0.1, transform: 'rotate(-45deg)' }} />
                                <p>Your submission history will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Editor & Bottom Panel */}
                <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {/* Editor Panel - VS Code Dark Overhaul */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1e1e1e', overflow: 'hidden' }}>

                        <div style={{
                            height: '40px', background: '#252526', borderBottom: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex', alignItems: 'center', padding: '0 0.75rem', justifyContent: 'space-between',
                            flexShrink: 0
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                                    <button
                                        onClick={() => setShowLangMenu(!showLangMenu)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '8px', background: '#1e1e1e',
                                            border: 'none', color: '#cccccc', fontSize: '0.8rem',
                                            cursor: 'pointer', padding: '0 1rem', height: '100%',
                                            borderTop: '1px solid #007acc'
                                        }}
                                    >
                                        <FileCode size={14} color="#519aba" />
                                        <span>{selectedLang.name}</span>
                                        <ChevronDown size={12} style={{ opacity: 0.5 }} />
                                    </button>
                                    {showLangMenu && (
                                        <div style={{
                                            position: 'absolute', top: '100%', left: 0, marginTop: '2px',
                                            background: '#252526', border: '1px solid #333', borderRadius: '4px',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 100, minWidth: '160px', overflow: 'hidden'
                                        }}>
                                            {LANGUAGES.map(lang => (
                                                <button key={lang.id} onClick={() => handleLangChange(lang)}
                                                    style={{
                                                        width: '100%', textAlign: 'left', padding: '0.8rem 1rem', border: 'none',
                                                        background: selectedLang.id === lang.id ? '#37373d' : 'transparent',
                                                        color: selectedLang.id === lang.id ? '#fff' : '#cccccc',
                                                        fontSize: '0.85rem', cursor: 'pointer', transition: '0.1s'
                                                    }}>
                                                    {lang.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', paddingLeft: '1rem' }}>
                                    {q?.title}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px', color: 'rgba(255,255,255,0.4)', paddingRight: '0.5rem' }}>
                                <RotateCcw size={14} style={{ cursor: 'pointer' }} onClick={() => handleCodeChange(q?.starterCodes?.[selectedLang.id] || selectedLang.boilerplate)} />
                                <Settings size={14} style={{ cursor: 'pointer' }} />
                                <Maximize2 size={14} style={{ cursor: 'pointer' }} />
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
                            <div style={{
                                width: '45px',
                                background: '#1e1e1e',
                                borderRight: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                paddingTop: '1.5rem',
                                paddingRight: '10px',
                                color: '#858585',
                                fontFamily: '"Fira Code", monospace',
                                fontSize: '0.85rem',
                                userSelect: 'none',
                                lineHeight: '1.7'
                            }}>
                                {(code || '').split('\n').map((_, i) => (
                                    <div key={i}>{i + 1}</div>
                                ))}
                                {(!(code)) && [1, 2, 3, 4, 5].map(n => <div key={n}>{n}</div>)}
                            </div>
                            <textarea
                                ref={editorRef}
                                value={code}
                                onChange={(e) => handleCodeChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                spellCheck="false" autoComplete="off" autoCorrect="off" autoCapitalize="off"
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    color: '#d4d4d4',
                                    fontFamily: '"Fira Code", "Consolas", monospace',
                                    fontSize: '1rem',
                                    padding: '1.5rem 1rem',
                                    border: 'none',
                                    outline: 'none',
                                    lineHeight: '1.7',
                                    resize: 'none',
                                    whiteSpace: 'pre',
                                    overflow: 'auto'
                                }}
                            />
                        </div>

                        {/* Editor Bottom Toolbar */}
                        <div style={{
                            height: '48px',
                            background: '#1a1a1a',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 1rem',
                            justifyContent: 'flex-end',
                            gap: '0.75rem',
                            flexShrink: 0
                        }}>
                            <button
                                onClick={() => handleSubmit(true)}
                                disabled={running || submitting}
                                style={{
                                    background: 'rgba(79, 70, 229, 0.08)',
                                    color: '#818cf8',
                                    border: '1px solid rgba(79, 70, 229, 0.25)',
                                    padding: '0.45rem 1.25rem',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: '0.15s',
                                    opacity: running || submitting ? 0.6 : 1
                                }}
                            >
                                {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                                Run
                            </button>

                            <button
                                onClick={() => handleSubmit(false)}
                                disabled={submitting || running}
                                style={{
                                    background: '#4f46e5',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '0.45rem 1.75rem',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: '0.15s',
                                    opacity: submitting || running ? 0.6 : 1
                                }}
                            >
                                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                                Submit
                            </button>
                        </div>
                    </div>

                    {/* Bottom Console Panel */}
                    <div style={{ height: '35%', background: '#1a1a1a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', background: '#262626', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '2px 8px', flexShrink: 0, justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex' }}>
                                {['Testcase', 'Test Result'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveBottomTab(tab)}
                                        style={{
                                            padding: '0.6rem 1rem',
                                            background: activeBottomTab === tab ? '#1a1a1a' : 'transparent',
                                            color: activeBottomTab === tab ? '#818cf8' : 'rgba(255,255,255,0.4)',
                                            border: 'none',
                                            fontSize: '0.78rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: '0.2s'
                                        }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {activeBottomTab === 'Testcase' && q?.testCases?.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.4rem', paddingRight: '12px' }}>
                                    {q.testCases.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveTestCaseTab(idx)}
                                            style={{
                                                padding: '0.35rem 0.9rem',
                                                background: activeTestCaseTab === idx ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                                                color: activeTestCaseTab === idx ? '#818cf8' : 'rgba(255,255,255,0.4)',
                                                border: '1px solid',
                                                borderColor: activeTestCaseTab === idx ? '#6366f1' : 'transparent',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            Case {idx + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.25rem', fontFamily: '"Fira Code", monospace' }}>
                            {activeBottomTab === 'Testcase' && (
                                <div style={{ color: 'rgba(255,255,255,0.7)', height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '0.5rem' }}>
                                    {q?.testCases?.length > 0 ? (
                                        <>
                                            {/* Active Case Details */}
                                            <div style={{ animation: 'fadeIn 0.2s ease-out', marginTop: '0.5rem' }}>
                                                <div style={{ marginBottom: '1.25rem' }}>
                                                    <div style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '0.6rem', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Input</div>
                                                    <div style={{ background: '#262626', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem', color: '#e2e2e2' }}>
                                                        {q.testCases[activeTestCaseTab]?.input || 'N/A'}
                                                    </div>
                                                </div>

                                                {q.testCases[activeTestCaseTab]?.expected && (
                                                    <div>
                                                        <div style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '0.6rem', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Expected Output</div>
                                                        <div style={{ background: '#262626', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem', color: '#818cf8', fontWeight: 500 }}>
                                                            {q.testCases[activeTestCaseTab].expected}
                                                        </div>
                                                    </div>
                                                )}

                                                {q.testCases[activeTestCaseTab]?.description && (
                                                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                                                        Note: {q.testCases[activeTestCaseTab].description}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '3rem' }}>
                                            <Terminal size={40} style={{ margin: '0 auto 1rem', opacity: 0.1 }} />
                                            <p>No testcases configured for this problem.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeBottomTab === 'Test Result' && (
                                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {!result && !submitting && !running && (
                                        <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '3rem' }}>
                                            <Terminal size={32} style={{ margin: '0 auto 1rem', opacity: 0.1 }} />
                                            <p>Run your code to see the test results here.</p>
                                        </div>
                                    )}
                                    {(submitting || running) && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem' }}>
                                            <Loader2 className="animate-spin" size={32} color="#6366f1" />
                                            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>AI Evaluation in progress...</span>
                                        </div>
                                    )}
                                    {result && (
                                        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                                <div style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '8px',
                                                    background: result.passed ? 'rgba(79, 70, 229, 0.1)' : 'rgba(239,68,68,0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}>
                                                    {result.passed ? <CheckCircle size={18} color="#6366f1" /> : <AlertCircle size={18} color="#ef4444" />}
                                                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: result.passed ? '#818cf8' : '#ef4444' }}>
                                                        {result.passed ? 'Accepted' : 'Wrong Answer'}
                                                    </span>
                                                </div>
                                                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Runtime: 52ms</span>
                                            </div>

                                            <div style={{ background: 'rgba(99,102,241,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.15)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#818cf8' }}>
                                                    <Brain size={20} />
                                                    <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>AI Insights</span>
                                                </div>
                                                <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.85)' }}>
                                                    {result.detailedAnalysis?.codingResults?.[0]?.aiFeedback || "Evaluation completed successfully. Review your logic and complexity."}
                                                    {result.detailedAnalysis?.codingResults?.[0]?.error && (
                                                        <div style={{ display: 'none' }}>
                                                            {console.error("AI Evaluation Error:", result.detailedAnalysis.codingResults[0].error)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                .problem-view-layout ::-webkit-scrollbar { width: 4px; height: 4px; }
                .problem-view-layout ::-webkit-scrollbar-track { background: transparent; }
                .problem-view-layout ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
                .problem-view-layout ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                
                .markdown-body h1, .markdown-body h2, .markdown-body h3 { 
                    border-bottom: 1px solid rgba(255,255,255,0.1); 
                    padding-bottom: 0.5rem; 
                    margin-top: 2rem; 
                    margin-bottom: 1rem; 
                    color: #fff;
                    font-weight: 700;
                }
                .markdown-body h3 { font-size: 1.15rem; margin-top: 2.5rem; border-bottom: none; }
                .markdown-body p { margin-bottom: 1.25rem; }
                .markdown-body code { 
                    background: rgba(255,255,255,0.08); 
                    padding: 0.2rem 0.4rem; 
                    borderRadius: 4px; 
                    font-family: "Fira Code", monospace; 
                    font-size: 0.9em;
                    color: #e5e7eb;
                }
                .markdown-body pre { 
                    background: rgba(255,255,255,0.02); 
                    padding: 1.25rem; 
                    borderRadius: 10px; 
                    overflow-x: auto; 
                    margin-bottom: 1.5rem; 
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .markdown-body pre code { background: transparent; padding: 0; color: #d1d5db; }
                .markdown-body strong { color: #fff; font-weight: 700; }
                .markdown-body ul, .markdown-body ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
                .markdown-body li { margin-bottom: 0.6rem; color: rgba(255,255,255,0.8); }
                .markdown-body blockquote { 
                    border-left: 4px solid #6366f1; 
                    background: rgba(99,102,241,0.03); 
                    padding: 1rem 1.5rem; 
                    margin-bottom: 1.5rem; 
                    borderRadius: 4px; 
                    color: rgba(255,255,255,0.7);
                }
                
                /* Specific Example Formatting for LeetCode feel */
                .markdown-body p:has(strong:contains("Example")) + pre,
                .markdown-body h3:contains("Example") + p + pre,
                .markdown-body h3:contains("Example") + pre {
                    background: #262626;
                    border-radius: 8px;
                }
            `}</style>
        </div >
    );
};

export default ProblemView;
