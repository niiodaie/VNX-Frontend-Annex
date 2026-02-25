import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "HomeCare Connect | VNX Experiences",
  description: "Connect with trusted home care and domestic services",
};

export default function HomecareconnectPage() {
  return (
    <ToolPageTemplate
      title="HomeCare Connect"
      description="Connect with trusted home care and domestic services"
      category="Home Services"
      gradient="from-teal-600 to-green-600"
      features={[
        { title: "Verified Professionals", description: "Background-checked service providers" },
        { title: "Service Booking", description: "Easy online booking and scheduling" },
        { title: "Multiple Services", description: "Cleaning, repairs, gardening, and more" },
        { title: "Ratings & Reviews", description: "Transparent feedback system" },
        { title: "Secure Payments", description: "Safe and convenient payment options" },
        { title: "24/7 Support", description: "Customer support when you need it" },
      ]}
      comingSoon={true}
    />
  );
}
