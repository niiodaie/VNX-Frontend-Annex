import { Link } from "react-router-dom";

export default function Marketplace() {
  const marketplaceItems = [
    {
      title: "AI Analytics Suite",
      vendor: "TechCorp AI",
      price: "$299/month",
      rating: 4.8,
      reviews: 234,
      description: "Complete AI-powered analytics platform with real-time insights",
      category: "Analytics",
      color: "bg-blue-500"
    },
    {
      title: "Cloud Security Platform",
      vendor: "SecureFlow",
      price: "$199/month",
      rating: 4.9,
      reviews: 156,
      description: "Enterprise-grade security monitoring and threat detection",
      category: "Security",
      color: "bg-red-500"
    },
    {
      title: "API Management Hub",
      vendor: "DevTools Pro",
      price: "$149/month",
      rating: 4.7,
      reviews: 189,
      description: "Complete API lifecycle management and documentation platform",
      category: "Development",
      color: "bg-green-500"
    },
    {
      title: "Design System Pro",
      vendor: "DesignFlow",
      price: "$99/month",
      rating: 4.6,
      reviews: 298,
      description: "Comprehensive design system with components and guidelines",
      category: "Design",
      color: "bg-purple-500"
    }
  ];

  const categories = ["All", "Analytics", "Security", "Development", "Design", "Marketing", "Productivity"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
              <p className="text-gray-600 mt-2">Digital products, services, and SaaS tools</p>
            </div>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                index === 0
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Marketplace Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {marketplaceItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{item.title[0]}</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">{item.price}</div>
                  <div className="text-xs text-gray-500">{item.category}</div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">by {item.vendor}</p>
              <p className="text-gray-600 mb-4">{item.description}</p>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">{item.rating} ({item.reviews} reviews)</span>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Try Free
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}