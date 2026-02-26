import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Zap, Shield, Target, ArrowRight, Sparkles } from 'lucide-react';
import './Pricing.css';

const Pricing = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const tiers = [
        {
            title: 'Tutorials',
            price: '₹69',
            period: 'Lifetime',
            description: 'Master the core subjects with professional, hands-on tutorials.',
            features: [
                'Full Access to All Domains',
                'Lifetime Updates',
                'Downloadable Resources',
                'Progress Tracking'
            ],
            btnText: 'Claim Lifetime Access',
            color: 'var(--brand-purple)',
            link: '/tutorials'
        },
        {
            title: 'AI Interview',
            price: '₹99',
            period: 'Per Year',
            description: 'Battle-test your skills against elite AI simulation models.',
            features: [
                '3 Free Trials Included',
                'Behavioral Analytics',
                'Technical Scoring',
                'Detailed Feedback Reports'
            ],
            btnText: 'Start Simulation',
            color: 'var(--brand-indigo)',
            link: '/interview',
            popular: true
        },
        {
            title: 'FANG DSA Practice',
            price: '₹49',
            period: 'Per Year',
            description: 'Crush the elite tech firm interviews with precision practice.',
            features: [
                'Advanced Standardized Patterns',
                'Complexity Analysis',
                'FAANG Specific Content',
                'Performance Benchmarking'
            ],
            btnText: 'Initiate Practice',
            color: '#818cf8',
            link: '/interview-prep'
        }
    ];

    return (
        <div className="pricing-page-container">
            <nav className="minimal-nav">
                <div className="nav-left">
                    <Link to="/" className="logo-link">
                        <img src="/logo.png" alt="Dev2Dev logo" style={{ height: '32px' }} />
                    </Link>
                </div>
                <div className="nav-right">
                    <Link to="/register" className="btn-auth-nav">Get Started</Link>
                </div>
            </nav>

            <header className="pricing-hero">
                <div className="hero-badge">Transparent Pricing</div>
                <h1>Invest in Your <span className="text-gradient">Career Future</span></h1>
                <p className="hero-desc">
                    Elite tactical tools for modern developers. No hidden fees, just pure execution potential.
                </p>
            </header>

            <main className="pricing-grid-main">
                {tiers.map((tier, idx) => (
                    <div key={idx} className={`pricing-card-v2 ${tier.popular ? 'popular' : ''}`}>
                        {tier.popular && <div className="popular-badge">Most Popular</div>}
                        <div className="card-top">
                            <h3 style={{ color: tier.color }}>{tier.title}</h3>
                            <div className="price-display">
                                <span className="amount">{tier.price}</span>
                                <span className="period">/ {tier.period}</span>
                            </div>
                            <p>{tier.description}</p>
                        </div>
                        <ul className="feature-list-v2">
                            {tier.features.map((f, i) => (
                                <li key={i}>
                                    <CheckCircle size={18} style={{ color: tier.color }} />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                        <Link
                            to={tier.link}
                            className="btn-tier-action"
                            style={{ background: tier.popular ? 'var(--brand-purple)' : 'rgba(255,255,255,0.05)' }}
                        >
                            {tier.btnText} <ArrowRight size={18} />
                        </Link>
                    </div>
                ))}
            </main>

            <footer className="simple-footer">
                <p>© 2026 Dev2Dev Engine. Precision Pricing for Pioneers.</p>
            </footer>
        </div>
    );
};

export default Pricing;
