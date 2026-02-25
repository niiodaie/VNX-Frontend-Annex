import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioRecorderProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: (audioData: string) => void;
}

const AudioRecorder = ({ isRecording, onStart, onStop }: AudioRecorderProps) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const { toast } = useToast();
  
  // Setup and cleanup the media recorder
  useEffect(() => {
    let chunks: BlobPart[] = [];
    
    // If we should be recording, start the recorder
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          
          mediaRecorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunks.push(e.data);
            }
          };
          
          mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/wav' });
            chunks = [];
            
            // Convert blob to base64 string for transmission
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              const base64data = reader.result as string;
              // Remove the prefix (e.g., "data:audio/wav;base64,")
              const audioData = base64data.split(',')[1];
              onStop(audioData);
            };
            
            // Close the stream
            stream.getTracks().forEach(track => track.stop());
          };
          
          mediaRecorderRef.current.start();
          
          // Auto-stop after 5 seconds
          setTimeout(() => {
            if (mediaRecorderRef.current?.state === "recording") {
              mediaRecorderRef.current?.stop();
            }
          }, 5000);
        })
        .catch(err => {
          console.error("Error accessing microphone:", err);
          setPermissionDenied(true);
          
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to record breath samples.",
            variant: "destructive",
          });
          
          // Reset the recording state
          onStop("");
        });
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      // If we should not be recording but we are, stop the recorder
      mediaRecorderRef.current.stop();
    }
    
    // Cleanup function to stop recording if component unmounts
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording, onStop, toast]);
  
  const handleStartRecording = () => {
    if (permissionDenied) {
      toast({
        title: "Microphone Access Required",
        description: "Please reset permissions and allow microphone access.",
        variant: "destructive",
      });
      return;
    }
    
    onStart();
  };
  
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <Button
      variant={isRecording ? "destructive" : "secondary"}
      size="lg"
      className="w-full"
      onClick={isRecording ? handleStopRecording : handleStartRecording}
    >
      {isRecording ? (
        <>
          <Square className="mr-2 h-5 w-5" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="mr-2 h-5 w-5" />
          Start Breath Test
        </>
      )}
    </Button>
  );
};

export default AudioRecorder;
