import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Challenge } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function ChallengeSection() {
  const { data: challenges = [], isLoading } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges'],
  });

  // Find the featured challenge
  const featuredChallenge = challenges.find(c => c.isFeatured);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-white">Current Challenges</h2>
        <Link href="/challenges">
          <a className="text-primary hover:text-[#F472B6] text-sm">View All Challenges</a>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="bg-gradient-to-r from-primary/20 to-[#F472B6]/20 rounded-xl overflow-hidden shadow-lg border border-primary/30 p-6 relative">
          <div className="absolute top-0 right-0 bg-[#F472B6] text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
            Featured
          </div>
          
          <Skeleton className="h-7 w-64 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-4/5 mb-4" />
          
          <div className="flex justify-between mb-4">
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-6 w-36" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Skeleton className="h-10 w-full sm:w-1/2" />
            <Skeleton className="h-10 w-full sm:w-1/2" />
          </div>
        </div>
      ) : featuredChallenge ? (
        <div className="bg-gradient-to-r from-primary/20 to-[#F472B6]/20 rounded-xl overflow-hidden shadow-lg border border-primary/30 p-6 relative">
          <div className="absolute top-0 right-0 bg-[#F472B6] text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
            Featured
          </div>
          
          <h3 className="text-xl font-medium text-white mb-2">{featuredChallenge.title}</h3>
          <p className="text-gray-300 mb-4">{featuredChallenge.description}</p>
          
          <div className="flex justify-between mb-4">
            <div>
              <span className="text-gray-400 text-sm">Entries</span>
              <p className="text-white text-xl font-medium">{featuredChallenge.entries}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Time Left</span>
              <p className="text-white text-xl font-medium">{featuredChallenge.daysLeft} {featuredChallenge.daysLeft === 1 ? 'Day' : 'Days'}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Prize</span>
              <p className="text-white text-xl font-medium">{featuredChallenge.prize}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Button className="bg-primary hover:bg-primary/90 text-white flex-1 inline-flex items-center justify-center">
              <i className="fas fa-music mr-2"></i>
              Listen to Beat
            </Button>
            <Button variant="outline" className="bg-white hover:bg-white/90 text-primary border-white flex-1 inline-flex items-center justify-center">
              <i className="fas fa-trophy mr-2"></i>
              Enter Challenge
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-lg border border-[#2D2D2D] p-6 text-center">
          <p className="text-gray-300 mb-2">No active challenges at the moment</p>
          <p className="text-gray-400 text-sm">Check back soon for new challenges!</p>
        </div>
      )}
    </div>
  );
}
