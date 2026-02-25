import React from 'react';
import { useLocation } from 'wouter';
import MobileNavigation from './MobileNavigation';
import { Music, Users, Mic, Smartphone } from 'lucide-react';

/**
 * Reusable site header component with DarkNotes logo that navigates to home
 * Includes responsive desktop and mobile navigation
 */
const SiteHeader = () => {
  const [, setLocation] = useLocation();
  
  const goToHome = () => setLocation('/home');
  const goToMuseLab = () => setLocation('/muse-lab');
  const goToCollabs = () => setLocation('/collaborations');
  const goToAudition = () => setLocation('/audition');
  const goToMobileApp = () => setLocation('/mobile-app');
  
  return (
    <div className="site-header p-4 bg-black border-b border-purple-900/30">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo - visible on all screen sizes */}
          <h1 
            onClick={goToHome}
            className="text-2xl md:text-3xl font-serif text-purple-400 cursor-pointer hover:text-purple-300 transition-colors"
          >
            DarkNotes
          </h1>
          
          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex space-x-6">
            <button 
              onClick={goToMuseLab}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
            >
              <Music size={18} />
              <span>MuseLab</span>
            </button>
            
            <button 
              onClick={goToCollabs}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
            >
              <Users size={18} />
              <span>Collaborations</span>
            </button>
            
            <button 
              onClick={goToAudition}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
            >
              <Mic size={18} />
              <span>Audition</span>
            </button>
            
            <button 
              onClick={goToMobileApp}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
            >
              <Smartphone size={18} />
              <span>Mobile App</span>
            </button>
          </nav>
        </div>
      </div>
      
      {/* Mobile Navigation Component */}
      <MobileNavigation />
    </div>
  );
};

export default SiteHeader;