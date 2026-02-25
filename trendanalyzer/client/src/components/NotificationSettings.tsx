import { useState } from 'react';

interface NotificationSettingsProps {
  notificationsEnabled: boolean;
  onToggleNotifications: (enabled: boolean) => void;
  autoHideTimer: number;
  onTimerChange: (timer: number) => void;
}

export default function NotificationSettings({
  notificationsEnabled,
  onToggleNotifications,
  autoHideTimer,
  onTimerChange
}: NotificationSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        title="Notification Settings"
      >
        <i className="fas fa-cog"></i>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg p-4 z-50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Real-time Notifications
              </span>
              <button
                onClick={() => onToggleNotifications(!notificationsEnabled)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {notificationsEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auto-hide Timer
                </label>
                <select
                  value={autoHideTimer}
                  onChange={(e) => onTimerChange(parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                >
                  <option value={3000}>3 seconds</option>
                  <option value={5000}>5 seconds</option>
                  <option value={8000}>8 seconds</option>
                  <option value={10000}>10 seconds</option>
                  <option value={0}>Manual dismiss only</option>
                </select>
              </div>
            )}

            <div className="pt-2 border-t border-gray-200 dark:border-slate-600">
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <i className="fas fa-info-circle"></i>
                <span>Only one notification shows at a time</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}