import { Link } from "react-router-dom";

export default function Directories() {
  const directories = [
    {
      title: "AI & Machine Learning",
      count: 156,
      description: "Comprehensive directory of AI tools, frameworks, and services",
      categories: ["Neural Networks", "Computer Vision", "NLP", "MLOps"],
      color: "bg-blue-500"
    },
    {
      title: "Web Development",
      count: 243,
      description: "Frontend, backend, and full-stack development resources",
      categories: ["React", "Node.js", "Python", "DevOps"],
      color: "bg-green-500"
    },
    {
      title: "Design & UX",
      count: 189,
      description: "Design tools, UI kits, and user experience resources",
      categories: ["UI Kits", "Prototyping", "Icons", "Fonts"],
      color: "bg-purple-500"
    },
    {
      title: "Business Tools",
      count: 127,
      description: "Productivity, analytics, and business intelligence tools",
      categories: ["CRM", "Analytics", "Project Management", "Finance"],
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Directories</h1>
              <p className="text-gray-600 mt-2">Discover niche resources organized by category</p>
            </div>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {directories.map((directory, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${directory.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{directory.title[0]}</span>
                </div>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {directory.count} resources
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{directory.title}</h3>
              <p className="text-gray-600 mb-4">{directory.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {directory.categories.map((category, catIndex) => (
                  <span key={catIndex} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                    {category}
                  </span>
                ))}
              </div>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Browse Directory
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}