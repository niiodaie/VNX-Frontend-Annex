"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="VNX Hero Background"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-purple-900/60 to-slate-900/80" />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-20">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 bg-purple-500/30 backdrop-blur-sm border border-purple-400/40 rounded-full text-purple-100 text-sm mb-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Powering the Future of Innovation</span>
        </div>

        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 transition-all duration-1000 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="block bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
            Visnec Nexus
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl mt-4 text-white drop-shadow-md">
            Digital Innovation Hub
          </span>
        </h1>

        <p
          className={`text-xl sm:text-2xl text-slate-100 mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-300 drop-shadow-md ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Unlock the power of AI-driven tools, cutting-edge platforms, and immersive experiences. 
          Join 50,000+ innovators shaping tomorrow's digital landscape.
        </p>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button
            onClick={() => scrollToSection("pillars")}
            className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 flex items-center gap-2"
          >
            Explore Tools
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => scrollToSection("pillars")}
            className="px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold text-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Visit Platforms
          </button>
          <button
            onClick={() => scrollToSection("trending")}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Discover Experiences
          </button>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {[
            { label: "Global Innovators", value: "50K+" },
            { label: "AI-Powered Tools", value: "500+" },
            { label: "Platform Uptime", value: "99.9%" },
            { label: "Expert Support", value: "24/7" },
          ].map((stat) => (
            <div 
              key={stat.label} 
              className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                {stat.value}
              </div>
              <div className="text-slate-200 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trusted By Section */}
        <div
          className={`mt-20 transition-all duration-1000 delay-900 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-slate-300 text-sm uppercase tracking-wider mb-6">
            TRUSTED BY INDUSTRY LEADERS
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            {["Microsoft", "Google", "Amazon", "OpenAI"].map((company) => (
              <div
                key={company}
                className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20"
              >
                <span className="text-white font-semibold text-lg">{company}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full mx-auto flex justify-center backdrop-blur-sm">
            <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

