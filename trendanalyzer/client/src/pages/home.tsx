import { useState, useCallback } from 'react';
import { useTrends } from '@/hooks/useTrends';
import { useWebSocket } from '@/hooks/useWebSocket';
import { formatTimeAgo } from '@/lib/utils';

interface UserLocale {
  lang: string;
  region: string;
  country: string;
  timezone: string;
}
import Header from '@/components/Header';
import RealTimeTrendCard from '@/components/RealTimeTrendCard';
import CategoryFilter from '@/components/CategoryFilter';
import AIInsights from '@/components/AIInsights';
import CountryTrends from '@/components/CountryTrends';
import SubmitTrend from '@/components/SubmitTrend';
import LiveUpdateIndicator from '@/components/LiveUpdateIndicator';
import RealTimeNotifications from '@/components/RealTimeNotifications';
import LiveTrendMetrics from '@/components/LiveTrendMetrics';
import LiveActivityFeed from '@/components/LiveActivityFeed';
import LiveTrendHeatmap from '@/components/LiveTrendHeatmap';
import UpdateFrequencyIndicator from '@/components/UpdateFrequencyIndicator';
import LocaleDetector from '@/components/LocaleDetector';
import type { Trend } from '@/hooks/useTrends';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocale, setUserLocale] = useState<UserLocale | null>(null);
  
  const { data: trends, isLoading, error } = useTrends(
    activeCategory === 'all' ? undefined : activeCategory
  );
  
  const { isConnected, lastUpdate } = useWebSocket();

  const handleLocaleDetected = useCallback((locale: UserLocale) => {
    setUserLocale(locale);
  }, []);

  const handleTrendInsights = (trend: Trend) => {
    // Handle opening insights modal or drawer
    console.log('Show insights for:', trend);
  };

  const filteredTrends = trends?.filter(trend =>
    trend.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trend.aiSummary.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <LiveUpdateIndicator isConnected={isConnected} lastUpdate={lastUpdate} />
      <RealTimeNotifications isConnected={isConnected} />
      <UpdateFrequencyIndicator isConnected={isConnected} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">What's Trending Now</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              AI-powered insights into global search trends with real-time updates
            </p>
            
            {/* Location & Connection Status */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <LocaleDetector onLocaleDetected={handleLocaleDetected} />
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{isConnected ? 'Live updates active' : 'Connecting...'}</span>
              </div>
              {lastUpdate && (
                <div className="flex items-center space-x-2">
                  <i className="fas fa-clock text-green-500"></i>
                  <span>Last update: {formatTimeAgo(lastUpdate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search trends or enter a topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-12 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors">
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <CategoryFilter 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Trending Grid */}
        <section className="mb-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 animate-pulse">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="flex-1 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="flex-1 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Unable to Load Trends</h3>
              <p className="text-gray-600 dark:text-gray-400">
                There was an error loading trend data. Please try again later.
              </p>
            </div>
          ) : filteredTrends.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">No Trends Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery 
                  ? `No trends match "${searchQuery}". Try a different search term.`
                  : `No trends available for the ${activeCategory} category.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrends.map((trend) => (
                <RealTimeTrendCard
                  key={trend.id}
                  trend={trend}
                  onInsightsClick={handleTrendInsights}
                />
              ))}
              
              {/* Load More Placeholder */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center p-8 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                <div className="text-center">
                  <i className="fas fa-plus text-3xl text-gray-400 dark:text-gray-500 mb-3"></i>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Load More Trends</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click to see more trending topics</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Live Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <LiveTrendMetrics />
          </div>
          <div>
            <LiveActivityFeed />
          </div>
        </div>

        {/* Live Trend Heatmap */}
        <div className="mb-8">
          <LiveTrendHeatmap />
        </div>

        {/* AI Insights Section */}
        <AIInsights />

        {/* Trending by Country */}
        <CountryTrends />

        {/* Submit Trend Section */}
        <SubmitTrend />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-line text-white text-sm"></i>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  VNX-SearchTrends
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                AI-powered global search trend tracker providing real-time insights into what the world is searching for.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <i className="fab fa-github text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 VNX-SearchTrends. Powered by OpenAI GPT-4 • Built with ❤️ for the curious mind.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
