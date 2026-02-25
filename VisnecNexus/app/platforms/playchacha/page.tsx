import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "PlayChaCha | VNX Platforms",
  description: "Interactive gaming platform for entertainment and social connection",
};

export default function PlaychachaPage() {
  return (
    <ToolPageTemplate
      title="PlayChaCha"
      description="Interactive gaming platform for entertainment and social connection"
      category="Gaming Platform"
      gradient="from-pink-600 to-rose-600"
      features={[
        { title: "Multiplayer Games", description: "Play with friends and compete globally" },
        { title: "Social Features", description: "Chat, share, and connect with other players" },
        { title: "Leaderboards", description: "Track your progress and compete for top rankings" },
        { title: "Rewards System", description: "Earn points and unlock achievements" },
        { title: "Mobile Friendly", description: "Play on any device, anywhere" },
        { title: "Regular Updates", description: "New games and features added regularly" },
      ]}
      comingSoon={true}
    />
  );
}
