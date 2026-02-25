import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "TalkConnect | VNX Platforms",
  description: "Modern communication platform for teams and communities",
};

export default function TalkconnectPage() {
  return (
    <ToolPageTemplate
      title="TalkConnect"
      description="Modern communication platform for teams and communities"
      category="Communication"
      gradient="from-blue-600 to-indigo-600"
      features={[
        { title: "Voice & Video", description: "Crystal-clear audio and video calls" },
        { title: "Team Channels", description: "Organized spaces for different topics" },
        { title: "File Sharing", description: "Share documents and media easily" },
        { title: "Screen Sharing", description: "Present and collaborate visually" },
        { title: "End-to-End Encryption", description: "Secure and private conversations" },
        { title: "Mobile Apps", description: "Stay connected on the go" },
      ]}
      comingSoon={true}
    />
  );
}
