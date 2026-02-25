import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "African Cuisine Dining | VNX Experiences",
  description: "Discover authentic African restaurants and culinary experiences",
};

export default function AfricuisinePage() {
  return (
    <ToolPageTemplate
      title="African Cuisine Dining"
      description="Discover authentic African restaurants and culinary experiences"
      category="Food & Dining"
      gradient="from-amber-600 to-orange-600"
      features={[
        { title: "Restaurant Directory", description: "Find African restaurants near you" },
        { title: "Recipe Collection", description: "Authentic African recipes and cooking guides" },
        { title: "Reviews & Ratings", description: "Community-driven restaurant reviews" },
        { title: "Culinary Tours", description: "Guided food tours and experiences" },
        { title: "Chef Profiles", description: "Meet the chefs behind the dishes" },
        { title: "Dietary Options", description: "Filter by dietary preferences and restrictions" },
      ]}
      comingSoon={true}
    />
  );
}
