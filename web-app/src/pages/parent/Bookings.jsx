import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Calendar, Clock, MapPin, XCircle } from 'lucide-react';
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

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this tour?')) return;
    try {
      await api.put(`/bookings/${id}/status`, { status: 'cancelled' });
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert('Failed to cancel booking.');
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
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold text-navy mb-8">My Tour Bookings</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-xl h-32 animate-pulse"></div>
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map(booking => (
              <Card key={booking.id} className="flex flex-col md:flex-row gap-6 p-6">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-navy">{booking.provider?.center_name}</h3>
                    <Badge variant={getStatusVariant(booking.status)} className="capitalize px-3 py-1">
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mb-4">
                    <MapPin size={14} />
                    {booking.provider?.address}
                  </p>
                  
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <Calendar size={18} className="text-mint" />
                      {format(new Date(booking.tour_date), 'PPP')}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <Clock size={18} className="text-mint" />
                      {booking.tour_time.substring(0, 5)}
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col justify-end gap-3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                  {booking.status === 'pending' || booking.status === 'confirmed' ? (
                    <Button 
                      variant="ghost" 
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 gap-2"
                      onClick={() => handleCancel(booking.id)}
                    >
                      <XCircle size={18} />
                      Cancel
                    </Button>
                  ) : null}
                  <Button 
                    variant="outline" 
                    className="text-sm"
                    onClick={() => window.location.href = `/provider/${booking.provider_id}`}
                  >
                    View Center
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Calendar size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">No tours booked</h3>
            <p className="text-gray-500">You haven't requested any tours yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
