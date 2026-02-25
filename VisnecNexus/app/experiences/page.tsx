import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Experiences | VNX",
  description: "Unique experiences for travel, dining, and lifestyle",
};

const items = [
  {
    name: "Flight Tracker",
    href: "/experiences/flighttracker",
    description: "Real-time flight tracking and aviation info",
    gradient: "from-sky-600 to-blue-600",
  },
  {
    name: "African Cuisine",
    href: "/experiences/africuisine",
    description: "Discover authentic African restaurants",
    gradient: "from-amber-600 to-orange-600",
  },
  {
    name: "HomeCare Connect",
    href: "/experiences/homecareconnect",
    description: "Trusted home care services",
    gradient: "from-teal-600 to-green-600",
  },
  {
    name: "Billboard Tracker",
    href: "/experiences/billboard",
    description: "Track outdoor advertising campaigns",
    gradient: "from-yellow-600 to-orange-600",
  },
];

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <section className="pt-32 pb-20 bg-gradient-to-br from-amber-600 to-orange-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-white" />
          <h1 className="text-5xl font-bold text-white mb-6">VNX Experiences</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Unique experiences for travel, dining, and lifestyle
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} mb-4 group-hover:scale-110 transition-transform`} />
                <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-pink-600">
                  {item.name}
                </h2>
                <p className="text-slate-600 mb-4">{item.description}</p>
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
