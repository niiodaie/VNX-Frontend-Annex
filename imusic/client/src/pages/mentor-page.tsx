import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Mentor } from '@shared/schema';
import { Link, useLocation } from 'wouter';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Loader2, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MentorCard from '@/components/ui/mentor-card';
import MentorChat from '@/components/mentor/mentor-chat';
import ShareButtons from '@/components/ui/share-buttons';

// Custom Link component to prevent nesting <a> tags
const MentorLink = ({ to, className, children }: { to: string, className?: string, children: React.ReactNode }) => {
  const [, navigate] = useLocation();
  return (
    <span 
      className={className} 
      onClick={() => navigate(to)}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </span>
  );
};

export default function MentorPage() {
  const { toast } = useToast();
  const [selectedMentorId, setSelectedMentorId] = useState<number | null>(null);
  
  const { data: mentors = [], isLoading: mentorsLoading } = useQuery<Mentor[]>({
    queryKey: ['/api/mentors'],
  });
  
  const { data: currentMentor, isLoading: currentMentorLoading } = useQuery<any>({
    queryKey: ['/api/user/mentor']
  });
  
  // Set the selected mentor when data is available
  useEffect(() => {
    if (currentMentor && currentMentor.mentorId) {
      setSelectedMentorId(currentMentor.mentorId);
    }
  }, [currentMentor]);
  
  const setMentorMutation = useMutation({
    mutationFn: async (mentorId: number) => {
      const res = await apiRequest('POST', '/api/user/mentor', { mentorId });
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/mentor'] });
      setSelectedMentorId(data.mentorId);
      toast({
        title: "Mentor Selected",
        description: `${data.name} is now your mentor!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to select mentor. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleSelectMentor = (mentorId: number) => {
    setMentorMutation.mutate(mentorId);
  };
  
  const isLoading = mentorsLoading || currentMentorLoading;

  // Find the active mentor if one is selected
  const activeMentor = mentors.find(mentor => mentor.id === selectedMentorId);

  return (
    <div className="min-h-screen bg-black text-white overflow-auto">
      {/* Navigation */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <MentorLink to="/" className="text-3xl font-bold text-purple-400 hover:text-purple-300 transition">
            DarkNotes
          </MentorLink>
          
          <div className="flex items-center space-x-10">
            <MentorLink to="/audition" className="text-gray-300 hover:text-white transition tracking-wider text-sm uppercase">
              Explore
            </MentorLink>
            <MentorLink to="/challenges" className="text-gray-300 hover:text-white transition tracking-wider text-sm uppercase">
              My Journey
            </MentorLink>
            <MentorLink to="/mentor" className="text-primary hover:text-white transition tracking-wider text-sm uppercase">
              Evolve
            </MentorLink>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      {activeMentor ? (
        // Mentor session view when a mentor is selected
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Button 
              onClick={() => setSelectedMentorId(null)}
              className="mr-4 bg-transparent border border-gray-700 hover:bg-gray-900 hover:border-purple-500"
            >
              Back to Mentors
            </Button>
            <h2 className="text-3xl font-serif font-medium text-amber-100">
              Session with {activeMentor.name}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Mentor profile column */}
            <div className="lg:col-span-4 bg-gray-900/30 border border-gray-800 rounded-lg p-6">
              <div className="aspect-square w-1/2 mx-auto mb-6 overflow-hidden rounded-full mentor-profile">
                <img 
                  src={activeMentor.profileImage} 
                  alt={activeMentor.name}
                  className="w-full h-full object-cover silhouette-filter"
                />
              </div>
              
              <h3 className="text-2xl font-medium text-white text-center mb-2">
                {activeMentor.name}
              </h3>
              
              <p className="text-gray-400 text-center mb-4">
                Inspired by {activeMentor.inspiredBy}
              </p>
              
              <p className="text-gray-300 mb-6">
                {activeMentor.description}
              </p>
              
              <div className="space-y-4">
                <div className="bg-black/50 rounded p-3 border border-gray-800">
                  <h4 className="text-sm text-gray-400 uppercase tracking-wide mb-2">Primary Style</h4>
                  <p className="text-white">{activeMentor.genre}</p>
                </div>
                
                <div className="bg-black/50 rounded p-3 border border-gray-800">
                  <h4 className="text-sm text-gray-400 uppercase tracking-wide mb-2">Voice</h4>
                  <p className="text-white">AI-generated voice based on {activeMentor.inspiredBy}'s speech patterns and vocal style</p>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm text-gray-400 uppercase tracking-wide">Share Your Mentor</h4>
                    <Share2 className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex justify-center">
                    <ShareButtons 
                      title={`I'm working with ${activeMentor.name} on DarkNotes!`}
                      description={`${activeMentor.name} is helping me develop my sound inspired by ${activeMentor.inspiredBy}.`}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chat interface column */}
            <div className="lg:col-span-8 bg-gray-900/20 border border-gray-800 rounded-lg overflow-hidden flex flex-col h-[600px]">
              <MentorChat 
                mentorId={activeMentor.id}
                mentorName={activeMentor.name}
                initialMessage={
                  currentMentor?.currentMessage || 
                  `Hey, I'm ${activeMentor.name}. Let's work on your sound. What are you creating today?`
                }
              />
            </div>
          </div>
        </div>
      ) : (
        // Mentor selection view when no mentor is selected
        <main className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-serif font-medium text-amber-100 mb-4">Choose Your Mentor</h1>
            <p className="text-gray-300 text-xl">Get coached by AI mentors based on your favorite artists.</p>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onSelect={handleSelectMentor}
                  isSelected={selectedMentorId === mentor.id}
                  isPending={setMentorMutation.isPending}
                />
              ))}
            </div>
          )}
        </main>
      )}
      
      {/* Footer with Voice Feature Announcement */}
      <footer className="bg-gradient-to-t from-purple-900/20 to-transparent py-6 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-block bg-black/60 rounded-lg border border-purple-800/30 px-6 py-3 mb-4">
            <span className="text-sm font-medium text-purple-400">NEW FEATURE</span>
          </div>
          <h2 className="text-2xl font-serif text-white mb-2">Advanced AI Voice Feedback</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our mentors now provide feedback in their own unique voices, using advanced AI voice cloning technology.
            Chat with your mentor and hear their advice in a voice that matches their persona.
          </p>
        </div>
      </footer>
    </div>
  );
}
