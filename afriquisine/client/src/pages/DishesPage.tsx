import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search, MapPin, Info, ChefHat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Dish {
  name: string;
  country: string;
  image: string;
  description?: string;
  ingredients?: string[];
  recipe?: string;
}

export default function DishesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const { data: dishesData, isLoading, error } = useQuery({
    queryKey: ['/api/import/african-dishes'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/import/african-dishes');
        if (!response.ok) {
          throw new Error('Failed to fetch dishes data');
        }
        const data = await response.json();
        return data.dishes as Dish[];
      } catch (err) {
        console.error('Error fetching dishes data:', err);
        toast({
          title: "Error",
          description: "Could not load African dishes. Please try again later.",
          variant: "destructive",
        });
        throw err;
      }
    }
  });

  // Group dishes by country
  const dishesByCountry = React.useMemo(() => {
    if (!dishesData) return {};
    
    return dishesData.reduce((acc: Record<string, Dish[]>, dish) => {
      if (!acc[dish.country]) {
        acc[dish.country] = [];
      }
      acc[dish.country].push(dish);
      return acc;
    }, {});
  }, [dishesData]);

  // Function to search dishes
  const searchDishes = () => {
    if (!dishesData) return;
    
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredDishes([]);
      setHasSearched(false);
      return;
    }
    
    const results = dishesData.filter(dish => 
      dish.name.toLowerCase().includes(query) || 
      dish.country.toLowerCase().includes(query)
    );
    
    setFilteredDishes(results);
    setHasSearched(true);
    
    if (results.length === 0) {
      toast({
        title: "No Dishes Found",
        description: `We couldn't find any dishes matching "${searchQuery}".`,
        variant: "default",
      });
    }
  };

  // Handle keyboard enter on search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchDishes();
    }
  };

  // Get dish details - in a real app, this would fetch from an API
  const getDishDetails = (dish: Dish): Dish => {
    // Simulated dish details - would normally come from a database/API
    const detailsMap: Record<string, Partial<Dish>> = {
      'Jollof Rice': {
        description: 'A one-pot rice dish popular throughout West Africa, with a base of tomatoes, onions, and peppers.',
        ingredients: [
          'Long grain rice',
          'Tomatoes',
          'Red bell peppers',
          'Onions',
          'Vegetable oil',
          'Chicken or vegetable stock',
          'Curry powder',
          'Thyme',
          'Bay leaves',
          'Salt and pepper'
        ],
        recipe: 'Blend tomatoes, peppers, and onions. Heat oil and cook blended mix. Add spices and cook. Add rice, stir to coat. Add stock, cover and simmer until rice is cooked through.'
      },
      'Injera with Doro Wat': {
        description: 'Injera is a sourdough flatbread from Ethiopia, served with Doro Wat, a spicy chicken stew.',
        ingredients: [
          'Teff flour (for injera)',
          'Water',
          'Chicken',
          'Berbere spice mix',
          'Onions',
          'Garlic',
          'Ginger',
          'Hard-boiled eggs',
          'Butter (niter kibbeh)',
          'Lemon juice'
        ],
        recipe: 'For injera: ferment teff flour with water. For Doro Wat: caramelize onions, add berbere and spices, add chicken, simmer until tender, add eggs. Serve stew over injera.'
      },
      'Bunny Chow': {
        description: 'A South African street food consisting of a hollowed-out loaf of bread filled with curry.',
        ingredients: [
          'Loaf of white bread',
          'Curry (beef, chicken, lamb, or bean)',
          'Potatoes',
          'Onions',
          'Garlic',
          'Ginger',
          'Curry powder',
          'Tomatoes',
          'Various spices'
        ],
        recipe: 'Prepare curry with meat, potatoes, onions, and spices. Hollow out a loaf of bread. Fill bread with curry. Serve with the bread that was scooped out.'
      }
    };
    
    return {
      ...dish,
      ...detailsMap[dish.name] || {
        description: `A traditional dish from ${dish.country}.`,
        ingredients: ['Ingredients information not available'],
        recipe: 'Recipe information not available'
      }
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !dishesData) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">Error Loading Dishes</h1>
        <p className="text-gray-600 mb-6">We couldn't load information about African dishes. Please try again later.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">African Dishes</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Discover the diverse and flavorful dishes from across the African continent, 
          from spicy West African stews to aromatic North African tagines.
        </p>
      </div>

      {/* Search Section */}
      <section className="mb-10">
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <p className="text-gray-600 mb-4">Search for dishes by name or country</p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input 
                    placeholder="e.g., Jollof Rice, Ethiopia..." 
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <Button 
                  onClick={searchDishes}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
            
            {hasSearched && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Search Results ({filteredDishes.length})</h3>
                {filteredDishes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredDishes.map((dish, index) => (
                      <Card 
                        key={index} 
                        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedDish(getDishDetails(dish))}
                      >
                        <div className="h-48 overflow-hidden relative">
                          <img 
                            src={dish.image} 
                            alt={dish.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Use a colored background with text if image loading fails
                              const target = e.target as HTMLImageElement;
                              const container = target.parentElement;
                              if (container) {
                                // Replace image with colored div containing dish name
                                container.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                                    <div class="text-xl font-bold text-center p-4">${dish.name}</div>
                                  </div>
                                `;
                              }
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{dish.country}</span>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold">{dish.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">Click for details</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No dishes found matching your search.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Dishes by Country */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <MapPin className="h-6 w-6 mr-2 text-primary" />
          Dishes by Country
        </h2>
        
        {Object.entries(dishesByCountry).map(([country, dishes]) => (
          <div key={country} className="mb-8">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">{country}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {dishes.map((dish, index) => (
                <Card 
                  key={index} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedDish(getDishDetails(dish))}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Use a colored background with text if image loading fails
                        const target = e.target as HTMLImageElement;
                        const container = target.parentElement;
                        if (container) {
                          // Replace image with colored div containing dish name
                          container.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                              <div class="text-xl font-bold text-center p-4">${dish.name}</div>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold">{dish.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">Click for details</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Dish Details Dialog */}
      <Dialog open={!!selectedDish} onOpenChange={(open) => !open && setSelectedDish(null)}>
        {selectedDish && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedDish.name}</DialogTitle>
              <DialogDescription>
                Traditional dish from {selectedDish.country}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <div className="h-64 overflow-hidden rounded-md mb-4">
                  <img 
                    src={selectedDish.image} 
                    alt={selectedDish.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Use a colored background with text if image loading fails
                      const target = e.target as HTMLImageElement;
                      const container = target.parentElement;
                      if (container) {
                        // Replace image with colored div containing dish name
                        container.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-md">
                            <div class="text-2xl font-bold text-center p-4">${selectedDish.name}</div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
                <p className="text-gray-700">{selectedDish.description}</p>
              </div>
              
              <div>
                <div className="mb-4">
                  <h3 className="font-bold text-lg flex items-center mb-2">
                    <Info className="h-5 w-5 mr-2 text-primary" />
                    Ingredients
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {selectedDish.ingredients?.map((ingredient, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-1 h-1 rounded-full bg-primary mt-2 mr-2"></div>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg flex items-center mb-2">
                    <ChefHat className="h-5 w-5 mr-2 text-primary" />
                    Recipe Overview
                  </h3>
                  <p className="text-sm text-gray-700">{selectedDish.recipe}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={() => setSelectedDish(null)} variant="outline">Close</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Call to Action */}
      <div className="bg-primary/10 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Experience African Cuisine</h2>
        <p className="text-gray-600 mb-6">Discover restaurants serving these authentic dishes near you.</p>
        <Button className="min-w-[180px]" asChild>
          <a href="/restaurants">Find Restaurants</a>
        </Button>
      </div>
    </div>
  );
}