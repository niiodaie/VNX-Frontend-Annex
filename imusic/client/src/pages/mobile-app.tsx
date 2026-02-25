import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Music, Mic, Users, ChevronLeft, Download } from 'lucide-react';
import SiteHeader from '../components/layout/SiteHeader';

const MobileAppPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      
      <div className="p-4">
        <div className="container mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-purple-400 hover:text-purple-300 mr-4">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-2xl font-serif text-purple-300">Mobile App</h2>
          </div>
          
          {/* Hero section */}
          <div className="rounded-xl bg-gradient-to-br from-purple-900/50 to-black p-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">DarkNotes <span className="text-purple-400">Mobile</span></h1>
            <p className="text-gray-300 mb-6">Create music anytime, anywhere with your AI mentors in your pocket.</p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-purple-700 hover:bg-purple-600 text-white">
                <Download className="w-4 h-4 mr-2" /> Download for iOS
              </Button>
              <Button className="bg-purple-700 hover:bg-purple-600 text-white">
                <Download className="w-4 h-4 mr-2" /> Download for Android
              </Button>
            </div>
          </div>
          
          {/* Features section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-4 rounded-lg bg-[#121212] border border-purple-900/30">
              <div className="bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Music className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Mobile MuseLab</h3>
              <p className="text-gray-300 text-sm">Record ideas, write lyrics, and get AI feedback on the go.</p>
            </div>
            
            <div className="p-4 rounded-lg bg-[#121212] border border-purple-900/30">
              <div className="bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Voice Recording</h3>
              <p className="text-gray-300 text-sm">Capture melodies and ideas with high-quality audio recording.</p>
            </div>
            
            <div className="p-4 rounded-lg bg-[#121212] border border-purple-900/30">
              <div className="bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Offline Mode</h3>
              <p className="text-gray-300 text-sm">Continue creating even when you're offline - sync when reconnected.</p>
            </div>
          </div>
          
          {/* App screenshot mockup */}
          <div className="mb-10 relative">
            <div className="max-w-[300px] mx-auto bg-[#121212] rounded-[36px] p-3 border-4 border-gray-800 shadow-2xl">
              <div className="rounded-[24px] overflow-hidden bg-black">
                <div className="p-3 bg-black">
                  <div className="h-6 w-40 mx-auto rounded-full bg-gray-800 mb-3"></div>
                  <div className="space-y-3 pt-5">
                    <div className="h-12 bg-purple-900/30 rounded-lg flex items-center px-4">
                      <div className="w-8 h-8 rounded-full bg-purple-800 mr-3"></div>
                      <div className="flex-1">
                        <div className="h-3 w-24 bg-purple-800/60 rounded-full"></div>
                        <div className="h-2 w-32 bg-gray-700 rounded-full mt-1"></div>
                      </div>
                    </div>
                    <div className="h-32 bg-gray-900 rounded-lg p-3">
                      <div className="h-3 w-full bg-gray-800 rounded-full mb-2"></div>
                      <div className="h-3 w-5/6 bg-gray-800 rounded-full mb-2"></div>
                      <div className="h-3 w-4/6 bg-gray-800 rounded-full mb-2"></div>
                      <div className="mt-4 flex justify-end">
                        <div className="h-6 w-20 rounded-full bg-purple-900"></div>
                      </div>
                    </div>
                    <div className="h-12 bg-purple-900/30 rounded-lg"></div>
                  </div>
                </div>
                <div className="h-16 bg-gray-900 flex justify-around items-center px-6">
                  <div className="w-8 h-8 rounded-full bg-purple-900"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-800"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-800"></div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full -z-10 blur-3xl opacity-30 h-72 bg-gradient-to-r from-purple-800 to-purple-500 rounded-full"></div>
          </div>
          
          {/* CTA section */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-4">Ready to create on the go?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">Take your music production anywhere with the DarkNotes mobile experience. Seamlessly sync between devices and never lose an idea again.</p>
            <Button className="bg-purple-700 hover:bg-purple-600 text-white px-8 py-6 text-lg">
              <Download className="w-5 h-5 mr-2" /> Download Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppPage;