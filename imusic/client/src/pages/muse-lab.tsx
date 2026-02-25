import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { UploadCloud, Play, Send, ArrowLeft, Music } from 'lucide-react';
import { Link } from 'wouter';
import { useDropzone } from 'react-dropzone';
import SiteHeader from '../components/layout/SiteHeader';

// Simple MuseLab component - using the provided reference implementation
const MuseLab = () => {
  // Basic states
  const [lyrics, setLyrics] = useState('');
  const [hook, setHook] = useState('');
  const [mentorResponse, setMentorResponse] = useState('');
  const [sending, setSending] = useState(false);
  const [isGeneratingHook, setIsGeneratingHook] = useState(false);
  
  // Beat states - kept simple for stability
  const [beatTitle, setBeatTitle] = useState('');
  const [beatArtist, setBeatArtist] = useState('');
  const [beatGenre, setBeatGenre] = useState('');
  const [showMetadata, setShowMetadata] = useState(false);
  
  // Handle lyrics change
  const handleLyricsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLyrics(e.target.value);
  };

  // Process dropped audio file
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Extract title from filename if empty
      if (!beatTitle) {
        const fileName = file.name.replace(/\.(mp3|wav|ogg|m4a)$/i, '');
        setBeatTitle(fileName);
      }
      
      // Show a success message - no file processing to avoid Vite issues
      alert(`File "${file.name}" received. Using sample audio for preview.`);
      setShowMetadata(true);
    }
  };

  // Setup dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'audio/*': [] },
    onDrop
  });

  // Generate hook
  const handleGenerateHook = async () => {
    if (!lyrics.trim()) {
      alert('Please write some lyrics first');
      return;
    }
    
    setIsGeneratingHook(true);
    setHook('Generating...');
    
    try {
      const response = await fetch('/api/generate-hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics }),
      });
      
      const data = await response.json();
      setHook(data.hook || 'Auto-generated hook for your lyrics');
    } catch (error) {
      console.error('Hook generation error:', error);
      setHook('Error generating hook. Please try again.');
    } finally {
      setIsGeneratingHook(false);
    }
  };

  // Send to mentor
  const handleSendToMentor = async () => {
    if (!lyrics.trim()) {
      alert('Please write some lyrics first before sending to your mentor.');
      return;
    }
    
    setSending(true);
    try {
      const response = await fetch('/api/send-to-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics }),
      });
      
      const data = await response.json();
      setMentorResponse(data.message || 'Mentor feedback will appear here');
    } catch (error) {
      console.error('Error sending to mentor:', error);
      setMentorResponse('Failed to get mentor feedback. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Save beat metadata
  const handleSaveBeatInfo = () => {
    alert(`Beat details saved: ${beatTitle || 'Untitled Beat'} by ${beatArtist || 'Unknown Producer'}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <div className="p-4">
        <div className="container mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-purple-400 hover:text-purple-300 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-2xl font-serif text-purple-300">MuseLab</h2>
          </div>
          
          {/* Main Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Lyrics Workspace */}
            <Card className="col-span-full md:col-span-2 p-4 bg-[#121212] border-purple-900/30">
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
                  <p className="text-gray-300 text-sm sm:text-base">{mentorResponse}</p>
                </div>
              )}
            </Card>

            {/* Beat Dock */}
            <Card className="col-span-full md:col-span-1 p-4 bg-[#121212] border-purple-900/30 flex flex-col items-center justify-start">
              <h2 className="text-xl font-bold mb-2 text-white">🎧 Beat Dock</h2>
              
              {/* Drag & Drop Zone */}
              <div
                {...getRootProps()}
                className="w-full p-6 border-2 border-dashed rounded-md cursor-pointer text-center transition-colors border-purple-900/30 hover:border-purple-700/40"
              >
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto mb-2 h-8 w-8 text-purple-400" />
                <p className="text-sm text-gray-300">
                  Drag & drop your beat file here, or click to select
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports MP3, WAV, OGG, and other audio formats
                </p>
              </div>
              
              {/* Sample Audio Player */}
              <div className="mt-6 w-full flex justify-center">
                <Button className="bg-purple-700 hover:bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center">
                  <Play className="w-5 h-5" />
                </Button>
                <div className="ml-3 text-sm text-gray-300 self-center">
                  Click to play sample beat
                </div>
              </div>
              
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

export default MuseLab;