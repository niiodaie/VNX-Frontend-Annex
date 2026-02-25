import type { Metadata } from "next";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Tools | VNX",
  description: "Discover powerful utilities and tools for productivity and innovation",
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Wrench className="w-16 h-16 mx-auto mb-6 text-purple-600" />
          <h1 className="text-5xl font-bold text-slate-800 mb-6">Tools</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful utilities for productivity and innovation
          </p>
          <div className="mt-12 text-slate-500">
            Coming soon...
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

