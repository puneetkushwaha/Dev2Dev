import React, { useState, useEffect, useRef } from 'react';
import Loader from '../components/Loader';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Activity, AlertCircle, ArrowLeft, BookOpen, Bot, Brain, Briefcase,
    Check, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Code,
    Cpu, DollarSign, FileCode, FileText, History, Layers, Layout,
    Loader2, MessageCircle, MessageSquare, Play, RotateCcw, Save,
    Send, Settings, Sparkles, Target, Terminal, Trophy, X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { domainDetails, defaultDomain } from '../data/domainData';
import axios from 'axios';
import './Learning.css';

const Learning = () => {
    // --- State Management ---
    const [selectedDomain, setSelectedDomain] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTopic, setActiveTopic] = useState(null);
    const [lessonLoading, setLessonLoading] = useState(false);
    const [lessonContent, setLessonContent] = useState(null);
    const [userCode, setUserCode] = useState('');
    const [executionResult, setExecutionResult] = useState(null);
    const [dbTopics, setDbTopics] = useState([]); // Topics from MongoDB (admin-added)
    const [completedTopics, setCompletedTopics] = useState([]);
    const [topicsLoading, setTopicsLoading] = useState(false);

    // UI Navigation State
    const [activeTab, setActiveTab] = useState('theory'); // 'theory', 'teacher', 'quiz', 'exercise'
    const [leftPanelMode, setLeftPanelMode] = useState('lesson'); // 'lesson' or 'curriculum'

    // AI Teacher State
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);

    // Quiz State
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizResult, setQuizResult] = useState(null);

    // LeetCode Pro UI State
    const [proLeftTab, setProLeftTab] = useState('description'); // 'description', 'editorial', 'solutions', 'submissions'
    const [proBottomTab, setProBottomTab] = useState('testcase'); // 'testcase', 'result'
    const [showConsole, setShowConsole] = useState(false);
    const [lockAlert, setLockAlert] = useState(null); // { title: '', prevTopic: '' }

    const location = useLocation();
    const navigate = useNavigate();
    const chatEndRef = useRef(null);
    const editorRef = useRef(null);

    const handleCodeKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const value = e.target.value;

            const newValue = value.substring(0, start) + "    " + value.substring(end);
            setUserCode(newValue);

            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 4;
                }
            }, 0);
        }
    };
    // --- Effects ---
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userRes = await fetch(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await userRes.json();
                setUserData(data);
                setCompletedTopics(data.completedTopics || []);

                // Corrected Priority: user profile > location.state > localStorage
                // Favoring profile's selectedDomain as requested by the user
                let targetDomain = data.selectedDomain
                    || (location.state && location.state.domain)
                    || localStorage.getItem('selectedDomain')
                    || 'Full Stack Development';

                if (targetDomain) {
                    localStorage.setItem('selectedDomain', targetDomain);
                }

                setSelectedDomain(targetDomain);

                const params = new URLSearchParams(window.location.search);
                const topicFromUrl = params.get('topic');
                const topicFromState = location.state && location.state.topic;

                // Priority: URL > State.
                // NOTE: We don't use localStorage here as a generic fallback anymore
                // because it prevents the user from going back to the curriculum view
                // when clicking "Courses" in the Navbar.
                const activeTopicToSet = topicFromUrl || topicFromState;

                if (activeTopicToSet) {
                    handleStartTopic(activeTopicToSet, targetDomain);
                } else {
                    // CRITICAL: If no topic in URL, show Curriculum list
                    setActiveTopic(null);
                    localStorage.removeItem('activeTopic');
                }

                setLoading(false);
            } catch (err) {
                console.error("Failed to load user data", err);
                setLoading(false);
            }
        };
        fetchUserData();
    }, [location.search, location.state]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    // Fetch topics for the current domain from MongoDB whenever selectedDomain changes
    useEffect(() => {
        if (!selectedDomain) return;
        const fetchDomainTopics = async () => {
            setTopicsLoading(true);
            try {
                const domainsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/domains`);
                const domain = domainsRes.data.find(d => d.name === selectedDomain);
                if (!domain) { setDbTopics([]); return; }
                const topicsRes = await axios.get(
                    `${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/domains/topics/by-domain/${domain._id}`
                );
                setDbTopics(topicsRes.data || []);
            } catch (err) {
                console.warn('Could not fetch domain topics from DB', err.message);
                setDbTopics([]);
            } finally {
                setTopicsLoading(false);
            }
        };
        fetchDomainTopics();
    }, [selectedDomain]);

    // --- Logic Handlers ---
    // topic can be a string (topic title) or an object {_id, title} from dbTopics
    const handleStartTopic = async (topicOrTitle, domainOverride = null) => {
        const domain = domainOverride || selectedDomain;
        const topicTitle = typeof topicOrTitle === 'string' ? topicOrTitle : topicOrTitle.title;
        let topicId = typeof topicOrTitle === 'object' ? topicOrTitle._id : null;

        // If topicId is missing (e.g. from URL), try to find it in the already loaded dbTopics list
        if (!topicId && dbTopics.length > 0) {
            const match = dbTopics.find(t => t.title === topicTitle);
            if (match) topicId = String(match._id);
        }

        // If STILL missing, try one last check to backend specifically for this title
        // (This handles the case where dbTopics hasn't loaded yet on first page mount/refresh)
        if (!topicId) {
            try {
                const domainsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/domains`);
                const domainDoc = domainsRes.data.find(d => d.name === domain);
                if (domainDoc) {
                    const tRes = await axios.get(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/domains/topics/${domainDoc._id}`);
                    const dbT = (tRes.data || []).find(t => t.title === topicTitle);
                    if (dbT) topicId = dbT._id;
                }
            } catch (err) { console.warn("Failed pre-fetch lookup", err); }
        }

        // --- VALIDATION GUARD ---
        // If topicId is still missing, it means this topic is NOT in the domain's curriculum.
        // We should NOT allow AI to generate content for random/deleted topics to prevent domain contamination.
        if (!topicId) {
            console.error(`Unauthorized topic attempt: ${topicTitle} in ${domain}`);
            setLockAlert({ title: topicTitle, prevTopic: 'Authorized Module' });
            setTimeout(() => {
                setLockAlert(null);
                setActiveTopic(null);
                window.history.replaceState(null, '', window.location.pathname);
            }, 3000);
            return;
        }

        // Update URL for persistence
        window.history.replaceState(null, '', `?topic=${encodeURIComponent(topicTitle)}`);

        // Save to localStorage for refresh persistence
        localStorage.setItem('selectedDomain', domain);
        localStorage.setItem('activeTopic', topicTitle);

        setActiveTopic(topicTitle);
        setLessonLoading(true);
        setActiveTab('theory');
        setExecutionResult(null);
        setQuizResult(null);
        setQuizAnswers({});
        setChatMessages([{
            role: 'ai',
            text: `Welcome! Today we are mastering **${topicTitle}**. Read through the theory, or ask me anything if you get stuck!`
        }]);

        try {
            // 1. Try fetching stored content from MongoDB first (FAST - no AI needed)
            if (topicId) {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/domains/topics/detail/${String(topicId)}`);
                const t = res.data;
                // Map DB content fields to lessonContent shape
                const content = {
                    theory: t.content?.explanation || '',
                    editorial: t.content?.editorial || '',
                    description: t.content?.description || t.content?.problemStatement || '',
                    exercise: t.content?.description || '',
                    examples: t.content?.examples || (t.content?.codeExamples || []).join('\n'),
                    solution_stub: t.content?.starterCode || t.content?.solutionStub || '',
                    test_case: t.content?.testCase || '',
                    testCases: t.content?.testCases || [],
                    quiz: (t.quiz || []).map(q => ({
                        question: q.question,
                        options: q.options,
                        answer: q.correctAnswer ?? q.answer
                    }))
                };
                // If there's at least some content, use DB data
                if (content.theory || content.description) {
                    setLessonContent(content);
                    setUserCode(content.solution_stub || `function solution() {\n  // Write your code here\n}`);
                    setLessonLoading(false);
                    return;
                }
            }

            // 2. Fallback: call AI service if no stored content
            const aiRes = await fetch(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/generate-lesson`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain, topic: topicTitle })
            });
            const data = await aiRes.json();

            // Map AI response to state
            const mappedContent = {
                ...data,
                theory: data.theory || '',
                editorial: data.editorial || '',
                description: data.description || data.exercise || '',
                examples: data.examples || '',
                solution_stub: data.solution_stub || '',
                testCases: data.testCases || (data.test_case ? [{ input: 'true', expected: data.test_case, description: 'Default Check' }] : [])
            };

            setLessonContent(mappedContent);
            setUserCode(data.solution_stub || '');

            // 3. Cache generated content to backend for future consistency
            try {
                await axios.post(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/domains/topics/cache-content`, {
                    domainName: domain,
                    topicTitle: topicTitle,
                    content: mappedContent,
                    quiz: data.quiz || []
                });
            } catch (cacheErr) {
                console.warn("Failed to cache AI lesson", cacheErr.message);
            }

        } catch (err) {
            console.error("Lesson fetch error", err);
        } finally {
            setLessonLoading(false);
        }
    };

    const runCode = () => {
        try {
            // Sanitize user code: remove markdown backticks if leaked from stubs
            const cleanUserCode = userCode.replace(/```javascript\n|```[a-z]*\n|```/g, '').trim();
            const testCases = lessonContent?.testCases || lessonContent?.test_cases || [];

            if (testCases.length === 0) {
                // Fallback to old single test_case if no array found
                const resultExpr = (lessonContent?.test_case || 'true').replace(/;$/, '').trim();
                const fullCode = `${cleanUserCode}; ${resultExpr}`;
                // eslint-disable-next-line no-eval
                const result = eval(fullCode);
                setExecutionResult({
                    success: result === true,
                    message: result === true ? "Accepted: All basic checks passed." : "Wrong Answer: Output mismatch."
                });
                if (result === true) saveProgress(activeTopic);
                return;
            }

            let passedCount = 0;
            let firstFailure = null;

            testCases.forEach((tc, idx) => {
                try {
                    // Robustly handle cases where tc.input or tc.expected might not be strings
                    const rawInput = tc.input !== undefined && tc.input !== null ? String(tc.input) : '';
                    const rawExpected = tc.expected !== undefined && tc.expected !== null ? String(tc.expected) : '';

                    const cleanInput = rawInput.replace(/;$/, '').trim();
                    const cleanExpected = rawExpected.replace(/;$/, '').trim();

                    if (!cleanInput) return; // Skip empty test cases

                    // We evaluate in a sandbox-ish closure
                    const fullCode = `(function() { 
                        ${cleanUserCode}; 
                        try {
                            // Use eval for the input itself to handle any labeled or complex expressions
                            const actual = eval(${JSON.stringify(cleanInput)});
                            const expectedValue = ${cleanExpected};
                            
                            const actualStr = JSON.stringify(actual);
                            const expectedStr = JSON.stringify(expectedValue);
                            
                            // Return detailed result for better UI feedback
                            if (actualStr === expectedStr || String(actual) === String(expectedValue)) {
                                return { success: true };
                            }
                            return { 
                                success: false, 
                                actual: actualStr !== undefined ? actualStr : String(actual), 
                                expected: expectedStr !== undefined ? expectedStr : String(expectedValue) 
                            };
                        } catch(innerErr) {
                            return { error: innerErr.message };
                        }
                    })()`;

                    // eslint-disable-next-line no-eval
                    const res = eval(fullCode);

                    if (res.success) {
                        passedCount++;
                    } else if (res.error) {
                        if (!firstFailure) firstFailure = `Runtime Error on Test Case ${idx + 1} (${cleanInput}): ${res.error}`;
                    } else if (!firstFailure) {
                        // Include the input in the failure message so the user knows WHICH one failed
                        firstFailure = `Test Case ${idx + 1} Failed: For input "${cleanInput}", expected ${res.expected}, but got ${res.actual}`;
                    }
                } catch (e) {
                    if (!firstFailure) firstFailure = `Engine Error on Test Case ${idx + 1}: ${e.message}`;
                }
            });

            if (passedCount === testCases.length) {
                setExecutionResult({
                    success: true,
                    message: `Accepted: ${passedCount}/${testCases.length} Test Cases Passed! ✨`
                });
                saveProgress(activeTopic);
            } else {
                setExecutionResult({
                    success: false,
                    message: firstFailure || "Wrong Answer"
                });
            }
        } catch (err) {
            setExecutionResult({ success: false, message: "Engine Error: " + err.message });
        }
    };

    const sendChatMessage = async () => {
        if (!chatInput.trim()) return;
        const msg = chatInput.trim();
        setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
        setChatInput('');
        setChatLoading(true);

        // Add a placeholder for the AI response
        setChatMessages(prev => [...prev, { role: 'ai', text: '' }]);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/ai-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: msg,
                    domain: selectedDomain,
                    topic: activeTopic
                })
            });

            if (!response.ok) throw new Error("Failed to connect to AI");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedText += chunk;

                // Update the last AI message in the chat
                setChatMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'ai', text: accumulatedText };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setChatMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'ai', text: "I'm having a bit of brain fog. Check if my AI service is running!" };
                return newMessages;
            });
        } finally {
            setChatLoading(false);
        }
    };

    const handleQuizSubmit = () => {
        if (!lessonContent?.quiz) return;
        let score = 0;
        lessonContent.quiz.forEach((q, idx) => {
            if (quizAnswers[idx] === q.answer) score++;
        });
        setQuizResult({
            score,
            total: lessonContent.quiz.length,
            percentage: Math.round((score / lessonContent.quiz.length) * 100)
        });

        // LOCKING LOGIC: Save progress if pass score >= 80%
        const percentage = Math.round((score / lessonContent.quiz.length) * 100);
        if (percentage >= 80) {
            saveProgress(activeTopic);
            // Update local state to immediately unlock next topic
            setCompletedTopics(prev => prev.includes(activeTopic) ? prev : [...prev, activeTopic]);
        }
    };

    const saveProgress = async (topic) => {
        const token = localStorage.getItem('token');
        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/complete-topic`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ topic })
            });
        } catch (err) {
            console.error("Save progress error", err);
        }
    };

    if (loading) {
        return <Loader text="Loading Curriculum..." />;
    }

    const details = domainDetails[selectedDomain] || defaultDomain;

    // Calculate real-time progress for the current domain
    const domainCompletedCount = dbTopics.filter(t => completedTopics.includes(t.title)).length;
    const realProgress = dbTopics.length > 0 ? Math.round((domainCompletedCount / dbTopics.length) * 100) : 0;

    // --- Sub-Renderers ---

    const renderProWorkspace = () => (
        <main className="learning-workspace">
            {/* Left Pane: Content (Description, Editorial, etc.) */}
            <div className="pane-left">
                <div style={{ background: '#333', padding: '0 1rem', display: 'flex', gap: '1rem', height: '40px', alignItems: 'center' }}>
                    {[
                        { id: 'description', label: 'Description', icon: <FileText size={14} /> },
                        { id: 'editorial', label: 'Editorial', icon: <BookOpen size={14} /> },
                        { id: 'solutions', label: 'Solutions', icon: <MessageCircle size={14} /> },
                        { id: 'submissions', label: 'Submissions', icon: <History size={14} /> }
                    ].map(tab => (
                        <div
                            key={tab.id}
                            onClick={() => setProLeftTab(tab.id)}
                            style={{
                                color: proLeftTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
                                fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                borderBottom: proLeftTab === tab.id ? '2px solid #fff' : 'none',
                                height: '100%', padding: '0 0.2rem'
                            }}
                        >
                            {tab.icon} {tab.label}
                        </div>
                    ))}
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', color: 'rgba(255,255,255,0.9)' }}>
                    {proLeftTab === 'description' && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{activeTopic}</h2>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <span style={{
                                    padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                                    background: lessonContent?.difficulty === 'Easy' ? 'rgba(0,184,163,0.15)' : (lessonContent?.difficulty === 'Hard' ? 'rgba(255,55,95,0.15)' : 'rgba(255,184,0,0.15)'),
                                    color: lessonContent?.difficulty === 'Easy' ? '#00b8a3' : (lessonContent?.difficulty === 'Hard' ? '#ff375f' : '#ffb800')
                                }}>
                                    {lessonContent?.difficulty || 'Medium'}
                                </span>
                                <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '0.75rem', opacity: 0.6 }}>Topics</span>
                                <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '0.75rem', opacity: 0.6 }}>Companies</span>
                            </div>

                            <div style={{ lineHeight: 1.7, fontSize: '1rem' }}>
                                {(lessonContent?.description || lessonContent?.exercise || '').split('\n').map((line, i) => (
                                    <p key={i} style={{ marginBottom: '1rem' }}>{line}</p>
                                ))}
                            </div>

                            {lessonContent?.examples && (
                                <div style={{ marginTop: '2rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.8 }}>Example 1:</h4>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderLeft: '3px solid rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>
                                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                            {lessonContent.examples.replace(/```[a-z]*\n/g, '').replace(/```/g, '')}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.8 }}>Constraints:</h4>
                                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', opacity: 0.7, fontSize: '0.9rem' }}>
                                    <li>Standard memory limits apply.</li>
                                    <li>Time complexity should be optimized.</li>
                                    <li>Edge cases must be handled.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                    {proLeftTab === 'editorial' && (
                        <div className="animate-fade-in">
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Briefcase size={20} /> Editorial & Optimal Solution
                            </h3>
                            {lessonContent?.editorial ? (
                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <pre style={{ margin: 0, fontFamily: "'Fira Code', monospace", fontSize: '0.95rem', color: '#A5B4FC', whiteSpace: 'pre-wrap' }}>
                                        {lessonContent.editorial}
                                    </pre>
                                </div>
                            ) : (
                                <div className="flex-center" style={{ height: '200px', flexDirection: 'column', opacity: 0.5 }}>
                                    <Bot size={40} />
                                    <p style={{ marginTop: '1rem' }}>Editorial for this specific challenge is being prepared.</p>
                                </div>
                            )}
                        </div>
                    )}
                    {proLeftTab === 'solutions' && (
                        <div className="flex-center" style={{ height: '100%', flexDirection: 'column', opacity: 0.5 }}>
                            <MessageCircle size={40} />
                            <p style={{ marginTop: '1rem' }}>Be the first to share a solution!</p>
                        </div>
                    )}
                    {proLeftTab === 'submissions' && (
                        <div className="flex-center" style={{ height: '100%', flexDirection: 'column', opacity: 0.5 }}>
                            <History size={40} />
                            <p style={{ marginTop: '1rem' }}>No recent submissions found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Pane: Editor & Console */}
            <div className="pane-right">
                {/* Editor Section */}
                <div className="editor-section">
                    <div style={{ background: '#333', height: '40px', display: 'flex', alignItems: 'center', padding: '0 1rem', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#818cf8', fontSize: '0.85rem', fontWeight: 600 }}>
                            <Code size={14} /> JavaScript <ChevronDown size={14} />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Settings size={14} style={{ opacity: 0.5 }} />
                            <RotateCcw size={14} style={{ opacity: 0.5 }} onClick={() => setUserCode(lessonContent?.solution_stub || '')} />
                        </div>
                    </div>

                    <div style={{ flex: 1, position: 'relative', background: '#1e1e1e' }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '40px', height: '100%',
                            background: 'rgba(0,0,0,0.2)', borderRight: '1px solid rgba(255,255,255,0.03)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            paddingTop: '1.25rem', color: 'rgba(255,255,255,0.15)', fontSize: '0.8rem',
                            pointerEvents: 'none', overflowY: 'hidden', fontFamily: 'monospace'
                        }}>
                            {userCode.split('\n').map((_, i) => (
                                <div key={i} style={{ height: '1.5rem', display: 'flex', alignItems: 'center' }}>{i + 1}</div>
                            ))}
                        </div>
                        <textarea
                            value={userCode}
                            onChange={(e) => setUserCode(e.target.value)}
                            spellCheck="false"
                            style={{
                                width: '100%', height: '100%', background: 'transparent', color: '#9CDCFE',
                                border: 'none', padding: '1.25rem 1rem 1rem 3.5rem',
                                fontFamily: "'Fira Code', monospace", fontSize: '1rem', lineHeight: '1.5',
                                outline: 'none', resize: 'none'
                            }}
                        />
                    </div>

                    <div style={{ background: '#333', height: '48px', display: 'flex', alignItems: 'center', padding: '0 1rem', justifyContent: 'space-between' }}>
                        <button
                            onClick={() => setShowConsole(!showConsole)}
                            style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                            Console {showConsole ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => { runCode(); setProBottomTab('result'); setShowConsole(true); }}
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.4rem 1.2rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Run
                            </button>
                            <button
                                onClick={() => { runCode(); setProBottomTab('result'); setShowConsole(true); }}
                                style={{ background: '#818cf8', border: 'none', color: '#000', padding: '0.4rem 1.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>

                {/* Console Section */}
                {showConsole && (
                    <div className="console-section">
                        <div style={{ background: '#333', padding: '0 1rem', display: 'flex', gap: '1rem', height: '40px', alignItems: 'center' }}>
                            <div
                                onClick={() => setProBottomTab('testcase')}
                                style={{ color: proBottomTab === 'testcase' ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                <Terminal size={14} /> Testcase
                            </div>
                            <div
                                onClick={() => setProBottomTab('result')}
                                style={{ color: proBottomTab === 'result' ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                <Activity size={14} /> Test Result
                            </div>
                        </div>
                        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                            {proBottomTab === 'testcase' ? (
                                <div style={{ color: 'rgba(255,255,255,0.6)' }}>
                                    <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Input:</p>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                        {lessonContent?.examples?.split('\n')[1] || 'Default testcase loaded.'}
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-fade-in">
                                    {executionResult ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: executionResult.success ? '#818cf8' : '#EF4444', fontWeight: 700, fontSize: '1.2rem' }}>
                                                {executionResult.success ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                                                {executionResult.success ? 'Accepted' : 'Wrong Answer'}
                                            </div>
                                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <p style={{ margin: 0, opacity: 0.6, fontSize: '0.8rem', marginBottom: '0.75rem' }}>Result Analysis:</p>
                                                {executionResult.success ? (
                                                    <div style={{ color: '#fff', fontSize: '0.9rem' }}>{executionResult.message}</div>
                                                ) : (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                        <div style={{ color: '#EF4444', fontSize: '0.9rem', fontWeight: 600 }}>{executionResult.message}</div>
                                                        {executionResult.actual !== undefined && (
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                                                                <div>
                                                                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.3rem' }}>Expected</p>
                                                                    <pre style={{ margin: 0, fontSize: '0.85rem', color: '#818cf8' }}>{executionResult.expected}</pre>
                                                                </div>
                                                                <div>
                                                                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.3rem' }}>Actual</p>
                                                                    <pre style={{ margin: 0, fontSize: '0.85rem', color: '#EF4444' }}>{executionResult.actual}</pre>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-center" style={{ height: '100%', color: 'rgba(255,255,255,0.3)', flexDirection: 'column' }}>
                                            <Cpu size={30} />
                                            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Run your code to see results.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );

    const renderTheory = () => (
        <div className="animate-fade-in" style={{ padding: '0 1rem' }}>
            <div className="markdown-content" style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {lessonContent?.theory || ''}
                </ReactMarkdown>
            </div>

            {lessonContent?.examples && (
                <div style={{ marginTop: '2rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: details.color, marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600, opacity: 0.8 }}>
                        <FileCode size={16} /> IMPLEMENTATION EXAMPLE
                    </div>
                    <pre style={{ margin: 0, fontFamily: "'Fira Code', monospace", fontSize: '0.9rem', color: '#A5B4FC', whiteSpace: 'pre-wrap' }}>
                        {(Array.isArray(lessonContent.examples)
                            ? lessonContent.examples.join('\n')
                            : String(lessonContent.examples)
                        ).replace(/```[a-z]*\n/g, '').replace(/```/g, '')}
                    </pre>
                </div>
            )}


            <button
                onClick={() => setActiveTab('exercise')}
                className="btn btn-primary"
                style={{ marginTop: '3rem', width: '100%', padding: '1.2rem', background: details.color, color: '#000', borderRadius: '12px' }}
            >
                Proceed to Coding Practice <ChevronRight size={18} />
            </button>
        </div>
    );


    const renderTeacher = () => (
        <div className="animate-fade-in" style={{ height: 'calc(100vh - 350px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {chatMessages.map((m, i) => (
                    <div key={i} style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        background: m.role === 'user' ? details.color : 'rgba(255,255,255,0.03)',
                        color: m.role === 'user' ? '#000' : '#fff',
                        padding: '1rem', borderRadius: '16px',
                        maxWidth: '85%', border: m.role === 'ai' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        lineHeight: 1.5, fontSize: '0.95rem', fontWeight: m.role === 'user' ? 600 : 400
                    }}>
                        {m.text}
                    </div>
                ))}
                {chatLoading && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', padding: '0 1rem' }}>AI Teacher is thinking...</div>}
                <div ref={chatEndRef} />
            </div>

            <div style={{ padding: '1rem', display: 'flex', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <input
                    type="text"
                    placeholder="Type your question..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '1rem' }}
                />
                <button
                    onClick={sendChatMessage}
                    disabled={chatLoading}
                    style={{ background: details.color, border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <Send size={18} color="#000" />
                </button>
            </div>
        </div>
    );

    const renderExercise = () => (
        <div className="animate-fade-in" style={{ padding: '0 1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: details.color }}>
                    <Target size={20} /> PROBLEM STATEMENT
                </h3>
                <div className="markdown-content" style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, fontSize: '1rem' }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {lessonContent?.description || lessonContent?.exercise || ''}
                    </ReactMarkdown>
                </div>
            </div>

            {
                lessonContent?.examples && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Sparkles size={14} color={details.color} /> EXAMPLE CASE
                        </h4>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Fira Code', monospace" }}>
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#9CDCFE', fontSize: '0.9rem' }}>
                                {lessonContent.examples.replace(/```[a-z]*\n/g, '').replace(/```/g, '')}
                            </pre>
                        </div>
                    </div>
                )
            }

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.8 }}>Constraints & Info:</h4>
                <ul style={{ listStyle: 'none', padding: 0, opacity: 0.7, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color={details.color} /> Standard memory limits apply.</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color={details.color} /> Time complexity should be optimized.</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color={details.color} /> Handle edge cases appropriately.</li>
                </ul>
            </div>
        </div >
    );

    const renderQuiz = () => (
        <div className="animate-fade-in" style={{ padding: '0 1rem' }}>
            <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Knowledge Check: {activeTopic}</h3>
            {!quizResult ? (
                <>
                    {lessonContent?.quiz?.map((q, qIdx) => (
                        <div key={qIdx} style={{ marginBottom: '2.5rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }}>{qIdx + 1}. {q.question}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {q.options.map((opt, oIdx) => (
                                    <button
                                        key={oIdx}
                                        onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                                        style={{
                                            padding: '1rem', borderRadius: '12px', border: '1px solid',
                                            borderColor: quizAnswers[qIdx] === oIdx ? details.color : 'rgba(255,255,255,0.1)',
                                            background: quizAnswers[qIdx] === oIdx ? `${details.color}20` : 'transparent',
                                            color: quizAnswers[qIdx] === oIdx ? '#fff' : 'rgba(255,255,255,0.6)',
                                            textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={handleQuizSubmit}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1.2rem', background: details.color, color: '#000', borderRadius: '12px' }}
                    >
                        Submit Assessment
                    </button>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                        {quizResult.percentage >= 70 ? '🎉' : '📚'}
                    </div>
                    <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>{quizResult.percentage >= 70 ? 'Mastery Confirmed!' : 'Keep Learning!'}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', marginBottom: '2rem' }}>You scored {quizResult.score} out of {quizResult.total} ({quizResult.percentage}%)</p>
                    {quizResult.percentage < 70 && (
                        <button
                            onClick={() => { setQuizResult(null); setQuizAnswers({}); }}
                            className="btn btn-outline"
                            style={{ padding: '0.8rem 2rem' }}
                        >
                            Try Again
                        </button>
                    )}
                    <button
                        onClick={() => setActiveTopic(null)}
                        className="btn btn-primary"
                        style={{ background: details.color, color: '#000', padding: '0.8rem 2rem', marginLeft: '1rem' }}
                    >
                        Continue to Next Topic
                    </button>
                </div>
            )}
        </div>
    );

    // --- Main Layout ---

    return (
        <div
            className="animate-fade-in"
            style={{
                height: activeTopic ? '100vh' : 'auto',
                minHeight: '100vh',
                overflow: activeTopic ? 'hidden' : 'visible',
                background: '#050508',
                display: 'flex',
                flexDirection: 'column',
                color: '#fff'
            }}
        >
            {/* Minimal Header */}
            <header style={{ height: '60px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 2rem', justifyContent: 'space-between', zIndex: 10 }}>
                <div className="flex-center" style={{ gap: '1.25rem' }}>
                    <button
                        onClick={() => {
                            if (activeTopic) {
                                setActiveTopic(null);
                            } else {
                                navigate('/dashboard');
                            }
                        }}
                        style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                        className="hover-nav"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div onClick={() => setActiveTopic(null)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src="/logo.png" alt="Dev2Dev" style={{ height: '32px' }} />
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '1px' }}>Dev2Dev</span>
                    </div>
                    <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: details.color }}>{selectedDomain}</span>
                        {activeTopic && <> <ChevronRight size={14} /> <span style={{ color: '#fff' }}>{activeTopic}</span> </>}
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                        Track: <span style={{ color: '#818cf8', fontWeight: 700 }}>{realProgress}%</span>
                    </div>
                    <button
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        onClick={() => {
                            if (activeTopic) {
                                setActiveTopic(null);
                            } else {
                                document.getElementById('curriculum-section')?.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                    >
                        TRACK VIEW
                    </button>
                </div>
            </header>

            {activeTopic ? (
                (
                    /* VS CODE STYLE WORKSPACE (Other Domains) */
                    <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                        {/* Activity Bar */}
                        <nav style={{ width: '64px', borderRight: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 0', gap: '2rem' }}>
                            <div
                                title="Theory"
                                onClick={() => setActiveTab('theory')}
                                style={{ cursor: 'pointer', transition: 'all 0.3s', color: activeTab === 'theory' ? details.color : 'rgba(255,255,255,0.3)' }}
                            >
                                <BookOpen size={24} />
                            </div>
                            <div
                                title="AI Teacher"
                                onClick={() => setActiveTab('teacher')}
                                style={{ cursor: 'pointer', transition: 'all 0.3s', color: activeTab === 'teacher' ? details.color : 'rgba(255,255,255,0.3)' }}
                            >
                                <Brain size={24} />
                            </div>
                            <div
                                title="Assessment"
                                onClick={() => setActiveTab('quiz')}
                                style={{ cursor: 'pointer', transition: 'all 0.3s', color: activeTab === 'quiz' ? details.color : 'rgba(255,255,255,0.3)' }}
                            >
                                <CheckCircle size={24} />
                            </div>
                            <div
                                title="Practice"
                                onClick={() => setActiveTab('exercise')}
                                style={{ cursor: 'pointer', transition: 'all 0.3s', color: activeTab === 'exercise' ? details.color : 'rgba(255,255,255,0.3)' }}
                            >
                                <Code size={24} />
                            </div>
                            <div style={{ flex: 1 }}></div>
                            <div style={{ color: 'rgba(255,255,255,0.2)' }}><History size={20} /></div>
                        </nav>

                        {/* Left Pane: Content Hub */}
                        <div style={{ width: '40%', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ padding: '1.2rem 2rem', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.1rem', margin: 0, textTransform: 'capitalize' }}>{activeTab} Content</h3>
                                {lessonLoading && <Loader2 size={16} className="animate-spin" color={details.color} />}
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                                {lessonLoading ? (
                                    <Loader text="Analyzing lesson content..." />
                                ) : (
                                    <>
                                        {activeTab === 'theory' && renderTheory()}
                                        {activeTab === 'teacher' && renderTeacher()}
                                        {activeTab === 'quiz' && renderQuiz()}
                                        {activeTab === 'exercise' && renderExercise()}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Pane: Code Editor & Result */}
                        <div style={{ flex: 1, background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ background: '#12121c', padding: '0 1rem', display: 'flex', alignItems: 'center', height: '45px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0 1.25rem', height: '100%', display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.05)', gap: '0.5rem', color: '#fff', fontSize: '0.85rem' }}>
                                    <FileCode size={14} color={details.color} /> solution.js
                                </div>
                                <div style={{ flex: 1 }}></div>
                                <button
                                    onClick={runCode}
                                    style={{ background: details.color, border: 'none', borderRadius: '4px', padding: '0.2rem 1rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                >
                                    <Play size={12} fill="#000" /> RUN
                                </button>
                            </div>

                            {(() => {
                                const isTerminalMode = selectedDomain === 'Cyber Security' || activeTopic?.toLowerCase().includes('linux') || activeTopic?.toLowerCase().includes('bash');

                                return (
                                    <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden', background: isTerminalMode ? '#000' : 'transparent' }}>
                                        {!isTerminalMode && (
                                            <div style={{
                                                width: '45px',
                                                background: 'rgba(255,255,255,0.02)',
                                                borderRight: '1px solid rgba(255,255,255,0.05)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-end',
                                                paddingTop: '1.25rem',
                                                paddingRight: '10px',
                                                color: 'rgba(255,255,255,0.2)',
                                                fontFamily: '"Fira Code", monospace',
                                                fontSize: '0.85rem',
                                                userSelect: 'none',
                                                lineHeight: '1.7'
                                            }}>
                                                {(userCode || '').split('\n').map((_, i) => (
                                                    <div key={i}>{i + 1}</div>
                                                ))}
                                                {(!(userCode)) && [1, 2, 3, 4, 5].map(n => <div key={n}>{n}</div>)}
                                            </div>
                                        )}

                                        {isTerminalMode && (
                                            <div style={{
                                                padding: '1.25rem 0.5rem 0 1.25rem',
                                                color: '#4ec9b0',
                                                fontFamily: 'monospace',
                                                fontSize: '1rem',
                                                lineHeight: '1.7'
                                            }}>
                                                #
                                            </div>
                                        )}

                                        <textarea
                                            ref={editorRef}
                                            value={userCode}
                                            onChange={(e) => setUserCode(e.target.value)}
                                            onKeyDown={handleCodeKeyDown}
                                            spellCheck="false"
                                            placeholder={isTerminalMode ? "Enter terminal commands..." : "// Start coding here..."}
                                            style={{
                                                flex: 1,
                                                background: 'transparent',
                                                color: isTerminalMode ? '#4ec9b0' : '#A5B4FC',
                                                fontFamily: isTerminalMode ? '"Courier New", monospace' : '"Fira Code", "Consolas", monospace',
                                                fontSize: '1rem',
                                                padding: '1.25rem',
                                                border: 'none',
                                                outline: 'none',
                                                lineHeight: '1.7',
                                                resize: 'none',
                                                whiteSpace: 'pre',
                                                overflow: 'auto'
                                            }}
                                        />
                                    </div>
                                );
                            })()}

                            <div style={{ height: '35%', background: '#050508', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1rem' }}>
                                {executionResult && <p style={{ color: executionResult.success ? '#818cf8' : '#EF4444' }}>{executionResult.message}</p>}
                            </div>
                        </div>
                    </main>
                )
            ) : (
                /* TRACK OVERVIEW VIEW (RETAINED & POLISHED) */
                <main style={{ padding: '4rem 2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
                        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', background: `${details.color}15`, border: `1px solid ${details.color}40`, boxShadow: `0 0 40px ${details.color}20` }}>
                            {details.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: 0, letterSpacing: '-2px' }}>{selectedDomain}</h1>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Master the core essentials and build your professional path.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <div className="glass-panel" style={{ padding: '1rem 2rem', borderRadius: '16px', background: 'rgba(129, 140, 248,0.05)', border: '1px solid rgba(129, 140, 248,0.2)', textAlign: 'center' }}>
                                <div style={{ color: '#818cf8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Avg Salary</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{details.salary}</div>
                            </div>
                            <div className="glass-panel" style={{ padding: '1rem 2rem', borderRadius: '16px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', textAlign: 'center' }}>
                                <div style={{ color: '#F59E0B', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>Difficulty</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{details.difficulty}</div>
                            </div>
                        </div>
                    </div>

                    <div id="curriculum-section" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '3rem' }}>
                        <section>
                            <div className="card glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                                    <Layers size={22} color={details.color} /> Curriculum Modules
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                    {topicsLoading ? (
                                        <Loader text="Loading curriculum..." />
                                    ) : dbTopics.length > 0 ? (
                                        (() => {
                                            let categories = [];
                                            if (selectedDomain === 'Web Development') {
                                                categories = [
                                                    { name: 'Frontend', topics: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Tailwind CSS'] },
                                                    { name: 'Backend', topics: ['Node.js', 'REST APIs (RESTful Web Services)', 'JWT (JSON Web Token) Authentication'] },
                                                    { name: 'Databases', topics: ['PostgreSQL', 'Redis'] },
                                                    { name: 'DevOps & Cloud', topics: ['Linux Basics', 'AWS (Amazon Web Services)', 'Monitoring', 'CI/CD (Continuous Integration & Continuous Deployment)', 'Terraform (Infrastructure as Code)', 'Deployment', 'Automation', 'Git', 'GitHub', 'npm'] }
                                                ];
                                            } else if (selectedDomain === 'Cyber Security') {
                                                categories = [
                                                    { name: 'Foundation', topics: ['Fundamental IT Skills', 'Operating Systems', 'Virtualization', 'Networking'] },
                                                    { name: 'Core Security', topics: ['Security Skills & Concepts', 'Cryptography'] },
                                                    { name: 'Offensive Security', topics: ['Attacks & Exploits'] },
                                                    { name: 'Defensive Security', topics: ['Incident Response', 'Security Tools', 'Digital Forensics', 'SIEM / SOC'] },
                                                    { name: 'Infrastructure Security', topics: ['Cloud Security', 'Security Programming'] }
                                                ];
                                            } else if (selectedDomain === 'Mobile App Development') {
                                                categories = [
                                                    { name: '🧱 Foundation', topics: ['Android Fundamentals', 'Version Control'] },
                                                    { name: '⚙️ Core App Development', topics: ['App Components', 'Intents & Lifecycle', 'Layouts & UI', 'Navigation & Compose'] },
                                                    { name: '💾 Data & Backend', topics: ['Storage & Databases', 'Firebase & Services'] },
                                                    { name: '🏗️ Architecture', topics: ['Architecture Patterns', 'Networking', 'Async Programming', 'Testing & Debugging', 'Dependency Injection'] },
                                                    { name: '🚀 Deployment', topics: ['Distribution & Play Store'] }
                                                ];
                                            } else if (selectedDomain === 'AI & Data Science') {
                                                categories = [
                                                    { name: 'Foundation', topics: ['Mathematics', 'Statistics', 'Econometrics'] },
                                                    { name: 'Programming', topics: ['Python Coding'] },
                                                    { name: 'Data Layer', topics: ['Exploratory Data Analysis'] },
                                                    { name: 'AI Core', topics: ['Machine Learning', 'Deep Learning'] },
                                                    { name: 'Production AI', topics: ['MLOps'] }
                                                ];
                                            } else if (selectedDomain === 'Artificial Intelligence') {
                                                categories = [
                                                    { name: '🧱 Foundation', topics: ['Introduction to AI Engineering', 'Using Pre-trained Models'] },
                                                    { name: '🔌 Platform & Ecosystem', topics: ['OpenAI Platform & API', 'Other AI Model Providers', 'Open Source AI & Hugging Face'] },
                                                    { name: '🛡️ Safety Layer', topics: ['AI Safety & Ethics'] },
                                                    { name: '🧠 Knowledge Systems', topics: ['Embeddings', 'Vector Databases', 'Retrieval Augmented Generation (RAG)'] },
                                                    { name: '🤖 Autonomous Systems', topics: ['AI Agent Architectures (LangChain, LlamaIndex)', 'Model Context Protocol (MCP)'] },
                                                    { name: '🎥 Advanced Intelligence', topics: ['Multimodal AI'] }
                                                ];
                                            } else if (selectedDomain === 'DevOps') {
                                                categories = [
                                                    { name: '🧱 Foundation', topics: ['Introduction to DevOps', 'Operating Systems', 'Linux Deep Dive', 'Terminal & Bash Scripting', 'Networking & Protocols'] },
                                                    { name: '⚡ VCS & CI/CD Pipelines', topics: ['Version Control & Git (Deep Dive)', 'CI/CD Pipelines (Jenkins, GitHub Actions)'] },
                                                    { name: '📦 Containers & K8s', topics: ['Containerization with Docker', 'Orchestration with Kubernetes'] },
                                                    { name: '☁️ Cloud & Infrastructure', topics: ['Infrastructure as Code (Terraform, Ansible)', 'Cloud Computing & Providers'] },
                                                    { name: '📈 Reliability & Observability', topics: ['Monitoring & Logging (Prometheus, ELK)'] },
                                                    { name: '🛡️ Advanced & DevSecOps', topics: ['Advanced DevOps Concepts', 'DevSecOps'] },
                                                    { name: '🚀 Career & Projects', topics: ['DevOps Interview Prep', 'DevOps Real-World Projects'] }
                                                ];
                                            } else {
                                                // Fallback for other domains: just one big category
                                                categories = [{ name: 'Modules', topics: dbTopics.map(t => t.title) }];
                                            }

                                            // Flatten categories to get sequential order (only for those explicitly in categories)
                                            const allGroupedTitles = categories.flatMap(cat => cat.topics);

                                            // Handle topics that might not be in any category (show them at the end)
                                            const uncategorizedTopics = dbTopics.filter(t => !allGroupedTitles.includes(t.title));
                                            if (uncategorizedTopics.length > 0) {
                                                categories.push({ name: 'Other Modules', topics: uncategorizedTopics.map(t => t.title) });
                                            }

                                            const globalSortedTopics = categories.flatMap(cat =>
                                                dbTopics.filter(t => cat.topics.includes(t.title))
                                            );

                                            return categories.map((cat, catIdx) => {
                                                const filteredTopics = dbTopics.filter(t => cat.topics.includes(t.title));
                                                if (filteredTopics.length === 0) return null;

                                                return (
                                                    <div key={catIdx}>
                                                        <h3 style={{
                                                            fontSize: '0.9rem',
                                                            fontWeight: 800,
                                                            color: details.color,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '2px',
                                                            marginBottom: '1.25rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.75rem'
                                                        }}>
                                                            <div style={{ width: '20px', height: '2px', background: details.color, opacity: 0.3 }}></div>
                                                            ✅ {cat.name}
                                                        </h3>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                                                            {filteredTopics.map((topic, i) => {
                                                                // Locking Logic
                                                                const globalIdx = globalSortedTopics.findIndex(t => t.title === topic.title);
                                                                const isFirstTopic = globalIdx === 0;
                                                                const prevTopic = !isFirstTopic ? globalSortedTopics[globalIdx - 1] : null;
                                                                const isUnlocked = isFirstTopic || (prevTopic && completedTopics.includes(prevTopic.title)) || completedTopics.includes(topic.title);
                                                                const isCompleted = completedTopics.includes(topic.title);

                                                                return (
                                                                    <div
                                                                        key={topic._id || i}
                                                                        onClick={() => {
                                                                            if (isUnlocked) {
                                                                                handleStartTopic(topic.title);
                                                                            } else {
                                                                                setLockAlert({ title: topic.title, prevTopic: prevTopic?.title });
                                                                                setTimeout(() => setLockAlert(null), 4000);
                                                                            }
                                                                        }}
                                                                        style={{
                                                                            display: 'flex', alignItems: 'center', background: isUnlocked ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.02)',
                                                                            border: isUnlocked ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.02)',
                                                                            padding: '1.25rem 1.5rem',
                                                                            borderRadius: '20px', cursor: isUnlocked ? 'pointer' : 'not-allowed',
                                                                            transition: 'all 0.3s',
                                                                            opacity: isUnlocked ? 1 : 0.5
                                                                        }}
                                                                        onMouseEnter={e => {
                                                                            if (!isUnlocked) return;
                                                                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                                                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                                                                        }}
                                                                        onMouseLeave={e => {
                                                                            if (!isUnlocked) return;
                                                                            e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                                                                            e.currentTarget.style.transform = 'none';
                                                                        }}
                                                                    >
                                                                        <div style={{
                                                                            width: '8px', height: '8px', borderRadius: '50%',
                                                                            background: isCompleted ? '#818cf8' : (isUnlocked ? details.color : 'rgba(255,255,255,0.1)'),
                                                                            marginRight: '1.5rem',
                                                                            boxShadow: isCompleted ? '0 0 10px #818cf8' : 'none'
                                                                        }}></div>
                                                                        <div style={{ flex: 1 }}>
                                                                            <span style={{ fontSize: '1.05rem', fontWeight: 600, color: isCompleted ? '#fff' : 'rgba(255,255,255,0.9)' }}>
                                                                                {topic.title}
                                                                                {isCompleted && <Check size={14} style={{ marginLeft: '0.5rem', color: '#818cf8', display: 'inline' }} />}
                                                                            </span>
                                                                            {topic.level && <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', opacity: 0.4, fontWeight: 600 }}>{topic.level}</span>}
                                                                        </div>
                                                                        <button style={{
                                                                            background: 'transparent', border: 'none',
                                                                            color: isUnlocked ? details.color : 'rgba(255,255,255,0.2)',
                                                                            fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem'
                                                                        }}>
                                                                            {isCompleted ? 'REVIEW' : (isUnlocked ? 'START' : <Settings size={14} />)}
                                                                            {isUnlocked ? <ChevronRight size={14} /> : null}
                                                                        </button>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()
                                    ) : (
                                        <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.35 }}>
                                            <Layers size={32} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                            <p style={{ fontSize: '0.95rem' }}>No topics added yet.</p>
                                            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Add topics via Admin Panel → Course Data → {selectedDomain}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="card glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.6)' }}><History size={18} /> Career Prospects</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {details.roles.map((r, i) => <span key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.9rem' }}>{r}</span>)}
                                </div>
                            </div>
                            <div className="card glass-panel" style={{ padding: '2rem', borderRadius: '24px', borderLeft: `4px solid ${details.color}` }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>AI Guidance</h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                                    Your AI tutor suggests finishing <strong>{dbTopics[0]?.title || details.topics[0]}</strong> first to build a strong foundation before jumping to {dbTopics[dbTopics.length - 1]?.title || details.topics[details.topics.length - 1]}.
                                </p>
                            </div>
                        </aside>
                    </div>
                </main>
            )}
            {/* Lock Alert Notification */}
            {lockAlert && (
                <div style={{
                    position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000,
                    background: '#1F2937', color: '#fff', padding: '1.25rem 2rem',
                    borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    animation: 'slide-up 0.3s ease-out'
                }} className="glass-panel">
                    <div style={{ background: 'rgba(239,68,68,0.1)', padding: '0.6rem', borderRadius: '12px' }}>
                        <X size={20} color="#EF4444" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Module Locked! 🔒</div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: 1.4 }}>
                            Please complete <strong>{lockAlert.prevTopic}</strong> quiz with 80%+ <br />
                            score to unlock <strong>{lockAlert.title}</strong>.
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%) scale(0.9); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                .hover-nav { transition: all 0.2s; }
                .hover-nav:hover { transform: translateX(-3px); background: rgba(255,255,255,0.1) !important; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default Learning;

