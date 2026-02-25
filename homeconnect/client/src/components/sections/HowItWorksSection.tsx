import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Describe Your Project",
      description: "Tell us what you need done, when, and where your home is located."
    },
    {
      number: 2,
      title: "Get Quotes",
      description: "Receive quotes from multiple trusted professionals in your area."
    },
    {
      number: 3,
      title: "Choose the Right Pro",
      description: "Compare reviews, prices, and qualifications to select the best match."
    },
    {
      number: 4,
      title: "Get the Job Done",
      description: "Schedule the service and enjoy professional, quality work at your home."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">How It Works</h2>
          <p className="text-gray-medium max-w-2xl mx-auto">
            We make finding reliable home professionals simple and stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StepCard 
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            className="bg-primary text-white hover:bg-primary/90 px-8 py-7 rounded-full font-semibold"
          >
            Start Your Project Now
          </Button>
        </div>
      </div>
    </section>
  );
}

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  isLast: boolean;
}

function StepCard({ number, title, description, isLast }: StepCardProps) {
  return (
    <Card className="text-center p-6 border-none shadow-none relative step-card">
      <CardContent className="p-0">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
          {number}
        </div>
        <h3 className="text-xl font-semibold mb-3 font-heading">{title}</h3>
        <p className="text-gray-medium">{description}</p>
        
        {/* Line connector */}
        {!isLast && (
          <div className="hidden md:block absolute top-[30px] right-[-10%] w-[20%] h-[3px] bg-primary" />
        )}
      </CardContent>
    </Card>
  );
}
