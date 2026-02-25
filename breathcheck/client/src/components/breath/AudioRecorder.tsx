import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import AudioWaveVisualizer from './AudioWaveVisualizer';

interface AudioRecorderProps {
  onRecordingComplete: (audioData: string) => void;
  isProcessing?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onRecordingComplete,
  isProcessing = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  
  // Request microphone permission when the component mounts
  useEffect(() => {
    async function requestMicrophonePermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);
        setHasPermission(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setHasPermission(false);
      }
    }
    
    requestMicrophonePermission();
    
    // Clean up on unmount
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const startRecording = () => {
    audioChunksRef.current = [];
    
    if (!audioStream) return;
    
    const mediaRecorder = new MediaRecorder(audioStream);
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      setAudioBlob(audioBlob);
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // Remove the data URL prefix (e.g., "data:audio/wav;base64,")
        const base64Audio = base64data.split(',')[1];
        onRecordingComplete(base64Audio);
      };
    };
    
    // Start recording
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);
    
    // Start timer
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  // Format the recording time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  return (
    <div className="space-y-4">
      {hasPermission === false && (
        <div className="bg-danger border border-crimson/50 text-crimson p-4 rounded-lg text-sm">
          Microphone access denied. Please allow microphone access to use the breathalyzer.
        </div>
      )}
      
      <AudioWaveVisualizer isRecording={isRecording} audioStream={audioStream} />
      
      <div className="flex flex-col items-center gap-6">
        {isRecording ? (
          <div className="flex flex-col items-center gap-3">
            <div className="text-2xl font-mono font-semibold text-breathteal">{formatTime(recordingTime)}</div>
            <div className="text-sm text-fogwhite mb-2 bg-midnight py-2 px-4 rounded-full border border-breathteal/30">
              Blow steadily into your microphone
            </div>
            <Button 
              onClick={stopRecording} 
              size="lg"
              className="bg-crimson hover:bg-crimson/90 text-fogwhite rounded-full w-16 h-16 flex items-center justify-center border-4 border-crimson/20 shadow-lg shadow-crimson/10"
            >
              <Square className="h-6 w-6" />
            </Button>
          </div>
        ) : isProcessing ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-breathteal" />
            <div className="text-sm text-breathteal font-medium">
              Analyzing your breath sample...
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="text-sm text-fogwhite mb-2 bg-midnight py-2 px-4 rounded-full border border-breathteal/30">
              Tap to begin breath analysis
            </div>
            <Button 
              onClick={startRecording}
              disabled={!hasPermission || isProcessing} 
              size="lg"
              className="bg-breathteal hover:bg-breathteal/90 text-midnight rounded-full w-20 h-20 flex items-center justify-center border-4 border-breathteal/20 shadow-lg shadow-breathteal/10"
            >
              <Mic className="h-8 w-8" />
            </Button>
          </div>
        )}
        
        <div className="text-xs text-coolgray max-w-md text-center bg-midnight/50 p-3 rounded-lg border border-midnight">
          For accurate results, take a deep breath and exhale steadily for 3-5 seconds.
          Hold your device approximately 4 inches from your mouth.
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;