import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/tech-bg.svg')] opacity-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Join the VNX Community</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Digital Experience?
          </h2>

          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Access powerful tools, connect with innovators worldwide, and unlock opportunities
            that drive your success forward.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/e-services"
              className="group px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-slate-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/community"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold text-lg hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
            >
              Join Community
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div>
              <div className="text-3xl font-bold mb-2">100K+</div>
              <div className="text-white/80">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-white/80">Tools & Platforms</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">150+</div>
              <div className="text-white/80">Countries Served</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

