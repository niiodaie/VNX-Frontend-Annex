import { Link } from "react-router-dom";

export default function Platforms() {
  const platforms = [
    {
      title: "Cloud Infrastructure",
      description: "Scalable cloud solutions and deployment platforms",
      features: ["Auto-scaling", "Load balancing", "Global CDN", "99.9% uptime"],
      color: "bg-green-500",
      price: "Starting at $29/month"
    },
    {
      title: "API Gateway",
      description: "Centralized API management and microservices orchestration",
      features: ["Rate limiting", "Authentication", "Analytics", "Documentation"],
      color: "bg-blue-500",
      price: "Starting at $19/month"
    },
    {
      title: "Data Pipeline",
      description: "Real-time data processing and analytics platform",
      features: ["Stream processing", "ETL workflows", "Data warehousing", "ML integration"],
      color: "bg-purple-500",
      price: "Starting at $49/month"
    },
    {
      title: "IoT Platform",
      description: "Connect and manage IoT devices at scale",
      features: ["Device management", "Real-time monitoring", "Edge computing", "Security"],
      color: "bg-orange-500",
      price: "Starting at $39/month"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Platforms</h1>
              <p className="text-gray-600 mt-2">Interactive launchpads and service layers</p>
            </div>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {platforms.map((platform, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center mb-4`}>
                <span className="text-white font-bold text-lg">{platform.title[0]}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{platform.title}</h3>
              <p className="text-gray-600 mb-4">{platform.description}</p>
              <div className="space-y-2 mb-4">
                {platform.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">{platform.price}</p>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}