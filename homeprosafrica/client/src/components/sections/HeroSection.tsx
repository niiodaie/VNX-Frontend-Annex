import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";
import LocationCurrencySelector from "@/components/LocationCurrencySelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HeroSection() {
  const [selectedService, setSelectedService] = useState("");
  const [location, setLocation] = useState("");
  
  const { data: services } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const handleSearch = () => {
    console.log("Searching for:", { service: selectedService, location });
    // This would typically navigate to search results
  };

  return (
    <section className="relative h-[650px] flex items-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1580894894513-541e068a3e2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
        alt="African home with professional service" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="container mx-auto px-4 text-center relative z-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading mb-6">
          Find Trusted Pros for Your Home Projects in Africa
        </h1>
        <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
          Connect with skilled professionals who can handle all your home maintenance needs with quality and care.
        </p>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="mb-4">
              <LocationCurrencySelector />
            </div>
            
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="w-full p-3">
                    <SelectValue placeholder="What service do you need?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {services?.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Input 
                  type="text" 
                  placeholder="Enter your location" 
                  className="w-full p-6" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button 
                className="bg-primary text-white hover:bg-primary/90 py-6 font-semibold"
                onClick={handleSearch}
              >
                Find Professionals
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
