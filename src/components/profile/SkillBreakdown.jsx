import React from 'react';

const SkillBreakdown = ({ stats }) => {
    const sortedSkills = Object.entries(stats || {}).sort((a, b) => b[1] - a[1]);

    const getLevel = (count) => {
        if (count > 10) return { label: 'Advanced', color: '#ef4444' };
        if (count > 5) return { label: 'Intermediate', color: '#fbbf24' };
        return { label: 'Fundamental', color: '#818cf8' };
    };

    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '32px',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>Skills</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                {sortedSkills.length > 0 ? sortedSkills.map(([skill, count]) => {
                    const level = getLevel(count);
                    return (
                        <div key={skill} style={{
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                            padding: '0.6rem 1rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.6rem',
                            transition: '0.2s'
                        }}>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>{skill}</span>
                            <div style={{ padding: '2px 6px', borderRadius: '6px', background: `${level.color}15`, border: `1px solid ${level.color}33`, display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.7rem', color: level.color, fontWeight: 900 }}>x{count}</span>
                            </div>
                        </div>
                    );
                }) : <div style={{ opacity: 0.2, fontSize: '0.9rem', textAlign: 'center', width: '100%', padding: '1rem' }}>No skills tracked yet.</div>}
            </div>
        </div>
    );
};

export default SkillBreakdown;
