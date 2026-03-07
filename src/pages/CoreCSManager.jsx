import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../api/config';
import './CoreCSManager.css';
import {
    Plus, Trash2, Save, Loader2, Code,
    ChevronRight, Cpu, Database, Globe, Layers, GitBranch,
    Tag, AlignLeft, Terminal, CheckSquare, FolderOpen, Folder
} from 'lucide-react';

const authConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const SUBJECTS = [
    { id: 'DSA', label: 'DSA', desc: 'Data Structures & Algorithms', Icon: GitBranch, color: '#818cf8' },
    { id: 'OS', label: 'OS', desc: 'Operating Systems', Icon: Cpu, color: '#fbbf24' },
    { id: 'DBMS', label: 'DBMS', desc: 'Database Management', Icon: Database, color: '#34d399' },
    { id: 'CN', label: 'CN', desc: 'Computer Networks', Icon: Globe, color: '#60a5fa' },
    { id: 'OOP', label: 'OOP', desc: 'Object Oriented Programming', Icon: Layers, color: '#f472b6' },
];

const DIFF_COLOR = { Easy: '#34d399', Medium: '#fbbf24', Hard: '#f87171' };

// ─── Quiz Editor for Core CS
const QuizEditor = ({ quiz = [], onChange }) => {
    const addQ = () => onChange([...quiz, { q: 'New Question', options: ['', '', '', ''], ans: 0 }]);
    const updateQ = (i, f, v) => {
        const n = [...quiz];
        n[i] = { ...n[i], [f]: v };
        onChange(n);
    };
    const updateOpt = (qi, oi, v) => {
        const n = [...quiz];
        const opts = [...n[qi].options];
        opts[oi] = v;
        n[qi] = { ...n[qi], options: opts };
        onChange(n);
    };
    const removeQ = (i) => onChange(quiz.filter((_, idx) => idx !== i));

    return (
        <div className="qe-root">
            <div className="qe-header">
                <span>Quiz Questions ({quiz.length})</span>
                <button className="cs-mini-btn" onClick={addQ}><Plus size={12} /> Add Question</button>
            </div>
            <div className="qe-list">
                {quiz.map((q, i) => (
                    <div key={i} className="qe-q-card">
                        <div className="qe-q-row">
                            <span className="qe-num">{i + 1}</span>
                            <input className="qe-input" value={q.q} onChange={e => updateQ(i, 'q', e.target.value)} placeholder="Question text..." />
                            <button className="qe-del" onClick={() => removeQ(i)}><Trash2 size={12} /></button>
                        </div>
                        <div className="qe-opts-grid">
                            {q.options.map((opt, oi) => (
                                <div key={oi} className={`qe-opt ${q.ans === oi ? 'on' : ''}`}>
                                    <input type="radio" checked={q.ans === oi} onChange={() => updateQ(i, 'ans', oi)} />
                                    <input className="qe-opt-input" value={opt} onChange={e => updateOpt(i, oi, e.target.value)} placeholder={`Option ${oi + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Topic Editor (handles both Theory and Practice)
const TopicEditor = ({ topic, onSave, onDelete }) => {
    const [d, setD] = useState(topic);
    const [tab, setTab] = useState(topic.lessonType === 'theory' ? 'theory' : 'practice');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setD(topic);
        setTab(topic.lessonType === 'theory' ? 'theory' : 'practice');
    }, [topic._id]);

    const set = (k, v) => setD(p => ({ ...p, [k]: v }));
    const setC = (k, v) => setD(p => ({ ...p, content: { ...(p.content || {}), [k]: v } }));
    const save = async () => { setSaving(true); await onSave(d); setSaving(false); };

    return (
        <div className="pe-root">
            <div className="pe-header">
                <div className="pe-title-row">
                    <input className="pe-title-input" value={d.title} onChange={e => set('title', e.target.value)} placeholder="Topic title..." />
                    <div className="pe-meta-selects">
                        <select value={d.lessonType} onChange={e => set('lessonType', e.target.value)} className="pe-select">
                            <option value="theory">Theory</option><option value="practice">Practice</option>
                        </select>
                        <select value={d.difficulty} onChange={e => set('difficulty', e.target.value)} style={{ color: DIFF_COLOR[d.difficulty] }} className="pe-select">
                            <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>
                <div className="pe-actions">
                    <div className="pe-tabs">
                        <button className={`pe-tab-btn ${tab === 'theory' ? 'on' : ''}`} onClick={() => setTab('theory')}>Theory</button>
                        <button className={`pe-tab-btn ${tab === 'practice' ? 'on' : ''}`} onClick={() => setTab('practice')}>Practice</button>
                        <button className={`pe-tab-btn ${tab === 'quiz' ? 'on' : ''}`} onClick={() => setTab('quiz')}>Quiz</button>
                    </div>
                    <button className="pe-del-btn" onClick={() => onDelete(d._id)}><Trash2 size={14} /> Delete</button>
                    <button className="pe-save-btn" onClick={save} disabled={saving}>
                        {saving ? <Loader2 size={14} className="pe-spin" /> : <Save size={14} />}
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
            <div className="pe-body">
                {tab === 'theory' && (
                    <div className="pe-section">
                        <div className="pe-section-label"><AlignLeft size={13} /> Detailed Explanation (Markdown)</div>
                        <textarea value={d.content?.explanation || ''} onChange={e => setC('explanation', e.target.value)} rows={20} placeholder="### Introduction..." />
                    </div>
                )}
                {tab === 'practice' && (
                    <>
                        <div className="pe-section">
                            <div className="pe-section-label"><AlignLeft size={13} /> Problem Statement</div>
                            <textarea value={d.content?.problemStatement || ''} onChange={e => setC('problemStatement', e.target.value)} rows={7} placeholder="Given an array of integers..." />
                        </div>
                        <div className="pe-row">
                            <div className="pe-section">
                                <div className="pe-section-label"><AlignLeft size={13} /> Input Format</div>
                                <textarea value={d.content?.inputFormat || ''} onChange={e => setC('inputFormat', e.target.value)} rows={3} placeholder="Line 1: N" />
                            </div>
                            <div className="pe-section">
                                <div className="pe-section-label"><AlignLeft size={13} /> Output Format</div>
                                <textarea value={d.content?.outputFormat || ''} onChange={e => setC('outputFormat', e.target.value)} rows={3} placeholder="Print the answer." />
                            </div>
                        </div>
                        <div className="pe-section">
                            <div className="pe-section-label"><Code size={13} /> Starter Code</div>
                            <textarea value={d.content?.starterCode || ''} onChange={e => setC('starterCode', e.target.value)} rows={6} className="mono" placeholder="function solve() { }" />
                        </div>
                    </>
                )}
                {tab === 'quiz' && (
                    <QuizEditor quiz={d.quiz} onChange={q => set('quiz', q)} />
                )}
            </div>
        </div>
    );
};

// ─── Main CoreCSManager
const CoreCSManager = ({ coreCSTopics, onTopicsRefresh }) => {
    const [activeSubject, setActiveSubject] = useState('DSA');
    const [selectedTopic, setSelectedTopic] = useState(null);   // topicGroup name
    const [selectedProbId, setSelectedProbId] = useState(null); // problem _id
    const [newTopicName, setNewTopicName] = useState('');
    const [addingTopic, setAddingTopic] = useState(false);

    const subjMeta = SUBJECTS.find(s => s.id === activeSubject);

    // All topics for this subject
    const subjTopics = coreCSTopics.filter(t => t.subject === activeSubject);

    // Unique topicGroups in this subject
    const topicGroups = [...new Set(subjTopics.map(t => t.topicGroup).filter(Boolean))];

    // Problems in selected topic
    const problems = selectedTopic
        ? subjTopics.filter(t => t.topicGroup === selectedTopic)
        : [];

    const selectedProb = problems.find(p => p._id === selectedProbId);

    // Reset when subject changes
    useEffect(() => { setSelectedTopic(null); setSelectedProbId(null); }, [activeSubject]);
    // Reset problem when topic changes
    useEffect(() => { setSelectedProbId(null); }, [selectedTopic]);

    const getCoreCSdomainId = async () => {
        const existing = coreCSTopics[0];
        if (existing?.domainId) return existing.domainId;
        const res = await axios.get(getApiUrl('/api/admin/domains'), authConfig());
        const d = res.data.find(d => d.name === 'Core Computer Science' || d.name === 'CoreCS');
        if (!d) throw new Error('Core Computer Science domain not found.\nRun: node seedCoreCS.js');
        return d._id;
    };

    const createTopic = async () => {
        const name = newTopicName.trim();
        if (!name) return;
        setNewTopicName('');
        setAddingTopic(false);
        setSelectedTopic(name);
    };

    const addProblem = async () => {
        if (!selectedTopic) return;
        try {
            const domainId = await getCoreCSdomainId();
            const res = await axios.post(getApiUrl('/api/admin/topics'), {
                domainId,
                isCoreCS: true,
                subject: activeSubject,
                topicGroup: selectedTopic,
                title: `New ${selectedTopic} Problem`,
                level: 'Beginner',
                difficulty: 'Easy',
                lessonType: 'practice',
                content: {},
                quiz: []
            }, authConfig());
            await onTopicsRefresh();
            setSelectedProbId(res.data._id);
        } catch (err) { alert(err.message || err.response?.data?.message); }
    };

    const saveProblem = async (data) => {
        try {
            await axios.put(getApiUrl(`/api/admin/topics/${data._id}`), data, authConfig());
            await onTopicsRefresh();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    const deleteProblem = async (id) => {
        if (!window.confirm('Delete this problem?')) return;
        await axios.delete(getApiUrl(`/api/admin/topics/${id}`), authConfig());
        setSelectedProbId(null);
        await onTopicsRefresh();
    };

    const deleteTopic = async (topicName) => {
        const probs = subjTopics.filter(t => t.topicGroup === topicName);
        if (!window.confirm(`Delete topic "${topicName}" and its ${probs.length} problem(s)?`)) return;
        for (const p of probs) {
            await axios.delete(getApiUrl(`/api/admin/topics/${p._id}`), authConfig());
        }
        setSelectedTopic(null);
        await onTopicsRefresh();
    };

    return (
        <div className="cs-root">
            <div className="cs-tab-bar">
                {SUBJECTS.map(({ id, label, Icon, color }) => (
                    <button key={id} className={`cs-tab ${activeSubject === id ? 'on' : ''}`}
                        style={activeSubject === id ? { borderColor: color, color } : {}}
                        onClick={() => setActiveSubject(id)}>
                        <Icon size={14} /><span>{label}</span>
                        <span className="cs-count">{coreCSTopics.filter(t => t.subject === id && t.topicGroup).length}</span>
                    </button>
                ))}
            </div>

            <div className="cs-body">
                <div className="cs-col cs-topics-col">
                    <div className="cs-col-head">
                        <span className="cs-col-label">{subjMeta?.desc}</span>
                        <button className="cs-mini-btn" onClick={() => setAddingTopic(true)} title="New Topic"><Plus size={13} /></button>
                    </div>

                    {addingTopic && (
                        <div className="cs-new-input-wrap">
                            <input
                                autoFocus
                                value={newTopicName}
                                onChange={e => setNewTopicName(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') createTopic(); if (e.key === 'Escape') setAddingTopic(false); }}
                                placeholder="e.g. Arrays, Trees..."
                                className="cs-new-input"
                            />
                            <button className="cs-mini-btn ok" onClick={createTopic}>✓</button>
                            <button className="cs-mini-btn" onClick={() => setAddingTopic(false)}>✕</button>
                        </div>
                    )}

                    <div className="cs-list-scroll">
                        {topicGroups.map(tg => {
                            const cnt = subjTopics.filter(t => t.topicGroup === tg).length;
                            const isOn = selectedTopic === tg;
                            return (
                                <div key={tg} className={`cs-topic-item ${isOn ? 'on' : ''}`} onClick={() => setSelectedTopic(tg)}>
                                    {isOn ? <FolderOpen size={14} style={{ opacity: 0.6 }} /> : <Folder size={14} style={{ opacity: 0.4 }} />}
                                    <div className="cs-ti-info">
                                        <span className="cs-ti-name">{tg}</span>
                                        <span className="cs-ti-cnt">{cnt} problem{cnt !== 1 ? 's' : ''}</span>
                                    </div>
                                    <button className="cs-del-tiny" onClick={e => { e.stopPropagation(); deleteTopic(tg); }} title="Delete topic">
                                        <Trash2 size={11} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="cs-col cs-probs-col">
                    {selectedTopic ? (
                        <>
                            <div className="cs-col-head">
                                <span className="cs-col-label">{selectedTopic}</span>
                                <button className="cs-mini-btn" onClick={addProblem} title="Add problem"><Plus size={13} /></button>
                            </div>
                            <div className="cs-list-scroll">
                                {problems.map((p, i) => (
                                    <button key={p._id} className={`cs-prob-item ${selectedProbId === p._id ? 'on' : ''}`} onClick={() => setSelectedProbId(p._id)}>
                                        <span className="cs-pi-num">{i + 1}</span>
                                        <div className="cs-pi-info">
                                            <span className="cs-pi-title">{p.title}</span>
                                            <span className="cs-pi-diff" style={{ color: DIFF_COLOR[p.difficulty] }}>{p.difficulty}</span>
                                        </div>
                                        <ChevronRight size={11} style={{ opacity: 0.2, marginLeft: 'auto', flexShrink: 0 }} />
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="cs-no-sel">
                            <FolderOpen size={32} style={{ opacity: 0.06 }} />
                            <p>Select a topic</p>
                        </div>
                    )}
                </div>

                <div className="cs-col cs-editor-col">
                    {selectedProb ? (
                        <TopicEditor key={selectedProb._id} topic={selectedProb} onSave={saveProblem} onDelete={deleteProblem} />
                    ) : (
                        <div className="cs-no-sel">
                            <Code size={36} style={{ opacity: 0.06 }} />
                            <p>{selectedTopic ? 'Select or add a problem' : 'Select a topic first'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoreCSManager;
