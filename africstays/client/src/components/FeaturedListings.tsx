import { useQuery } from "@tanstack/react-query";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { Property } from "@shared/schema";
import { Link } from "wouter";

const FeaturedListings = () => {
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
  });

  return (
    <section className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Featured Accommodations</h2>
          <p className="text-lg text-neutral max-w-2xl mx-auto">
            Discover our hand-picked selection of extraordinary stays across Africa
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
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
          <div className="text-center text-red-500">
            Failed to load featured properties. Please try again later.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties?.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link href="/explore">
                <Button className="px-6 py-3 bg-white border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition">
                  View More Accommodations
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
