import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Building2, User, Mail, Phone, Lock } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('parent');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    center_name: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register({ ...formData, role });
    if (result.success) {
      navigate(role === 'provider' ? '/provider' : '/search');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-20">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-navy mb-2">Create Account</h1>
          <p className="text-gray-600">Join DaycareFind to {role === 'parent' ? 'find local daycares' : 'list your center'}.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button
              onClick={() => setRole('parent')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${role === 'parent' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'}`}
            >
              <User size={18} />
              I'm a Parent
            </button>
            <button
              onClick={() => setRole('provider')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${role === 'provider' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'}`}
            >
              <Building2 size={18} />
              I'm a Provider
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 000-0000"
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            {role === 'provider' && (
              <div className="space-y-6 pt-4 border-t animate-in fade-in duration-300">
                <Input
                  label="Daycare Center Name"
                  name="center_name"
                  value={formData.center_name}
                  onChange={handleChange}
                  placeholder="Little Sprouts Academy"
                  required
                />
                <Input
                  label="Full Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St, City, State, ZIP"
                  required
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold"
              loading={loading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/" className="text-mint font-bold hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
