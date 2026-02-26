import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/notifications', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setNotifications(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching notifications:", err);
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'alert': return <AlertCircle size={20} color="#e74c3c" />;
            case 'success': return <CheckCircle size={20} color="#2ecc71" />;
            case 'warning': return <AlertTriangle size={20} color="#f1c40f" />;
            default: return <Info size={20} color="#3498db" />;
        }
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: '#fff' }}>Loading notifications...</div>;
    }

    return (
        <div className="notifications-container animate-fade-in">
            <div className="notifications-header">
                <h2><Bell size={24} style={{ marginRight: '10px' }} /> Your Notifications</h2>
                <p>Stay updated with the latest announcements, alerts, and platform news.</p>
            </div>

            <div className="notifications-list">
                {notifications.length === 0 ? (
                    <div className="empty-state">
                        <Bell size={48} color="rgba(255,255,255,0.2)" />
                        <p>No notifications yet.</p>
                    </div>
                ) : (
                    notifications.map(notif => (
                        <div key={notif._id} className={`notification-card ${notif.type}`}>
                            <div className="notif-icon-box">
                                {getIcon(notif.type)}
                            </div>
                            <div className="notif-content">
                                <h3>{notif.title}</h3>
                                <p>{notif.message}</p>
                                <span className="notif-date">{new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
