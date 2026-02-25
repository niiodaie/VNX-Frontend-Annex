export default function StatsSection() {
  const stats = [
    {
      value: "2,500+",
      label: "AI Tools",
      color: "text-blue-600",
    },
    {
      value: "50K+",
      label: "Active Users",
      color: "text-purple-600",
    },
    {
      value: "150+",
      label: "Platforms",
      color: "text-emerald-600",
    },
    {
      value: "25+",
      label: "Communities",
      color: "text-amber-600",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
