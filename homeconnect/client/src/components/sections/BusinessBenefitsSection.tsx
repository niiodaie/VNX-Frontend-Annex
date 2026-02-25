import { Card, CardContent } from "@/components/ui/card";
import { 
  ShieldCheck, 
  Clock, 
  Banknote, 
  Star, 
  HeartHandshake, 
  MessageCircle 
} from "lucide-react";

export default function HomeownerBenefitsSection() {
  const benefits = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Verified Professionals",
      description: "Every pro on our platform is vetted and background-checked for your peace of mind.",
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Save Time",
      description: "Quickly find the right professional for any home service you need without endless searching.",
    },
    {
      icon: <Banknote className="h-8 w-8 text-primary" />,
      title: "Transparent Pricing",
      description: "See upfront pricing and never worry about hidden costs or surprise fees.",
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "Quality Guaranteed",
      description: "All work comes with a satisfaction guarantee to ensure your project is done right.",
    },
    {
      icon: <HeartHandshake className="h-8 w-8 text-primary" />,
      title: "Local Support",
      description: "Find skilled professionals from your local community who understand your specific needs.",
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      title: "Easy Communication",
      description: "Connect directly with professionals and maintain clear communication throughout your project.",
    },
  ];

  return (
    <section className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            FOR HOMEOWNERS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Why HomeProsAfrica is Your Home Service Solution
          </h2>
          <p className="text-gray-medium max-w-2xl mx-auto">
            We connect you with trusted professionals to address all your home care and maintenance needs with quality and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start mb-4">
                  <div className="mb-4 md:mb-0 md:mr-4 p-3 bg-primary/10 rounded-full">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 font-heading">{benefit.title}</h3>
                    <p className="text-gray-medium">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-white p-4 rounded-lg shadow-md max-w-3xl">
            <p className="text-lg font-medium mb-4">
              "I found an amazing electrician through HomeProsAfrica who fixed our entire home wiring system. The service was professional, prompt and reasonably priced."
            </p>
            <div className="flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&h=50&q=80"
                alt="Amara Okafor"
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div className="text-left">
                <p className="font-semibold">Amara Okafor</p>
                <p className="text-sm text-gray-medium">Homeowner, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}