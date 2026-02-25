import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function PricingSection() {
  const pricingOptions = [
    {
      title: "Hourly Rates",
      description: "Many of our professionals charge by the hour, with rates varying based on:",
      features: [
        "Service type and complexity",
        "Professional's experience level",
        "Location within Africa"
      ],
      priceInfo: "Average Range: $15-50/hour"
    },
    {
      title: "Flat Fee Projects",
      description: "For specific tasks, many pros offer flat-rate pricing for:",
      features: [
        "Standard installations",
        "Common repairs",
        "Maintenance packages"
      ],
      priceInfo: "Request quotes for exact pricing"
    },
    {
      title: "Custom Projects",
      description: "For larger or customized work, professionals will:",
      features: [
        "Assess your specific needs",
        "Provide detailed quotes",
        "Offer flexible payment options"
      ],
      priceInfo: "Contact for personalized estimates"
    }
  ];

  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Fair Pricing</h2>
          <p className="text-gray-medium max-w-2xl mx-auto">
            We believe in transparent pricing with no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingOptions.map((option, index) => (
            <PricingCard
              key={index}
              title={option.title}
              description={option.description}
              features={option.features}
              priceInfo={option.priceInfo}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            className="bg-secondary text-white hover:bg-secondary/90 px-6 py-3 rounded-full"
          >
            View Complete Pricing Guide
          </Button>
        </div>
      </div>
    </section>
  );
}

interface PricingCardProps {
  title: string;
  description: string;
  features: string[];
  priceInfo: string;
}

function PricingCard({ title, description, features, priceInfo }: PricingCardProps) {
  return (
    <Card className="bg-light border border-gray-200">
      <CardContent className="p-8">
        <h3 className="text-xl font-semibold mb-4 font-heading">{title}</h3>
        <p className="text-gray-medium mb-6">{description}</p>
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="text-primary mt-1 mr-3 h-5 w-5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <p className="text-dark font-semibold">{priceInfo}</p>
      </CardContent>
    </Card>
  );
}
