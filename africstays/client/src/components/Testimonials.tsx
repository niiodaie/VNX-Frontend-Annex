import { useQuery } from "@tanstack/react-query";
import { StarIcon } from "@/lib/icons";
import { Testimonial } from "@shared/schema";

const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarIcon key={i} className="text-accent" width={16} height={16} />);
  }

  if (hasHalfStar) {
    stars.push(
      <svg 
        key="half" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-accent"
      >
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"
          fill="currentColor"
          clipPath="inset(0 50% 0 0)"
        />
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"
          stroke="currentColor"
          fill="none"
          clipPath="inset(0 0 0 50%)"
        />
      </svg>
    );
  }

  return stars;
};

const Testimonials = () => {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">What Our Guests Say</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Hear from travelers who have experienced unforgettable stays across Africa
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl bg-white bg-opacity-10 p-6 animate-pulse h-64">
                <div className="h-4 bg-white bg-opacity-30 rounded w-1/4 mb-6"></div>
                <div className="h-4 bg-white bg-opacity-30 rounded w-full mb-2"></div>
                <div className="h-4 bg-white bg-opacity-30 rounded w-full mb-2"></div>
                <div className="h-4 bg-white bg-opacity-30 rounded w-3/4 mb-6"></div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white bg-opacity-30 mr-4"></div>
                  <div>
                    <div className="h-4 bg-white bg-opacity-30 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-white bg-opacity-30 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-200">
            Failed to load testimonials. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials?.map((testimonial) => (
              <div key={testimonial.id} className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                <div className="flex text-accent mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="mb-6 opacity-90">{testimonial.comment}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.userImage || 'https://via.placeholder.com/100'} 
                      alt={testimonial.userName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.userName}</h4>
                    <p className="text-sm opacity-75">{testimonial.userCountry}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
