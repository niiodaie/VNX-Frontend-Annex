import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "Snap Toolkit | VNX Tools",
  description: "All-in-one toolkit for image compression, resizing, and file management",
};

export default function SnapToolkitPage() {
  return (
    <ToolPageTemplate
      title="Snap Toolkit"
      description="Your all-in-one toolkit for image optimization, file management, and productivity tools"
      category="Productivity Tools"
      gradient="from-blue-600 to-cyan-600"
      features={[
        {
          title: "Image Compression",
          description: "Reduce image file sizes without losing quality using advanced compression algorithms",
        },
        {
          title: "Image Resizer",
          description: "Batch resize images to any dimension with preset options for common sizes",
        },
        {
          title: "File Merger",
          description: "Combine multiple files into a single document with ease",
        },
        {
          title: "Format Converter",
          description: "Convert between popular image and document formats instantly",
        },
        {
          title: "Batch Processing",
          description: "Process multiple files at once to save time and effort",
        },
        {
          title: "Privacy First",
          description: "All processing happens locally in your browser - your files never leave your device",
        },
      ]}
      comingSoon={true}
    />
  );
}

