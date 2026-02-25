import React from 'react';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

type Bot = {
  name: string;
  description: string;
  features: string[];
  url: string;
  icon: string;
};

const bots: Bot[] = [
  {
    name: 'MEE6',
    description: 'All-in-one moderation bot with leveling system',
    features: [
      'Auto-moderation',
      'Leveling system based on activity',
      'Custom commands',
      'Welcome messages'
    ],
    url: 'https://mee6.xyz/',
    icon: '🤖'
  },
  {
    name: 'Dyno',
    description: 'Powerful moderation and automation bot',
    features: [
      'Advanced moderation tools',
      'Auto-roles',
      'Custom commands',
      'Music playback'
    ],
    url: 'https://dyno.gg/',
    icon: '🛡️'
  },
  {
    name: 'Carl-bot',
    description: 'Advanced reaction roles and moderation',
    features: [
      'Reaction roles system',
      'Auto-moderation',
      'Logging',
      'Starboard'
    ],
    url: 'https://carl.gg/',
    icon: '🎭'
  },
  {
    name: 'DarkNotesBot (Custom)',
    description: 'Custom integration with DarkNotes features',
    features: [
      'AI lyrics feedback',
      'Integration with MuseLab',
      'Beat and hook generation commands',
      'Mentor feedback system'
    ],
    url: '#',
    icon: '🎵'
  }
];

const BotRecommendations: React.FC = () => {
  return (
    <Card className="bg-[#1E1E1E] border-purple-900/30 p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Recommended Discord Bots</h3>
      
      <div className="space-y-4">
        {bots.map((bot, index) => (
          <div key={index} className="border border-[#2D2D2D] rounded-md p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{bot.icon}</span>
                <h4 className="text-white font-medium">{bot.name}</h4>
              </div>
              
              {bot.url !== '#' && (
                <a 
                  href={bot.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 text-sm flex items-center"
                >
                  <span className="mr-1">Visit</span>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
            
            <p className="text-gray-300 text-sm mt-2">{bot.description}</p>
            
            <div className="mt-2">
              <h5 className="text-xs font-medium text-gray-400 mb-1">Key Features:</h5>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {bot.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="text-xs text-gray-300 flex items-center">
                    <span className="text-purple-400 mr-1">•</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-[#2D2D2D] text-sm text-gray-300">
        <p className="mb-2">
          <span className="text-purple-400 font-medium">Pro Tip:</span> Use a combination of these bots for the best experience. MEE6 or Dyno for general moderation, Carl-bot for reaction roles, and a custom bot for DarkNotes-specific features.
        </p>
        <p>
          Need help setting up your custom DarkNotes bot? Contact us for assistance.
        </p>
      </div>
    </Card>
  );
};

export default BotRecommendations;