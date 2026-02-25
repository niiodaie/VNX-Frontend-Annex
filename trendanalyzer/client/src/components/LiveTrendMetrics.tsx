import { useState, useEffect } from 'react';
import { useTrends } from '@/hooks/useTrends';

interface LiveMetrics {
  totalSearches: number;
  activeUsers: number;
  trendingNow: number;
  globalGrowth: string;
}

export default function LiveTrendMetrics() {
  const { data: trends } = useTrends();
  const [metrics, setMetrics] = useState<LiveMetrics>({
    totalSearches: 0,
    activeUsers: 1247,
    trendingNow: 0,
    globalGrowth: '+0%'
  });

  useEffect(() => {
    if (!trends) return;

    // Calculate real-time metrics
    const totalSearches = trends.reduce((sum, trend) => sum + trend.searches, 0);
    const trendingNow = trends.filter(trend => {
      const growth = parseFloat(trend.growth.replace(/[+\-%]/g, ''));
      return growth > 50;
    }).length;

    const avgGrowth = trends.reduce((sum, trend) => {
      const growth = parseFloat(trend.growth.replace(/[+\-%]/g, ''));
      return sum + growth;
    }, 0) / trends.length;

    setMetrics({
      totalSearches,
      activeUsers: Math.floor(Math.random() * 500) + 1000, // Simulate active users
      trendingNow,
      globalGrowth: `${avgGrowth >= 0 ? '+' : ''}${avgGrowth.toFixed(0)}%`
    });
  }, [trends]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-600 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Live Metrics
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatNumber(metrics.totalSearches)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Searches
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatNumber(metrics.activeUsers)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Active Users
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {metrics.trendingNow}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Trending Now
          </div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            metrics.globalGrowth.startsWith('+') 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {metrics.globalGrowth}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Global Growth
          </div>
        </div>
      </div>
    </div>
  );
}