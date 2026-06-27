import React from 'react';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import { MapPin, Phone, Star, DollarSign, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProviderCard = ({ provider }) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="overflow-hidden flex flex-col h-full"
      onClick={() => navigate(`/provider/${provider.id}`)}
    >
      <div className="relative h-40 bg-gray-200 -mx-4 -mt-4 mb-4">
        {provider.imageUrl ? (
          <img src={provider.imageUrl} alt={provider.center_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Building2 size={48} />
          </div>
        )}
        {provider.budget_pick && (
          <div className="absolute top-2 right-2">
            <Badge variant="mint" className="shadow-sm border border-mint/20">Budget Pick</Badge>
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold text-navy mb-1 line-clamp-1">{provider.center_name}</h3>
        <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
          <MapPin size={14} />
          {provider.address} ({provider.distance?.toFixed(1)} mi)
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users size={16} className="text-mint" />
            <span>{provider.available_spots || 0} spots</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <DollarSign size={16} className="text-mint" />
            <span>${provider.monthly_price || '---'}/mo</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t flex justify-between items-center mt-auto">
        <Badge variant={provider.available_spots > 0 ? 'success' : 'danger'}>
          {provider.available_spots > 0 ? 'Open Spots' : 'Waitlist'}
        </Badge>
        <Button variant="ghost" className="text-sm font-bold text-mint hover:bg-mint/5 p-0 h-auto">
          View Details
        </Button>
      </div>
    </Card>
  );
};

import { Building2 } from 'lucide-react';

export default ProviderCard;
