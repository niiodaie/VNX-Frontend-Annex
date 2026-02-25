const howItWorksSteps = [
  {
    number: 1,
    title: "Search for Listings",
    description: "Browse our diverse range of accommodations across Africa"
  },
  {
    number: 2,
    title: "Book Your Stay",
    description: "Select your dates and complete your reservation securely"
  },
  {
    number: 3,
    title: "Enjoy Your Adventure",
    description: "Experience the beauty and culture of Africa firsthand"
  },
  {
    number: 4,
    title: "Share Your Experience",
    description: "Leave a review and help others find their perfect stay"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">How It Works</h2>
          <p className="text-lg text-neutral max-w-2xl mx-auto">
            Your journey to an unforgettable African experience is just a few steps away
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start max-w-5xl mx-auto relative">
          {howItWorksSteps.map((step, index) => (
            <div 
              key={index}
              className={`relative mb-12 md:mb-0 text-center max-w-xs ${
                index < howItWorksSteps.length - 1 ? "md:after:content-[''] md:after:absolute md:after:top-1/2 md:after:right-[-50%] md:after:h-[2px] md:after:w-full md:after:bg-primary md:after:z-[-1]" : ""
              }`}
            >
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-neutral">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
