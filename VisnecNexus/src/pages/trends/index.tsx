import { Link } from "react-router-dom";

export default function Trends() {
  const trendCategories = [
    {
      title: "Emerging Technologies",
      trend: "+345%",
      timeframe: "Last 6 months",
      description: "AI, blockchain, quantum computing adoption rates",
      insights: ["AI adoption grew 345% in enterprise", "Quantum computing investments doubled", "Web3 integration increased 156%"],
      color: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
      title: "Market Dynamics",
      trend: "+127%",
      timeframe: "This quarter", 
      description: "Industry shifts and consumer behavior patterns",
      insights: ["Remote work tools demand up 127%", "Cloud spending increased 89%", "Cybersecurity investments rose 234%"],
      color: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    {
      title: "Innovation Patterns",
      trend: "+89%",
      timeframe: "Year over year",
      description: "R&D investment flows and breakthrough technologies",
      insights: ["Startup funding in AI increased 89%", "Patent filings up 67%", "Open source adoption grew 156%"],
      color: "bg-gradient-to-br from-green-500 to-emerald-500"
    },
    {
      title: "Digital Transformation",
      trend: "+234%",
      timeframe: "Past year",
      description: "Enterprise modernization and digital adoption",
      insights: ["Digital transformation projects up 234%", "API-first architecture adoption +178%", "Microservices migration +145%"],
      color: "bg-gradient-to-br from-orange-500 to-red-500"
    }
  ];

  const globalMetrics = [
    { label: "Trend Reports", value: "2,500+", growth: "+45%" },
    { label: "Data Sources", value: "150+", growth: "+23%" },
    { label: "Market Coverage", value: "95%", growth: "+12%" },
    { label: "Accuracy Rate", value: "94.7%", growth: "+8%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Trends
              </h1>
              <p className="text-gray-600 mt-2">Real-time market intelligence and emerging patterns</p>
            </div>
            <Link to="/" className="text-purple-600 hover:text-purple-800 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Global Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {globalMetrics.map((metric, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
              <div className="text-green-600 font-semibold text-xs">{metric.growth}</div>
            </div>
          ))}
        </div>

        {/* Trend Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trendCategories.map((category, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {category.title[0]}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{category.trend}</div>
                  <div className="text-xs text-gray-500">{category.timeframe}</div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              
              <div className="space-y-2 mb-4">
                {category.insights.map((insight, insightIndex) => (
                  <div key={insightIndex} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    {insight}
                  </div>
                ))}
              </div>
              
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-medium">
                View Detailed Analysis
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}