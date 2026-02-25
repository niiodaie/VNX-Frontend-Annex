import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Testimonial } from "@shared/schema";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  isLoading: boolean;
}

export default function TestimonialsSection({ testimonials, isLoading }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance testimonials every 8 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => 
      (prev + 1) % testimonials.length
    );
  };

  return (
    <section className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">What Our Customers Say</h2>
          <p className="text-gray-medium max-w-2xl mx-auto">
            Hear from satisfied customers across Africa who found reliable professionals through our platform.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto" id="testimonial-container">
          {isLoading ? (
            <TestimonialCardSkeleton />
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-medium">No testimonials found.</p>
            </div>
          ) : (
            <TestimonialCard testimonial={testimonials[currentIndex]} />
          )}
        </div>

        {testimonials.length > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-light"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-light"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            variant="outline"
            className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white px-6 py-3 rounded-full"
          >
            Submit Your Review
          </Button>
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const renderStars = (rating: number) => {
    return Array(rating).fill(0).map((_, i) => (
      <Star key={i} className="fill-yellow-400 text-yellow-400" />
    ));
  };

  return (
    <Card className="bg-white p-6 md:p-8 rounded-lg shadow-md transition-all duration-300">
      <CardContent className="p-0">
        <div className="flex items-center mb-6">
          <img
            src={testimonial.imageUrl}
            alt={testimonial.name}
            className="w-14 h-14 rounded-full object-cover mr-4"
          />
          <div>
            <h3 className="text-lg font-semibold font-heading">{testimonial.name}</h3>
            <p className="text-gray-medium">{testimonial.location}</p>
          </div>
          <div className="ml-auto">
            <div className="flex text-yellow-400">
              {renderStars(testimonial.rating)}
            </div>
          </div>
        </div>
        <blockquote className="text-gray-medium italic mb-4">
          "{testimonial.comment}"
        </blockquote>
        <p className="text-sm text-gray-medium">Service: {testimonial.service}</p>
      </CardContent>
    </Card>
  );
}

function TestimonialCardSkeleton() {
  return (
    <Card className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <CardContent className="p-0">
        <div className="flex items-center mb-6">
          <Skeleton className="w-14 h-14 rounded-full mr-4" />
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="ml-auto">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5 mb-4" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
}
