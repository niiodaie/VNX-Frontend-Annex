import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "NexusTracker | VNX Platforms",
  description: "Comprehensive project and task management platform for teams",
};

export default function NexusTrackerPage() {
  return (
    <ToolPageTemplate
      title="NexusTracker"
      description="Streamline your project management with powerful tracking, collaboration, and reporting tools"
      category="Project Management"
      gradient="from-indigo-600 to-purple-600"
      features={[
        { title: "Task Management", description: "Create, assign, and track tasks with ease" },
        { title: "Team Collaboration", description: "Real-time collaboration features for distributed teams" },
        { title: "Progress Tracking", description: "Visual dashboards to monitor project progress" },
        { title: "Time Tracking", description: "Built-in time tracking for accurate billing and productivity" },
        { title: "Custom Workflows", description: "Adapt the platform to your team's unique processes" },
        { title: "Reporting & Analytics", description: "Generate insights with powerful reporting tools" },
      ]}
      comingSoon={true}
    />
  );
}
