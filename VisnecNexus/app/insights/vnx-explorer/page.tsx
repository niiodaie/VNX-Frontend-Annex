import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "VNX Explorer | VNX Insights",
  description: "Explore and discover insights across the VNX ecosystem",
};

export default function VnxexplorerPage() {
  return (
    <ToolPageTemplate
      title="VNX Explorer"
      description="Explore and discover insights across the VNX ecosystem"
      category="Analytics & Insights"
      gradient="from-indigo-600 to-purple-600"
      features={[
        { title: "Ecosystem Overview", description: "Comprehensive view of VNX tools and platforms" },
        { title: "Usage Analytics", description: "Track usage patterns and trends" },
        { title: "Discovery Engine", description: "Find tools and resources you need" },
        { title: "Integration Insights", description: "See how tools work together" },
        { title: "Performance Metrics", description: "Monitor system performance" },
        { title: "Custom Reports", description: "Generate tailored analytics reports" },
      ]}
      comingSoon={true}
    />
  );
}
