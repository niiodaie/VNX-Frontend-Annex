import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "MindMate | VNX Community",
  description: "Mental wellness and mindfulness platform",
};

export default function MindmatePage() {
  return (
    <ToolPageTemplate
      title="MindMate"
      description="Mental wellness and mindfulness platform"
      category="Health & Wellness"
      gradient="from-purple-600 to-pink-600"
      features={[
        { title: "Meditation Guides", description: "Guided meditation sessions" },
        { title: "Mood Tracking", description: "Track and understand your emotions" },
        { title: "Wellness Resources", description: "Articles, tips, and exercises" },
        { title: "Community Support", description: "Connect with supportive community" },
        { title: "Professional Help", description: "Access to licensed therapists" },
        { title: "Daily Reminders", description: "Stay consistent with wellness goals" },
      ]}
      comingSoon={true}
    />
  );
}
