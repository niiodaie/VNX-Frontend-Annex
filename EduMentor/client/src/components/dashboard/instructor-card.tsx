import { useState } from "react";
import { useLocation } from "wouter";
import { Star, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InstructorCardProps {
  instructor: {
    id: number;
    name: string;
    appearance: string;
    subjectSpecialties: number[];
    rating: number;
    ratingCount: number;
    language: string;
  };
}

const InstructorCard = ({ instructor }: InstructorCardProps) => {
  const [, setLocation] = useLocation();
  
  // Format rating from 0-50 scale to 0-5 scale
  const formattedRating = (instructor.rating / 10).toFixed(1);
  
  // Simple mapping for subject specialties
  const specialtyNames: Record<number, string> = {
    1: "Mathematics",
    2: "English",
    3: "Physics",
    4: "Languages"
  };

  // Handle starting a session with this instructor
  const handleStartSession = () => {
    // In a real app, this would find an appropriate course for this instructor
    // and redirect to the classroom
    const courseId = instructor.subjectSpecialties[0] || 1;
    setLocation(`/classroom/${courseId}/1`);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative">
        <img 
          className="h-40 w-full object-cover" 
          src={instructor.appearance} 
          alt={`${instructor.name} - AI instructor`} 
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-900 to-transparent p-4">
          <div className="flex flex-wrap items-center gap-1">
            {instructor.subjectSpecialties.map(specialtyId => (
              <Badge 
                key={specialtyId}
                variant="outline" 
                className="bg-opacity-20 text-white border-white/30 backdrop-blur-sm"
              >
                {specialtyNames[specialtyId] || `Subject ${specialtyId}`}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-neutral-900 font-heading">{instructor.name}</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Specializes in {instructor.subjectSpecialties.map(id => specialtyNames[id] || `Subject ${id}`).join(', ')}
        </p>
        
        <div className="mt-4 flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${
                  i < Math.floor(Number(formattedRating)) 
                    ? "text-yellow-400 fill-current" 
                    : i < Math.ceil(Number(formattedRating)) 
                      ? "text-yellow-400 fill-current opacity-50" 
                      : "text-neutral-300"
                }`} 
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-neutral-500">
            {formattedRating} ({instructor.ratingCount} ratings)
          </span>
        </div>
        
        <div className="mt-4">
          <button 
            onClick={handleStartSession}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Play className="mr-2 h-5 w-5" />
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorCard;
