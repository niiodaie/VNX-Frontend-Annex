import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'wouter';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { UserMentor, Mentor } from '@shared/schema';
import { Button } from '@/components/ui/button';
import Waveform from '@/components/ui/waveform';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function CurrentMentorSection() {
  const { user } = useAuth();
  
  const {
    data: userMentor,
    isLoading,
    error
  } = useQuery<UserMentor & Mentor>({
    queryKey: ['/api/user/mentor'],
    enabled: !!user,
  });

  const { data: mentors } = useQuery<Mentor[]>({
    queryKey: ['/api/mentors'],
  });

  const setMentorMutation = useMutation({
    mutationFn: async (mentorId: number) => {
      const res = await apiRequest('POST', '/api/user/mentor', { mentorId });
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/mentor'] });
    }
  });

  if (isLoading) {
    return (
      <div className="mb-10 flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userMentor && mentors) {
    // No mentor assigned yet, show selection
    return (
      <div className="mb-10">
        <h2 className="text-xl font-medium text-white mb-4">Select Your Mentor</h2>
        <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-lg border border-[#2D2D2D] p-6">
          <p className="text-gray-300 mb-6">Choose an AI mentor inspired by your favorite artist to guide your creative journey.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mentors.map(mentor => (
              <div key={mentor.id} className="bg-[#2D2D2D] rounded-lg overflow-hidden">
                <div className="h-32 relative">
                  <img 
                    src={mentor.profileImage} 
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => setMentorMutation.mutate(mentor.id)}
                      disabled={setMentorMutation.isPending}
                    >
                      {setMentorMutation.isPending ? 'Selecting...' : 'Select'}
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-white">{mentor.name}</h3>
                  <p className="text-xs text-gray-400">Inspired by {mentor.inspiredBy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!userMentor) {
    return (
      <div className="mb-10">
        <h2 className="text-xl font-medium text-white mb-4">Your Mentor</h2>
        <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-lg border border-[#2D2D2D] p-6 text-center">
          <p className="text-gray-300 mb-2">No mentor assigned yet</p>
          <Link href="/mentor">
            <a className="text-primary hover:underline">Select a mentor to begin your journey</a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <h2 className="text-xl font-medium text-white mb-4">Your Mentor</h2>
      <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-lg border border-[#2D2D2D]">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-2/5 h-64">
            <img 
              src={userMentor.profileImage}
              alt={`${userMentor.name} profile`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <span className="text-sm text-gray-300">AI Mentor inspired by</span>
              <h3 className="text-xl font-['Playfair_Display'] font-semibold text-white">{userMentor.inspiredBy}</h3>
            </div>
          </div>
          <div className="w-full md:w-3/5 p-6">
            <div className="flex items-center mb-4">
              <Waveform />
              <span className="ml-4 text-gray-400 text-sm">Latest message</span>
            </div>
            <div className="bg-[#2D2D2D] rounded-lg p-4 mb-4 notebook-bg">
              <p className="text-gray-300 italic">{userMentor.currentMessage || "Let's start creating something amazing together!"}</p>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <Button className="bg-primary hover:bg-primary/90 text-white flex items-center">
                <i className="fas fa-comment mr-2"></i>
                Chat
              </Button>
              <Button variant="outline" className="bg-[#2D2D2D] hover:bg-[#2D2D2D]/80 border-[#2D2D2D] text-white flex items-center">
                <i className="fas fa-microphone mr-2"></i>
                Record
              </Button>
              <Link href="/mentor">
                <Button variant="outline" className="bg-[#2D2D2D] hover:bg-[#2D2D2D]/80 border-[#2D2D2D] text-white flex items-center">
                  <i className="fas fa-exchange-alt mr-2"></i>
                  Switch Mentor
                </Button>
              </Link>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Your journey progress</span>
                <span>{userMentor.progress}%</span>
              </div>
              <div className="h-2 bg-[#2D2D2D] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-[#F472B6]" 
                  style={{ width: `${userMentor.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
