import { useState } from "react";
import { Link } from "wouter";
import { HeartIcon, StarIcon } from "@/lib/icons";
import { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="property-card bg-white rounded-xl shadow-md overflow-hidden transition duration-300 cursor-pointer">
        <div className="relative">
          <img 
            src={property.imageUrl} 
            alt={property.title} 
            className="w-full h-48 object-cover"
          />
          <button 
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md"
            onClick={toggleLike}
          >
            <HeartIcon 
              className="text-neutral" 
              fill={liked ? "currentColor" : "none"} 
              stroke={liked ? "none" : "currentColor"}
              width={16}
              height={16}
            />
          </button>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">{property.title}</h3>
            <div className="flex items-center">
              <StarIcon className="text-accent text-sm" width={16} height={16} />
              <span className="ml-1 text-sm font-medium">{property.rating}</span>
            </div>
          </div>
          <p className="text-neutral text-sm mb-2">{property.location}, {property.country}</p>
          <p className="text-neutral text-sm mb-4">
            {property.availableStart && property.availableEnd ? 
              `Available ${new Date(property.availableStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${new Date(property.availableEnd).toLocaleDateString('en-US', { day: 'numeric' })}` : 
              'Check availability'
            }
          </p>
          <p className="font-semibold">${property.price} <span className="font-normal text-neutral">night</span></p>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
