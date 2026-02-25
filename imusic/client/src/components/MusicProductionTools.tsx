import React from 'react';
import { Button } from '@/components/ui/button';
import { Gamepad2, Wand2, Users, Music, Layers, ChevronUp } from 'lucide-react';
import { Link } from 'wouter';

interface MusicProductionToolsProps {
  className?: string;
}

const MusicProductionTools: React.FC<MusicProductionToolsProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className={`bg-[#0f0f14] border border-purple-900/30 rounded-lg p-3 ${className}`}>
      <div className="grid grid-cols-1 gap-2">
        {!isCollapsed && (
          <>
            <Link href="/music-tutorials" className="w-full">
              <Button 
                variant="ghost" 
                className="bg-[#1a1a24] hover:bg-[#23232f] text-white justify-start h-auto py-3 w-full"
              >
                <Gamepad2 className="w-4 h-4 mr-2 text-purple-400" />
                <span>Music production tutorial mini-games</span>
              </Button>
            </Link>
            
            <Link href="/sound-design" className="w-full">
              <Button 
                variant="ghost" 
                className="bg-[#1a1a24] hover:bg-[#23232f] text-white justify-start h-auto py-3 w-full"
              >
                <Layers className="w-4 h-4 mr-2 text-purple-400" />
                <span>Sound design challenge creator</span>
              </Button>
            </Link>
            
            <Link href="/collaborations" className="w-full">
              <Button 
                variant="ghost" 
                className="bg-[#1a1a24] hover:bg-[#23232f] text-white justify-start h-auto py-3 w-full"
              >
                <Users className="w-4 h-4 mr-2 text-purple-400" />
                <span>Real-time collaboration sketching for musicians</span>
              </Button>
            </Link>
            
            <Link href="/melody-ai" className="w-full">
              <Button 
                variant="ghost" 
                className="bg-[#1a1a24] hover:bg-[#23232f] text-white justify-start h-auto py-3 w-full"
              >
                <Wand2 className="w-4 h-4 mr-2 text-purple-400" />
                <span>Melody generation AI assistant</span>
              </Button>
            </Link>
            
            <Link href="/genre-matcher" className="w-full">
              <Button 
                variant="ghost" 
                className="bg-[#1a1a24] hover:bg-[#23232f] text-white justify-start h-auto py-3 w-full"
              >
                <Music className="w-4 h-4 mr-2 text-purple-400" />
                <span>Interactive music genre mood matcher</span>
              </Button>
            </Link>
            
            <Link href="/daw-integration" className="w-full">
              <Button 
                variant="ghost" 
                className="bg-[#1a1a24] hover:bg-[#23232f] text-white justify-start h-auto py-3 w-full"
              >
                <Layers className="w-4 h-4 mr-2 text-blue-400" />
                <span>Full-featured DAW integration</span>
              </Button>
            </Link>
          </>
        )}
        
        <Button 
          variant="ghost" 
          className="text-gray-400 hover:text-white flex items-center justify-center"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? 'Show more' : 'Show less'}
          <ChevronUp className={`w-4 h-4 ml-1 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default MusicProductionTools;