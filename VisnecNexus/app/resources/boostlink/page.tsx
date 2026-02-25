import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "BoostLink | VNX Resources",
  description: "Smart link management and analytics platform",
};

export default function BoostlinkPage() {
  return (
    <ToolPageTemplate
      title="BoostLink"
      description="Smart link management and analytics platform"
      category="Link Management"
      gradient="from-purple-600 to-pink-600"
      features={[
        { title: "Short Links", description: "Create branded short links" },
        { title: "Link Analytics", description: "Track clicks, sources, and engagement" },
        { title: "QR Codes", description: "Generate QR codes for your links" },
        { title: "Custom Domains", description: "Use your own domain for links" },
        { title: "Link Retargeting", description: "Retarget visitors with pixels" },
        { title: "Team Collaboration", description: "Manage links as a team" },
      ]}
      comingSoon={true}
    />
  );
}
