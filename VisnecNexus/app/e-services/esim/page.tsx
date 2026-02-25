import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Globe, Smartphone, Zap, Shield, Check, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Instant eSIMs for Global Travelers | esim.visnec.ai",
  description: "Stay connected anywhere in the world with instant eSIM activation. No physical SIM cards, no roaming fees. Works in 150+ countries.",
  keywords: ["eSIM", "global connectivity", "travel SIM", "roaming", "international data", "digital SIM"],
};

export default function ESIMPage() {
  const providers = [
    {
      name: "Airalo",
      description: "World's first eSIM store with coverage in 200+ countries",
      url: "https://www.airalo.com/?ref=YOUR_REF_ID",
      features: ["200+ Countries", "Instant Activation", "Affordable Plans"],
      badge: "🏆 Most Popular",
      gradient: "from-blue-600 to-cyan-600",
    },
    {
      name: "Nomad",
      description: "Simple eSIM plans for travelers and digital nomads",
      url: "https://www.getnomad.app?ref=YOUR_REF_ID",
      features: ["Easy Setup", "Flexible Plans", "24/7 Support"],
      badge: "⭐ Best Value",
      gradient: "from-purple-600 to-pink-600",
    },
    {
      name: "MobiMatter",
      description: "Premium eSIM service with enterprise-grade reliability",
      url: "https://www.mobimatter.com?ref=YOUR_REF_ID",
      features: ["Premium Network", "Business Plans", "Priority Support"],
      badge: "💼 For Business",
      gradient: "from-green-600 to-teal-600",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Choose Your Plan",
      description: "Select from our trusted eSIM providers based on your destination and data needs",
      icon: Globe,
    },
    {
      number: "2",
      title: "Scan QR Code",
      description: "Receive your eSIM QR code instantly via email and scan it with your phone",
      icon: Smartphone,
    },
    {
      number: "3",
      title: "Get Connected",
      description: "Activate your eSIM and enjoy seamless connectivity wherever you travel",
      icon: Zap,
    },
  ];

  const benefits = [
    "No physical SIM card needed",
    "Instant activation",
    "Works in 150+ countries",
    "No roaming fees",
    "Keep your existing number",
    "Multiple eSIMs on one device",
    "Eco-friendly solution",
    "24/7 customer support",
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/tech-bg.svg')] opacity-10" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm mb-6">
              <Globe className="w-4 h-4" />
              <span>Global Connectivity Made Simple</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Instant eSIMs for<br />Global Travelers
            </h1>
            
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Stay connected anywhere in the world with instant eSIM activation. No physical SIM cards,
              no roaming fees, no hassle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#providers"
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-slate-100 transform hover:scale-105 transition-all shadow-lg"
              >
                Get Your eSIM
              </a>
              <a
                href="#how-it-works"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get connected in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div key={step.number} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white text-2xl font-bold mb-4">
                    {step.number}
                  </div>
                  <IconComponent className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Providers */}
      <section id="providers" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Choose Your eSIM Provider
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We've partnered with the best eSIM providers to bring you reliable global connectivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {providers.map((provider) => (
              <div
                key={provider.name}
                className="group relative bg-slate-50 rounded-2xl p-8 border-2 border-slate-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl"
              >
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-medium px-3 py-1 bg-white rounded-full shadow-sm">
                    {provider.badge}
                  </span>
                </div>

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${provider.gradient} mb-4`} />
                
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{provider.name}</h3>
                <p className="text-slate-600 mb-6">{provider.description}</p>

                <ul className="space-y-2 mb-6">
                  {provider.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-slate-700">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={provider.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-3 px-6 bg-gradient-to-r ${provider.gradient} text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all group-hover:scale-105`}
                >
                  Get Started
                  <ExternalLink className="inline-block w-4 h-4 ml-2" />
                </a>
                
                <p className="text-xs text-slate-500 mt-4 text-center">
                  * Replace YOUR_REF_ID with your actual affiliate ID
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Shield className="w-16 h-16 mx-auto mb-4 text-purple-600" />
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                Why Choose eSIM?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm"
                >
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Stay Connected?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Choose your eSIM provider and get instant connectivity in over 150 countries
          </p>
          <a
            href="#providers"
            className="inline-block px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-slate-100 transform hover:scale-105 transition-all shadow-lg"
          >
            Browse eSIM Plans
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

