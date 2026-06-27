import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ProviderCard from '../../components/ProviderCard';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Search as SearchIcon, Filter, Map, List, SlidersHorizontal } from 'lucide-react';

const Search = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zip, setZip] = useState('10001');
  const [radius, setRadius] = useState(10);
  const [ageGroup, setAgeGroup] = useState('infant');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');
  const [viewMode, setViewMode] = useState('list');

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = {
        zip,
        radius,
        age_group: ageGroup,
        max_price: maxPrice || undefined,
        availability: true
      };
      const response = await api.get('/providers', { params });
      setProviders(response.data.providers || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProviders();
  }, [ageGroup]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-navy pt-8 pb-12 px-4 shadow-lg mb-8">
        <div className="max-w-6xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Find Your Perfect Daycare</h1>
          <p className="text-blue-100 opacity-80">Search local centers with real-time openings and budget picks.</p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-xl">
          <div className="flex-1">
            <Input
              placeholder="ZIP Code"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="border-none"
            />
          </div>
          <div className="flex-1 flex items-center gap-2 px-2">
            <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Within {radius} mi</span>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={radius} 
              onChange={(e) => setRadius(e.target.value)}
              className="w-full accent-mint"
            />
          </div>
          <div className="flex-1">
            <select 
              value={ageGroup} 
              onChange={(e) => setAgeGroup(e.target.value)}
              className="w-full h-full px-4 py-2 bg-white border-none focus:outline-none font-medium text-navy"
            >
              <option value="infant">Infant</option>
              <option value="toddler">Toddler</option>
              <option value="preschool">Preschool</option>
            </select>
          </div>
          <Button onClick={fetchProviders} className="px-8 h-12">
            <SearchIcon size={20} className="mr-2" />
            Search
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-navy">
            {loading ? 'Searching...' : `${providers.length} Daycares Found`}
          </h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="text-sm h-10"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={18} className="mr-2" />
              Filters
            </Button>
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-mint' : 'text-gray-500'}`}
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md ${viewMode === 'map' ? 'bg-white shadow-sm text-mint' : 'text-gray-500'}`}
              >
                <Map size={20} />
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top duration-200">
            <Input
              label="Max Price ($/mo)"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="e.g. 1200"
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-navy">Subsidy Accepted</label>
              <div className="flex items-center gap-2 h-10">
                <input type="checkbox" className="w-5 h-5 accent-mint rounded" />
                <span className="text-gray-600">Show only subsidy centers</span>
              </div>
            </div>
            <div className="flex items-end">
              <Button variant="secondary" className="w-full" onClick={fetchProviders}>Apply Filters</Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl h-80 animate-pulse">
                <div className="h-40 bg-gray-100 rounded-t-xl mb-4"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-100 rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : providers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.map(provider => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <SearchIcon size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">No providers found</h3>
            <p className="text-gray-500 mb-6">Try expanding your search radius or changing the ZIP code.</p>
            <Button variant="outline" onClick={() => {setRadius(25); fetchProviders();}}>Expand to 25 mi</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
