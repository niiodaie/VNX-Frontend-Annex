import { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Settings, Camera, Maximize, MoreVertical } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface VideoPlayerProps {
  lessonId: number;
  courseId: number;
  instructorId: number;
  title: string;
  subTitle: string;
  instructorName: string;
}

const VideoPlayer = ({ lessonId, courseId, instructorId, title, subTitle, instructorName }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(60 * 45); // 45 minutes in seconds
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState("720p");

  // Simulate video progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          const newProgress = (newTime / duration) * 100;
          setProgress(newProgress);
          
          if (newTime >= duration) {
            setIsPlaying(false);
            return duration;
          }
          
          return newTime;
        });
      }, 1000 / playbackRate);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration, playbackRate]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const newTime = position * duration;
    setCurrentTime(newTime);
    setProgress((newTime / duration) * 100);
  };

  return (
    <div className="video-player bg-neutral-900 rounded-md shadow-inner relative">
      <div className="w-full h-full object-cover rounded-md opacity-70 aspect-video relative overflow-hidden">
        <img 
          src={`https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e`} 
          alt="AI Instructor teaching" 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.5 }} 
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          {!isPlaying && (
            <button 
              className="bg-white bg-opacity-20 rounded-full p-4 hover:bg-opacity-30 transition-all duration-200"
              onClick={togglePlayPause}
            >
              <Play className="h-10 w-10 text-white" fill="white" />
            </button>
          )}
        </div>
        
        {/* Title overlay */}
        <div className="absolute top-4 left-4 right-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-white font-medium text-lg">{title}</h3>
              <p className="text-neutral-300 text-sm">{instructorName} • {subTitle}</p>
            </div>
            <div className="flex space-x-2">
              <button className="text-white hover:text-neutral-300 transition-colors duration-200 bg-black/30 p-1 rounded">
                <Camera className="h-5 w-5" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-white hover:text-neutral-300 transition-colors duration-200 bg-black/30 p-1 rounded">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Download lesson</DropdownMenuItem>
                  <DropdownMenuItem>Share lesson</DropdownMenuItem>
                  <DropdownMenuItem>Report issue</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div 
            className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-2 relative"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                className="text-white hover:text-primary-300 transition-colors p-1"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  className="text-white hover:text-primary-300 transition-colors p-1"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-primary-500"
                />
              </div>
              
              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-white hover:text-primary-300 transition-colors p-1">
                    <Settings className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setPlaybackRate(0.5)}>
                    {playbackRate === 0.5 && "✓ "}0.5x
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPlaybackRate(1)}>
                    {playbackRate === 1 && "✓ "}1x (Normal)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPlaybackRate(1.5)}>
                    {playbackRate === 1.5 && "✓ "}1.5x
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPlaybackRate(2)}>
                    {playbackRate === 2 && "✓ "}2x
                  </DropdownMenuItem>
                  <DropdownMenuItem className="border-t mt-1 pt-1">
                    {quality === "480p" && "✓ "}480p
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setQuality("720p")}>
                    {quality === "720p" && "✓ "}720p (HD)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setQuality("1080p")}>
                    {quality === "1080p" && "✓ "}1080p (Full HD)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <button className="text-white hover:text-primary-300 transition-colors p-1">
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
