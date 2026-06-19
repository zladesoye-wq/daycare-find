import React from 'react';

const StatsCard = ({ title, value, icon, trend, trendValue }) => {
  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
            {title}
          </p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--navy)' }}>
            {value}
          </h3>
          {trend && (
            <p style={{ 
              fontSize: '0.75rem', 
              marginTop: '0.5rem',
              color: trend === 'up' ? 'var(--mint)' : 'var(--danger)'
            }}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}% vs last month
            </p>
          )}
        </div>
        <div style={{ 
          padding: '0.75rem', 
          backgroundColor: 'rgba(46, 204, 138, 0.1)', 
          borderRadius: '0.5rem',
          color: 'var(--mint)'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
