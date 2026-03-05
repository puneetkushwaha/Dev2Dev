import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Swords, Target, Crown, Flame, BrainCircuit, Diamond, Award, Medal } from 'lucide-react';
import axios from 'axios';
import { getApiUrl } from '../api/config';
import './Leaderboard.css';

const getBadgeIcon = (iconName) => {
    switch (iconName) {
        case 'Zap': return <Zap size={18} />;
        case 'Flame': return <Flame size={18} />;
        case 'Star': return <Star size={18} />;
        case 'Crown': return <Crown size={18} />;
        case 'Diamond': return <Diamond size={18} />;
        case 'Award': return <Award size={18} />;
        case 'Target': return <Target size={18} />;
        case 'Swords': return <Swords size={18} />;
        case 'BrainCircuit': return <BrainCircuit size={18} />;
        case 'Trophy': return <Trophy size={18} />;
        default: return <Medal size={18} />;
    }
};

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await axios.get(getApiUrl('/api/leaderboard'), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLeaderboard(res.data);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="leaderboard-loading">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="leaderboard-container">
            <motion.div
                className="leaderboard-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1><Trophy className="header-icon" /> Global Leaderboard</h1>
                <p>Compete with top developers. Solve problems, build streaks, and earn legendary badges.</p>
            </motion.div>

            <motion.div
                className="leaderboard-table-wrapper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Developer</th>
                            <th>Total Solved</th>
                            <th>Current Streak</th>
                            <th>Top Badge</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((user, index) => (
                            <motion.tr
                                key={user._id}
                                className={`leaderboard-row rank-${user.rank}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <td className="rank-cell">
                                    {user.rank === 1 && <span className="rank-medal gold"><Crown size={20} /></span>}
                                    {user.rank === 2 && <span className="rank-medal silver"><Medal size={20} /></span>}
                                    {user.rank === 3 && <span className="rank-medal bronze"><Medal size={20} /></span>}
                                    {user.rank > 3 && `#${user.rank}`}
                                </td>
                                <td className="user-cell">
                                    <div className="avatar">
                                        {user.profilePic ? (
                                            <img src={user.profilePic} alt={user.username} />
                                        ) : (
                                            <div className="avatar-placeholder">{user.username.charAt(0).toUpperCase()}</div>
                                        )}
                                    </div>
                                    <span className="username">{user.username}</span>
                                </td>
                                <td className="stat-cell score-glow">{user.totalSolved}</td>
                                <td className="stat-cell streak-glow"><Flame size={14} className="streak-icon" /> {user.streak}</td>
                                <td className="badge-cell">
                                    {user.topBadge ? (
                                        <div className="top-badge" title={user.topBadge.description}>
                                            <span className="badge-icon">{getBadgeIcon(user.topBadge.icon)}</span>
                                            <span className="badge-name">{user.topBadge.name}</span>
                                        </div>
                                    ) : (
                                        <span className="no-badge">Needs more XP</span>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                        {leaderboard.length === 0 && (
                            <tr>
                                <td colSpan="5" className="empty-state">No coders on the leaderboard yet. Be the first!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
};

export default Leaderboard;
