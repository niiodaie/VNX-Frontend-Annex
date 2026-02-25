import React from 'react';
import { useLocation } from 'wouter';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UpsellModalProps {
  visible: boolean;
  onClose: () => void;
}

const UpsellModal: React.FC<UpsellModalProps> = ({ visible, onClose }) => {
  const [, setLocation] = useLocation();
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-carbon border border-breathteal/40 rounded-lg max-w-md w-full overflow-hidden">
        <div className="bg-midnight p-4 border-b border-midnight flex justify-between items-center">
          <h2 className="text-xl font-semibold text-crimson">You're Over the Limit</h2>
          <button 
            onClick={onClose}
            className="text-coolgray hover:text-breathteal transition-colors rounded-full p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-fogwhite text-center mb-6">
            Upgrade to BreathCheck+ for safety alerts, rideshare discounts, and AI driving coach.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-midnight/50 border border-breathteal/20 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-breathteal/20 flex items-center justify-center text-breathteal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-breathteal">Safety Alerts</h3>
                <p className="text-sm text-coolgray">Real-time notifications when you're at risk</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-midnight/50 border border-breathteal/20 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-breathteal/20 flex items-center justify-center text-breathteal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-breathteal">Rideshare Discounts</h3>
                <p className="text-sm text-coolgray">Exclusive Uber & Lyft discounts</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-midnight/50 border border-breathteal/20 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-breathteal/20 flex items-center justify-center text-breathteal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                  <path d="M12 2a10 10 0 0 1 10 10h-10V2z" fill="currentColor" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-breathteal">AI Driving Coach</h3>
                <p className="text-sm text-coolgray">Personalized feedback and guidance</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col gap-3">
            <Button 
              className="w-full bg-breathteal hover:bg-breathteal/90 text-midnight font-medium py-6"
              onClick={() => {
                setLocation('/subscription');
                onClose();
              }}
            >
              Upgrade Now
            </Button>
            
            <Button 
              variant="ghost"
              className="w-full text-coolgray hover:text-fogwhite hover:bg-transparent"
              onClick={onClose}
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpsellModal;