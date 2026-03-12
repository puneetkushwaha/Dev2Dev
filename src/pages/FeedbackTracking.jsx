import React, { useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '../api/config';
import { 
    Search, Loader2, CheckCircle, Clock, 
    AlertCircle, MessageSquare, ArrowLeft 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css'; // Leverage existing admin styles for layout

const FeedbackTracking = () => {
    const [refNumber, setRefNumber] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!refNumber) return;

        setLoading(true);
        setError('');
        setStatus(null);

        try {
            const res = await axios.get(getApiUrl(`/api/feedback/status/${refNumber}`));
            setStatus(res.data);
        } catch (err) {
            console.error('Tracking error:', err);
            setError(err.response?.data?.message || 'Could not find a report with that reference number.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending':
                return { 
                    label: 'Pending', 
                    color: '#fbbf24', 
                    icon: <Clock size={20} />,
                    desc: 'Your report has been received and is waiting to be reviewed by our team.'
                };
            case 'reviewed':
                return { 
                    label: 'Reviewed', 
                    color: '#818cf8', 
                    icon: <Search size={20} />,
                    desc: 'A team member has reviewed your feedback and is working on a solution.'
                };
            case 'resolved':
                return { 
                    label: 'Resolved', 
                    color: '#34d399', 
                    icon: <CheckCircle size={20} />,
                    desc: 'The issue has been successfully resolved. Check your email for details.'
                };
            default:
                return { label: status, color: '#94a3b8', icon: <AlertCircle size={20} /> };
        }
    };

    return (
        <div className="admin-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="feedback-tracking-card" style={{ 
                maxWidth: '500px', 
                width: '90%', 
                background: 'rgba(15, 15, 25, 0.8)', 
                backdropFilter: 'blur(20px)',
                padding: '2.5rem',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem' }}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ 
                        background: 'rgba(99, 102, 241, 0.1)', 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '16px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto 1.5rem',
                        color: '#6366f1'
                    }}>
                        <Search size={32} />
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Track Feedback</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>Check the implementation status of your report</p>
                </div>

                <form onSubmit={handleTrack} style={{ marginBottom: '2rem' }}>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type="text" 
                            placeholder="Enter Reference Number (e.g. FB-XXXXXX)" 
                            value={refNumber}
                            onChange={(e) => setRefNumber(e.target.value.toUpperCase())}
                            style={{ 
                                width: '100%', 
                                background: 'rgba(255,255,255,0.03)', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                padding: '1.2rem 1.5rem', 
                                borderRadius: '14px', 
                                color: '#fff',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                outline: 'none'
                            }}
                        />
                        <button 
                            type="submit" 
                            disabled={loading || !refNumber}
                            style={{ 
                                position: 'absolute', 
                                right: '8px', 
                                top: '8px', 
                                bottom: '8px',
                                padding: '0 1.5rem',
                                background: '#6366f1',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#fff',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease',
                                opacity: loading || !refNumber ? 0.5 : 1
                            }}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Track'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div style={{ 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        border: '1px solid rgba(239, 68, 68, 0.2)', 
                        padding: '1rem', 
                        borderRadius: '12px', 
                        color: '#f87171',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {status && (
                    <div className="animate-fade-in" style={{ 
                        background: 'rgba(255,255,255,0.02)', 
                        border: '1px solid rgba(255, 255, 255, 0.05)', 
                        padding: '1.5rem', 
                        borderRadius: '16px' 
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div>
                                <h4 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Current Status</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: getStatusInfo(status.status).color, fontSize: '1.25rem', fontWeight: 'bold' }}>
                                    {getStatusInfo(status.status).icon}
                                    {getStatusInfo(status.status).label}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <h4 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Submitted On</h4>
                                <span style={{ color: '#fff', fontSize: '0.9rem' }}>{new Date(status.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: '1.6', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px' }}>
                            {getStatusInfo(status.status).desc}
                        </p>

                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <h4 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Description</h4>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontStyle: 'italic' }}>"{status.description}"</p>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                        Need help? Contact us at <a href="mailto:support@dev2dev.online" style={{ color: '#6366f1', textDecoration: 'none' }}>support@dev2dev.online</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeedbackTracking;
