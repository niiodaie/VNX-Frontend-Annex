import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MentorVoiceFeedbackProps {
  text: string;
  audioUrl?: string;
  mentorName: string;
}

export default function MentorVoiceFeedback({ text, audioUrl, mentorName }: MentorVoiceFeedbackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0.8);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Initialize audio
  useEffect(() => {
    if (!audioUrl) return;
    
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.volume = volumeLevel;
    
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    });
    
    audio.addEventListener('timeupdate', () => {
      setProgress(audio.currentTime / audio.duration);
      drawWaveform(progress);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
    });
    
    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [audioUrl]);
  
  // Draw waveform visualization
  const drawWaveform = (progressPos: number) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    
    // Number of bars
    const bars = 40;
    const barWidth = width / bars - 2;
    
    // Generate random heights for the bars (in a real app, this would be based on actual audio data)
    for (let i = 0; i < bars; i++) {
      // Create a semi-random pattern that feels like a voice pattern
      // More variation in the middle, lower at the ends
      const position = i / bars;
      const distanceFromCenter = Math.abs(position - 0.5) * 2;
      const randomVariation = Math.sin(i * 0.4) * 0.3 + 0.5;
      
      let barHeight = height * 0.1 + Math.random() * height * 0.3 * (1 - distanceFromCenter) * randomVariation;
      
      // Limit bar height
      barHeight = Math.min(barHeight, height * 0.8);
      
      // Position of the bar
      const x = i * (barWidth + 2);
      
      // Bar color based on progress
      if (position <= progressPos) {
        ctx.fillStyle = 'rgba(168, 85, 247, 0.8)'; // Purple (played)
      } else {
        ctx.fillStyle = 'rgba(107, 114, 128, 0.3)'; // Gray (not played)
      }
      
      // Draw the bar
      ctx.fillRect(x, (height - barHeight) / 2, barWidth, barHeight);
    }
  };
  
  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      // Ensure canvas is properly sized
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;
      
      // Draw initial waveform
      drawWaveform(0);
    }
  }, [canvasRef]);
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volumeLevel;
    } else {
      audioRef.current.volume = 0;
    }
    
    setIsMuted(!isMuted);
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <div className="w-full">
      {/* Text content */}
      <div className="mb-4 whitespace-pre-wrap break-words">
        {text}
      </div>
      
      {audioUrl && (
        <div className="mt-3 mb-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs text-purple-400 font-medium mr-1">{mentorName}'s Voice</span>
            <div className="flex-1 h-px bg-gray-800"></div>
          </div>
          
          <div className="bg-gray-900/40 rounded-lg p-2 border border-gray-800">
            <div className="flex items-center space-x-2">
              {/* Play/Pause Button */}
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-purple-900/50 hover:bg-purple-900/80 text-white"
                disabled={!isLoaded}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              {/* Waveform Visualization */}
              <div className="flex-1 h-16 relative cursor-pointer" onClick={(e) => {
                if (!audioRef.current || !canvasRef.current) return;
                
                const rect = canvasRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const newProgress = x / rect.width;
                
                audioRef.current.currentTime = newProgress * duration;
                setProgress(newProgress);
                drawWaveform(newProgress);
              }}>
                <canvas
                  ref={canvasRef}
                  className="w-full h-full absolute inset-0"
                />
              </div>
              
              {/* Volume Control */}
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-gray-800/50 hover:bg-gray-800/80 text-white"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Time Info */}
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-2">
              <span>{formatTime(duration * progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}