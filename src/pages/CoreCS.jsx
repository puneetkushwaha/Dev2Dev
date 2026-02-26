import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Layers, Database, Cpu, Network, Box, Layout,
    ChevronRight, BookOpen, Clock, BarChart, ArrowRight,
    Star, Target, Zap, CheckCircle2, Circle, Filter, Search, RotateCcw,
    ArrowLeft
} from 'lucide-react';
import axios from 'axios';

const subjects = [
    { id: 'dsa', name: 'Data Structures & Algorithms', dbKey: 'DSA', icon: Layers, color: '#6366f1' },
    { id: 'os', name: 'Operating Systems', dbKey: 'OS', icon: Cpu, color: '#f59e0b' },
    { id: 'dbms', name: 'Database Mgt Systems', dbKey: 'DBMS', icon: Database, color: '#818cf8' },
    { id: 'cn', name: 'Computer Networks', dbKey: 'CN', icon: Network, color: '#3b82f6' },
    { id: 'oops', name: 'Object Oriented Prog.', dbKey: 'OOP', icon: Box, color: '#ec4899' },
    { id: 'sd', name: 'System Design', dbKey: 'SD', icon: Layout, color: '#8b5cf6' },
];

const CoreCS = () => {
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in" style={{
            minHeight: 'calc(100vh - 80px)',
            background: 'radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.08) 0%, transparent 60%), #050508',
            padding: '4rem 2rem'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Header Section */}
                <div style={{ marginBottom: '3rem', borderLeft: '4px solid #6366f1', paddingLeft: '1.5rem' }}>
                    <h1 style={{
                        fontSize: '2.2rem',
                        fontWeight: 850,
                        marginBottom: '0.5rem',
                        color: '#fff',
                        letterSpacing: '-1px'
                    }}>
                        Core Computer Science
                    </h1>
                    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', maxWidth: '500px', lineHeight: 1.5 }}>
                        Pick a subject to start practicing core concepts through hand-picked problems.
                    </p>
                </div>

                {/* Cards Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '2.5rem'
                }}>
                    {subjects.map((sub, idx) => {
                        const Icon = sub.icon;
                        return (
                            <div
                                key={sub.id}
                                onClick={() => navigate(`/core-cs/${sub.id}`)}
                                style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    padding: '3rem 2.5rem',
                                    borderRadius: '32px',
                                    cursor: 'pointer',
                                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.5rem',
                                    animation: `fadeIn 0.6s ease forwards ${idx * 0.1}s`,
                                    opacity: 0
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                    e.currentTarget.style.borderColor = sub.color;
                                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                                    e.currentTarget.style.boxShadow = `0 30px 60px -12px ${sub.color}30`;
                                    e.currentTarget.querySelector('.icon-box').style.background = sub.color;
                                    e.currentTarget.querySelector('.icon-box').style.boxShadow = `0 0 30px ${sub.color}60`;
                                    e.currentTarget.querySelector('.icon-svg').style.color = '#fff';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.querySelector('.icon-box').style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.querySelector('.icon-box').style.boxShadow = 'none';
                                    e.currentTarget.querySelector('.icon-svg').style.color = sub.color;
                                }}
                            >
                                {/* Static Ambient Background */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-10%',
                                    right: '-10%',
                                    width: '150px',
                                    height: '150px',
                                    background: `${sub.color}10`,
                                    filter: 'blur(40px)',
                                    borderRadius: '50%'
                                }}></div>

                                <div className="icon-box" style={{
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '20px',
                                    background: 'rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.4s'
                                }}>
                                    <Icon className="icon-svg" size={32} color={sub.color} style={{ transition: 'all 0.4s' }} />
                                </div>

                                <div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>{sub.name}</h2>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, fontSize: '1.05rem' }}>
                                        Master the fundamentals of {sub.dbKey} through implementation-focused modules and theory.
                                    </p>
                                </div>

                                <div style={{
                                    marginTop: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: sub.color,
                                    fontWeight: 700,
                                    fontSize: '1rem'
                                }}>
                                    Explore Problem Set <ArrowRight size={18} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx="true">{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};
export default CoreCS;
