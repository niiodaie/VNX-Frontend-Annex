import { useState, useEffect } from "react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/98 backdrop-blur-sm" : "bg-white/95 backdrop-blur-sm"
      } border-b border-slate-200`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VX</span>
            </div>
            <span className="text-xl font-bold text-slate-800">VNX</span>
          </a>

          <div className="hidden lg:flex items-center space-x-4">
            <a href="https://tools.visnec.ai" className="text-slate-600 hover:text-purple-600 transition-colors text-sm font-medium">
              Tools
            </a>
            <a href="https://platforms.visnec.ai" className="text-slate-600 hover:text-purple-600 transition-colors text-sm font-medium">
              Platforms
            </a>
            <a href="https://directories.visnec.ai" className="text-slate-600 hover:text-purple-600 transition-colors text-sm font-medium">
              Directories
            </a>
            <a href="https://resources.visnec.ai" className="text-slate-600 hover:text-purple-600 transition-colors text-sm font-medium">
              Resources
            </a>
            <a href="https://community.visnec.ai" className="text-slate-600 hover:text-purple-600 transition-colors text-sm font-medium">
              Community
            </a>
            <a href="https://marketplace.visnec.ai" className="text-slate-600 hover:text-purple-600 transition-colors text-sm font-medium">
              Marketplace
            </a>
            <a href="https://insights.visnec.ai" className="text-slate-600 hover:text-purple-600 transition-colors text-sm font-medium">
              Insights
            </a>
            <a href="https://experiences.visnec.ai" className="text-slate-600 hover:text-purple-600 transition-colors text-sm font-medium">
              Experiences
            </a>
            <a href="https://trends.visnec.ai" className="text-slate-600 hover:text-purple-600 transition-colors text-sm font-medium">
              Trends
            </a>
            <a href="https://ventures.visnec.ai" className="text-slate-600 hover:text-purple-600 transition-colors text-sm font-medium">
              Ventures
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <button className="hidden sm:block px-4 py-2 text-slate-600 hover:text-purple-600 transition-colors">
              Sign In
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
