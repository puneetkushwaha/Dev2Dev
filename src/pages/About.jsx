import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Target, Cpu } from 'lucide-react';
import './About.css';

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);

        // Star Background Logic
        const canvas = document.getElementById('starCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let stars = [];

        const initStars = () => {
            stars = [];
            for (let i = 0; i < 150; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 2,
                    speed: Math.random() * 0.5 + 0.1
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
            stars.forEach(s => {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
                s.y -= s.speed;
                if (s.y < 0) s.y = height;
            });
            requestAnimationFrame(animate);
        };

        initStars();
        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initStars();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMouseMove = (e) => {
        const cards = document.querySelectorAll('.core-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const dx = x - xc;
            const dy = y - yc;
            card.style.setProperty('--rx', `${dy / -20}deg`);
            card.style.setProperty('--ry', `${dx / 20}deg`);
        });
    };

    const handleMouseLeave = () => {
        const cards = document.querySelectorAll('.core-card');
        cards.forEach(card => {
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
        });
    };

    return (
        <div className="about-container" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <canvas id="starCanvas" className="star-background"></canvas>
            <div className="gradient-blob g1"></div>
            <div className="gradient-blob g2"></div>
            <nav className="minimal-nav">
                <div className="nav-left">
                    <Link to="/" className="logo-link">
                        <img src="/logo.png" alt="Dev2Dev logo" style={{ height: '32px' }} />
                    </Link>
                </div>
                <div className="nav-right">
                    <Link to="/pricing" className="nav-item-v2">Pricing</Link>
                    <Link to="/register" className="btn-auth-nav">Initiate System</Link>
                </div>
            </nav>

            <header className="about-hero">
                <div className="hero-badge">The Mission</div>
                <h1>Architecting the <span className="text-gradient">Tech Vanguard</span></h1>
                <p className="hero-desc">
                    Dev2Dev isn't just a platform; it's your personal tactical engine for career dominance.
                    We bridge the gap between "Learning to Code" and "Building Systems that Matter."
                </p>
            </header>

            <section className="about-core">
                <div className="core-grid">
                    <div className="core-card">
                        <div className="card-icon"><Cpu size={28} /></div>
                        <h3>What is Dev2Dev?</h3>
                        <p>
                            Think of Dev2Dev as your **Personal Technical Architect**. In a world of generic tutorials,
                            we provide an AI-driven ecosystem that analyzes your current depth, architects your future
                            roadmap, and battle-tests your skills in real-world scenarios.
                        </p>
                    </div>
                    <div className="core-card">
                        <div className="card-icon"><Target size={28} /></div>
                        <h3>The Philosophy</h3>
                        <p>
                            We believe in "Show your Work." Our mission is to transform developers from passive
                            consumers of content into active architects of technology. We focus on **Execution,
                            Precision, and Impact.**
                        </p>
                    </div>
                </div>
            </section>


            <footer className="about-footer">
                <p>© 2026 Dev2Dev Engine. Precision-engineered for Pioneers.</p>
            </footer>
        </div>
    );
};

export default About;
