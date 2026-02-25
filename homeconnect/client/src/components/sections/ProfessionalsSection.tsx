import { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Skeleton 
} from "@/components/ui/skeleton";
import { 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  StarHalf
} from "lucide-react";
import { Professional } from "@shared/schema";

interface ProfessionalsSectionProps {
  professionals: Professional[];
  isLoading: boolean;
}

export default function ProfessionalsSection({ professionals, isLoading }: ProfessionalsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  
  const totalPages = Math.ceil(professionals.length / itemsPerPage);
  const currentProfessionals = professionals.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  return (
    <section id="professionals" className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Meet Our Trusted Pros</h2>
          <p className="text-gray-medium max-w-2xl mx-auto">
            Our network includes vetted professionals with proven expertise and excellent customer reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="professionals-container">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <ProfessionalCardSkeleton key={index} />
            ))
          ) : professionals.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-medium">No professionals found.</p>
            </div>
          ) : (
            // Professional cards
            currentProfessionals.map((pro) => (
              <ProfessionalCard key={pro.id} professional={pro} />
            ))
          )}
        </div>

        {professionals.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                size="icon"
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-light"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline"
                size="icon"
                onClick={goToNextPage}
                disabled={currentPage >= totalPages - 1}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-light"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

interface ProfessionalCardProps {
  professional: Professional;
}

function ProfessionalCard({ professional }: ProfessionalCardProps) {
  // Parse the rating to a number (handling both string and number types)
  const ratingValue = typeof professional.rating === 'string' 
    ? parseFloat(professional.rating) 
    : professional.rating;
  
  // Parse verifications from JSON string if it's a string
  const verificationsList = typeof professional.verifications === 'string'
    ? JSON.parse(professional.verifications)
    : professional.verifications || [];
  
  // Create the star rating based on the professional's rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400" />);
    }
    
    return stars;
  };

  return (
    <Card className="overflow-hidden shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <img 
            src={professional.imageUrl}
            alt={professional.name}
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
          <div>
            <h3 className="text-xl font-semibold font-heading">{professional.name}</h3>
            <p className="text-secondary">{professional.profession}</p>
          </div>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {renderStars(ratingValue)}
          </div>
          <span className="ml-2 text-gray-medium">
            {ratingValue.toFixed(1)} ({professional.reviewCount} reviews)
          </span>
        </div>

        <p className="text-gray-medium mb-4">{professional.bio}</p>
        
        <ul className="mb-4">
          {verificationsList.map((verification: string, index: number) => (
            <li key={index} className="flex items-center mb-1">
              <CheckCircle2 className="text-green-500 mr-2 h-5 w-5" />
              <span>{verification}</span>
            </li>
          ))}
        </ul>

        <Button className="w-full bg-primary text-white hover:bg-primary/90">
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
}

function ProfessionalCardSkeleton() {
  return (
    <Card className="overflow-hidden shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Skeleton className="w-16 h-16 rounded-full mr-4" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        
        <div className="flex items-center mb-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16 ml-2" />
        </div>

        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
