import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Code, UserCheck, FileText, ArrowRight, ArrowDown, Sparkles, Zap, Shield, Target } from 'lucide-react';
import './Features.css';

const Features = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const featureSteps = [
        {
            id: 'roadmap',
            icon: <Brain size={32} />,
            title: 'AI Roadmap Architect',
            description: 'Define your destination. Our neural engine generates a pixel-perfect execution strategy from where you are to where you want to be.',
            color: 'var(--brand-purple)',
            details: ['Custom Learning Paths', 'Skill Gap Analysis', 'Time-to-Ready Estimates']
        },
        {
            id: 'practice',
            icon: <Code size={32} />,
            title: 'Dynamic Practice Engine',
            description: 'Execute with precision. Battle-tested coding environments with real-time feedback and AI-driven optimization loops.',
            color: 'var(--brand-indigo)',
            details: ['Real-time Validation', 'Algorithmic Depth Analysis', 'Global Benchmarks']
        },
        {
            id: 'interview',
            icon: <UserCheck size={32} />,
            title: 'AI Interview Simulator',
            description: 'Face the pressure. Realistic technical simulations with immediate scoring, behavioral analytics, and deep-dive feedback.',
            color: '#818cf8',
            details: ['Voice & Code Analysis', 'Stressing Testing', 'Performance Scoring']
        },
        {
            id: 'ats',
            icon: <FileText size={32} />,
            title: 'Launch Optimizer',
            description: 'Finalize your entry. Precision keyword injection and resume refinement to bypass traditional filters and land the interview.',
            color: '#f59e0b',
            details: ['ATS Keyword Mapping', 'Format Validation', 'Impact Scoring']
        }
    ];

    return (
        <div className="features-container">
            <nav className="minimal-nav">
                <div className="nav-left">
                    <Link to="/" className="logo-link">
                        <img src="/logo.png" alt="Dev2Dev logo" style={{ height: '32px' }} />
                    </Link>
                </div>
                <div className="nav-right">
                    <Link to="/register" className="btn-auth-nav">Start Your Journey</Link>
                </div>
            </nav>

            <header className="features-header">
                <h1 className="glitch-text" data-text="The Dev2Dev Ecosystem">The Dev2Dev Ecosystem</h1>
                <p className="subtitle">From initial spark to final launch. A connected, AI-driven process for modern tech pioneers.</p>
            </header>

            <main className="features-flow-map">
                {featureSteps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <div className={`feature-node node-${index + 1}`}>
                            <div className="node-icon" style={{ borderColor: step.color, color: step.color }}>
                                {step.icon}
                                <div className="node-glow" style={{ background: step.color }}></div>
                            </div>
                            <div className="node-content">
                                <h2>{step.title}</h2>
                                <p>{step.description}</p>
                                <ul className="node-details">
                                    {step.details.map((detail, i) => (
                                        <li key={i}><Zap size={14} style={{ marginRight: '6px' }} /> {detail}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {index < featureSteps.length - 1 && (
                            <div className="flow-connector">
                                <div className="connector-line"></div>
                                <ArrowDown className="connector-arrow" size={24} />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </main>

            <footer className="features-footer">
                <div className="cta-box">
                    <Sparkles className="cta-icon" size={40} />
                    <h2>Ready to initiate?</h2>
                    <p>Stop guessing. Start executing with the Dev2Dev engine.</p>
                    <Link to="/register" className="btn-brand-primary">Join the Community</Link>
                </div>
            </footer>
        </div>
    );
};

export default Features;
