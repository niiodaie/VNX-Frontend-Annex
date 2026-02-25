import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "Flight Tracker | VNX Experiences",
  description: "Real-time flight tracking and aviation information",
};

export default function FlighttrackerPage() {
  return (
    <ToolPageTemplate
      title="Flight Tracker"
      description="Real-time flight tracking and aviation information"
      category="Travel & Aviation"
      gradient="from-sky-600 to-blue-600"
      features={[
        { title: "Live Tracking", description: "Track flights in real-time on interactive maps" },
        { title: "Flight Status", description: "Get updates on delays, cancellations, and gates" },
        { title: "Airport Info", description: "Comprehensive airport information worldwide" },
        { title: "Flight History", description: "Access historical flight data" },
        { title: "Notifications", description: "Receive alerts for flight changes" },
        { title: "Aircraft Details", description: "View detailed aircraft information" },
      ]}
      comingSoon={true}
    />
  );
}
