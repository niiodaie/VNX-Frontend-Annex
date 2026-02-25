export default function TrendingSection() {
  const trendingItems = [
    {
      id: 1,
      title: "VNX-NetScan",
      description: "Run IP, WHOIS, Port scans and Traceroutes.",
      icon: "🔍",
      tag: "New",
      tagColor: "yellow",
      link: "Try Now →",
    },
    {
      id: 2,
      title: "VNX-Surprise",
      description: "Get surprise ideas with tags and affiliate links.",
      icon: "🎲",
      tag: "Hot",
      tagColor: "red",
      link: "Try Now →",
    },
    {
      id: 3,
      title: "VNX-Explorer",
      description: "Discover global wonders, events and food culture.",
      icon: "🌍",
      tag: "Popular",
      tagColor: "blue",
      link: "Explore →",
    },
  ];

  const getGradientClasses = (color: string) => {
    switch (color) {
      case "red":
        return "bg-gradient-to-br from-red-50 to-orange-50 border-red-100";
      case "yellow":
        return "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-100";
      case "blue":
        return "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100";
      default:
        return "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-100";
    }
  };

  const getTagClasses = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-300 text-red-800";
      case "yellow":
        return "bg-yellow-300 text-yellow-800";
      case "blue":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getLinkClasses = (color: string) => {
    switch (color) {
      case "red":
        return "text-red-600 hover:text-red-700";
      case "yellow":
        return "text-yellow-600 hover:text-yellow-700";
      case "blue":
        return "text-blue-600 hover:text-blue-700";
      default:
        return "text-gray-600 hover:text-gray-700";
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            🔥 Trending Now
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover the hottest tools, platforms, and discussions shaping the digital landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {trendingItems.map((item) => (
            <div
              key={item.id}
              className={`${getGradientClasses(
                item.tagColor
              )} rounded-2xl p-6 border hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 ${getTagClasses(
                    item.tagColor
                  )} rounded-full text-sm font-medium`}
                >
                  {item.tag}
                </span>
                <span className="text-2xl">{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-600 mb-4">{item.description}</p>
              <button
                className={`${getLinkClasses(item.tagColor)} font-semibold transition-colors hover:underline`}
              >
                Try Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
