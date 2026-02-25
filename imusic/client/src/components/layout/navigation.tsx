import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Mentor } from "@shared/schema";

// Custom Link component to prevent nesting <a> tags
const SafeLink = ({ to, className, children }: { to: string, className?: string, children: React.ReactNode }) => {
  const [, navigate] = useLocation();
  return (
    <span 
      className={cn("cursor-pointer", className)} 
      onClick={() => navigate(to)}
    >
      {children}
    </span>
  );
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-black/90 border-b border-purple-900/50 py-4 px-6 flex justify-between items-center relative z-50">
      <a href="/" className="flex items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
          DarkNotes
        </h1>
      </a>
      
      {isMobile ? (
        <>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu}
            className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
          
          {isMenuOpen && (
            <nav className="absolute top-full left-0 right-0 bg-black/95 border-b border-purple-900/50 py-4 shadow-lg">
              <ul className="flex flex-col space-y-4 px-6">
                <li>
                  <a href="/echolab" className="text-gray-300 hover:text-purple-400 block py-2 transition-colors">
                    EchoLab
                  </a>
                </li>
                <li>
                  <a href="/muse-lab" className="text-gray-300 hover:text-purple-400 block py-2 transition-colors">
                    Muse Lab
                  </a>
                </li>
                <li>
                  <a href="/collab-zone" className="text-gray-300 hover:text-purple-400 block py-2 transition-colors">
                    Collab Zone
                  </a>
                </li>
                <li>
                  <a href="/select-mentor" className="text-gray-300 hover:text-purple-400 block py-2 transition-colors">
                    Choose Mentor
                  </a>
                </li>
                <li>
                  <a href="/subscription" className="text-purple-400 hover:text-purple-300 block py-2 transition-colors">
                    Upgrade to Pro
                  </a>
                </li>
              </ul>
            </nav>
          )}
        </>
      ) : (
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <a href="/echolab" className="text-gray-300 hover:text-purple-400 transition-colors">
                EchoLab
              </a>
            </li>
            <li>
              <a href="/muse-lab" className="text-gray-300 hover:text-purple-400 transition-colors">
                Muse Lab
              </a>
            </li>
            <li>
              <a href="/collab-zone" className="text-gray-300 hover:text-purple-400 transition-colors">
                Collab Zone
              </a>
            </li>
            <li>
              <a href="/select-mentor" className="text-gray-300 hover:text-purple-400 transition-colors">
                Choose Mentor
              </a>
            </li>
            <li>
              <Button onClick={() => window.location.href = "/subscription"} variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/30">
                Upgrade to Pro
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export const MentorSelection = ({ mentors }: { mentors: Mentor[] }) => {
  const [, navigate] = useLocation();
  
  return (
    <section className="py-12 px-6 bg-black/80 backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
        Choose Your Mentor
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {mentors.map((mentor) => (
          <div 
            key={mentor.id} 
            onClick={() => window.location.href = `/mentor/${mentor.id}`}
            className={cn(
              "mentor-card relative group overflow-hidden cursor-pointer",
              "flex flex-col items-center justify-center p-6 rounded-lg",
              "bg-gradient-to-br from-black/90 to-purple-950/50",
              "border border-purple-900/30 hover:border-purple-500/50",
              "transform transition-all duration-300 hover:scale-105"
            )}
          >
            {mentor.profileImage && (
              <div className="w-32 h-32 relative mb-4 overflow-hidden rounded-full border-2 border-purple-500/50 group-hover:border-purple-400">
                <img 
                  src={mentor.profileImage} 
                  alt={mentor.name} 
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-70"></div>
              </div>
            )}
            <h3 className="text-xl font-bold text-white mb-1">{mentor.name}</h3>
            <p className="text-gray-400 text-sm">{mentor.genre}</p>
            <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const CreativeJourney = () => {
  return (
    <section className="py-12 px-6 bg-gradient-to-br from-black to-purple-950/30">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
          Your Creative Journey
        </h3>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Follow our 5-stage creative process to transform your raw ideas into polished tracks with guidance from your mentor.
        </p>
        <Button 
            onClick={() => window.location.href = "/create-journey"}
            variant="default" 
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium px-8 py-6"
          >
            Start Your 5-Stage Creative Journey
          </Button>
      </div>
    </section>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-black/90 border-t border-purple-900/30 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text mb-4 md:mb-0">
            DarkNotes
          </h2>
          <div className="flex space-x-6">
            <a href="/about" className="text-gray-400 hover:text-purple-400 transition-colors">
              About
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">
              Terms
            </a>
            <a href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors">
              Contact
            </a>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500">
          <p>DarkNotes - Where your rawest thoughts become your realest sound</p>
          <p className="mt-2">© {new Date().getFullYear()} DarkNotes - A Visnec Media LLC company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};