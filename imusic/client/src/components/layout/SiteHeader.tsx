import React from 'react';
import { useLocation, Link } from 'wouter';
import { Music, Users, Mic, Smartphone } from 'lucide-react';

/**
 * Reusable site header component with DarkNotes logo that navigates to home
 * Includes responsive desktop and mobile navigation
 */
const SiteHeader: React.FC = () => {
  const [location] = useLocation();

  return (
    <header className="bg-[#0A0A0A] border-b border-[#2D2D2D] w-full py-4">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo - Always navigates to home */}
        <Link href="/home">
          <div className="flex items-center cursor-pointer">
            <div className="text-2xl font-['Playfair_Display'] font-semibold tracking-wide text-white">
              <span className="text-primary">Dark</span>Notes
            </div>
          </div>
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link href="/echolab"
            className={`px-4 py-2 text-sm rounded-md transition ${
              location === '/echolab' 
                ? 'bg-[#2D2D2D] text-white'
                : 'text-gray-300 hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            <div className="flex items-center">
              <Mic className="w-4 h-4 mr-1.5" />
              <span>EchoLab</span>
            </div>
          </Link>
          
          <Link href="/collaborations"
            className={`px-4 py-2 text-sm rounded-md transition ${
              location === '/collaborations' 
                ? 'bg-[#2D2D2D] text-white'
                : 'text-gray-300 hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1.5" />
              <span>Collaborations</span>
            </div>
          </Link>
          
          <Link href="/mobile-app"
            className={`px-4 py-2 text-sm rounded-md transition ${
              location === '/mobile-app' 
                ? 'bg-[#2D2D2D] text-white'
                : 'text-gray-300 hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            <div className="flex items-center">
              <Smartphone className="w-4 h-4 mr-1.5" />
              <span>Mobile App</span>
            </div>
          </Link>
          
          <Link href="/affiliates"
            className={`px-4 py-2 text-sm rounded-md transition ${
              location === '/affiliates' 
                ? 'bg-[#2D2D2D] text-white'
                : 'text-gray-300 hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            <div className="flex items-center">
              <Music className="w-4 h-4 mr-1.5" />
              <span>Affiliates</span>
            </div>
          </Link>
        </nav>

        {/* User Avatar + Dropdown (Hidden on mobile) */}
        <div className="hidden md:flex items-center">
          <div className="relative group">
            <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 hover:border-primary transition-colors">
              <span className="text-white">DN</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;