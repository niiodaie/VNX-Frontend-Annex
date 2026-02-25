import React from 'react';

interface MentorRealImageProps {
  name: string;
  className?: string;
}

export const MentorRealImage: React.FC<MentorRealImageProps> = ({ name, className = '' }) => {
  // Map mentor names to their respective image paths
  const getMentorImagePath = (mentorName: string) => {
    switch (mentorName) {
      case 'Kendrick Flow':
        return '/assets/mentors/kendrick-flow-new.png';
      case 'Nova Rae':
        return '/assets/nova-rae.png';
      case 'MetroDeep':
        return '/assets/metro-deep.png';
      case 'Blaze420':
        return '/assets/blaze420.png';
      case 'IvyMuse':
        return '/assets/ivy-muse.png';
      default:
        return '/assets/kendrick-mentor.png'; // Default to existing mentor image as fallback
    }
  };
  
  const imagePath = getMentorImagePath(name);
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img 
        src={imagePath} 
        alt={`Mentor ${name}`} 
        className="w-full h-full object-cover object-center"
      />
      {/* Apply stylized effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-purple-900/10 mix-blend-overlay"></div>
    </div>
  );
};