import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { SearchIcon, CalendarIcon, UserIcon } from "@/lib/icons";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@shared/schema";
import { format } from "date-fns";

const Explore = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  
  const [locationFilter, setLocationFilter] = useState<string>(searchParams.get("q") || "");
  const [checkInFilter, setCheckInFilter] = useState<Date | undefined>(
    searchParams.get("checkIn") ? new Date(searchParams.get("checkIn") as string) : undefined
  );
  const [checkOutFilter, setCheckOutFilter] = useState<Date | undefined>(
    searchParams.get("checkOut") ? new Date(searchParams.get("checkOut") as string) : undefined
  );
  const [guestsFilter, setGuestsFilter] = useState<string>(searchParams.get("guests") || "1");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  
  // Build query string based on filters
  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (locationFilter) params.append("q", locationFilter);
    if (checkInFilter) params.append("checkIn", checkInFilter.toISOString());
    if (checkOutFilter) params.append("checkOut", checkOutFilter.toISOString());
    if (guestsFilter) params.append("guests", guestsFilter);
    return params.toString();
  };
  
  const { data: properties, isLoading, error, refetch } = useQuery<Property[]>({
    queryKey: [`/api/search?${buildQueryString()}`],
  });
  
  useEffect(() => {
    document.title = "Explore Accommodations | ExploreAfrica";
  }, []);
  
  const handleSearch = () => {
    refetch();
  };
  
  const filteredProperties = properties?.filter(property => {
    let matchesFilters = true;
    
    if (minPrice && Number(property.price) < Number(minPrice)) {
      matchesFilters = false;
    }
    
    if (maxPrice && Number(property.price) > Number(maxPrice)) {
      matchesFilters = false;
    }
    
    if (propertyType && property.propertyType !== propertyType) {
      matchesFilters = false;
    }
    
    return matchesFilters;
  });

  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Find your African adventure</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-4 bg-white rounded-xl shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral mb-1">Location</label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 text-neutral w-5 h-5" />
                <Input 
                  type="text" 
                  placeholder="Where are you going?" 
                  className="w-full pl-10"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral mb-1">Check-in Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer">
                    <CalendarIcon className="absolute left-3 top-3 text-neutral w-5 h-5" />
                    <Input 
                      type="text" 
                      placeholder="Select date" 
                      className="w-full pl-10"
                      value={checkInFilter ? format(checkInFilter, "MMM dd, yyyy") : ""}
                      readOnly
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkInFilter}
                    onSelect={setCheckInFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral mb-1">Check-out Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer">
                    <CalendarIcon className="absolute left-3 top-3 text-neutral w-5 h-5" />
                    <Input 
                      type="text" 
                      placeholder="Select date" 
                      className="w-full pl-10"
                      value={checkOutFilter ? format(checkOutFilter, "MMM dd, yyyy") : ""}
                      readOnly
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOutFilter}
                    onSelect={setCheckOutFilter}
                    disabled={(date) => 
                      (checkInFilter ? date <= checkInFilter : false) || 
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral mb-1">Guests</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-neutral w-5 h-5" />
                <Select value={guestsFilter} onValueChange={setGuestsFilter}>
                  <SelectTrigger className="w-full pl-10">
                    <SelectValue placeholder="Select guests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Guest</SelectItem>
                    <SelectItem value="2">2 Guests</SelectItem>
                    <SelectItem value="3">3 Guests</SelectItem>
                    <SelectItem value="4">4 Guests</SelectItem>
                    <SelectItem value="5">5+ Guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-end">
              <Button 
                className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition"
                onClick={handleSearch}
              >
                <SearchIcon className="mr-2 w-5 h-5" /> Search
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1 bg-white rounded-xl shadow-md p-4 h-fit">
          <h2 className="font-bold text-lg mb-4">Filters</h2>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Price Range</h3>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input 
                  type="number" 
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input 
                  type="number" 
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Property Type</h3>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="Lodge">Lodge</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Cabin">Cabin</SelectItem>
                <SelectItem value="Treehouse">Treehouse</SelectItem>
                <SelectItem value="Hut">Traditional Hut</SelectItem>
                <SelectItem value="Riad">Riad</SelectItem>
                <SelectItem value="Desert Camp">Desert Camp</SelectItem>
                <SelectItem value="Bungalow">Bungalow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator className="my-4" />
          
          <div className="mb-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setMinPrice("");
                setMaxPrice("");
                setPropertyType("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden h-80 animate-pulse">
                  <div className="bg-gray-300 h-48 w-full"></div>
                  <div className="p-4 space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-8">
              Failed to load properties. Please try again later.
            </div>
          ) : filteredProperties?.length === 0 ? (
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold mb-2">No properties found</h2>
              <p className="text-neutral mb-4">Try adjusting your search filters to find more options.</p>
              <Button 
                variant="outline"
                onClick={() => {
                  setLocationFilter("");
                  setCheckInFilter(undefined);
                  setCheckOutFilter(undefined);
                  setGuestsFilter("1");
                  setMinPrice("");
                  setMaxPrice("");
                  setPropertyType("");
                  
                  setTimeout(() => {
                    refetch();
                  }, 100);
                }}
              >
                Reset Search
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-medium">Found {filteredProperties?.length} properties</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties?.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
