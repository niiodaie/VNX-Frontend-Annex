import { Link } from "react-router-dom";

export default function Tools() {
  const toolCategories = [
    {
      title: "AI & Machine Learning",
      description: "Advanced AI tools for automation and intelligence",
      tools: ["VNX-NetScan", "AI Content Generator", "Smart Analytics"],
      color: "bg-blue-500"
    },
    {
      title: "Development & DevOps",
      description: "Tools for developers and system administrators",
      tools: ["Code Optimizer", "Deploy Manager", "API Testing Suite"],
      color: "bg-green-500"
    },
    {
      title: "Design & Creative",
      description: "Creative tools for designers and content creators",
      tools: ["Design Studio", "Asset Generator", "Brand Builder"],
      color: "bg-purple-500"
    },
    {
      title: "Business & Analytics",
      description: "Enterprise tools for business intelligence",
      tools: ["Business Intelligence", "Report Generator", "Data Visualizer"],
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Tools</h1>
              <p className="text-gray-600 mt-2">Handy utilities that solve real-world problems</p>
            </div>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {toolCategories.map((category, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4 shadow-lg`}>
                <span className="text-white font-bold text-lg">{category.title[0]}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <div className="space-y-2">
                {category.tools.map((tool, toolIndex) => (
                  <div key={toolIndex} className="flex items-center text-sm text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {tool}
                  </div>
                ))}
              </div>
              <button className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors font-medium">
                Explore Tools
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}