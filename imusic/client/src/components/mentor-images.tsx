// Define mentor image paths - note these are not imports but URL paths
const kendrickFlow = '/assets/kendrick-flow-card.png';
const novaRae = '/assets/nova-rae.png';
const metroDeep = '/assets/metro-deep.png';
const blaze420 = '/assets/blaze420.png';
const ivyMuse = '/assets/ivy-muse.png';
const yemiSound = '/assets/yemi-sound.png';

// Export a mapping of mentor name to image
export const mentorImages: Record<string, string> = {
  'Kendrick Flow': kendrickFlow,
  'Nova Rae': novaRae,
  'MetroDeep': metroDeep,
  'Blaze420': blaze420,
  'IvyMuse': ivyMuse,
  'Yemi Sound': yemiSound,
};

// Helper function to get mentor image by name
export function getMentorImage(mentorName: string): string {
  return mentorImages[mentorName] || '';
}