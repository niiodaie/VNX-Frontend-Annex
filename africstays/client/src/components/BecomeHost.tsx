import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/lib/icons";

const hostBenefits = [
  "Earn extra income by sharing your property",
  "Meet interesting people from around the globe",
  "Share your local knowledge and culture",
  "Receive support from our dedicated host team"
];

const hostTestimonials = [
  {
    name: "Kwame",
    location: "Cape Town, South Africa",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    testimonial: "Hosting on ExploreAfrica has been transformative for my business. I've welcomed guests from all over the world and shared the beauty of my country with them."
  },
  {
    name: "Amara",
    location: "Marrakech, Morocco",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
    testimonial: "The extra income has helped me restore my family's traditional riad. The platform is easy to use and the support team is always available when I need help."
  },
  {
    name: "Samuel",
    location: "Nairobi, Kenya",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    testimonial: "I started with just one room, and now I manage three properties! The flexible hosting options allowed me to grow at my own pace and build a sustainable business."
  }
];

const BecomeHost = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-secondary rounded-2xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">Become a Host</h2>
              <p className="text-lg mb-8 opacity-90">
                Share your space, showcase your culture, and earn income by hosting travelers from around the world.
              </p>
              <ul className="mb-8 space-y-4">
                {hostBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="text-accent mt-1 mr-3 flex-shrink-0" width={20} height={20} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button className="inline-block px-6 py-3 bg-white text-secondary rounded-lg font-medium hover:bg-opacity-90 transition w-full md:w-auto text-center">
                Get Started
              </Button>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945" 
                alt="Become a Host" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <h3 className="text-2xl font-bold font-heading mb-8 text-center">Testimonials from Successful Hosts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hostTestimonials.map((testimonial, index) => (
              <div key={index} className="bg-neutral-light p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-neutral">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-neutral-dark">{testimonial.testimonial}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeHost;
