import React, { useRef, useEffect } from 'react';

interface AudioWaveVisualizerProps {
  isRecording: boolean;
  audioStream?: MediaStream | null;
}

const AudioWaveVisualizer: React.FC<AudioWaveVisualizerProps> = ({
  isRecording,
  audioStream
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  
  useEffect(() => {
    if (!isRecording || !audioStream) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        // We don't actually close the audio context to avoid issues
        // when starting a new recording session
      }
      return;
    }
    
    // Set up audio context and analyser
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const audioContext = audioContextRef.current;
    analyserRef.current = audioContext.createAnalyser();
    analyserRef.current.fftSize = 256;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);
    
    const source = audioContext.createMediaStreamSource(audioStream);
    source.connect(analyserRef.current);
    
    // Draw function
    const draw = () => {
      if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;
      
      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');
      if (!canvasCtx) return;
      
      // Make sure to match the canvas size to its display size
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvasCtx.scale(dpr, dpr);
      
      // Get frequency data
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      // Clear canvas
      canvasCtx.clearRect(0, 0, rect.width, rect.height);
      
      // Background gradient (Night Tech theme)
      const gradient = canvasCtx.createLinearGradient(0, 0, 0, rect.height);
      gradient.addColorStop(0, 'rgba(0, 214, 183, 0.05)'); // breathteal
      gradient.addColorStop(0.5, 'rgba(29, 34, 51, 0.1)'); // midnight
      gradient.addColorStop(1, 'rgba(18, 21, 30, 0.2)'); // carbon
      canvasCtx.fillStyle = gradient;
      canvasCtx.fillRect(0, 0, rect.width, rect.height);
      
      // Draw waveform
      const sliceWidth = rect.width / bufferLength;
      let x = 0;
      
      canvasCtx.beginPath();
      canvasCtx.moveTo(0, rect.height / 2);
      
      // Create a smoothed waveform effect
      const centerY = rect.height / 2;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArrayRef.current[i] / 128.0; // 0 to 2
        const y = v * centerY / 2;
        
        // Draw a sine-like wave but with amplitude based on frequency data
        canvasCtx.lineTo(x, centerY - y);
        
        x += sliceWidth;
      }
      
      canvasCtx.lineTo(rect.width, rect.height / 2);
      
      // Night Tech waveform gradient
      const waveGradient = canvasCtx.createLinearGradient(0, 0, 0, rect.height);
      waveGradient.addColorStop(0, 'rgb(0, 214, 183)'); // breathteal
      waveGradient.addColorStop(1, 'rgb(61, 255, 155)'); // signalmint
      
      canvasCtx.strokeStyle = waveGradient;
      canvasCtx.lineWidth = 2.5;
      canvasCtx.stroke();
      
      // Emphasize peaks for a breath pattern (simulated)
      const breathPattern = simulateBreathPattern(dataArrayRef.current, bufferLength);
      drawBreathEmphasis(canvasCtx, breathPattern, rect.width, rect.height);
      
      // Continue animation
      animationRef.current = requestAnimationFrame(draw);
    };
    
    // Start animation
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, audioStream]);
  
  // Create a realistic breath pattern simulation
  // This could be replaced with actual algorithm to detect breath patterns
  const simulateBreathPattern = (data: Uint8Array, length: number): number[] => {
    const breathData: number[] = [];
    const averageVolume = Array.from(data).reduce((sum, val) => sum + val, 0) / length;
    
    // Use some of the frequency data but make it look more like breath patterns
    for (let i = 0; i < 10; i++) {
      const index = Math.floor(length / 20 * i);
      const value = Math.min(1, (data[index] / 255) * 1.5);
      breathData.push(value * (averageVolume / 128));
    }
    
    return breathData;
  };
  
  // Draw breath-specific visualization elements
  const drawBreathEmphasis = (
    ctx: CanvasRenderingContext2D, 
    pattern: number[], 
    width: number, 
    height: number
  ) => {
    const centerY = height / 2;
    const segmentWidth = width / pattern.length;
    
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    
    // Draw a more breath-like pattern on top
    pattern.forEach((value, index) => {
      const x = segmentWidth * (index + 0.5);
      const y = centerY - (value * height * 0.4);
      
      // Use quadratic curves for smoother appearance
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        const prevX = segmentWidth * (index - 0.5);
        const controlX = (prevX + x) / 2;
        ctx.quadraticCurveTo(controlX, centerY, x, y);
      }
    });
    
    // Finish with a dot at the end for visual effect
    const lastX = segmentWidth * (pattern.length - 0.5);
    const lastY = centerY - (pattern[pattern.length - 1] * height * 0.4);
    
    // Add glow effect to the breath pattern
    ctx.shadowColor = 'rgba(0, 214, 183, 0.6)';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = 'rgb(0, 214, 183)'; // breathteal
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Reset shadow for the dot
    ctx.shadowBlur = 0;
    
    // Draw pulsating dot at the end
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(0, 214, 183)'; // breathteal
    ctx.fill();
    
    // Add a glow ring around the dot
    ctx.beginPath();
    ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 214, 183, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };
  
  return (
    <div className="w-full rounded-lg overflow-hidden border border-breathteal/30 bg-midnight relative shadow-lg shadow-breathteal/5">
      <canvas 
        ref={canvasRef}
        className="w-full h-40"
        style={{ display: 'block' }}
      />
      
      {!isRecording && (
        <div className="absolute inset-0 flex items-center justify-center bg-carbon/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg">
            <div className="w-16 h-1 bg-breathteal/40 rounded-full mb-1"></div>
            <p className="text-sm text-fogwhite font-medium">
              {audioStream ? "Ready to analyze your breath" : "Microphone access required"}
            </p>
            <div className="text-xs text-coolgray mt-1">
              {audioStream ? "Tap the microphone button below to start" : "Please allow microphone access"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioWaveVisualizer;