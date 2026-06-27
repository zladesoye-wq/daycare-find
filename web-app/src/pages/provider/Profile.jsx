import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthContext';
import { Building2, MapPin, Phone, CreditCard, Save } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await api.get('/providers/me');
        setProvider(response.data.provider);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchProvider();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/providers/${provider.id}`, provider);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile.');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center text-gray-500 font-medium">Loading your profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-navy">My Center Profile</h1>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-red-500 font-bold" onClick={logout}>Sign Out</Button>
            <Button onClick={handleSave} loading={saving}>
              <Save size={18} className="mr-2" />
              Save Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8">
              <h3 className="text-xl font-bold text-navy mb-6">General Information</h3>
              <form onSubmit={handleSave} className="space-y-6">
                <Input 
                  label="Center Name" 
                  value={provider.center_name} 
                  onChange={(e) => setProvider({...provider, center_name: e.target.value})}
                  required
                />
                <Input 
                  label="Address" 
                  value={provider.address} 
                  onChange={(e) => setProvider({...provider, address: e.target.value})}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Phone Number" 
                    value={provider.phone} 
                    onChange={(e) => setProvider({...provider, phone: e.target.value})}
                    required
                  />
                  <Input 
                    label="Email (Read-only)" 
                    value={user.email} 
                    readOnly
                    className="opacity-60"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-navy text-navy">Center Description</label>
                  <textarea 
                    rows="5"
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint border-gray-300"
                    value={provider.description}
                    onChange={(e) => setProvider({...provider, description: e.target.value})}
                  ></textarea>
                </div>
              </form>
            </Card>

            <Card className="p-8">
              <h3 className="text-xl font-bold text-navy mb-6">Age Groups Served</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {['infant', 'toddler', 'preschool', 'after-school'].map(group => (
                  <label key={group} className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-mint/20 cursor-pointer transition-all">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-mint"
                      checked={provider.age_groups?.includes(group)}
                      onChange={(e) => {
                        const groups = e.target.checked 
                          ? [...(provider.age_groups || []), group]
                          : provider.age_groups?.filter(g => g !== group);
                        setProvider({...provider, age_groups: groups});
                      }}
                    />
                    <span className="font-bold text-navy capitalize">{group}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-8 border-2 border-navy bg-navy text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <CreditCard size={120} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Subscription</h3>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-4xl font-bold text-mint uppercase">{provider.subscription_plan || 'Free'}</span>
                  <Badge variant="mint" className="bg-white/10 text-white border-white/20">Active</Badge>
                </div>
                
                <p className="text-blue-100/70 text-sm mb-8">
                  Your center is listed on DaycareFind. Upgrade to Premium for 10x more visibility and detailed analytics.
                </p>

                <Button className="w-full bg-white text-navy hover:bg-gray-100 border-none font-bold h-12">
                  Manage Billing
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-navy mb-4">Profile Image</h3>
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-4 border-2 border-dashed border-gray-200">
                <Building2 size={48} />
              </div>
              <Button variant="outline" className="w-full text-sm">Change Image</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
