import React, { useState } from "react";
import { Link, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  Home, 
  Send, 
  Mic, 
  Save, 
  Play, 
  Pause,
  Music, 
  Wand2, 
  MessageSquare, 
  BookOpen, 
  Settings,
  RefreshCw,
  Download,
  Share2
} from "lucide-react";

// Custom waveform component mimicking audio visualization
const AudioWaveform = ({ isPlaying = false }: { isPlaying?: boolean }) => {
  return (
    <div className="flex items-center justify-center h-20 space-x-1">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-purple-500/60 rounded-full ${isPlaying ? "waveform-bar" : ""}`}
          style={{ 
            height: `${Math.floor(Math.random() * 25) + 4}px`,
            animationDelay: `${i * 0.05}s`
          }}
        />
      ))}
    </div>
  );
};

export default function StudioInterfacePage() {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTab, setCurrentTab] = useState("lyrics");
  const [lyricsText, setLyricsText] = useState("Express your rawest thoughts...");
  
  if (!user) {
    return <Redirect to="/auth" />;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-auto purple-light-effect texture-overlay flex">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-20 bg-[#121212] border-r border-[#333] border-opacity-50">
        <div className="p-4 flex flex-col items-center space-y-8">
          <Link href="/home">
            <Button variant="ghost" size="icon" className="rounded-full bg-purple-900/20 text-purple-400 hover:text-purple-300 hover:bg-purple-900/30">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
          
          <Button variant="ghost" size="icon" className="rounded-full text-white bg-purple-600 hover:bg-purple-500">
            <Music className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
            <Wand2 className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
            <MessageSquare className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
            <BookOpen className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="mt-auto p-4 flex flex-col items-center space-y-6 mb-6">
          <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
            <Share2 className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="px-4 md:px-6 py-4 border-b border-[#333] border-opacity-50 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-2xl md:text-3xl font-['Playfair_Display'] font-semibold text-purple-400 hover:text-purple-300 transition cursor-pointer">
                DarkNotes
              </span>
            </Link>
            <span className="hidden md:inline-block text-gray-500 ml-6">Studio</span>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="sm" className="px-2 text-gray-400 hover:text-white">
              <Save className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Save</span>
            </Button>
            
            <div className="pulse-slow opacity-70">
              <div className="relative flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1525362081669-2b476bb628c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Kendrick - Mentor"
                  className="w-8 h-8 rounded-full object-cover silhouette-filter"
                />
                <span className="text-xs text-purple-300 ml-2">Kendrick is listening</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Studio Area */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {/* Project Title */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-medium text-amber-100">Untitled Project</h1>
              <p className="text-gray-400 text-sm">Last edited: April 10, 2025</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                <Download className="w-4 h-4 mr-1" />
                <span className="hidden md:inline">Export</span>
              </Button>
              
              <Button size="sm" className="bg-purple-700 hover:bg-purple-600 text-white">
                <Send className="w-4 h-4 mr-1" />
                <span className="hidden md:inline">Get Feedback</span>
              </Button>
            </div>
          </div>
          
          {/* Studio Tabs */}
          <Tabs defaultValue="lyrics" className="w-full mb-12" onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-3 mb-8 bg-[#121212] text-gray-400">
              <TabsTrigger value="lyrics" className="data-[state=active]:text-purple-400 data-[state=active]:shadow-none">Lyrics</TabsTrigger>
              <TabsTrigger value="melody" className="data-[state=active]:text-purple-400 data-[state=active]:shadow-none">Melody</TabsTrigger>
              <TabsTrigger value="production" className="data-[state=active]:text-purple-400 data-[state=active]:shadow-none">Production</TabsTrigger>
            </TabsList>
            
            <TabsContent value="lyrics" className="purple-glow texture-overlay relative">
              <div className="bg-[#121212] rounded-xl p-6">
                <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full opacity-70 pulse-slow"></div>
                
                <Textarea 
                  className="w-full min-h-[300px] bg-transparent border-none text-white text-lg focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 notebook-bg py-2 px-1 font-handwriting resize-none"
                  placeholder="Express your rawest thoughts..."
                  value={lyricsText}
                  onChange={(e) => setLyricsText(e.target.value)}
                />
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="bg-[#332940] hover:bg-[#3D304C] text-white">
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Ideas
                  </Button>
                  
                  <Button className="bg-[#332940] hover:bg-[#3D304C] text-white">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Rewrite
                  </Button>
                  
                  <Button className="bg-[#332940] hover:bg-[#3D304C] text-white">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask Mentor
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="melody" className="purple-glow texture-overlay relative">
              <div className="bg-[#121212] rounded-xl p-6">
                <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full opacity-70 pulse-slow"></div>
                
                <div className="flex flex-col items-center space-y-8">
                  <AudioWaveform isPlaying={isPlaying} />
                  
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full border-purple-600 text-purple-400"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    
                    <Button 
                      variant={isRecording ? "destructive" : "outline"} 
                      size="icon" 
                      className={`rounded-full ${!isRecording ? "border-purple-600 text-purple-400" : ""}`}
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      <Mic className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="w-full max-w-lg">
                    <p className="text-gray-400 mb-2 text-sm">Tempo</p>
                    <Slider defaultValue={[120]} max={200} min={60} step={1} />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>60</span>
                      <span>120 BPM</span>
                      <span>200</span>
                    </div>
                  </div>
                  
                  <div className="w-full max-w-lg">
                    <p className="text-gray-400 mb-2 text-sm">Key</p>
                    <div className="grid grid-cols-7 gap-2">
                      {["C", "D", "E", "F", "G", "A", "B"].map((note) => (
                        <Button 
                          key={note}
                          variant="outline" 
                          className="h-10 border-purple-900/30"
                        >
                          {note}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="production" className="purple-glow texture-overlay relative">
              <div className="bg-[#121212] rounded-xl p-6">
                <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full opacity-70 pulse-slow"></div>
                
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-white mb-4">Production Tools</h3>
                  <p className="text-gray-400 mb-8">Unlock advanced production tools with a Pro subscription</p>
                  <Button className="bg-purple-700 hover:bg-purple-600 text-white px-8">
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Mentor Feedback Section */}
          {currentTab === "lyrics" && (
            <div className="bg-[#121212] rounded-xl p-6 mb-6 texture-overlay relative">
              <h3 className="text-xl font-medium mb-4 text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-purple-400" />
                Mentor Feedback
              </h3>
              
              <div className="flex items-start space-x-4">
                <img 
                  src="https://images.unsplash.com/photo-1525362081669-2b476bb628c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Kendrick - Mentor"
                  className="w-10 h-10 rounded-full object-cover silhouette-filter"
                />
                
                <div className="flex-1">
                  <div className="bg-[#1D1D1D] rounded-lg p-4 mb-2">
                    <p className="text-gray-300 italic">
                      I see you expressing some deep emotions here. Your use of imagery in the second verse is strong. 
                      Try to find a recurring motif that can create a thematic thread throughout the piece.
                    </p>
                  </div>
                  
                  <div className="text-xs text-gray-500">2 minutes ago</div>
                </div>
              </div>
              
              <div className="mt-6 border-t border-[#333] border-opacity-50 pt-4">
                <div className="flex items-center space-x-2">
                  <Textarea 
                    placeholder="Ask your mentor a question..."
                    className="bg-[#1A1A1A] border-none text-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                  />
                  
                  <Button className="bg-purple-700 hover:bg-purple-600 text-white h-full">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}