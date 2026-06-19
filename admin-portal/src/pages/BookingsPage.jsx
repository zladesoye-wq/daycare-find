import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/bookings', {
        params: { status }
      });
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [status]);

  const columns = [
    { 
      header: 'Provider', 
      key: 'provider_name',
      render: (row) => <div style={{ fontWeight: '500', color: 'var(--navy)' }}>{row.provider_name}</div>
    },
    { 
      header: 'Parent', 
      key: 'parent_name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '500' }}>{row.parent_name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.parent_email}</div>
        </div>
      )
    },
    { 
      header: 'Tour Date/Time', 
      render: (row) => (
        <div>
          <div>{new Date(row.tour_date).toLocaleDateString()}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.tour_time}</div>
        </div>
      )
    },
    { 
      header: 'Status', 
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    { 
      header: 'Booked On', 
      key: 'created_at',
      render: (row) => new Date(row.created_at).toLocaleDateString()
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tour Bookings</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select 
            className="btn btn-outline" 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <DataTable columns={columns} data={bookings} loading={loading} />
      </div>
    </div>
  );
};

export default BookingsPage;
