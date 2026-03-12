import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../api/config';
import { 
    MessageSquare, Clock, User, Mail, ExternalLink, 
    CheckCircle, AlertCircle, Loader2, ArrowLeft, RefreshCcw
} from 'lucide-react';
import './AdminDashboard.css'; // Reuse existing admin styles

const AdminFeedback = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const fetchFeedback = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(getApiUrl('/api/feedback/admin'), {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFeedback(res.data);
        } catch (err) {
            console.error('Error fetching feedback:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    const updateStatus = async (id, status) => {
        setUpdating(id);
        try {
            const token = localStorage.getItem('token');
            await axios.put(getApiUrl(`/api/feedback/admin/${id}/status`), { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Update local state
            setFeedback(prev => prev.map(f => f._id === id ? { ...f, status } : f));
        } catch (err) {
            console.error('Error updating feedback status:', err);
        } finally {
            setUpdating(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#fbbf24';
            case 'reviewed': return '#818cf8';
            case 'resolved': return '#34d399';
            default: return '#94a3b8';
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ height: '70vh' }}>
                <Loader2 className="animate-spin" size={40} color="#6366f1" />
            </div>
        );
    }

    return (
        <div className="content-view animate-fade-in">
            <div className="view-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>User Feedback & Reports</span>
                <button className="btn-secondary" onClick={fetchFeedback} style={{ padding: '0.5rem 1rem' }}>
                    <RefreshCcw size={16} />
                </button>
            </div>

            <div className="table-container">
                <table className="pro-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Description</th>
                            <th>Screenshot</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedback.length > 0 ? (
                            feedback.map((f) => (
                                <tr key={f._id}>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <strong style={{ color: '#fff' }}>{f.user?.name || 'Deleted User'}</strong>
                                            <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{f.user?.email || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ maxWidth: '300px', whiteSpace: 'normal', lineHeight: '1.4' }}>
                                            {f.description}
                                        </div>
                                    </td>
                                    <td>
                                        {f.screenshotPath ? (
                                            <a 
                                                href={`${getApiUrl('').replace(/\/api$/, '')}${f.screenshotPath}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="btn-sm highlight"
                                            >
                                                <ExternalLink size={14} /> View
                                            </a>
                                        ) : (
                                            <span style={{ opacity: 0.4 }}>No Image</span>
                                        )}
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '0.8rem' }}>
                                            {new Date(f.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge`} style={{ 
                                            background: `${getStatusColor(f.status)}20`, 
                                            color: getStatusColor(f.status),
                                            border: `1px solid ${getStatusColor(f.status)}40`
                                        }}>
                                            {f.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {f.status !== 'reviewed' && (
                                                <button 
                                                    className="btn-sm" 
                                                    onClick={() => updateStatus(f._id, 'reviewed')}
                                                    disabled={updating === f._id}
                                                >
                                                    {updating === f._id ? <Loader2 size={12} className="spin" /> : 'Review'}
                                                </button>
                                            )}
                                            {f.status !== 'resolved' && (
                                                <button 
                                                    className="btn-sm highlight" 
                                                    onClick={() => updateStatus(f._id, 'resolved')}
                                                    disabled={updating === f._id}
                                                >
                                                    {updating === f._id ? <Loader2 size={12} className="spin" /> : <CheckCircle size={12} />} Resolve
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
                                    <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                    <p>No feedback found.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminFeedback;
