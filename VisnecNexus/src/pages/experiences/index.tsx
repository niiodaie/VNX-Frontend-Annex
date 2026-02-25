import { Link } from "react-router-dom";

export default function Experiences() {
  const experiences = [
    {
      title: "Virtual Reality Development Lab",
      type: "Immersive Experience",
      duration: "45 minutes",
      difficulty: "Advanced",
      description: "Hands-on VR development using Unity and WebXR technologies",
      participants: 1250,
      rating: 4.9,
      color: "bg-blue-500"
    },
    {
      title: "AI Model Training Workshop",
      type: "Interactive Learning",
      duration: "60 minutes",
      difficulty: "Intermediate",
      description: "Build and train neural networks with real-world datasets",
      participants: 2340,
      rating: 4.8,
      color: "bg-green-500"
    },
    {
      title: "Blockchain Architecture Simulation",
      type: "Technical Deep-dive",
      duration: "90 minutes", 
      difficulty: "Expert",
      description: "Design and deploy smart contracts on live test networks",
      participants: 890,
      rating: 4.9,
      color: "bg-purple-500"
    },
    {
      title: "Cloud Infrastructure Playground",
      type: "Hands-on Lab",
      duration: "30 minutes",
      difficulty: "Beginner",
      description: "Deploy scalable applications using modern cloud platforms",
      participants: 3450,
      rating: 4.7,
      color: "bg-orange-500"
    }
  ];

  const experienceStats = [
    { label: "Total Participants", value: "25,000+" },
    { label: "Average Rating", value: "4.8/5" },
    { label: "Completion Rate", value: "94%" },
    { label: "Expert Instructors", value: "150+" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Experiences</h1>
              <p className="text-gray-600 mt-2">Immersive digital journeys and hands-on learning</p>
            </div>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Experience Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {experienceStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((experience, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${experience.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{experience.title[0]}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{experience.duration}</div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    experience.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    experience.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    experience.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {experience.difficulty}
                  </div>
                </div>
              </div>
              
              <div className="mb-2">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                  {experience.type}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{experience.title}</h3>
              <p className="text-gray-600 mb-4">{experience.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{experience.rating}</span>
                </div>
                <span className="text-sm text-gray-500">{experience.participants} participants</span>
              </div>
              
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Start Experience
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}