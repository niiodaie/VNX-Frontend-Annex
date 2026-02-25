import { formatNumber, getCategoryEmoji, getCategoryColor, copyToClipboard, shareContent } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Trend } from '@/hooks/useTrends';

interface TrendCardProps {
  trend: Trend;
  onInsightsClick?: (trend: Trend) => void;
}

export default function TrendCard({ trend, onInsightsClick }: TrendCardProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      const textToCopy = `${trend.title}\n\n${trend.aiSummary}`;
      await copyToClipboard(textToCopy);
      toast({
        title: "Copied!",
        description: "Trend copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy trend",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    shareContent(
      trend.title,
      trend.aiSummary,
      `${window.location.origin}?trend=${trend.id}`
    );
  };

  const isGrowthPositive = trend.growth.startsWith('+');
  const growthIcon = isGrowthPositive ? 'fa-arrow-up text-green-500' : 'fa-arrow-down text-red-500';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-slate-700 fade-in">
      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(trend.category)}`}>
            {getCategoryEmoji(trend.category)} {trend.category.charAt(0).toUpperCase() + trend.category.slice(1)}
          </span>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <i className={`fas ${growthIcon} mr-1`}></i>
            <span>{trend.growth}</span>
          </div>
        </div>

        {/* Trend Title */}
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          {trend.title}
        </h3>

        {/* AI Summary */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {trend.aiSummary}
        </p>

        {/* Metrics */}
        <div className="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>
              <i className="fas fa-search mr-1"></i>
              {formatNumber(trend.searches)} searches
            </span>
            <span>
              <i className="fas fa-globe mr-1"></i>
              {trend.countries} countries
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleCopy}
            className="flex-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium"
          >
            <i className="fas fa-copy mr-2"></i>Copy
          </button>
          <button 
            onClick={handleShare}
            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
          >
            <i className="fas fa-share mr-2"></i>Share
          </button>
          {onInsightsClick && (
            <button 
              onClick={() => onInsightsClick(trend)}
              className="px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-sm"
            >
              <i className="fas fa-brain"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
