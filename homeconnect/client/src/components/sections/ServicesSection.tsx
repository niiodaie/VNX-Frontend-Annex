import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Service } from "@shared/schema";
import { Wrench, Zap, Fan, Network, Home, PaintBucket, Bolt, Truck } from "lucide-react";

interface ServicesSectionProps {
  services: Service[];
  isLoading: boolean;
}

const serviceIcons: Record<string, React.ReactNode> = {
  plumbing: <Wrench className="h-12 w-12 text-white" />,
  electrical: <Zap className="h-12 w-12 text-white" />,
  cleaning: <Fan className="h-12 w-12 text-white" />,
  landscaping: <Network className="h-12 w-12 text-white" />,
  carpentry: <Bolt className="h-12 w-12 text-white" />,
  painting: <PaintBucket className="h-12 w-12 text-white" />,
  renovation: <Home className="h-12 w-12 text-white" />,
  moving: <Truck className="h-12 w-12 text-white" />,
};

const serviceColors: Record<string, string> = {
  plumbing: "bg-secondary",
  electrical: "bg-primary",
  cleaning: "bg-accent",
  landscaping: "bg-secondary",
  carpentry: "bg-primary",
  painting: "bg-accent",
  renovation: "bg-secondary",
  moving: "bg-primary",
};

export default function ServicesSection({ services, isLoading }: ServicesSectionProps) {
  const [visibleServices, setVisibleServices] = useState(8);

  const handleViewMore = () => {
    setVisibleServices(services.length);
  };

  return (
    <section id="services" className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Our Services</h2>
          <p className="text-gray-medium max-w-2xl mx-auto">
            We connect you with skilled professionals across a wide range of home services throughout Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <ServiceCardSkeleton key={index} />
            ))
          ) : (
            // Actual service cards
            services.slice(0, visibleServices).map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                icon={serviceIcons[service.slug] || <Bolt className="h-12 w-12 text-white" />}
                bgColorClass={serviceColors[service.slug] || "bg-secondary"}
              />
            ))
          )}
        </div>

        {services.length > visibleServices && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-full"
              onClick={handleViewMore}
            >
              View All Services
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

interface ServiceCardProps {
  service: Service;
  icon: React.ReactNode;
  bgColorClass: string;
}

function ServiceCard({ service, icon, bgColorClass }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className={`h-48 ${bgColorClass} flex items-center justify-center`}>
        {icon}
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 font-heading">{service.name}</h3>
        <p className="text-gray-medium mb-4">{service.description}</p>
        <a href="#" className="text-primary font-semibold hover:underline">Learn More</a>
      </CardContent>
    </Card>
  );
}

function ServiceCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-4 w-1/4" />
      </CardContent>
    </Card>
  );
}
