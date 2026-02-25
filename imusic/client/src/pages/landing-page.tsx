import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Menu } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Waveform from '@/components/ui/waveform';
import { 
  KendrickFlowUI, 
  KendrickFlowImage, 
  NovaRaeImage, 
  MetroDeepImage, 
  Blaze420Image, 
  IvyMuseImage 
} from '@/components/ui/mentor-images';
import { VoiceInspiredMentor } from '@/components/ui/voice-inspired-mentor';
import { MentorRealImage } from '@/components/mentor-real-images';

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  
  // Redirect to home if already logged in
  if (user && !isLoading) {
    return <Redirect to="/home" />;
  }
  
  return (
    <div className="min-h-screen bg-black text-white overflow-auto texture-overlay">
      {/* Header */}
      <header className="px-6 py-6 border-b border-[#333] border-opacity-50 purple-light-effect">
        <div className="flex justify-between items-center">
          <a href="/" className="text-decoration-none">
            <h1 className="text-4xl font-serif text-purple-400 tracking-wide">
              DarkNotes
            </h1>
          </a>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex space-x-8">
              <a href="/auth" className="text-gray-300 hover:text-white text-sm uppercase tracking-wider">
                EXPLORE
              </a>
              <a href="/auth" className="text-gray-300 hover:text-white text-sm uppercase tracking-wider">
                MY JOURNEY
              </a>
              <a href="/auth" className="text-gray-300 hover:text-white text-sm uppercase tracking-wider">
                EVOLVE
              </a>
              <a href="/affiliates" className="text-gray-300 hover:text-white text-sm uppercase tracking-wider">
                AFFILIATES
              </a>
            </div>
            <div 
              className="cursor-pointer hover:text-white"
              onClick={() => window.location.href = "/auth"}
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 text-gray-300 hover:text-white" />
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-purple-400 mb-6">
            <span className="glitch-text" data-text="DarkNotes">DarkNotes</span>
          </h1>
          <p className="text-xl md:text-2xl text-amber-100/80 font-light italic mb-12">
            Where your rawest thoughts become your realest sound
          </p>
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-1">
              <div className="absolute inset-0 bg-purple-700 rounded-full blur-sm"></div>
              <div className="absolute inset-0 bg-purple-500 rounded-full"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div 
              className="rounded-lg bg-[#121212] p-5 text-center relative cursor-pointer hover:bg-[#18131e] transition-all duration-300" 
              onClick={() => window.location.href = "/auth"}
            >
              <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-purple-900 flex items-center justify-center text-sm font-bold">1</div>
              <h3 className="text-lg font-medium text-purple-300 mb-2">EchoMentors</h3>
              <p className="text-gray-400 text-sm">AI-cloned mentors from top artists</p>
            </div>
            <div 
              className="rounded-lg bg-[#121212] p-5 text-center relative cursor-pointer hover:bg-[#18131e] transition-all duration-300" 
              onClick={() => window.location.href = "/auth"}
            >
              <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-purple-900 flex items-center justify-center text-sm font-bold">2</div>
              <h3 className="text-lg font-medium text-purple-300 mb-2">MuseLab</h3>
              <p className="text-gray-400 text-sm">Creative DAW studio with AI assistance</p>
            </div>
            <div 
              className="rounded-lg bg-[#121212] p-5 text-center relative cursor-pointer hover:bg-[#18131e] transition-all duration-300" 
              onClick={() => window.location.href = "/auth"}
            >
              <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-purple-900 flex items-center justify-center text-sm font-bold">3</div>
              <h3 className="text-lg font-medium text-purple-300 mb-2">Collab Zone</h3>
              <p className="text-gray-400 text-sm">Match with peers for co-creation</p>
            </div>
          </div>
        </section>
        
        {/* Mentor Section */}
        <section className="mb-12 pb-12 border-b border-[#333] border-opacity-50">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-shrink-0 w-full md:w-1/3">
              <div className="w-full aspect-[9/16] md:max-w-[260px] mx-auto relative rounded-lg overflow-hidden shadow-lg purple-glow bg-[#0f0a14]">
                {/* Using the imported images from mentor-images component */}
                <KendrickFlowUI 
                  className="absolute inset-0 w-full h-full"
                />
                
                <div className="absolute inset-0 bg-gradient-to-tl from-purple-800/20 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                {/* Stylized pulse effect for AI mentor presence */}
                <div className="absolute bottom-10 right-10 w-6 h-6 rounded-full bg-purple-500/20">
                  <div className="absolute inset-1 rounded-full bg-purple-500/40 animate-ping"></div>
                  <div className="absolute inset-2 rounded-full bg-purple-500/60"></div>
                </div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-purple-800/10 blur-xl"></div>
                <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-purple-800/10 blur-xl"></div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <p className="text-purple-400 text-sm uppercase tracking-wider mb-2">YOUR MENTOR</p>
              <h2 className="text-5xl md:text-6xl font-serif text-amber-100 mb-6 uppercase font-light tracking-wide">
                KENDRICK FLOW
              </h2>
              <p className="text-sm text-gray-400 italic mb-4">
                "Construct verses using layered metaphors that speak to inner conflict, with rhythmic complexity and social commentary."
              </p>
              <Button 
                onClick={() => window.location.href = "/change-mentor"} 
                className="bg-[#332940] hover:bg-[#3d304c] text-white rounded-full px-8 py-2 purple-glow"
              >
                Change
              </Button>
            </div>
          </div>
        </section>
        
        {/* Track Progress Section */}
        <section className="mb-12 pb-12 border-b border-[#333] border-opacity-50">
          <h2 className="text-purple-400 text-sm uppercase tracking-wider mb-6">Your track in progress</h2>
          
          <div className="bg-[#121212] rounded-lg p-6 shadow-md">
            <h3 className="text-white text-xl mb-4">Write lyrics</h3>
            
            <Progress 
              value={40} 
              className="h-2 mb-6 bg-purple-900/20" 
              indicatorClassName="bg-purple-500" 
            />
            
            <textarea 
              className="mb-6 w-full bg-[#0a0a0a] border border-purple-900/40 rounded-md p-4 text-gray-200 font-serif text-base min-h-[100px] focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-inner shadow-purple-900/10 tracking-wide leading-relaxed italic"
              placeholder="Write your lyrics here..."
              defaultValue="The words seem heavy on my tongue, like truth that's waiting to be sung..."
              style={{
                backgroundImage: 'linear-gradient(to bottom, #0c0a12, #0a0a0a)',
                letterSpacing: '0.03em'
              }}
            />
            
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => window.location.href = "/auth"} 
                className="bg-[#332940] hover:bg-[#3d304c] text-white rounded-full px-8 py-2"
              >
                Get feedback
              </Button>
              <Button 
                onClick={() => window.location.href = "/muse-lab"} 
                className="bg-purple-700 hover:bg-purple-600 text-white rounded-full px-8 py-2"
              >
                Open MuseLab
              </Button>
            </div>
          </div>
        </section>
        
        {/* EchoMentors Section */}
        <section className="mb-16">
          <h2 className="text-purple-400 text-sm uppercase tracking-wider mb-4">Meet Your EchoMentors</h2>
          <p className="text-gray-400 mb-6 text-sm">
            Choose from our lineup of AI mentors inspired by legendary artists
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div 
              className="bg-[#121212] rounded-lg overflow-hidden relative group transition duration-300 hover:shadow-purple-900/30 hover:shadow-lg purple-glow h-full cursor-pointer" 
              onClick={() => window.location.href = "/auth"}
            >
              <div className="aspect-square relative overflow-hidden">
                {/* Direct image from public assets folder */}
                <img 
                  src="/assets/kendrick-flow-card.png" 
                  alt="Kendrick Flow" 
                  className="w-full h-full object-cover" 
                />
                {/* Subtle gradient overlay for visual continuity */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-40"></div>
              </div>
            </div>
            
            <div 
              className="bg-[#121212] rounded-lg overflow-hidden relative group transition duration-300 hover:shadow-purple-900/30 hover:shadow-lg h-full cursor-pointer" 
              onClick={() => window.location.href = "/auth"}
            >
              <div className="aspect-square relative bg-[#111111] flex items-center justify-center overflow-hidden">
                {/* Use public directory image */}
                <img 
                  src="/assets/nova-rae.png" 
                  alt="Nova Rae Mentor" 
                  className="absolute inset-0 w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 to-transparent"></div>
                <div className="absolute inset-0 bg-purple-900/20"></div>
                <div className="h-full w-full flex items-center justify-center z-10 relative">
                  <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                    <h3 className="text-3xl font-serif text-purple-300">NR</h3>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 text-xs text-purple-400 opacity-60">INSPIRED BY</div>
                <div className="absolute top-6 left-3 text-sm text-white opacity-70">SZA</div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-purple-300 mb-1">Nova Rae</h3>
                <p className="text-gray-400 text-xs">
                  Emotionally vulnerable lyrics with subtle harmonies
                </p>
              </div>
            </div>
            
            <div 
              className="bg-[#121212] rounded-lg overflow-hidden relative group transition duration-300 hover:shadow-purple-900/30 hover:shadow-lg h-full cursor-pointer" 
              onClick={() => window.location.href = "/auth"}
            >
              <div className="aspect-square relative bg-[#111111] flex items-center justify-center overflow-hidden">
                {/* Use public directory image */}
                <img 
                  src="/assets/metro-deep.png" 
                  alt="MetroDeep Mentor" 
                  className="absolute inset-0 w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black/50"></div>
                <div className="h-full w-full flex items-center justify-center z-10 relative">
                  <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded">
                    <h3 className="text-3xl font-serif text-purple-300">MD</h3>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 text-xs text-purple-400 opacity-60">INSPIRED BY</div>
                <div className="absolute top-6 left-3 text-sm text-white opacity-70">Drake</div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-purple-300 mb-1">MetroDeep</h3>
                <p className="text-gray-400 text-xs">
                  Dark trap-style beats with eerie sound textures
                </p>
              </div>
            </div>
            
            <div 
              className="bg-[#121212] rounded-lg overflow-hidden relative group transition duration-300 hover:shadow-purple-900/30 hover:shadow-lg h-full cursor-pointer" 
              onClick={() => window.location.href = "/auth"}
            >
              <div className="aspect-square relative bg-[#111111] flex items-center justify-center overflow-hidden">
                {/* Use public directory image */}
                <img 
                  src="/assets/blaze420.png" 
                  alt="Blaze420 Mentor" 
                  className="absolute inset-0 w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-purple-900/20 to-black/60"></div>
                <div className="h-full w-full flex items-center justify-center z-10 relative">
                  <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded">
                    <h3 className="text-3xl font-serif text-purple-300">B420</h3>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 text-xs text-purple-400 opacity-60">INSPIRED BY</div>
                <div className="absolute top-6 left-3 text-sm text-white opacity-70">J. Cole</div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-purple-300 mb-1">Blaze420</h3>
                <p className="text-gray-400 text-xs">
                  Psychedelic hooks with auto-tuned vocal textures
                </p>
              </div>
            </div>
            
            <div 
              className="bg-[#121212] rounded-lg overflow-hidden relative group transition duration-300 hover:shadow-purple-900/30 hover:shadow-lg h-full cursor-pointer" 
              onClick={() => window.location.href = "/auth"}
            >
              <div className="aspect-square relative bg-[#111111] flex items-center justify-center overflow-hidden">
                {/* Use public directory image */}
                <img 
                  src="/assets/ivy-muse.png" 
                  alt="IvyMuse Mentor" 
                  className="absolute inset-0 w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-black/50"></div>
                <div className="h-full w-full flex items-center justify-center z-10 relative">
                  <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded">
                    <h3 className="text-3xl font-serif text-purple-300">IM</h3>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 text-xs text-purple-400 opacity-60">INSPIRED BY</div>
                <div className="absolute top-6 left-3 text-sm text-white opacity-70">Beyoncé</div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-purple-300 mb-1">IvyMuse</h3>
                <p className="text-gray-400 text-xs">
                  Bold anthems with call-and-response structures
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Voice-Inspired Mentor Experience */}
        <section className="mb-16">
          <h2 className="text-purple-400 text-sm uppercase tracking-wider mb-4">The Voice Experience</h2>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-400 text-sm">
              Watch the chairs turn when our AI mentors hear your talent
            </p>
            <button 
              onClick={() => window.location.href = "/mentor-audition"} 
              className="bg-purple-700 hover:bg-purple-600 text-white rounded-full px-4 py-2 text-sm"
            >
              Choose Your Mentors
            </button>
          </div>
          
          {/* Audition Options */}
          <div className="mb-8 bg-gradient-to-r from-purple-900/20 to-purple-800/10 rounded-xl p-6 border border-purple-900/30">
            <h3 className="text-xl font-medium text-purple-200 mb-4">Start Your Blind Audition</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Upload Option */}
              <div className="group bg-[#1a101f] hover:bg-[#231429] transition-colors duration-300 rounded-lg p-5 border border-purple-900/40 cursor-pointer"
                onClick={() => window.location.href = "/auth"}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-900/40 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Upload Music Video</h4>
                    <p className="text-sm text-gray-400">Submit pre-recorded performance</p>
                  </div>
                </div>
                <div className="border border-dashed border-purple-700/50 rounded-lg p-4 text-center group-hover:border-purple-500/70 transition-colors duration-300">
                  <p className="text-sm text-gray-400 mb-2">Upload MP4, MOV or WebM format</p>
                  <div className="flex justify-center">
                    <span className="inline-block px-4 py-2 bg-purple-800/40 text-purple-300 rounded-lg text-sm hover:bg-purple-800/60 transition-colors duration-300">
                      Choose File
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Live Audition Option */}
              <div className="group bg-[#1a101f] hover:bg-[#231429] transition-colors duration-300 rounded-lg p-5 border border-purple-900/40 cursor-pointer"
                onClick={() => window.location.href = "/mentor-audition"}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-900/40 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Live Audition</h4>
                    <p className="text-sm text-gray-400">Real-time video performance</p>
                  </div>
                </div>
                <div className="border border-dashed border-red-700/50 rounded-lg p-4 text-center bg-red-900/10 group-hover:border-red-500/70 transition-colors duration-300">
                  <p className="text-sm text-gray-400 mb-2">Start live camera and microphone session</p>
                  <div className="flex justify-center">
                    <span className="inline-block px-4 py-2 bg-red-800/40 text-red-300 rounded-lg text-sm hover:bg-red-800/60 transition-colors duration-300">
                      Go Live
                      <span className="ml-2 relative top-[2px] w-2 h-2 inline-block bg-red-500 rounded-full animate-pulse"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div 
              className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer bg-[#1a101f]"
              onClick={() => window.location.href = "/auth"}
            >
              {/* Mentor image with chair turn effect */}
              <div className="absolute inset-0 z-10">
                {/* Use the real mentor image component */}
                <MentorRealImage name="Kendrick Flow" className="absolute inset-0" />
                
                {/* Overlay with mentor info */}
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-black/70"></div>
                  <div className="text-center z-10">
                    <div className="mb-2">
                      <span className="px-3 py-1 bg-purple-800/60 rounded-full text-sm text-white backdrop-blur-sm">
                        Kendrick Flow
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 bg-black/50 px-2 py-1 rounded backdrop-blur-sm inline-block">
                      Inspired by Kendrick Lamar
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </div>
              
              {/* Chair effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1/5 bg-red-700/60 z-5 translate-y-full transform transition-all duration-500 group-hover:translate-y-0">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12">
                  <div className="absolute inset-0 bg-red-600 rounded-t-full"></div>
                </div>
              </div>
              
              {/* I WANT YOU */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="bg-red-600/90 px-4 py-2 rounded-full text-lg font-bold text-white whitespace-nowrap">
                  I WANT YOU!
                </div>
              </div>
            </div>
            
            <div 
              className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer bg-[#1a101f]"
              onClick={() => window.location.href = "/auth"}
            >
              {/* Mentor image with chair turn effect */}
              <div className="absolute inset-0 z-10">
                {/* Use the real mentor image component */}
                <MentorRealImage name="Nova Rae" className="absolute inset-0" />
                
                {/* Overlay with mentor info */}
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-pink-800/30 to-black/70"></div>
                  <div className="text-center z-10">
                    <div className="mb-2">
                      <span className="px-3 py-1 bg-pink-800/60 rounded-full text-sm text-white backdrop-blur-sm">
                        Nova Rae
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 bg-black/50 px-2 py-1 rounded backdrop-blur-sm inline-block">
                      Inspired by SZA
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </div>
              
              {/* Chair effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1/5 bg-red-700/60 z-5 translate-y-full transform transition-all duration-500 group-hover:translate-y-0">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12">
                  <div className="absolute inset-0 bg-red-600 rounded-t-full"></div>
                </div>
              </div>
              
              {/* I WANT YOU */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="bg-red-600/90 px-4 py-2 rounded-full text-lg font-bold text-white whitespace-nowrap">
                  I WANT YOU!
                </div>
              </div>
            </div>
            
            <div 
              className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer bg-[#1a101f]"
              onClick={() => window.location.href = "/auth"}
            >
              {/* Mentor image with chair turn effect */}
              <div className="absolute inset-0 z-10">
                {/* Use the real mentor image component */}
                <MentorRealImage name="MetroDeep" className="absolute inset-0" />
                
                {/* Overlay with mentor info */}
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-black/70"></div>
                  <div className="text-center z-10">
                    <div className="mb-2">
                      <span className="px-3 py-1 bg-blue-800/60 rounded-full text-sm text-white backdrop-blur-sm">
                        MetroDeep
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 bg-black/50 px-2 py-1 rounded backdrop-blur-sm inline-block">
                      Inspired by Drake
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </div>
              
              {/* Chair effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1/5 bg-red-700/60 z-5 translate-y-full transform transition-all duration-500 group-hover:translate-y-0">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12">
                  <div className="absolute inset-0 bg-red-600 rounded-t-full"></div>
                </div>
              </div>
              
              {/* I WANT YOU */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="bg-red-600/90 px-4 py-2 rounded-full text-lg font-bold text-white whitespace-nowrap">
                  I WANT YOU!
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Inspiration Section */}
        <section className="mb-16">
          <h2 className="text-purple-400 text-sm uppercase tracking-wider mb-6">Inspiration for you</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              className="bg-[#121212] rounded-lg overflow-hidden relative group transition duration-300 hover:shadow-purple-900/30 hover:shadow-lg cursor-pointer" 
              onClick={() => window.location.href = "/auth"}
            >
              <div className="aspect-square relative flex items-center justify-center">
                <Waveform 
                  barCount={30} 
                  isAnimated={false} 
                  className="max-w-[80%] h-20" 
                  barColor="rgba(168, 85, 247, 0.6)" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-full opacity-70 animate-pulse"></div>
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-medium text-purple-300">Try SparkShots AI</h3>
                <p className="text-gray-400 text-sm">Generate creative sparks for your next track</p>
              </div>
            </div>
            
            <div 
              className="bg-[#121212] rounded-lg overflow-hidden relative group transition duration-300 hover:shadow-purple-900/30 hover:shadow-lg cursor-pointer" 
              onClick={() => window.location.href = "/auth"}
            >
              <div className="aspect-square relative flex items-center justify-center bg-[#0a0a0a]">
                <div className="handwritten-note p-4 text-center w-full">
                  <p className="font-handwriting text-gray-300">Your rawest thoughts</p>
                  <p className="font-handwriting text-gray-300">Your realest sound</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-full opacity-70 animate-pulse"></div>
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-medium text-purple-300">SmartLyric Assist</h3>
                <p className="text-gray-400 text-sm">AI-powered lyric writing companion</p>
              </div>
            </div>
            
            <div 
              className="bg-[#121212] rounded-lg overflow-hidden relative group transition duration-300 hover:shadow-purple-900/30 hover:shadow-lg cursor-pointer" 
              onClick={() => window.location.href = "/auth"}
            >
              <div className="aspect-square relative flex items-center justify-center bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 to-transparent"></div>
                <div className="text-center">
                  <p className="text-purple-300 text-xs uppercase tracking-widest mb-1">Find your</p>
                  <h3 className="text-3xl font-medium text-purple-100 mb-1">COLLAB</h3>
                  <p className="text-purple-300 text-xs uppercase tracking-widest">partner</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-full opacity-70 animate-pulse"></div>
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-medium text-purple-300">Collab Zone</h3>
                <p className="text-gray-400 text-sm">Connect with artists for collaborations</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Join CTA Section */}
        <section className="mb-16 text-center py-8">
          <h2 className="text-3xl text-amber-100 font-light mb-4">Ready to start your journey?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Join other artists evolving their sound with AI mentorship
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = "/auth"} 
              className="bg-[#332940] hover:bg-[#3d304c] text-white rounded-full px-8 py-6 text-lg min-w-[160px]"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => window.location.href = "/auth?tab=register"} 
              className="bg-purple-700 hover:bg-purple-600 text-white rounded-full px-8 py-6 text-lg min-w-[160px] purple-glow"
            >
              Get Started
            </Button>
          </div>
        </section>
        
        {/* Creative Journey Section */}
        <section className="border-t border-[#333] border-opacity-50 pt-12 pb-16">
          <h2 className="text-2xl text-amber-100 font-light mb-4 text-center">SoulTrap Explorer Journey</h2>
          <p className="text-gray-400 mb-8 text-center">
            A 5-stage creative journey that takes you from inspiration to collaboration
          </p>
          
          <div className="relative mb-12">
            <div className="absolute h-0.5 bg-purple-900/50 top-1/2 left-0 right-0 transform -translate-y-1/2 z-0"></div>
            <div className="absolute h-0.5 bg-gradient-to-r from-purple-600 to-purple-900/10 top-1/2 left-0 w-3/5 transform -translate-y-1/2 z-0"></div>
            <div className="relative z-10 flex justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full ${step === 3 ? 'bg-purple-600 shadow-lg shadow-purple-500/30' : 'bg-purple-900'} flex items-center justify-center text-sm font-bold`}>
                    {step}
                  </div>
                  <div className={`h-6 w-0.5 ${step === 3 ? 'bg-purple-600' : 'bg-purple-900/50'} mt-1`}></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div 
              className="bg-[#121212] rounded-lg overflow-hidden relative group hover:bg-[#18131e] transition-all duration-300 border border-purple-900/20 h-full cursor-pointer"
              onClick={() => window.location.href = "/auth"}
            >
              <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-purple-900 flex items-center justify-center text-sm font-bold">1</div>
              <div className="aspect-video w-full bg-black/30 flex items-center justify-center">
                <div className="w-12 h-12 flex items-center justify-center bg-purple-900/30 backdrop-blur-sm rounded-full">
                  <div className="w-8 h-8 text-purple-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17317C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8079C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C22 9.34784 20.9464 6.8043 19.0711 4.92893C17.1957 3.05357 14.6522 2 12 2ZM12 20C10.4178 20 8.87104 19.5308 7.55544 18.6518C6.23985 17.7727 5.21447 16.5233 4.60897 15.0615C4.00347 13.5997 3.84504 11.9911 4.15372 10.4393C4.4624 8.88743 5.22433 7.46197 6.34315 6.34315C7.46197 5.22433 8.88743 4.4624 10.4393 4.15372C11.9911 3.84504 13.5997 4.00346 15.0615 4.60896C16.5233 5.21447 17.7727 6.23984 18.6518 7.55544C19.5308 8.87103 20 10.4177 20 12C20 14.1217 19.1572 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20ZM16 11H13V8C13 7.73478 12.8946 7.48043 12.7071 7.29289C12.5196 7.10536 12.2652 7 12 7C11.7348 7 11.4804 7.10536 11.2929 7.29289C11.1054 7.48043 11 7.73478 11 8V11H8C7.73479 11 7.48043 11.1054 7.2929 11.2929C7.10536 11.4804 7 11.7348 7 12C7 12.2652 7.10536 12.5196 7.2929 12.7071C7.48043 12.8946 7.73479 13 8 13H11V16C11 16.2652 11.1054 16.5196 11.2929 16.7071C11.4804 16.8946 11.7348 17 12 17C12.2652 17 12.5196 16.8946 12.7071 16.7071C12.8946 16.5196 13 16.2652 13 16V13H16C16.2652 13 16.5196 12.8946 16.7071 12.7071C16.8946 12.5196 17 12.2652 17 12C17 11.7348 16.8946 11.4804 16.7071 11.2929C16.5196 11.1054 16.2652 11 16 11Z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-medium text-purple-300 mb-1">Inspiration Spark</h3>
                <p className="text-gray-400 text-sm">
                  Choose a theme and find your creative spark with AI-powered tools
                </p>
                <div className="flex justify-between mt-3">
                  <span className="text-purple-400 text-xs">Step 1/5</span>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div 
              className="bg-[#121212] rounded-lg overflow-hidden relative group hover:bg-[#18131e] transition-all duration-300 border border-purple-900/20 h-full cursor-pointer"
              onClick={() => window.location.href = "/auth"}
            >
              <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-purple-900 flex items-center justify-center text-sm font-bold">2</div>
              <div className="aspect-video w-full bg-gradient-to-br from-black to-purple-900/10 flex items-center justify-center px-4 py-3">
                <div className="text-center font-handwriting text-gray-400 text-sm">
                  The words seem heavy on my tongue, like truth that's waiting to be sung...
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-medium text-purple-300 mb-1">Lyric Lab</h3>
                <p className="text-gray-400 text-sm">
                  Write 8 bars with your EchoMentor's guidance and SmartLyric assist
                </p>
                <div className="flex justify-between mt-3">
                  <span className="text-purple-400 text-xs">Step 2/5</span>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div 
              className="bg-[#121212] rounded-lg overflow-hidden relative group hover:bg-[#18131e] transition-all duration-300 border border-purple-900/20 h-full cursor-pointer shadow-lg shadow-purple-500/10"
              onClick={() => window.location.href = "/auth"}
            >
              <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">3</div>
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-purple-600 rounded-full">
                <span className="text-white text-xs">Active</span>
              </div>
              <div className="aspect-video w-full bg-black/50 flex items-center justify-center p-2">
                <div className="w-full h-full">
                  <Waveform 
                    barCount={24} 
                    isAnimated={true} 
                    className="max-w-full" 
                    barColor="rgba(168, 85, 247, 0.4)" 
                    activeBarColor="rgba(168, 85, 247, 0.9)"
                  />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-medium text-purple-300 mb-1">Beat Assembly</h3>
                <p className="text-gray-400 text-sm">
                  Build your beat using MuseLab's DAW or prompt-based beat generator
                </p>
                <div className="flex justify-between mt-3">
                  <span className="text-purple-400 text-xs">Step 3/5</span>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div 
              className="bg-[#121212] rounded-lg overflow-hidden relative group hover:bg-[#18131e] transition-all duration-300 border border-purple-900/20 h-full cursor-pointer opacity-90"
              onClick={() => window.location.href = "/auth"}
            >
              <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-purple-900 flex items-center justify-center text-sm font-bold">4</div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-radial from-purple-900/20 to-transparent"></div>
              <div className="aspect-video w-full bg-black/60 flex items-center justify-center">
                <div className="w-12 h-12 flex items-center justify-center bg-purple-900/40 backdrop-blur-sm rounded-full">
                  <div className="w-8 h-8 text-purple-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
                      <path d="M12 5C12.5523 5 13 4.55228 13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4C11 4.55228 11.4477 5 12 5Z" />
                      <path d="M12 21C12.5523 21 13 20.5523 13 20C13 19.4477 12.5523 19 12 19C11.4477 19 11 19.4477 11 20C11 20.5523 11.4477 21 12 21Z" />
                      <path d="M4 12C4 12.5523 3.55228 13 3 13C2.44772 13 2 12.5523 2 12C2 11.4477 2.44772 11 3 11C3.55228 11 4 11.4477 4 12Z" />
                      <path d="M20 13C20.5523 13 21 12.5523 21 12C21 11.4477 20.5523 11 20 11C19.4477 11 19 11.4477 19 12C19 12.5523 19.4477 13 20 13Z" />
                      <path d="M6.34315 17.6569C6.73367 18.0474 6.73367 18.6805 6.34315 19.0711C5.95262 19.4616 5.31946 19.4616 4.92893 19.0711C4.53841 18.6805 4.53841 18.0474 4.92893 17.6569C5.31946 17.2663 5.95262 17.2663 6.34315 17.6569Z" />
                      <path d="M19.0711 19.0711C19.4616 18.6805 19.4616 18.0474 19.0711 17.6569C18.6805 17.2663 18.0474 17.2663 17.6569 17.6569C17.2663 18.0474 17.2663 18.6805 17.6569 19.0711C18.0474 19.4616 18.6805 19.4616 19.0711 19.0711Z" />
                      <path d="M19.0711 4.92893C19.4616 5.31946 19.4616 5.95262 19.0711 6.34315C18.6805 6.73367 18.0474 6.73367 17.6569 6.34315C17.2663 5.95262 17.2663 5.31946 17.6569 4.92893C18.0474 4.53841 18.6805 4.53841 19.0711 4.92893Z" />
                      <path d="M4.92893 6.34315C4.53841 5.95262 4.53841 5.31946 4.92893 4.92893C5.31946 4.53841 5.95262 4.53841 6.34315 4.92893C6.73367 5.31946 6.73367 5.95262 6.34315 6.34315C5.95262 6.73367 5.31946 6.73367 4.92893 6.34315Z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-medium text-purple-300 mb-1">Demo Session</h3>
                <p className="text-gray-400 text-sm">
                  Record your 1-minute demo and receive feedback from your EchoMentor
                </p>
                <div className="flex justify-between mt-3">
                  <span className="text-purple-400 text-xs">Step 4/5</span>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div 
              className="bg-[#121212] rounded-lg overflow-hidden relative group hover:bg-[#18131e] transition-all duration-300 border border-purple-900/20 h-full cursor-pointer opacity-90"
              onClick={() => window.location.href = "/auth"}
            >
              <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-purple-900 flex items-center justify-center text-sm font-bold">5</div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-radial from-purple-900/20 to-transparent"></div>
              <div className="aspect-video w-full bg-gradient-to-b from-black/80 to-black/40 flex items-center justify-center">
                <div className="bg-purple-900/20 rounded-full p-2">
                  <div className="w-8 h-8 text-purple-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.5 6C5.01472 6 3 8.01472 3 10.5C3 12.9853 5.01472 15 7.5 15C9.98528 15 12 12.9853 12 10.5C12 8.01472 9.98528 6 7.5 6ZM4.5 10.5C4.5 8.84315 5.84315 7.5 7.5 7.5C9.15685 7.5 10.5 8.84315 10.5 10.5C10.5 12.1569 9.15685 13.5 7.5 13.5C5.84315 13.5 4.5 12.1569 4.5 10.5Z" />
                      <path d="M16.5 6C14.0147 6 12 8.01472 12 10.5C12 12.9853 14.0147 15 16.5 15C18.9853 15 21 12.9853 21 10.5C21 8.01472 18.9853 6 16.5 6ZM13.5 10.5C13.5 8.84315 14.8431 7.5 16.5 7.5C18.1569 7.5 19.5 8.84315 19.5 10.5C19.5 12.1569 18.1569 13.5 16.5 13.5C14.8431 13.5 13.5 12.1569 13.5 10.5Z" />
                      <path d="M7.5 15C4.6073 15 2.25 17.3573 2.25 20.25C2.25 20.6642 2.58579 21 3 21C3.41421 21 3.75 20.6642 3.75 20.25C3.75 18.1789 5.42893 16.5 7.5 16.5C9.57107 16.5 11.25 18.1789 11.25 20.25C11.25 20.6642 11.5858 21 12 21C12.4142 21 12.75 20.6642 12.75 20.25C12.75 17.3573 10.3927 15 7.5 15Z" />
                      <path d="M16.5 15C13.6073 15 11.25 17.3573 11.25 20.25C11.25 20.6642 11.5858 21 12 21C12.4142 21 12.75 20.6642 12.75 20.25C12.75 18.1789 14.4289 16.5 16.5 16.5C18.5711 16.5 20.25 18.1789 20.25 20.25C20.25 20.6642 20.5858 21 21 21C21.4142 21 21.75 20.6642 21.75 20.25C21.75 17.3573 19.3927 15 16.5 15Z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-medium text-purple-300 mb-1">Release & Collab</h3>
                <p className="text-gray-400 text-sm">
                  Publish to your profile or invite other artists to remix your track
                </p>
                <div className="flex justify-between mt-3">
                  <span className="text-purple-400 text-xs">Step 5/5</span>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div 
              className="bg-[#121212] p-5 rounded-lg relative group hover:bg-[#18131e] transition-all duration-300 border border-purple-900/20 h-full cursor-pointer"
              onClick={() => window.location.href = "/audition"}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                NEW
              </div>
              <h3 className="text-xl font-medium text-purple-300 mb-3 mt-2">DarkVoice</h3>
              <p className="text-gray-400 text-sm">
                Audition your lyrics and see which AI mentors turn their chairs for you
              </p>
              <div className="absolute top-3 right-3 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            
            <div 
              className="bg-[#121212] p-5 rounded-lg relative group hover:bg-[#18131e] transition-all duration-300 border border-purple-900/20 h-full cursor-pointer"
              onClick={() => window.location.href = "/mentor"}
            >
              <h3 className="text-xl font-medium text-purple-300 mb-3">EchoMentors</h3>
              <p className="text-gray-400 text-sm">
                Meet our lineup of AI mentors inspired by top artists in the industry
              </p>
              <div className="absolute top-3 right-3 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            
            <div 
              className="bg-[#121212] p-5 rounded-lg relative group hover:bg-[#18131e] transition-all duration-300 border border-purple-900/20 h-full cursor-pointer"
              onClick={() => window.location.href = "/studio-page"}
            >
              <h3 className="text-xl font-medium text-purple-300 mb-3">MuseLab</h3>
              <p className="text-gray-400 text-sm">
                Create beats, write lyrics, and produce tracks with our AI-powered studio
              </p>
              <div className="absolute top-3 right-3 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-[#333] border-opacity-50 py-6 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a href="/">
              <h2 className="text-2xl font-serif text-purple-400 tracking-wide">DarkNotes</h2>
            </a>
            <p className="text-gray-500 text-sm mt-1">Where your rawest thoughts become your realest sound</p>
          </div>
          
          <div className="flex gap-8">
            <a href="/auth" className="text-gray-400 hover:text-white text-sm">
              Sign In
            </a>
            <a href="/auth?tab=register" className="text-gray-400 hover:text-white text-sm">
              Register
            </a>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-6 pt-6 border-t border-[#333] border-opacity-50">
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/about" className="text-gray-400 hover:text-white text-sm">About</a>
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy</a>
            <a href="/terms" className="text-gray-400 hover:text-white text-sm">Terms</a>
            <a href="/contact" className="text-gray-400 hover:text-white text-sm">Contact</a>
          </div>
          <p className="text-center text-gray-500 text-xs mt-4">
            © {new Date().getFullYear()} DarkNotes - A Visnec Media LLC company. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}