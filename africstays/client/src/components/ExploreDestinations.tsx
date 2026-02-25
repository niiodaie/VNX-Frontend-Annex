import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import DestinationCard from "./DestinationCard";
import { Destination } from "@shared/schema";

const ExploreDestinations = () => {
  const { data: destinations, isLoading, error } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Explore Africa's Destinations</h2>
          <p className="text-lg text-neutral max-w-2xl mx-auto">
            Discover the diverse landscapes, cultures, and experiences across the continent
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden h-72 animate-pulse bg-gray-300"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Failed to load destinations. Please try again later.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations?.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button className="px-6 py-3 bg-white border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition">
                View All Destinations
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ExploreDestinations;
