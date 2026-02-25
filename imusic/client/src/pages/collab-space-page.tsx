import React from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Updated to match the reference image exactly
export default function CollabSpacePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto pt-16 pb-12 px-6 md:px-8">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-amber-100 mb-6">Collab Zone</h1>
        <p className="text-lg text-gray-300 max-w-3xl">
          Find other artists to collaborate with and create new music together.
        </p>
        
        <div className="mt-8">
          <Button className="bg-purple-900 hover:bg-purple-800 text-white border border-purple-700 rounded-md px-6 py-2 text-sm">
            BROWSE COLLABS
          </Button>
        </div>
      </div>
      
      {/* Collaborator Cards */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Jay Taylor Card */}
        <div className="border border-gray-800 rounded-md overflow-hidden bg-[#0A0A0A] p-6">
          <div className="flex items-start gap-4">
            <div className="w-32 h-32 bg-purple-900/30 rounded-md overflow-hidden">
              {/* Using SVG instead of external image */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" fill="#1A0A2A" />
                <path 
                  d="M50,20 C65,20 75,30 75,50 C75,70 65,75 60,80 C55,85 55,87 50,90 C45,87 45,85 40,80 C35,75 25,70 25,50 C25,30 35,20 50,20 Z" 
                  fill="#331A50"
                />
                <circle cx="65" cy="35" r="10" fill="#502A7A" opacity="0.4" />
              </svg>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-serif text-white mb-2">Jay Taylor</h2>
              
              <div className="flex gap-2 mb-4">
                <Badge className="bg-purple-900/50 hover:bg-purple-900/60 text-white border-none rounded-sm px-2 py-0.5 text-xs">
                  HIP HOP
                </Badge>
                <Badge className="bg-purple-900/50 hover:bg-purple-900/60 text-white border-none rounded-sm px-2 py-0.5 text-xs">
                  RAP
                </Badge>
              </div>
              
              <p className="text-gray-400 text-sm mb-6">
                looking for a vocalist to work on some dark, introspective tracks
              </p>
              
              <Button className="bg-transparent hover:bg-purple-900/20 text-purple-400 border border-purple-900/50 rounded-sm px-4 py-1 h-auto text-sm">
                View Profile
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mia Solis Card */}
        <div className="border border-gray-800 rounded-md overflow-hidden bg-[#0A0A0A] p-6">
          <div className="flex items-start gap-4">
            <div className="w-32 h-32 bg-red-900/30 rounded-md overflow-hidden">
              {/* Using SVG instead of external image */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" fill="#2A0A1A" />
                <path 
                  d="M50,20 C65,20 75,30 75,50 C75,70 65,75 60,80 C55,85 55,87 50,90 C45,87 45,85 40,80 C35,75 25,70 25,50 C25,30 35,20 50,20 Z" 
                  fill="#5A1A30"
                />
                <circle cx="35" cy="35" r="10" fill="#7A2A50" opacity="0.4" />
              </svg>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-serif text-white mb-2">Mia Solis</h2>
              
              <div className="flex gap-2 mb-4">
                <Badge className="bg-red-900/50 hover:bg-red-900/60 text-white border-none rounded-sm px-2 py-0.5 text-xs">
                  R&B
                </Badge>
                <Badge className="bg-red-900/50 hover:bg-red-900/60 text-white border-none rounded-sm px-2 py-0.5 text-xs">
                  SOUL
                </Badge>
              </div>
              
              <p className="text-gray-400 text-sm mb-6">
                down to trade ideas and write some emotive songs together
              </p>
              
              <div className="flex justify-between items-center">
                <div className="text-gray-500 text-xs">
                  R&B · SOUL
                </div>
                
                <Button className="bg-transparent hover:bg-red-900/20 text-red-400 border border-red-900/50 rounded-sm px-4 py-1 h-auto text-sm">
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* DarkNotes Logo */}
      <div className="mt-16 mb-8 text-right max-w-6xl mx-auto px-6 md:px-8">
        <Link href="/">
          <span className="text-4xl font-['Playfair_Display'] text-white">
            DARKNOTES
          </span>
        </Link>
      </div>
    </div>
  );
}