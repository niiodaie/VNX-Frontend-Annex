import { useAIInsights } from '@/hooks/useTrends';

export default function AIInsights() {
  const { data: insights, isLoading, error } = useAIInsights();

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !insights) {
    return (
      <section className="mb-12">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
            <p className="text-gray-600 dark:text-gray-300">AI insights are currently unavailable</p>
          </div>
        </div>
      </section>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'will_grow': return 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200';
      case 'will_stabilize': return 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200';
      case 'will_fade': return 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200';
      default: return 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'will_grow': return 'Will grow';
      case 'will_stabilize': return 'Will stabilize';
      case 'will_fade': return 'Will fade';
      default: return status;
    }
  };

  return (
    <section className="mb-12">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
            <i className="fas fa-brain text-white text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">🧠 AI Insights</h3>
            <p className="text-gray-600 dark:text-gray-300">Powered by OpenAI GPT-4</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trending Predictions */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <i className="fas fa-crystal-ball text-purple-500 mr-2"></i>
              Trending Predictions
            </h4>
            <div className="space-y-3">
              {insights.predictions.length > 0 ? (
                insights.predictions.map((prediction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {prediction.title}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(prediction.status)}`}>
                      {getStatusText(prediction.status)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No predictions available</p>
              )}
            </div>
          </div>

          {/* Content Opportunities */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <i className="fas fa-lightbulb text-amber-500 mr-2"></i>
              Content Opportunities
            </h4>
            <div className="space-y-3">
              {insights.opportunities.length > 0 ? (
                insights.opportunities.map((opportunity, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {opportunity.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {opportunity.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No opportunities available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
