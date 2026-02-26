import React from 'react';

const LanguageStats = ({ stats }) => {
    const sortedLangs = Object.entries(stats || {}).sort((a, b) => b[1] - a[1]);

    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '32px',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>Languages</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {sortedLangs.length > 0 ? sortedLangs.map(([lang, count]) => (
                    <div key={lang} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(to right, #6366f1, #a855f7)', boxShadow: '0 0 8px rgba(99,102,241,0.5)' }}></div>
                            <span style={{ textTransform: 'capitalize', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{lang}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>
                            <span style={{ color: '#fff' }}>{count}</span>
                            <span style={{ opacity: 0.3, marginLeft: '4px' }}>SOLVED</span>
                        </div>
                    </div>
                )) : <div style={{ opacity: 0.2, fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>No language data yet.</div>}
            </div>
        </div>
    );
};

export default LanguageStats;
