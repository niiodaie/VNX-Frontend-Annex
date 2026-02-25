import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ProfessionalsSection from "@/components/sections/ProfessionalsSection";
import PricingSection from "@/components/sections/PricingSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
import ContactSection from "@/components/sections/ContactSection";
import AdsBannerSection from "@/components/sections/AdsBannerSection";
import HomeownerBenefitsSection from "@/components/sections/HomeownerBenefitsSection";
import { useQuery } from "@tanstack/react-query";
import { Service, Professional, Testimonial } from "@shared/schema";

export default function Home() {
  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: professionals, isLoading: professionalsLoading } = useQuery<Professional[]>({
    queryKey: ["/api/professionals"],
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="pt-16">
        <HeroSection />
        <AdsBannerSection />
        <ServicesSection services={services || []} isLoading={servicesLoading} />
        <HomeownerBenefitsSection />
        <HowItWorksSection />
        <AdsBannerSection />
        <ProfessionalsSection professionals={professionals || []} isLoading={professionalsLoading} />
        <PricingSection />
        <TestimonialsSection testimonials={testimonials || []} isLoading={testimonialsLoading} />
        <AdsBannerSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
