import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Heart, Calendar, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-navy text-white sticky top-0 z-50 px-4 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to={user?.role === 'provider' ? '/provider' : '/search'} className="text-xl font-bold text-mint flex items-center gap-2">
          DaycareFind
        </Link>

        {user ? (
          <div className="flex items-center gap-6">
            {user.role === 'parent' ? (
              <>
                <Link to="/search" className="flex items-center gap-1 hover:text-mint transition-colors">
                  <Search size={18} />
                  <span className="hidden sm:inline">Search</span>
                </Link>
                <Link to="/favorites" className="flex items-center gap-1 hover:text-mint transition-colors">
                  <Heart size={18} />
                  <span className="hidden sm:inline">Favorites</span>
                </Link>
                <Link to="/bookings" className="flex items-center gap-1 hover:text-mint transition-colors">
                  <Calendar size={18} />
                  <span className="hidden sm:inline">Bookings</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/provider" className="flex items-center gap-1 hover:text-mint transition-colors">
                  <User size={18} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link to="/provider/availability" className="flex items-center gap-1 hover:text-mint transition-colors">
                  <Calendar size={18} />
                  <span className="hidden sm:inline">Availability</span>
                </Link>
                <Link to="/provider/bookings" className="flex items-center gap-1 hover:text-mint transition-colors">
                  <Calendar size={18} />
                  <span className="hidden sm:inline">Requests</span>
                </Link>
              </>
            )}
            <div className="h-6 w-px bg-gray-600 hidden sm:block"></div>
            <Link to={user.role === 'provider' ? '/provider/profile' : '/profile'} className="hover:text-mint transition-colors flex items-center gap-1">
              <User size={18} />
              <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
            </Link>
            <button onClick={handleLogout} className="hover:text-red-400 transition-colors flex items-center gap-1">
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white hover:text-mint transition-colors font-medium">Login</Link>
            <Link to="/search" className="bg-mint hover:bg-mint-dark text-white px-4 py-2 rounded-lg font-medium transition-colors">Find Daycare</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
