import { useState, useEffect } from 'react';
import { formatNumber, getCategoryEmoji, getCategoryColor } from '@/lib/utils';
import type { Trend } from '@/hooks/useTrends';

interface RealTimeTrendCardProps {
  trend: Trend;
  onInsightsClick?: (trend: Trend) => void;
}

export default function RealTimeTrendCard({ trend, onInsightsClick }: RealTimeTrendCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [previousSearches, setPreviousSearches] = useState(trend.searches);

  useEffect(() => {
    if (trend.searches !== previousSearches) {
      setIsUpdating(true);
      setPreviousSearches(trend.searches);
      
      const timer = setTimeout(() => {
        setIsUpdating(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [trend.searches, previousSearches]);

  const growthNum = parseFloat(trend.growth.replace(/[+\-%]/g, ''));
  const isPositiveGrowth = growthNum >= 0;
  
  return (
    <div className={`
      relative bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-600 p-6 hover:shadow-lg transition-all duration-300
      ${isUpdating ? 'ring-2 ring-blue-500 ring-opacity-50 scale-105' : ''}
    `}>
      {/* Real-time update indicator */}
      {isUpdating && (
        <div className="absolute -top-1 -right-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
          <div className="absolute top-0 w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCategoryEmoji(trend.category)}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
              {trend.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${getCategoryColor(trend.category)}
              `}>
                {trend.category}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {trend.countries} countries
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className={`
            text-2xl font-bold transition-all duration-500
            ${isUpdating ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}
          `}>
            {formatNumber(trend.searches)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">searches</div>
        </div>
        
        <div>
          <div className={`
            text-2xl font-bold flex items-center space-x-1
            ${isPositiveGrowth ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}
          `}>
            <span>{trend.growth}</span>
            <span className="text-lg">
              {isPositiveGrowth ? '↗️' : '↘️'}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">growth</div>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
        {trend.aiSummary}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Last updated: {new Date(trend.createdAt).toLocaleTimeString()}
        </span>
        
        {onInsightsClick && (
          <button
            onClick={() => onInsightsClick(trend)}
            className="px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            View Insights
          </button>
        )}
      </div>
    </div>
  );
}