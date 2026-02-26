import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PlayCircle, Code2, UserCheck, FileText, Search, Linkedin, Twitter, MessageSquare, ExternalLink } from 'lucide-react';
import './Landing.css';

const Landing = () => {
    const [domain, setDomain] = React.useState('');
    const [roadmap, setRoadmap] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (domain.trim()) {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_AI_URL || 'http://127.0.0.1:8000'}/generate_roadmap`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ domain })
                });
                const data = await response.json();
                setRoadmap(data.roadmap);
                setTimeout(() => {
                    const roadmapEl = document.getElementById('roadmap-result');
                    if (roadmapEl) roadmapEl.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            } catch (err) {
                console.error("Error generating roadmap:", err);
            } finally {
                setLoading(false);
            }
        }
    };


    return (
        <div className="landing-container">
            <Helmet>
                <title>Dev2Dev | Master Industry-Standard DSA Challenges</title>
                <meta name="description" content="The ultimate platform for Dev2DevD@D pioneers. Master DSA challenges aligned with top industry standards like LeetCode and GeeksForGeeks." />
            </Helmet>
            {/* Minimal Brand-Aligned Navbar - Cylinder Shape */}
            <nav className="minimal-nav">
                <div className="nav-left">
                    <Link to="/" className="logo-link">
                        <img src="/logo.png" alt="Dev2Dev logo" />
                    </Link>
                </div>

                <div className="nav-center">
                    <Link to="/features" className="nav-item">Features</Link>
                    <Link to="/pricing" className="nav-item">Pricing</Link>
                    <Link to="/about" className="nav-item">About</Link>
                </div>

                <div className="nav-right">
                    <Link to={isAuthenticated ? "/dashboard" : "/login"} className="btn-auth-nav">
                        {isAuthenticated ? 'Dashboard' : 'Start Now'}
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="landing-main">
                {/* Hero Grid - Professional Proportions */}
                <section className="hero-grid">
                    <div className="hero-left">
                        <h1 className="hero-title">
                            Build Your <span className="highlight-brand">Work.</span><br />
                            Master <span className="highlight-brand">Standardized DSA.</span>
                        </h1>
                        <p className="hero-subtitle">
                            Dev2Dev is an ecosystem precision-engineered for the modern tech pioneer. Prepare with AI-driven benchmarks, practice with battle-tested GFG and LeetCode environments, and architect your own career path.
                        </p>
                        <div className="hero-actions">
                            <Link to="/register" className="btn-brand-primary">Join the D@D community</Link>
                            <button className="btn-dark-outline"><PlayCircle size={18} style={{ marginRight: '0.5rem' }} /> Watch Demo</button>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="landing-terminal">
                            <div className="terminal-header">
                                <div className="terminal-dots">
                                    <div className="dot red"></div>
                                    <div className="dot yellow"></div>
                                    <div className="dot green"></div>
                                </div>
                                <div className="terminal-title">Dev2Dev-bash</div>
                            </div>
                            <div className="terminal-body">
                                <div className="code-line"><span className="code-dim">$</span> Dev2Dev initiate</div>
                                <div className="code-line"><span className="code-green">✓</span> System Kernel Loaded</div>
                                <div className="code-line"><span className="code-purple">&gt;&gt;</span> Benchmarking AI Logic... <span className="code-indigo">94%</span></div>
                                <div className="code-line"><span className="code-purple">&gt;&gt;</span> Deploying Execution Roadmap</div>
                                <div className="code-line"><span className="code-dim">$</span> <span className="cursor"></span></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Metrics Row REVOEMD AS REQUESTED */}

                {/* Features Section */}
                <section id="features" className="features-section">
                    <div className="feature-box">
                        <div className="icon-wrapper"><Code2 size={24} /></div>
                        <h3>Standardized DSA Practice</h3>
                        <p>Aggressive practice environment with curated, industry-standard problems for technical optimization.</p>
                    </div>
                    <div className="feature-box">
                        <div className="icon-wrapper"><UserCheck size={24} /></div>
                        <h3>Mock AI Interviews</h3>
                        <p>Realistic technical simulations with immediate scoring and behavioral analytics for top tech giants.</p>
                    </div>
                    <div className="feature-box">
                        <div className="icon-wrapper"><FileText size={24} /></div>
                        <h3>ATS Engine & Resume Analytics</h3>
                        <p>Analyze and optimize your resume with precision keyword injection to beat the filters of top MNCs.</p>
                    </div>
                </section>

                {/* AI Roadmap Section */}
                <section id="roadmap" className="roadmap-generator-section">
                    <div className="roadmap-header">
                        <h2>Architect Your Future</h2>
                        <p>Tell our engine your target role, and we'll generate a comprehensive execution strategy.</p>
                    </div>

                    <form onSubmit={handleGenerate} className="search-container">
                        <div className="search-input-group">
                            <Search size={20} color="#444" style={{ margin: 'auto 1rem' }} />
                            <input
                                type="text"
                                placeholder="E.g., Senior Fullstack Engineer, Data Scientist..."
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                            />
                            <button type="submit" className="btn-architect" disabled={loading}>
                                {loading ? 'Architecting...' : 'Architect Path'}
                            </button>
                        </div>
                    </form>

                    {roadmap && (
                        <div id="roadmap-result" className="roadmap-container animate-slide-up">
                            <div className="timeline-wrapper" style={{ borderLeft: '1px solid #222', paddingLeft: '2rem', textAlign: 'left', maxWidth: '850px', margin: '0 auto' }}>
                                {roadmap.map((step, idx) => (
                                    <div key={idx} className="timeline-item" style={{ marginBottom: '2.5rem', position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '-2.65rem', width: '16px', height: '16px', background: 'var(--brand-purple)', borderRadius: '50%', border: '4px solid var(--bg-black)' }}></div>
                                        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--brand-purple)' }}>{step.phase}</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                <div className="final-cta">
                    <Link to={isAuthenticated ? "/dashboard" : "/register"} className="btn-journey">
                        Initiate Your Path
                    </Link>
                </div>
            </main>

            {/* Refined Multi-Column Footer */}
            <footer className="minimal-footer">
                <div className="footer-grid">
                    <div className="footer-col-brand">
                        <div className="footer-logo-container">
                            <img src="/logo.png" alt="Dev2Dev logo" className="footer-logo" />
                            <span className="footer-brand-text">Dev2Dev</span>
                        </div>
                        <p className="footer-tagline">
                            Architecting the next generation of tech pioneers with AI-driven execution paths and battle-tested environments.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4>Ecosystem</h4>
                        <ul className="footer-links-list">
                            <li><Link to="/features">Global Features</Link></li>
                            <li><Link to="/pricing">Pricing Plans</Link></li>
                            <li><a href="#features">DSA Practice</a></li>
                            <li><a href="#features">Mock Interviews</a></li>
                            <li><Link to="/resume">ATS Engine</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Resources</h4>
                        <ul className="footer-links-list">
                            <li><a href="https://pportfolio-rho.vercel.app/">Personal Portfolio</a></li>
                            <li><Link to="/onboarding">Roadmap Generator</Link></li>
                            <li><Link to="/tutorials">Video Tutorials</Link></li>
                            <li><Link to="/interview-prep">Interview Protocols</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Connect</h4>
                        <ul className="footer-links-list">
                            <li><a href="https://www.linkedin.com/in/puneettkushwaha/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                            <li><a href="https://whatsapp.com/channel/0029VbC2eE14o7qJbehrrY1j" target="_blank" rel="noopener noreferrer">WhatsApp Channel</a></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><a href="mailto:contact@dev2dev.online">Contact Email</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 Dev2Dev Engine. Precision-engineered for Pioneers.</p>
                    <div className="footer-socials">
                        <a href="https://www.linkedin.com/in/puneettkushwaha/" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="LinkedIn">
                            <Linkedin size={18} />
                        </a>
                        <a href="https://whatsapp.com/channel/0029VbC2eE14o7qJbehrrY1j" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="WhatsApp Channel">
                            <MessageSquare size={18} />
                        </a>
                        <a href="https://pportfolio-rho.vercel.app/" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Personal Portfolio">
                            <ExternalLink size={18} />
                        </a>
                        <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="X (Twitter)">
                            <Twitter size={18} />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
