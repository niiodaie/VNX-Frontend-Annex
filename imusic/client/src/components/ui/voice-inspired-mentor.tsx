import { useState, useEffect } from 'react';
import { getMentorImage } from '../mentor-images';

interface VoiceInspiredMentorProps {
  name: string;
  inspiredBy: string;
  style?: string;
  imagePath?: string;
  onClick?: () => void;
}

/**
 * A mentor card component inspired by The Voice's aesthetics
 * with the signature chair-turn animation
 */
export function VoiceInspiredMentor({ 
  name, 
  inspiredBy, 
  style, 
  imagePath, 
  onClick 
}: VoiceInspiredMentorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isChairTurned, setIsChairTurned] = useState(false);

  // Simulate the chair turn effect when hovered
  useEffect(() => {
    if (isHovered && !isChairTurned) {
      const timer = setTimeout(() => {
        setIsChairTurned(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
    
    if (!isHovered && isChairTurned) {
      const timer = setTimeout(() => {
        setIsChairTurned(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isHovered, isChairTurned]);
  
  // Create a fixed placeholder SVG that doesn't rely on dynamic encoding
  const nameInitials = name.substring(0, 2).toUpperCase();
  const placeholder = (
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="#1a101f" />
      <circle cx="200" cy="160" r="80" fill="#a78bff" opacity="0.2" />
      <circle cx="200" cy="160" r="60" fill="#a78bff" opacity="0.2" />
      <circle cx="200" cy="160" r="40" fill="#a78bff" opacity="0.2" />
      <path d="M160,220 C160,180 240,180 240,220 L240,280 C160,280 160,280 160,220 Z" fill="#a78bff" opacity="0.3" />
      <circle cx="200" cy="160" r="70" fill="none" stroke="#a78bff" strokeWidth="2" strokeDasharray="1,3" />
      <text x="200" y="300" fontSize="30" textAnchor="middle" fill="#fff" fontFamily="sans-serif">{nameInitials}</text>
      <text x="200" y="340" fontSize="18" textAnchor="middle" fill="#a78bff" fontFamily="sans-serif">{name}</text>
    </svg>
  );
  
  return (
    <div 
      className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Background with chair turn effect */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b from-red-900/80 to-black transition-transform duration-700 ease-out ${isChairTurned ? 'scale-100' : 'scale-0'}`}
        style={{transformOrigin: 'center bottom'}}
      />
      
      {/* Mentor image */}
      <div className="absolute inset-0 z-10">
        {imagePath || getMentorImage(name) ? (
          <img 
            src={imagePath || getMentorImage(name)} 
            alt={name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // If image fails to load, show placeholder
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const placeholder = document.createElement('div');
                placeholder.className = "w-full h-full bg-[#1a101f] flex items-center justify-center";
                parent.appendChild(placeholder);
              }
            }}
          />
        ) : (
          <div 
            className="w-full h-full bg-[#1a101f] flex items-center justify-center"
          >
            {placeholder}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>
      
      {/* Red chair silhouette */}
      <div className={`absolute bottom-0 left-0 right-0 h-1/5 bg-red-700/60 z-5 transition-all duration-500 ${isChairTurned ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12">
          <div className="absolute inset-0 bg-red-600 rounded-t-full" />
        </div>
      </div>
      
      {/* Mentor info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-xl font-medium text-white mb-1">{name}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-red-400 uppercase tracking-wider">Inspired by</span>
          <span className="text-sm text-gray-300">{inspiredBy}</span>
        </div>
        {style && (
          <p className="text-xs text-gray-400 mt-1">{style}</p>
        )}
      </div>
      
      {/* I WANT YOU - appears when chair turns */}
      <div 
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 transition-opacity duration-300 ${isChairTurned ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="bg-red-600/90 px-4 py-2 rounded-full text-lg font-bold text-white whitespace-nowrap">
          I WANT YOU!
        </div>
      </div>
    </div>
  );
}