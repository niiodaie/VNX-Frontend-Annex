import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  Utensils,
  Clock,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Star,
  ChefHat,
  Users,
  DollarSign,
  Wine,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import FoodPairingPopup from '@/components/FoodPairingPopup';

interface Restaurant {
  id: number;
  name: string;
  cuisineType: string;
  country: string;
  description: string;
  address: string;
  phoneNumber?: string;
  website?: string;
  rating?: string;
  imageUrl?: string;
  hours?: Record<string, string>;
  popularDishes?: string[];
  reviewCount?: string;
  priceRange?: string;
}

export default function RestaurantDetailPage() {
  const [, params] = useRoute('/restaurant/:id');
  const restaurantId = params?.id;
  const [isPairingOpen, setIsPairingOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/restaurants', restaurantId],
    queryFn: async () => {
      const response = await fetch(`/api/restaurants/${restaurantId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant details');
      }
      const data = await response.json();
      return data.restaurant;
    },
    enabled: !!restaurantId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p>Failed to load restaurant details. Please try again later.</p>
      </div>
    );
  }

  const restaurant: Restaurant = data;

  const openPairingPopup = (dishName: string) => {
    setSelectedDish(dishName);
    setIsPairingOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Hero section */}
      <div className="relative rounded-xl overflow-hidden mb-8 h-64 md:h-96 bg-gradient-to-r from-amber-500 to-orange-600">
        {restaurant.imageUrl ? (
          <>
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                // Get a cuisine-specific fallback image
                const cuisineType = restaurant.cuisineType || '';
                let country = cuisineType.split(' ')[0];
                
                const fallbackImages: Record<string, string> = {
                  'Nigerian': '/images/cuisines/nigerian.jpg',
                  'Ethiopian': '/images/cuisines/ethiopian.jpg',
                  'Ghanaian': '/images/african-dishes/waakye.jpg',
                  'South': '/images/cuisines/south-african.jpg',  
                  'Senegalese': '/images/cuisines/senegalese.jpg',
                  'Moroccan': '/images/cuisines/moroccan.jpg',
                  'default': '/images/african-dish-main.jpg'
                };
                
                e.currentTarget.src = fallbackImages[country] || fallbackImages.default;
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-5xl font-bold">
              {restaurant.country}
            </span>
          </div>
        )}
        {/* We've made this semi-transparent and positioned at the bottom only */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {restaurant.name}
          </h1>
          <div className="flex items-center gap-2 text-white">
            <span className="px-2 py-1 bg-yellow-500 rounded-md text-sm font-medium text-white flex items-center">
              <Star className="h-4 w-4 mr-1" /> {restaurant.rating || '0'}
            </span>
            <span className="text-sm">
              {restaurant.reviewCount ? `(${restaurant.reviewCount} reviews)` : ''}
            </span>
            <span className="px-2 py-1 bg-primary rounded-md text-sm text-white">
              {restaurant.cuisineType}
            </span>
            <span className="px-2 py-1 bg-gray-700 rounded-md text-sm text-white">
              {restaurant.country}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="md:col-span-2 space-y-8">
          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-700">{restaurant.description}</p>
            </CardContent>
          </Card>

          {/* Popular dishes */}
          {restaurant.popularDishes && restaurant.popularDishes.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <ChefHat className="h-5 w-5 mr-2 text-primary" />
                  Popular Dishes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {restaurant.popularDishes.map((dish, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center"
                    >
                      <span className="font-medium">{dish}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openPairingPopup(dish)}
                        className="flex items-center gap-1"
                      >
                        <Wine className="h-4 w-4" />
                        <span className="hidden sm:inline">Pairings</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact info */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold mb-4">Information</h2>
              {restaurant.address && (
                <div className="flex items-start mb-3">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <p className="text-gray-700">{restaurant.address}</p>
                </div>
              )}
              {restaurant.phoneNumber && (
                <div className="flex items-center mb-3">
                  <Phone className="h-5 w-5 text-gray-500 mr-2" />
                  <a href={`tel:${restaurant.phoneNumber}`} className="text-primary hover:underline">
                    {restaurant.phoneNumber}
                  </a>
                </div>
              )}
              {restaurant.website && (
                <div className="flex items-center mb-3">
                  <Globe className="h-5 w-5 text-gray-500 mr-2" />
                  <a
                    href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {restaurant.website}
                  </a>
                </div>
              )}
              {restaurant.priceRange && (
                <div className="flex items-center mb-3">
                  <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">
                    Price Range: {restaurant.priceRange}
                  </span>
                </div>
              )}
              {restaurant.cuisineType && (
                <div className="flex items-center">
                  <Utensils className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">
                    {restaurant.cuisineType} Cuisine
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hours */}
          {restaurant.hours && Object.keys(restaurant.hours).length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-500" />
                  Opening Hours
                </h2>
                <div className="space-y-2">
                  {Object.entries(restaurant.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium">{day}</span>
                      <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reservation button */}
          <Button className="w-full">Make a Reservation</Button>
        </div>
      </div>

      {/* Food Pairing Popup */}
      <FoodPairingPopup
        isOpen={isPairingOpen}
        onClose={() => setIsPairingOpen(false)}
        dishName={selectedDish}
        cuisine={restaurant.cuisineType}
      />
    </div>
  );
}