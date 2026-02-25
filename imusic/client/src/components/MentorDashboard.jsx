import React from 'react';
import { useLocation } from 'wouter';
import SiteHeader from './layout/SiteHeader';

const MentorDashboard = ({ mentor, onChangeMentor }) => {
  const [, setLocation] = useLocation();
  
  // Navigation functions
  const goToMuseLab = () => setLocation('/muse-lab');
  
  // Different workspace functions
  const tryThisBeat = () => {
    // Navigate to MuseLab with a pre-selected beat
    setLocation('/muse-lab?mode=beat');
  };
  
  const buildHook = () => {
    // Navigate to MuseLab with hook generation mode
    setLocation('/muse-lab?mode=hook');
  };
  
  const collabWithOthers = () => {
    // Navigate to collaboration section
    setLocation('/collaborations');
  };
  
  return (
    <div className="mentor-dashboard bg-black text-white min-h-screen">
      <SiteHeader />
      
      <div className="p-6 container mx-auto">
        <div className="mentor mb-8">
          <h2 className="text-xl text-gray-200 mb-2">
            Your mentor: {mentor?.name || "No Mentor Selected"}
          </h2>
          <button 
            onClick={onChangeMentor}
            className="bg-purple-900 text-white px-4 py-2 rounded hover:bg-purple-800"
          >
            {mentor?.name ? "Change Mentor" : "Select Mentor"}
          </button>
        </div>
        
        <main>
          {/* Mobile-friendly content sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <section className="progress mb-8 sm:mb-0">
              <h3 className="text-lg text-purple-400 mb-4">Your track in progress</h3>
              <button 
                className="bg-gray-800 text-white px-4 py-3 rounded block mb-4 w-full text-left text-sm sm:text-base"
                onClick={goToMuseLab}
              >
                Write lyrics
              </button>
              <button 
                className="bg-purple-900 text-white px-4 py-3 rounded mb-4 w-full text-sm sm:text-base"
                onClick={goToMuseLab}
              >
                Get feedback
              </button>
            </section>
            
            <section className="inspiration">
              <h3 className="text-lg text-purple-400 mb-4">Inspiration for you</h3>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  className="bg-gray-800 text-white px-4 py-3 rounded hover:bg-gray-700 transition-colors text-sm sm:text-base"
                  onClick={tryThisBeat}
                >
                  Try this beat
                </button>
                <button 
                  className="bg-gray-800 text-white px-4 py-3 rounded hover:bg-gray-700 transition-colors text-sm sm:text-base"
                  onClick={buildHook}
                >
                  Build in a hook
                </button>
                <button 
                  className="bg-gray-800 text-white px-4 py-3 rounded hover:bg-gray-700 transition-colors text-sm sm:text-base"
                  onClick={collabWithOthers}
                >
                  Collab with others
                </button>
                {/* Discord Setup button removed */}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MentorDashboard;