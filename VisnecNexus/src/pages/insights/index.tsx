import { Link } from "react-router-dom";

export default function Insights() {
  const insights = [
    {
      title: "AI Market Trends 2024",
      type: "Market Analysis",
      date: "Dec 8, 2024",
      readTime: "8 min read",
      summary: "Comprehensive analysis of AI adoption trends and market forecasts for the next quarter",
      growth: "+127%",
      color: "bg-blue-500"
    },
    {
      title: "Cloud Infrastructure ROI",
      type: "Financial Report",
      date: "Dec 6, 2024", 
      readTime: "12 min read",
      summary: "Cost-benefit analysis of cloud migration strategies across enterprise segments",
      growth: "+89%",
      color: "bg-green-500"
    },
    {
      title: "Developer Productivity Metrics",
      type: "Performance Study",
      date: "Dec 4, 2024",
      readTime: "6 min read", 
      summary: "Data-driven insights into development team efficiency and tool adoption rates",
      growth: "+56%",
      color: "bg-purple-500"
    },
    {
      title: "Cybersecurity Investment Trends",
      type: "Security Analysis",
      date: "Dec 2, 2024",
      readTime: "10 min read",
      summary: "Enterprise security spending patterns and threat landscape evolution analysis",
      growth: "+234%",
      color: "bg-red-500"
    }
  ];

  const keyMetrics = [
    { label: "Platform Growth", value: "156%", trend: "up" },
    { label: "User Engagement", value: "89%", trend: "up" },
    { label: "Revenue Growth", value: "234%", trend: "up" },
    { label: "Market Share", value: "12.4%", trend: "up" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Insights</h1>
              <p className="text-gray-600 mt-2">Trends, forecasts, and business analytics</p>
            </div>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {keyMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-green-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-1">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {insights.map((insight, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${insight.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{insight.title[0]}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{insight.date}</div>
                  <div className="text-xs text-gray-400">{insight.readTime}</div>
                </div>
              </div>
              
              <div className="mb-2">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                  {insight.type}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{insight.title}</h3>
              <p className="text-gray-600 mb-4">{insight.summary}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Growth:</span>
                  <span className="text-green-600 font-semibold">{insight.growth}</span>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Read Full Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}