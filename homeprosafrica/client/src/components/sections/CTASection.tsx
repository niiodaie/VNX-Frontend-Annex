import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white font-heading mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied homeowners across Africa who have found reliable professionals through our platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button 
            className="bg-white text-primary hover:bg-white/90 px-8 py-6 rounded-full font-semibold"
          >
            Find a Professional
          </Button>
          <Button 
            className="bg-accent text-white hover:bg-accent/90 px-8 py-6 rounded-full font-semibold"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
