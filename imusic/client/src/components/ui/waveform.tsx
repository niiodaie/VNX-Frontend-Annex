import React, { useEffect, useRef } from 'react';

interface WaveformProps {
  isAnimated?: boolean;
  barCount?: number;
  className?: string;
  barColor?: string;
  activeBarColor?: string;
}

export default function Waveform({
  isAnimated = false,
  barCount = 40,
  className = '',
  barColor = 'rgba(139, 92, 246, 0.5)',
  activeBarColor = 'rgb(139, 92, 246)'
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  
  // Generate random heights for waveform bars
  function generateHeights(count: number): number[] {
    return Array.from({ length: count }, () => {
      return 0.1 + Math.random() * 0.8; // Between 10% and 90% height
    });
  }
  
  // Pre-generate heights outside of render
  const heightsRef = useRef<number[]>(generateHeights(barCount));
  
  // Draw the waveform on canvas
  function drawWaveform(ctx: CanvasContext, time: number) {
    if (!ctx) return;
    
    const canvas = ctx.canvas;
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const barGap = 2; // Gap between bars
    const barWidth = (width / heightsRef.current.length) - barGap;
    
    for (let i = 0; i < heightsRef.current.length; i++) {
      const x = i * (barWidth + barGap);
      const barHeight = heightsRef.current[i] * height;
      
      // Determine y position (centered vertically)
      const y = (height - barHeight) / 2;
      
      if (isAnimated) {
        // Create a wave effect
        const amplitude = 0.2; // How much the bars move
        const frequency = 0.002; // Speed of the wave
        const phase = i * 0.2; // Offset each bar in the wave
        
        // Calculate dynamic height
        const sineWave = Math.sin(time * frequency + phase) * amplitude;
        let dynamicHeight = barHeight * (1 + sineWave);
        dynamicHeight = Math.max(dynamicHeight, height * 0.05); // Ensure minimum height
        
        // Determine y position with the new height (centered vertically)
        const dynamicY = (height - dynamicHeight) / 2;
        
        // Draw bar with dynamic color
        const normalizedIndex = i / heightsRef.current.length;
        const colorFactor = 0.5 + (Math.sin(time * frequency * 2 + normalizedIndex * Math.PI) + 1) / 4;
        
        ctx.fillStyle = normalizedIndex < colorFactor ? activeBarColor : barColor;
        ctx.fillRect(x, dynamicY, barWidth, dynamicHeight);
      } else {
        // Draw static bar
        ctx.fillStyle = barColor;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    }
  }
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Initial render
    drawWaveform(ctx, 0);
    
    // Animation loop
    let startTime: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      timeRef.current = timestamp - startTime;
      
      drawWaveform(ctx, timeRef.current);
      
      if (isAnimated) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    if (isAnimated) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      drawWaveform(ctx, timeRef.current);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isAnimated, barColor, activeBarColor]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`w-full h-full ${className}`}
    />
  );
}

// Define canvas context type
type CanvasContext = CanvasRenderingContext2D;