import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon, HeartIcon, CheckIcon, SearchIcon, CalendarIcon, UserIcon } from "@/lib/icons";
import { Property } from "@shared/schema";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const PropertyDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState("1");
  const [totalPrice, setTotalPrice] = useState(0);
  
  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
  });

  useEffect(() => {
    if (property) {
      document.title = `${property.title} | ExploreAfrica`;
      
      if (checkIn && checkOut) {
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        setTotalPrice(Number(property.price) * nights);
      }
    }
  }, [property, checkIn, checkOut]);

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      toast({
        title: "Please select dates",
        description: "You need to select check-in and check-out dates to book.",
        variant: "destructive"
      });
      return;
    }

    try {
      await apiRequest("POST", "/api/bookings", {
        propertyId: property?.id,
        userId: 1, // In a real app, this would be the logged-in user's ID
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests: parseInt(guests),
        totalPrice,
        status: "pending"
      });
      
      toast({
        title: "Booking Successful!",
        description: "Your stay has been booked successfully.",
      });
      
      // Clear form
      setCheckIn(undefined);
      setCheckOut(undefined);
      setGuests("1");
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 mt-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-300 rounded w-full mb-8"></div>
          <div className="md:flex gap-8">
            <div className="md:w-2/3">
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-6"></div>
            </div>
            <div className="md:w-1/3 mt-8 md:mt-0">
              <div className="h-64 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-12 mt-16 text-center">
        <h1 className="text-2xl font-bold text-red-500">
          Property not found or error loading property details
        </h1>
        <p className="mt-4">Please try again later or return to the homepage.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
      <div className="flex items-center text-sm mb-6">
        <div className="flex items-center mr-4">
          <StarIcon className="text-accent mr-1" width={16} height={16} />
          <span>{property.rating}</span>
        </div>
        <span className="mr-4">{property.reviewCount} reviews</span>
        <span>{property.location}, {property.country}</span>
      </div>

      <div className="rounded-xl overflow-hidden h-96 mb-8">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="md:flex gap-8">
        <div className="md:w-2/3">
          <h2 className="text-2xl font-semibold mb-4">About this place</h2>
          <p className="text-neutral-dark mb-6">{property.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Bedrooms</h3>
              <p>{property.bedrooms} {property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Bathrooms</h3>
              <p>{property.bathrooms} {property.bathrooms === 1 ? 'bathroom' : 'bathrooms'}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Property Type</h3>
              <p>{property.propertyType}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Max Guests</h3>
              <p>{property.maxGuests} {property.maxGuests === 1 ? 'guest' : 'guests'}</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Location</h2>
          <p className="text-neutral-dark mb-2">{property.location}, {property.city}, {property.country}</p>
          <div className="h-48 bg-gray-200 rounded-lg mb-8">
            <div className="h-full w-full flex items-center justify-center text-gray-500">
              <SearchIcon className="mr-2" />
              <span>Map view would be displayed here</span>
            </div>
          </div>
        </div>

        <div className="md:w-1/3">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold">${property.price} <span className="text-base font-normal text-neutral">night</span></div>
                <div className="flex items-center">
                  <StarIcon className="text-accent mr-1" width={16} height={16} />
                  <span>{property.rating}</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg mb-4">
                <div className="grid grid-cols-2 divide-x divide-gray-200">
                  <div className="p-3">
                    <label className="block text-sm text-neutral mb-1">CHECK-IN</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkIn ? format(checkIn, "MMM dd, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="p-3">
                    <label className="block text-sm text-neutral mb-1">CHECK-OUT</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOut ? format(checkOut, "MMM dd, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) => 
                            (checkIn ? date <= checkIn : false) || 
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="p-3 border-t border-gray-200">
                  <label className="block text-sm text-neutral mb-1">GUESTS</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 text-neutral w-4 h-4" />
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger className="w-full pl-10">
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleBooking}
                className="w-full bg-primary text-white hover:bg-opacity-90 mb-4"
              >
                Book this stay
              </Button>

              {checkIn && checkOut && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-dark">${property.price} x {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              )}

              <div className="mt-4 text-center">
                <Button variant="outline" className="w-full">
                  <HeartIcon className="mr-2 h-4 w-4" /> Add to Wishlist
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
