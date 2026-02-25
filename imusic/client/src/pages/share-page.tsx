import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import ShareMusic from '@/components/share/share-music';
import ShareTrackCard from '@/components/share/share-track-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Share2, Music2, Globe } from 'lucide-react';

// Mock track data
const mockTracks = [
  {
    id: '1',
    title: 'Deep Purple Nights',
    artist: 'You',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    duration: '3:24'
  },
  {
    id: '2',
    title: 'Midnight Serenade ft. Kendrick',
    artist: 'You',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    duration: '2:56'
  },
  {
    id: '3',
    title: 'Urban Soul',
    artist: 'You',
    image: 'https://images.unsplash.com/photo-1509310122064-4753692067f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1434&q=80',
    duration: '3:42'
  },
  {
    id: '4',
    title: 'Echoes of Tomorrow',
    artist: 'You',
    image: 'https://images.unsplash.com/photo-1466839731480-de1b71e12cb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1373&q=80',
    duration: '4:10'
  }
];

export default function SharePage() {
  const { toast } = useToast();
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState('https://darknotes.replit.app/profile/yourusername');
  
  const handlePlayTrack = (trackId: string) => {
    if (playingTrackId === trackId) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(trackId);
    }
  };
  
  const handleCopyProfileLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      toast({
        title: "Link Copied!",
        description: "Profile link copied to clipboard",
      });
    }).catch(err => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive"
      });
    });
  };
  
  return (
    <div className="min-h-screen bg-black text-white overflow-auto">
      {/* Navigation Bar */}
      <nav className="px-6 py-6 border-b border-[#333]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <a className="text-4xl font-['Playfair_Display'] font-semibold text-purple-400 hover:text-purple-300 transition cursor-pointer">
              DarkNotes
            </a>
          </Link>
          
          <div className="flex items-center space-x-10">
            <Link href="/mentor">
              <a className="text-gray-300 hover:text-white transition font-medium tracking-wide">EXPLORE</a>
            </Link>
            <Link href="/challenges">
              <a className="text-gray-300 hover:text-white transition font-medium tracking-wide">MY JOURNEY</a>
            </Link>
            <Link href="/studio">
              <a className="text-gray-300 hover:text-white transition font-medium tracking-wide">EVOLVE</a>
            </Link>
            <Link href="/music-lab">
              <a className="text-gray-300 hover:text-white transition font-medium tracking-wide">MUSIC LAB</a>
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Share Your Music</h1>
          <p className="text-gray-400">Share your tracks and profile with the world</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="tracks" className="w-full mb-8">
              <TabsList className="mb-4 bg-[#1A1A1A] border border-[#333]">
                <TabsTrigger value="tracks" className="data-[state=active]:bg-purple-900/20">
                  <Music2 className="mr-2 h-4 w-4" />
                  My Tracks
                </TabsTrigger>
                <TabsTrigger value="profile" className="data-[state=active]:bg-purple-900/20">
                  <Globe className="mr-2 h-4 w-4" />
                  My Profile
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tracks" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockTracks.map(track => (
                    <ShareTrackCard
                      key={track.id}
                      trackId={track.id}
                      trackTitle={track.title}
                      trackArtist={track.artist}
                      trackImage={track.image}
                      trackDuration={track.duration}
                      onPlay={() => handlePlayTrack(track.id)}
                      isPlaying={playingTrackId === track.id}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="profile" className="space-y-6">
                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
                  <h2 className="text-xl font-medium mb-4">Share Your Profile</h2>
                  
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <Input 
                        value={shareLink}
                        readOnly
                        className="bg-[#252525] border-[#444] text-white"
                      />
                    </div>
                    <Button 
                      onClick={handleCopyProfileLink}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Copy Link
                    </Button>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="bg-[#252525] p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Share on Social Media</h3>
                      <p className="text-gray-400 mb-4">Share your profile on your favorite social platforms with a single click</p>
                      
                      <ShareMusic 
                        trackTitle="My DarkNotes Profile"
                        trackUrl={shareLink}
                        variant="minimal"
                        platforms={['twitter', 'facebook', 'instagram', 'linkedin']}
                        className="justify-start"
                      />
                    </div>
                    
                    <div className="bg-[#252525] p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Embed Your Profile</h3>
                      <p className="text-gray-400 mb-4">Add this code to your website to showcase your DarkNotes profile</p>
                      
                      <div className="bg-[#1A1A1A] p-3 rounded border border-[#444] font-mono text-sm overflow-x-auto">
                        {`<iframe src="${shareLink}/embed" width="100%" height="450" frameborder="0"></iframe>`}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 mb-6 sticky top-4">
              <h2 className="text-xl font-medium mb-4 flex items-center">
                <Share2 className="mr-2 h-5 w-5 text-purple-400" />
                One-Click Sharing
              </h2>
              
              <p className="text-gray-400 mb-6">Share your music on various platforms with a single click. Connect with your audience and grow your fan base.</p>
              
              <div className="space-y-4">
                <div className="p-4 bg-[#252525] rounded-lg">
                  <h3 className="font-medium mb-2 text-purple-300">Track Sharing</h3>
                  <p className="text-sm text-gray-400 mb-3">Share individual tracks with friends and followers</p>
                  <ShareMusic 
                    trackTitle="Sample Track"
                    trackUrl="https://darknotes.replit.app/track/sample"
                    className="w-full"
                  />
                </div>
                
                <div className="p-4 bg-[#252525] rounded-lg">
                  <h3 className="font-medium mb-2 text-purple-300">Profile Sharing</h3>
                  <p className="text-sm text-gray-400 mb-3">Share your entire profile to showcase all your work</p>
                  <ShareMusic 
                    trackTitle="My DarkNotes Profile"
                    trackUrl="https://darknotes.replit.app/profile/yourusername"
                    variant="button"
                    className="w-full"
                  />
                </div>
                
                <Link href="/studio">
                  <a className="block text-center mt-6 text-purple-400 hover:text-purple-300 transition">
                    Create more music to share →
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}