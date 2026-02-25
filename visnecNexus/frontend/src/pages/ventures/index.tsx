// Removed react-router-dom dependency

export default function Ventures() {
  const ventures = [
    {
      title: "Quantum Computing Labs",
      stage: "Series B",
      funding: "$45M",
      valuation: "$200M",
      description: "Next-generation quantum processors for enterprise applications",
      industry: "Hardware",
      growth: "+890%",
      color: "bg-gradient-to-br from-indigo-500 to-purple-600"
    },
    {
      title: "Neural AI Platform",
      stage: "Series A",
      funding: "$28M", 
      valuation: "$120M",
      description: "Autonomous AI agents for business process automation",
      industry: "AI/ML",
      growth: "+567%",
      color: "bg-gradient-to-br from-blue-500 to-cyan-600"
    },
    {
      title: "BioTech Genomics",
      stage: "Seed",
      funding: "$12M",
      valuation: "$60M",
      description: "Personalized medicine through advanced genomic analysis",
      industry: "Healthcare",
      growth: "+445%",
      color: "bg-gradient-to-br from-green-500 to-emerald-600"
    },
    {
      title: "Space Commerce Hub",
      stage: "Series A",
      funding: "$35M",
      valuation: "$180M",
      description: "Commercial space logistics and satellite manufacturing",
      industry: "Aerospace",
      growth: "+723%",
      color: "bg-gradient-to-br from-orange-500 to-red-600"
    },
    {
      title: "Climate Tech Solutions",
      stage: "Series B",
      funding: "$52M",
      valuation: "$250M",
      description: "Carbon capture technology and renewable energy storage",
      industry: "CleanTech",
      growth: "+634%",
      color: "bg-gradient-to-br from-teal-500 to-green-600"
    },
    {
      title: "Metaverse Infrastructure",
      stage: "Series A",
      funding: "$38M",
      valuation: "$150M",
      description: "Decentralized virtual world hosting and development tools",
      industry: "Web3",
      growth: "+512%",
      color: "bg-gradient-to-br from-purple-500 to-pink-600"
    }
  ];

  const portfolioStats = [
    { label: "Active Ventures", value: "145", growth: "+23%" },
    { label: "Total Investment", value: "$2.8B", growth: "+45%" },
    { label: "Success Rate", value: "87%", growth: "+12%" },
    { label: "Unicorns Created", value: "28", growth: "+8%" }
  ];

  const investmentStages = [
    { stage: "Pre-Seed", count: 45, percentage: 31 },
    { stage: "Seed", count: 38, percentage: 26 },
    { stage: "Series A", count: 32, percentage: 22 },
    { stage: "Series B+", count: 30, percentage: 21 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Ventures
              </h1>
              <p className="text-gray-600 mt-2">Million-dollar startup opportunities and investment portfolio</p>
            </div>
            <a href="/" className="text-purple-600 hover:text-purple-800 font-medium">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {portfolioStats.map((stat, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
              <div className="text-green-600 font-semibold text-xs">{stat.growth}</div>
            </div>
          ))}
        </div>

        {/* Investment Stage Distribution */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Investment Stage Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {investmentStages.map((stage, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{stage.count}</div>
                <div className="text-sm text-gray-600 mb-2">{stage.stage}</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{stage.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Venture Portfolio */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Featured Ventures</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ventures.map((venture, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${venture.color} rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {venture.title[0]}
                  </div>
                  <div className="text-right">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                      {venture.stage}
                    </span>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{venture.title}</h4>
                <p className="text-gray-600 mb-4 text-sm">{venture.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Funding:</span>
                    <span className="font-semibold text-gray-900">{venture.funding}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Valuation:</span>
                    <span className="font-semibold text-gray-900">{venture.valuation}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Industry:</span>
                    <span className="font-semibold text-gray-900">{venture.industry}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Growth:</span>
                    <span className="font-semibold text-green-600">{venture.growth}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors text-sm font-medium">
                    View Details
                  </button>
                  <button className="bg-white/80 text-purple-600 px-4 py-2 rounded-lg hover:bg-white transition-colors text-sm font-medium border border-purple-200">
                    Invest
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}