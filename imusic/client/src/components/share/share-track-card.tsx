import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ShareMusic from './share-music';
import Waveform from '@/components/ui/waveform';
import { Play, Pause } from 'lucide-react';

interface ShareTrackCardProps {
  trackId: string | number;
  trackTitle: string;
  trackArtist?: string;
  trackImage?: string;
  trackDuration?: string;
  onPlay?: () => void;
  isPlaying?: boolean;
  className?: string;
}

export default function ShareTrackCard({
  trackId,
  trackTitle,
  trackArtist = 'You',
  trackImage,
  trackDuration = '0:00',
  onPlay,
  isPlaying = false,
  className = ''
}: ShareTrackCardProps) {
  // Generate the share URL - this is the public-facing track page
  const trackUrl = `${window.location.origin}/track/${trackId}`;
  
  return (
    <Card className={`bg-[#1A1A1A] border-[#333] overflow-hidden ${className}`}>
      <CardHeader className="p-0">
        <div className="relative h-32 overflow-hidden">
          {trackImage ? (
            <img
              src={trackImage}
              alt={trackTitle}
              className="w-full h-full object-cover brightness-75"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-transparent" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent"></div>
          
          <div className="absolute top-3 right-3">
            <ShareMusic 
              trackTitle={trackTitle}
              trackUrl={trackUrl}
              variant="icon"
              size="sm"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <CardTitle className="text-lg font-medium mb-1 line-clamp-1">{trackTitle}</CardTitle>
        <p className="text-gray-400 text-sm mb-2">{trackArtist}</p>
        
        <div className="h-16 flex items-center overflow-hidden">
          <Waveform
            isAnimated={isPlaying}
            barCount={30}
            className="w-full h-full"
          />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full h-9 w-9 p-0 flex-shrink-0 bg-primary/20 hover:bg-primary/30 border-primary/40"
          onClick={onPlay}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-white" />
          ) : (
            <Play className="h-4 w-4 text-white ml-0.5" />
          )}
        </Button>
        
        <div className="flex gap-2 items-center">
          <span className="text-gray-400 text-xs">{trackDuration}</span>
          <Link href={`/track/${trackId}`}>
            <Button variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
              Share
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}