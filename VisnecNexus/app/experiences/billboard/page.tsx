import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "Billboard Tracker | VNX Experiences",
  description: "Track and analyze outdoor advertising campaigns",
};

export default function BillboardPage() {
  return (
    <ToolPageTemplate
      title="Billboard Tracker"
      description="Track and analyze outdoor advertising campaigns"
      category="Advertising & Marketing"
      gradient="from-yellow-600 to-orange-600"
      features={[
        { title: "Billboard Locations", description: "Map and track billboard placements" },
        { title: "Campaign Analytics", description: "Measure campaign performance and reach" },
        { title: "Inventory Management", description: "Manage your advertising inventory" },
        { title: "Booking System", description: "Reserve billboard space online" },
        { title: "Performance Metrics", description: "Track impressions and engagement" },
        { title: "Competitive Analysis", description: "Monitor competitor campaigns" },
      ]}
      comingSoon={true}
    />
  );
}
