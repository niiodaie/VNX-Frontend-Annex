import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Info, MapPin, Utensils, Star, Search, ChefHat, Bookmark } from 'lucide-react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CuisineData {
  title: string;
  description: string;
  cuisines: {
    name: string;
    description: string;
    imageUrl?: string;
    country?: string;
  }[];
  popularDishes: {
    name: string;
    description: string;
    imageUrl?: string;
    country?: string;
  }[];
  facts: string[];
}

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  difficulty?: string;
  imageUrl?: string;
  region?: string;
  country?: string;
}

interface Dish {
  name: string;
  country: string;
  image: string;
  description?: string;
  ingredients?: string[];
  recipe?: string;
}

export default function CuisinesPage() {
  const { toast } = useToast();
  const googleSearchUrl = "https://www.google.com/search?q=african+cuisine&sca_esv=0e1aa4f886ac3be0&sxsrf=AHTn8zohJLAouK0CXW7V5ITN1Ib7NwZavQ%3A1745019715324&source=hp&ei=Q-MCaNWzEavnwN4P2LGT8Q0&iflsig=ACkRmUkAAAAAaALxU9l2vT42lTEAWYC5-VxCr0MeOq_s&oq=african+cuis&gs_lp=Egdnd3Mtd2l6IgxhZnJpY2FuIGN1aXMqAggAMggQABiABBixAzIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABEiET1AAWOAbcAF4AJABAJgBmAGgAcYIqgEEMTIuMbgBA8gBAPgBAZgCDqAClAnCAgoQIxiABBgnGIoFwgIEECMYJ8ICERAuGIAEGLEDGNEDGIMBGMcBwgILEAAYgAQYsQMYgwHCAgsQLhiABBixAxiDAcICCxAuGIAEGNEDGMcBwgIOEC4YgAQYsQMY0QMYxwHCAggQLhiABBixA8ICBRAuGIAEwgIOEC4YgAQYsQMYxwEYrwHCAgcQABiABBgKwgIHEC4YgAQYCsICCBAuGIAEGNQCmAMAkgcEMTMuMaAHk5wBsgcEMTIuMbgHkQk&sclient=gws-wiz";
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [recipeResults, setRecipeResults] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  // Dishes State
  const [dishSearchQuery, setDishSearchQuery] = useState('');
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  
  // Cuisine data query
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/scrape/african-cuisine'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/scrape/african-cuisine?url=${encodeURIComponent(googleSearchUrl)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch African cuisine data');
        }
        const data = await response.json();
        return data.cuisineData as CuisineData;
      } catch (err) {
        console.error('Error fetching cuisine data:', err);
        toast({
          title: 'Error',
          description: 'Could not load African cuisine information',
          variant: 'destructive',
        });
        throw err;
      }
    }
  });
  
  // Dishes data query
  const { data: dishesData, isLoading: isDishesLoading, error: dishesError } = useQuery({
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
    
    const grouped = dishesData.reduce((acc, dish) => {
      const country = dish.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(dish);
      return acc;
    }, {} as Record<string, Dish[]>);
    
    return grouped;
  }, [dishesData]);
  
  // Handle search for dishes
  const handleDishSearch = () => {
    if (!dishSearchQuery.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a dish name or country to search",
        variant: "destructive",
      });
      return;
    }
    
    if (!dishesData) {
      toast({
        title: "No Data",
        description: "Dish data is not available yet. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    const query = dishSearchQuery.toLowerCase();
    const filtered = dishesData.filter(
      dish => dish.name.toLowerCase().includes(query) || 
              dish.country.toLowerCase().includes(query)
    );
    
    setFilteredDishes(filtered);
    setHasSearched(true);
  };
  
  // Get detailed dish info
  const getDishDetails = (dish: Dish): Dish => {
    // In a real app, you might fetch more details from an API
    // Here we're just returning the dish as is
    return dish;
  };

  // Simplified color mapping
  const getRegionColor = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('north')) return 'from-orange-500 to-amber-600';
    if (lowerName.includes('west')) return 'from-green-500 to-emerald-600';
    if (lowerName.includes('east')) return 'from-red-500 to-rose-600';
    if (lowerName.includes('south')) return 'from-yellow-500 to-amber-500';
    if (lowerName.includes('central')) return 'from-purple-500 to-indigo-600';
    return 'from-blue-500 to-indigo-600';
  };
  
  // Search for recipes
  const searchRecipes = async (query: string) => {
    if (!query.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a dish name to search for recipes",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      // This would typically be an API call to search for recipes
      // For now, we'll simulate a search with some sample data
      
      // Sample African recipes - in a real app, this would come from an API
      const sampleRecipes: Recipe[] = [
        {
          name: "Jollof Rice",
          ingredients: [
            "2 cups long grain rice",
            "1 can (400g) crushed tomatoes",
            "2 red bell peppers",
            "2 medium onions",
            "3 tbsp tomato paste",
            "2 tbsp vegetable oil",
            "2 tsp curry powder",
            "1 tsp thyme",
            "1 tsp cayenne pepper",
            "2 bay leaves",
            "2 cups chicken stock",
            "Salt to taste"
          ],
          instructions: [
            "Blend tomatoes, red bell peppers, and one onion until smooth.",
            "Heat oil in a large pot and sauté the remaining diced onion until translucent.",
            "Add tomato paste and cook for 2-3 minutes.",
            "Pour in the blended mixture and cook for 10-15 minutes until reduced.",
            "Add all spices and seasonings, then cook for another 5 minutes.",
            "Wash rice thoroughly and add to the pot. Stir to coat with sauce.",
            "Add chicken stock, stir, and bring to a boil.",
            "Reduce heat, cover pot with foil and lid, and simmer for 25-30 minutes until rice is cooked.",
            "Fluff with a fork before serving."
          ],
          prepTime: "15 minutes",
          cookTime: "45 minutes",
          servings: 6,
          difficulty: "Medium",
          region: "West Africa",
          country: "Nigeria, Ghana, Senegal"
        },
        {
          name: "Doro Wat (Ethiopian Chicken Stew)",
          ingredients: [
            "2 lbs chicken pieces",
            "2 large onions, finely chopped",
            "4 tbsp Ethiopian spiced butter (niter kibbeh) or regular butter",
            "3 tbsp berbere spice mix",
            "4 cloves garlic, minced",
            "1 tbsp ginger, minced",
            "1 cup chicken stock",
            "4 hard-boiled eggs",
            "Salt to taste",
            "Lemon juice to taste"
          ],
          instructions: [
            "In a large pot, cook onions over low heat until deeply caramelized (about 30 minutes), stirring occasionally.",
            "Add berbere spice, garlic, and ginger. Cook for 2-3 minutes.",
            "Add butter and stir until melted.",
            "Add chicken pieces and brown on all sides.",
            "Pour in chicken stock, bring to a simmer, then reduce heat and cover.",
            "Cook for 45 minutes, until chicken is tender and sauce has thickened.",
            "Add hard-boiled eggs for the last 10 minutes of cooking.",
            "Adjust seasoning with salt and lemon juice before serving.",
            "Traditionally served with injera bread."
          ],
          prepTime: "20 minutes",
          cookTime: "1 hour 15 minutes",
          servings: 4,
          difficulty: "Medium",
          region: "East Africa",
          country: "Ethiopia"
        },
        {
          name: "Moroccan Tagine",
          ingredients: [
            "2 lbs lamb or chicken, cut into chunks",
            "2 large onions, sliced",
            "3 cloves garlic, minced",
            "2 tbsp olive oil",
            "2 tsp ground cumin",
            "2 tsp ground coriander",
            "1 tsp ground cinnamon",
            "1 tsp paprika",
            "1/2 tsp turmeric",
            "1 cup dried apricots",
            "1/2 cup green olives",
            "1/4 cup almonds, toasted",
            "2 cups chicken or vegetable stock",
            "2 tbsp honey",
            "Salt and pepper to taste",
            "Fresh cilantro for garnish"
          ],
          instructions: [
            "Heat oil in a tagine or heavy-bottomed pot.",
            "Brown meat on all sides, then remove and set aside.",
            "In the same pot, sauté onions and garlic until soft.",
            "Add all spices and cook for 1-2 minutes until fragrant.",
            "Return meat to the pot, add stock, and bring to a simmer.",
            "Cover and cook on low heat for 1.5 hours for lamb (45 minutes for chicken).",
            "Add apricots and olives, then cook for another 30 minutes.",
            "Stir in honey, season with salt and pepper.",
            "Garnish with toasted almonds and cilantro before serving.",
            "Serve with couscous or bread."
          ],
          prepTime: "20 minutes",
          cookTime: "2 hours",
          servings: 6,
          difficulty: "Medium",
          region: "North Africa",
          country: "Morocco"
        }
      ];
      
      // Filter recipes by the search query
      const results = sampleRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(query.toLowerCase()) ||
        recipe.region?.toLowerCase().includes(query.toLowerCase()) ||
        recipe.country?.toLowerCase().includes(query.toLowerCase())
      );
      
      setRecipeResults(results);
      
      if (results.length === 0) {
        toast({
          title: "No Recipes Found",
          description: `We couldn't find any recipes for "${query}". Try another search term.`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
      toast({
        title: "Search Error",
        description: "Failed to search for recipes. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">Error Loading Cuisine Information</h1>
        <p className="text-gray-600 mb-6">We couldn't load information about African cuisines. Please try again later.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">{data.description}</p>
      </div>
      
      {/* Recipe Search Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <ChefHat className="h-6 w-6 mr-2 text-primary" />
          Find African Recipes
        </h2>
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <p className="text-gray-600 mb-4">Search for authentic African recipes to cook at home.</p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input 
                    placeholder="Search for dishes, regions, or countries..." 
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && searchRecipes(searchQuery)}
                  />
                </div>
                <Button 
                  onClick={() => searchRecipes(searchQuery)}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>
              </div>
            </div>
            
            {recipeResults.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Search Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipeResults.map((recipe, index) => (
                    <Card 
                      key={index} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getRegionColor(recipe.region || '')} flex items-center justify-center mr-4`}>
                            <Utensils className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold">{recipe.name}</h4>
                            <p className="text-xs text-gray-500">
                              {recipe.region}{recipe.country ? ` • ${recipe.country}` : ''}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs mt-2">
                          {recipe.prepTime && recipe.cookTime && (
                            <span className="mr-3">⏱ {recipe.prepTime} prep • {recipe.cookTime} cook</span>
                          )}
                          {recipe.difficulty && (
                            <span>📊 {recipe.difficulty} difficulty</span>
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Regional Cuisines */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <MapPin className="h-6 w-6 mr-2 text-primary" />
          Regional African Cuisines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.cuisines.map((cuisine, index) => (
            <Card key={index} className="overflow-hidden">
              <div className={`h-32 bg-gradient-to-r ${getRegionColor(cuisine.name)} flex items-center justify-center`}>
                <h3 className="text-xl font-bold text-white">{cuisine.name}</h3>
              </div>
              <CardContent className="p-5">
                <p className="text-gray-600 text-sm mb-4">{cuisine.description}</p>
                {cuisine.country && (
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Countries:</span> {cuisine.country}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Utensils className="h-6 w-6 mr-2 text-primary" />
          Popular African Dishes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.popularDishes.map((dish, index) => (
            <Card key={index} className="flex flex-col md:flex-row overflow-hidden">
              <div className={`w-full md:w-1/3 bg-gradient-to-r ${getRegionColor(dish.country || '')} flex items-center justify-center p-6`}>
                <h3 className="text-xl font-bold text-white text-center">{dish.name}</h3>
              </div>
              <CardContent className="p-5 flex-1">
                <p className="text-gray-600 text-sm mb-2">{dish.description}</p>
                {dish.country && (
                  <div className="text-xs text-gray-500 mt-auto">
                    <span className="font-medium">Origin:</span> {dish.country}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Recipe Details Dialog */}
      <Dialog open={!!selectedRecipe} onOpenChange={(open) => !open && setSelectedRecipe(null)}>
        {selectedRecipe && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedRecipe.name}</DialogTitle>
              <DialogDescription>
                {selectedRecipe.region}{selectedRecipe.country ? ` • ${selectedRecipe.country}` : ''}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="md:col-span-1">
                <h3 className="font-bold mb-2">Ingredients</h3>
                <ul className="space-y-1 text-sm">
                  {selectedRecipe.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-1 h-1 rounded-full bg-primary mt-2 mr-2"></div>
                      {ingredient}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    <span className="block">⏱ Prep Time: {selectedRecipe.prepTime || 'Not specified'}</span>
                    <span className="block">⏱ Cook Time: {selectedRecipe.cookTime || 'Not specified'}</span>
                    <span className="block">👥 Servings: {selectedRecipe.servings || 'Not specified'}</span>
                    <span className="block">📊 Difficulty: {selectedRecipe.difficulty || 'Not specified'}</span>
                  </p>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="font-bold mb-2">Instructions</h3>
                <ol className="space-y-2 text-sm">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex">
                      <span className="font-bold mr-2">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={() => setSelectedRecipe(null)} variant="outline">Close</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Interesting Facts */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Info className="h-6 w-6 mr-2 text-primary" />
          Interesting Facts About African Cuisine
        </h2>
        <Card>
          <CardContent className="p-6">
            <ul className="space-y-4">
              {data.facts.map((fact, index) => (
                <li key={index} className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{fact}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Dish Explorer Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Utensils className="h-6 w-6 mr-2 text-primary" />
          African Dishes Explorer
        </h2>
        
        {isDishesLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : dishesError ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 mb-4">Sorry, we couldn't load the African dishes information.</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Search for Dishes</h3>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input 
                        placeholder="Search by dish name or country..." 
                        value={dishSearchQuery}
                        onChange={(e) => setDishSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleDishSearch()}
                      />
                    </div>
                    <Button onClick={handleDishSearch}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
                
                {hasSearched && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Search Results</h3>
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
            
            {/* Dishes by Country */}
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Browse by Country
            </h3>
            
            {Object.entries(dishesByCountry).map(([country, dishes]) => (
              <div key={country} className="mb-8">
                <h4 className="text-lg font-semibold mb-4 border-b pb-2">{country}</h4>
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
          </>
        )}
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
                <p className="text-gray-700">{selectedDish.description || 'No description available.'}</p>
              </div>
              
              <div>
                {selectedDish.ingredients && selectedDish.ingredients.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-lg flex items-center mb-2">
                      <Info className="h-5 w-5 mr-2 text-primary" />
                      Ingredients
                    </h3>
                    <ul className="space-y-1 text-sm">
                      {selectedDish.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1 h-1 rounded-full bg-primary mt-2 mr-2"></div>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedDish.recipe && (
                  <div>
                    <h3 className="font-bold text-lg flex items-center mb-2">
                      <ChefHat className="h-5 w-5 mr-2 text-primary" />
                      Recipe Overview
                    </h3>
                    <p className="text-sm text-gray-700">{selectedDish.recipe}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={() => setSelectedDish(null)} variant="outline">Close</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Call to Action */}
      <div className="bg-primary/10 rounded-lg p-8 text-center mb-10">
        <h2 className="text-2xl font-bold mb-4">Experience African Cuisine</h2>
        <p className="text-gray-600 mb-6">Discover authentic African restaurants and dishes near you.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/restaurants">
            <Button className="min-w-[180px]">Find Restaurants</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}