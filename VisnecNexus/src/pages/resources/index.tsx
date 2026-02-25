import { Link } from "react-router-dom";

export default function Resources() {
  const resourceTypes = [
    {
      title: "Templates & Boilerplates",
      count: 89,
      description: "Ready-to-use templates for rapid development",
      items: ["React Starter Kit", "Node.js API Template", "Design System Kit", "Landing Page Template"],
      color: "bg-blue-500",
      icon: "📄"
    },
    {
      title: "Code Libraries",
      count: 156,
      description: "Reusable code components and utilities",
      items: ["UI Component Library", "Authentication Utils", "Data Validation", "API Helpers"],
      color: "bg-green-500",
      icon: "📚"
    },
    {
      title: "Learning Materials",
      count: 234,
      description: "Guides, tutorials, and documentation",
      items: ["Video Tutorials", "Technical Guides", "Best Practices", "Case Studies"],
      color: "bg-purple-500",
      icon: "📖"
    },
    {
      title: "Assets & Media",
      count: 178,
      description: "Images, icons, fonts, and design resources",
      items: ["Icon Packs", "Stock Photos", "Font Collections", "Illustration Sets"],
      color: "bg-orange-500",
      icon: "🎨"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
              <p className="text-gray-600 mt-2">Templates, guides, and downloadable kits</p>
            </div>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resourceTypes.map((resource, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${resource.color} rounded-lg flex items-center justify-center text-xl`}>
                  {resource.icon}
                </div>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {resource.count} items
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-gray-600 mb-4">{resource.description}</p>
              <div className="space-y-2 mb-4">
                {resource.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Browse Resources
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}