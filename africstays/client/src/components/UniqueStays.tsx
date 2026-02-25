import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Property } from "@shared/schema";

interface UniqueStayType {
  type: string;
  description: string;
  imageUrl: string;
}

const UniqueStays = () => {
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties/unique-stays"],
  });

  // Group properties by unique stay type
  const uniqueStayTypes = properties?.reduce((acc: Record<string, UniqueStayType>, property) => {
    if (property.uniqueStayType && !acc[property.uniqueStayType]) {
      acc[property.uniqueStayType] = {
        type: property.uniqueStayType,
        description: getDescriptionForType(property.uniqueStayType),
        imageUrl: property.imageUrl
      };
    }
    return acc;
  }, {});

  const uniqueStaysArray = uniqueStayTypes ? Object.values(uniqueStayTypes) : [];

  function getDescriptionForType(type: string): string {
    switch (type) {
      case 'Treehouse Retreats':
        return 'Sleep among the treetops in these eco-friendly, luxurious treehouses.';
      case 'Traditional Huts':
        return 'Experience authentic African living in modernized traditional dwellings.';
      case 'Beachside Villas':
        return 'Wake up to the sound of waves in these luxurious coastal properties.';
      case 'Desert Camps':
        return 'Stargaze in comfort with these luxury desert accommodations.';
      default:
        return 'Experience Africa like never before with these extraordinary accommodations.';
    }
  }

  return (
    <section className="py-16 bg-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Discover Unique Stays</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Experience Africa like never before with these extraordinary accommodations
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden h-64 animate-pulse bg-white bg-opacity-10"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-200">
            Failed to load unique stays. Please try again later.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {uniqueStaysArray.map((stay, index) => (
                <div key={index} className="bg-white bg-opacity-10 rounded-xl overflow-hidden backdrop-blur-sm">
                  <img 
                    src={stay.imageUrl} 
                    alt={stay.type} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{stay.type}</h3>
                    <p className="opacity-90 text-sm">{stay.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button className="px-6 py-3 bg-white text-secondary rounded-lg font-medium hover:bg-opacity-90 transition">
                Browse Unique Stays
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default UniqueStays;
