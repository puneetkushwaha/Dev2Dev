import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle, FileText, Clock } from 'lucide-react';

const MockReport = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // In a real app, we'd fetch this by ID if state isn't present
    const { report, timeSpent } = location.state || {};

    if (!report) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f3f4f6' }}>
                <h2>No report data found.</h2>
                <button onClick={() => navigate('/interview-prep')} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Go Back</button>
            </div>
        );
    }

    const formatTime = (seconds) => {
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${m} minutes ${s} seconds`;
    };

    const statusStyle = (passed) => {
        if (report.score === 0) return { color: '#666', bg: '#f3f4f6', text: 'Skipped' };
        return passed ? { color: '#818cf8', bg: '#d1fae5', text: 'Accepted' } : { color: '#ef4444', bg: '#fee2e2', text: 'Rejected' };
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                        onClick={() => navigate('/interview-prep')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'transparent', border: 'none', color: '#6b7280', fontSize: '0.9rem', cursor: 'pointer' }}
                    >
                        <ChevronLeft size={16} /> Return to My Overview
                    </button>
                    <div style={{ flex: 1 }}></div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#111827' }}>Reports</h1>
                <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: '0 0 2rem 0' }}>View detailed stats of your previous mock assessments</p>

                <div style={{ display: 'flex', gap: '2rem' }}>

                    {/* Left Sidebar - Past History Placeholder */}
                    <div style={{ width: '300px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', flexShrink: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', fontWeight: 600, color: '#374151' }}>
                            Past Mock Assessments
                        </div>
                        <div style={{ padding: '1rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', background: '#f9fafb', borderLeft: '3px solid #f59e0b' }}>
                            <div style={{ background: '#fef3c7', color: '#d97706', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <HelpCircle size={14} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#111827' }}>{report.examName}</div>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>Online Assessment</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{statusStyle(report.passed).text}</div>
                                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>Just now</div>
                            </div>
                        </div>
                    </div>

                    {/* Main Report Area */}
                    <div style={{ flex: 1, background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '2rem' }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: '#fef3c7', color: '#d97706', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <HelpCircle size={20} />
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>
                                    {report.examName} <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '1.25rem' }}>- Online Assessment</span>
                                </h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
                                    <span>{statusStyle(report.passed).text}</span>
                                    <span>•</span>
                                    <span>Today</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem', fontSize: '0.95rem', color: '#374151', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div><span style={{ color: '#6b7280', marginRight: '0.5rem' }}>Time Spent:</span> {formatTime(timeSpent)}</div>
                            <div><span style={{ color: '#6b7280', marginRight: '0.5rem' }}>Time Allotted:</span> 1 hour</div>
                        </div>

                        {/* Questions List */}
                        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                            {report.detailedAnalysis?.codingResults?.map((q, idx) => {
                                const didNotSubmit = !q.userAnswer || q.userAnswer.length < 20;

                                return (
                                    <div key={idx} style={{ padding: '1rem 0', display: 'flex', alignItems: 'flex-start', gap: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                                        <div style={{ marginTop: '0.2rem', color: '#9ca3af' }}>
                                            <FileText size={20} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: 600, color: '#111827', fontSize: '1rem' }}>{q.questionText || `Question ${idx + 1}`}</span>
                                                <span style={{
                                                    background: '#dcfce7', color: '#166534', fontSize: '0.7rem', fontWeight: 700,
                                                    padding: '0.1rem 0.4rem', borderRadius: '4px'
                                                }}>
                                                    EASY
                                                </span>
                                            </div>

                                            {didNotSubmit ? (
                                                <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>
                                                    Nothing was submitted for this question.
                                                </div>
                                            ) : (
                                                <div style={{ color: q.isCorrect ? '#818cf8' : '#ef4444', fontSize: '0.9rem', fontWeight: 500 }}>
                                                    {q.isCorrect ? 'Accepted' : 'Wrong Answer'}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ alignSelf: 'center' }}>
                                            <button style={{ color: '#3b82f6', background: 'transparent', border: 'none', fontSize: '0.9rem', cursor: 'pointer' }}>
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockReport;
