import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Calendar, Clock, User, Phone, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert('Failed to update status.');
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'info';
      default: return 'info';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold text-navy mb-8">Tour Requests</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl h-32 animate-pulse"></div>
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map(booking => (
              <Card key={booking.id} className="p-0 overflow-hidden border-2 border-transparent hover:border-gray-200 transition-all">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-mint/10 rounded-full flex items-center justify-center text-mint font-bold text-xl">
                          {booking.parent?.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-navy">{booking.parent?.name}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone size={14} />
                            {booking.parent?.phone || 'No phone provided'}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(booking.status)} className="capitalize px-3 py-1">
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar size={18} className="text-mint" />
                        <span className="font-medium">{format(new Date(booking.tour_date), 'PPP')}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Clock size={18} className="text-mint" />
                        <span className="font-medium">{booking.tour_time.substring(0, 5)}</span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Notes</p>
                        <p className="text-sm text-gray-600 italic">"{booking.notes}"</p>
                      </div>
                    )}
                  </div>

                  {booking.status === 'pending' && (
                    <div className="flex md:flex-col border-t md:border-t-0 md:border-l bg-gray-50/30">
                      <button 
                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                        className="flex-1 flex items-center justify-center gap-2 p-4 text-green-600 font-bold hover:bg-green-50 transition-colors border-r md:border-r-0 md:border-b"
                      >
                        <CheckCircle2 size={20} />
                        Confirm
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                        className="flex-1 flex items-center justify-center gap-2 p-4 text-red-500 font-bold hover:bg-red-50 transition-colors"
                      >
                        <XCircle size={20} />
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Calendar size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">No tour requests</h3>
            <p className="text-gray-500">When parents request a tour, they'll appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
