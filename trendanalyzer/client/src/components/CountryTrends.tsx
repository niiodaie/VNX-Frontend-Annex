import { useCountryTrends } from '@/hooks/useTrends';

export default function CountryTrends() {
  const { data: countries, isLoading } = useCountryTrends();

  if (isLoading) {
    return (
      <section className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <i className="fas fa-globe-americas text-blue-500 mr-3"></i>
          🌐 Trending by Country
        </h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Top Regions</h4>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-slate-700">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <i className="fas fa-globe-americas text-blue-500 mr-3"></i>
        🌐 Trending by Country
      </h3>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Country List */}
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Top Regions</h4>
            <div className="space-y-3">
              {countries?.map((country, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{country.flag}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{country.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{country.topTrend}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{country.searches}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">{country.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Trends Chart Placeholder */}
          <div className="p-6 bg-gray-50 dark:bg-slate-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">📅 Hourly Activity</h4>
            <div className="h-64 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600 flex items-center justify-center">
              <div className="text-center">
                <i className="fas fa-chart-line text-4xl text-gray-400 dark:text-gray-500 mb-3"></i>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Hourly Trends Chart</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Real-time search volume data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
