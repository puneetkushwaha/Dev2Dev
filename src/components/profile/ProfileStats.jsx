import React from 'react';

const ProfileStats = ({ solvedStats, totalAvailableStats }) => {
    const { easy = 0, medium = 0, hard = 0 } = solvedStats || {};
    const totalSolved = easy + medium + hard;

    const totalEasy = totalAvailableStats?.easy || 0;
    const totalMedium = totalAvailableStats?.medium || 0;
    const totalHard = totalAvailableStats?.hard || 0;
    const grandTotal = totalEasy + totalMedium + totalHard || 1; // Avoid 0 denominator

    const dashArray = (totalSolved / grandTotal) * 100;

    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '32px',
            border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '2rem'
        }}>
            <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>Solved Problems</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
                <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                    <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%', filter: 'drop-shadow(0 0 10px rgba(99,102,241,0.2))' }}>
                        <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="2.5" />
                        <circle cx="18" cy="18" r="16" fill="none" stroke="url(#purpleGradient)" strokeWidth="2.5"
                            strokeDasharray={`${dashArray} 100`} strokeLinecap="round"
                            style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        />
                        <defs>
                            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{totalSolved}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.4, fontWeight: 700, marginTop: '2px' }}>SOLVED</div>
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <DifficultyRow label="Easy" solved={easy} total={totalEasy} color="#818cf8" />
                    <DifficultyRow label="Medium" solved={medium} total={totalMedium} color="#fbbf24" />
                    <DifficultyRow label="Hard" solved={hard} total={totalHard} color="#ef4444" />
                </div>
            </div>
        </div>
    );
};

const DifficultyRow = ({ label, solved, total, color }) => {
    const percentage = total > 0 ? (solved / total) * 100 : 0;
    // Dynamic glow intensity based on percentage (min 10%, max 100% impact)
    const glowStrength = Math.max(0.1, percentage / 100);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800 }}>
                <span style={{
                    color,
                    opacity: 0.6 + (glowStrength * 0.4), // Gets clearer with progress
                    textShadow: percentage > 0 ? `0 0 ${8 * glowStrength}px ${color}` : 'none',
                    transition: '0.3s'
                }}>{label}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ color: '#fff', fontSize: '1rem' }}>{solved}</span>
                    <span style={{ opacity: 0.3, fontSize: '0.75rem' }}>/ {total}</span>
                </div>
            </div>
            <div style={{
                height: '6px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: color,
                    borderRadius: '10px',
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: percentage > 0 ? `0 0 ${15 * glowStrength}px ${color}` : 'none',
                    filter: `brightness(${1 + (glowStrength * 0.2)})` // Slightly brighter as it fills
                }}></div>
            </div>
        </div>
    );
};

export default ProfileStats;
