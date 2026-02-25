import { Link } from "react-router-dom";

export default function Community() {
  const communityStats = [
    { label: "Active Members", value: "45,000+" },
    { label: "Monthly Posts", value: "12,500+" },
    { label: "Expert Contributors", value: "1,200+" },
    { label: "Success Stories", value: "890+" }
  ];

  const forumCategories = [
    {
      title: "General Discussion",
      posts: 1234,
      members: 8900,
      description: "Open discussions about technology trends and innovations",
      color: "bg-blue-500"
    },
    {
      title: "Technical Support",
      posts: 987,
      members: 4500,
      description: "Get help with implementation and troubleshooting",
      color: "bg-green-500"
    },
    {
      title: "Project Showcase",
      posts: 654,
      members: 3200,
      description: "Share your projects and get feedback from the community",
      color: "bg-purple-500"
    },
    {
      title: "Career & Networking",
      posts: 432,
      members: 2800,
      description: "Professional networking and career development discussions",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community</h1>
              <p className="text-gray-600 mt-2">Peer collaboration and feedback forums</p>
            </div>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {communityStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Forum Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {forumCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{category.title[0]}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{category.posts} posts</div>
                  <div className="text-sm text-gray-500">{category.members} members</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Join Discussion
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}