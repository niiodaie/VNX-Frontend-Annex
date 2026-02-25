import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "EventMaster Pro | VNX Platforms",
  description: "Professional event management and ticketing platform",
};

export default function EventMasterProPage() {
  return (
    <ToolPageTemplate
      title="EventMaster Pro"
      description="Plan, manage, and execute successful events with our comprehensive event management platform"
      category="Event Management"
      gradient="from-green-600 to-teal-600"
      features={[
        { title: "Event Planning", description: "Comprehensive tools for planning events of any size" },
        { title: "Ticketing System", description: "Integrated ticketing with QR codes and validation" },
        { title: "Attendee Management", description: "Track registrations, check-ins, and attendee data" },
        { title: "Marketing Tools", description: "Promote your events with built-in marketing features" },
        { title: "Analytics Dashboard", description: "Real-time insights into event performance" },
        { title: "Payment Processing", description: "Secure payment integration for ticket sales" },
      ]}
      comingSoon={true}
    />
  );
}
