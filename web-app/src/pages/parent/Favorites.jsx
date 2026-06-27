import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ProviderCard from '../../components/ProviderCard';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get(`/favorites?parent_id=${user.id}`);
        setFavorites(response.data.favorites || []);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    if (user) fetchFavorites();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold text-navy mb-8 flex items-center gap-2">
          <Heart className="text-red-500 fill-current" />
          My Saved Daycares
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map(fav => (
              <ProviderCard key={fav.id} provider={fav.provider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Heart size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">No favorites yet</h3>
            <p className="text-gray-500">Save providers to easily find them later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
