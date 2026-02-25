import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Globe, Wifi, Shield, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "E-Services | Digital Solutions for Modern Needs",
  description: "Access cutting-edge digital services including global eSIM connectivity, cloud solutions, and more.",
};

export default function EServicesPage() {
  const services = [
    {
      id: "esim",
      title: "Global eSIM",
      description: "Instant digital SIM cards for travelers — skip roaming fees and stay connected anywhere.",
      icon: Globe,
      href: "/e-services/esim",
      gradient: "from-blue-600 to-indigo-600",
      badge: "🔥 Popular",
    },
    {
      id: "cloud",
      title: "Cloud Services",
      description: "Scalable cloud infrastructure and storage solutions for businesses of all sizes.",
      icon: Wifi,
      href: "#",
      gradient: "from-purple-600 to-pink-600",
      badge: "Coming Soon",
    },
    {
      id: "security",
      title: "Security Suite",
      description: "Comprehensive cybersecurity tools to protect your digital assets and privacy.",
      icon: Shield,
      href: "#",
      gradient: "from-green-600 to-teal-600",
      badge: "Coming Soon",
    },
    {
      id: "automation",
      title: "Automation Tools",
      description: "Streamline your workflows with AI-powered automation and integration services.",
      icon: Zap,
      href: "#",
      gradient: "from-orange-600 to-red-600",
      badge: "Coming Soon",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-200 text-sm mb-6">
            <Globe className="w-4 h-4" />
            <span>Digital Services for the Modern World</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            E-Services
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Discover powerful digital services designed to keep you connected, secure, and productive
            no matter where you are in the world.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Link
                  key={service.id}
                  href={service.href}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 hover:border-transparent overflow-hidden"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {service.badge}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                      {service.title}
                    </h2>
                    
                    <p className="text-slate-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

