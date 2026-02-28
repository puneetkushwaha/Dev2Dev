import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import Loader from '../components/Loader';
import './ResumeAnalyzer.css';

const ResumeAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [targetRole, setTargetRole] = useState('Software Engineer');

    const handleUpload = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setIsAnalyzing(true);
            setResult(null);

            try {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const parseResponse = await fetch(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/parse-resume`, {
                    method: 'POST',
                    body: formData,
                });

                if (!parseResponse.ok) throw new Error('Failed to parse resume');
                const { text } = await parseResponse.json();

                const analyzeResponse = await fetch(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/users/analyze-resume`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ resume_text: text, target_role: targetRole }),
                });

                if (!analyzeResponse.ok) throw new Error('Failed to analyze resume');
                const analysisResult = await analyzeResponse.json();
                setResult(analysisResult);
            } catch (error) {
                console.error("Analysis Error:", error);
                alert("Analysis failed. Please try again.");
            } finally {
                setIsAnalyzing(false);
            }
        }
    };

    return (
        <div className="resume-analyzer-container animate-fade-in">
            <h1 style={{ marginBottom: '1rem', textAlign: 'center' }}>AI Resume Analyzer</h1>
            <p className="text-muted" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                Upload your resume to get instant feedback from Dev2Dev AI, identify skill gaps, and generate customized interview questions.
            </p>

            {!result && !isAnalyzing && (
                <div style={{ marginBottom: '2rem' }}>
                    <div className="card glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <h4 style={{ marginBottom: '1rem' }}>Target Job Role</h4>
                        <input
                            type="text"
                            className="form-input"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            placeholder="e.g., Software Engineer, Data Scientist, DevOps"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                color: '#fff',
                                fontSize: '1.1rem'
                            }}
                        />
                        <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                            ATS score will be calculated based on this specific role.
                        </p>
                    </div>

                    <div className="card glass-panel flex-center" style={{ flexDirection: 'column', height: '300px', border: '2px dashed var(--border-color)', background: 'rgba(99, 102, 241, 0.05)', textAlign: 'center' }}>
                        <UploadCloud size={64} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Drag & Drop your Resume</h3>
                        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>PDF, DOCX formats supported</p>
                        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                            <span>Browse Files</span>
                            <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} style={{ display: 'none' }} />
                        </label>
                    </div>
                </div>
            )}

            {isAnalyzing && (
                <Loader text="Dev2Dev AI is Analyzing your Resume..." />
            )}

            {result && (
                <div className="card glass-panel analysis-results-card">
                    <div className="analysis-header">
                        <div className="analysis-header-left">
                            <FileText size={32} color="var(--accent-primary)" />
                            <div>
                                <h3 style={{ margin: 0 }}>{file?.name}</h3>
                                <span className="text-muted">Analysis Complete</span>
                            </div>
                        </div>
                        <div className="analysis-score-container">
                            <div className="analysis-score">{result.score}/100</div>
                            <span className="text-muted">ATS Compatibility</span>
                        </div>
                    </div>

                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
                        <AlertTriangle size={20} /> Suggested Improvements
                    </h3>
                    <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                        {result.improvements.map((imp, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{imp}</li>)}
                    </ul>

                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
                        <CheckCircle size={20} /> Generated Interview Questions
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {result.generatedQuestions.map((q, i) => (
                            <div key={i} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-primary)' }}>
                                {q}
                            </div>
                        ))}
                    </div>

                    <button className="btn btn-outline" onClick={() => { setResult(null); setFile(null); }} style={{ marginTop: '2rem', width: '100%' }}>
                        Analyze Another Resume
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResumeAnalyzer;
