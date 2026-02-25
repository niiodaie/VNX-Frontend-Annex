export default function CTASection() {
  const handleStartExploring = () => {
    const pillarsSection = document.getElementById("pillars");
    if (pillarsSection) {
      pillarsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLearnMore = () => {
    console.log("Learn more clicked");
    // Navigation logic would go here
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Transform Your Digital Journey?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of innovators who are already exploring, creating, and succeeding with VNX.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleStartExploring}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-slate-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Start Exploring Now
          </button>
          <button
            onClick={handleLearnMore}
            className="px-8 py-4 bg-blue-700 text-white border border-blue-500 rounded-xl font-semibold text-lg hover:bg-blue-800 transform hover:scale-105 transition-all duration-300"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
