import React from "react";
import { Header, Footer } from "@/components/layout/navigation";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="py-20 px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            About DarkNotes
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-8">
              DarkNotes is an innovative AI-powered music mentorship platform designed to transform your creative journey through personalized technological experiences.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-4 text-purple-400">Our Mission</h2>
            <p className="text-gray-300">
              DarkNotes is an innovative AI-driven music mentorship platform designed to empower emerging artists worldwide. Our mission is to bridge the gap between talent and opportunity by providing personalized guidance from AI clones of iconic musicians across genres and continents.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-4 text-purple-400">How It Works</h2>
            <p className="text-gray-300">
              Through a rich, emotionally immersive digital studio, artists embark on tailored creative journeys that foster collaboration and inspiration. Whether you're refining your sound in the Muse Lab or connecting with fellow creatives in the Underground, DarkNotes aims to democratize mentorship and unleash creativity in every aspiring musician.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-4 text-purple-400">Our Story</h2>
            <p className="text-gray-300">
              DarkNotes was founded by a team of musicians, technologists, and creative visionaries who saw the potential for AI to democratize music education and mentorship. Drawing inspiration from shows like "The Voice," we created a platform where emerging artists can get guidance from AI mentors who "turn their chairs" based on music quality and potential.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-4 text-purple-400">The DarkNotes Difference</h2>
            <p className="text-gray-300">
              What sets DarkNotes apart is our commitment to personalization and authenticity. Our AI mentors don't just provide generic feedback – they offer insights tailored to your unique style and goals. With DarkNotes, you're not just learning music; you're discovering your own artistic identity in an environment designed to nurture your creative growth.
            </p>
            
            <div className="mt-12 text-center">
              <p className="italic text-gray-400">
                "Where your rawest thoughts become your realest sound."
              </p>
              <p className="mt-2 text-sm text-gray-500">
                © {new Date().getFullYear()} DarkNotes - A Visnec Media LLC company. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}