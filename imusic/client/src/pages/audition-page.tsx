import React, { useState } from 'react';
import { Link } from "wouter";
import { Menu, ArrowLeft, Music, Mic, Headphones, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AuditionMentorSelection from '@/components/audition-mentor-selection';
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function AuditionPage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'blind' | 'live'>('blind');

  // Redirect to auth if not logged in
  if (!user && !isLoading) {
    return <Redirect to="/auth" />;
  }

  // For the features that would be implemented in a full version
  const handleStart = () => {
    window.alert('This feature would start the audition process in a real implementation.');
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-auto texture-overlay">
      {/* Header */}
      <header className="px-6 py-6 border-b border-[#333] border-opacity-50 purple-light-effect">
        <div className="flex justify-between items-center">
          <a href="/" className="text-decoration-none">
            <h1 className="text-4xl font-serif text-purple-400 tracking-wide">
              DarkNotes
            </h1>
          </a>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex space-x-8">
              <a href="/home" className="text-white hover:text-purple-300 text-sm uppercase tracking-wider">
                HOME
              </a>
              <Link href="/audition" className="text-purple-300 hover:text-purple-200 text-sm uppercase tracking-wider border-b border-purple-500 pb-1">
                AUDITIONS
              </Link>
              <a href="/journey" className="text-gray-300 hover:text-white text-sm uppercase tracking-wider">
                MY JOURNEY
              </a>
              <a href="/mentors" className="text-gray-300 hover:text-white text-sm uppercase tracking-wider">
                MENTORS
              </a>
            </div>
            <div className="cursor-pointer hover:text-white">
              <Menu className="w-6 h-6 text-gray-300 hover:text-purple-300" />
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <Link href="/home">
            <a className="text-gray-400 hover:text-purple-300 inline-flex items-center mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to home
            </a>
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif text-amber-100 mb-2">The Voice Experience</h1>
          <p className="text-gray-400">Show your talent and get mentored by your favorite artists</p>
        </div>
        
        {/* Tabs Navigation */}
        <div className="mb-8 border-b border-[#333] flex">
          <button 
            className={`py-3 px-5 focus:outline-none ${activeTab === 'blind' ? 'text-purple-300 border-b-2 border-purple-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('blind')}
          >
            Blind Audition
          </button>
          <button 
            className={`py-3 px-5 focus:outline-none ${activeTab === 'live' ? 'text-purple-300 border-b-2 border-purple-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('live')}
          >
            Live Audition
          </button>
        </div>
        
        {/* Blind Audition Content */}
        {activeTab === 'blind' && (
          <div className="space-y-8">
            <div className="bg-[#121212] rounded-lg p-6 border border-purple-900/30">
              <h2 className="text-xl md:text-2xl font-medium text-purple-300 mb-4">Blind Audition</h2>
              <p className="text-gray-400 mb-6">
                Submit your performance and mentors will decide if they want to turn their chairs for you. If multiple mentors turn, you get to choose who you want to work with.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-[#0a0a0a] p-4 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-3">
                    <Music className="w-6 h-6 text-purple-300" />
                  </div>
                  <h3 className="text-white font-medium mb-1">Step 1</h3>
                  <p className="text-gray-400 text-sm">Record or upload your performance</p>
                </div>
                
                <div className="bg-[#0a0a0a] p-4 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-3">
                    <Headphones className="w-6 h-6 text-purple-300" />
                  </div>
                  <h3 className="text-white font-medium mb-1">Step 2</h3>
                  <p className="text-gray-400 text-sm">Mentors review and decide if they want you</p>
                </div>
                
                <div className="bg-[#0a0a0a] p-4 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-3">
                    <Mic className="w-6 h-6 text-purple-300" />
                  </div>
                  <h3 className="text-white font-medium mb-1">Step 3</h3>
                  <p className="text-gray-400 text-sm">Choose your mentor if multiple turn</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleStart}
                  className="bg-purple-700 hover:bg-purple-600 text-white rounded-full px-8 py-2"
                >
                  Submit Your Audition
                </Button>
              </div>
            </div>
            
            <div className="bg-[#121212] rounded-lg p-6 border border-purple-900/30">
              <h2 className="text-xl font-medium text-purple-300 mb-4">Rules & Guidelines</h2>
              <ul className="text-gray-400 space-y-2 list-disc pl-5">
                <li>Performance must be between 30 seconds and 2 minutes</li>
                <li>Original music is encouraged but covers are accepted</li>
                <li>Explicit content is allowed but must be tagged appropriately</li>
                <li>You may submit up to 3 blind auditions per month</li>
                <li>Decisions are final and cannot be contested</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-[#1a101f] to-black p-6 rounded-lg">
              <h3 className="text-white font-medium mb-2">Pro Tip</h3>
              <p className="text-gray-300 text-sm">
                Mentors are more likely to turn for original material that showcases your unique style and personality!
              </p>
            </div>
          </div>
        )}
        
        {/* Live Audition Content */}
        {activeTab === 'live' && (
          <div className="space-y-8">
            <AuditionMentorSelection />
            
            <div className="bg-[#121212] rounded-lg p-6 border border-purple-900/30">
              <h2 className="text-xl font-medium text-purple-300 mb-4">Live Audition Details</h2>
              <p className="text-gray-400 mb-4">
                In a live audition, you choose which mentors you want to audition for. When you perform, they'll decide in real-time if they want to turn their chair for you.
              </p>
              
              <div className="bg-black/50 p-4 rounded-md mb-4">
                <h3 className="text-white text-sm font-medium mb-2">What to expect:</h3>
                <ul className="text-gray-400 text-sm space-y-1 list-disc pl-5">
                  <li>Live feedback from mentors who turn their chairs</li>
                  <li>Immediate decision on whether you're accepted</li>
                  <li>Chance to explain your artistic vision</li>
                  <li>Opportunity to ask questions to interested mentors</li>
                </ul>
              </div>
              
              <div className="bg-purple-900/20 p-4 rounded-md">
                <h3 className="text-purple-300 text-sm font-medium mb-2">Preparation Tips:</h3>
                <ul className="text-gray-300 text-sm space-y-1 list-disc pl-5">
                  <li>Test your microphone and audio settings before starting</li>
                  <li>Prepare a 60-90 second performance that showcases your range</li>
                  <li>Have a brief introduction about yourself and your music ready</li>
                  <li>Make sure you're in a quiet space without interruptions</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#1a101f] to-black p-6 rounded-lg">
              <h3 className="text-white font-medium mb-2">What Previous Contestants Say</h3>
              <blockquote className="text-gray-300 text-sm italic border-l-2 border-purple-500 pl-4 py-1">
                "The live audition was nerve-wracking but so worth it! Getting immediate feedback from MetroDeep changed my whole approach to production."
              </blockquote>
              <p className="text-gray-400 text-sm mt-2">- Anonymous User, Chicago</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}