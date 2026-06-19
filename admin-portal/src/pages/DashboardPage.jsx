import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import BookingsChart from '../components/Charts/BookingsChart';
import StatusBreakdown from '../components/Charts/StatusBreakdown';
import { 
  Store, 
  Users, 
  Calendar, 
  TrendingUp, 
  MousePointerClick,
  Percent
} from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/analytics');
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>Error loading data.</div>;

  const statusData = Object.entries(stats.bookingStatusBreakdown || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Mock historical data for the bar chart as the API doesn't provide it yet
  const weeklyData = [
    { name: 'Mon', value: 4 },
    { name: 'Tue', value: 7 },
    { name: 'Wed', value: 5 },
    { name: 'Thu', value: 12 },
    { name: 'Fri', value: 9 },
    { name: 'Sat', value: 15 },
    { name: 'Sun', value: 10 },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatsCard 
          title="Active Providers" 
          value={stats.totalActiveProviders} 
          icon={<Store size={24} />}
          trend="up"
          trendValue={12}
        />
        <StatsCard 
          title="Total Parents" 
          value={stats.totalParentSignups} 
          icon={<Users size={24} />}
          trend="up"
          trendValue={8}
        />
        <StatsCard 
          title="Tours This Month" 
          value={stats.totalBookingsThisMonth} 
          icon={<Calendar size={24} />}
        />
        <StatsCard 
          title="Engagement" 
          value={stats.engagement.total_taps} 
          icon={<MousePointerClick size={24} />}
        />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Weekly Tour Requests</h3>
          <BookingsChart data={weeklyData} />
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Booking Status</h3>
          <StatusBreakdown data={statusData} />
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: '#e0f2fe', borderRadius: '50%', color: '#0ea5e9', marginBottom: '1rem' }}>
            <TrendingUp size={24} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Avg. Search Radius</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.25rem' }}>
            {stats.averageSearchRadius.toFixed(1)} <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>miles</span>
          </h2>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '50%', color: '#f59e0b', marginBottom: '1rem' }}>
            <Percent size={24} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Budget Pick View Rate</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.25rem' }}>
            {stats.engagement.budget_pick_metrics.view_rate.toFixed(1)}%
          </h2>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: '#dcfce7', borderRadius: '50%', color: '#16a34a', marginBottom: '1rem' }}>
            <MousePointerClick size={24} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Budget Pick Tap Rate</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.25rem' }}>
            {stats.engagement.budget_pick_metrics.tap_rate.toFixed(1)}%
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
