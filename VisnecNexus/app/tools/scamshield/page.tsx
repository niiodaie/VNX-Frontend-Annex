import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "ScamShield | VNX Tools",
  description: "Advanced scam detection and protection platform powered by AI",
};

export default function ScamShieldPage() {
  return (
    <ToolPageTemplate
      title="ScamShield"
      description="Protect yourself and your community from online scams with AI-powered threat detection and real-time alerts"
      category="Security & Protection"
      gradient="from-red-600 to-orange-600"
      features={[
        {
          title: "AI-Powered Detection",
          description: "Advanced machine learning algorithms identify and flag potential scams in real-time",
        },
        {
          title: "Community Reports",
          description: "Crowdsourced threat intelligence from a global network of users",
        },
        {
          title: "Real-Time Alerts",
          description: "Instant notifications when suspicious activity is detected",
        },
        {
          title: "Browser Extension",
          description: "Seamless protection while browsing with our lightweight extension",
        },
        {
          title: "Threat Database",
          description: "Access to comprehensive database of known scams and fraudulent sites",
        },
        {
          title: "Report & Block",
          description: "Easily report suspicious content and help protect others",
        },
      ]}
      comingSoon={true}
    />
  );
}

