import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Play, Lock, ChevronRight } from 'lucide-react';
import Loader from '../components/Loader';

const Tutorials = () => {
    const navigate = useNavigate();
    const [tutorials, setTutorials] = useState([]);
    const [unlockedTutorials, setUnlockedTutorials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTutorials = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com'}/api/tutorials`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTutorials(res.data);

                // Get locally cached user info to check unlocked status
                const userString = localStorage.getItem('user');
                if (userString) {
                    try {
                        const user = JSON.parse(userString);
                        setUnlockedTutorials(user.unlockedTutorials || []);
                    } catch (e) { }
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching tutorials:', err);
                setLoading(false);
            }
        };
        fetchTutorials();
    }, []);

    const filteredTutorials = tutorials.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader text="Unlocking Premium Knowledge..." />;

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '2rem 3rem' }}>
            {/* Header section */}
            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Premium Tutorials
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>Learn from industry experts with our curated video series.</p>
                </div>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input
                        type="text"
                        placeholder="Search series..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '0.75rem 1rem 0.75rem 2.8rem',
                            color: '#fff',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Tutorials Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {filteredTutorials.map((tutorial) => (
                    <div
                        key={tutorial._id}
                        onClick={() => navigate(`/tutorials/${tutorial._id}`)}
                        className="tutorial-card"
                        style={{
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '24px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{ position: 'relative', height: '200px' }}>
                            <img src={tutorial.thumbnail} alt={tutorial.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(99, 102, 241, 0.9)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                                {tutorial.category}
                            </div>
                            <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#fff', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Play size={12} fill="white" /> {tutorial.lessons.length} Lessons
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>{tutorial.title}</h3>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {tutorial.description}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: (tutorial.isPremium && !unlockedTutorials.includes(tutorial._id)) ? '#fbbf24' : '#6366f1', fontSize: '0.9rem', fontWeight: 700 }}>
                                    {(tutorial.isPremium && !unlockedTutorials.includes(tutorial._id)) ? <Lock size={16} /> : <Play size={16} />}
                                    {(tutorial.isPremium && !unlockedTutorials.includes(tutorial._id)) ? `Unlock for ₹${tutorial.price} / Year` : 'Start Learning'} <ChevronRight size={18} />
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                                    Updated {new Date(tutorial.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .tutorial-card:hover {
                    transform: translateY(-8px);
                    border-color: rgba(99, 102, 241, 0.3);
                    background: rgba(255,255,255,0.04);
                    box-shadow: 0 20px 40px -20px rgba(0,0,0,0.5);
                }
                .loader {
                    border: 3px solid rgba(255,255,255,0.1);
                    border-top: 3px solid #6366f1;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Tutorials;
