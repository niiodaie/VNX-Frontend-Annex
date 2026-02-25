import { Mentor } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface MentorCardProps {
  mentor: Mentor;
  onSelect: (mentorId: number) => void;
  isSelected?: boolean;
  isPending?: boolean;
}

export default function MentorCard({ mentor, onSelect, isSelected = false, isPending = false }: MentorCardProps) {
  return (
    <div className="bg-gray-900/30 border border-gray-800 rounded-lg overflow-hidden hover:border-purple-700/50 transition-all duration-300">
      <div className="aspect-square overflow-hidden">
        <img 
          src={mentor.profileImage} 
          alt={mentor.name}
          className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-2xl font-medium text-white mb-4">{mentor.name}</h3>
        <Button 
          onClick={() => onSelect(mentor.id)}
          variant="outline"
          className="w-full border-gray-700 hover:bg-purple-900/50 hover:border-purple-700 transition-all duration-300"
          disabled={isPending}
        >
          {isPending && isSelected ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          {isSelected ? 'Selected' : 'Select'}
        </Button>
      </div>
    </div>
  );
}
