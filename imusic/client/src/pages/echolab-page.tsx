import React from "react";
import { Header, Footer } from "@/components/layout/navigation";

export default function EchoLabPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="py-20 px-6 max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            EchoLab
          </h1>
          
          <div className="bg-gradient-to-br from-black/80 to-purple-950/20 rounded-lg p-8 border border-purple-900/30">
            <p className="text-gray-300 text-lg mb-6">
              Welcome to EchoLab, where your music gets personalized AI feedback from your chosen mentor. Upload your tracks and receive detailed guidance to improve your sound.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <div className="bg-black/50 rounded-lg p-6 border border-purple-900/30">
                <h3 className="text-xl font-bold mb-3 text-purple-400">Personalized Feedback</h3>
                <p className="text-gray-400">
                  Get in-depth analysis of your music from your AI mentor, with specific suggestions for improvement.
                </p>
              </div>
              
              <div className="bg-black/50 rounded-lg p-6 border border-purple-900/30">
                <h3 className="text-xl font-bold mb-3 text-purple-400">Vocal Analysis</h3>
                <p className="text-gray-400">
                  Receive detailed feedback on your vocal performance, including pitch, timing, and emotional delivery.
                </p>
              </div>
              
              <div className="bg-black/50 rounded-lg p-6 border border-purple-900/30">
                <h3 className="text-xl font-bold mb-3 text-purple-400">Production Tips</h3>
                <p className="text-gray-400">
                  Learn how to improve your mix, arrangement, and production values with expert advice.
                </p>
              </div>
              
              <div className="bg-black/50 rounded-lg p-6 border border-purple-900/30">
                <h3 className="text-xl font-bold mb-3 text-purple-400">Song Structure Analysis</h3>
                <p className="text-gray-400">
                  Get insights on your song structure and arrangement to create more impactful tracks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}