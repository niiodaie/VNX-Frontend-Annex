import React from 'react';
import { useLocation } from 'wouter';
import { ShieldCheck, User } from 'lucide-react';

export default function Footer() {
  const [, setLocation] = useLocation();
  
  const handleSignIn = () => {
    setLocation('/auth');
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-6 border-t border-midnight mt-8 bg-midnight/50">
      <div className="container max-w-md mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <ShieldCheck size={16} className="text-breathteal" />
              <p className="text-sm font-medium text-breathteal">BreathCheck</p>
            </div>
            <p className="text-xs text-coolgray">Powered by Visnec</p>
            <p className="text-xs text-coolgray/70 mt-1">© {currentYear} All rights reserved</p>
          </div>
          <div>
            <button 
              onClick={handleSignIn}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-fogwhite bg-midnight hover:bg-midnight/80 rounded-md border border-breathteal/20"
            >
              <User size={14} className="text-breathteal" />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}