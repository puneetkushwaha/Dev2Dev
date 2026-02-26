import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
            <style>{`
                .qe-root { display: flex; flex-direction: column; gap: 0.75rem; }
                .qe-header { display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem; font-weight: 800; opacity: 0.4; text-transform: uppercase; }
                .qe-list { display: flex; flex-direction: column; gap: 1rem; }
                .qe-q-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 0.85rem; }
                .qe-q-row { display: flex; gap: 0.75rem; align-items: flex-start; margin-bottom: 0.75rem; }
                .qe-num { font-size: 0.7rem; font-weight: 800; background: rgba(255,255,255,0.05); width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 4px; opacity: 0.4; }
                .qe-input { flex: 1; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.1); color: #fff; font-size: 0.85rem; outline: none; padding-bottom: 0.2rem; }
                .qe-input:focus { border-bottom-color: #6366f1; }
                .qe-del { background: transparent; border: none; color: rgba(239,68,68,0.4); cursor: pointer; transition: 0.15s; }
                .qe-del:hover { color: #f87171; }
                .qe-opts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
                .qe-opt { display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.03); padding: 0.4rem 0.6rem; border-radius: 6px; border: 1px solid transparent; }
                .qe-opt.on { border-color: rgba(52,211,153,0.3); background: rgba(52,211,153,0.05); }
                .qe-opt-input { flex: 1; background: transparent; border: none; color: rgba(255,255,255,0.8); font-size: 0.78rem; outline: none; }
            `}</style>
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
            <style>{`
                .pe-tabs { display: flex; gap: 0.5rem; margin-right: auto; }
                .pe-tab-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.4); padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: 0.15s; }
                .pe-tab-btn:hover { background: rgba(255,255,255,0.06); }
                .pe-tab-btn.on { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); color: #818cf8; }
            `}</style>
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

    // ── Get Core CS domainId
    const getCoreCSdomainId = async () => {
        const existing = coreCSTopics[0];
        if (existing?.domainId) return existing.domainId;
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/domains`, authConfig());
        const d = res.data.find(d => d.name === 'Core Computer Science' || d.name === 'CoreCS');
        if (!d) throw new Error('Core Computer Science domain not found.\nRun: node seedCoreCS.js');
        return d._id;
    };

    // ── Create a new topicGroup (no DB record, just UI state — actual topics created inside)
    const createTopic = async () => {
        const name = newTopicName.trim();
        if (!name) return;
        setNewTopicName('');
        setAddingTopic(false);
        setSelectedTopic(name); // Switch to it immediately
    };

    // ── Add a problem inside selected topic
    const addProblem = async () => {
        if (!selectedTopic) return;
        try {
            const domainId = await getCoreCSdomainId();
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/topics`, {
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
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/topics/${data._id}`, data, authConfig());
            await onTopicsRefresh();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    const deleteProblem = async (id) => {
        if (!window.confirm('Delete this problem?')) return;
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/topics/${id}`, authConfig());
        setSelectedProbId(null);
        await onTopicsRefresh();
    };

    const deleteTopic = async (topicName) => {
        const probs = subjTopics.filter(t => t.topicGroup === topicName);
        if (!window.confirm(`Delete topic "${topicName}" and its ${probs.length} problem(s)?`)) return;
        for (const p of probs) {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/topics/${p._id}`, authConfig());
        }
        setSelectedTopic(null);
        await onTopicsRefresh();
    };

    return (
        <div className="cs-root">
            {/* Subject tabs */}
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
                {/* ── Col 1: Topics (topic groups) */}
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
                        {topicGroups.length === 0 && !addingTopic && (
                            <div className="cs-empty">
                                <FolderOpen size={26} style={{ opacity: 0.1 }} />
                                <p>No topics yet</p>
                                <button className="cs-add-first" onClick={() => setAddingTopic(true)}>+ Create first topic</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Col 2: Problems in selected topic */}
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
                                {problems.length === 0 && (
                                    <div className="cs-empty">
                                        <Code size={22} style={{ opacity: 0.1 }} />
                                        <p>No problems yet</p>
                                        <button className="cs-add-first" onClick={addProblem}>+ Add first problem</button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="cs-no-sel">
                            <FolderOpen size={32} style={{ opacity: 0.06 }} />
                            <p>Select a topic</p>
                        </div>
                    )}
                </div>

                {/* ── Col 3: Topic editor */}
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

            <style>{`
                .cs-root { display: flex; flex-direction: column; height: calc(100vh - 90px); background: #09090e; font-family: inherit; }

                /* Subject tab bar */
                .cs-tab-bar { display: flex; gap: 0.3rem; padding: 0.65rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.05); flex-shrink: 0; }
                .cs-tab { display: flex; align-items: center; gap: 0.45rem; background: transparent; border: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.38); padding: 0.4rem 0.85rem; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.8rem; transition: 0.15s; }
                .cs-tab:hover { color: rgba(255,255,255,0.75); }
                .cs-tab.on { background: rgba(255,255,255,0.04); }
                .cs-count { background: rgba(255,255,255,0.06); border-radius: 100px; padding: 0.05rem 0.4rem; font-size: 0.6rem; }

                /* 3-col body */
                .cs-body { display: grid; grid-template-columns: 220px 240px 1fr; flex: 1; overflow: hidden; }
                .cs-col { display: flex; flex-direction: column; border-right: 1px solid rgba(255,255,255,0.05); overflow: hidden; }
                .cs-editor-col { border-right: none; }

                /* Col headers */
                .cs-col-head { display: flex; align-items: center; justify-content: space-between; padding: 0.8rem 0.9rem; border-bottom: 1px solid rgba(255,255,255,0.04); flex-shrink: 0; }
                .cs-col-label { font-size: 0.68rem; font-weight: 800; opacity: 0.3; text-transform: uppercase; letter-spacing: 0.7px; }

                /* Buttons */
                .cs-mini-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.4); width: 22px; height: 22px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: 0.15s; font-size: 0.75rem; }
                .cs-mini-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
                .cs-mini-btn.ok { color: #34d399; border-color: rgba(52,211,153,0.25); }

                /* New topic input */
                .cs-new-input-wrap { display: flex; gap: 0.3rem; padding: 0.5rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.04); flex-shrink: 0; }
                .cs-new-input { flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(99,102,241,0.3); color: #fff; padding: 0.3rem 0.6rem; border-radius: 6px; outline: none; font-size: 0.8rem; font-family: inherit; }

                /* List scroll */
                .cs-list-scroll { flex: 1; overflow-y: auto; padding: 0.4rem; }

                /* Topic item */
                .cs-topic-item { display: flex; align-items: center; gap: 0.55rem; width: 100%; color: rgba(255,255,255,0.55); padding: 0.6rem 0.65rem; border-radius: 8px; cursor: pointer; transition: 0.12s; }
                .cs-topic-item:hover { background: rgba(255,255,255,0.03); color: #fff; }
                .cs-topic-item.on { background: rgba(99,102,241,0.1); color: #fff; }
                .cs-ti-info { display: flex; flex-direction: column; min-width: 0; line-height: 1.3; }
                .cs-ti-name { font-size: 0.82rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 130px; }
                .cs-ti-cnt { font-size: 0.62rem; opacity: 0.4; }
                .cs-del-tiny { margin-left: auto; background: transparent; border: none; color: rgba(239,68,68,0.0); padding: 0.2rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; transition: 0.15s; flex-shrink: 0; }
                .cs-topic-item:hover .cs-del-tiny { color: rgba(239,68,68,0.4); }
                .cs-del-tiny:hover { color: #f87171 !important; background: rgba(239,68,68,0.08); }

                /* Problem item */
                .cs-prob-item { display: flex; align-items: center; gap: 0.6rem; width: 100%; background: transparent; border: none; color: rgba(255,255,255,0.55); padding: 0.6rem 0.65rem; border-radius: 8px; cursor: pointer; text-align: left; transition: 0.12s; }
                .cs-prob-item:hover { background: rgba(255,255,255,0.03); color: #fff; }
                .cs-prob-item.on { background: rgba(99,102,241,0.09); color: #fff; }
                .cs-pi-num { font-size: 0.6rem; opacity: 0.2; font-weight: 700; width: 16px; flex-shrink: 0; }
                .cs-pi-info { display: flex; flex-direction: column; line-height: 1.3; min-width: 0; }
                .cs-pi-title { font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
                .cs-pi-diff { font-size: 0.62rem; font-weight: 700; }

                /* Empty / no-sel */
                .cs-empty { display: flex; flex-direction: column; align-items: center; gap: 0.65rem; padding: 2.5rem 1rem; text-align: center; opacity: 0.35; }
                .cs-empty p { font-size: 0.78rem; }
                .cs-add-first { background: transparent; border: none; color: #818cf8; cursor: pointer; font-size: 0.78rem; font-weight: 600; }
                .cs-no-sel { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.7rem; opacity: 0.25; }
                .cs-no-sel p { font-size: 0.82rem; }

                /* Problem editor */
                .pe-root { display: flex; flex-direction: column; height: 100%; }
                .pe-header { padding: 0.9rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.05); flex-shrink: 0; display: flex; flex-direction: column; gap: 0.65rem; }
                .pe-title-row { display: flex; align-items: center; gap: 0.85rem; }
                .pe-title-input { flex: 1; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.08); color: #fff; font-size: 1.05rem; font-weight: 700; padding: 0.2rem 0; outline: none; font-family: inherit; }
                .pe-title-input:focus { border-bottom-color: #6366f1; }
                .pe-meta-selects { display: flex; gap: 0.4rem; flex-shrink: 0; }
                .pe-select { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); padding: 0.3rem 0.5rem; border-radius: 7px; font-weight: 700; font-size: 0.75rem; outline: none; cursor: pointer; color: #e2e8f0; }
                .pe-actions { display: flex; align-items: center; justify-content: flex-end; gap: 0.4rem; }
                .pe-save-btn { background: rgba(129, 140, 248,0.1); border: 1px solid rgba(129, 140, 248,0.25); color: #34d399; padding: 0.4rem 0.85rem; border-radius: 7px; font-weight: 700; display: flex; align-items: center; gap: 0.35rem; cursor: pointer; font-size: 0.78rem; }
                .pe-save-btn:hover { background: rgba(129, 140, 248,0.18); }
                .pe-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .pe-del-btn { background: transparent; border: 1px solid rgba(239,68,68,0.15); color: rgba(239,68,68,0.5); padding: 0.4rem 0.75rem; border-radius: 7px; font-weight: 600; display: flex; align-items: center; gap: 0.3rem; cursor: pointer; font-size: 0.76rem; }
                .pe-del-btn:hover { color: #f87171; background: rgba(239,68,68,0.06); }
                .pe-spin { animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .pe-body { flex: 1; overflow-y: auto; padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
                .pe-section { display: flex; flex-direction: column; gap: 0.35rem; }
                .pe-section-label { font-size: 0.62rem; font-weight: 700; opacity: 0.3; text-transform: uppercase; letter-spacing: 0.7px; display: flex; align-items: center; gap: 0.3rem; }
                .pe-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }
                .pe-section input, .pe-section textarea {
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
                    padding: 0.55rem 0.75rem; border-radius: 9px; color: #e2e8f0; outline: none;
                    font-family: inherit; font-size: 0.845rem; line-height: 1.6; width: 100%; resize: vertical; transition: border-color 0.15s;
                }
                .pe-section input:focus, .pe-section textarea:focus { border-color: rgba(99,102,241,0.45); }
                .pe-section textarea.mono, .pe-section input.mono { font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; }
                select option { background: #1a1a2e; }
            `}</style>
        </div>
    );
};

export default CoreCSManager;
