import React from "react";
import { Header, MentorSelection, CreativeJourney, Footer } from "@/components/layout/navigation";
import CreativeJourneySteps from "@/components/journey/creative-journey-steps";
import { Mentor } from "@shared/schema";

export default function NavigationTestPage() {
  // Sample mentor data for testing
  const sampleMentors: Mentor[] = [
    {
      id: 1,
      name: "Kendrick Flow",
      inspiredBy: "Kendrick Lamar",
      profileImage: "/src/assets/mentors/kendrick-portrait.svg",
      genre: "Conscious Hip-Hop",
      description: "Lyrical genius focused on storytelling and social commentary"
    },
    {
      id: 2,
      name: "Nova Rae",
      inspiredBy: "SZA",
      profileImage: "/src/assets/mentors/sza-portrait.svg",
      genre: "R&B / Soul",
      description: "Neo-soul queen blending emotional depth with catchy melodies"
    },
    {
      id: 3,
      name: "MetroDeep",
      inspiredBy: "The Weeknd",
      profileImage: "/src/assets/mentors/weeknd-portrait.svg", 
      genre: "Dark Pop / R&B",
      description: "Atmospheric soundscapes with brooding themes and haunting vocals"
    },
    {
      id: 4,
      name: "Blaze420",
      inspiredBy: "Travis Scott",
      profileImage: "/src/assets/mentors/travis-portrait.svg",
      genre: "Trap / Psychedelic",
      description: "Experimental producer pushing boundaries with innovative sounds"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="py-10 px-6 bg-gradient-to-b from-purple-900/20 to-black text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            DarkNotes Navigation Test
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            This page demonstrates the new navigation components for the DarkNotes platform.
            Where your rawest thoughts become your realest sound.
          </p>
        </div>
        
        <MentorSelection mentors={sampleMentors} />
        
        <CreativeJourneySteps />
        
        <CreativeJourney />
      </main>
      
      <Footer />
    </div>
  );
}