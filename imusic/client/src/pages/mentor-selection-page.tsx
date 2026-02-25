import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

// Define type for mentor data from API
interface Mentor {
  id: number;
  name: string;
  inspiredBy: string;
  profileImage: string;
  genre: string;
  description: string;
}

// Lookup map for mentor colors
const mentorColors: Record<string, string> = {
  "Kendrick Flow": "#6146c7",
  "Nova Rae": "#ac45c7",
  "MetroDeep": "#9c46c7",
  "Blaze420": "#4646c7",
  "IvyMuse": "#8a45c7",
  "Yemi Sound": "#b16ac7"
};

export default function MentorSelectionPage() {
  // Fetch mentors from database
  const { data: mentors = [], isLoading, error } = useQuery<Mentor[]>({
    queryKey: ['/api/mentors'],
    staleTime: 60 * 1000, // 1 minute
  });

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-center bg-[#050505] border-b border-[#222222]">
        <Link href="/">
          <span className="text-2xl font-headline text-white">
            DarkNotes
          </span>
        </Link>
        
        <div>
          <div className="flex space-x-3">
            <Link href="/affiliates">
              <Button className="bg-transparent hover:bg-[#0a0a0a] text-white border border-[#333333] px-4 py-1.5 h-auto">
                Affiliates
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-transparent hover:bg-[#0a0a0a] text-white border border-[#333333] px-6 py-1.5 h-auto">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-headline text-[#d8c99b] mb-6">
            Choose Your Mentor
          </h1>
          
          <p className="text-md text-gray-300 max-w-3xl mx-auto">
            Get coached by AI mentors inspired by your favorite artists.
            Your personal guide to finding your unique sound.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-purple-400">Loading mentors...</div>
          </div>
        ) : error ? (
          <div className="text-center p-8 border border-red-500 rounded-lg bg-red-500/10">
            <p>Error loading mentors. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mentors.map((mentor) => (
              <div 
                key={mentor.id} 
                className="relative bg-black rounded-lg overflow-hidden border border-[#222222] 
                           transition-all duration-300 hover:border-purple-700"
                style={{
                  boxShadow: `0 0 20px 0 ${mentorColors[mentor.name] || '#8e44ad'}15`
                }}
              >
                {/* Mentor initials badge */}
                <div className="absolute -left-3 -top-3 flex items-center justify-center 
                      w-12 h-12 rounded-full bg-black border border-[#2c2c2c] overflow-hidden"
                  style={{ boxShadow: `0 0 20px 0 ${mentorColors[mentor.name] || '#8e44ad'}40` }}
                >
                  {/* Use image for mentor initials if available */}
                  {(mentor.name === "Nova Rae" || mentor.name === "MetroDeep" || mentor.name === "Blaze420" || mentor.name === "IvyMuse") ? (
                    <div className="relative w-full h-full" style={{ overflow: 'hidden' }}>
                      <img 
                        src="./assets/mentor-ui/mentor-initials.png" 
                        alt={`${mentor.name} Initials`}
                        className="absolute top-0 left-0 w-[400%] max-w-none h-full object-cover"
                        style={{ 
                          objectPosition: 
                            mentor.name === "Nova Rae" ? '0% 0%' : 
                            mentor.name === "MetroDeep" ? '-100% 0%' : 
                            mentor.name === "Blaze420" ? '-200% 0%' : 
                            '-300% 0%' 
                        }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="text-lg font-bold text-purple-500 font-headline tracking-wider"
                      style={{ color: mentorColors[mentor.name] || '#a855f7' }}
                    >
                      {mentor.name
                        .split(' ')
                        .map(word => word[0])
                        .join('')}
                    </div>
                  )}
                </div>
                {/* Top section with mentor demo screen */}
                <div className="h-[180px] relative bg-gradient-to-br from-[#0a0a0a] to-[#151515] overflow-hidden">
                  {/* Purple glow border */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-purple-600 opacity-70" />
                  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-purple-600 opacity-70" />
                  
                  {/* Image from the provided UI mockups */}
                  <div className="flex items-center justify-center h-full w-full">
                    {mentor.name === "Kendrick Flow" && (
                      <div className="relative w-full h-full" style={{ overflow: 'hidden' }}>
                        <img 
                          src="./assets/mentor-ui/mentor-card-screens.png" 
                          alt="Kendrick Flow Interface"
                          className="absolute top-0 left-0 w-[400%] max-w-none h-full object-cover"
                          style={{ 
                            objectPosition: '0% 0%',
                            filter: `drop-shadow(0 0 10px ${mentorColors[mentor.name] || '#8e44ad'}40)`
                          }}
                        />
                      </div>
                    )}
                    
                    {mentor.name === "Nova Rae" && (
                      <div className="relative w-full h-full" style={{ overflow: 'hidden' }}>
                        <img 
                          src="./assets/mentor-ui/mentor-card-screens.png" 
                          alt="Nova Rae Interface"
                          className="absolute top-0 left-0 w-[400%] max-w-none h-full object-cover"
                          style={{ 
                            objectPosition: '-100% 0%',
                            filter: `drop-shadow(0 0 10px ${mentorColors[mentor.name] || '#8e44ad'}40)`
                          }}
                        />
                      </div>
                    )}
                    
                    {mentor.name === "MetroDeep" && (
                      <div className="relative w-full h-full" style={{ overflow: 'hidden' }}>
                        <img 
                          src="./assets/mentor-ui/mentor-card-screens.png" 
                          alt="MetroDeep Interface"
                          className="absolute top-0 left-0 w-[400%] max-w-none h-full object-cover"
                          style={{ 
                            objectPosition: '-200% 0%',
                            filter: `drop-shadow(0 0 10px ${mentorColors[mentor.name] || '#8e44ad'}40)`
                          }}
                        />
                      </div>
                    )}
                    
                    {mentor.name === "Blaze420" && (
                      <div className="relative w-full h-full" style={{ overflow: 'hidden' }}>
                        <img 
                          src="./assets/mentor-ui/mentor-card-screens.png" 
                          alt="Blaze420 Interface"
                          className="absolute top-0 left-0 w-[400%] max-w-none h-full object-cover"
                          style={{ 
                            objectPosition: '-300% 0%',
                            filter: `drop-shadow(0 0 10px ${mentorColors[mentor.name] || '#8e44ad'}40)`
                          }}
                        />
                      </div>
                    )}
                    
                    {(mentor.name === "IvyMuse" || mentor.name === "Yemi Sound") && (
                      <div className="w-full h-full bg-[#0a0a0a] border border-[#333] rounded overflow-hidden flex items-center justify-center"
                        style={{ 
                          boxShadow: `0 0 10px 0 ${mentorColors[mentor.name] || '#8e44ad'}40`,
                        }}
                      >
                        {mentor.name === "IvyMuse" && (
                          <div className="text-center p-4">
                            <div className="w-20 h-20 rounded-full mx-auto border border-purple-800"></div>
                            <p className="text-xs text-white mt-2">Soul-Infused Flow</p>
                          </div>
                        )}
                        
                        {mentor.name === "Yemi Sound" && (
                          <div className="text-center p-4">
                            <div className="w-28 h-10 rounded-full mx-auto border border-[#333] flex items-center justify-center">
                              <div className="w-5 h-5 bg-purple-700 rounded-full mr-3"></div>
                              <div className="w-12 h-2 bg-purple-700/50 rounded-full"></div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-3">Global Rhythm Fusion</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Card content */}
                <div className="p-6 text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">INSPIRED BY</p>
                  <h3 className="text-md text-white mb-1">{mentor.inspiredBy}</h3>
                  <h2 className="text-xl font-headline text-white mb-6">{mentor.name}</h2>
                  <Button 
                    className="bg-transparent border border-[#333333] px-6 py-2 h-auto w-full
                               text-white hover:bg-[#111111] hover:border-purple-500 transition-all"
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Brand tagline */}
        <div className="mt-20 text-center">
          <p className="text-gray-400 font-handwriting text-lg">
            Where your rawest thoughts become your realest sound
          </p>
        </div>
      </main>
    </div>
  );
}