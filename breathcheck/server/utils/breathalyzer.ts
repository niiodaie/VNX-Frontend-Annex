import { BreathResult } from '@shared/schema';

/**
 * Evaluates a breath sample audio to determine alcohol content
 * 
 * Note: This is a simulation function that would normally process audio
 * with machine learning to detect alcohol levels. For this demo, it uses
 * pseudorandom data to simulate results.
 * 
 * @param audioSample Base64 encoded audio data from the breath test
 * @returns Analysis results including BAC and safety level
 */
export async function evaluateBreathSample(audioSample: string): Promise<BreathResult> {
  // In a real app, this would analyze the audio using ML to determine BAC
  // For this demo, we'll use a hash of the audio sample to generate a consistent
  // but seemingly random BAC value for the same input

  const sampleHash = getSampleHash(audioSample);
  
  // Generate a BAC between 0.00 and 0.20 using the hash
  // 0.08 is typically the legal limit in many places
  const bac = (sampleHash % 20) / 100;
  
  // Determine the level
  let level: 'safe' | 'warning' | 'danger';
  let message: string;
  
  if (bac < 0.03) {
    level = 'safe';
    message = 'Clear: You are good to go. Drive safely!';
  } else if (bac < 0.08) {
    level = 'warning';
    message = `Caution: You are below the legal limit, but alcohol is affecting you. Consider waiting before driving.`;
  } else {
    level = 'danger';
    message = `Warning: Do not drive. Your estimated BAC is above the legal limit.`;
  }
  
  return {
    bac: bac.toFixed(2),
    level,
    message
  };
}

/**
 * Creates a simple hash value from a string
 * This is used to create deterministic but seemingly random results
 * based on the input audio sample
 */
function getSampleHash(sample: string): number {
  let hash = 0;
  
  // Use only the first 100 chars max for performance
  const str = sample.substring(0, 100);
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  
  // Ensure positive value
  return Math.abs(hash);
}