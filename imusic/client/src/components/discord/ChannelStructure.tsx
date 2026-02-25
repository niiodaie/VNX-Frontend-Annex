import React from 'react';
import { Card } from '@/components/ui/card';

type Category = {
  name: string;
  emoji: string;
  channels: Channel[];
};

type Channel = {
  name: string;
  emoji: string;
  description: string;
};

const channelStructure: Category[] = [
  {
    name: 'Info',
    emoji: '📢',
    channels: [
      { name: 'rules', emoji: '📜', description: 'Server rules and guidelines' },
      { name: 'announcements', emoji: '📣', description: 'Official announcements and updates' },
      { name: 'get-roles', emoji: '🎟', description: 'Choose your roles and interests' },
      { name: 'support-faq', emoji: '🆘', description: 'Get help and answers to common questions' }
    ]
  },
  {
    name: 'Community',
    emoji: '💬',
    channels: [
      { name: 'introductions', emoji: '👋', description: 'Introduce yourself to the community' },
      { name: 'general-chat', emoji: '💭', description: 'General discussion about music and life' },
      { name: 'share-links', emoji: '🔗', description: 'Share useful resources and links' },
      { name: 'what-are-you-listening', emoji: '🎧', description: 'Share what you\'re currently listening to' }
    ]
  },
  {
    name: 'Creative Space',
    emoji: '🎙',
    channels: [
      { name: 'share-your-lyrics', emoji: '✍️', description: 'Share and get feedback on your lyrics' },
      { name: 'beat-battles', emoji: '🔥', description: 'Compete in beat-making challenges' },
      { name: 'muse-lab-feedback', emoji: '🎛', description: 'Get feedback on your MuseLab creations' },
      { name: 'ai-hooks-lab', emoji: '🤖', description: 'Generate and share AI-created hooks' },
      { name: 'finished-tracks', emoji: '📼', description: 'Share your completed tracks' }
    ]
  },
  {
    name: 'Mentorship Zone',
    emoji: '🧠',
    channels: [
      { name: 'ask-a-mentor', emoji: '🧑🏾‍🏫', description: 'Get advice from AI and verified mentors' },
      { name: 'mentor-announcements', emoji: '📢', description: 'Updates and tips from mentors' },
      { name: 'prompt-guides', emoji: '📚', description: 'Guides on using AI prompts effectively' },
      { name: 'track-progress', emoji: '🎯', description: 'Track and share your creative journey progress' }
    ]
  },
  {
    name: 'Collab & Genre Hubs',
    emoji: '🌐',
    channels: [
      { name: 'hiphop-cyphers', emoji: '🎤', description: 'Hip-hop collaboration and cyphers' },
      { name: 'rnb-vibes', emoji: '🎵', description: 'R&B discussion and collaboration' },
      { name: 'lofi-lounge', emoji: '🌀', description: 'Lo-fi beats and chill vibes' },
      { name: 'world-music', emoji: '🌍', description: 'Explore and share world music' }
    ]
  },
  {
    name: 'Staff Only',
    emoji: '🔒',
    channels: [
      { name: 'mod-chat', emoji: '👮', description: 'Private channel for moderators' },
      { name: 'feature-requests', emoji: '🛠', description: 'Discuss new features and improvements' },
      { name: 'beta-testers', emoji: '🧪', description: 'Testing channel for new features' },
      { name: 'feedback-reports', emoji: '📊', description: 'Reports and analytics' }
    ]
  }
];

const ChannelStructure: React.FC = () => {
  return (
    <Card className="bg-[#1E1E1E] border-purple-900/30 p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Channel Structure</h3>
      
      <div className="space-y-4">
        {channelStructure.map((category, index) => (
          <div key={index} className="border-t border-[#2D2D2D] pt-4 first:border-0 first:pt-0">
            <h4 className="text-purple-400 font-medium mb-2">
              {category.emoji} {category.name}
            </h4>
            
            <ul className="space-y-2">
              {category.channels.map((channel, channelIndex) => (
                <li key={channelIndex} className="text-gray-300 text-sm flex items-start">
                  <span className="mr-2">{channel.emoji}</span>
                  <div>
                    <span className="text-white">︱{channel.name}</span>
                    <p className="text-xs text-gray-400">{channel.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ChannelStructure;