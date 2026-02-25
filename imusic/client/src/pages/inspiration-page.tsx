import { useQuery } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { InspirationItem } from '@shared/schema';
import Sidebar from '@/components/layout/sidebar';
import MobileNav from '@/components/layout/mobile-nav';
import Waveform from '@/components/ui/waveform';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function InspirationPage() {
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [, navigate] = useLocation();
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

  const textItems = inspirationItems.filter(item => item.type === 'text');
  const promptItems = inspirationItems.filter(item => item.type === 'prompt');
  const audioItems = inspirationItems.filter(item => item.type === 'audio');

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-[#121212] text-white">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto bg-[#121212] pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Inspiration Feed</h1>
            <p className="text-gray-400 mt-2">Discover new ideas, prompts, and samples from your mentors</p>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full">
              <Input 
                className="bg-[#1E1E1E] border-[#2D2D2D] pl-10 py-6"
                placeholder="Search for inspiration..."
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <i className="fas fa-bolt mr-2"></i>
              Generate New Idea
            </Button>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4 mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
              <TabsTrigger value="beats">Beats</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <TabsContent value="all" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inspirationItems.map((item) => (
                      <div key={item.id} className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-md border border-[#2D2D2D]">
                        {item.type === 'audio' && (
                          <div className="h-28 bg-[#2D2D2D] relative flex items-center justify-center">
                            <Waveform 
                              barCount={12} 
                              isAnimated={item.id === playingAudio}
                            />
                            <button 
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 w-12 h-12 rounded-full flex items-center justify-center text-white"
                              onClick={() => {
                                if (playingAudio === item.id) {
                                  setPlayingAudio(null);
                                  if (audioRef.current) {
                                    audioRef.current.pause();
                                  }
                                } else {
                                  setPlayingAudio(item.id);
                                  if (audioRef.current) {
                                    audioRef.current.src = item.audioUrl || '';
                                    audioRef.current.play();
                                  }
                                }
                              }}
                            >
                              <i className={`fas ${playingAudio === item.id ? 'fa-pause' : 'fa-play'}`}></i>
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
                            <p className="text-gray-400 text-sm mb-3">{item.content}</p>
                          )}
                          
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                              <button 
                                className="text-gray-400 hover:text-white"
                                onClick={() => console.log(`Like ${item.title}`)}
                              >
                                <i className="far fa-heart"></i>
                              </button>
                              <button 
                                className="text-gray-400 hover:text-white"
                                onClick={() => console.log(`Save ${item.title}`)}
                              >
                                <i className="far fa-bookmark"></i>
                              </button>
                            </div>
                            <button 
                              className="text-primary hover:text-[#F472B6] text-sm"
                              onClick={() => {
                                if (item.type === 'prompt') {
                                  console.log(`Using prompt: ${item.title}`);
                                  navigate('/muse-lab');
                                } else if (item.type === 'audio') {
                                  console.log(`Using beat: ${item.title}`);
                                  navigate('/studio');
                                } else {
                                  console.log(`Reading more about: ${item.title}`);
                                }
                              }}
                            >
                              {item.type === 'prompt' 
                                ? 'Try This Prompt' 
                                : item.type === 'audio'
                                  ? 'Use Beat'
                                  : 'Read More'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="prompts" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {promptItems.map((item) => (
                      <div key={item.id} className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-md border border-[#2D2D2D]">
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
                                <p className="text-xs text-gray-400">Writing Prompt</p>
                              </div>
                            </div>
                            <span className="text-xs text-gray-400">{formatTimeAgo(item.createdAt)}</span>
                          </div>
                          
                          <h3 className="text-white font-medium mb-2">{item.title}</h3>
                          
                          <div className="bg-[#2D2D2D] p-3 rounded-lg notebook-bg mb-3">
                            <p className="text-white italic text-sm">{item.content}</p>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                              <button 
                                className="text-gray-400 hover:text-white"
                                onClick={() => console.log(`Like ${item.title}`)}
                              >
                                <i className="far fa-heart"></i>
                              </button>
                              <button 
                                className="text-gray-400 hover:text-white"
                                onClick={() => console.log(`Save ${item.title}`)}
                              >
                                <i className="far fa-bookmark"></i>
                              </button>
                            </div>
                            <button 
                              className="text-primary hover:text-[#F472B6] text-sm"
                              onClick={() => {
                                console.log(`Using prompt: ${item.title}`);
                                navigate('/muse-lab');
                              }}
                            >
                              Try This Prompt
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="beats" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {audioItems.map((item) => (
                      <div key={item.id} className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-md border border-[#2D2D2D]">
                        <div className="h-28 bg-[#2D2D2D] relative flex items-center justify-center">
                          <Waveform 
                            barCount={12} 
                            isAnimated={item.id === playingAudio}
                          />
                          <button 
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 w-12 h-12 rounded-full flex items-center justify-center text-white"
                            onClick={() => {
                              if (playingAudio === item.id) {
                                setPlayingAudio(null);
                                if (audioRef.current) {
                                  audioRef.current.pause();
                                }
                              } else {
                                setPlayingAudio(item.id);
                                if (audioRef.current) {
                                  audioRef.current.src = item.audioUrl || '';
                                  audioRef.current.play();
                                }
                              }
                            }}
                          >
                            <i className={`fas ${playingAudio === item.id ? 'fa-pause' : 'fa-play'}`}></i>
                          </button>
                        </div>
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
                                <p className="text-xs text-gray-400">Beat Sample</p>
                              </div>
                            </div>
                            <span className="text-xs text-gray-400">{formatTimeAgo(item.createdAt)}</span>
                          </div>
                          
                          <h3 className="text-white font-medium mb-2">{item.title}</h3>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                              <button 
                                className="text-gray-400 hover:text-white"
                                onClick={() => console.log(`Like ${item.title}`)}
                              >
                                <i className="far fa-heart"></i>
                              </button>
                              <button 
                                className="text-gray-400 hover:text-white"
                                onClick={() => console.log(`Save ${item.title}`)}
                              >
                                <i className="far fa-bookmark"></i>
                              </button>
                            </div>
                            <button 
                              className="text-primary hover:text-[#F472B6] text-sm"
                              onClick={() => {
                                console.log(`Using beat: ${item.title}`);
                                navigate('/studio');
                              }}
                            >
                              Use Beat
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="tips" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {textItems.map((item) => (
                      <div key={item.id} className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-md border border-[#2D2D2D]">
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
                                <p className="text-xs text-gray-400">Mentor</p>
                              </div>
                            </div>
                            <span className="text-xs text-gray-400">{formatTimeAgo(item.createdAt)}</span>
                          </div>
                          
                          <h3 className="text-white font-medium mb-2">{item.title}</h3>
                          <p className="text-gray-400 text-sm mb-3">{item.content}</p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                              <button 
                                className="text-gray-400 hover:text-white"
                                onClick={() => console.log(`Like ${item.title}`)}
                              >
                                <i className="far fa-heart"></i>
                              </button>
                              <button 
                                className="text-gray-400 hover:text-white"
                                onClick={() => console.log(`Save ${item.title}`)}
                              >
                                <i className="far fa-bookmark"></i>
                              </button>
                            </div>
                            <button 
                              className="text-primary hover:text-[#F472B6] text-sm"
                              onClick={() => console.log(`Reading more about: ${item.title}`)}
                            >
                              Read More
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>
      
      <MobileNav />
      
      {/* Hidden audio element for playback */}
      <audio ref={audioRef} className="hidden" onEnded={() => setPlayingAudio(null)} />
    </div>
  );
}
