import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Home, Music, Users, Mic, Menu, X, Smartphone } from 'lucide-react';

/**
 * Mobile navigation component with hamburger menu
 */
const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const navigate = (path) => {
    setLocation(path);
    setIsOpen(false);
  };
  
  return (
    <div className="md:hidden">
      {/* Mobile hamburger button */}
      <button 
        onClick={toggleMenu}
        className="fixed bottom-4 right-4 z-50 bg-purple-900 text-white p-3 rounded-full shadow-lg"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Mobile navigation menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/95 z-40 flex flex-col items-center justify-center">
          <nav className="flex flex-col items-center gap-6 w-full px-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 text-purple-400 hover:text-purple-300 text-xl py-4 w-full justify-center"
            >
              <Home size={24} />
              <span>Home</span>
            </button>
            
            <button 
              onClick={() => navigate('/muse-lab')}
              className="flex items-center gap-3 text-purple-400 hover:text-purple-300 text-xl py-4 w-full justify-center"
            >
              <Music size={24} />
              <span>MuseLab</span>
            </button>
            
            <button 
              onClick={() => navigate('/collaborations')}
              className="flex items-center gap-3 text-purple-400 hover:text-purple-300 text-xl py-4 w-full justify-center"
            >
              <Users size={24} />
              <span>Collaborations</span>
            </button>
            
            <button 
              onClick={() => navigate('/audition')}
              className="flex items-center gap-3 text-purple-400 hover:text-purple-300 text-xl py-4 w-full justify-center"
            >
              <Mic size={24} />
              <span>Audition</span>
            </button>
            
            <button 
              onClick={() => navigate('/mobile-app')}
              className="flex items-center gap-3 text-purple-400 hover:text-purple-300 text-xl py-4 w-full justify-center"
            >
              <Smartphone size={24} />
              <span>Mobile App</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileNavigation;