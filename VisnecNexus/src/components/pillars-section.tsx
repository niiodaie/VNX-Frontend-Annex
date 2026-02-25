import { Link } from "react-router-dom";

export default function PillarsSection() {
  const pillars = [
    {
      id: "tools",
      path: "/tools",
      icon: "🛠️",
      title: "Tools",
      description: "Handy utilities that solve real-world problems",
      gradient: "from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/30"
    },
    {
      id: "platforms",
      path: "/platforms",
      icon: "🧩",
      title: "Platforms",
      description: "Interactive launchpads and service layers",
      gradient: "from-green-500 to-emerald-500",
      shadow: "shadow-green-500/30"
    },
    {
      id: "directories",
      path: "/directories",
      icon: "📚",
      title: "Directories",
      description: "Discover niche resources by category",
      gradient: "from-purple-500 to-violet-500",
      shadow: "shadow-purple-500/30"
    },
    {
      id: "resources",
      path: "/resources",
      icon: "🗂️",
      title: "Resources",
      description: "Templates, guides, and downloadable kits",
      gradient: "from-orange-500 to-red-500",
      shadow: "shadow-orange-500/30"
    },
    {
      id: "community",
      path: "/community",
      icon: "🧑‍🤝‍🧑",
      title: "Community",
      description: "Peer collaboration and feedback forums",
      gradient: "from-pink-500 to-rose-500",
      shadow: "shadow-pink-500/30"
    },
    {
      id: "marketplace",
      path: "/marketplace",
      icon: "🛒",
      title: "Marketplace",
      description: "Digital products, services, and SaaS tools",
      gradient: "from-indigo-500 to-blue-500",
      shadow: "shadow-indigo-500/30"
    },
    {
      id: "insights",
      path: "/insights",
      icon: "📈",
      title: "Insights",
      description: "Trends, forecasts, and business analytics",
      gradient: "from-teal-500 to-cyan-500",
      shadow: "shadow-teal-500/30"
    },
    {
      id: "experiences",
      path: "/experiences",
      icon: "✨",
      title: "Experiences",
      description: "Immersive digital journeys and exploration",
      gradient: "from-yellow-500 to-amber-500",
      shadow: "shadow-yellow-500/30"
    },
    {
      id: "trends",
      path: "/trends",
      icon: "📊",
      title: "Trends",
      description: "Real-time market intelligence and emerging patterns",
      gradient: "from-violet-500 to-purple-500",
      shadow: "shadow-violet-500/30"
    },
    {
      id: "ventures",
      path: "/ventures",
      icon: "🚀",
      title: "Ventures",
      description: "Million-dollar startup opportunities and investments",
      gradient: "from-rose-500 to-pink-500",
      shadow: "shadow-rose-500/30"
    },
  ];

  return (
    <section id="pillars" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            🧱 Explore Our Pillars
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Ten comprehensive categories designed to accelerate your digital journey and unlock new
            possibilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/50 group ${pillar.shadow} hover:shadow-xl`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{pillar.title}</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">{pillar.description}</p>
              <Link
                to={pillar.path}
                className={`block w-full px-4 py-2 bg-gradient-to-r ${pillar.gradient} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-center transform hover:-translate-y-0.5`}
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
