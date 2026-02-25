import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "iGame Platform | VNX Platforms",
  description: "Next-generation gaming platform with immersive experiences",
};

export default function IgamePage() {
  return (
    <ToolPageTemplate
      title="iGame Platform"
      description="Next-generation gaming platform with immersive experiences"
      category="Gaming & Entertainment"
      gradient="from-violet-600 to-purple-600"
      features={[
        { title: "HD Gaming", description: "High-quality graphics and smooth gameplay" },
        { title: "Cross-Platform", description: "Play across multiple devices seamlessly" },
        { title: "Community Hub", description: "Connect with gamers worldwide" },
        { title: "Tournaments", description: "Participate in competitive gaming events" },
        { title: "Streaming", description: "Watch and stream gameplay" },
        { title: "In-Game Chat", description: "Communicate with teammates in real-time" },
      ]}
      comingSoon={true}
    />
  );
}
