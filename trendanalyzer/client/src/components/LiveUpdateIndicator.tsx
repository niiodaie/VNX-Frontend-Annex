interface LiveUpdateIndicatorProps {
  isConnected: boolean;
  lastUpdate: Date | null;
}

export default function LiveUpdateIndicator({ isConnected, lastUpdate }: LiveUpdateIndicatorProps) {
  return (
    <div className="fixed top-4 left-4 z-50">
      <div className={`
        px-3 py-2 rounded-lg shadow-lg border transition-all duration-300
        ${isConnected 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' 
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
        }
      `}>
        <div className="flex items-center space-x-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="font-medium">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
        {lastUpdate && isConnected && (
          <div className="text-xs mt-1 opacity-75">
            Updated {new Date().getTime() - lastUpdate.getTime() < 5000 ? 'just now' : 'recently'}
          </div>
        )}
      </div>
    </div>
  );
}