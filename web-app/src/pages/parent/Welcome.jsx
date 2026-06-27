import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Building2, User } from 'lucide-react';

const Welcome = () => {
  const [role, setRole] = useState('parent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password, role);
    if (result.success) {
      navigate(role === 'provider' ? '/provider' : '/search');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-height-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-navy mb-2">DaycareFind</h1>
          <p className="text-gray-600">Connecting parents to local daycare centers in real-time.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button
              onClick={() => setRole('parent')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all ${role === 'parent' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'}`}
            >
              <User size={18} />
              Parent
            </button>
            <button
              onClick={() => setRole('provider')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all ${role === 'provider' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'}`}
            >
              <Building2 size={18} />
              Provider
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              loading={loading}
            >
              Log In
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t text-center space-y-4">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-mint font-bold hover:underline">
                Register here
              </Link>
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="text-sm" onClick={() => navigate('/search')}>
                Find Daycare
              </Button>
              <Button variant="ghost" className="text-sm" onClick={() => { setRole('provider'); setEmail('provider@test.com'); setPassword('password'); }}>
                List My Center
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
