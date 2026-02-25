// This file contains functions related to the AI instructors

// Function to get the appropriate video URL for an instructor based on the course, lesson, and language
export function getInstructorVideoUrl(
  instructorId: number,
  courseId: number,
  lessonId: number,
  language: string = 'en'
): string {
  // In a real implementation, this would likely fetch from a media server or generate dynamically
  // For now, we'll return placeholder URLs
  return `https://example.com/instructor-videos/${instructorId}/${courseId}/${lessonId}/${language}`;
}

// Types of instructor appearances
export const instructorAppearances = [
  {
    id: 'professional-female-1',
    name: 'Professional Female 1',
    previewUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    gender: 'female',
  },
  {
    id: 'professional-male-1',
    name: 'Professional Male 1',
    previewUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
    gender: 'male',
  },
  {
    id: 'professional-female-2',
    name: 'Professional Female 2',
    previewUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    gender: 'female',
  },
  {
    id: 'professional-male-2',
    name: 'Professional Male 2',
    previewUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    gender: 'male',
  },
];

// Available instructor voices
export const instructorVoices = [
  {
    id: 'en-US-Neural2-F',
    name: 'English - Female (US)',
    language: 'en',
    gender: 'female',
  },
  {
    id: 'en-US-Neural2-D',
    name: 'English - Male (US)',
    language: 'en',
    gender: 'male',
  },
  {
    id: 'en-GB-Neural2-B',
    name: 'English - Female (UK)',
    language: 'en',
    gender: 'female',
  },
  {
    id: 'es-ES-Neural2-A',
    name: 'Spanish - Female',
    language: 'es',
    gender: 'female',
  },
  {
    id: 'es-ES-Neural2-C',
    name: 'Spanish - Male',
    language: 'es',
    gender: 'male',
  },
];

// Teaching styles for instructors
export const teachingStyles = [
  {
    id: 'detailed',
    name: 'Detailed and Thorough',
    description: 'Provides in-depth explanations with many examples',
  },
  {
    id: 'concise',
    name: 'Concise and Clear',
    description: 'Gets straight to the point with clear explanations',
  },
  {
    id: 'interactive',
    name: 'Interactive and Engaging',
    description: 'Asks questions and engages students throughout the lesson',
  },
  {
    id: 'visual',
    name: 'Visual and Demonstrative',
    description: 'Uses many visual aids and demonstrations',
  },
];

// Generate a custom instructor configuration
export function generateCustomInstructor(
  appearance: string,
  voice: string,
  teachingStyle: string,
  specialties: number[],
  language: string = 'en',
  name: string = 'Custom Instructor'
): any {
  return {
    name,
    appearance,
    voice,
    teachingStyle,
    subjectSpecialties: specialties,
    language,
    isCustomized: true,
    customSettings: {
      teachingStyle,
      preferredExamples: true,
      interactivityLevel: 'high',
    }
  };
}
