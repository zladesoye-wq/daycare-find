import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { Calendar as CalendarIcon, Clock, ChevronLeft, CheckCircle2 } from 'lucide-react';

const TourBooking = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await api.get(`/providers/${providerId}`);
        setProvider(response.data.provider);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProvider();
  }, [providerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/bookings', {
        provider_id: providerId,
        tour_date: date,
        tour_time: time,
        notes
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Failed to book tour. Please try again.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-10 text-center shadow-xl">
          <div className="w-20 h-20 bg-mint/10 rounded-full flex items-center justify-center text-mint mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold text-navy mb-4">Tour Requested!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            We've sent your request to <strong>{provider?.center_name}</strong>. They will contact you to confirm the time.
          </p>
          <div className="space-y-3">
            <Button className="w-full h-12" onClick={() => navigate('/bookings')}>View My Bookings</Button>
            <Button variant="ghost" className="w-full h-12" onClick={() => navigate('/search')}>Back to Search</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-3xl mx-auto px-4 mt-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600 hover:text-navy mb-6">
          <ChevronLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-navy mb-8">Schedule a Tour</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-navy">Select Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint pl-10"
                    />
                    <CalendarIcon className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-navy">Select Time</label>
                  <div className="relative">
                    <select 
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint pl-10 bg-white"
                    >
                      <option value="">Choose time...</option>
                      <option value="09:00:00">9:00 AM</option>
                      <option value="10:00:00">10:00 AM</option>
                      <option value="11:00:00">11:00 AM</option>
                      <option value="13:00:00">1:00 PM</option>
                      <option value="14:00:00">2:00 PM</option>
                      <option value="15:00:00">3:00 PM</option>
                    </select>
                    <Clock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-navy">Additional Notes</label>
                <textarea 
                  rows="4"
                  placeholder="Tell the center about your child's age, special needs, or when you're looking to start."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint"
                ></textarea>
              </div>

              <Button type="submit" className="w-full h-14 text-lg font-bold" loading={loading}>
                Confirm Tour Request
              </Button>
            </form>
          </div>

          <div className="md:col-span-1">
            <Card className="p-6 bg-mint/5 border-mint/20">
              <h3 className="font-bold text-navy mb-4">Tour Summary</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Center:</span>
                  <span className="font-medium text-navy">{provider?.center_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium text-navy">{date || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time:</span>
                  <span className="font-medium text-navy">{time || 'Not selected'}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourBooking;
