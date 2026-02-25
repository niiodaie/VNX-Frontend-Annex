import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, MicIcon, SendIcon, ArrowRightIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import ShareButtons from '@/components/ui/share-buttons';
import { Mentor } from '@shared/schema';

export default function VoiceAuditionPage() {
  const { toast } = useToast();
  const [auditionText, setAuditionText] = useState('');
  const [isAuditioning, setIsAuditioning] = useState(false);
  const [auditionResults, setAuditionResults] = useState<null | {
    mentorsTurned: number[];
    feedbackText: string;
    audioUrl?: string;
  }>(null);
  
  // Fetch available mentors
  const { data: mentors = [], isLoading: mentorsLoading } = useQuery<Mentor[]>({
    queryKey: ['/api/mentors'],
    staleTime: 60 * 1000, // 1 minute
  });
  
  // Submit audition to get mentor feedback
  const submitAuditionMutation = useMutation({
    mutationFn: async (lyrics: string) => {
      const res = await apiRequest('POST', '/api/audition/submit', { lyrics });
      return await res.json();
    },
    onSuccess: (data) => {
      setAuditionResults(data);
      setIsAuditioning(false);
      
      if (data.mentorsTurned.length > 0) {
        toast({
          title: "Congratulations!",
          description: `${data.mentorsTurned.length} mentor${data.mentorsTurned.length > 1 ? 's' : ''} turned for you!`,
          variant: "default",
        });
      } else {
        toast({
          title: "Keep working!",
          description: "No mentors turned this time, but don't give up!",
          variant: "default",
        });
      }
    },
    onError: (error) => {
      setIsAuditioning(false);
      toast({
        title: "Audition Error",
        description: "There was a problem with your audition. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Start the audition process
  const handleStartAudition = () => {
    if (!auditionText.trim()) {
      toast({
        title: "Empty Audition",
        description: "Please enter your lyrics or composition before auditioning.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAuditioning(true);
    submitAuditionMutation.mutate(auditionText);
  };
  
  // Render mentor chairs with animations for turning
  const renderMentorChairs = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 mb-8">
        {mentors.slice(0, 4).map((mentor: Mentor, index: number) => {
          const hasTurned = auditionResults?.mentorsTurned.includes(mentor.id);
          
          return (
            <div 
              key={mentor.id}
              className={`relative mentor-chair ${hasTurned ? 'turned' : ''} transition-all duration-1000`}
            >
              {/* Chair back */}
              <div 
                className={`w-full aspect-square bg-gray-800 rounded-lg overflow-hidden border-2 transition-all duration-1000 ${
                  hasTurned 
                    ? 'border-purple-500 chair-turned purple-glow' 
                    : 'border-gray-700 chair-back'
                }`}
              >
                {hasTurned && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-3/4 h-3/4 overflow-hidden rounded-full mentor-profile">
                      <img 
                        src={mentor.profileImage} 
                        alt={mentor.name}
                        className="w-full h-full object-cover silhouette-filter"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Mentor name */}
              <div className="mt-3 text-center">
                <h3 className="text-lg font-medium text-white">{mentor.name}</h3>
                <p className="text-sm text-gray-400">Inspired by {mentor.inspiredBy}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="/" className="text-3xl font-bold text-purple-400 hover:text-purple-300 transition cursor-pointer">
            DarkNotes
          </a>
          
          <div className="flex items-center space-x-10">
            <a href="/audition" className="text-primary hover:text-white transition tracking-wider text-sm uppercase">
              Explore
            </a>
            <a href="/challenges" className="text-gray-300 hover:text-white transition tracking-wider text-sm uppercase">
              My Journey
            </a>
            <a href="/mentor" className="text-gray-300 hover:text-white transition tracking-wider text-sm uppercase">
              Evolve
            </a>
          </div>
        </div>
      </nav>
      
      {/* Header with show branding */}
      <header className="relative py-10 overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-purple-900/30 to-black/90 z-0"
        />
        
        {/* Spotlight effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-64 bg-purple-500/20 rounded-full filter blur-[100px] animate-pulse-slow z-0"></div>
        <div className="absolute top-10 left-1/3 w-1/3 h-32 bg-blue-500/20 rounded-full filter blur-[80px] animate-pulse-slow z-0" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-serif font-bold text-white mb-2 tracking-tight">
            <span className="text-purple-400">Dark</span>Voice
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Audition with your lyrics to see which AI mentors will turn their chairs for you
          </p>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Stage area */}
        <div className="relative bg-gradient-to-b from-black to-gray-900/50 rounded-xl p-8 border border-gray-800">
          <div className="absolute top-0 left-0 right-0 h-1/2 z-0">
            <div className="w-full h-full opacity-20 bg-gradient-radial from-purple-500/30 to-transparent"></div>
          </div>
          
          {!auditionResults ? (
            <div className="relative z-10">
              <h2 className="text-3xl font-medium text-center text-amber-100 mb-6">Your Blind Audition</h2>
              
              <div className="max-w-2xl mx-auto">
                <p className="text-gray-300 mb-8 text-center">
                  Share your lyrics or composition below. If our AI mentors like what they hear, they'll turn their chairs for you!
                </p>
                
                <Textarea
                  value={auditionText}
                  onChange={(e) => setAuditionText(e.target.value)}
                  placeholder="Enter your lyrics or describe your musical composition..."
                  className="min-h-[200px] bg-black/50 border-gray-700 focus:border-purple-500 text-white mb-6"
                />
                
                <div className="flex justify-center">
                  <Button
                    onClick={handleStartAudition}
                    disabled={isAuditioning || !auditionText.trim()}
                    className="px-6 py-2 h-auto text-lg bg-gradient-to-r from-purple-800 to-purple-900 hover:from-purple-700 hover:to-purple-800 transition-all"
                  >
                    {isAuditioning ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Auditioning...
                      </>
                    ) : (
                      <>
                        <MicIcon className="mr-2 h-5 w-5" />
                        Start Blind Audition
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative z-10">
              <h2 className="text-3xl font-medium text-center text-amber-100 mb-6">
                Audition Results
              </h2>
              
              {/* Mentor chairs that turn based on results */}
              {renderMentorChairs()}
              
              {/* Audition feedback */}
              <div className="max-w-2xl mx-auto mt-12 bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-medium text-white mb-4">Feedback on Your Work</h3>
                
                <div className="bg-black/30 rounded-lg p-4 mb-6 border border-gray-700">
                  <p className="text-gray-300 whitespace-pre-wrap">{auditionResults.feedbackText}</p>
                </div>
                
                {auditionResults.mentorsTurned.length > 0 ? (
                  <div className="text-center">
                    <p className="text-lg text-purple-300 mb-4">
                      Congratulations! {auditionResults.mentorsTurned.length} mentor{auditionResults.mentorsTurned.length > 1 ? 's' : ''} turned for you!
                    </p>
                    
                    <div className="flex flex-col items-center gap-4">
                      <Button 
                        onClick={() => window.location.href = "/mentor"}
                        className="bg-purple-800 hover:bg-purple-700"
                      >
                        Choose Your Mentor <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Button>
                      
                      <div className="mt-4">
                        <p className="text-sm text-gray-400 mb-2">Share your success:</p>
                        <ShareButtons 
                          title={`I just got ${auditionResults.mentorsTurned.length} chair ${auditionResults.mentorsTurned.length > 1 ? 'turns' : 'turn'} on DarkVoice!`}
                          description="Join me on DarkNotes - where your rawest thoughts become your realest sound."
                          size="md"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-lg text-gray-400 mb-4">
                      No mentors turned this time, but don't give up! Review the feedback and try again.
                    </p>
                    
                    <Button 
                      onClick={() => setAuditionResults(null)}
                      className="bg-gray-800 hover:bg-gray-700"
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* How it works */}
        <div className="mt-20">
          <h2 className="text-2xl font-medium text-center text-white mb-10">How The DarkVoice Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-800">
              <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Blind Audition</h3>
              <p className="text-gray-300">Submit your lyrics or composition for a blind review. Our AI mentors analyze your work without seeing who you are.</p>
            </div>
            
            <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-800">
              <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Chair Turns</h3>
              <p className="text-gray-300">If a mentor likes your work, their chair will turn. Multiple mentors may turn, giving you options for who to work with.</p>
            </div>
            
            <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-800">
              <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Choose Your Coach</h3>
              <p className="text-gray-300">If multiple mentors turn, you get to choose who you want to work with on your creative journey.</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-t from-purple-900/20 to-transparent py-8 mt-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            DarkVoice — Where your rawest thoughts become your realest sound
          </p>
        </div>
      </footer>
    </div>
  );
}