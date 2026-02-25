import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Component to display or generate the landing page image
const LandingImage = () => {
  const [imagePath, setImagePath] = useState('/assets/landing-page-image.png');
  const [isLoading, setIsLoading] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const { toast } = useToast();

  const generateImage = async () => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/generate-landing-image');
      const data = await response.json();
      
      if (data.success) {
        // Add a timestamp to force reload of image
        setImagePath(`${data.path}?t=${Date.now()}`);
        setUseFallback(false);
        toast({
          title: "Image generated successfully",
          description: "Your new landing page image is ready!",
        });
      } else {
        // If OpenAI API fails, use fallback
        setUseFallback(true);
        toast({
          title: "Using provided design",
          description: "OpenAI limit reached. Using your custom design mockup instead.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setUseFallback(true);
      toast({
        title: "Using provided design",
        description: "OpenAI not available. Using your custom design mockup.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // SVG backup if the default mockup image fails to load
  const FallbackSVG = () => (
    <div className="w-full aspect-[9/16] bg-gray-900 rounded-lg shadow-xl overflow-hidden relative">
      {/* Dark background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black to-[#1a0b29]"></div>
      
      {/* Purple glow effects */}
      <div className="absolute left-1/4 top-1/2 w-32 h-32 bg-purple-700/20 rounded-full blur-3xl"></div>
      <div className="absolute right-1/3 bottom-1/4 w-40 h-40 bg-purple-900/30 rounded-full blur-3xl"></div>
      
      {/* Logo and header */}
      <div className="absolute top-8 left-0 w-full px-8">
        <div className="text-4xl font-serif text-purple-300 font-bold tracking-wider">DarkNotes</div>
        <div className="flex justify-between mt-4">
          <span className="text-gray-400 text-sm">EXPLORE</span>
          <span className="text-gray-400 text-sm">MY JOURNEY</span>
          <span className="text-gray-400 text-sm">EVOLVE</span>
        </div>
        <div className="h-px w-full bg-gray-800 mt-2"></div>
      </div>
      
      {/* Mentor section */}
      <div className="absolute top-32 left-0 w-full px-8 flex justify-between items-center">
        <div className="h-40 w-40 bg-gray-900 rounded-full relative overflow-hidden">
          <div className="absolute bottom-0 left-5 w-30 h-40 bg-black rounded-t-full"></div>
        </div>
        <div className="text-right">
          <div className="text-gray-400 text-sm">Your mentor</div>
          <div className="text-amber-100 text-3xl mt-2 font-serif">KENDRICK</div>
          <button className="mt-4 bg-gray-800 text-white px-4 py-1 rounded-full text-sm">Change</button>
        </div>
      </div>
      
      {/* Track progress */}
      <div className="absolute top-80 left-0 w-full px-8">
        <div className="text-purple-300 text-sm mb-2">Your track in progress</div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-white mb-2">Write lyrics</div>
          <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-purple-500 rounded-full"></div>
          </div>
          <button className="mt-4 bg-gray-700 text-white px-6 py-2 rounded-full text-sm w-full">
            Get feedback
          </button>
        </div>
      </div>
      
      {/* Inspiration section */}
      <div className="absolute bottom-8 left-0 w-full px-8">
        <div className="text-purple-300 text-sm mb-4">Inspiration for you</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-800 rounded-lg p-2 aspect-square"></div>
          <div className="bg-gray-800 rounded-lg p-2 aspect-square"></div>
          <div className="bg-gray-800 rounded-lg p-2 aspect-square"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Always try to use the provided mockup image first */}
      <div className="rounded-lg overflow-hidden shadow-xl">
        <img 
          src={imagePath} 
          alt="DarkNotes UI" 
          className="w-full object-cover h-auto"
          onError={(e) => {
            // If the mockup image fails to load, use fallback SVG
            setUseFallback(true);
          }}
          style={{ display: useFallback ? 'none' : 'block' }}
        />
        {useFallback && <FallbackSVG />}
      </div>
      
      <div className="mt-4 text-center">
        <Button
          onClick={generateImage}
          disabled={isLoading}
          variant="outline"
          className="text-sm"
        >
          {isLoading ? "Generating AI Image..." : "Try AI Image Generation"}
        </Button>
      </div>
    </div>
  );
};

export default LandingImage;