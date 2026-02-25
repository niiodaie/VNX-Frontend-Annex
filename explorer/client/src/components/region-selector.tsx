import { Card, CardContent } from "@/components/ui/card";
import { continents } from "@/data/destinations";

interface RegionSelectorProps {
  onSelectRegion: (continentId: string) => void;
}

export default function RegionSelector({ onSelectRegion }: RegionSelectorProps) {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Discover By Region
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your continent and start exploring
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {continents.map((continent) => (
            <Card
              key={continent.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-200"
              onClick={() => onSelectRegion(continent.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {continent.emoji}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {continent.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {continent.description}
                </p>
                <div className="text-vnx-blue-600 font-medium text-sm">
                  {continent.destinationCount.toLocaleString()} destinations
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
