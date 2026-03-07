import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import { getApiUrl } from '../api/config';
import CoreCSManager from './CoreCSManager';
import './AdminDashboard.css';
import {
    Plus, Edit, Trash2, ChevronRight, ChevronDown,
    Brain, Code, Info, Loader2, ArrowLeft,
    FileText, Users, LayoutDashboard,
    Database, Shield, LogOut, Search,
    Clock, Award, RefreshCcw, Mic, CloudUpload, Timer,
    XCircle, Save, BookOpen, Zap, HelpCircle, Globe, CheckCircle2, Cpu, Play, Bell, Trophy
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
// Sub-component: ContestEditorModal
// ──────────────────────────────────────────
const ContestEditorModal = ({ contest, onSave, onClose, onAIUpload, structuring }) => {
    const [data, setData] = useState({ ...contest });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await onSave(data);
        setSaving(false);
    };

    const addQuestion = () => {
        const q = [...(data.questions || [])];
        q.push({ questionText: '', options: ['', '', '', ''], correctAnswer: '', difficulty: 'Medium', explanation: '', type: 'mcq' });
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
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{data._id ? 'Edit' : 'Create'} Contest: {data.title}</h2>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <div className="ai-upload-btn" style={{ position: 'relative' }}>
                            <input 
                                type="file" 
                                accept=".pdf,.txt" 
                                style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                                onChange={(e) => onAIUpload(e.target.files[0])}
                                disabled={structuring}
                            />
                            <button className="btn-secondary" disabled={structuring}>
                                {structuring ? <Loader2 size={14} className="spin" /> : <CloudUpload size={14} />}
                                {structuring ? 'Processing...' : 'AI Upload (PDF/Text)'}
                            </button>
                        </div>
                        <button className="btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
                        <button className="btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />} Save Contest
                        </button>
                    </div>
                </div>
                <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-row">
                        <div className="form-group" style={{ flex: 2 }}>
                            <label>Title</label>
                            <input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Duration (mins)</label>
                            <input type="number" value={data.durationMinutes} onChange={e => setData({ ...data, durationMinutes: Number(e.target.value) })} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Time</label>
                            <input type="datetime-local" value={data.startTime ? new Date(data.startTime).toISOString().slice(0, 16) : ''} onChange={e => setData({ ...data, startTime: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>End Time</label>
                            <input type="datetime-local" value={data.endTime ? new Date(data.endTime).toISOString().slice(0, 16) : ''} onChange={e => setData({ ...data, endTime: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Contest Type</label>
                            <select value={data.contestType || 'special'} onChange={e => setData({ ...data, contestType: e.target.value })}>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="special">Special / Company Specific</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1.5 }}>
                            <label>Company Tags (comma separated)</label>
                            <input 
                                value={data.tags ? data.tags.join(', ') : ''} 
                                onChange={e => setData({ ...data, tags: e.target.value.split(',').map(t => t.trim()) })} 
                                placeholder="e.g. Microsoft, Google"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Image/Logo URL</label>
                        <input value={data.image || ''} onChange={e => setData({ ...data, image: e.target.value })} placeholder="https://logo-url.com/google.png" />
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
                                            <button onClick={() => removeQ(qi)} className="icon-only delete"><Trash2 size={13} /></button>
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                                        <label>Question Text</label>
                                        {q.type === 'coding' ? (
                                            <textarea value={q.questionText} onChange={e => updateQ(qi, 'questionText', e.target.value)} rows={4} />
                                        ) : (
                                            <input value={q.questionText} onChange={e => updateQ(qi, 'questionText', e.target.value)} />
                                        )}
                                    </div>
                                    {q.type === 'mcq' && (
                                        <div className="options-grid">
                                            {(q.options || ['', '', '', '']).map((opt, oi) => (
                                                <div key={oi} className="option-row">
                                                    <button
                                                        className={`correct-btn ${q.correctAnswer === String(oi) ? 'active' : ''}`}
                                                        onClick={() => updateQ(qi, 'correctAnswer', String(oi))}
                                                    >
                                                        <CheckCircle2 size={14} />
                                                    </button>
                                                    <input value={opt} onChange={e => updateOption(qi, oi, e.target.value)} placeholder={`Option ${oi + 1}`} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
// Sub-components for Modals
// ──────────────────────────────────────────
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

const UserDetailModal = ({ user, onClose }) => {
    if (!user) return null;

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

const StatBox = ({ label, value, color }) => (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{label}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: color }}>{value}%</div>
    </div>
);

// ──────────────────────────────────────────
// Sub-component: InterviewDetailModal
// ──────────────────────────────────────────
const InterviewDetailModal = ({ interview, onClose }) => {
    if (!interview) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.85)', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)'
        }} className="animate-fade-in" onClick={onClose}>
            <div style={{
                background: '#0F172A', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
                width: '100%', maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 50px 100px rgba(0,0,0,0.8)', overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(99,102,241,0.05)' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Interview Report</h2>
                        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.6 }}>{interview.candidateName} • {interview.role}</p>
                    </div>
                    <button className="icon-only" onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)' }}><XCircle size={20} /></button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Scores */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        <StatBox label="Overall Score" value={interview.score} color="#fff" />
                        <StatBox label="Technical" value={interview.technicalScore} color="#818cf8" />
                        <StatBox label="Communication" value={interview.communicationScore} color="#c084fc" />
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Hire Status</div>
                            <div style={{
                                fontSize: '1.2rem',
                                fontWeight: 800,
                                color: interview.hireProbability === 'High' ? '#818cf8' : interview.hireProbability === 'Medium' ? '#fbbf24' : '#ef4444'
                            }}>
                                {interview.hireProbability}
                            </div>
                        </div>
                    </div>

                    {/* Feedback */}
                    <div className="glass-section">
                        <h3 style={{ fontSize: '0.9rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Brain size={16} /> AI Feedback
                        </h3>
                        <p style={{ lineHeight: 1.6, fontSize: '1rem', color: 'rgba(255,255,255,0.9)' }}>{interview.feedback}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {/* Improvements */}
                        <div className="glass-section">
                            <h3 style={{ fontSize: '0.9rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Zap size={16} /> Key Improvements
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {interview.improvements?.map((imp, i) => (
                                    <div key={i} style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.1)', fontSize: '0.9rem' }}>
                                        {imp}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Study Plan */}
                        <div className="glass-section">
                            <h3 style={{ fontSize: '0.9rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <BookOpen size={16} /> Accelerated Study Plan
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {interview.studyPlan?.map((plan, i) => (
                                    <span key={i} style={{ background: 'rgba(129, 140, 248, 0.1)', color: '#818cf8', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>{plan}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Transcript */}
                    <div className="glass-section">
                        <h3 style={{ fontSize: '0.9rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <RefreshCcw size={16} /> Conversation Transcript
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {interview.transcript?.map((msg, i) => (
                                <div key={i} style={{
                                    padding: '1.25rem',
                                    borderRadius: '16px',
                                    background: msg.role === 'interviewer' ? 'rgba(255,255,255,0.02)' : 'rgba(99, 102, 241, 0.08)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderLeft: msg.role === 'interviewer' ? '4px solid rgba(255,255,255,0.1)' : '4px solid #818cf8',
                                    marginLeft: msg.role === 'interviewer' ? '0' : '2rem',
                                    maxWidth: '90%'
                                }}>
                                    <div style={{
                                        fontSize: '0.7rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        opacity: 0.4,
                                        marginBottom: '0.5rem',
                                        color: msg.role === 'interviewer' ? 'inherit' : '#818cf8'
                                    }}>
                                        {msg.role === 'interviewer' ? 'Dev2Dev AI' : 'Candidate'}
                                    </div>
                                    <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}>{msg.text}</div>
                                </div>
                            ))}
                        </div>
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
// Sub-component: AddUserModal
// ──────────────────────────────────────────
const AddUserModal = ({ user, onChange, onSave, onClose, saving }) => {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.85)', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)'
        }} className="animate-fade-in" onClick={onClose}>
            <div style={{
                background: '#0F172A', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
                width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column',
                boxShadow: '0 50px 100px rgba(0,0,0,0.8)', overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>

                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(99,102,241,0.05)' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Add New User</h2>
                    <button className="icon-only" onClick={onClose} disabled={saving}><XCircle size={20} /></button>
                </div>

                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input value={user.name} onChange={e => onChange({ ...user, name: e.target.value })} placeholder="e.g. Puneet Kumar" />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={user.email} onChange={e => onChange({ ...user, email: e.target.value })} placeholder="puneet12@gmail.com" />
                    </div>
                    <div className="form-group">
                        <label>Set Password</label>
                        <input type="password" value={user.password} onChange={e => onChange({ ...user, password: e.target.value })} placeholder="Minimum 6 characters" />
                    </div>

                    <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Premium Access</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Unlocks all features automatically</div>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={user.isPremium} onChange={e => onChange({ ...user, isPremium: e.target.checked })} />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                        <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose} disabled={saving}>Cancel</button>
                        <button className="btn-primary" style={{ flex: 2 }} onClick={onSave} disabled={saving}>
                            {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />} Create User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
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
    const [contests, setContests] = useState([]);
    const [newNotification, setNewNotification] = useState({ title: '', message: '', type: 'info' });

    const [activeTab, setActiveTab] = useState('overview');
    const [universalEditor, setUniversalEditor] = useState(null); // { domain }
    const [editingExam, setEditingExam] = useState(null);
    const [editingContest, setEditingContest] = useState(null);
    const [editingTutorial, setEditingTutorial] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [structuring, setStructuring] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // User Management State
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', isPremium: false });
    const [creatingUser, setCreatingUser] = useState(false);

    const handleNotifyPremium = async () => {
        if (!window.confirm("Send 'Welcome Premium' email to all active premium users?")) return;
        try {
            const res = await fetch(getApiUrl('/api/admin/users/notify-premium'), {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            alert(data.message);
        } catch (e) {
            console.error("Notify Error", e);
            alert("Failed to send notifications.");
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        const safeGet = async (url, cfg) => {
            try { const r = await axios.get(url, cfg); return r.data; }
            catch (e) { console.warn('Fetch failed:', url, e.response?.status); return null; }
        };
        const [s, d, u, e, cs, t, iv, n, contestsData] = await Promise.all([
            safeGet(getApiUrl('/api/admin/stats'), authConfig()),
            safeGet(getApiUrl('/api/admin/domains'), authConfig()),
            safeGet(getApiUrl('/api/admin/users'), authConfig()),
            safeGet(getApiUrl('/api/admin/exams'), authConfig()),
            safeGet(getApiUrl('/api/admin/corecs'), authConfig()),
            safeGet(getApiUrl('/api/admin/tutorials'), authConfig()),
            safeGet(getApiUrl('/api/interviews/all'), authConfig()),
            safeGet(getApiUrl('/api/notifications'), authConfig()),
            safeGet(getApiUrl('/api/contests'), authConfig()),
        ]);
        if (s) setStats(s);
        if (d) setDomains(d);
        if (u) setUsers(u);
        if (e) setExams(e);
        if (cs) setCoreCSTopics(cs);
        if (t) setTutorials(t);
        if (iv) setInterviews(iv);
        if (n) setNotifications(n);
        if (contestsData) setContests(contestsData);
        setLoading(false);
    };

    useEffect(() => { fetchAllData(); }, []);

    const fetchTopics = async (domainId) => {
        const res = await axios.get(getApiUrl(`/api/admin/topics/domain/${domainId}`), authConfig());
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
            if (data._id) await axios.put(getApiUrl(`/api/admin/domains/${data._id}`), data, authConfig());
            else await axios.post(getApiUrl('/api/admin/domains'), data, authConfig());
            fetchAllData();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    const deleteDomain = async (id) => {
        if (!window.confirm('Delete this domain and all its topics?')) return;
        await axios.delete(getApiUrl(`/api/admin/domains/${id}`), authConfig());
        setUniversalEditor(null);
        fetchAllData();
    };

    const saveTopic = async (data) => {
        try {
            if (data._id) {
                await axios.put(getApiUrl(`/api/admin/topics/${data._id}`), data, authConfig());
            } else {
                await axios.post(getApiUrl('/api/admin/topics'), data, authConfig());
            }
            await fetchTopics(universalEditor.domain._id);
            fetchAllData();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    const addTopic = async (defaults) => {
        try {
            const res = await axios.post(getApiUrl('/api/admin/topics'), defaults, authConfig());
            await fetchTopics(universalEditor.domain._id);
            fetchAllData();
            return res.data;
        } catch (err) { alert(err.response?.data?.message || err.message); return null; }
    };

    const deleteTopic = async (id) => {
        if (!window.confirm('Delete this topic?')) return;
        await axios.delete(getApiUrl(`/api/admin/topics/${id}`), authConfig());
        await fetchTopics(universalEditor.domain._id);
        fetchAllData();
    };

    const saveExam = async (data) => {
        try {
            if (data._id) {
                await axios.put(getApiUrl(`/api/admin/exams/${data._id}`), data, authConfig());
            } else {
                await axios.post(getApiUrl('/api/admin/exams'), data, authConfig());
            }
            setEditingExam(null);
            fetchAllData();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    const saveTutorial = async (data) => {
        try {
            if (data._id) {
                await axios.put(getApiUrl(`/api/admin/tutorials/${data._id}`), data, authConfig());
            } else {
                await axios.post(getApiUrl('/api/admin/tutorials'), data, authConfig());
            }
            setEditingTutorial(null);
            fetchAllData();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    const saveContest = async (data) => {
        try {
            if (data._id) {
                await axios.put(getApiUrl(`/api/contests/${data._id}`), data, authConfig());
            } else {
                await axios.post(getApiUrl('/api/contests'), data, authConfig());
            }
            setEditingContest(null);
            fetchAllData();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    const handleContestAIUpload = async (file) => {
        setStructuring(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            // 1. Parse PDF/Text using existing endpoint
            const parseRes = await axios.post(getApiUrl('/api/admin/parse-file'), formData, {
                headers: { ...authConfig().headers, 'Content-Type': 'multipart/form-data' }
            });
            
            const rawText = parseRes.data.text;
            
            // 2. Structure using new AI endpoint
            const structureRes = await axios.post(getApiUrl('/api/contests/ai-structure'), {
                rawText,
                targetType: 'contest'
            }, authConfig());
            
            setEditingContest(structureRes.data);
        } catch (err) {
            alert("AI structuring failed: " + (err.response?.data?.message || err.message));
        } finally {
            setStructuring(false);
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Delete this ${type}?`)) return;
        await axios.delete(getApiUrl(`/api/admin/${type}s/${id}`), authConfig());
        fetchAllData();
    };

    const handleToggleRole = async (userId) => {
        await axios.put(getApiUrl(`/api/admin/users/role/${userId}`), {}, authConfig());
        fetchAllData();
    };

    const handleTogglePremium = async (userId) => {
        await axios.put(getApiUrl(`/api/admin/users/premium/${userId}`), {}, authConfig());
        fetchAllData();
    };

    const handleCreateUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            alert("Please fill all required fields");
            return;
        }
        setCreatingUser(true);
        try {
            await axios.post(getApiUrl('/api/admin/users'), newUser, authConfig());
            setShowAddUserModal(false);
            setNewUser({ name: '', email: '', password: '', isPremium: false });
            fetchAllData();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setCreatingUser(false);
        }
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
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="search-wrap">
                        <Search size={15} />
                        <input type="text" placeholder="Search users..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                    <button className="btn-secondary" onClick={handleNotifyPremium} title="Email all active premium users">
                        <Mail size={18} /> Notify All Premium
                    </button>
                    <button className="btn-primary" onClick={() => setShowAddUserModal(true)}>
                        <Plus size={18} /> Add User
                    </button>
                </div>
            </div>
            <div className="table-container">
                <table className="pro-table">
                    <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Premium</th><th>Actions</th></tr></thead>
                    <tbody>
                        {users.filter(u =>
                            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.email.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map(u => (
                            <tr key={u._id}>
                                <td><div className="user-profile-sm"><div className="user-avatar">{u.name[0]}</div><span>{u.name}</span></div></td>
                                <td style={{ opacity: 0.6 }}>{u.email}</td>
                                <td><span className={`role-pill ${u.role}`}>{u.role}</span></td>
                                <td>
                                    <button
                                        onClick={() => handleTogglePremium(u._id)}
                                        className={`icon-only ${u.isPremium ? 'premium-active' : ''}`}
                                        title={u.isPremium ? "Revoke Premium" : "Grant Premium"}
                                        style={{ color: u.isPremium ? '#f59e0b' : 'rgba(255,255,255,0.2)' }}
                                    >
                                        <Zap size={16} fill={u.isPremium ? "currentColor" : "none"} />
                                    </button>
                                    {u.isPremium && (
                                        <button 
                                            onClick={() => {
                                                if(window.confirm(`Resend Welcome email to ${u.name}?`)) {
                                                    fetch(getApiUrl(`/api/admin/users/resend-premium-email/${u._id}`), {
                                                        method: 'POST',
                                                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                                                    }).then(res => res.json()).then(data => alert(data.message));
                                                }
                                            }}
                                            className="icon-only"
                                            title="Resend Welcome Email"
                                            style={{ color: '#818cf8', marginLeft: '0.3rem' }}
                                        >
                                            <Mail size={14} />
                                        </button>
                                    )}
                                </td>
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

    const renderContestsView = () => (
        <div className="animate-fade-in content-view">
            <div className="view-header">
                <h2 className="view-title">Coding Contests</h2>
                <button className="btn-primary" onClick={() => setEditingContest({ title: 'New Contest', durationMinutes: 60, startTime: new Date(), endTime: new Date(Date.now() + 86400000), questions: [] })}>
                    <Plus size={18} /> New Contest
                </button>
            </div>
            <div className="pro-grid">
                {contests.map(c => (
                    <div key={c._id} className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div className="badge" style={{ background: c.isActive ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: c.isActive ? '#34d399' : '#ef4444' }}>
                                {c.isActive ? 'Active' : 'Ended'}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="icon-only" onClick={() => setEditingContest(c)}><Edit size={14} /></button>
                                <button className="icon-only delete" onClick={() => handleDelete('contest', c._id)}><Trash2 size={14} /></button>
                            </div>
                        </div>
                        <h3 style={{ margin: '0.75rem 0 0.5rem 0' }}>{c.title}</h3>
                        <div className="exam-meta">
                            <span><Timer size={12} /> {c.durationMinutes}m</span>
                            <span><Users size={12} /> {c.participants?.length || 0} Joined</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.4, marginTop: '0.5rem' }}>
                            Starts: {new Date(c.startTime).toLocaleString()}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.75rem' }}>
                            <span className="badge" style={{ background: 'rgba(99,102,241,0.05)', color: '#818cf8', fontSize: '0.65rem' }}>{c.contestType || 'special'}</span>
                            {c.tags?.map((tag, idx) => (
                                <span key={idx} className="badge" style={{ background: 'rgba(52, 211, 153, 0.05)', color: '#34d399', fontSize: '0.65rem' }}>{tag}</span>
                            ))}
                        </div>
                    </div>
                ))}
                {contests.length === 0 && <div className="placeholder-text">No contests scheduled yet.</div>}
            </div>
        </div>
    );

    const handleCreateNotification = async () => {
        if (!newNotification.title || !newNotification.message) return alert('Title and message required');
        try {
            await axios.post(getApiUrl('/api/admin/notifications'), newNotification, authConfig());
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
            </div>
        );
    }

    return (
        <div className="pro-admin-layout animate-fade-in">
            <div className="bg-blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>
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
                        { id: 'contests', label: 'Contests', Icon: Trophy },
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
                    <Loader text="Accessing Administrative Control Center..." />
                ) : (
                    <>
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'domains' && renderDomainsView()}
                        {activeTab === 'users' && renderUsersView()}
                        {activeTab === 'exams' && renderExamsView()}
                        {activeTab === 'tutorials' && renderTutorialsView()}
                        {activeTab === 'contests' && renderContestsView()}
                        {activeTab === 'notifications' && renderNotificationsView()}
                        {activeTab === 'results' && renderExamResultsView()}
                        {activeTab === 'interviews' && renderInterviewsView()}
                        {activeTab === 'corecs' && (
                            <div style={{ height: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column' }}>
                                <CoreCSManager
                                    coreCSTopics={coreCSTopics}
                                    onTopicsRefresh={async () => {
                                        const res = await axios.get(getApiUrl('/api/admin/corecs'), authConfig());
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

            {editingContest && (
                <ContestEditorModal
                    contest={editingContest}
                    onSave={saveContest}
                    onAIUpload={handleContestAIUpload}
                    structuring={structuring}
                    onClose={() => setEditingContest(null)}
                />
            )}

            {editingTutorial && (
                <TutorialEditorModal
                    tutorial={editingTutorial}
                    onSave={saveTutorial}
                    onClose={() => setEditingTutorial(null)}
                />
            )}

            {selectedUserDetails && (
                <UserDetailModal
                    user={selectedUserDetails}
                    onClose={() => setSelectedUserDetails(null)}
                />
            )}

            {selectedInterview && (
                <InterviewDetailModal
                    interview={selectedInterview}
                    onClose={() => setSelectedInterview(null)}
                />
            )}

            {showAddUserModal && (
                <AddUserModal
                    user={newUser}
                    onChange={setNewUser}
                    onSave={handleCreateUser}
                    onClose={() => setShowAddUserModal(false)}
                    saving={creatingUser}
                />
            )}
        </div>
    );
};


export default AdminDashboard;
