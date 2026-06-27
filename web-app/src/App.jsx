import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Welcome from './pages/parent/Welcome';
import Register from './pages/parent/Register';
import Search from './pages/parent/Search';
import ProviderDetail from './pages/parent/ProviderDetail';
import TourBooking from './pages/parent/TourBooking';
import Favorites from './pages/parent/Favorites';
import Bookings from './pages/parent/Bookings';
import Profile from './pages/parent/Profile';

import ProviderDashboard from './pages/provider/Dashboard';
import ProviderAvailability from './pages/provider/Availability';
import ProviderBookings from './pages/provider/Bookings';
import ProviderProfile from './pages/provider/Profile';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-10 w-10 border-4 border-mint border-t-transparent rounded-full"></div>
    </div>
  );
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to={user.role === 'provider' ? '/provider' : '/search'} />;
  
  return children;
};

const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main className="max-w-7xl mx-auto">{children}</main>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      
      {/* Parent Routes */}
      <Route path="/search" element={<Layout><Search /></Layout>} />
      <Route path="/provider/:id" element={<Layout><ProviderDetail /></Layout>} />
      <Route path="/booking/:providerId" element={<ProtectedRoute role="parent"><Layout><TourBooking /></Layout></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute role="parent"><Layout><Favorites /></Layout></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute role="parent"><Layout><Bookings /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute role="parent"><Layout><Profile /></Layout></ProtectedRoute>} />
      
      {/* Provider Routes */}
      <Route path="/provider" element={<ProtectedRoute role="provider"><Layout><ProviderDashboard /></Layout></ProtectedRoute>} />
      <Route path="/provider/availability" element={<ProtectedRoute role="provider"><Layout><ProviderAvailability /></Layout></ProtectedRoute>} />
      <Route path="/provider/bookings" element={<ProtectedRoute role="provider"><Layout><ProviderBookings /></Layout></ProtectedRoute>} />
      <Route path="/provider/profile" element={<ProtectedRoute role="provider"><Layout><ProviderProfile /></Layout></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
