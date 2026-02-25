import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { UploadCloud, Send, ArrowLeft, Music, Wand2, Mic, Play, Save } from 'lucide-react';
import { Link } from 'wouter';
import SiteHeader from '../components/layout/SiteHeader';
import MusicProductionTools from '../components/MusicProductionTools';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Enhanced MuseLab component with AI integration
const MuseLabEnhanced = () => {
  // Basic states
  const [lyrics, setLyrics] = useState('');
  const [hook, setHook] = useState('');
  const [mentorResponse, setMentorResponse] = useState('');
  const [sending, setSending] = useState(false);
  const [isGeneratingHook, setIsGeneratingHook] = useState(false);
  const [activeTab, setActiveTab] = useState('lyrics');
  const { toast } = useToast();
  
  // Beat metadata and file
  const [beatTitle, setBeatTitle] = useState('');
  const [beatArtist, setBeatArtist] = useState('');
  const [beatGenre, setBeatGenre] = useState('');
  const [beatTempo, setBeatTempo] = useState('');
  const [showMetadata, setShowMetadata] = useState(false);
  
  // Melody AI generation states
  const [melodyPrompt, setMelodyPrompt] = useState('');
  const [generatedMelody, setGeneratedMelody] = useState('');
  const [isGeneratingMelody, setIsGeneratingMelody] = useState(false);
  
  // Audio recording simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);
  
  // Handle lyrics change
  const handleLyricsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLyrics(e.target.value);
  };

  const handleMelodyPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMelodyPrompt(e.target.value);
  };

  // Generate hook
  const handleGenerateHook = async () => {
    if (!lyrics.trim()) {
      toast({
        title: "Lyrics Required",
        description: "Please write some lyrics first before generating a hook.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingHook(true);
    setHook('Generating...');
    
    try {
      const response = await apiRequest("POST", "/api/generate-hook", { lyrics });
      const data = await response.json();
      setHook(data.hook || 'Auto-generated hook for your lyrics');
    } catch (error) {
      console.error('Hook generation error:', error);
      setHook('Error generating hook. Please try again.');
      toast({
        title: "Generation Failed",
        description: "There was an error generating your hook. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingHook(false);
    }
  };

  // Generate melody idea
  const handleGenerateMelody = async () => {
    if (!melodyPrompt.trim()) {
      toast({
        title: "Description Required",
        description: "Please write a description for your melody first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingMelody(true);
    setGeneratedMelody('Generating...');
    
    try {
      const response = await apiRequest("POST", "/api/music/generate-idea", {
        genre: beatGenre || "hip-hop",
        mood: "creative",
        theme: melodyPrompt
      });
      const data = await response.json();
      
      const formattedResult = `
        Concept: ${data.concept}
        
        Melodic Ideas:
        - ${data.melodyDescription}
        
        Structure Ideas:
        - ${data.structureIdea}
        
        Lyrical Hooks:
        - ${data.lyricalHooks.join('\n- ')}
      `;
      
      setGeneratedMelody(formattedResult);
    } catch (error) {
      console.error('Melody generation error:', error);
      setGeneratedMelody('Error generating melody ideas. Please try again.');
      toast({
        title: "Generation Failed",
        description: "There was an error generating melody ideas. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingMelody(false);
    }
  };

  // Send to mentor
  const handleSendToMentor = async () => {
    if (!lyrics.trim()) {
      toast({
        title: "Lyrics Required",
        description: "Please write some lyrics first before sending to your mentor.",
        variant: "destructive"
      });
      return;
    }
    
    setSending(true);
    try {
      const response = await apiRequest("POST", "/api/send-to-mentor", { lyrics });
      const data = await response.json();
      setMentorResponse(data.message || 'Mentor feedback will appear here');
    } catch (error) {
      console.error('Error sending to mentor:', error);
      setMentorResponse('Failed to get mentor feedback. Please try again.');
      toast({
        title: "Mentor Response Failed",
        description: "Could not connect with your mentor. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  // Simulate file upload
  const handleUploadClick = () => {
    setShowMetadata(true);
    setBeatTitle('Sample Beat');
    setTimeout(() => {
      toast({
        title: "Beat Uploaded",
        description: "Your beat was uploaded successfully. Now you can add metadata.",
      });
    }, 100);
  };

  // Save beat metadata
  const handleSaveBeatInfo = () => {
    toast({
      title: "Beat Details Saved",
      description: `"${beatTitle || 'Untitled Beat'}" by ${beatArtist || 'Unknown Producer'} saved successfully.`,
    });
  };

  // Simulate recording
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setRecordingComplete(true);
      toast({
        title: "Recording Complete",
        description: `Recorded ${recordingTime} seconds.`,
      });
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingTime(0);
      setRecordingComplete(false);
      toast({
        title: "Recording Started",
        description: "Recording your vocals...",
      });
    }
  };

  // Simulate recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <div className="p-4">
        <div className="container mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/home" className="text-purple-400 hover:text-purple-300 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-2xl font-serif text-purple-300">MuseLab (Enhanced Version)</h2>
          </div>
          
          {/* Production Tools */}
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2 text-white">🛠️ Music Production Tools</h2>
            <MusicProductionTools />
          </div>
          
          {/* Main Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Workspace with Tabs */}
            <Card className="col-span-full md:col-span-2 p-4 bg-[#121212] border-purple-900/30">
              <Tabs defaultValue="lyrics" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4 bg-[#1a1020]">
                  <TabsTrigger value="lyrics" className="text-sm sm:text-base">
                    📝 Lyrics
                  </TabsTrigger>
                  <TabsTrigger value="melody" className="text-sm sm:text-base">
                    🎵 Melody AI
                  </TabsTrigger>
                  <TabsTrigger value="recording" className="text-sm sm:text-base">
                    🎤 Recording
                  </TabsTrigger>
                </TabsList>
                
                {/* Lyrics Tab */}
                <TabsContent value="lyrics" className="w-full">
                  <h2 className="text-xl font-bold mb-2 text-white">📝 Lyric Workspace</h2>
                  <Textarea
                    rows={10}
                    placeholder="Write your verse, chorus, or hook..."
                    value={lyrics}
                    onChange={handleLyricsChange}
                    className="bg-[#0f0a14] border-purple-900/40 focus:border-purple-500 mb-4 text-white"
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button 
                      onClick={handleGenerateHook}
                      disabled={isGeneratingHook}
                      className="bg-[#332940] hover:bg-[#3d304c] text-white text-sm sm:text-base"
                    >
                      <Wand2 className="w-4 h-4 mr-1" />
                      {isGeneratingHook ? 'Generating...' : 'Generate Hook'}
                    </Button>
                    <Button 
                      onClick={handleSendToMentor} 
                      disabled={sending}
                      className="bg-[#332940] hover:bg-[#3d304c] text-white text-sm sm:text-base"
                    >
                      <Send className="w-4 h-4 mr-1" /> Send to Mentor
                    </Button>
                  </div>
                  {hook && (
                    <div className="mt-4 p-3 bg-[#1a1020] rounded-md border border-purple-900/30">
                      <h3 className="font-semibold text-purple-300">🎶 Hook Suggestion:</h3>
                      <p className="text-gray-300 text-sm sm:text-base">{hook}</p>
                    </div>
                  )}
                  {mentorResponse && (
                    <div className="mt-4 p-3 bg-[#1a1020] rounded-md border border-purple-900/30">
                      <h3 className="font-semibold text-purple-300">🧠 Mentor Says:</h3>
                      <p className="text-gray-300 text-sm sm:text-base whitespace-pre-line">{mentorResponse}</p>
                    </div>
                  )}
                </TabsContent>
                
                {/* Melody AI Tab */}
                <TabsContent value="melody" className="w-full">
                  <h2 className="text-xl font-bold mb-2 text-white">🎵 Melody AI Assistant</h2>
                  <Textarea
                    rows={6}
                    placeholder="Describe the type of melody you want (e.g., 'A melancholic piano melody with trap hi-hats that builds tension before the chorus')"
                    value={melodyPrompt}
                    onChange={handleMelodyPromptChange}
                    className="bg-[#0f0a14] border-purple-900/40 focus:border-purple-500 mb-4 text-white"
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button 
                      onClick={handleGenerateMelody}
                      disabled={isGeneratingMelody}
                      className="bg-[#332940] hover:bg-[#3d304c] text-white text-sm sm:text-base"
                    >
                      <Wand2 className="w-4 h-4 mr-1" />
                      {isGeneratingMelody ? 'Generating...' : 'Generate Melody Ideas'}
                    </Button>
                  </div>
                  {generatedMelody && (
                    <div className="mt-4 p-3 bg-[#1a1020] rounded-md border border-purple-900/30">
                      <h3 className="font-semibold text-purple-300">✨ Melody Ideas:</h3>
                      <pre className="text-gray-300 text-sm sm:text-base whitespace-pre-line overflow-auto">
                        {generatedMelody}
                      </pre>
                    </div>
                  )}
                </TabsContent>
                
                {/* Recording Tab */}
                <TabsContent value="recording" className="w-full">
                  <h2 className="text-xl font-bold mb-2 text-white">🎤 Voice Recording</h2>
                  <div className="flex flex-col items-center justify-center bg-[#0f0a14] border border-purple-900/40 rounded-md p-8 mb-4">
                    <div className="text-center mb-6">
                      <p className="text-gray-300 mb-2">
                        {isRecording 
                          ? `Recording... ${recordingTime}s` 
                          : recordingComplete 
                            ? 'Recording complete!' 
                            : 'Press record to start'}
                      </p>
                      <div className="flex gap-3 justify-center">
                        <Button
                          onClick={toggleRecording}
                          className={`rounded-full h-16 w-16 flex items-center justify-center ${
                            isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-[#332940] hover:bg-[#3d304c]'
                          }`}
                        >
                          {isRecording ? <span className="h-4 w-4 bg-white rounded-sm"/> : <Mic className="h-6 w-6" />}
                        </Button>
                        
                        {recordingComplete && (
                          <Button
                            className="rounded-full h-16 w-16 flex items-center justify-center bg-[#332940] hover:bg-[#3d304c]"
                            onClick={() => {
                              toast({
                                title: "Playback",
                                description: "Playing back your recording...",
                              });
                            }}
                          >
                            <Play className="h-6 w-6" />
                          </Button>
                        )}
                        
                        {recordingComplete && (
                          <Button
                            className="rounded-full h-16 w-16 flex items-center justify-center bg-[#332940] hover:bg-[#3d304c]"
                            onClick={() => {
                              toast({
                                title: "Saved",
                                description: "Your recording has been saved.",
                              });
                            }}
                          >
                            <Save className="h-6 w-6" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {recordingComplete && (
                      <div className="w-full mt-4">
                        <h3 className="font-semibold text-purple-300 mb-2">Recording Details:</h3>
                        <div className="space-y-3">
                          <div>
                            <label htmlFor="recording-title" className="text-sm text-gray-300 block mb-1">Title</label>
                            <Input
                              id="recording-title"
                              placeholder="My Vocal Demo"
                              className="bg-[#1a1020] border-purple-900/40 text-white text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="recording-notes" className="text-sm text-gray-300 block mb-1">Notes</label>
                            <Textarea
                              id="recording-notes"
                              placeholder="Notes about this recording..."
                              className="bg-[#1a1020] border-purple-900/40 text-white text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Beat Dock */}
            <Card className="col-span-full md:col-span-1 p-4 bg-[#121212] border-purple-900/30 flex flex-col items-center justify-start">
              <h2 className="text-xl font-bold mb-2 text-white">🎧 Beat Dock</h2>
              
              {/* Simple Upload Button (no drag and drop) */}
              <Button 
                onClick={handleUploadClick}
                className="bg-[#332940] hover:bg-[#3d304c] text-white w-full h-20 mt-2 mb-4"
              >
                <UploadCloud className="w-6 h-6 mr-2" />
                Click to Upload Beat
              </Button>
              
              {/* Metadata Form (conditionally shown) */}
              {showMetadata && (
                <div className="mt-4 w-full p-3 bg-[#121212] rounded-md border border-purple-900/30">
                  <h3 className="font-semibold text-purple-300 mb-2">📝 Beat Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="beat-title" className="text-sm text-gray-300 block mb-1">Title</label>
                      <Input
                        id="beat-title"
                        value={beatTitle}
                        onChange={(e) => setBeatTitle(e.target.value)}
                        placeholder="Beat title"
                        className="bg-[#1a1020] border-purple-900/40 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="beat-artist" className="text-sm text-gray-300 block mb-1">Producer/Artist</label>
                      <Input
                        id="beat-artist"
                        value={beatArtist}
                        onChange={(e) => setBeatArtist(e.target.value)}
                        placeholder="Producer name"
                        className="bg-[#1a1020] border-purple-900/40 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="beat-genre" className="text-sm text-gray-300 block mb-1">Genre</label>
                      <Input
                        id="beat-genre"
                        value={beatGenre}
                        onChange={(e) => setBeatGenre(e.target.value)}
                        placeholder="Beat genre"
                        className="bg-[#1a1020] border-purple-900/40 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="beat-tempo" className="text-sm text-gray-300 block mb-1">Tempo (BPM)</label>
                      <Input
                        id="beat-tempo"
                        value={beatTempo}
                        onChange={(e) => setBeatTempo(e.target.value)}
                        placeholder="e.g. 95"
                        className="bg-[#1a1020] border-purple-900/40 text-white text-sm"
                      />
                    </div>
                    <Button 
                      className="w-full mt-2 bg-[#332940] hover:bg-[#3d304c] text-white"
                      onClick={handleSaveBeatInfo}
                    >
                      <Music className="w-4 h-4 mr-2" /> Save Beat Info
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Help Text */}
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-400">
                  Need a beat? Try collaborating with producers or use free beats from platforms like Loopcloud or Splice
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuseLabEnhanced;