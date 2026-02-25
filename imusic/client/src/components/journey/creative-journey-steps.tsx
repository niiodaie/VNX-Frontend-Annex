import React from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

interface JourneyStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  link: string;
}

export default function CreativeJourneySteps() {
  const [, navigate] = useLocation();
  
  const journeySteps: JourneyStep[] = [
    {
      id: 1,
      title: "Inspiration Spark",
      subtitle: "Start Your Journey",
      description: "Choose a theme and find your creative spark with AI-powered tools",
      link: "/inspiration"
    },
    {
      id: 2,
      title: "Lyric Lab",
      subtitle: "Write Your Story",
      description: "Write 8 bars with your EchoMentor's guidance and SmartLyric assist",
      link: "/lyric-lab"
    },
    {
      id: 3,
      title: "Beat Assembly",
      subtitle: "Create Your Sound",
      description: "Build your beat using MuseLab's DAW or prompt-based beat generator",
      link: "/muse-lab"
    },
    {
      id: 4,
      title: "Demo Session",
      subtitle: "Record Your Voice",
      description: "Record your 1-minute demo and receive feedback from your EchoMentor",
      link: "/record-demo"
    },
    {
      id: 5,
      title: "Release & Collab",
      subtitle: "Share Your Creation",
      description: "Publish to your profile or invite other artists to remix your track",
      link: "/collab-zone"
    }
  ];

  return (
    <div className="py-12 px-4 md:px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            The 5-Stage Creative Journey
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A 5-stage creative journey that takes you from inspiration to collaboration
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-12 left-4 right-4 h-1 bg-purple-900/30 hidden md:block"></div>
          
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {journeySteps.map((step) => (
              <div key={step.id} className="relative">
                {/* Circle Number */}
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold relative z-10",
                  "mb-6 mx-auto",
                  "bg-gradient-to-br from-purple-600 to-purple-800",
                  "shadow-lg shadow-purple-900/30",
                )}>
                  {step.id}
                </div>
                
                {/* Content Card */}
                <div 
                  onClick={() => window.location.href = step.link}
                  className={cn(
                    "rounded-lg p-6 h-full",
                    "bg-gradient-to-br from-black to-purple-950/20",
                    "border border-purple-900/30",
                    "transition-all duration-300 hover:border-purple-600/40 hover:shadow-md hover:shadow-purple-900/20",
                    "relative z-0 cursor-pointer"
                  )}
                >
                  <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-400 mb-3">{step.description}</p>
                  
                  {/* Decoration Dot */}
                  <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-purple-600/40"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}