import type { Metadata } from "next";
import ToolPageTemplate from "@/components/tool-page-template";

export const metadata: Metadata = {
  title: "Search Trend Analyzer | VNX Tools",
  description: "Analyze search trends and discover insights for SEO and content strategy",
};

export default function SearchAnalyzerPage() {
  return (
    <ToolPageTemplate
      title="Search Trend Analyzer"
      description="Discover trending topics, analyze search patterns, and optimize your content strategy with data-driven insights"
      category="SEO & Analytics"
      gradient="from-purple-600 to-pink-600"
      features={[
        {
          title: "Trend Discovery",
          description: "Identify emerging trends and popular search queries in your niche",
        },
        {
          title: "Keyword Analysis",
          description: "Deep dive into keyword performance, volume, and competition metrics",
        },
        {
          title: "Competitor Insights",
          description: "Analyze what keywords your competitors are ranking for",
        },
        {
          title: "Content Opportunities",
          description: "Find content gaps and opportunities based on search data",
        },
        {
          title: "Historical Data",
          description: "Track search trends over time to identify patterns and seasonality",
        },
        {
          title: "Export Reports",
          description: "Generate comprehensive reports for your team or clients",
        },
      ]}
      comingSoon={true}
    />
  );
}

