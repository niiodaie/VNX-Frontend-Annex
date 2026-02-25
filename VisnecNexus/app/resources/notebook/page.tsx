import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "VNX Notebook | VNX Resources",
  description: "Powerful note-taking and knowledge management platform",
};

export default function NotebookPage() {
  return (
    <ToolPageTemplate
      title="VNX Notebook"
      description="Powerful note-taking and knowledge management platform"
      category="Productivity"
      gradient="from-indigo-600 to-blue-600"
      features={[
        { title: "Rich Text Editor", description: "Format your notes beautifully" },
        { title: "Organization", description: "Folders, tags, and search" },
        { title: "Collaboration", description: "Share and collaborate on notes" },
        { title: "Sync Across Devices", description: "Access notes anywhere" },
        { title: "Templates", description: "Pre-built templates for common use cases" },
        { title: "Export Options", description: "Export to PDF, Markdown, and more" },
      ]}
      comingSoon={true}
    />
  );
}
