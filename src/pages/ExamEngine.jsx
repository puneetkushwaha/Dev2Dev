import React, { useState, useEffect, useRef } from 'react';
import { Timer, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, SkipForward, Loader2, Brain, CheckSquare, Award, Cpu, Code2, Terminal, Settings, RotateCcw, FileCode, Play } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { mockQuestions } from '../data/mockQuestions';
import Loader from '../components/Loader';

const ExamEngine = () => {
    const [searchParams] = useSearchParams();
    const typeQuery = searchParams.get('type');
    const idQuery = searchParams.get('id');

    const [availableExams, setAvailableExams] = useState([]);
    const [loadingExams, setLoadingExams] = useState(true);

    const [examStarted, setExamStarted] = useState(false);
    const [activeExam, setActiveExam] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [questions, setQuestions] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [skipsRemaining, setSkipsRemaining] = useState(5);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [codingOutput, setCodingOutput] = useState({});
    const navigate = useNavigate();
    const editorRef = useRef(null);

    useEffect(() => {
        if (typeQuery === 'mock' && idQuery && mockQuestions[idQuery]) {
            // Auto-start the mock if valid mock ID is passed
            const questions = mockQuestions[idQuery].map((q, idx) => ({
                id: q.id,
                type: 'coding',
                questionText: q.title + '\n\n' + q.description,
                starterCode: q.starterCode,
                difficulty: 'Medium'
            }));

            const mockExamObj = {
                title: `SDE Mock Assessment ${idQuery}`,
                durationMinutes: 60,
                questions: questions,
                isMock: true
            };

            startExam(mockExamObj);
            setLoadingExams(false);
            return;
        }

        const fetchExams = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/exams`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setAvailableExams(res.data);
            } catch (err) {
                console.error("Error fetching exams:", err);
            } finally {
                setLoadingExams(false);
            }
        };
        fetchExams();
    }, [typeQuery, idQuery]);

    const startExam = (examObj) => {
        setActiveExam(examObj);
        setQuestions(examObj.questions || []);
        setCurrentQuestion(0);
        setAnswers({});
        setSkipsRemaining(5);
        setExamStarted(true);
        setResult(null);
        setTimeLeft((examObj.durationMinutes || 30) * 60);
        setIsRunning(true);
        setCodingOutput({});
    };

    useEffect(() => {
        let timer;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            handleSubmitExam();
        }
        return () => clearInterval(timer);
    }, [isRunning, timeLeft]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    };

    const handleRunCode = () => {
        const code = answers[currentQuestion];
        if (!code) return alert("Pehle code likho!");

        // Capture console output
        const logs = [];
        const originalLog = console.log;
        const originalError = console.error;
        console.log = (...args) => {
            logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(" "));
            originalLog(...args);
        };
        console.error = (...args) => {
            logs.push("Error: " + args.join(" "));
            originalError(...args);
        };

        setCodingOutput(prev => ({
            ...prev,
            [currentQuestion]: {
                status: 'Running...',
                output: 'Executing code environment...',
                success: true
            }
        }));

        try {
            // Use Function constructor for execution
            // We wrap it to handle async or just basic execution
            const executeCode = new Function(code);
            const result = executeCode();

            setCodingOutput(prev => ({
                ...prev,
                [currentQuestion]: {
                    status: 'Success',
                    output: logs.length > 0 ? logs.join("\n") : (result !== undefined ? `Result: ${JSON.stringify(result)}` : "Code executed successfully (No output)"),
                    success: true
                }
            }));
        } catch (err) {
            setCodingOutput(prev => ({
                ...prev,
                [currentQuestion]: {
                    status: 'Execution Error',
                    output: err.message,
                    success: false
                }
            }));
        } finally {
            console.log = originalLog;
            console.error = originalError;
        }
    };

    const handleAnswerChange = (val) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion]: val
        }));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const value = e.target.value;

            // set textarea value to: text before caret + tab + text after caret
            const newValue = value.substring(0, start) + "    " + value.substring(end);
            handleAnswerChange(newValue);

            // put caret at right position again
            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 4;
                }
            }, 0);
        }
    };

    const generatePDF = (reportData) => {
        const doc = new jsPDF();
        const { examName, score, totalMarks, mcqScore, codingScore, detailedAnalysis, dateRun } = reportData;

        // Title
        doc.setFontSize(22);
        doc.setTextColor(33, 150, 243);
        doc.text("Dev2Dev - Exam Report", 105, 20, { align: 'center' });

        // Summary Info
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Exam: ${examName}`, 20, 40);
        doc.text(`Score: ${score} / ${totalMarks}`, 20, 50);
        doc.text(`MCQ Correct: ${mcqScore}`, 20, 60);
        doc.text(`Coding Score: ${codingScore}`, 20, 70);
        doc.text(`Date: ${new Date(dateRun).toLocaleDateString()}`, 20, 80);

        // MCQ Results Table
        if (detailedAnalysis?.mcqResults?.length > 0) {
            doc.setFontSize(16);
            doc.text("MCQ Breakdown", 20, 100);
            const mcqTableData = detailedAnalysis.mcqResults.map((m, i) => [
                i + 1,
                m.questionText,
                m.userAnswer || "N/A",
                m.correctAnswer,
                m.isCorrect ? "Correct" : "Wrong"
            ]);
            doc.autoTable({
                startY: 105,
                head: [['#', 'Question', 'Your Answer', 'Correct Answer', 'Result']],
                body: mcqTableData,
                theme: 'striped',
                headStyles: { fillColor: [33, 150, 243] }
            });
        }

        // Coding Results Table
        if (detailedAnalysis?.codingResults?.length > 0) {
            const finalY = doc.lastAutoTable.finalY + 20;
            doc.setFontSize(16);
            doc.text("Coding & Practical Breakdown", 20, finalY);
            const codingTableData = detailedAnalysis.codingResults.map((c, i) => [
                i + 1,
                c.questionText,
                c.userAnswer ? (c.userAnswer.length > 50 ? c.userAnswer.substring(0, 50) + "..." : c.userAnswer) : "Not Attempted",
                c.aiFeedback,
                c.isCorrect ? "Correct" : "Incorrect"
            ]);
            doc.autoTable({
                startY: finalY + 5,
                head: [['#', 'Question', 'Your Solution', 'AI Feedback', 'Status']],
                body: codingTableData,
                theme: 'grid',
                headStyles: { fillColor: [76, 175, 80] }
            });
        }

        doc.save(`${examName}_Report.pdf`);
    };

    const handleSubmitExam = async () => {
        if (!window.confirm("Are you sure you want to submit the exam? This will trigger AI evaluation.")) return;

        setSubmitting(true);

        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/submit-exam`, {
                    examName: activeExam.title,
                    answers: answers
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const finalResult = response.data.result;
                setResult(finalResult);
            } catch (e) {
                console.error("Failed to submit exam score to profile", e);
                alert("Evaluation failed. Please check connection.");
            }
        }

        setSubmitting(false);
    };

    if (result) {
        return (
            <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    background: result.passed ? 'rgba(129, 140, 248,0.1)' : 'rgba(239,68,68,0.1)',
                    border: result.passed ? '1px solid rgba(129, 140, 248,0.3)' : '1px solid rgba(239,68,68,0.3)',
                    padding: '3rem', borderRadius: '30px', maxWidth: '800px', width: '100%',
                    backdropFilter: 'blur(10px)', textAlign: 'center', marginBottom: '3rem'
                }}>
                    {result.passed ? (
                        <CheckCircle size={64} color="#818cf8" style={{ margin: '0 auto 1.5rem auto' }} />
                    ) : (
                        <AlertCircle size={64} color="#EF4444" style={{ margin: '0 auto 1.5rem auto' }} />
                    )}
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                        {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                        You scored <strong>{result.score}</strong> out of <strong>{result.totalMarks}</strong>
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '20px' }}>
                            <h3 style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>MCQ Correct</h3>
                            <p style={{ fontSize: '1.8rem', fontWeight: '700' }}>{result.mcqScore}</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '20px' }}>
                            <h3 style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Coding Score</h3>
                            <p style={{ fontSize: '1.8rem', fontWeight: '700' }}>{result.codingScore}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn-primary" onClick={() => generatePDF(result)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <SkipForward size={20} /> Download PDF Report
                        </button>
                        <button className="btn-secondary" onClick={() => window.location.reload()}>
                            Retake Exam
                        </button>
                        <button className="btn-secondary" onClick={() => navigate('/profile')}>
                            Detailed Profile
                        </button>
                    </div>
                </div>

                {/* Detailed Analysis Section */}
                <div style={{ textAlign: 'left', width: '100%', maxWidth: '900px' }}>
                    <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem' }}>
                        <Brain color="#3B82F6" size={32} /> Detailed AI Analysis
                    </h2>

                    {/* MCQs */}
                    {result.detailedAnalysis?.mcqResults?.length > 0 && (
                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckSquare size={20} /> MCQ Breakdown
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {result.detailedAnalysis.mcqResults.map((item, i) => (
                                    <div key={i} style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        padding: '1.5rem',
                                        borderRadius: '15px',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderLeft: `4px solid ${item.isCorrect ? '#818cf8' : '#EF4444'}`
                                    }}>
                                        <p style={{ fontWeight: '600', marginBottom: '0.75rem', fontSize: '1.05rem' }}>Q{i + 1}: {item.questionText}</p>
                                        <div style={{ fontSize: '0.95rem', display: 'flex', gap: '2rem' }}>
                                            <p>Your Answer: <span style={{ color: item.isCorrect ? '#818cf8' : '#EF4444', fontWeight: 'bold' }}>{item.userAnswer || "N/A"}</span></p>
                                            {!item.isCorrect && <p>Correct: <span style={{ color: '#818cf8', fontWeight: 'bold' }}>{item.correctAnswer}</span></p>}
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                            <strong>Pro Tip:</strong> {item.explanation}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Coding */}
                    {result.detailedAnalysis?.codingResults?.length > 0 && (
                        <div>
                            <h3 style={{ marginBottom: '1.5rem', color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Cpu size={20} /> Coding & Practical Feedback
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {result.detailedAnalysis.codingResults.map((item, i) => (
                                    <div key={i} style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        padding: '1.5rem',
                                        borderRadius: '15px',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderLeft: `4px solid #3B82F6`
                                    }}>
                                        <p style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1.05rem' }}>{item.questionText}</p>
                                        <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.2rem', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <pre style={{ margin: 0 }}>{item.userAnswer || "// No solution provided"}</pre>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'rgba(59,130,246,0.1)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.2)' }}>
                                            <Brain size={24} color="#3B82F6" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                    <p style={{ fontWeight: '700', color: '#3B82F6', fontSize: '0.95rem' }}>AI Technical Feedback</p>
                                                    <span style={{
                                                        background: item.isCorrect ? 'rgba(129, 140, 248,0.2)' : 'rgba(239,68,68,0.2)',
                                                        color: item.isCorrect ? '#818cf8' : '#EF4444',
                                                        padding: '0.2rem 0.6rem',
                                                        borderRadius: '6px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        Score: {item.score}/10
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>{item.aiFeedback}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (!examStarted) {
        return (
            <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3.5rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1.5rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 850,
                        marginBottom: '0.5rem',
                        color: '#fff',
                        letterSpacing: '-1.5px'
                    }}>
                        Certification Exams
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.4)', maxWidth: '600px', lineHeight: 1.6 }}>
                        Test your domain expertise with AI-curated mock assessments and track your progress.
                    </p>
                </div>

                {loadingExams ? (
                    <Loader text="Fetching certification exams..." />
                ) : availableExams.length === 0 ? (
                    <div style={{ padding: '100px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '32px', color: 'rgba(255,255,255,0.3)' }}>
                        <Brain size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                        <p>No certification exams are currently available for your profile.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
                        {availableExams.map(ex => {
                            const isFullLength = ex.type === 'Full-length Mock';
                            const isTopicWise = ex.type === 'Topic-wise';

                            // Define visual themes
                            const themeColor = isFullLength ? 'var(--primary)' : (isTopicWise ? '#818cf8' : '#F59E0B');
                            const themeGradient = isFullLength
                                ? 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.02) 100%)'
                                : (isTopicWise ? 'linear-gradient(135deg, rgba(129, 140, 248,0.15) 0%, rgba(129, 140, 248,0.02) 100%)'
                                    : 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.02) 100%)');

                            return (
                                <div key={ex._id} className="card glass-panel group"
                                    style={{
                                        display: 'flex', flexDirection: 'column', textAlign: 'left',
                                        padding: '2rem',
                                        border: `1px solid rgba(255,255,255,0.08)`,
                                        background: 'rgba(20,20,30,0.6)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                                        borderRadius: '24px',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-6px)';
                                        e.currentTarget.style.borderColor = themeColor;
                                        e.currentTarget.style.boxShadow = `0 20px 40px -10px ${themeColor}40`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'none';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.5)';
                                    }}
                                >
                                    {/* Glow Background */}
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                        background: themeGradient,
                                        zIndex: 0, pointerEvents: 'none'
                                    }} />

                                    {/* Top Badge */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', zIndex: 1 }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            {isFullLength && <span style={{ background: themeColor, color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.3rem 0.8rem', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: `0 0 10px ${themeColor}80` }}><Award size={12} style={{ display: 'inline', marginRight: '4px', marginBottom: '-2px' }} /> PREMIUM MOCK</span>}
                                            {!isFullLength && <span style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.3rem 0.8rem', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{ex.type}</span>}
                                        </div>
                                        {ex.domainId && (
                                            <span style={{ fontSize: '0.8rem', color: themeColor, display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600' }}>
                                                <Cpu size={14} /> {ex.domainId.name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)', zIndex: 1, lineHeight: '1.3', letterSpacing: '-0.5px' }}>
                                        {ex.title}
                                    </h3>

                                    {/* Description placeholder */}
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', zIndex: 1, lineHeight: '1.6', flexGrow: 1 }}>
                                        {isFullLength
                                            ? "Comprehensive simulation to test your complete readiness. Includes theoretical and practical coding concepts to evaluate your domain knowledge."
                                            : "Targeted practice session designed to strengthen your foundational concepts and problem-solving speed."}
                                    </p>

                                    {/* Meta details */}
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', zIndex: 1, padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1 }}>
                                            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: themeColor }}><Timer size={16} /></div>
                                            <div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Duration</div><div style={{ color: 'var(--text)', fontWeight: 700 }}>{ex.durationMinutes} Mins</div></div>
                                        </div>
                                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, paddingLeft: '0.5rem' }}>
                                            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: themeColor }}><CheckSquare size={16} /></div>
                                            <div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Questions</div><div style={{ color: 'var(--text)', fontWeight: 700 }}>{ex.questions?.length || 0} Qs</div></div>
                                        </div>
                                    </div>

                                    {/* Action button */}
                                    <button
                                        className="btn"
                                        onClick={() => startExam(ex)}
                                        style={{
                                            width: '100%',
                                            zIndex: 1,
                                            background: (!ex.questions || ex.questions.length === 0) ? 'rgba(255,255,255,0.05)' : themeColor,
                                            color: (!ex.questions || ex.questions.length === 0) ? 'var(--text-muted)' : '#fff',
                                            border: 'none',
                                            padding: '1rem',
                                            fontWeight: '700',
                                            fontSize: '1rem',
                                            transition: 'all 0.2s ease',
                                            borderRadius: '12px',
                                            boxShadow: (!ex.questions || ex.questions.length === 0) ? 'none' : `0 4px 15px -5px ${themeColor}80`
                                        }}
                                        onMouseEnter={(e) => {
                                            if (ex.questions && ex.questions.length > 0) {
                                                e.currentTarget.style.filter = 'brightness(1.1)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (ex.questions && ex.questions.length > 0) {
                                                e.currentTarget.style.filter = 'none';
                                                e.currentTarget.style.transform = 'none';
                                            }
                                        }}
                                        disabled={!ex.questions || ex.questions.length === 0}
                                    >
                                        {(!ex.questions || ex.questions.length === 0) ? 'No Questions Yet' : 'Start Assessment'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    const q = questions[currentQuestion];

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '1200px', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

            {/* Sidebar for Navigation */}
            <div className="card glass-panel" style={{ width: '300px', flexShrink: 0, height: 'calc(100vh - 120px)', overflowY: 'auto', position: 'sticky', top: '80px', padding: '1rem' }}>
                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Questions Navigation</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                    {questions.map((_, idx) => {
                        const isAnswered = answers[idx] !== undefined && answers[idx] !== '';
                        const isCurrent = currentQuestion === idx;

                        const handleSidebarClick = () => {
                            // Rule: Can only jump to answered questions or the immediate next available if properly progressed
                            // User says: "phle wla questions complete kro"
                            if (idx > currentQuestion) {
                                // Checking if all questions before the target index are "dealt with" (answered or skipped)
                                // But since we want strict sequential, we check if everything up to target is answered.
                                // Actually, simpler: if they click anything higher than current, check if current is answered.
                                if (!answers[currentQuestion]) {
                                    alert("Pehle pehle wala question complete karo!");
                                    return;
                                }

                                // Also prevent jumping too far ahead if they try to skip multiple
                                if (idx > currentQuestion + 1) {
                                    alert("Aap questions jump nahi kar sakte. Ek ek karke progress karein.");
                                    return;
                                }
                            }
                            setCurrentQuestion(idx);
                        };

                        return (
                            <button
                                key={idx}
                                onClick={handleSidebarClick}
                                style={{
                                    padding: '0.5rem 0',
                                    borderRadius: 'var(--radius-sm)',
                                    border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border)',
                                    background: isAnswered ? 'var(--primary-light)' : 'var(--bg-secondary)',
                                    color: isAnswered ? 'var(--text)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontWeight: isCurrent ? 'bold' : 'normal',
                                    transition: 'all 0.2s',
                                    opacity: (idx > currentQuestion + 1) ? 0.4 : 1
                                }}
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>
                <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}><div style={{ width: 12, height: 12, background: 'var(--primary-light)', borderRadius: '2px' }}></div> Answered</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}><div style={{ width: 12, height: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '2px' }}></div> Unanswered</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><div style={{ width: 12, height: 12, border: '2px solid var(--primary)', borderRadius: '2px' }}></div> Current</div>
                </div>
            </div>

            {/* Main Exam Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div className="flex-between" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div className="flex-center" style={{ gap: '0.5rem' }}>
                        <AlertCircle size={20} color="var(--warning)" />
                        <span style={{ fontWeight: 'bold' }}>Question {currentQuestion + 1} of {questions.length}</span>
                        <span className="badge" style={{ marginLeft: '1rem', background: 'var(--primary-light)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                            {q?.difficulty || 'Medium'}
                        </span>
                    </div>
                    <div className="flex-center" style={{ gap: '0.5rem', color: 'var(--danger)', fontWeight: 'bold' }}>
                        <Brain size={18} color="#A5B4FC" />
                        <span style={{ color: '#A5B4FC', marginRight: '1rem' }}>Skips: {skipsRemaining}</span>
                        <Timer size={20} />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <div className="card glass-panel" style={{
                    marginBottom: '2rem',
                    flex: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '650px',
                    background: 'rgba(15, 15, 25, 0.7)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                        <h2 style={{ fontSize: '1.25rem', lineHeight: 1.6, color: '#fff', margin: 0 }}>{q?.questionText || q?.q || 'No question text provided'}</h2>
                    </div>

                    {(() => {
                        const isTerminalMode =
                            activeExam?.title?.toLowerCase().includes('cyber security') ||
                            activeExam?.title?.toLowerCase().includes('linux') ||
                            q?.questionText?.toLowerCase().includes('linux') ||
                            q?.questionText?.toLowerCase().includes('bash') ||
                            q?.questionText?.toLowerCase().includes('terminal');

                        if (q?.type?.toLowerCase() === 'mcq' || (q?.options && q?.options.length > 0 && q?.type !== 'coding')) {
                            return (
                                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {(q?.options || []).map((opt, i) => (
                                        <label key={i} style={{
                                            display: 'flex', alignItems: 'center', gap: '1rem',
                                            padding: '1.2rem', borderRadius: '16px',
                                            background: answers[currentQuestion] === opt ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                                            border: `1px solid ${answers[currentQuestion] === opt ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
                                            cursor: 'pointer', transition: 'all 0.2s ease'
                                        }}>
                                            <input
                                                type="radio"
                                                name={`q-${currentQuestion}`}
                                                checked={answers[currentQuestion] === opt}
                                                onChange={() => handleAnswerChange(opt)}
                                                style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                                            />
                                            <span style={{ fontSize: '1.05rem', color: answers[currentQuestion] === opt ? '#fff' : 'rgba(255,255,255,0.8)' }}>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            );
                        }

                        return (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 1,
                                minHeight: '600px',
                                border: `1px solid ${isTerminalMode ? '#333' : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: '12px',
                                overflow: 'hidden',
                                margin: '1.5rem',
                                background: isTerminalMode ? '#000' : '#1e1e1e',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                            }}>
                                {/* VS Code Style / Terminal Header */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: isTerminalMode ? '#1e1e1e' : '#252526',
                                    padding: '0 1rem',
                                    height: '35px',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                        <div style={{
                                            background: isTerminalMode ? '#000' : '#1e1e1e',
                                            padding: '0 1rem',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            borderTop: `1px solid ${isTerminalMode ? '#4ec9b0' : '#007acc'}`,
                                            fontSize: '0.8rem',
                                            color: '#cccccc'
                                        }}>
                                            {isTerminalMode ? <Terminal size={14} color="#4ec9b0" /> : <FileCode size={14} color="#519aba" />}
                                            <span>{isTerminalMode ? 'root@terminal:~' : 'solution.js'}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px', color: 'rgba(255,255,255,0.4)' }}>
                                        <RotateCcw size={14} style={{ cursor: 'pointer' }} onClick={() => handleAnswerChange(q?.starterCode || '')} />
                                        <Settings size={14} style={{ cursor: 'pointer' }} />
                                    </div>
                                </div>

                                {/* Editor Body / Terminal Prompt */}
                                <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
                                    {!isTerminalMode && (
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
                                            {(answers[currentQuestion] || '').split('\n').map((_, i) => (
                                                <div key={i}>{i + 1}</div>
                                            ))}
                                            {(!(answers[currentQuestion])) && [1, 2, 3, 4, 5].map(n => <div key={n}>{n}</div>)}
                                        </div>
                                    )}

                                    {isTerminalMode && (
                                        <div style={{
                                            padding: '1.5rem 0.5rem 0 1.5rem',
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
                                        value={answers[currentQuestion] || ''}
                                        onChange={(e) => handleAnswerChange(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={isTerminalMode ? "Enter terminal commands..." : "// Start coding here... \nfunction solution() {\n    // your code\n}"}
                                        spellCheck="false"
                                        style={{
                                            flex: 1,
                                            background: 'transparent',
                                            color: isTerminalMode ? '#4ec9b0' : '#d4d4d4',
                                            fontFamily: isTerminalMode ? '"Courier New", monospace' : '"Fira Code", "Consolas", monospace',
                                            fontSize: '1rem',
                                            padding: isTerminalMode ? '1.5rem 1rem' : '1.5rem 1rem',
                                            border: 'none',
                                            outline: 'none',
                                            lineHeight: '1.7',
                                            resize: 'none',
                                            whiteSpace: 'pre',
                                            overflow: 'auto'
                                        }}
                                    />
                                </div>

                                {/* Footer Output Area */}
                                <div style={{
                                    background: isTerminalMode ? '#1e1e1e' : '#1e1e1e',
                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                    padding: '1rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                        <button
                                            onClick={handleRunCode}
                                            style={{
                                                background: isTerminalMode ? '#333' : '#007acc',
                                                color: '#fff',
                                                border: isTerminalMode ? '1px solid #555' : 'none',
                                                padding: '0.5rem 1.25rem',
                                                borderRadius: '4px',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {isTerminalMode ? <Terminal size={14} /> : <Play size={14} fill="white" />}
                                            {isTerminalMode ? 'EXECUTE COMMAND' : 'Run Code'}
                                        </button>
                                    </div>

                                    {codingOutput[currentQuestion] && (
                                        <div style={{
                                            marginTop: '1rem',
                                            background: '#000',
                                            borderRadius: '4px',
                                            border: `1px solid ${isTerminalMode ? '#4ec9b0' : '#333'}`,
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                background: '#252526',
                                                padding: '4px 12px',
                                                fontSize: '0.7rem',
                                                color: '#aaa',
                                                textTransform: 'uppercase',
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}>
                                                <span>{isTerminalMode ? 'SYSTEM CONSOLE' : 'Terminal'}</span>
                                                <span style={{ color: codingOutput[currentQuestion].success ? '#4ec9b0' : '#f48771' }}>
                                                    {codingOutput[currentQuestion].status}
                                                </span>
                                            </div>
                                            <div style={{
                                                padding: '1rem',
                                                maxHeight: '200px',
                                                overflowY: 'auto',
                                                fontFamily: 'monospace',
                                                fontSize: '0.9rem',
                                                color: isTerminalMode ? '#4ec9b0' : '#cccccc',
                                                whiteSpace: 'pre-wrap'
                                            }}>
                                                {codingOutput[currentQuestion].output}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </div>

                <div className="flex-between">
                    <button
                        className="btn btn-outline"
                        disabled={currentQuestion === 0}
                        onClick={() => setCurrentQuestion(prev => prev - 1)}
                    >
                        <ChevronLeft size={18} style={{ marginRight: '0.5rem' }} /> Previous
                    </button>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {currentQuestion < questions.length - 1 && (
                            <button
                                className="btn btn-outline"
                                onClick={() => {
                                    if (skipsRemaining > 0) {
                                        setSkipsRemaining(prev => prev - 1);
                                        setCurrentQuestion(prev => prev + 1);
                                    } else {
                                        alert("No more skips available! You must answer this question.");
                                    }
                                }}
                                style={{ borderColor: skipsRemaining === 0 ? 'rgba(239,68,68,0.3)' : 'var(--border)' }}
                            >
                                Skip <SkipForward size={18} style={{ marginLeft: '0.5rem' }} />
                                <span style={{ fontSize: '0.7rem', opacity: 0.6, marginLeft: '5px' }}>({skipsRemaining})</span>
                            </button>
                        )}

                        {currentQuestion < questions.length - 1 ? (
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    if (!answers[currentQuestion]) {
                                        // If trying to go next without answer, it counts as skip
                                        if (skipsRemaining > 0) {
                                            setSkipsRemaining(prev => prev - 1);
                                            setCurrentQuestion(prev => prev + 1);
                                        } else {
                                            alert("Pehle ye question complete karo ya phir skips khatam ho gaye hain!");
                                        }
                                    } else {
                                        setCurrentQuestion(prev => prev + 1);
                                    }
                                }}
                            >
                                Next <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />
                            </button>
                        ) : (
                            <button className="btn btn-primary" disabled={submitting} style={{ background: 'var(--success)', border: 'none' }} onClick={handleSubmitExam}>
                                {submitting ? <Loader2 size={18} className="animate-spin" style={{ marginRight: '0.5rem' }} /> : <CheckCircle size={18} style={{ marginRight: '0.5rem' }} />}
                                {submitting ? 'Submitting...' : 'Submit Exam'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExamEngine;
