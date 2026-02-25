import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "Startup Hub Africa | VNX Directories",
  description: "Comprehensive directory of African startups and innovation hubs",
};

export default function StartupafricaPage() {
  return (
    <ToolPageTemplate
      title="Startup Hub Africa"
      description="Comprehensive directory of African startups and innovation hubs"
      category="Startup Directory"
      gradient="from-orange-600 to-red-600"
      features={[
        { title: "Startup Listings", description: "Discover innovative African startups" },
        { title: "Investor Network", description: "Connect with investors and funding opportunities" },
        { title: "Resources", description: "Access guides, tools, and mentorship" },
        { title: "Events Calendar", description: "Stay updated on startup events across Africa" },
        { title: "Success Stories", description: "Learn from successful African entrepreneurs" },
        { title: "Networking", description: "Build connections within the ecosystem" },
      ]}
      comingSoon={true}
    />
  );
}
