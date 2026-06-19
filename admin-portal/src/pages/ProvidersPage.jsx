import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { Search, Filter, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

const ProvidersPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/providers', {
        params: { status: status !== 'all' ? status : undefined }
      });
      setProviders(response.data.data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [status]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/admin/providers/${id}/flag`, {
        is_active: !currentStatus,
        reason: !currentStatus ? 'Re-activated by admin' : 'Deactivated for review'
      });
      fetchProviders();
    } catch (error) {
      alert('Error updating provider status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this provider? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/providers/${id}`);
        fetchProviders();
      } catch (error) {
        alert('Error deleting provider');
      }
    }
  };

  const columns = [
    { 
      header: 'Center Name', 
      key: 'center_name',
      render: (row) => (
        <div style={{ fontWeight: '500', color: 'var(--navy)' }}>{row.center_name}</div>
      )
    },
    { header: 'Address', key: 'address' },
    { 
      header: 'Status', 
      key: 'is_active',
      render: (row) => <StatusBadge status={row.is_active ? 'active' : 'inactive'} />
    },
    { 
      header: 'Plan', 
      key: 'subscription_plan',
      render: (row) => <StatusBadge status={row.subscription_plan || 'free'} />
    },
    { 
      header: 'Spots (Avail/Total)', 
      render: (row) => `${row.available_spots || 0} / ${row.total_spots || 0}`
    },
    { 
      header: 'Actions', 
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => handleToggleStatus(row.id, row.is_active)}
            title={row.is_active ? 'Deactivate' : 'Activate'}
            className="btn btn-outline"
            style={{ padding: '0.25rem' }}
          >
            {row.is_active ? <AlertTriangle size={16} color="var(--warning)" /> : <CheckCircle size={16} color="var(--mint)" />}
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            title="Delete"
            className="btn btn-outline"
            style={{ padding: '0.25rem' }}
          >
            <Trash2 size={16} color="var(--danger)" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Daycare Providers</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input 
              type="text" 
              placeholder="Search providers..." 
              style={{ padding: '0.5rem 0.75rem 0.5rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem' }}
            />
          </div>
          <select 
            className="btn btn-outline" 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <DataTable columns={columns} data={providers} loading={loading} />
      </div>
    </div>
  );
};

export default ProvidersPage;
