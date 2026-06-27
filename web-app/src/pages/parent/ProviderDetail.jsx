import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Card from '../../components/Card';
import { MapPin, Phone, Users, DollarSign, Calendar, Heart, Share2, ChevronLeft, Check } from 'lucide-react';

const ProviderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await api.get(`/providers/${id}`);
        setProvider(response.data.provider);
        // Check if favorite logic would go here
      } catch (error) {
        console.error('Error fetching provider:', error);
      }
      setLoading(false);
    };
    fetchProvider();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-10 w-10 border-4 border-mint border-t-transparent rounded-full"></div>
    </div>
  );

  if (!provider) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-navy mb-4">Provider not found</h2>
      <Button onClick={() => navigate('/search')}>Back to Search</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b sticky top-14 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600 hover:text-navy">
            <ChevronLeft size={20} />
            Back
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-full border transition-colors ${isFavorite ? 'bg-red-50 border-red-100 text-red-500' : 'hover:bg-gray-50'}`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button className="p-2 rounded-full border hover:bg-gray-50">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative h-64 md:h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {provider.imageUrl ? (
              <img src={provider.imageUrl} alt={provider.center_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <MapPin size={64} />
              </div>
            )}
            {provider.budget_pick && (
              <div className="absolute top-4 left-4">
                <Badge variant="mint" className="px-4 py-1.5 text-sm shadow-lg">Budget Pick</Badge>
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold text-navy mb-2">{provider.center_name}</h1>
                <p className="text-lg text-gray-500 flex items-center gap-2">
                  <MapPin size={20} className="text-mint" />
                  {provider.address}
                </p>
              </div>
              <Badge variant={provider.available_spots > 0 ? 'success' : 'danger'} className="px-4 py-1.5 text-sm">
                {provider.available_spots > 0 ? `${provider.available_spots} Spots Available` : 'Waitlist Only'}
              </Badge>
            </div>

            <div className="flex gap-6 mb-8 py-4 border-y border-gray-100">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Starting at</span>
                <span className="text-2xl font-bold text-navy">${provider.pricing?.[0]?.monthly_price || '---'}/mo</span>
              </div>
              <div className="w-px bg-gray-100"></div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Age Groups</span>
                <span className="text-sm font-bold text-navy">{provider.age_groups?.join(', ') || 'All'}</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-navy mb-4">About this Center</h2>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              {provider.description || "Welcome to our quality childcare center. We provide a safe, nurturing environment for your child to learn and grow. Our dedicated staff is committed to excellence in early childhood education."}
            </p>

            <h2 className="text-2xl font-bold text-navy mb-4">Pricing & Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {provider.pricing?.map((p, idx) => (
                <Card key={idx} className="flex justify-between items-center p-6 border-2 border-transparent hover:border-mint/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-mint/10 rounded-full flex items-center justify-center text-mint">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-navy capitalize">{p.age_group}</p>
                      <p className="text-xs text-gray-400">Monthly Tuition</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-navy">${p.monthly_price}</p>
                </Card>
              )) || (
                <p className="text-gray-500 italic">Contact for pricing details.</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-32 p-8 border-2 border-mint shadow-xl">
            <h3 className="text-xl font-bold text-navy mb-6">Book a Tour</h3>
            <p className="text-gray-500 text-sm mb-6">Schedule a visit to meet the teachers and see the facility.</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-600">
                <Check size={18} className="text-mint" />
                <span>Meet the director</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Check size={18} className="text-mint" />
                <span>Observe classrooms</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Check size={18} className="text-mint" />
                <span>Review curriculum</span>
              </div>
            </div>

            <Button 
              className="w-full h-14 text-lg font-bold"
              onClick={() => navigate(`/booking/${id}`)}
            >
              Request a Tour
            </Button>
            
            <p className="mt-4 text-center text-xs text-gray-400">
              No commitment required. Tours are free.
            </p>

            <div className="mt-8 pt-8 border-t space-y-4">
              <div className="flex items-center gap-3 text-navy">
                <Phone size={20} className="text-mint" />
                <span className="font-medium">{provider.phone || '(555) 123-4567'}</span>
              </div>
              <p className="text-sm text-gray-500 flex items-start gap-3">
                <Calendar size={20} className="text-mint shrink-0" />
                <span>Hours: Mon - Fri<br />7:30 AM - 6:00 PM</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;
