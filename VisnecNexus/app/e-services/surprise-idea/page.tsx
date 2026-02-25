import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "Surprise Idea | VNX E-Services",
  description: "Creative gift ideas and surprise planning platform",
};

export default function SurpriseideaPage() {
  return (
    <ToolPageTemplate
      title="Surprise Idea"
      description="Creative gift ideas and surprise planning platform"
      category="Gifts & Celebrations"
      gradient="from-pink-600 to-red-600"
      features={[
        { title: "Gift Ideas", description: "Personalized gift recommendations" },
        { title: "Occasion Planning", description: "Plan perfect surprises for any occasion" },
        { title: "Budget Options", description: "Ideas for every budget" },
        { title: "Local Vendors", description: "Connect with local gift providers" },
        { title: "Reminder System", description: "Never miss important dates" },
        { title: "Inspiration Gallery", description: "Browse creative surprise ideas" },
      ]}
      comingSoon={true}
    />
  );
}
