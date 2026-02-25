import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "Training Hub | VNX Community",
  description: "Professional training and skill development platform",
};

export default function TraininghubPage() {
  return (
    <ToolPageTemplate
      title="Training Hub"
      description="Professional training and skill development platform"
      category="Education & Training"
      gradient="from-blue-600 to-purple-600"
      features={[
        { title: "Course Library", description: "Extensive collection of training courses" },
        { title: "Live Sessions", description: "Interactive live training sessions" },
        { title: "Certifications", description: "Earn recognized certificates" },
        { title: "Progress Tracking", description: "Monitor your learning journey" },
        { title: "Expert Instructors", description: "Learn from industry professionals" },
        { title: "Community Forum", description: "Connect with fellow learners" },
      ]}
      comingSoon={true}
    />
  );
}
