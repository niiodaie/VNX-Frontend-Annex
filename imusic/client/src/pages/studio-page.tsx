import Sidebar from '@/components/layout/sidebar';
import MobileNav from '@/components/layout/mobile-nav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import Waveform from '@/components/ui/waveform';
import ChatInterface from '@/components/studio/chat-interface';
import MusicAnalyzer from '@/components/studio/music-analyzer';
import CreativeIdeaGenerator from '@/components/studio/creative-idea-generator';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useLocation, Link } from 'wouter';

export default function StudioPage() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [tempo, setTempo] = useState([120]);
  const [location] = useLocation();
  
  // Get the tab from URL query parameters, if any
  const getDefaultTab = () => {
    if (location.includes('?tab=')) {
      const tab = location.split('?tab=')[1];
      if (['workspace', 'mentor', 'tools', 'beats', 'vocals'].includes(tab)) {
        return tab;
      }
    }
    return 'workspace';
  };
  
  // Fetch the user's current mentor
  const { data: mentorData, isLoading: mentorLoading } = useQuery<any>({
    queryKey: ['/api/user/mentor']
  });
  
  const mentor = mentorData ? {
    id: mentorData.mentorId,
    name: mentorData.name,
    profileImage: mentorData.profileImage,
    message: mentorData.currentMessage
  } : null;
  
  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-[#121212] text-white">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto bg-[#121212] pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Studio</h1>
            <p className="text-gray-400 mt-2">Create, record, and produce your music</p>
          </div>
          
          <Tabs defaultValue={getDefaultTab()} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-5 mb-8">
              <TabsTrigger value="workspace">Workspace</TabsTrigger>
              <TabsTrigger value="mentor">AI Mentor</TabsTrigger>
              <TabsTrigger value="tools">AI Tools</TabsTrigger>
              <TabsTrigger value="beats">Beats</TabsTrigger>
              <TabsTrigger value="vocals">Vocals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="workspace" className="space-y-6">
              <div className="bg-[#1E1E1E] rounded-xl border border-[#2D2D2D] p-6">
                <div className="mb-8">
                  <h2 className="text-xl font-medium mb-4">Track Controls</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#2D2D2D] p-4 rounded-lg">
                      <h3 className="text-sm text-gray-400 mb-2">Volume</h3>
                      <div className="flex items-center">
                        <i className="fas fa-volume-down text-gray-400 mr-3"></i>
                        <Slider
                          value={volume}
                          max={100}
                          step={1}
                          className="flex-1"
                          onValueChange={setVolume}
                        />
                        <span className="ml-3 text-sm text-gray-400 w-8">{volume}%</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#2D2D2D] p-4 rounded-lg">
                      <h3 className="text-sm text-gray-400 mb-2">Tempo</h3>
                      <div className="flex items-center">
                        <i className="fas fa-clock text-gray-400 mr-3"></i>
                        <Slider
                          value={tempo}
                          min={60}
                          max={180}
                          step={1}
                          className="flex-1"
                          onValueChange={setTempo}
                        />
                        <span className="ml-3 text-sm text-gray-400 w-12">{tempo} BPM</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#2D2D2D] p-4 rounded-lg">
                      <h3 className="text-sm text-gray-400 mb-2">AI Assistance</h3>
                      <div className="flex items-center">
                        <Button variant="outline" className="w-full bg-[#121212] text-white border-[#121212] hover:bg-[#121212]/90">
                          <i className="fas fa-magic mr-2"></i>
                          Suggest Pattern
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-medium mb-4">Track Visualization</h2>
                  <div className="bg-[#2D2D2D] rounded-lg p-4 h-48 flex items-center justify-center">
                    <Waveform isAnimated={false} barCount={50} className="w-full" />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button className="bg-primary hover:bg-primary/90 text-white min-w-[120px]">
                    <i className="fas fa-play mr-2"></i>
                    Play
                  </Button>
                  <Button variant="outline" className="bg-[#2D2D2D] text-white border-[#2D2D2D] hover:bg-[#2D2D2D]/90 min-w-[120px]">
                    <i className="fas fa-pause mr-2"></i>
                    Pause
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`${
                      isRecording 
                        ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                        : 'bg-[#2D2D2D] text-white border-[#2D2D2D] hover:bg-[#2D2D2D]/90'
                    } min-w-[120px]`}
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    <i className={`fas ${isRecording ? 'fa-stop' : 'fa-circle'} mr-2 ${isRecording ? '' : 'text-red-500'}`}></i>
                    {isRecording ? 'Stop' : 'Record'}
                  </Button>
                  <Button variant="outline" className="bg-[#2D2D2D] text-white border-[#2D2D2D] hover:bg-[#2D2D2D]/90 min-w-[120px]">
                    <i className="fas fa-save mr-2"></i>
                    Save
                  </Button>
                  <Link href="/share">
                    <Button variant="ghost" className="bg-purple-600/20 hover:bg-purple-600/30 text-white border-purple-600/40 min-w-[120px]">
                      <i className="fas fa-share-alt mr-2"></i>
                      Share
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-[#1E1E1E] rounded-xl border border-[#2D2D2D] p-6">
                <h2 className="text-xl font-medium mb-4">Mentor Feedback</h2>
                <div className="bg-[#2D2D2D] rounded-lg p-4 mb-4 notebook-bg">
                  <p className="text-gray-300 italic">
                    "I'm hearing good energy in your track. Try experimenting with the hi-hat pattern to add more movement. Also, consider adding a subtle bassline to fill out the low end."
                  </p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <i className="fas fa-comment mr-2"></i>
                  Ask for Advice
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="mentor" className="space-y-6">
              {mentorLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : !mentor ? (
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
                  <h2 className="text-2xl font-medium text-white mb-4">No Mentor Selected</h2>
                  <p className="text-gray-400 mb-6">
                    You need to select a mentor before you can use the AI mentor chat.
                  </p>
                  <Button onClick={() => window.location.href = '/mentor'}>
                    Select a Mentor
                  </Button>
                </div>
              ) : (
                <div className="h-[70vh]">
                  <ChatInterface 
                    mentorName={mentor.name}
                    mentorImage={mentor.profileImage}
                    initialMessage={mentor.message}
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tools" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MusicAnalyzer />
                <CreativeIdeaGenerator />
              </div>
            </TabsContent>
            
            <TabsContent value="beats" className="space-y-6">
              <div className="bg-[#1E1E1E] rounded-xl border border-[#2D2D2D] p-6">
                <h2 className="text-xl font-medium mb-4">Beat Library</h2>
                <p className="text-gray-400 mb-4">Browse beats or generate new ones with AI assistance</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-[#2D2D2D] rounded-lg overflow-hidden">
                      <div className="h-16 flex items-center justify-center relative">
                        <Waveform isAnimated={false} barCount={20} />
                        <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                          <i className="fas fa-play text-white text-xl"></i>
                        </button>
                      </div>
                      <div className="p-3 flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium">Beat #{i}</h4>
                          <p className="text-xs text-gray-400">{80 + i * 5} BPM</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <i className="fas fa-plus text-primary"></i>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    <i className="fas fa-bolt mr-2"></i>
                    Generate New Beat
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="vocals" className="space-y-6">
              <div className="bg-[#1E1E1E] rounded-xl border border-[#2D2D2D] p-6">
                <h2 className="text-xl font-medium mb-4">Vocal Recording</h2>
                <p className="text-gray-400 mb-4">Record and process your vocals</p>
                
                <div className="bg-[#2D2D2D] rounded-lg p-8 flex flex-col items-center justify-center mb-6">
                  <div className="text-center mb-6">
                    <i className="fas fa-microphone text-4xl text-primary mb-4"></i>
                    <h3 className="text-lg font-medium">Ready to Record</h3>
                    <p className="text-sm text-gray-400">Click the button below to start recording</p>
                  </div>
                  
                  <Button 
                    className={isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'} mr-2`}></i>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                </div>
                
                <h3 className="text-lg font-medium mb-3">AI Vocal Enhancement</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Button variant="outline" className="bg-[#2D2D2D] text-white border-[#2D2D2D] hover:bg-[#2D2D2D]/90 justify-start">
                    <i className="fas fa-magic mr-2 text-primary"></i>
                    Auto-Tune
                  </Button>
                  <Button variant="outline" className="bg-[#2D2D2D] text-white border-[#2D2D2D] hover:bg-[#2D2D2D]/90 justify-start">
                    <i className="fas fa-magic mr-2 text-primary"></i>
                    Remove Background Noise
                  </Button>
                  <Button variant="outline" className="bg-[#2D2D2D] text-white border-[#2D2D2D] hover:bg-[#2D2D2D]/90 justify-start">
                    <i className="fas fa-magic mr-2 text-primary"></i>
                    Add Reverb
                  </Button>
                </div>
                
                <h3 className="text-lg font-medium mb-3">Writing Assistance</h3>
                <div className="bg-[#2D2D2D] rounded-lg p-4 notebook-bg mb-4">
                  <p className="text-gray-300 italic">
                    Need help with lyrics? Click below to get AI-generated lyric suggestions in your mentor's style.
                  </p>
                </div>
                
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <i className="fas fa-pen-fancy mr-2"></i>
                  Generate Lyrics
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}