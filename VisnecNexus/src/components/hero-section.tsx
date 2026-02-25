import { useState, useEffect } from "react";

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
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/70" />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="block text-blue-400">Visnec</span>
          <span className="block">Nexus</span>
        </h1>

        <p
          className={`text-xl sm:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Explore the future of AI, tools, platforms, and global experiences.
        </p>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button
            onClick={() => scrollToSection("pillars")}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            🧪 Explore Tools
          </button>
          <button
            onClick={() => scrollToSection("platforms")}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/20 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            🚀 Visit Platforms
          </button>
          <button
            onClick={() => scrollToSection("experience")}
            className="px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold text-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            🧭 Discover Experiences
          </button>
        </div>

        <div className="mt-16 animate-bounce-gentle">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
