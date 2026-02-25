import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

// Simple header component to avoid import issues
const SimpleHeader = () => {
  return (
    <header className="bg-[#0A0A0A] border-b border-[#2D2D2D] w-full py-4">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className="text-2xl font-['Playfair_Display'] font-semibold tracking-wide text-white">
              <span className="text-primary">Dark</span>Notes
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};

const MuseLabFixed = () => {
  const [location] = useLocation();
  const [lyrics, setLyrics] = useState('');
  const [hook, setHook] = useState('');
  const [beat, setBeat] = useState<string | null>(null);
  const [mentorResponse, setMentorResponse] = useState('');
  const [sending, setSending] = useState(false);
  
  // Function to generate a hook with given lyrics
  const generateHookWithLyrics = async (inputLyrics: string) => {
    setHook('Generating...');
    try {
      const response = await fetch('/api/generate-hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics: inputLyrics }),
      });
      const data = await response.json();
      setHook(data.hook || 'No hook generated');
    } catch (error) {
      setHook('Error generating hook. Please try again.');
      console.error('Hook generation error:', error);
    }
  };
  
  // Parse query params from URL
  useEffect(() => {
    // Get mode from URL query params
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    
    // Handle different modes
    if (mode === 'beat') {
      // Auto-load a sample beat (or use a placeholder notification)
      setBeat('/assets/sample-beat.mp3');
      // Display an alert about the sample beat
      setTimeout(() => {
        alert('Sample beat loaded. In a real application, this would play an actual audio file.');
      }, 500);
    } else if (mode === 'hook') {
      // Auto-trigger hook generation with sample lyrics
      const sampleLyrics = "I've been walking through the streets\nThinking about my life and dreams\nEverything I've seen and done\nWondering where I belong";
      setLyrics(sampleLyrics);
      
      // Simulate hook generation after a moment
      setTimeout(() => {
        generateHookWithLyrics(sampleLyrics);
      }, 500);
    }
  }, [location]);

  const handleLyricsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setLyrics(e.target.value);

  const handleBeatUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Use FileReader instead of URL.createObjectURL for better Vite compatibility
      const reader = new FileReader();
      reader.onload = () => {
        setBeat(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateHook = async () => {
    setHook('Generating...');
    try {
      const response = await fetch('/api/generate-hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics }),
      });
      const data = await response.json();
      setHook(data.hook || 'No hook generated');
    } catch (error) {
      setHook('Error generating hook. Please try again.');
      console.error('Hook generation error:', error);
    }
  };

  const handleSendToMentor = async () => {
    setSending(true);
    try {
      const response = await fetch('/api/send-to-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics }),
      });
      const data = await response.json();
      setMentorResponse(data.message || 'No feedback received');
    } catch (error) {
      setMentorResponse('Error sending to mentor. Please try again.');
      console.error('Send to mentor error:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SimpleHeader />
      <div className="p-4">
        <div className="container mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-purple-400 hover:text-purple-300 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-2xl font-serif text-purple-300">MuseLab</h2>
          </div>
          
          {/* Mobile-friendly grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  className="bg-[#332940] hover:bg-[#3d304c] text-white text-sm sm:text-base"
                >
                  Generate Hook
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

            <Card className="col-span-full md:col-span-1 p-4 bg-[#121212] border-purple-900/30 flex flex-col items-center justify-start">
              <h2 className="text-xl font-bold mb-2 text-white">🎧 Beat Dock</h2>
              <Input 
                type="file" 
                accept="audio/*" 
                onChange={handleBeatUpload}
                className="bg-[#1a1020] border-purple-900/40 text-white text-sm sm:text-base w-full"
              />
              {beat && (
                <div className="mt-4 w-full">
                  <div className="flex flex-col items-center">
                    <audio controls src={beat} className="w-full mt-2" onError={(e) => {
                      // If audio fails to load/play, show a placeholder
                      console.log('Audio element error:', e);
                    }} />
                    <p className="text-xs text-gray-400 mt-2">
                      (Sample beat placeholder - in a real app, this would play an actual audio file)
                    </p>
                    <p className="text-xs text-amber-400 mt-1">
                      Note: If audio doesn't play, you can upload your own audio file using the input above.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuseLabFixed;