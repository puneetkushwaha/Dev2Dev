import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CoreCSManager from './CoreCSManager';
import {
    Plus, Edit, Trash2, ChevronRight, ChevronDown,
    Brain, Code, Info, Loader2, ArrowLeft,
    FileText, Users, LayoutDashboard,
    Database, Shield, LogOut, Search,
    Clock, Award, RefreshCcw, Mic,
    XCircle, Save, BookOpen, Zap, HelpCircle, Globe, CheckCircle2, Cpu, Play, Bell
} from 'lucide-react';


// ──────────────────────────────────────────
// Helper: auth config
// ──────────────────────────────────────────
const authConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

// ──────────────────────────────────────────
// Sub-component: QuizEditor (inside university topic editor)
// ──────────────────────────────────────────
const QuizEditor = ({ quiz = [], onChange }) => {
    const addQuestion = () => {
        onChange([...quiz, { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]);
    };
    const updateQ = (i, field, val) => {
        const q = [...quiz];
        q[i] = { ...q[i], [field]: val };
        onChange(q);
    };
    const updateOption = (qi, oi, val) => {
        const q = [...quiz];
        q[qi].options[oi] = val;
        onChange(q);
    };
    const removeQ = (i) => onChange(quiz.filter((_, idx) => idx !== i));

    return (
        <div className="quiz-editor">
            {quiz.map((q, qi) => (
                <div key={qi} className="quiz-question-block">
                    <div className="qb-header">
                        <span className="qb-num">Q{qi + 1}</span>
                        <button onClick={() => removeQ(qi)} className="icon-only delete" style={{ marginLeft: 'auto' }}><Trash2 size={13} /></button>
                    </div>
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label>Question</label>
                        <input value={q.question} onChange={e => updateQ(qi, 'question', e.target.value)} placeholder="Enter question..." />
                    </div>
                    <div className="options-grid">
                        {(q.options || ['', '', '', '']).map((opt, oi) => (
                            <div key={oi} className="option-row">
                                <button
                                    className={`correct-btn ${q.correctAnswer === oi ? 'active' : ''}`}
                                    onClick={() => updateQ(qi, 'correctAnswer', oi)}
                                    title="Mark as correct"
                                >
                                    <CheckCircle2 size={14} />
                                </button>
                                <input value={opt} onChange={e => updateOption(qi, oi, e.target.value)} placeholder={`Option ${oi + 1}`} />
                            </div>
                        ))}
                    </div>
                    <div className="form-group" style={{ marginTop: '0.75rem' }}>
                        <label>Explanation (optional)</label>
                        <input value={q.explanation} onChange={e => updateQ(qi, 'explanation', e.target.value)} placeholder="Why is this the correct answer?" />
                    </div>
                </div>
            ))}
            <button className="btn-dashed" onClick={addQuestion}><Plus size={14} /> Add Question</button>
        </div>
    );
};

// ──────────────────────────────────────────
// Sub-component: TopicEditor (full editor for a single topic)
// ──────────────────────────────────────────
const TopicEditor = ({ topic, domainName, onSave, onDelete, isCoreCS }) => {
    const [data, setData] = useState(topic);
    const [tab, setTab] = useState('info'); // info | theory | practice | quiz
    const [saving, setSaving] = useState(false);

    useEffect(() => { setData(topic); setTab('info'); }, [topic]);

    const set = (field, val) => setData(prev => ({ ...prev, [field]: val }));
    const setContent = (field, val) => setData(prev => ({ ...prev, content: { ...(prev.content || {}), [field]: val } }));

    const save = async () => {
        setSaving(true);
        await onSave(data);
        setSaving(false);
    };

    const tabs = [
        { id: 'info', label: 'Info', icon: <Info size={14} /> },
        { id: 'theory', label: 'Theory', icon: <BookOpen size={14} /> },
        { id: 'practice', label: 'Practice', icon: <Code size={14} /> },
        { id: 'quiz', label: 'Quiz', icon: <HelpCircle size={14} /> },
    ];

    return (
        <div className="topic-editor-panel">
            <div className="te-header">
                <div className="te-title">
                    <span className={`type-dot ${data.lessonType}`} />
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{data.title || 'Untitled Topic'}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-only delete" onClick={() => onDelete(data._id)}><Trash2 size={14} /></button>
                    <button className="btn-save" onClick={save} disabled={saving}>
                        {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
                        {saving ? 'Saving...' : 'Save Topic'}
                    </button>
                </div>
            </div>

            <div className="te-tabs">
                {tabs.map(t => (
                    <button key={t.id} className={`te-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            <div className="te-body">
                {tab === 'info' && (
                    <div className="te-section">
                        <div className="form-group">
                            <label>Title</label>
                            <input value={data.title} onChange={e => set('title', e.target.value)} placeholder="Topic title" />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Type</label>
                                <select value={data.lessonType} onChange={e => set('lessonType', e.target.value)}>
                                    <option value="theory">Theory</option>
                                    <option value="practice">Practice</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Level</label>
                                <select value={data.level} onChange={e => set('level', e.target.value)}>
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Difficulty</label>
                                <select value={data.difficulty} onChange={e => set('difficulty', e.target.value)}>
                                    <option>Easy</option>
                                    <option>Medium</option>
                                    <option>Hard</option>
                                </select>
                            </div>
                            {isCoreCS && (
                                <div className="form-group">
                                    <label>Subject</label>
                                    <select value={data.subject} onChange={e => set('subject', e.target.value)}>
                                        <option value="DSA">DSA</option>
                                        <option value="OS">OS</option>
                                        <option value="DBMS">DBMS</option>
                                        <option value="CN">CN</option>
                                        <option value="OOP">OOP</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Short Description</label>
                            <textarea
                                value={data.content?.description || ''}
                                onChange={e => setContent('description', e.target.value)}
                                rows={3}
                                placeholder="One-liner overview of this topic..."
                            />
                        </div>
                    </div>
                )}

                {tab === 'theory' && (
                    <div className="te-section">
                        <div className="form-group">
                            <label>Explanation / Lesson Body</label>
                            <textarea
                                value={data.content?.explanation || ''}
                                onChange={e => setContent('explanation', e.target.value)}
                                rows={12}
                                placeholder="Write the full theory content here. Supports plain text / Markdown."
                            />
                        </div>
                        <div className="form-group">
                            <label>Video URL (optional)</label>
                            <input
                                value={data.content?.videoUrl || ''}
                                onChange={e => setContent('videoUrl', e.target.value)}
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                        <div className="form-group">
                            <label>Key Points (comma-separated)</label>
                            <input
                                value={(data.content?.keyPoints || []).join(', ')}
                                onChange={e => setContent('keyPoints', e.target.value.split(',').map(s => s.trim()))}
                                placeholder="Time complexity O(n), Space O(1), ..."
                            />
                        </div>
                    </div>
                )}

                {tab === 'practice' && (
                    <div className="te-section">
                        <div className="form-group">
                            <label>Problem Statement</label>
                            <textarea
                                value={data.content?.problemStatement || ''}
                                onChange={e => setContent('problemStatement', e.target.value)}
                                rows={6}
                                placeholder="Given an array of integers, find..."
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Input Format</label>
                                <textarea value={data.content?.inputFormat || ''} onChange={e => setContent('inputFormat', e.target.value)} rows={3} />
                            </div>
                            <div className="form-group">
                                <label>Output Format</label>
                                <textarea value={data.content?.outputFormat || ''} onChange={e => setContent('outputFormat', e.target.value)} rows={3} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Sample Input</label>
                            <textarea value={data.content?.sampleInput || ''} onChange={e => setContent('sampleInput', e.target.value)} rows={3} className="mono" />
                        </div>
                        <div className="form-group">
                            <label>Sample Output</label>
                            <textarea value={data.content?.sampleOutput || ''} onChange={e => setContent('sampleOutput', e.target.value)} rows={3} className="mono" />
                        </div>
                        <div className="form-group">
                            <label>Starter Code (optional)</label>
                            <textarea value={data.content?.starterCode || ''} onChange={e => setContent('starterCode', e.target.value)} rows={5} className="mono" placeholder="function solution(arr) {\n  // your code\n}" />
                        </div>
                        <div className="form-group">
                            <label>Constraints</label>
                            <textarea
                                value={data.content?.constraints || ''}
                                onChange={e => setContent('constraints', e.target.value)}
                                rows={3}
                                placeholder="- 2 <= nums.length <= 10^4\n- Only one answer exists."
                            />
                        </div>
                        <div className="form-group">
                            <label>Hints / Key Points (comma-separated)</label>
                            <textarea
                                value={(data.content?.keyPoints || []).join('\n')}
                                onChange={e => setContent('keyPoints', e.target.value.split('\n').filter(s => s.trim()))}
                                rows={3}
                                placeholder="Hint 1: Try brute force first...\nHint 2: Use a Hash Map for O(n)..."
                            />
                        </div>
                    </div>
                )}

                {tab === 'quiz' && (
                    <div className="te-section">
                        <QuizEditor quiz={data.quiz || []} onChange={q => set('quiz', q)} />
                    </div>
                )}
            </div>
        </div>
    );
};

// ──────────────────────────────────────────
// Sub-component: Universal Domain Editor
// ──────────────────────────────────────────
const UniversalDomainEditor = ({ domain, topics, onBack, onSaveDomain, onSaveTopic, onDeleteTopic, onAddTopic, onDeleteDomain }) => {
    const [domainData, setDomainData] = useState(domain);
    const [selectedTopicId, setSelectedTopicId] = useState(topics[0]?._id || null);
    const [savingDomain, setSavingDomain] = useState(false);
    const [view, setView] = useState('curriculum'); // 'curriculum' | 'settings'

    const isCoreCS = domain.name === 'Core Computer Science';
    const selectedTopic = topics.find(t => t._id === selectedTopicId);

    const saveDomain = async () => {
        setSavingDomain(true);
        await onSaveDomain(domainData);
        setSavingDomain(false);
    };

    const newTopicDefaults = () => ({
        domainId: domain._id,
        title: 'New Topic',
        level: 'Beginner',
        difficulty: 'Easy',
        lessonType: 'theory',
        subject: isCoreCS ? 'DSA' : '',
        isCoreCS,
        content: {},
        quiz: []
    });

    return (
        <div className="ude-root animate-fade-in">
            {/* ── Top bar ── */}
            <div className="ude-topbar">
                <button onClick={onBack} className="ude-back"><ArrowLeft size={18} /> Back</button>
                <div className="ude-breadcrumb">
                    <Globe size={14} />
                    <span>{domainData.name}</span>
                </div>
                <div className="ude-top-tabs">
                    <button className={view === 'curriculum' ? 'active' : ''} onClick={() => setView('curriculum')}><BookOpen size={14} /> Curriculum</button>
                    <button className={view === 'settings' ? 'active' : ''} onClick={() => setView('settings')}><Info size={14} /> Settings</button>
                </div>
                <button onClick={saveDomain} className="btn-save" disabled={savingDomain}>
                    {savingDomain ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
                    {savingDomain ? 'Saving...' : 'Save Domain'}
                </button>
            </div>

            {view === 'settings' && (
                <div className="ude-settings animate-fade-in">
                    <div className="glass-section" style={{ maxWidth: 700 }}>
                        <h3 style={{ marginTop: 0 }}>Domain Settings</h3>
                        <div className="form-group">
                            <label>Domain Name</label>
                            <input value={domainData.name} onChange={e => setDomainData({ ...domainData, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={domainData.description || ''} onChange={e => setDomainData({ ...domainData, description: e.target.value })} rows={4} />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Scope</label>
                                <input value={domainData.scope || ''} onChange={e => setDomainData({ ...domainData, scope: e.target.value })} placeholder="e.g. Foundation" />
                            </div>
                            <div className="form-group">
                                <label>Estimated Time</label>
                                <input value={domainData.estimatedTime || ''} onChange={e => setDomainData({ ...domainData, estimatedTime: e.target.value })} placeholder="e.g. 6 months" />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <button onClick={saveDomain} className="btn-primary" disabled={savingDomain}>
                                {savingDomain ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button onClick={() => onDeleteDomain(domain._id)} className="btn-danger">Delete Domain</button>
                        </div>
                    </div>
                </div>
            )}

            {view === 'curriculum' && (
                <div className="ude-body">
                    {/* ── Topics sidebar ── */}
                    <div className="ude-sidebar">
                        <div className="ude-sidebar-header">
                            <span>Modules ({topics.length})</span>
                            <button className="icon-only" onClick={async () => { const t = await onAddTopic(newTopicDefaults()); if (t) setSelectedTopicId(t._id); }} title="Add topic"><Plus size={16} /></button>
                        </div>
                        <div className="ude-topic-list">
                            {topics.map(t => (
                                <button
                                    key={t._id}
                                    className={`ude-topic-item ${selectedTopicId === t._id ? 'active' : ''}`}
                                    onClick={() => setSelectedTopicId(t._id)}
                                >
                                    <span className={`type-dot ${t.lessonType}`} />
                                    <div className="ude-topic-meta">
                                        <span className="ude-topic-title">{t.title}</span>
                                        <span className="ude-topic-sub">{isCoreCS && t.subject ? `${t.subject} • ` : ''}{t.level}</span>
                                    </div>
                                </button>
                            ))}
                            {topics.length === 0 && (
                                <div className="ude-empty-topics">No modules yet.<br />Click + to add one.</div>
                            )}
                        </div>
                    </div>

                    {/* ── Content editor ── */}
                    <div className="ude-content">
                        {selectedTopic ? (
                            <TopicEditor
                                key={selectedTopic._id}
                                topic={selectedTopic}
                                domainName={domain.name}
                                isCoreCS={isCoreCS}
                                onSave={onSaveTopic}
                                onDelete={async (id) => {
                                    await onDeleteTopic(id);
                                    setSelectedTopicId(topics.find(t => t._id !== id)?._id || null);
                                }}
                            />
                        ) : (
                            <div className="ude-no-topic">
                                <Zap size={40} style={{ opacity: 0.15 }} />
                                <p>Select a module or create one to start editing.</p>
                                <button className="btn-primary" onClick={async () => { const t = await onAddTopic(newTopicDefaults()); if (t) setSelectedTopicId(t._id); }}>
                                    <Plus size={16} /> Create First Module
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ──────────────────────────────────────────
// Sub-component: ExamEditorModal
// ──────────────────────────────────────────
const ExamEditorModal = ({ exam, domains, onSave, onClose }) => {
    const [data, setData] = useState({ ...exam });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await onSave(data);
        setSaving(false);
    };

    const addQuestion = () => {
        const q = [...(data.questions || [])];
        q.push({ questionText: '', options: ['', '', '', ''], correctAnswer: '', difficulty: 'Medium', explanation: '' });
        setData({ ...data, questions: q });
    };

    const updateQ = (i, field, val) => {
        const q = [...(data.questions || [])];
        q[i] = { ...q[i], [field]: val };
        setData({ ...data, questions: q });
    };

    const updateOption = (qi, oi, val) => {
        const q = [...(data.questions || [])];
        q[qi].options[oi] = val;
        setData({ ...data, questions: q });
    };

    const removeQ = (i) => {
        const q = [...(data.questions || [])].filter((_, idx) => idx !== i);
        setData({ ...data, questions: q });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.8)', padding: '2rem', display: 'flex', justifyContent: 'center'
        }} className="animate-fade-in">
            <div style={{
                background: '#0F172A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
                width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Edit Exam: {data.title}</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
                        <button className="btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />} Save
                        </button>
                    </div>
                </div>
                <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Title</label>
                            <input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select value={data.type} onChange={e => setData({ ...data, type: e.target.value })}>
                                <option>Topic-wise</option>
                                <option>Role-wise</option>
                                <option>Full-length Mock</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Duration (mins)</label>
                            <input type="number" value={data.durationMinutes} onChange={e => setData({ ...data, durationMinutes: Number(e.target.value) })} />
                        </div>
                        <div className="form-group">
                            <label>Domain Link (Optional)</label>
                            <select value={data.domainId || ''} onChange={e => setData({ ...data, domainId: e.target.value })}>
                                <option value="">-- Platform Wide --</option>
                                {domains.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1rem', marginTop: 0, marginBottom: '1rem' }}>Questions</h3>
                        <div className="quiz-editor">
                            {(data.questions || []).map((q, qi) => (
                                <div key={qi} className="quiz-question-block">
                                    <div className="qb-header">
                                        <span className="qb-num">Q{qi + 1}</span>
                                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <select
                                                style={{ padding: '0.2rem', fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '4px' }}
                                                value={q.type || 'mcq'}
                                                onChange={e => updateQ(qi, 'type', e.target.value)}
                                            >
                                                <option value="mcq">MCQ</option>
                                                <option value="coding">Coding</option>
                                            </select>
                                            <select style={{ padding: '0.2rem', fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '4px' }} value={q.difficulty || 'Medium'} onChange={e => updateQ(qi, 'difficulty', e.target.value)}>
                                                <option>Easy</option>
                                                <option>Medium</option>
                                                <option>Hard</option>
                                            </select>
                                            <button onClick={() => removeQ(qi)} className="icon-only delete"><Trash2 size={13} /></button>
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                                        <label>{q.type === 'coding' ? 'Problem Description' : 'Question Text'}</label>
                                        {q.type === 'coding' ? (
                                            <textarea
                                                value={q.questionText || ''}
                                                onChange={e => updateQ(qi, 'questionText', e.target.value)}
                                                placeholder="Enter problem description, constraints, and test cases..."
                                                rows={5}
                                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', color: '#fff', padding: '0.65rem 0.85rem' }}
                                            />
                                        ) : (
                                            <input value={q.questionText || ''} onChange={e => updateQ(qi, 'questionText', e.target.value)} placeholder="Enter question..." />
                                        )}
                                    </div>
                                    {q.type !== 'coding' && (
                                        <div className="options-grid">
                                            {(q.options || ['', '', '', '']).map((opt, oi) => (
                                                <div key={oi} className="option-row">
                                                    <button
                                                        className={`correct-btn ${q.correctAnswer === opt && opt !== '' ? 'active' : ''}`}
                                                        onClick={() => updateQ(qi, 'correctAnswer', opt)}
                                                        title="Mark as correct"
                                                    >
                                                        <CheckCircle2 size={14} />
                                                    </button>
                                                    <input value={opt} onChange={e => updateOption(qi, oi, e.target.value)} placeholder={`Option ${oi + 1}`} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="form-group" style={{ marginTop: '0.75rem' }}>
                                        <label>{q.type === 'coding' ? 'Hidden Solution (for reference/AI)' : 'Explanation (optional)'}</label>
                                        <input value={q.explanation || ''} onChange={e => updateQ(qi, 'explanation', e.target.value)} placeholder={q.type === 'coding' ? "Paste hidden logic/solution here..." : "Why is this the correct answer?"} />
                                    </div>
                                </div>
                            ))}
                            <button className="btn-dashed" onClick={addQuestion}><Plus size={14} /> Add Question</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ──────────────────────────────────────────
// Sub-component: UserDetailModal
// ──────────────────────────────────────────
const UserDetailModal = ({ user, onClose }) => {
    if (!user) return null;

    const InfoCard = ({ icon, label, value }) => (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', flexShrink: 0 }}>
                {icon}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>{label}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || 'N/A'}</div>
            </div>
        </div>
    );

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.85)', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)'
        }} className="animate-fade-in" onClick={onClose}>
            <div style={{
                background: '#0F172A', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
                width: '100%', maxWidth: '800px', maxHeight: '85vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 50px 100px rgba(0,0,0,0.8)', overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(99,102,241,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '50px', height: '50px', background: '#6366f1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
                            {user.name[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {user.name} <span style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 500 }}>{user.username ? `@${user.username}` : ''}</span>
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.6 }}>{user.email} • <span className={`role-pill ${user.role}`} style={{ marginLeft: '0.25rem' }}>{user.role}</span></p>
                        </div>
                    </div>
                    <button className="icon-only" onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)' }}><XCircle size={20} /></button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Bio */}
                    <div className="glass-section" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 1rem 0' }}>Bio</h3>
                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>{user.bio || 'N/A'}</p>
                    </div>

                    {/* Basic Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <InfoCard icon={<Globe size={16} />} label="Location" value={user.location} />
                        <InfoCard icon={<Award size={16} />} label="Job Title" value={user.jobTitle} />
                        <InfoCard icon={<BookOpen size={16} />} label="Company" value={user.company} />
                        <InfoCard icon={<BookOpen size={16} />} label="Institution" value={user.institution} />
                    </div>

                    {/* Professional Identity */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        <div className="glass-section" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.9rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 1rem 0' }}>Professional Identity</h3>
                            <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}><span style={{ opacity: 0.5 }}>Experience Level:</span> {user.experience || 'N/A'}</div>
                            <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}><span style={{ opacity: 0.5 }}>Education:</span> {user.education || 'N/A'}</div>
                            <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}><span style={{ opacity: 0.5 }}>Skills:</span></div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                {(user.skills && user.skills.length > 0) ? user.skills.map((s, i) => (
                                    <span key={i} style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>{s}</span>
                                )) : <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>N/A</span>}
                            </div>
                            <div style={{ fontSize: '0.85rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ opacity: 0.5, display: 'block', marginBottom: '0.25rem' }}>Current Track (Active Domain):</span>
                                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#34d399' }}>{user.selectedDomain || 'None Selected'}</span>
                            </div>
                        </div>

                        {/* Social Information */}
                        <div className="glass-section" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.9rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 1rem 0' }}>Social Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.5 }}>Website</span> <a href={user.website && user.website !== 'N/A' ? user.website : '#'} target="_blank" rel="noreferrer" style={{ color: user.website && user.website !== 'N/A' ? '#818cf8' : 'inherit', textDecoration: 'none' }}>{user.website || 'N/A'}</a></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.5 }}>Github</span> <a href={user.socials?.github && user.socials.github !== 'N/A' ? user.socials.github : '#'} target="_blank" rel="noreferrer" style={{ color: user.socials?.github && user.socials.github !== 'N/A' ? '#818cf8' : 'inherit', textDecoration: 'none' }}>{user.socials?.github || 'N/A'}</a></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.5 }}>Linkedin</span> <a href={user.socials?.linkedin && user.socials.linkedin !== 'N/A' ? user.socials.linkedin : '#'} target="_blank" rel="noreferrer" style={{ color: user.socials?.linkedin && user.socials.linkedin !== 'N/A' ? '#818cf8' : 'inherit', textDecoration: 'none' }}>{user.socials?.linkedin || 'N/A'}</a></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.5 }}>Twitter</span> <a href={user.socials?.twitter && user.socials.twitter !== 'N/A' ? user.socials.twitter : '#'} target="_blank" rel="noreferrer" style={{ color: user.socials?.twitter && user.socials.twitter !== 'N/A' ? '#818cf8' : 'inherit', textDecoration: 'none' }}>{user.socials?.twitter || 'N/A'}</a></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.5 }}>Youtube</span> <a href={user.socials?.youtube && user.socials.youtube !== 'N/A' ? user.socials.youtube : '#'} target="_blank" rel="noreferrer" style={{ color: user.socials?.youtube && user.socials.youtube !== 'N/A' ? '#818cf8' : 'inherit', textDecoration: 'none' }}>{user.socials?.youtube || 'N/A'}</a></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.5 }}>Instagram</span> <a href={user.socials?.instagram && user.socials.instagram !== 'N/A' ? user.socials.instagram : '#'} target="_blank" rel="noreferrer" style={{ color: user.socials?.instagram && user.socials.instagram !== 'N/A' ? '#818cf8' : 'inherit', textDecoration: 'none' }}>{user.socials?.instagram || 'N/A'}</a></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.5 }}>Leetcode</span> <a href={user.socials?.leetcode && user.socials.leetcode !== 'N/A' ? user.socials.leetcode : '#'} target="_blank" rel="noreferrer" style={{ color: user.socials?.leetcode && user.socials.leetcode !== 'N/A' ? '#818cf8' : 'inherit', textDecoration: 'none' }}>{user.socials?.leetcode || 'N/A'}</a></div>
                            </div>
                        </div>
                    </div>

                    {/* Exam Performance */}
                    <div className="glass-section" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '0.9rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Exam Performance</h3>
                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Total Attempts: {user.progress?.examScores?.length || 0}</div>
                        </div>
                        {user.progress?.examScores && user.progress.examScores.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {[...user.progress.examScores].reverse().map((exam, i) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{exam.examName || 'Mock Assessment'}</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{new Date(exam.dateRun).toLocaleDateString()}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{exam.score}/{exam.totalMarks}</div>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px', color: exam.passed ? '#818cf8' : '#ef4444', background: exam.passed ? 'rgba(129, 140, 248,0.1)' : 'rgba(239,68,68,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-block', marginTop: '0.2rem' }}>
                                                {exam.passed ? 'PASSED' : 'FAILED'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.5, textAlign: 'center', padding: '1.5rem 0' }}>No exam completions yet.</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

// ──────────────────────────────────────────
// Sub-component: TutorialEditorModal
// ──────────────────────────────────────────
const TutorialEditorModal = ({ tutorial, onSave, onClose }) => {
    const [data, setData] = useState({ ...tutorial });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await onSave(data);
        setSaving(false);
    };

    const addLesson = () => {
        const lessons = [...(data.lessons || [])];
        lessons.push({ title: 'New Lesson', ytId: '', duration: '', description: '', order: lessons.length + 1 });
        setData({ ...data, lessons });
    };

    const updateLesson = (i, field, val) => {
        const lessons = [...(data.lessons || [])];
        lessons[i] = { ...lessons[i], [field]: val };
        setData({ ...data, lessons });
    };

    const removeLesson = (i) => {
        const lessons = [...(data.lessons || [])].filter((_, idx) => idx !== i);
        setData({ ...data, lessons });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.8)', padding: '2rem', display: 'flex', justifyContent: 'center'
        }} className="animate-fade-in">
            <div style={{
                background: '#0F172A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
                width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Edit Tutorial Series: {data.title}</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
                        <button className="btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />} Save Series
                        </button>
                    </div>
                </div>
                <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-row">
                        <div className="form-group" style={{ flex: 2 }}>
                            <label>Series Title</label>
                            <input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} placeholder="e.g. DevOps Mastery Series" />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <input value={data.category} onChange={e => setData({ ...data, category: e.target.value })} placeholder="e.g. DevOps" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Thumbnail URL</label>
                        <input value={data.thumbnail} onChange={e => setData({ ...data, thumbnail: e.target.value })} placeholder="https://unsplash.com/..." />
                    </div>
                    <div className="form-group">
                        <label>Series Description</label>
                        <textarea value={data.description} onChange={e => setData({ ...data, description: e.target.value })} rows={3} placeholder="Provide a brief overview of what this series covers..." />
                    </div>

                    <div className="form-row">
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                            <label style={{ margin: 0 }}>Premium Series?</label>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={data.isPremium || false} onChange={e => setData({ ...data, isPremium: e.target.checked })} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        {data.isPremium && (
                            <div className="form-group">
                                <label>Price (₹)</label>
                                <input type="number" min="0" value={data.price || 0} onChange={e => setData({ ...data, price: Number(e.target.value) })} placeholder="e.g. 499" />
                            </div>
                        )}
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', margin: 0 }}>Curriculum / Lessons</h3>
                            <button className="btn-sm" onClick={addLesson}><Plus size={14} /> Add Lesson</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {(data.lessons || []).sort((a, b) => a.order - b.order).map((lesson, li) => (
                                <div key={li} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', borderRadius: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.4 }}>#{li + 1}</span>
                                            <input
                                                style={{ background: 'transparent', border: 'none', fontSize: '1rem', fontWeight: 700, padding: 0 }}
                                                value={lesson.title}
                                                onChange={e => updateLesson(li, 'title', e.target.value)}
                                                placeholder="Lesson Title"
                                            />
                                        </div>
                                        <button onClick={() => removeLesson(li)} className="icon-only delete"><Trash2 size={13} /></button>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>YouTube ID</label>
                                            <input value={lesson.ytId} onChange={e => updateLesson(li, 'ytId', e.target.value)} placeholder="e.g. gUV2jOsvmsM" />
                                        </div>
                                        <div className="form-group">
                                            <label>Duration</label>
                                            <input value={lesson.duration} onChange={e => updateLesson(li, 'duration', e.target.value)} placeholder="e.g. 15:20" />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginTop: '0.75rem' }}>
                                        <label>Lesson Description</label>
                                        <textarea value={lesson.description} onChange={e => updateLesson(li, 'description', e.target.value)} rows={2} placeholder="Briefly explain what this specific video covers..." />
                                    </div>
                                </div>
                            ))}
                            {(!data.lessons || data.lessons.length === 0) && (
                                <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.01)', borderRadius: '14px', border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }}>
                                    No lessons added yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ──────────────────────────────────────────
// Main: AdminDashboard
// ──────────────────────────────────────────
const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, domains: 0, topics: 0, exams: 0 });
    const [domains, setDomains] = useState([]);
    const [topics, setTopics] = useState([]);
    const [users, setUsers] = useState([]);
    const [exams, setExams] = useState([]);
    const [coreCSTopics, setCoreCSTopics] = useState([]);
    const [tutorials, setTutorials] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [newNotification, setNewNotification] = useState({ title: '', message: '', type: 'info' });

    const [activeTab, setActiveTab] = useState('overview');
    const [universalEditor, setUniversalEditor] = useState(null); // { domain }
    const [editingExam, setEditingExam] = useState(null);
    const [editingTutorial, setEditingTutorial] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => { fetchAllData(); }, []);

    const fetchAllData = async () => {
        setLoading(true);
        const safeGet = async (url, cfg) => {
            try { const r = await axios.get(url, cfg); return r.data; }
            catch (e) { console.warn('Fetch failed:', url, e.response?.status); return null; }
        };
        const [s, d, u, e, cs, t, iv, n] = await Promise.all([
            safeGet(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/stats`, authConfig()),
            safeGet(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/domains`, authConfig()),
            safeGet(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/users`, authConfig()),
            safeGet(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/exams`, authConfig()),
            safeGet(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/corecs`, authConfig()),
            safeGet(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/tutorials`, authConfig()),
            safeGet(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/interviews/all`, authConfig()),
            safeGet(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/notifications`, authConfig()),
        ]);
        if (s) setStats(s);
        if (d) setDomains(d);
        if (u) setUsers(u);
        if (e) setExams(e);
        if (cs) setCoreCSTopics(cs);
        if (t) setTutorials(t);
        if (iv) setInterviews(iv);
        if (n) setNotifications(n);
        setLoading(false);
    };

    const fetchTopics = async (domainId) => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/topics/domain/${domainId}`, authConfig());
        setTopics(res.data);
        return res.data;
    };

    const openUniversalEditor = async (domain) => {
        setLoading(true);
        await fetchTopics(domain._id);
        setUniversalEditor({ domain });
        setLoading(false);
    };

    // ── CRUD helpers ──
    const saveDomain = async (data) => {
        try {
            if (data._id) await axios.put(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/domains/${data._id}`, data, authConfig());
            else await axios.post(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/domains`, data, authConfig());
            fetchAllData();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    const deleteDomain = async (id) => {
        if (!window.confirm('Delete this domain and all its topics?')) return;
        await axios.delete(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/domains/${id}`, authConfig());
        setUniversalEditor(null);
        fetchAllData();
    };

    const saveTopic = async (data) => {
        try {
            if (data._id) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/topics/${data._id}`, data, authConfig());
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/topics`, data, authConfig());
            }
            await fetchTopics(universalEditor.domain._id);
            fetchAllData();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    const addTopic = async (defaults) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/topics`, defaults, authConfig());
            await fetchTopics(universalEditor.domain._id);
            fetchAllData();
            return res.data;
        } catch (err) { alert(err.response?.data?.message || err.message); return null; }
    };

    const deleteTopic = async (id) => {
        if (!window.confirm('Delete this topic?')) return;
        await axios.delete(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/topics/${id}`, authConfig());
        await fetchTopics(universalEditor.domain._id);
        fetchAllData();
    };

    const saveExam = async (data) => {
        try {
            if (data._id) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/exams/${data._id}`, data, authConfig());
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/exams`, data, authConfig());
            }
            setEditingExam(null);
            fetchAllData();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    const saveTutorial = async (data) => {
        try {
            if (data._id) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/tutorials/${data._id}`, data, authConfig());
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/tutorials`, data, authConfig());
            }
            setEditingTutorial(null);
            fetchAllData();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Delete this ${type}?`)) return;
        await axios.delete(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/${type}s/${id}`, authConfig());
        fetchAllData();
    };

    const handleToggleRole = async (userId) => {
        await axios.put(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/users/role/${userId}`, {}, authConfig());
        fetchAllData();
    };

    // ── Renders ──
    const renderOverview = () => (
        <div className="animate-fade-in content-view">
            <h2 className="view-title">Platform Overview</h2>
            <div className="stats-grid">
                {[
                    { label: 'Total Users', val: stats.users, cls: 'users', Icon: Users },
                    { label: 'Domains', val: stats.domains, cls: 'domains', Icon: Database },
                    { label: 'Lessons', val: stats.topics, cls: 'topics', Icon: FileText },
                    { label: 'Exams Live', val: stats.exams, cls: 'exams', Icon: Award },
                    { label: 'Tutorials', val: tutorials.length, cls: 'tutorials', Icon: Play },
                ].map(({ label, val, cls, Icon }) => (
                    <div key={cls} className="stat-card">
                        <div className={`stat-icon-box ${cls}`}><Icon size={20} /></div>
                        <div>
                            <span className="stat-label">{label}</span>
                            <h2 className="stat-value">{val}</h2>
                        </div>
                    </div>
                ))}
            </div>
            <div className="overview-row">
                <div className="glass-section">
                    <h3>Quick Actions</h3>
                    <div className="actions-grid">
                        <button onClick={() => setActiveTab('domains')} className="btn-secondary"><Database size={14} /> Manage Domains</button>
                        <button onClick={() => setActiveTab('exams')} className="btn-secondary"><Award size={14} /> Manage Exams</button>
                        <button onClick={fetchAllData} className="btn-secondary outline"><RefreshCcw size={14} /> Refresh</button>
                    </div>
                </div>
                <div className="glass-section">
                    <h3>Users this month</h3>
                    <div className="empty-log"><Info size={24} style={{ opacity: 0.2 }} /><p>Analytics coming soon.</p></div>
                </div>
            </div>
        </div>
    );

    const renderDomainsView = () => (
        <div className="animate-fade-in content-view">
            <div className="view-header">
                <h2 className="view-title">Course Ecosystem</h2>
                <button className="btn-primary" onClick={() => saveDomain({ name: 'New Domain', description: '', levels: ['Beginner', 'Intermediate', 'Advanced'] }).then(fetchAllData)}>
                    <Plus size={18} /> New Domain
                </button>
            </div>
            <div className="pro-grid">
                {domains.map(d => (
                    <div key={d._id} className="glass-card">
                        <div className="card-header">
                            <h3>{d.name}</h3>
                        </div>
                        <p className="card-desc">{d.description || 'No description.'}</p>
                        <div className="card-footer">
                            <span className="badge">{d.scope || 'General'}</span>
                            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                                <button className="btn-sm highlight" onClick={() => openUniversalEditor(d)}><Edit size={12} /> Deep Edit</button>
                                <button className="icon-only delete" onClick={() => handleDelete('domain', d._id)}><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderUsersView = () => (
        <div className="animate-fade-in content-view">
            <div className="view-header">
                <h2 className="view-title">User Base</h2>
                <div className="search-wrap">
                    <Search size={15} />
                    <input type="text" placeholder="Search users..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
            </div>
            <div className="table-container">
                <table className="pro-table">
                    <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                    <tbody>
                        {users.filter(u =>
                            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.email.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map(u => (
                            <tr key={u._id}>
                                <td><div className="user-profile-sm"><div className="user-avatar">{u.name[0]}</div><span>{u.name}</span></div></td>
                                <td style={{ opacity: 0.6 }}>{u.email}</td>
                                <td><span className={`role-pill ${u.role}`}>{u.role}</span></td>
                                <td className="table-actions">
                                    <button onClick={() => setSelectedUserDetails(u)} className="btn-sm"><Info size={12} /> View</button>
                                    <button onClick={() => handleToggleRole(u._id)} className="icon-only" title="Toggle Role"><Shield size={14} /></button>
                                    <button onClick={() => handleDelete('user', u._id)} className="icon-only delete"><Trash2 size={14} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderExamsView = () => (
        <div className="animate-fade-in content-view">
            <div className="view-header">
                <h2 className="view-title">Exam Vault</h2>
                <button className="btn-primary" onClick={() => setEditingExam({ title: 'New Exam', type: 'Topic-wise', durationMinutes: 30, questions: [] })}>
                    <Plus size={18} /> New Exam
                </button>
            </div>
            <div className="pro-grid">
                {exams.map(e => (
                    <div key={e._id} className="glass-card exam-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div className="exam-badge">{e.type}</div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="icon-only" onClick={() => setEditingExam(e)}><Edit size={14} /></button>
                                <button className="icon-only delete" onClick={() => handleDelete('exam', e._id)}><Trash2 size={14} /></button>
                            </div>
                        </div>
                        <h3 style={{ margin: '0.75rem 0 0.5rem 0' }}>{e.title}</h3>
                        <div className="exam-meta">
                            <span><Clock size={12} /> {e.durationMinutes}m</span>
                            <span><Brain size={12} /> {e.questions?.length || 0} Questions</span>
                        </div>
                        <div className="exam-domain-tag">{e.domainId?.name || 'Platform-wide'}</div>
                    </div>
                ))}
                {exams.length === 0 && <div className="placeholder-text">No exams created yet.</div>}
            </div>
        </div>
    );

    const [expandedUserId, setExpandedUserId] = useState(null);

    const renderExamResultsView = () => {
        // Users who have at least one exam score
        const usersWithExams = users.filter(u => u.progress?.examScores?.length > 0);

        return (
            <div className="animate-fade-in content-view">
                <div className="view-header">
                    <h2 className="view-title">Student Exam Results (Grouped)</h2>
                    <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Click on a student to view their exam attempts.</p>
                </div>

                <div className="grouped-results-list">
                    {usersWithExams.map(u => {
                        const isExpanded = expandedUserId === u._id;
                        const avgScore = u.progress.examScores.reduce((acc, curr) => acc + curr.score, 0) / u.progress.examScores.length;

                        return (
                            <div key={u._id} className={`glass-section group-card ${isExpanded ? 'expanded' : ''}`} style={{ marginBottom: '1rem', cursor: 'pointer' }} onClick={() => setExpandedUserId(isExpanded ? null : u._id)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                                    <div className="user-profile-sm">
                                        <div className="user-avatar">{u.name[0]}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 700 }}>{u.name}</span>
                                            <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{u.email}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.7rem', opacity: 0.4, textTransform: 'uppercase' }}>Attempts</div>
                                            <div style={{ fontWeight: 600 }}>{u.progress.examScores.length}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.7rem', opacity: 0.4, textTransform: 'uppercase' }}>Avg Score</div>
                                            <div style={{ fontWeight: 600, color: '#818cf8' }}>{Math.round(avgScore)}%</div>
                                        </div>
                                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="attempts-detail animate-slide-down" style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }} onClick={(e) => e.stopPropagation()}>
                                        <table className="pro-table mini">
                                            <thead>
                                                <tr>
                                                    <th>Exam Title</th>
                                                    <th>Score</th>
                                                    <th>Result</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[...u.progress.examScores].reverse().map((score, sIdx) => (
                                                    <tr key={sIdx}>
                                                        <td>{score.examName || 'Mock Test'}</td>
                                                        <td><strong>{score.score}</strong> / {score.totalMarks}</td>
                                                        <td>
                                                            <span className={`role-pill ${score.passed ? 'admin' : 'user'}`} style={{ fontSize: '0.7rem', background: score.passed ? 'rgba(129, 140, 248,0.1)' : 'rgba(239,68,68,0.1)', color: score.passed ? '#818cf8' : '#ef4444' }}>
                                                                {score.passed ? 'PASSED' : 'FAILED'}
                                                            </span>
                                                        </td>
                                                        <td>{new Date(score.dateRun).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {usersWithExams.length === 0 && (
                        <div className="placeholder-text">No student records found with exam scores.</div>
                    )}
                </div>
            </div>
        );
    };

    const renderInterviewsView = () => (
        <div className="animate-fade-in content-view">
            <div className="view-header">
                <h2 className="view-title">Interview Analysis & History</h2>
                <div className="search-wrap">
                    <Search size={15} />
                    <input type="text" placeholder="Search by name, role or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
            </div>

            <div className="table-container">
                <table className="pro-table">
                    <thead>
                        <tr>
                            <th>Candidate</th>
                            <th>Role / Profile</th>
                            <th>Scores</th>
                            <th>Hire Probability</th>
                            <th>Date</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {interviews.filter(iv =>
                            iv.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            iv.candidateEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            iv.role?.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map(iv => (
                            <tr key={iv._id}>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 700 }}>{iv.candidateName}</span>
                                        <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{iv.candidateEmail}</span>
                                    </div>
                                </td>
                                <td>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{iv.role}</span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <div title="Technical" style={{ padding: '2px 6px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', borderRadius: '4px', fontSize: '0.75rem' }}>T: {iv.technicalScore}%</div>
                                        <div title="Communication" style={{ padding: '2px 6px', background: 'rgba(129, 140, 248,0.1)', color: '#818cf8', borderRadius: '4px', fontSize: '0.75rem' }}>C: {iv.communicationScore}%</div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`role-pill ${iv.hireProbability}`} style={{
                                        background: iv.hireProbability === 'High' ? 'rgba(129, 140, 248,0.1)' : iv.hireProbability === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                                        color: iv.hireProbability === 'High' ? '#818cf8' : iv.hireProbability === 'Medium' ? '#f59e0b' : '#ef4444'
                                    }}>
                                        {iv.hireProbability}
                                    </span>
                                </td>
                                <td style={{ fontSize: '0.85rem', opacity: 0.6 }}>
                                    {new Date(iv.dateRun).toLocaleDateString()}
                                </td>
                                <td>
                                    <button className="btn-sm" onClick={() => setSelectedInterview(iv)}><FileText size={12} /> View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {interviews.length === 0 && <div className="placeholder-text">No interview records found.</div>}
            </div>
        </div>
    );
    const renderTutorialsView = () => (
        <div className="animate-fade-in content-view">
            <div className="view-header">
                <h2 className="view-title">Tutorial Library</h2>
                <button className="btn-primary" onClick={() => setEditingTutorial({ title: 'New Tutorial Series', category: '', thumbnail: '', description: '', isPremium: false, price: 0, lessons: [] })}>
                    <Plus size={18} /> New Series
                </button>
            </div>
            <div className="pro-grid">
                {tutorials.map(t => (
                    <div key={t._id} className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div className="badge">{t.category}</div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="icon-only" onClick={() => setEditingTutorial(t)}><Edit size={14} /></button>
                                <button className="icon-only delete" onClick={() => handleDelete('tutorial', t._id)}><Trash2 size={14} /></button>
                            </div>
                        </div>
                        <h3 style={{ margin: '0.75rem 0 0.5rem 0' }}>{t.title}</h3>
                        <p className="card-desc">{t.description}</p>
                        <div className="exam-meta">
                            <span><Play size={12} /> {t.lessons?.length || 0} Lessons</span>
                            {/* Simple duration sum if durations are strings like "15:20" */}
                            <span title="Total Duration"><Clock size={12} /> {t.lessons?.length > 0 ? 'Series' : '0m'}</span>
                            {t.isPremium && <span title="Pricing" style={{ color: '#fbbf24' }}>₹{t.price}</span>}
                        </div>
                    </div>
                ))}
                {tutorials.length === 0 && <div className="placeholder-text">No tutorials created yet.</div>}
            </div>
        </div>
    );

    const handleCreateNotification = async () => {
        if (!newNotification.title || !newNotification.message) return alert('Title and message required');
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/notifications`, newNotification, authConfig());
            setNewNotification({ title: '', message: '', type: 'info' });
            fetchAllData();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    const renderNotificationsView = () => (
        <div className="animate-fade-in content-view">
            <div className="view-header">
                <h2 className="view-title">Global Notifications</h2>
            </div>
            <div className="overview-row" style={{ alignItems: 'flex-start' }}>
                <div className="glass-section" style={{ flex: 1 }}>
                    <h3>Create Notification</h3>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label>Title</label>
                        <input value={newNotification.title} onChange={e => setNewNotification({ ...newNotification, title: e.target.value })} placeholder="Notification Title" />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label>Message</label>
                        <textarea value={newNotification.message} onChange={e => setNewNotification({ ...newNotification, message: e.target.value })} rows={3} placeholder="Notification content..." />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Type</label>
                        <select value={newNotification.type} onChange={e => setNewNotification({ ...newNotification, type: e.target.value })}>
                            <option value="info">Info</option>
                            <option value="success">Success</option>
                            <option value="warning">Warning</option>
                            <option value="alert">Alert</option>
                        </select>
                    </div>
                    <button className="btn-primary" onClick={handleCreateNotification}><Plus size={14} /> Send Global Notification</button>
                </div>
                <div className="glass-section" style={{ flex: 1.5 }}>
                    <h3>Past Notifications</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {notifications.map(n => (
                            <div key={n._id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                                        <span className={`badge ${n.type}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', textTransform: 'uppercase' }}>{n.type}</span>
                                        <h4 style={{ margin: 0, fontSize: '1rem' }}>{n.title}</h4>
                                    </div>
                                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', opacity: 0.7, lineHeight: 1.4 }}>{n.message}</p>
                                    <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>{new Date(n.createdAt).toLocaleString()}</span>
                                </div>
                                <button className="icon-only delete" onClick={() => handleDelete('notification', n._id)}><Trash2 size={14} /></button>
                            </div>
                        ))}
                        {notifications.length === 0 && <div className="placeholder-text" style={{ padding: '1rem' }}>No notifications sent yet.</div>}
                    </div>
                </div>
            </div>
        </div>
    );

    if (universalEditor && !loading) {
        return (
            <div className="pro-admin-layout">
                <aside className="pro-sidebar">
                    <div className="sidebar-brand">
                        <Brain size={24} style={{ color: '#6366f1' }} />
                        <div><h1>Elevate</h1><span>Control Hub</span></div>
                    </div>
                    <nav className="sidebar-menu">
                        {[
                            { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
                            { id: 'domains', label: 'Course Data', Icon: Database },
                            { id: 'corecs', label: 'Core CS', Icon: Cpu },
                            { id: 'users', label: 'Users', Icon: Users },
                            { id: 'exams', label: 'Exams', Icon: Award },
                            { id: 'tutorials', label: 'Tutorials', Icon: Play },
                            { id: 'notifications', label: 'Notifications', Icon: Bell },
                            { id: 'results', label: 'Exam Results', Icon: CheckCircle2 },
                            { id: 'interviews', label: 'Interviews', Icon: Mic },
                        ].map(({ id, label, Icon }) => (
                            <button key={id} className={activeTab === id ? 'active' : ''} onClick={() => { setActiveTab(id); setUniversalEditor(null); }}>
                                <Icon size={17} /> {label}
                            </button>
                        ))}
                    </nav>
                    <div className="sidebar-footer">
                        <div className="profile-strip">
                            <div className="avatar">A</div>
                            <div className="info"><strong>Administrator</strong><span>System Admin</span></div>
                        </div>
                    </div>
                </aside>
                <main className="pro-main" style={{ padding: 0 }}>
                    <UniversalDomainEditor
                        domain={universalEditor.domain}
                        topics={topics}
                        onBack={() => setUniversalEditor(null)}
                        onSaveDomain={saveDomain}
                        onSaveTopic={saveTopic}
                        onAddTopic={addTopic}
                        onDeleteTopic={deleteTopic}
                        onDeleteDomain={deleteDomain}
                    />
                </main>
                <style>{CSS}</style>
            </div>
        );
    }

    return (
        <div className="pro-admin-layout">
            <aside className="pro-sidebar">
                <div className="sidebar-brand">
                    <Brain size={24} style={{ color: '#6366f1' }} />
                    <div><h1>Elevate</h1><span>Control Hub</span></div>
                </div>
                <nav className="sidebar-menu">
                    {[
                        { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
                        { id: 'domains', label: 'Course Data', Icon: Database },
                        { id: 'corecs', label: 'Core CS', Icon: Cpu },
                        { id: 'users', label: 'Users', Icon: Users },
                        { id: 'exams', label: 'Exams', Icon: Award },
                        { id: 'tutorials', label: 'Tutorials', Icon: Play },
                        { id: 'notifications', label: 'Notifications', Icon: Bell },
                        { id: 'results', label: 'Exam Results', Icon: CheckCircle2 },
                        { id: 'interviews', label: 'Interviews', Icon: Mic },
                    ].map(({ id, label, Icon }) => (
                        <button key={id} className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id)}>
                            <Icon size={17} /> {label}
                        </button>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div className="profile-strip">
                        <div className="avatar">A</div>
                        <div className="info"><strong>Administrator</strong><span>System Admin</span></div>
                    </div>
                </div>
            </aside>
            <main className="pro-main">
                {loading ? (
                    <div className="loader-view"><Loader2 className="spin" size={32} /> Loading...</div>
                ) : (
                    <>
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'domains' && renderDomainsView()}
                        {activeTab === 'users' && renderUsersView()}
                        {activeTab === 'exams' && renderExamsView()}
                        {activeTab === 'tutorials' && renderTutorialsView()}
                        {activeTab === 'notifications' && renderNotificationsView()}
                        {activeTab === 'results' && renderExamResultsView()}
                        {activeTab === 'interviews' && renderInterviewsView()}
                        {activeTab === 'corecs' && (
                            <div style={{ height: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column' }}>
                                <CoreCSManager
                                    coreCSTopics={coreCSTopics}
                                    onTopicsRefresh={async () => {
                                        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/admin/corecs`, authConfig());
                                        setCoreCSTopics(res.data);
                                    }}
                                />
                            </div>
                        )}
                    </>
                )}
            </main>

            {editingExam && (
                <ExamEditorModal
                    exam={editingExam}
                    domains={domains}
                    onSave={saveExam}
                    onClose={() => setEditingExam(null)}
                />
            )}

            {editingTutorial && (
                <TutorialEditorModal
                    tutorial={editingTutorial}
                    onSave={saveTutorial}
                    onClose={() => setEditingTutorial(null)}
                />
            )}

            {selectedInterview && (
                <InterviewDetailModal
                    interview={selectedInterview}
                    onClose={() => setSelectedInterview(null)}
                />
            )}

            {selectedUserDetails && (
                <UserDetailModal
                    user={selectedUserDetails}
                    onClose={() => setSelectedUserDetails(null)}
                />
            )}

            <style>{CSS}</style>
        </div>
    );
};

// ──────────────────────────────────────────
// CSS
// ──────────────────────────────────────────
const CSS = `
    *, *::before, *::after { box-sizing: border-box; }

    .pro-admin-layout {
        display: grid;
        grid-template-columns: 240px 1fr;
        min-height: 100vh;
        padding-top: 90px;
        background: #09090e;
        color: #e2e8f0;
        font-family: 'Inter', system-ui, sans-serif;
    }

    /* ── Sidebar ── */
    .pro-sidebar {
        background: #0b0b12;
        border-right: 1px solid rgba(255,255,255,0.05);
        display: flex;
        flex-direction: column;
        padding: 1.5rem 0.75rem;
        position: sticky;
        top: 90px;
        height: calc(100vh - 90px);
        overflow-y: auto;
    }
    .sidebar-brand { display: flex; align-items: center; gap: 0.6rem; padding: 0 0.75rem 2.5rem; }
    .sidebar-brand h1 { margin: 0; font-size: 1.1rem; font-weight: 800; letter-spacing: -0.5px; }
    .sidebar-brand span { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.35; font-weight: 700; }
    .sidebar-menu { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
    .sidebar-menu button {
        display: flex; align-items: center; gap: 0.75rem;
        background: transparent; border: none; color: rgba(255,255,255,0.4);
        padding: 0.75rem 1rem; border-radius: 10px;
        cursor: pointer; transition: all 0.2s; text-align: left;
        font-weight: 500; font-size: 0.875rem; width: 100%;
    }
    .sidebar-menu button:hover { background: rgba(255,255,255,0.04); color: #fff; }
    .sidebar-menu button.active { background: #6366f1; color: #fff; box-shadow: 0 6px 16px rgba(99,102,241,0.25); }
    .sidebar-footer { padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); margin-top: auto; }
    .profile-strip { display: flex; align-items: center; gap: 0.6rem; padding: 0.25rem 0.5rem; }
    .avatar { width: 32px; height: 32px; background: #6366f1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.875rem; }
    .info { display: flex; flex-direction: column; line-height: 1.3; }
    .info strong { font-size: 0.8rem; }
    .info span { font-size: 0.65rem; opacity: 0.35; }

    /* ── Main content ── */
    .pro-main { padding: 2.5rem 2.5rem; overflow-y: auto; }
    .content-view { max-width: 1100px; }
    .view-title { font-size: 1.4rem; font-weight: 700; margin: 0 0 1.5rem; }
    .view-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem; }

    /* ── Stats ── */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 2.5rem; }
    .stat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1.25rem; border-radius: 18px; display: flex; align-items: center; gap: 1rem; }
    .stat-icon-box { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    .stat-icon-box.users { background: rgba(99,102,241,0.1); color: #818cf8; }
    .stat-icon-box.domains { background: rgba(129, 140, 248,0.1); color: #34d399; }
    .stat-icon-box.topics { background: rgba(245,158,11,0.1); color: #fbbf24; }
    .stat-icon-box.exams { background: rgba(239,68,68,0.1); color: #f87171; }
    .stat-label { font-size: 0.7rem; font-weight: 600; opacity: 0.45; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { margin: 0.2rem 0 0; font-size: 1.5rem; font-weight: 800; }

    .overview-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .glass-section { background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 1.5rem; border-radius: 18px; }
    .glass-section h3 { margin: 0 0 1.25rem; font-size: 0.95rem; opacity: 0.7; }
    .actions-grid { display: flex; flex-direction: column; gap: 0.75rem; }
    .empty-log { padding: 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; opacity: 0.3; font-size: 0.85rem; }

    /* ── Grid cards ── */
    .pro-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 1.25rem; }
    .glass-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 18px; transition: border-color 0.2s; }
    .glass-card:hover { border-color: rgba(99,102,241,0.3); }
    .card-header { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
    .card-header h3 { margin: 0; font-size: 1rem; font-weight: 700; }
    .card-desc { font-size: 0.82rem; opacity: 0.5; line-height: 1.5; margin-bottom: 1.25rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .card-footer { display: flex; align-items: center; gap: 0.5rem; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 1rem; }
    .badge { font-size: 0.65rem; background: rgba(99,102,241,0.1); color: #818cf8; padding: 0.2rem 0.5rem; border-radius: 5px; font-weight: 700; }

    /* Exam card */
    .exam-badge { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; background: rgba(245,158,11,0.1); color: #fbbf24; padding: 0.25rem 0.6rem; border-radius: 6px; width: fit-content; }
    .exam-meta { display: flex; gap: 1rem; font-size: 0.75rem; opacity: 0.45; margin-bottom: 1rem; }
    .exam-meta span { display: flex; align-items: center; gap: 0.3rem; }
    .exam-domain-tag { font-size: 0.75rem; opacity: 0.4; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.04); }

    /* ── Table ── */
    .table-container { background: rgba(255,255,255,0.01); border-radius: 16px; border: 1px solid rgba(255,255,255,0.04); overflow: hidden; }
    .pro-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    .pro-table th { text-align: left; padding: 0.9rem 1.25rem; opacity: 0.3; font-weight: 600; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; }
    .pro-table td { padding: 0.9rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.025); }
    .pro-table tr:hover td { background: rgba(255,255,255,0.015); }
    .user-profile-sm { display: flex; align-items: center; gap: 0.6rem; font-weight: 600; }
    .user-avatar { width: 28px; height: 28px; background: rgba(99,102,241,0.2); color: #818cf8; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; }
    .role-pill { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; padding: 0.2rem 0.55rem; border-radius: 100px; }
    .role-pill.admin { background: rgba(245,158,11,0.1); color: #fbbf24; }
    .role-pill.user { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.5); }
    .table-actions { display: flex; gap: 0.4rem; justify-content: flex-start; }

    /* ── Buttons ── */
    .btn-primary { background: #6366f1; color: #fff; border: none; padding: 0.6rem 1.2rem; border-radius: 9px; font-weight: 600; display: inline-flex; align-items: center; gap: 0.4rem; cursor: pointer; transition: 0.2s; font-size: 0.875rem; }
    .btn-primary:hover { background: #4f46e5; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); color: #fff; padding: 0.6rem 1rem; border-radius: 9px; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.4rem; }
    .btn-secondary:hover { background: rgba(255,255,255,0.08); }
    .btn-secondary.outline { opacity: 0.5; }
    .btn-save { background: rgba(129, 140, 248,0.1); border: 1px solid rgba(129, 140, 248,0.25); color: #34d399; padding: 0.55rem 1.1rem; border-radius: 9px; font-weight: 700; display: inline-flex; align-items: center; gap: 0.4rem; cursor: pointer; transition: 0.2s; font-size: 0.85rem; }
    .btn-save:hover { background: rgba(129, 140, 248,0.2); }
    .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-danger { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #f87171; padding: 0.55rem 1.1rem; border-radius: 9px; font-weight: 600; cursor: pointer; font-size: 0.85rem; }
    .btn-danger:hover { background: rgba(239,68,68,0.18); }
    .btn-sm { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); color: #fff; padding: 0.35rem 0.75rem; border-radius: 7px; font-weight: 600; cursor: pointer; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.3rem; }
    .btn-sm:hover { background: rgba(255,255,255,0.09); }
    .btn-sm.highlight { border-color: rgba(99,102,241,0.4); color: #818cf8; background: rgba(99,102,241,0.08); }
    .btn-sm.highlight:hover { background: rgba(99,102,241,0.18); }
    .btn-dashed { background: transparent; border: 1.5px dashed rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); padding: 0.6rem 1rem; border-radius: 9px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; width: 100%; justify-content: center; font-size: 0.85rem; transition: 0.2s; }
    .btn-dashed:hover { border-color: #6366f1; color: #818cf8; }
    .icon-only { background: rgba(255,255,255,0.04); border: none; color: rgba(255,255,255,0.6); padding: 0.45rem; border-radius: 7px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: 0.15s; }
    .icon-only:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .icon-only.delete:hover { background: rgba(239,68,68,0.15); color: #f87171; }
    .btn-back { background: rgba(255,255,255,0.04); border: none; color: #fff; padding: 0.5rem 0.75rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; }

    /* ── Search ── */
    .search-wrap { display: flex; align-items: center; gap: 0.6rem; background: rgba(255,255,255,0.03); padding: 0.45rem 0.9rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.07); min-width: 250px; }
    .search-wrap input { background: transparent; border: none; color: #fff; outline: none; width: 100%; font-size: 0.875rem; }

    /* ── Forms ── */
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-group label { font-size: 0.68rem; font-weight: 700; opacity: 0.4; text-transform: uppercase; letter-spacing: 0.5px; }
    .form-group input, .form-group select, .form-group textarea {
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
        padding: 0.65rem 0.85rem; border-radius: 10px; color: #e2e8f0;
        outline: none; font-family: inherit; font-size: 0.875rem; transition: 0.2s; width: 100%;
    }
    
    /* ── Toggle Switch ── */
    .toggle-switch { position: relative; display: inline-block; width: 40px; height: 22px; }
    .toggle-switch input { opacity: 0; width: 0; height: 0; }
    .toggle-switch .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255,255,255,0.1); transition: .4s; border-radius: 34px; }
    .toggle-switch .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: #fff; transition: .4s; border-radius: 50%; }
    .toggle-switch input:checked + .slider { background-color: #6366f1; }
    .toggle-switch input:checked + .slider:before { transform: translateX(18px); }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #6366f1; background: rgba(99,102,241,0.05); }
    .form-group textarea { resize: vertical; line-height: 1.6; }
    .form-group textarea.mono { font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; }
    .form-row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .form-row.form-group { flex: 1; min-width: 160px; }
    select option { background: #1a1a2e; }

    /* ── Universal Domain Editor ── */
    .ude-root { display: flex; flex-direction: column; height: calc(100vh - 90px); background: #09090e; }
    .ude-topbar {
        display: flex; align-items: center; gap: 1rem;
        padding: 0.85rem 1.5rem;
        background: rgba(255,255,255,0.01); border-bottom: 1px solid rgba(255,255,255,0.05);
        flex-shrink: 0;
    }
    .ude-back { display: flex; align-items: center; gap: 0.4rem; background: transparent; border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.6); padding: 0.45rem 0.85rem; border-radius: 8px; cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: 0.15s; }
    .ude-back:hover { color: #fff; }
    .ude-breadcrumb { display: flex; align-items: center; gap: 0.4rem; font-weight: 700; font-size: 0.95rem; margin-right: auto; }
    .ude-breadcrumb svg { opacity: 0.4; }
    .ude-top-tabs { display: flex; gap: 0.25rem; background: rgba(255,255,255,0.03); padding: 0.25rem; border-radius: 10px; }
    .ude-top-tabs button { background: transparent; border: none; color: rgba(255,255,255,0.5); padding: 0.4rem 0.9rem; border-radius: 7px; cursor: pointer; display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; font-weight: 600; }
    .ude-top-tabs button.active { background: rgba(255,255,255,0.08); color: #fff; }

    .ude-body { display: grid; grid-template-columns: 240px 1fr; flex: 1; overflow: hidden; }

    /* Topics sidebar */
    .ude-sidebar { border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; overflow: hidden; }
    .ude-sidebar-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.1rem 0.75rem; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; opacity: 0.4; flex-shrink: 0; }
    .ude-topic-list { flex: 1; overflow-y: auto; padding: 0.5rem; }
    .ude-topic-item { display: flex; align-items: center; gap: 0.6rem; width: 100%; background: transparent; border: none; color: rgba(255,255,255,0.6); padding: 0.65rem 0.75rem; border-radius: 9px; cursor: pointer; text-align: left; transition: 0.15s; }
    .ude-topic-item:hover { background: rgba(255,255,255,0.04); color: #fff; }
    .ude-topic-item.active { background: rgba(99,102,241,0.12); color: #fff; }
    .ude-topic-meta { display: flex; flex-direction: column; line-height: 1.3; min-width: 0; }
    .ude-topic-title { font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px; }
    .ude-topic-sub { font-size: 0.67rem; opacity: 0.4; }
    .ude-empty-topics { padding: 2rem 1rem; text-align: center; font-size: 0.8rem; opacity: 0.3; line-height: 1.6; }

    /* Type dot */
    .type-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
    .type-dot.theory { background: #34d399; }
    .type-dot.practice { background: #818cf8; }

    /* Topic editor panel */
    .ude-content { display: flex; flex-direction: column; overflow: hidden; }
    .topic-editor-panel { display: flex; flex-direction: column; height: 100%; }
    .te-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); flex-shrink: 0; }
    .te-title { display: flex; align-items: center; gap: 0.6rem; }
    .te-tabs { display: flex; gap: 0; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 0 1.5rem; flex-shrink: 0; }
    .te-tab { background: transparent; border: none; border-bottom: 2px solid transparent; color: rgba(255,255,255,0.4); padding: 0.75rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 600; transition: 0.15s; }
    .te-tab:hover { color: #fff; }
    .te-tab.active { color: #818cf8; border-bottom-color: #6366f1; }
    .te-body { flex: 1; overflow-y: auto; padding: 1.5rem; }
    .te-section { display: flex; flex-direction: column; gap: 1.25rem; max-width: 800px; }

    /* Settings ude */
    .ude-settings { padding: 2rem; overflow-y: auto; flex: 1; }
    .large { } /* placeholder to allow easy expansion */

    /* No topic selected */
    .ude-no-topic { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; opacity: 0.5; }
    .ude-no-topic p { font-size: 0.9rem; }

    /* Quiz editor */
    .quiz-editor { display: flex; flex-direction: column; gap: 1.25rem; }
    .quiz-question-block { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); padding: 1.25rem; border-radius: 14px; }
    .qb-header { display: flex; align-items: center; margin-bottom: 0.9rem; }
    .qb-num { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; opacity: 0.4; letter-spacing: 1px; }
    .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
    .option-row { display: flex; align-items: center; gap: 0.4rem; }
    .option-row input { flex: 1; }
    .correct-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); padding: 0.4rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; flex-shrink: 0; transition: 0.2s; }
    .correct-btn.active { background: rgba(129, 140, 248,0.1); border-color: rgba(129, 140, 248,0.3); color: #34d399; }

    /* Misc */
    .placeholder-text { opacity: 0.3; font-size: 0.875rem; padding: 2rem; text-align: center; }
    .loader-view { height: 300px; display: flex; align-items: center; justify-content: center; gap: 0.75rem; opacity: 0.4; font-weight: 600; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
`;

export default AdminDashboard;
