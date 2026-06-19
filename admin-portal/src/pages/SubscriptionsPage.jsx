import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState('all');

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/subscriptions', {
        params: { plan }
      });
      setSubscriptions(response.data.data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [plan]);

  const columns = [
    { 
      header: 'Provider', 
      key: 'provider_name',
      render: (row) => <div style={{ fontWeight: '500', color: 'var(--navy)' }}>{row.provider_name}</div>
    },
    { 
      header: 'Plan', 
      key: 'plan',
      render: (row) => <StatusBadge status={row.plan} />
    },
    { 
      header: 'Status', 
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    { header: 'Stripe Subscription ID', key: 'stripe_subscription_id' },
    { 
      header: 'Start Date', 
      key: 'created_at',
      render: (row) => new Date(row.created_at).toLocaleDateString()
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Provider Subscriptions</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select 
            className="btn btn-outline" 
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <DataTable columns={columns} data={subscriptions} loading={loading} />
      </div>
    </div>
  );
};

export default SubscriptionsPage;
