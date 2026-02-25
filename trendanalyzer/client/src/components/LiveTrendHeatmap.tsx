import { useState, useEffect } from 'react';
import { useTrends } from '@/hooks/useTrends';

interface HeatmapData {
  category: string;
  regions: {
    region: string;
    intensity: number;
    trends: number;
  }[];
}

export default function LiveTrendHeatmap() {
  const { data: trends } = useTrends();
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);

  useEffect(() => {
    if (!trends) return;

    const categories = ['viral', 'news', 'sports', 'finance', 'culture'];
    const regions = ['global', 'us', 'uk', 'jp', 'de'];
    
    const data = categories.map(category => {
      const categoryTrends = trends.filter(t => t.category === category);
      
      return {
        category,
        regions: regions.map(region => {
          const regionTrends = categoryTrends.filter(t => t.region === region);
          const avgGrowth = regionTrends.length > 0 
            ? regionTrends.reduce((sum, t) => sum + parseFloat(t.growth.replace(/[+\-%]/g, '')), 0) / regionTrends.length
            : 0;
          
          return {
            region,
            intensity: Math.max(0, Math.min(100, avgGrowth)),
            trends: regionTrends.length
          };
        })
      };
    });

    setHeatmapData(data);
  }, [trends]);

  const getIntensityColor = (intensity: number) => {
    if (intensity > 80) return 'bg-red-500';
    if (intensity > 60) return 'bg-orange-500';
    if (intensity > 40) return 'bg-yellow-500';
    if (intensity > 20) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getRegionName = (region: string) => {
    const names = {
      global: 'Global',
      us: 'US',
      uk: 'UK', 
      jp: 'Japan',
      de: 'Germany'
    };
    return names[region as keyof typeof names] || region;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-600 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Live Trend Heatmap
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Low</span>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span>Medium</span>
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>High</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {heatmapData.map((categoryData) => (
          <div key={categoryData.category} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {categoryData.category}
              </h4>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {categoryData.regions.map((regionData) => (
                <div
                  key={regionData.region}
                  className="group relative"
                >
                  <div
                    className={`
                      w-full h-12 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer
                      ${getIntensityColor(regionData.intensity)}
                      opacity-70 hover:opacity-100
                    `}
                    title={`${getRegionName(regionData.region)}: ${regionData.intensity.toFixed(0)}% intensity, ${regionData.trends} trends`}
                  >
                    <div className="flex items-center justify-center h-full">
                      <span className="text-white text-xs font-medium">
                        {getRegionName(regionData.region)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                      {regionData.intensity.toFixed(0)}% • {regionData.trends} trends
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}