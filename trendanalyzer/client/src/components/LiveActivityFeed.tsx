import { useState, useEffect } from 'react';
import { formatTimeAgo } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: 'search_spike' | 'new_trend' | 'region_change' | 'category_surge';
  message: string;
  timestamp: Date;
  icon: string;
  color: string;
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Simulate real-time activity feed
    const generateActivity = () => {
      const activities = [
        {
          type: 'search_spike' as const,
          messages: [
            'AI coding assistant searches spiked by 45%',
            'Climate summit 2024 gaining momentum in EU',
            'New Marvel trailer breaking search records'
          ],
          icon: '📈',
          color: 'text-green-600'
        },
        {
          type: 'new_trend' as const,
          messages: [
            'Emerging trend detected: Sustainable tech',
            'Breaking: Virtual reality fitness trending',
            'New category surge: Remote work tools'
          ],
          icon: '✨',
          color: 'text-blue-600'
        },
        {
          type: 'region_change' as const,
          messages: [
            'Europe shows increased interest in renewable energy',
            'Asia-Pacific leading in mobile gaming trends',
            'North America driving fintech innovations'
          ],
          icon: '🌍',
          color: 'text-purple-600'
        }
      ];

      const randomCategory = activities[Math.floor(Math.random() * activities.length)];
      const randomMessage = randomCategory.messages[Math.floor(Math.random() * randomCategory.messages.length)];

      const newActivity: ActivityItem = {
        id: `${Date.now()}-${Math.random()}`,
        type: randomCategory.type,
        message: randomMessage,
        timestamp: new Date(),
        icon: randomCategory.icon,
        color: randomCategory.color
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    };

    // Generate initial activities
    generateActivity();
    generateActivity();
    generateActivity();

    // Continue generating activities every 15-45 seconds
    const interval = setInterval(() => {
      generateActivity();
    }, Math.random() * 30000 + 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-600 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Live Activity Feed
        </h3>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 animate-in slide-in-from-right-5"
          >
            <span className="text-lg">{activity.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">
                {activity.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <div className="animate-pulse">Monitoring live activity...</div>
          </div>
        )}
      </div>
    </div>
  );
}