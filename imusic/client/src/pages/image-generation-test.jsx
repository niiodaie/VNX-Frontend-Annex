import React from 'react';
import LandingImage from '@/components/ui/landing-image';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function ImageGenerationTestPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-center text-purple-300 mb-6">
          DarkNotes Image Generation
        </h1>
        
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
          This page demonstrates the image generation capability for the DarkNotes platform.
          We're using your provided design mockup as the primary visual, with an option to
          try AI-powered image generation when available.
        </p>
        
        <div className="max-w-2xl mx-auto">
          <LandingImage />
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">
            The image above will be used on the landing page to showcase the DarkNotes interface.
          </p>
          
          <div className="flex justify-center gap-4 mt-8">
            <Link href="/">
              <Button variant="default" className="bg-purple-700 hover:bg-purple-800">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}