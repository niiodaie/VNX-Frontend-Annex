import Link from "next/link";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";

interface Feature {
  title: string;
  description: string;
}

interface ToolPageTemplateProps {
  title: string;
  description: string;
  category: string;
  features: Feature[];
  liveUrl?: string;
  comingSoon?: boolean;
  gradient?: string;
}

export default function ToolPageTemplate({
  title,
  description,
  category,
  features,
  liveUrl,
  comingSoon = false,
  gradient = "from-purple-600 to-blue-600",
}: ToolPageTemplateProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className={`pt-32 pb-20 bg-gradient-to-br ${gradient}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>{category}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {title}
            </h1>
            
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              {description}
            </p>

            {comingSoon ? (
              <div className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border border-white/30">
                Coming Soon
              </div>
            ) : liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-slate-100 transform hover:scale-105 transition-all shadow-lg"
              >
                Launch Tool
                <ExternalLink className="w-5 h-5" />
              </a>
            ) : (
              <Link
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-slate-100 transform hover:scale-105 transition-all shadow-lg"
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-800 mb-12 text-center">
              Key Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-slate-200"
                >
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!comingSoon && liveUrl && (
        <section className={`py-20 bg-gradient-to-br ${gradient}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Launch {title} and experience the power of VNX tools
            </p>
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-slate-100 transform hover:scale-105 transition-all shadow-lg"
            >
              Launch Tool
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

