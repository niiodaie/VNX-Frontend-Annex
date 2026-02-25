import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import Waveform from '@/components/ui/waveform';
import { Play, Pause } from 'lucide-react';

export default function EmbedTrackPage() {
  const [, params] = useRoute('/track/:id/embed');
  const trackId = params?.id || '1';
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Mock track data - in a real app, this would be fetched based on the trackId
  const track = {
    id: trackId,
    title: trackId === '1' ? 'Deep Purple Nights' : 'Midnight Serenade',
    artist: 'DarkNotes User',
    duration: '3:24'
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="h-full w-full bg-[#121212] text-white overflow-hidden rounded-md border border-[#333]">
      <div className="flex items-center p-4 h-full">
        <Button
          variant="default"
          size="icon"
          className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700 flex-shrink-0 mr-4"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-2">
            <div className="truncate">
              <h3 className="font-medium text-sm truncate">{track.title}</h3>
              <p className="text-gray-400 text-xs truncate">{track.artist}</p>
            </div>
            <a 
              href={`${window.location.origin}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 text-xs whitespace-nowrap ml-2"
            >
              DarkNotes
            </a>
          </div>
          
          <div className="h-7">
            <Waveform
              isAnimated={isPlaying}
              barCount={40}
              className="w-full h-full"
            />
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
            <span>{isPlaying ? '0:45' : '0:00'}</span>
            <span>{track.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}