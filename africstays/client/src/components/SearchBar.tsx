import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { SearchIcon, CalendarIcon, UserIcon } from "@/lib/icons";
import { format } from "date-fns";

interface SearchBarProps {
  className?: string;
}

const SearchBar = ({ className }: SearchBarProps) => {
  const [searchLocation, setSearchLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState("1");
  const [, setLocation] = useLocation();

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchLocation) searchParams.append("q", searchLocation);
    if (checkIn) searchParams.append("checkIn", checkIn.toISOString());
    if (checkOut) searchParams.append("checkOut", checkOut.toISOString());
    if (guests) searchParams.append("guests", guests);
    
    setLocation(`/explore?${searchParams.toString()}`);
  };

  return (
    <div className={`bg-white rounded-xl shadow-xl p-4 ${className}`}>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 mb-4 md:mb-0 md:mr-4">
          <label className="block text-sm font-medium text-neutral mb-1">Location</label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 text-neutral w-5 h-5" />
            <Input 
              type="text" 
              placeholder="Where are you going?" 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 mb-4 md:mb-0 md:mr-4">
          <label className="block text-sm font-medium text-neutral mb-1">Check-in Date</label>
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative cursor-pointer">
                  <CalendarIcon className="absolute left-3 top-3 text-neutral w-5 h-5" />
                  <Input 
                    type="text" 
                    placeholder="Select date" 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={checkIn ? format(checkIn, "MMM dd, yyyy") : ""}
                    readOnly
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex-1 mb-4 md:mb-0 md:mr-4">
          <label className="block text-sm font-medium text-neutral mb-1">Check-out Date</label>
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative cursor-pointer">
                  <CalendarIcon className="absolute left-3 top-3 text-neutral w-5 h-5" />
                  <Input 
                    type="text" 
                    placeholder="Select date" 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={checkOut ? format(checkOut, "MMM dd, yyyy") : ""}
                    readOnly
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => 
                    (checkIn ? date < checkIn : false) || 
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex-1 mb-4 md:mb-0 md:mr-4">
          <label className="block text-sm font-medium text-neutral mb-1">Guests</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 text-neutral w-5 h-5" />
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
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
  );
};

export default SearchBar;
