import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "AfricaStays | VNX Directories",
  description: "Discover and book unique accommodations across Africa",
};

export default function AfricastaysPage() {
  return (
    <ToolPageTemplate
      title="AfricaStays"
      description="Discover and book unique accommodations across Africa"
      category="Travel & Accommodation"
      gradient="from-green-600 to-emerald-600"
      features={[
        { title: "Verified Listings", description: "Curated and verified accommodation options" },
        { title: "Local Experiences", description: "Authentic stays with local hosts" },
        { title: "Secure Booking", description: "Safe and easy reservation system" },
        { title: "Travel Guides", description: "Insider tips for African destinations" },
        { title: "Reviews & Ratings", description: "Honest feedback from travelers" },
        { title: "24/7 Support", description: "Customer service whenever you need it" },
      ]}
      comingSoon={true}
    />
  );
}
