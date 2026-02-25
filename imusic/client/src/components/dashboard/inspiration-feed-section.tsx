import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { InspirationItem } from '@shared/schema';
import Waveform from '@/components/ui/waveform';
import { Skeleton } from '@/components/ui/skeleton';

export default function InspirationFeedSection() {
  const { data: inspirationItems = [], isLoading } = useQuery<InspirationItem[]>({
    queryKey: ['/api/inspiration'],
  });
  
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-white">Inspiration Feed</h2>
        <Link href="/inspiration">
          <a className="text-primary hover:text-[#F472B6] text-sm">View All</a>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-md border border-[#2D2D2D] p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="ml-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-12 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inspirationItems.map((item) => (
            <div key={item.id} className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-md border border-[#2D2D2D]">
              {item.type === 'audio' && (
                <div className="h-28 bg-[#2D2D2D] relative flex items-center justify-center">
                  <Waveform barCount={12} />
                  <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 w-12 h-12 rounded-full flex items-center justify-center text-white">
                    <i className="fas fa-play"></i>
                  </button>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <img 
                      src={item.imageUrl || ''}
                      alt={`${item.title} creator`}
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium text-white">{item.title.split(' ')[0]}</p>
                      <p className="text-xs text-gray-400">{item.type === 'prompt' ? 'Writing Prompt' : item.type === 'audio' ? 'Beat Sample' : 'Mentor'}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{formatTimeAgo(item.createdAt)}</span>
                </div>
                
                <h3 className="text-white font-medium mb-2">{item.title}</h3>
                
                {item.type === 'prompt' ? (
                  <div className="bg-[#2D2D2D] p-3 rounded-lg notebook-bg mb-3">
                    <p className="text-white italic text-sm">{item.content}</p>
                  </div>
                ) : item.type !== 'audio' && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.content}</p>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-white">
                      <i className="far fa-heart"></i>
                    </button>
                    <button className="text-gray-400 hover:text-white">
                      <i className="far fa-bookmark"></i>
                    </button>
                  </div>
                  <a href="#" className="text-primary hover:text-[#F472B6] text-sm">
                    {item.type === 'prompt' 
                      ? 'Try This Prompt' 
                      : item.type === 'audio'
                        ? 'Use Beat'
                        : 'Read More'}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
