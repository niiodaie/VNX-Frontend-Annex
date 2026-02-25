"use client";

import Link from "next/link";
import { 
  Wrench, Layers, FolderTree, BookOpen, Users, ShoppingCart,
  BarChart, Compass, TrendingUp, Rocket, Globe
} from "lucide-react";

const iconMap: Record<string, any> = {
  Wrench, Layers, FolderTree, BookOpen, Users, ShoppingCart,
  BarChart, Compass, TrendingUp, Rocket, Globe
};

export default function PillarsSection() {
  const pillars = [
    {
      id: "tools",
      path: "/tools",
      icon: "Wrench",
      title: "Tools",
      description: "Handy utilities that solve real-world problems",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "platforms",
      path: "/platforms",
      icon: "Layers",
      title: "Platforms",
      description: "Interactive launchpads and service layers",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "directories",
      path: "/directories",
      icon: "FolderTree",
      title: "Directories",
      description: "Discover niche resources by category",
      gradient: "from-purple-500 to-violet-500",
    },
    {
      id: "resources",
      path: "/resources",
      icon: "BookOpen",
      title: "Resources",
      description: "Templates, guides, and downloadable kits",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: "community",
      path: "/community",
      icon: "Users",
      title: "Community",
      description: "Peer collaboration and feedback forums",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: "marketplace",
      path: "/marketplace",
      icon: "ShoppingCart",
      title: "Marketplace",
      description: "Digital products, services, and SaaS tools",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      id: "insights",
      path: "/insights",
      icon: "BarChart",
      title: "Insights",
      description: "Trends, forecasts, and business analytics",
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      id: "experiences",
      path: "/experiences",
      icon: "Compass",
      title: "Experiences",
      description: "Immersive digital journeys and exploration",
      gradient: "from-yellow-500 to-amber-500",
    },
    {
      id: "trends",
      path: "/trends",
      icon: "TrendingUp",
      title: "Trends",
      description: "What's hot in tech, culture, and innovation",
      gradient: "from-red-500 to-pink-500",
    },
    {
      id: "ventures",
      path: "/ventures",
      icon: "Rocket",
      title: "Ventures",
      description: "Startups, investments, and opportunities",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      id: "e-services",
      path: "/e-services",
      icon: "Globe",
      title: "E-Services",
      description: "Digital services for modern global needs",
      gradient: "from-blue-600 to-indigo-600",
    },
  ];

  return (
    <section id="pillars" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            The VNX Ecosystem
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Eleven interconnected pillars designed to empower innovators, creators, and global citizens
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const IconComponent = iconMap[pillar.icon];
            return (
              <Link
                key={pillar.id}
                href={pillar.path}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 hover:border-transparent overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

