import React from 'react';

const ActivityHeatmap = ({ heatmap }) => {
    const generateYearDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 364; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            dates.push({
                date: d.toISOString().split('T')[0],
                month: d.toLocaleString('default', { month: 'short' })
            });
        }
        return dates;
    };

    const yearData = generateYearDates();
    const weeks = [];
    let currentWeek = [];
    yearData.forEach((d, idx) => {
        currentWeek.push(d);
        if (currentWeek.length === 7 || idx === yearData.length - 1) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    const getIntensity = (count) => {
        if (!count) return 'rgba(255,255,255,0.03)';
        if (count < 2) return 'rgba(99, 102, 241, 0.4)';
        if (count < 5) return 'rgba(99, 102, 241, 0.7)';
        return 'rgba(99, 102, 241, 1)';
    };

    // Calculate month labels positions
    const monthLabels = [];
    let lastMonth = '';
    weeks.forEach((week, idx) => {
        const firstDayMonth = week[0].month;
        if (firstDayMonth !== lastMonth) {
            monthLabels.push({ month: firstDayMonth, index: idx });
            lastMonth = firstDayMonth;
        }
    });

    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '32px',
            border: '1px solid rgba(255,255,255,0.05)', marginTop: '2rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>Submission Activity</h3>
                <div style={{ fontSize: '0.85rem', opacity: 0.4, fontWeight: 700 }}>Total Active Days: {Object.keys(heatmap).length}</div>
            </div>

            <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
                {/* Month Labels Container */}
                <div style={{ display: 'flex', position: 'relative', height: '20px', marginBottom: '10px' }}>
                    {monthLabels.map((m, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            left: `${m.index * 16}px`,
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.3)',
                            fontWeight: 700
                        }}>
                            {m.month}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                    {weeks.map((week, wIdx) => (
                        <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {week.map(d => (
                                <div
                                    key={d.date}
                                    title={`${d.date}: ${heatmap[d.date] || 0} Submissions`}
                                    style={{
                                        width: '12px', height: '12px', background: getIntensity(heatmap[d.date]),
                                        borderRadius: '2.5px', transition: '0.2s ease',
                                        boxShadow: heatmap[d.date] > 0 ? `0 0 6px ${getIntensity(heatmap[d.date])}66` : 'none'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'scale(1.4)';
                                        e.currentTarget.style.zIndex = '10';
                                        e.currentTarget.style.boxShadow = `0 0 12px ${getIntensity(heatmap[d.date])}`;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.zIndex = '1';
                                        e.currentTarget.style.boxShadow = heatmap[d.date] > 0 ? `0 0 6px ${getIntensity(heatmap[d.date])}66` : 'none';
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.6rem', marginTop: '1.5rem', fontSize: '0.75rem', fontWeight: 700, opacity: 0.3 }}>
                <span>Less</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                    {[0, 1, 3, 6].map(v => (
                        <div key={v} style={{ width: '12px', height: '12px', background: getIntensity(v), borderRadius: '2.5px' }} />
                    ))}
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
