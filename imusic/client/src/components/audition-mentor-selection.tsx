import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MentorRealImage } from './mentor-real-images';
import { Mic, Upload, Check, X } from 'lucide-react';

interface MentorOption {
  id: number;
  name: string;
  artistInspirationName: string;
  color: string; // Tailwind color class prefix (e.g., 'purple', 'pink', 'blue')
  selected: boolean;
}

export const AuditionMentorSelection = () => {
  // Initial data for available mentors
  const [mentors, setMentors] = useState<MentorOption[]>([
    { 
      id: 1, 
      name: 'Kendrick Flow', 
      artistInspirationName: 'Kendrick Lamar',
      color: 'purple',
      selected: false 
    },
    { 
      id: 2, 
      name: 'Nova Rae', 
      artistInspirationName: 'SZA',
      color: 'pink',
      selected: false 
    },
    { 
      id: 3, 
      name: 'MetroDeep', 
      artistInspirationName: 'Drake',
      color: 'blue',
      selected: false 
    },
    { 
      id: 4, 
      name: 'Blaze420', 
      artistInspirationName: 'J. Cole',
      color: 'amber',
      selected: false 
    },
    { 
      id: 5, 
      name: 'IvyMuse', 
      artistInspirationName: 'Beyoncé',
      color: 'green',
      selected: false 
    }
  ]);

  const [uploadMode, setUploadMode] = useState<'live' | 'pre-recorded' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Toggle mentor selection
  const toggleMentorSelection = (id: number) => {
    setMentors(mentors.map(mentor => 
      mentor.id === id ? { ...mentor, selected: !mentor.selected } : mentor
    ));
  };

  const selectedMentorsCount = mentors.filter(m => m.selected).length;

  // Handle submission
  const handleSubmitAudition = () => {
    if (selectedMentorsCount === 0 || !uploadMode) return;

    // Simulate submission process
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset after showing success message
      setTimeout(() => {
        setSubmitSuccess(false);
        // Reset selected mentors
        setMentors(mentors.map(mentor => ({ ...mentor, selected: false })));
        setUploadMode(null);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="bg-black rounded-lg p-6 border border-purple-900/30 purple-glow">
      <h2 className="text-xl md:text-2xl font-medium text-purple-300 mb-4">Choose Your Mentor Audition</h2>
      <p className="text-gray-400 mb-6 text-sm">
        Select the mentors you want to audition for and choose how you'll submit your performance
      </p>

      {/* Mentor Selection Section */}
      <div className="mb-8">
        <h3 className="text-md text-amber-100 mb-3">Pick Your Potential Mentors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {mentors.map((mentor) => (
            <div 
              key={mentor.id}
              className={`
                relative aspect-square overflow-hidden rounded-lg cursor-pointer 
                bg-[#1a101f] transition-all duration-300
                ${mentor.selected ? `ring-2 ring-${mentor.color}-500 ring-offset-1 ring-offset-black` : ''}
              `}
              onClick={() => toggleMentorSelection(mentor.id)}
            >
              {/* Mentor Image */}
              <div className="absolute inset-0 z-10">
                <MentorRealImage name={mentor.name} className="absolute inset-0" />
                
                {/* Gradient overlay in mentor's color */}
                <div className={`absolute inset-0 bg-gradient-to-b from-${mentor.color}-900/30 to-black/70`}></div>
                
                {/* Mentor info */}
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="text-center z-10 p-2">
                    <div className="mb-2">
                      <span className={`px-3 py-1 bg-${mentor.color}-800/60 rounded-full text-sm text-white backdrop-blur-sm`}>
                        {mentor.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 bg-black/50 px-2 py-1 rounded backdrop-blur-sm inline-block">
                      Inspired by {mentor.artistInspirationName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Selected checkmark */}
              {mentor.selected && (
                <div className="absolute top-2 right-2 z-20 bg-black/60 rounded-full p-1 backdrop-blur-sm">
                  <Check className={`w-5 h-5 text-${mentor.color}-400`} />
                </div>
              )}
              
              {/* The Voice chair effect - only shown when selected */}
              <div 
                className={`
                  absolute bottom-0 left-0 right-0 h-1/5 bg-red-700/60 z-5 
                  transition-all duration-500
                  ${mentor.selected ? 'translate-y-0' : 'translate-y-full'}
                `}
              >
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12">
                  <div className="absolute inset-0 bg-red-600 rounded-t-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {selectedMentorsCount === 0 ? 'Select at least one mentor' : `${selectedMentorsCount} mentor${selectedMentorsCount > 1 ? 's' : ''} selected`}
        </p>
      </div>

      {/* Upload Type Selection */}
      <div className="mb-8">
        <h3 className="text-md text-amber-100 mb-3">Choose Your Audition Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className={`
              bg-[#121212] p-4 rounded-lg flex flex-col items-center text-center cursor-pointer
              transition-all duration-300 hover:bg-[#18131e]
              ${uploadMode === 'live' ? 'ring-2 ring-purple-500' : ''}
            `}
            onClick={() => setUploadMode('live')}
          >
            <div className="w-16 h-16 rounded-full bg-purple-900/30 flex items-center justify-center mb-3">
              <Mic className="w-8 h-8 text-purple-300" />
            </div>
            <h4 className="text-white font-medium mb-1">Live Performance</h4>
            <p className="text-gray-400 text-sm">Record your vocals live with our online DAW interface</p>
          </div>

          <div 
            className={`
              bg-[#121212] p-4 rounded-lg flex flex-col items-center text-center cursor-pointer
              transition-all duration-300 hover:bg-[#18131e]
              ${uploadMode === 'pre-recorded' ? 'ring-2 ring-purple-500' : ''}
            `}
            onClick={() => setUploadMode('pre-recorded')}
          >
            <div className="w-16 h-16 rounded-full bg-purple-900/30 flex items-center justify-center mb-3">
              <Upload className="w-8 h-8 text-purple-300" />
            </div>
            <h4 className="text-white font-medium mb-1">Upload Pre-recorded</h4>
            <p className="text-gray-400 text-sm">Upload your audio/video file for mentor review</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <Button 
          onClick={handleSubmitAudition}
          disabled={selectedMentorsCount === 0 || !uploadMode || isSubmitting}
          className={`
            min-w-[200px] rounded-full px-8 py-2
            ${isSubmitting ? 'bg-gray-700' : 'bg-purple-700 hover:bg-purple-600'}
            text-white transition-all duration-300
          `}
        >
          {isSubmitting ? 'Submitting...' : submitSuccess ? 'Success!' : 'Start Audition'}
        </Button>

        {/* Success message */}
        {submitSuccess && (
          <div className="mt-4 bg-green-900/20 text-green-300 p-2 rounded-md inline-block">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Your audition has been set up!</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditionMentorSelection;