import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, MessageSquare, ExternalLink } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="minimal-footer">
            <div className="footer-grid">
                <div className="footer-col-brand">
                    <div className="footer-logo-container">
                        <img src="/logo.png" width="120" height="40" alt="Dev2Dev logo" className="footer-logo" />
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
                        <li><Link to="/problems">DSA Practice</Link></li>
                        <li><Link to="/interview">Mock Interviews</Link></li>
                        <li><Link to="/resume">ATS Engine</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Resources</h4>
                    <ul className="footer-links-list">
                        <li><a href="https://pportfolio-rho.vercel.app/" target="_blank" rel="noopener noreferrer">Personal Portfolio</a></li>
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
                <div>
                    <p>© 2026 Dev2Dev Engine. Precision-engineered for Pioneers.</p>
                    <p className="footer-credits">
                        Designed & Developed by <a href="https://pportfolio-rho.vercel.app/" target="_blank" rel="noopener noreferrer">Puneet Kushwaha</a>
                    </p>
                </div>
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
    );
};

export default Footer;
