import React from 'react';
import { Link } from 'wouter';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';

// Updated to exactly match the reference image shown
export default function MusicLabPage() {
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <Link href="/">
          <span className="text-3xl font-['Playfair_Display'] text-white">
            DarkNotes
          </span>
        </Link>
        
        <span className="text-lg font-['Playfair_Display'] text-white">
          MuseLab
        </span>
        
        <button className="text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 18H21M3 12H21M3 6H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Lyric Assistant */}
        <div className="border border-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">Lyric Assistant</h2>
          
          <p className="text-gray-400 text-sm mb-4">
            Write some introspective lines about a past relationship...
          </p>
          
          <div className="font-handwriting text-lg space-y-4">
            <p>Haunted by echoes of your sighs</p>
            <p>In every shadow, a memory lies</p>
            <p>You left a void carved in the night</p>
            <p>Searching for solace in our fading light</p>
          </div>
        </div>
        
        {/* Music Player */}
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          {/* Waveform visualization */}
          <div className="relative">
            <div className="absolute top-2 left-2 flex space-x-2">
              <button className="text-purple-400">
                <Play size={18} />
              </button>
              <button className="text-white opacity-50">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 12H10M10 12H12M10 12V10M10 12V14" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 6H12" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 4V12C4 13.1046 4.89543 14 6 14H10M12 4V8" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Time markers */}
            <div className="flex justify-between text-xs text-gray-500 px-4 pt-2">
              <span>0:00</span>
              <span>0:03</span>
              <span>0:16</span>
              <span>0:29</span>
              <span>0:20</span>
            </div>
            
            {/* Waveform */}
            <div className="h-32 p-4">
              <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none">
                <path 
                  d="M0,30 Q5,15 10,30 Q15,45 20,30 Q25,15 30,30 Q35,45 40,30 Q45,15 50,30 Q55,45 60,30 Q65,15 70,30 Q75,45 80,30 Q85,15 90,30 Q95,45 100,30" 
                  stroke="#A855F7" 
                  strokeWidth="1" 
                  fill="none" 
                />
                {/* Waveform bars */}
                {Array.from({ length: 50 }).map((_, i) => (
                  <rect 
                    key={i} 
                    x={i * 2} 
                    y={30 - Math.random() * 20}
                    width="1" 
                    height={Math.random() * 40}
                    fill="#A855F7" 
                    opacity="0.7"
                  />
                ))}
              </svg>
            </div>
            
            {/* Playback controls */}
            <div className="flex justify-center items-center space-x-6 p-4 border-t border-gray-800">
              <button className="text-white opacity-70 hover:opacity-100">
                <SkipBack size={20} />
              </button>
              <button className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Play size={24} fill="white" />
              </button>
              <button className="text-white opacity-70 hover:opacity-100">
                <SkipForward size={20} />
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="px-4 pb-8">
              <Slider 
                value={[30]} 
                className="w-full"
              />
              
              {/* Mini waveform */}
              <div className="h-8 mt-4">
                <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <rect 
                      key={i} 
                      x={i} 
                      y={10 - Math.random() * 5}
                      width="0.5" 
                      height={Math.random() * 10}
                      fill="#A855F7" 
                      opacity="0.7"
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side Panels */}
        <div className="space-y-4">
          {/* Beat Helper */}
          <div className="border border-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">Beat Helper</h2>
            <p className="text-gray-300">
              Try adding some ambient pads...
            </p>
          </div>
          
          {/* Mentor Tips */}
          <div className="border border-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">Tips from Mentor</h2>
            
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 border border-gray-600">
                {/* SVG silhouette mentor profile */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="mentorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2D1F55" />
                      <stop offset="100%" stopColor="#1A0A2A" />
                    </linearGradient>
                  </defs>
                  <rect width="100" height="100" fill="#1A0A2A" />
                  <path 
                    d="M50,20 C65,20 75,30 75,50 C75,70 65,75 60,80 C55,85 55,87 50,90 C45,87 45,85 40,80 C35,75 25,70 25,50 C25,30 35,20 50,20 Z" 
                    fill="url(#mentorGradient)"
                  />
                  <circle cx="65" cy="35" r="10" fill="#502A7A" opacity="0.4" />
                </svg>
              </div>
              <div>
                <p className="text-gray-300">
                  Layer in more harmonies on the chorus for a deeper emotional vibe
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}