import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { User, Mail, Phone, Settings, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold text-navy mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card className="text-center p-8">
              <div className="w-24 h-24 bg-mint/10 rounded-full flex items-center justify-center text-mint mx-auto mb-4 text-3xl font-bold">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-navy">{user.name}</h2>
              <p className="text-gray-500 capitalize mb-6">{user.role}</p>
              <Button 
                variant="ghost" 
                className="w-full text-red-500 hover:bg-red-50 justify-center"
                onClick={logout}
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card className="p-8">
              <h3 className="text-xl font-bold text-navy mb-6 flex items-center gap-2">
                <Settings size={20} className="text-mint" />
                Account Information
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" value={user.name} readOnly />
                  <Input label="Email Address" value={user.email} readOnly />
                  <Input label="Phone Number" value={user.phone || 'Not provided'} readOnly />
                </div>
                
                <div className="pt-6 border-t">
                  <Button variant="outline" className="text-sm">Edit Information</Button>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-xl font-bold text-navy mb-6">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium text-navy">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive updates about your tour requests.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-mint" />
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium text-navy">SMS Reminders</p>
                    <p className="text-sm text-gray-500">Get a text 24h before your scheduled tour.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-mint" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
