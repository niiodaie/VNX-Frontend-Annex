import { Destination } from "@shared/schema";

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  return (
    <div className="relative rounded-xl overflow-hidden group cursor-pointer">
      <img 
        src={destination.imageUrl} 
        alt={destination.name} 
        className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-xl font-bold text-white mb-1">{destination.name}</h3>
        <p className="text-white opacity-90">{destination.country}</p>
      </div>
    </div>
  );
};

export default DestinationCard;
