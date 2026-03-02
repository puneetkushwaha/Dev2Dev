import React from 'react';
import { Trophy, Star, Zap, Swords, Target, Crown, Flame, BrainCircuit, Diamond, Award, Medal, Lock } from 'lucide-react';
import './ProfileBadges.css';

const ALL_BADGES = [
    { id: 'streak_3', name: 'Spark', icon: 'Zap', desc: 'Maintain a 3-day streak.', type: 'streak' },
    { id: 'streak_7', name: 'Weekly Warrior', icon: 'Flame', desc: 'Maintain a 7-day streak.', type: 'streak' },
    { id: 'streak_30', name: 'Monthly Master', icon: 'Star', desc: 'Maintain a 30-day streak.', type: 'streak' },
    { id: 'streak_100', name: 'Century Club', icon: 'Crown', desc: 'Maintain a 100-day streak.', type: 'streak' },
    { id: 'streak_365', name: 'Unstoppable', icon: 'Diamond', desc: 'Maintain a 365-day streak.', type: 'streak' },
    { id: 'solver_10', name: 'Novice Coder', icon: 'Award', desc: 'Solve 10 DSA problems.', type: 'solver' },
    { id: 'solver_50', name: 'Problem Solver', icon: 'Target', desc: 'Solve 50 DSA problems.', type: 'solver' },
    { id: 'solver_100', name: 'Knight', icon: 'Swords', desc: 'Solve 100 DSA problems.', type: 'solver' },
    { id: 'solver_250', name: 'Algorithmic Expert', icon: 'BrainCircuit', desc: 'Solve 250 DSA problems.', type: 'solver' },
    { id: 'solver_500', name: 'Grandmaster', icon: 'Trophy', desc: 'Solve 500 DSA problems.', type: 'solver' }
];

const getBadgeIcon = (iconName, size = 32) => {
    switch (iconName) {
        case 'Zap': return <Zap size={size} />;
        case 'Flame': return <Flame size={size} />;
        case 'Star': return <Star size={size} />;
        case 'Crown': return <Crown size={size} />;
        case 'Diamond': return <Diamond size={size} />;
        case 'Award': return <Award size={size} />;
        case 'Target': return <Target size={size} />;
        case 'Swords': return <Swords size={size} />;
        case 'BrainCircuit': return <BrainCircuit size={size} />;
        case 'Trophy': return <Trophy size={size} />;
        default: return <Medal size={size} />;
    }
};

const ProfileBadges = ({ user }) => {
    const earnedBadgeIds = (user?.badges || []).map(b => b.id);

    // Group badges by type
    const streakBadges = ALL_BADGES.filter(b => b.type === 'streak');
    const solverBadges = ALL_BADGES.filter(b => b.type === 'solver');

    const renderBadgeGroup = (title, badgesData) => (
        <div className="badge-group">
            <h3 className="badge-group-title">{title}</h3>
            <div className="badges-grid">
                {badgesData.map(badge => {
                    const isEarned = earnedBadgeIds.includes(badge.id);
                    const earnedData = user?.badges?.find(b => b.id === badge.id);

                    return (
                        <div key={badge.id} className={`badge-card ${isEarned ? 'earned' : 'locked'}`}>
                            {isEarned && <div className="badge-glow" />}
                            <div className="badge-icon-wrapper">
                                {isEarned ? (
                                    getBadgeIcon(badge.icon, 36)
                                ) : (
                                    <Lock size={28} className="lock-icon" />
                                )}
                            </div>
                            <h4 className="badge-name">{badge.name}</h4>
                            <p className="badge-desc">{badge.desc}</p>
                            {isEarned && earnedData?.earnedAt && (
                                <span className="badge-date">Earned {new Date(earnedData.earnedAt).toLocaleDateString()}</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="profile-badges-container">
            <div className="badges-header">
                <h2><Trophy size={28} color="#facc15" /> Achievements</h2>
                <div className="badges-summary">
                    <div className="summary-stat">
                        <span className="stat-val">{earnedBadgeIds.length}</span>
                        <span className="stat-lbl">Earned</span>
                    </div>
                    <div className="summary-stat">
                        <span className="stat-val">{ALL_BADGES.length}</span>
                        <span className="stat-lbl">Total</span>
                    </div>
                </div>
            </div>

            {renderBadgeGroup('Consistency Mastery (Streak)', streakBadges)}
            {renderBadgeGroup('Problem Solving (Volume)', solverBadges)}

        </div>
    );
};

export default ProfileBadges;
