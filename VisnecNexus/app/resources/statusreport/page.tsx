import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "Status Report | VNX Resources",
  description: "Real-time system status monitoring and incident reporting",
};

export default function StatusreportPage() {
  return (
    <ToolPageTemplate
      title="Status Report"
      description="Real-time system status monitoring and incident reporting"
      category="Monitoring & Status"
      gradient="from-cyan-600 to-blue-600"
      features={[
        { title: "Live Status", description: "Real-time system health monitoring" },
        { title: "Incident Tracking", description: "Track and manage service incidents" },
        { title: "Uptime Reports", description: "Historical uptime and performance data" },
        { title: "Notifications", description: "Get alerted about status changes" },
        { title: "Public Status Page", description: "Share status with your users" },
        { title: "API Integration", description: "Integrate with your existing tools" },
      ]}
      comingSoon={true}
    />
  );
}
