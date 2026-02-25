import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'trending' | 'surge' | 'new';
  title: string;
  message: string;
  timestamp: Date;
}

interface RealTimeNotificationsProps {
  isConnected: boolean;
}

export default function RealTimeNotifications({ isConnected }: RealTimeNotificationsProps) {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoHideTimer, setAutoHideTimer] = useState(5000); // 5 seconds default
  const { toast } = useToast();

  useEffect(() => {
    if (!isConnected || !notificationsEnabled) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'trendsUpdate') {
          // Check for significant changes in trends
          data.data?.forEach((trend: any) => {
            const growthNum = parseFloat(trend.growth.replace(/[+\-%]/g, ''));
            
            // Notify about trending spikes
            if (growthNum > 200) {
              const notification: Notification = {
                id: `spike-${trend.id}-${Date.now()}`,
                type: 'surge',
                title: '🚀 Trending Spike!',
                message: `${trend.title} is surging with ${trend.growth} growth!`,
                timestamp: new Date()
              };
              
              showNotification(notification);
            }
          });
        }
        
        if (data.type === 'newTrend') {
          const notification: Notification = {
            id: `new-${data.trend.id}-${Date.now()}`,
            type: 'new',
            title: '✨ New Trend Alert',
            message: `"${data.trend.title}" just started trending!`,
            timestamp: new Date()
          };
          
          showNotification(notification);
        }
      } catch (error) {
        console.error('Failed to process notification:', error);
      }
    };

    // Listen for WebSocket messages
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = handleMessage;
    
    return () => {
      ws.close();
    };
  }, [isConnected, notificationsEnabled, autoHideTimer]);

  const showNotification = (notification: Notification) => {
    setCurrentNotification(notification);
    
    // Auto-hide after configured time (only if timer is set)
    if (autoHideTimer > 0) {
      setTimeout(() => {
        setCurrentNotification(null);
      }, autoHideTimer);
    }
  };

  const dismissNotification = () => {
    setCurrentNotification(null);
  };

  return (
    <>
      {/* Notification Controls */}
      <div className="fixed top-20 right-4 z-40 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-sm p-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`
              flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-colors
              ${notificationsEnabled 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
            `}
          >
            <i className={`fas ${notificationsEnabled ? 'fa-bell' : 'fa-bell-slash'}`}></i>
            <span>{notificationsEnabled ? 'On' : 'Off'}</span>
          </button>
          
          {notificationsEnabled && (
            <select
              value={autoHideTimer}
              onChange={(e) => setAutoHideTimer(parseInt(e.target.value))}
              className="px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
            >
              <option value={3000}>3s</option>
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
              <option value={0}>Manual</option>
            </select>
          )}
        </div>
      </div>

      {/* Single Notification Display */}
      {currentNotification && notificationsEnabled && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`
                  w-2 h-2 rounded-full mt-2 flex-shrink-0
                  ${currentNotification.type === 'surge' ? 'bg-red-500' : 
                    currentNotification.type === 'new' ? 'bg-blue-500' : 'bg-green-500'}
                `}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentNotification.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {currentNotification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {currentNotification.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              {autoHideTimer === 0 && (
                <button
                  onClick={dismissNotification}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}