import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Ad {
  id: number;
  title: string;
  url: string;
}

interface AdBannerProps {
  position?: 'top' | 'bottom';
  isPremium?: boolean;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  position = 'bottom',
  isPremium = false 
}) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  
  // Skip ads for premium users
  if (isPremium) return null;
  
  useEffect(() => {
    // Fetch ads from backend API
    const fetchAds = async () => {
      try {
        const response = await fetch('/api/promotions');
        if (!response.ok) throw new Error('Failed to fetch promotions');
        const data = await response.json();
        setAds(data);
      } catch (error) {
        console.error('Error fetching promotions:', error);
        // Fallback to defaults if API fails
        setAds([
          { id: 1, title: '25% Off Ride with Uber', url: 'https://uber.com/referral/breathecheck' },
          { id: 2, title: 'Top Rated Breathalyzer', url: 'https://amzn.to/example-link' }
        ]);
      }
    };
    
    fetchAds();
    
    // Rotate ads every 10 seconds
    const intervalId = setInterval(() => {
      setCurrentAdIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % ads.length;
        return nextIndex;
      });
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [ads.length]);
  
  if (dismissed || ads.length === 0) return null;
  
  const currentAd = ads[currentAdIndex];
  
  return (
    <div className={`w-full px-4 py-2 ${position === 'top' ? 'mt-2' : 'mb-2'}`}>
      <Card className="overflow-hidden border-dashed border-breathteal/30 bg-midnight">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="bg-breathteal/20 px-2 py-0.5 rounded text-xs text-breathteal font-semibold">Ad</span>
              <p className="text-sm font-medium text-fogwhite">{currentAd.title}</p>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-breathteal hover:text-breathteal/80 hover:bg-midnight/60"
                onClick={() => window.open(currentAd.url, '_blank')}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-6 w-6 text-coolgray hover:text-fogwhite hover:bg-midnight/60"
                onClick={() => setDismissed(true)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdBanner;