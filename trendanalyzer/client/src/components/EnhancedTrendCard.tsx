import { useState } from 'react';
import { formatNumber, getCategoryEmoji, getCategoryColor } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Trend } from '@/hooks/useTrends';

interface EnhancedTrendCardProps {
  trend: Trend;
  onInsightsClick?: (trend: Trend) => void;
}

export default function EnhancedTrendCard({ trend, onInsightsClick }: EnhancedTrendCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentSummary, setCurrentSummary] = useState(trend.aiSummary);
  const { toast } = useToast();

  const refreshSummary = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/trends/${trend.id}/refresh-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setCurrentSummary(data.trend.aiSummary);
        toast({
          title: "Summary Refreshed",
          description: "AI analysis has been updated with the latest insights.",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Could not update the AI summary. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const growthNum = parseFloat(trend.growth.replace(/[+\-%]/g, ''));
  const isPositiveGrowth = growthNum >= 0;
  
  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-600 p-6 hover:shadow-lg transition-all duration-300">
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
        
        <button
          onClick={refreshSummary}
          disabled={isRefreshing}
          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
          title="Refresh AI Summary"
        >
          <i className={`fas fa-sync-alt ${isRefreshing ? 'animate-spin' : ''}`}></i>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
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
        {currentSummary}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Enhanced with AI • {new Date(trend.createdAt).toLocaleTimeString()}
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