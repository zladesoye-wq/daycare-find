import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DataTable from '../components/DataTable';

const ParentsPage = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchParents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/parents', {
        params: { search: search || undefined }
      });
      setParents(response.data.data);
    } catch (error) {
      console.error('Error fetching parents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchParents();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const columns = [
    { 
      header: 'Name', 
      key: 'name',
      render: (row) => <div style={{ fontWeight: '500', color: 'var(--navy)' }}>{row.name}</div>
    },
    { header: 'Email', key: 'email' },
    { header: 'Phone', key: 'phone' },
    { 
      header: 'Total Bookings', 
      key: 'total_bookings',
      render: (row) => (
        <span style={{ 
          padding: '0.25rem 0.5rem', 
          backgroundColor: '#eff6ff', 
          color: '#1d4ed8', 
          borderRadius: '4px',
          fontWeight: '600'
        }}>
          {row.total_bookings}
        </span>
      )
    },
    { 
      header: 'Joined Date', 
      key: 'created_at',
      render: (row) => new Date(row.created_at).toLocaleDateString()
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Parents</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', width: '300px' }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <DataTable columns={columns} data={parents} loading={loading} />
      </div>
    </div>
  );
};

export default ParentsPage;
