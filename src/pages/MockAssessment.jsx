import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Play, Send, Loader2, Brain, CheckCircle,
    AlertCircle, Maximize2, FileText, Lock, ChevronDown, Clock, MoveLeft, History
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import { mockQuestions } from '../data/mockQuestions';
import Loader from '../components/Loader';

const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', icon: 'JS', boilerplate: '/**\n * @param {any} input\n * @return {any}\n */\nvar solution = function(input) {\n     \n       \n    };' },
    { id: 'python', name: 'Python3', icon: 'PY', boilerplate: 'class Solution:\n    def solve(self, input):\n        \n        pass' },
    { id: 'java', name: 'Java', icon: 'JV', boilerplate: 'class Solution {\n    public Object solve(Object input) {\n         \n           \n        }\n}' },
    { id: 'cpp', name: 'C++', icon: 'C++', boilerplate: '#include <iostream>\n#include <vector>\n#include <string>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve(auto input) {\n         \n           \n    }\n};' },
    { id: 'c', name: 'C', icon: 'C', boilerplate: '#include <stdio.h>\n#include <stdlib.h>\n\nvoid solve(void* input) {\n     \n       \n    }' }
];

const MockAssessment = () => {
    const [searchParams] = useSearchParams();
    const mockId = searchParams.get('id');
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [activeQIndex, setActiveQIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
    const [showLangMenu, setShowLangMenu] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [running, setRunning] = useState(false);
    const [results, setResults] = useState({});
    const [activeBottomTab, setActiveBottomTab] = useState('Testcase');
    const [activeTestCaseTab, setActiveTestCaseTab] = useState(0);

    // Timer state (1 hour = 3600 seconds)
    const [timeLeft, setTimeLeft] = useState(3600);

    const [showExitModal, setShowExitModal] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            const type = searchParams.get('type');

            if (type) {
                // Fetch randomized set from API
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/mock-set?type=${type}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (res.data && res.data.length > 0) {
                        const formatted = res.data.map((q, idx) => ({
                            id: q.id || `dynamic_${idx}`,
                            title: q.title,
                            description: q.description,
                            starterCode: q.starterCode || LANGUAGES[0].boilerplate,
                            starterCodes: q.starterCodes || {},
                            testCases: q.testCases || []
                        }));
                        setQuestions(formatted);

                        const initialAnswers = {};
                        formatted.forEach((q, idx) => {
                            initialAnswers[idx] = q.starterCode;
                        });
                        setAnswers(initialAnswers);
                    } else {
                        console.warn("API returned empty question set");
                        navigate('/interview-prep');
                    }
                } catch (err) {
                    console.error("Failed to fetch dynamic mock set:", err);
                    navigate('/interview-prep');
                }
            } else {
                // Use hardcoded mocks
                const id = mockId || '1';
                const selectedMockQuestions = mockQuestions[id] || mockQuestions['1'];

                if (selectedMockQuestions) {
                    setQuestions(selectedMockQuestions);
                    const initialAnswers = {};
                    selectedMockQuestions.forEach((q, idx) => {
                        initialAnswers[idx] = q.starterCode || LANGUAGES[0].boilerplate;
                    });
                    setAnswers(initialAnswers);
                } else {
                    console.warn(`No mock questions found for ID: ${id}`);
                    navigate('/interview-prep');
                }
            }
            setActiveTestCaseTab(0);
            setLoading(false);
        };

        fetchQuestions();
    }, [mockId, searchParams, navigate]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    submitToBackend(); // Auto-submit on timeout
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleCodeChange = (val) => {
        setAnswers(prev => ({ ...prev, [activeQIndex]: val }));
    };

    const handleLangChange = (lang) => {
        setSelectedLang(lang);
        setShowLangMenu(false);
        const currentQ = questions[activeQIndex];

        // 1. Check if question has language-specific starter code from DB
        if (currentQ?.starterCodes && currentQ.starterCodes[lang.id]) {
            setAnswers(prev => ({
                ...prev,
                [activeQIndex]: currentQ.starterCodes[lang.id]
            }));
            return;
        }

        // 2. Special case for JavaScript (fallback to starterCode if no starterCodes object)
        if (lang.id === 'javascript' && currentQ?.starterCode) {
            setAnswers(prev => ({
                ...prev,
                [activeQIndex]: currentQ.starterCode
            }));
            return;
        }

        // 3. Fallback: Generic Boilerplate
        setAnswers(prev => ({
            ...prev,
            [activeQIndex]: lang.boilerplate
        }));
    };

    const handleRunCode = () => {
        submitToBackend(true);
    };

    const getUnsubmittedQuestions = () => {
        const unsubmitted = [];
        questions.forEach((q, idx) => {
            if (!results[idx]) {
                unsubmitted.push(idx + 1);
            }
        });
        return unsubmitted;
    };

    const handleAttemptExit = () => {
        setShowExitModal(true);
    };

    const submitToBackend = async (isRun = false) => {
        if (isRun) {
            setRunning(true);
            setActiveBottomTab('Test Result');
        } else {
            setSubmitting(true);
        }

        try {
            const token = localStorage.getItem('token');
            const answersArray = isRun ? [{
                questionText: questions[activeQIndex].title,
                userAnswer: answers[activeQIndex] || ""
            }] : questions.map((q, idx) => {
                const ans = answers[idx] || "";
                const isUnchanged = ans === q.starterCode || ans === LANGUAGES[0].boilerplate || ans.trim() === '';
                return {
                    questionText: q.title,
                    userAnswer: isUnchanged ? "" : ans
                };
            });

            const type = searchParams.get('type');
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/submit-mock`, {
                mockId: type || mockId || '1',
                title: type ? `${type} Assessment` : mockId === '1' ? "SDE Mock Assessment I" : mockId === '2' ? "SDE Mock Assessment II" : "SDE Mock Assessment III",
                answers: answersArray,
                timeSpent: 3600 - timeLeft,
                language: selectedLang.id,
                isRun: isRun
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (isRun) {
                const runResult = res.data.result?.detailedAnalysis?.codingResults?.[0];
                if (runResult) {
                    setResults(prev => ({
                        ...prev,
                        [activeQIndex]: {
                            passed: runResult.isCorrect,
                            message: runResult.isCorrect ? "Accepted" : "Wrong Answer",
                            type: "run",
                            feedback: runResult.aiFeedback
                        }
                    }));
                }
                setRunning(false);
            } else {
                navigate('/mock-report', { state: { report: res.data.result, timeSpent: 3600 - timeLeft } });
            }
        } catch (err) {
            console.error("Failed to submit mock", err);
            alert(`Failed to ${isRun ? 'execute code' : 'submit assessment'}. Please try again.`);
            if (isRun) setRunning(false);
            else setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) {
            return `${h} hour and ${m} minutes remaining`;
        }
        return `${m}:${s < 10 ? '0' : ''}${s} remaining`;
    };

    if (questions.length === 0) return <Loader text="Loading Assessment..." />;

    const currentQ = questions[activeQIndex];
    const currentResult = results[activeQIndex];

    return (
        <div className="problem-view-layout" style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f0f0f0', color: '#333', fontFamily: 'Inter, sans-serif' }}>

            {/* Top Navbar Header (LeetCode Assessment Style) */}
            <div style={{
                height: '50px',
                background: '#fff',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                padding: '0 1rem',
                justifyContent: 'space-between',
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 700, fontSize: '1.2rem', color: '#f59e0b' }}>
                    <MoveLeft
                        size={20}
                        color="#666"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/interview-prep')}
                    />
                    <span>DEV MOCK</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#555', fontSize: '0.9rem' }}>
                        <Clock size={16} />
                        <span>{formatTime(timeLeft)}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8f9fa', padding: '4px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                        {questions.map((q, idx) => (
                            <button
                                key={q.id}
                                onClick={() => { setActiveQIndex(idx); setActiveTestCaseTab(0); }}
                                style={{
                                    border: 'none',
                                    background: activeQIndex === idx ? '#fff' : 'transparent',
                                    padding: '0.4rem 1rem',
                                    borderRadius: '4px',
                                    boxShadow: activeQIndex === idx ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                    cursor: 'pointer',
                                    color: activeQIndex === idx ? '#333' : '#666',
                                    fontWeight: activeQIndex === idx ? 600 : 400,
                                    fontSize: '0.9rem'
                                }}
                            >
                                Question {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <button
                        onClick={handleAttemptExit}
                        style={{
                            background: '#fff',
                            border: '1px solid #ef4444',
                            color: '#ef4444',
                            padding: '0.4rem 1rem',
                            borderRadius: '4px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: '0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#fff' }}
                    >
                        Exit Session
                    </button>
                </div>
            </div>

            {/* Main Content Area - Split Pane */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '0', gap: '0' }}>

                {/* Left Side: Description */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', borderRight: '1px solid #e0e0e0', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', background: '#fafafa', borderBottom: '1px solid #e0e0e0', padding: '0 8px' }}>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1rem',
                            background: '#fff', color: '#818cf8', border: 'none', borderTop: '2px solid transparent',
                            borderBottom: '2px solid #818cf8', fontSize: '0.85rem', fontWeight: 600
                        }}>
                            <FileText size={16} /> Description
                        </button>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1rem',
                            background: 'transparent', color: '#888', border: 'none', fontSize: '0.85rem', fontWeight: 500
                        }}>
                            <History size={16} /> Submissions
                        </button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem' }}>
                        <div className="problem-content light-markdown">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '100px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: currentQ?.difficulty === 'Hard' ? '#fef2f2' : currentQ?.difficulty === 'Medium' ? '#fffbeb' : '#f0fdf4',
                                    color: currentQ?.difficulty === 'Hard' ? '#ef4444' : currentQ?.difficulty === 'Medium' ? '#f59e0b' : '#818cf8',
                                    border: '1px solid currentColor'
                                }}>
                                    {currentQ?.difficulty || 'Medium'}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.8rem' }}>
                                    <Brain size={14} />
                                    <span>Algorithms</span>
                                </div>
                            </div>

                            <h1 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                                {activeQIndex + 1}. {currentQ?.title}
                            </h1>

                            <div className="markdown-body" style={{ color: '#3c3c3c', fontSize: '1rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {currentQ?.description || "No description available."}
                                </ReactMarkdown>
                            </div>

                            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
                                <h4 style={{ fontSize: '0.9rem', color: '#1a1a1a', marginBottom: '1rem', fontWeight: 600 }}>Discussion & Hints</h4>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button style={{ padding: '0.5rem 1rem', background: '#f5f5f5', border: 'none', borderRadius: '6px', fontSize: '0.8rem', color: '#666', cursor: 'pointer' }}>Show Hint 1</button>
                                    <button style={{ padding: '0.5rem 1rem', background: '#f5f5f5', border: 'none', borderRadius: '6px', fontSize: '0.8rem', color: '#666', cursor: 'pointer' }}>Related Topics</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Editor & Bottom Panel */}
                <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '0' }}>

                    {/* Editor Panel */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden' }}>

                        <div style={{
                            height: '40px', background: '#fafafa', borderBottom: '1px solid #e0e0e0',
                            display: 'flex', alignItems: 'center', padding: '0 0.75rem', justifyContent: 'space-between',
                            flexShrink: 0
                        }}>
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowLangMenu(!showLangMenu)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent',
                                        border: 'none', color: '#333', fontSize: '0.85rem', fontWeight: 500,
                                        cursor: 'pointer', padding: '0.25rem 0.5rem'
                                    }}
                                >
                                    <span>{selectedLang.name}</span>
                                    <ChevronDown size={14} style={{ opacity: 0.5 }} />
                                </button>
                                {showLangMenu && (
                                    <div style={{
                                        position: 'absolute', top: '100%', left: 0, marginTop: '8px',
                                        background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px',
                                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '140px', overflow: 'hidden'
                                    }}>
                                        {LANGUAGES.map(lang => (
                                            <button key={lang.id} onClick={() => handleLangChange(lang)}
                                                style={{
                                                    width: '100%', textAlign: 'left', padding: '0.75rem 1rem', border: 'none',
                                                    background: selectedLang.id === lang.id ? '#f0fdf4' : 'transparent',
                                                    color: selectedLang.id === lang.id ? '#818cf8' : '#444',
                                                    fontSize: '0.85rem', cursor: 'pointer', transition: '0.1s'
                                                }}>
                                                {lang.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: '0.4rem' }}>
                                <Maximize2 size={14} />
                            </button>
                        </div>

                        <textarea
                            value={answers[activeQIndex] || ''}
                            onChange={(e) => handleCodeChange(e.target.value)}
                            spellCheck="false" autoComplete="off" autoCorrect="off" autoCapitalize="off"
                            style={{
                                flex: 1, background: '#fff', border: 'none', color: '#24292e',
                                fontFamily: '"Fira Code", "Source Code Pro", "Consolas", monospace',
                                fontSize: '0.9rem', padding: '1rem', resize: 'none', outline: 'none', lineHeight: 1.5
                            }}
                        />
                    </div>

                    {/* Bottom Console Panel (Light Mode Equivalent) */}
                    <div style={{ height: '35%', background: '#fff', borderTop: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>

                        <div style={{ display: 'flex', background: '#fafafa', borderBottom: '1px solid #e0e0e0', padding: '0 8px', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex' }}>
                                {['Testcase', 'Test Result'].map(tab => (
                                    <button key={tab} onClick={() => setActiveBottomTab(tab)}
                                        style={{
                                            padding: '0.6rem 1rem', background: activeBottomTab === tab ? '#fff' : 'transparent',
                                            color: activeBottomTab === tab ? '#333' : '#888', border: 'none',
                                            borderTop: '2px solid transparent',
                                            borderBottom: activeBottomTab === tab ? '2px solid #818cf8' : 'none',
                                            fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                                        }}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingRight: '0.5rem' }}>
                                <span style={{ fontSize: '0.85rem', color: '#888' }}>Console</span>
                                <ChevronDown size={14} color="#888" />
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', fontFamily: '"Fira Code", monospace' }}>
                            {activeBottomTab === 'Testcase' && (
                                <div style={{ color: '#444', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {currentQ?.testCases?.length > 0 ? (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                                {currentQ.testCases.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setActiveTestCaseTab(idx)}
                                                        style={{
                                                            padding: '0.35rem 0.9rem',
                                                            background: activeTestCaseTab === idx ? '#eff6ff' : 'transparent',
                                                            color: activeTestCaseTab === idx ? '#818cf8' : '#888',
                                                            border: '1px solid',
                                                            borderColor: activeTestCaseTab === idx ? '#818cf8' : 'transparent',
                                                            borderRadius: '6px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        Case {idx + 1}
                                                    </button>
                                                ))}
                                            </div>
                                            <div style={{ fontSize: '0.85rem' }}>
                                                <div style={{ color: '#888', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Input</div>
                                                <div style={{ background: '#f8f9fa', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '1rem', color: '#1a1a1a' }}>
                                                    {currentQ.testCases[activeTestCaseTab]?.input || 'No input provided'}
                                                </div>
                                                <div style={{ color: '#888', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Expected Output</div>
                                                <div style={{ background: '#f8f9fa', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb', color: '#1a1a1a' }}>
                                                    {currentQ.testCases[activeTestCaseTab]?.expected || 'No expected output'}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>
                                            No sample test cases available for this question.
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeBottomTab === 'Test Result' && (
                                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {!currentResult && !running && (
                                        <div style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>
                                            <p style={{ fontSize: '0.9rem' }}>Run your code to see the test results here.</p>
                                        </div>
                                    )}
                                    {running && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem' }}>
                                            <Loader2 className="animate-spin" size={24} color="#818cf8" />
                                            <span style={{ fontSize: '0.85rem', color: '#666' }}>Judging...</span>
                                        </div>
                                    )}
                                    {currentResult && !running && (
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                                <h2 style={{ color: currentResult.passed ? '#818cf8' : '#ef4444', margin: 0, fontSize: '1.2rem' }}>
                                                    {currentResult.message}
                                                </h2>
                                                <span style={{ color: '#888', fontSize: '0.85rem' }}>Runtime: 49ms</span>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#444' }}>
                                                Check all test cases to verify correctness.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bottom Actions Bar */}
                        <div style={{ height: '48px', borderTop: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', padding: '0 1rem', justifyContent: 'flex-end', gap: '0.5rem', background: '#fff' }}>
                            <button
                                onClick={handleRunCode}
                                disabled={running || submitting}
                                style={{
                                    background: '#f8f9fa', color: '#333', border: '1px solid #d1d5db', padding: '0.45rem 1rem',
                                    borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: '0.2s'
                                }}
                            >
                                <Play size={14} /> Run Code
                            </button>

                            <button
                                onClick={() => submitToBackend(false)}
                                disabled={running || submitting}
                                style={{
                                    background: '#818cf8', color: '#fff', border: 'none', padding: '0.45rem 1.5rem',
                                    borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: '0.2s'
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Exit Confirmation Modal */}
            {showExitModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: '#fff', width: '550px', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        overflow: 'hidden', display: 'flex', flexDirection: 'column'
                    }}>
                        <div style={{ padding: '1.5rem 2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#fef3c7', color: '#d97706', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>?</div>
                                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#333', fontWeight: 600 }}>Are you sure you want to exit this session?</h2>
                            </div>

                            {getUnsubmittedQuestions().length > 0 && (
                                <div style={{ border: '1px solid #fde047', background: '#fefce8', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', color: '#854d0e', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    You have not submitted a solution for Questions {getUnsubmittedQuestions().join(', ')}. Remember, you can get partial credit for partially correct solutions.
                                </div>
                            )}

                            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                You haven't finished the mock assessment yet. This action is not reversible!
                            </p>

                            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                                If you exit now, you won't get an accurate score report. We strongly suggest you continue solving problems and persevere until the end, as you would in a real interview.
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    onClick={() => setShowExitModal(false)}
                                    style={{ padding: '0.6rem 1.25rem', background: '#fff', border: '1px solid #d1d5db', borderRadius: '4px', color: '#4b5563', fontWeight: 500, cursor: 'pointer', transition: '0.2s' }}
                                    onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                                    onMouseLeave={(e) => e.target.style.background = '#fff'}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={submitting}
                                    onClick={() => submitToBackend(false)}
                                    style={{ padding: '0.6rem 1.25rem', background: '#fff', border: '1px solid #ec4899', borderRadius: '4px', color: '#ec4899', fontWeight: 500, cursor: 'pointer', transition: '0.2s' }}
                                    onMouseEnter={(e) => e.target.style.background = '#fdf2f8'}
                                    onMouseLeave={(e) => e.target.style.background = '#fff'}
                                >
                                    {submitting ? 'Submitting...' : 'Exit (not recommended)'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
    .light - markdown.markdown - body h1, 
                .light - markdown.markdown - body h2, 
                .light - markdown.markdown - body h3 {
    border - bottom: 1px solid #eaecef;
    padding - bottom: 0.3em;
    margin - top: 1.5em;
    margin - bottom: 1rem;
    color: #24292e;
    font - weight: 600;
}
                .light - markdown.markdown - body p { margin - bottom: 1rem; color: #24292e; }
                .light - markdown.markdown - body code {
    background: rgba(27, 31, 35, 0.05);
    padding: 0.2em 0.4em;
    border - radius: 3px;
    font - family: SFMono - Regular, Consolas, Liberation Mono, Menlo, monospace;
    color: #24292e;
    font - size: 85 %;
}
                .light - markdown.markdown - body pre {
    background: #f6f8fa;
    padding: 1rem;
    border - radius: 6px;
    overflow: auto;
    line - height: 1.45;
    margin - bottom: 1rem;
    border: 1px solid #eaecef;
}
                .light - markdown.markdown - body pre code { background: transparent; padding: 0; color: #24292e; }
                .light - markdown.markdown - body strong { color: #24292e; font - weight: 600; }
                .light - markdown.markdown - body ul, .light - markdown.markdown - body ol { margin - bottom: 1rem; padding - left: 2em; }
`}</style>
        </div>
    );
};

export default MockAssessment;
