import { useState, useEffect } from 'react';

interface UpdateFrequencyIndicatorProps {
  isConnected: boolean;
}

export default function UpdateFrequencyIndicator({ isConnected }: UpdateFrequencyIndicatorProps) {
  const [nextTrendUpdate, setNextTrendUpdate] = useState<number>(180);
  const [nextMetricsUpdate, setNextMetricsUpdate] = useState<number>(60);
  const [nextActivityUpdate, setNextActivityUpdate] = useState<number>(45);

  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setNextTrendUpdate(prev => prev > 0 ? prev - 1 : 180);
      setNextMetricsUpdate(prev => prev > 0 ? prev - 1 : 60);
      setNextActivityUpdate(prev => prev > 0 ? prev - 1 : 45);
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (!isConnected) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg p-3 text-xs">
      <div className="text-gray-600 dark:text-gray-400 mb-2 font-medium">Next Updates</div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Trends:</span>
          <span className="font-mono text-blue-600 dark:text-blue-400">{formatTime(nextTrendUpdate)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Metrics:</span>
          <span className="font-mono text-green-600 dark:text-green-400">{formatTime(nextMetricsUpdate)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Activity:</span>
          <span className="font-mono text-purple-600 dark:text-purple-400">{formatTime(nextActivityUpdate)}</span>
        </div>
      </div>
    </div>
  );
}