import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Save, AlertCircle } from 'lucide-react';

const Availability = () => {
  const [totalSpots, setTotalSpots] = useState(0);
  const [availableSpots, setAvailableSpots] = useState(0);
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const response = await api.get('/providers/me');
        const { total_spots, available_spots, pricing } = response.data.provider;
        setTotalSpots(total_spots || 0);
        setAvailableSpots(available_spots || 0);
        setPricing(pricing || [
          { age_group: 'infant', monthly_price: 1000 },
          { age_group: 'toddler', monthly_price: 900 },
          { age_group: 'preschool', monthly_price: 800 }
        ]);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchAvailability();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        api.put('/providers/me/availability', { total_spots: totalSpots, available_spots: availableSpots }),
        api.put('/providers/me/pricing', { pricing })
      ]);
      alert('Availability and pricing updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update. Please try again.');
    }
    setSaving(false);
  };

  const updatePrice = (index, value) => {
    const newPricing = [...pricing];
    newPricing[index].monthly_price = parseFloat(value);
    setPricing(newPricing);
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-navy">Manage Availability</h1>
          <Button onClick={handleSave} loading={saving}>
            <Save size={18} className="mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="p-8">
            <h3 className="text-xl font-bold text-navy mb-6">Open Spots</h3>
            <div className="space-y-6">
              <Input 
                label="Total Capacity" 
                type="number" 
                value={totalSpots} 
                onChange={(e) => setTotalSpots(e.target.value)} 
                placeholder="e.g. 50"
              />
              <Input 
                label="Currently Available" 
                type="number" 
                value={availableSpots} 
                onChange={(e) => setAvailableSpots(e.target.value)} 
                placeholder="e.g. 5"
              />
              
              <div className="pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500 font-medium">Occupancy Rate</span>
                  <span className="font-bold text-navy">{totalSpots > 0 ? Math.round(((totalSpots - availableSpots) / totalSpots) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-mint h-full transition-all duration-500" 
                    style={{ width: `${totalSpots > 0 ? ((totalSpots - availableSpots) / totalSpots) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold text-navy mb-6">Pricing Editor</h3>
            <div className="space-y-6">
              {pricing.map((p, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-navy capitalize">{p.age_group} Tuition ($/mo)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                    <input 
                      type="number"
                      value={p.monthly_price}
                      onChange={(e) => updatePrice(idx, e.target.value)}
                      className="w-full px-4 py-2 pl-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint border-gray-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-blue-50 border-blue-100 flex items-start gap-4">
          <AlertCircle className="text-blue-500 shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-navy">Budget Pick Tip</h4>
            <p className="text-sm text-gray-600">
              Providers whose pricing is at or below 85% of the area average receive a <strong>Budget Pick</strong> badge.
              This can increase your profile views by up to 40%.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Availability;
