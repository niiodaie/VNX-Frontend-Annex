import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Mic, ChevronLeft, Settings } from "lucide-react";
import AudioWaveVisualizer from "@/components/breath/AudioWaveVisualizer";
import AudioSensorSettings from "@/components/breath/AudioSensorSettings";
import { analyzeBreathSample } from '@/lib/breathalyzer-api';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

// Demo userId for now
const DEMO_USER_ID = 1;

// Function to convert audio blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix and keep only the base64 content
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default function ScanScreen() {
  const [, setLocation] = useLocation();
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // In a real app, this would come from user subscription status
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();
  
  const handleGoBack = () => {
    setLocation('/');
  };
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      setIsRecording(true);
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        processAudioSample(audioBlob);
      };
      
      // Start recording
      mediaRecorder.start();
      
      // Automatically stop recording after 5 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 5000);
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Unable to access microphone. Please make sure microphone permissions are granted.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      setIsRecording(false);
      mediaRecorderRef.current.stop();
    }
    
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
  };
  
  const processAudioSample = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      const audioBase64 = await blobToBase64(audioBlob);
      
      // Send to server for analysis
      const result = await analyzeBreathSample({
        userId: DEMO_USER_ID,
        audioSample: audioBase64,
      });
      
      // Navigate to results page after successful analysis
      setLocation('/result');
      
    } catch (err) {
      console.error('Error processing breath sample:', err);
      setError('Analysis failed. Unable to analyze breath sample. Please try again.');
      setIsProcessing(false);
    }
  };
  
  // Clean up audio stream on unmount
  useEffect(() => {
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioStream]);
  
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleGoBack} disabled={isRecording || isProcessing}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Breath Test</h1>
          <Button variant="ghost" size="icon" onClick={toggleSettings} disabled={isRecording || isProcessing}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        
        {!showSettings && (
          <div className="text-center text-slate-500 px-6">
            Blow into your microphone for 5 seconds to measure your BAC
          </div>
        )}
        
        {showSettings ? (
          <AudioSensorSettings isPremium={isPremium} />
        ) : (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-xl font-bold">Record Your Breath</h2>
                <p className="text-sm text-slate-500 text-center">
                  Press the button below to start recording, then blow into your microphone
                </p>
                
                <div className="w-full h-36 mt-2 mb-4">
                  <AudioWaveVisualizer 
                    isRecording={isRecording}
                    audioStream={audioStream}
                  />
                </div>
                
                <Button 
                  variant={isRecording ? "destructive" : "default"}
                  size="lg"
                  className="rounded-full w-16 h-16 flex items-center justify-center"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </Button>
                
                <div className="text-sm text-slate-500">
                  {isRecording ? 'Recording in progress...' : 'Tap to start breathing test'}
                </div>
                
                {!isPremium && (
                  <div className="w-full mt-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800 font-medium">Upgrade for Enhanced Accuracy</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Our premium version provides up to 20% more accurate BAC readings with advanced processing algorithms.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                        onClick={() => setLocation('/subscription')}
                      >
                        View Premium Features
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        <Button
          variant="outline"
          onClick={handleGoBack}
          disabled={isRecording || isProcessing}
        >
          Back to Home
        </Button>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}