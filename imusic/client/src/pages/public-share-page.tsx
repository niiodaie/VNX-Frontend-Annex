import React, { useState } from 'react';
import { Link, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import ShareMusic from '@/components/share/share-music';
import Waveform from '@/components/ui/waveform';
import { Play, Pause, ChevronLeft, Music2 } from 'lucide-react';

export default function PublicSharePage() {
  const [, params] = useRoute('/track/:id');
  const trackId = params?.id || '1';
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Mock track data - in a real app, this would be fetched based on the trackId
  const track = {
    id: trackId,
    title: trackId === '1' ? 'Deep Purple Nights' : 'Midnight Serenade',
    artist: 'DarkNotes User',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    duration: '3:24',
    description: 'Created with DarkNotes AI music platform. A blend of modern beats with classic influences.'
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-950 text-white">
      {/* Header */}
      <header className="px-6 py-6 border-b border-[#333] bg-black bg-opacity-40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/">
            <span className="text-3xl font-['Playfair_Display'] font-semibold text-purple-400 hover:text-purple-300 transition cursor-pointer">
              DarkNotes
            </span>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="border-[#333] text-gray-300 hover:text-white">
              Sign Up Free
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link href="/">
            <span className="inline-flex items-center text-purple-400 hover:text-purple-300 transition mb-4 cursor-pointer">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to DarkNotes
            </span>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{track.title}</h1>
          <p className="text-lg text-gray-400">By {track.artist}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#1A1A1A] rounded-lg overflow-hidden border border-[#333] mb-6">
              <div className="aspect-video relative">
                {track.image && (
                  <img 
                    src={track.image}
                    alt={track.title}
                    className="w-full h-full object-cover brightness-75"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="default"
                    size="icon"
                    className="h-16 w-16 rounded-full bg-purple-600/90 hover:bg-purple-600 text-white"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8 ml-1" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="h-20 mb-4">
                  <Waveform
                    isAnimated={isPlaying}
                    barCount={50}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>{isPlaying ? '1:26' : '0:00'}</span>
                  <span>{track.duration}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-6 mb-6">
              <h2 className="text-xl font-medium mb-4">About This Track</h2>
              <p className="text-gray-300 mb-4">{track.description}</p>
              <p className="text-gray-400 text-sm">Created with help from AI mentorship on DarkNotes. Want to create your own music? Sign up for free.</p>
            </div>
            
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-6">
              <h2 className="text-xl font-medium mb-4">Comments</h2>
              <div className="text-gray-400 text-center py-4">
                <Music2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>Sign in to DarkNotes to leave comments on this track</p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-6 mb-6 sticky top-4">
              <h2 className="text-xl font-medium mb-4">Share This Track</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-[#252525] rounded-lg">
                  <h3 className="font-medium mb-2 text-purple-300">Social Media</h3>
                  <p className="text-sm text-gray-400 mb-3">Share with friends and followers</p>
                  <ShareMusic 
                    trackTitle={track.title}
                    variant="minimal"
                    platforms={['twitter', 'facebook', 'instagram', 'linkedin']}
                    className="justify-around mb-2"
                  />
                </div>
                
                <div className="p-4 bg-[#252525] rounded-lg">
                  <h3 className="font-medium mb-2 text-purple-300">Embed</h3>
                  <p className="text-sm text-gray-400 mb-3">Add to your website</p>
                  <div className="bg-[#1A1A1A] p-3 rounded border border-[#444] font-mono text-xs overflow-x-auto">
                    {`<iframe src="${window.location.origin}/track/${trackId}/embed" width="100%" height="160" frameborder="0"></iframe>`}
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link href="/">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Create Your Own Track
                    </Button>
                  </Link>
                  <p className="mt-3 text-center text-xs text-gray-400">
                    Sign up for DarkNotes and create music with AI mentors
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-6">
              <h2 className="text-xl font-medium mb-4">More From This Artist</h2>
              <div className="space-y-3">
                {['Journey Through Sound', 'Late Night Vibes', 'Urban Echoes'].map((title, i) => (
                  <Link href={`/track/${i + 2}`} key={i}>
                    <div className="flex items-center p-2 hover:bg-[#252525] rounded-lg transition-colors cursor-pointer">
                      <div className="w-10 h-10 bg-purple-900/30 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                        <Music2 className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-200">{title}</p>
                        <p className="text-xs text-gray-400">2:45</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-20 py-10 bg-black bg-opacity-40">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Link href="/">
            <span className="text-2xl font-['Playfair_Display'] font-semibold text-purple-400 hover:text-purple-300 transition cursor-pointer inline-block mb-4">
              DarkNotes
            </span>
          </Link>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Where your rawest thoughts become your realest sound. AI mentorship from the world's top artists.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-500 hover:text-purple-400"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-gray-500 hover:text-purple-400"><i className="fab fa-instagram"></i></a>
            <a href="#" className="text-gray-500 hover:text-purple-400"><i className="fab fa-youtube"></i></a>
            <a href="#" className="text-gray-500 hover:text-purple-400"><i className="fab fa-spotify"></i></a>
          </div>
          <div className="mt-8 text-xs text-gray-600">
            © 2025 DarkNotes. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}