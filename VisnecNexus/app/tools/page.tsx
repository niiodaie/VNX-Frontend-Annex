import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Wrench, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Tools | VNX",
  description: "Discover powerful utilities and tools for productivity and innovation",
};

const tools = [
  {
    name: "VNX Netscan",
    href: "/tools/netscan",
    description: "Network diagnostic tool for IP lookup, geolocation, and security analysis",
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    name: "Snap Toolkit",
    href: "/tools/snap-toolkit",
    description: "All-in-one toolkit for image optimization and file management",
    gradient: "from-cyan-600 to-teal-600",
  },
  {
    name: "ScamShield",
    href: "/tools/scamshield",
    description: "AI-powered scam detection and protection platform",
    gradient: "from-red-600 to-orange-600",
  },
  {
    name: "Search Trend Analyzer",
    href: "/tools/search-analyzer",
    description: "Analyze search trends and discover SEO insights",
    gradient: "from-purple-600 to-pink-600",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Wrench className="w-16 h-16 mx-auto mb-6 text-white" />
          <h1 className="text-5xl font-bold text-white mb-6">VNX Tools</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Powerful utilities for productivity, security, and innovation
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} mb-4 group-hover:scale-110 transition-transform`} />
                <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600">
                  {tool.name}
                </h2>
                <p className="text-slate-600 mb-4">{tool.description}</p>
                <div className="flex items-center text-purple-600 font-semibold">
                  Learn More
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

