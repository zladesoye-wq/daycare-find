import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Users, Calendar, Eye, Star, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    available_spots: 0,
    total_spots: 0,
    pending_bookings: 0,
    total_bookings: 0,
    views: 0
  });
  const [recentBookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/providers/me/stats'),
          api.get('/bookings?limit=5')
        ]);
        setStats(statsRes.data.stats);
        setBookings(bookingsRes.data.bookings || []);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Available Spots', value: stats.available_spots, icon: Users, color: 'text-mint', bg: 'bg-mint/10' },
    { label: 'Pending Requests', value: stats.pending_bookings, icon: Calendar, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Total Bookings', value: stats.total_bookings, icon: TrendingUp, color: 'text-navy', bg: 'bg-navy/10' },
    { label: 'Profile Views', value: stats.views || 142, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy">Provider Dashboard</h1>
            <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
          </div>
          <Button onClick={() => navigate('/provider/availability')}>Update Availability</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <Card key={i} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <Badge variant="success" className="bg-green-50 text-green-600 border-none flex items-center gap-1">
                  <ArrowUpRight size={12} />
                  12%
                </Badge>
              </div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-navy mt-1">{stat.value}</h3>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold text-navy">Recent Tour Requests</h3>
                <Button variant="ghost" className="text-sm font-bold text-mint" onClick={() => navigate('/provider/bookings')}>View All</Button>
              </div>
              <div className="divide-y">
                {loading ? (
                  [1, 2, 3].map(i => <div key={i} className="p-6 h-20 animate-pulse bg-gray-50/50"></div>)
                ) : recentBookings.length > 0 ? (
                  recentBookings.map(booking => (
                    <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-navy">
                          {booking.parent?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-navy">{booking.parent?.name}</p>
                          <p className="text-sm text-gray-500">{booking.tour_date} at {booking.tour_time.substring(0, 5)}</p>
                        </div>
                      </div>
                      <Badge variant={booking.status === 'pending' ? 'warning' : 'success'} className="capitalize">
                        {booking.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-gray-500">No recent requests</div>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-navy text-white">
              <h3 className="text-xl font-bold mb-2">Grow your center</h3>
              <p className="text-blue-100/70 text-sm mb-6">Upgrade to Premium to get priority placement and Budget Pick eligibility.</p>
              <Button variant="primary" className="w-full bg-mint hover:bg-mint-light border-none">Upgrade Now</Button>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-navy mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => navigate('/provider/profile')} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-mint/5 hover:text-mint transition-all">
                  <Star size={24} />
                  <span className="text-xs font-bold">Edit Profile</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-mint/5 hover:text-mint transition-all">
                  <Users size={24} />
                  <span className="text-xs font-bold">Waitlist</span>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
