import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Collaboration } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function CollabZonePreview() {
  const { data: collaborations = [], isLoading } = useQuery<Collaboration[]>({
    queryKey: ['/api/collaborations'],
  });

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-white">Collab Zone</h2>
        <Link href="/collab">
          <a className="text-primary hover:text-[#F472B6] text-sm">Find More Artists</a>
        </Link>
      </div>
      
      <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-lg border border-[#2D2D2D] p-6">
        <h3 className="text-lg font-medium text-white mb-4">Trending Collabs</h3>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-[#2D2D2D] rounded-lg p-4">
                <div className="flex">
                  <div className="flex -space-x-4 mr-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="w-10 h-10 rounded-full" />
                  </div>
                  <div>
                    <Skeleton className="h-5 w-40 mb-1" />
                    <Skeleton className="h-4 w-32 mb-2" />
                    <div className="mt-2 flex">
                      <Skeleton className="h-6 w-16 rounded mr-2" />
                      <Skeleton className="h-6 w-16 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {collaborations.map((collab) => (
              <div key={collab.id} className="bg-[#2D2D2D] rounded-lg p-4 flex">
                <div className="flex -space-x-4 mr-4">
                  {/* Mock collaborator images - in a real app these would come from the user data */}
                  <div className="w-10 h-10 rounded-full border-2 border-[#2D2D2D] bg-[#1E1E1E] flex items-center justify-center text-gray-400">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-[#2D2D2D] bg-[#1E1E1E] flex items-center justify-center text-gray-400">
                    <i className="fas fa-plus"></i>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-medium">{collab.title}</h4>
                  <p className="text-gray-400 text-sm">Looking for {collab.lookingFor}</p>
                  <div className="mt-2">
                    {collab.tags.split(',').map((tag, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-[#121212] text-xs text-gray-300 rounded mr-2 mb-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-center">
          <Link href="/collab">
            <Button className="bg-primary hover:bg-primary/90 text-white inline-flex items-center">
              <i className="fas fa-users mr-2"></i>
              Join a Collab
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
