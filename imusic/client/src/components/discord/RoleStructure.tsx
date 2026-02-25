import React from 'react';
import { Card } from '@/components/ui/card';

type Role = {
  name: string;
  emoji: string;
  description: string;
  color: string;
};

const roles: Role[] = [
  {
    name: 'Artist',
    emoji: '🎙',
    description: 'Default role for all members. Access to most community channels.',
    color: 'bg-blue-500'
  },
  {
    name: 'AI Mentor',
    emoji: '🧠',
    description: 'Bot role for our AI mentors that provide feedback and guidance.',
    color: 'bg-purple-500'
  },
  {
    name: 'Verified Mentor',
    emoji: '🌟',
    description: 'Partner artists or expert curators with special privileges.',
    color: 'bg-yellow-500'
  },
  {
    name: 'OG',
    emoji: '🔥',
    description: 'Early testers and longtime community members.',
    color: 'bg-orange-500'
  },
  {
    name: 'Admin',
    emoji: '👑',
    description: 'Server administrators with all permissions.',
    color: 'bg-red-500'
  },
  {
    name: 'Mod',
    emoji: '🛡',
    description: 'Moderators who help keep the community safe and friendly.',
    color: 'bg-green-500'
  }
];

const RoleStructure: React.FC = () => {
  return (
    <Card className="bg-[#1E1E1E] border-purple-900/30 p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Role Structure</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {roles.map((role, index) => (
          <div 
            key={index} 
            className="border border-[#2D2D2D] rounded-md p-3 flex items-start"
          >
            <div className={`${role.color} w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 mr-3`}>
              {role.emoji}
            </div>
            <div>
              <h4 className="text-white text-sm font-medium">{role.name}</h4>
              <p className="text-gray-400 text-xs mt-1">{role.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-[#2D2D2D]">
        <h4 className="text-white text-sm font-medium mb-2">Role Setup Tips</h4>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Set up role hierarchies with appropriate permissions</li>
          <li>• Use the Carl-bot reaction roles to let users self-assign certain roles</li>
          <li>• Create genre roles (Hip-Hop, R&B, Lo-Fi, etc.) to help users find like-minded creators</li>
          <li>• The "Artist" role should be assigned automatically to all new members</li>
        </ul>
      </div>
    </Card>
  );
};

export default RoleStructure;