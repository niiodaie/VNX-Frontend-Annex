import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Share2, 
  Link as LinkIcon, 
  CheckCircle
} from 'lucide-react';

interface ShareMusicProps {
  trackTitle?: string;
  trackUrl?: string;
  variant?: 'icon' | 'button' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  platforms?: ('twitter' | 'facebook' | 'instagram' | 'linkedin' | 'copy')[];
  className?: string;
}

export default function ShareMusic({
  trackTitle = 'My DarkNotes track',
  trackUrl = window.location.href,
  variant = 'button',
  size = 'md',
  platforms = ['twitter', 'facebook', 'instagram', 'linkedin', 'copy'],
  className = ''
}: ShareMusicProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareText = `Check out my new track "${trackTitle}" on DarkNotes!`;
  
  const handleShare = (platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(trackUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(trackUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(trackUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct sharing URL, typically would open app
        toast({
          title: "Instagram Sharing",
          description: "To share on Instagram, please use the Instagram app directly.",
        });
        return;
      case 'copy':
        navigator.clipboard.writeText(trackUrl).then(() => {
          setCopied(true);
          toast({
            title: "Link Copied!",
            description: "Track link copied to clipboard",
          });
          setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
          toast({
            title: "Copy Failed",
            description: "Failed to copy link to clipboard",
            variant: "destructive"
          });
        });
        return;
      default:
        return;
    }
    
    // Open share URL in a new window
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setIsOpen(false);
    }
  };
  
  const sizeClasses = {
    sm: "h-8 text-xs",
    md: "h-10 text-sm",
    lg: "h-12 text-base"
  };
  
  const getIconComponent = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4 md:h-5 md:w-5" />;
      case 'facebook':
        return <Facebook className="h-4 w-4 md:h-5 md:w-5" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 md:h-5 md:w-5" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4 md:h-5 md:w-5" />;
      case 'copy':
        return copied ? 
          <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" /> : 
          <LinkIcon className="h-4 w-4 md:h-5 md:w-5" />;
      default:
        return <Share2 className="h-4 w-4 md:h-5 md:w-5" />;
    }
  };
  
  const renderPlatformButton = (platform: string) => (
    <Button
      key={platform}
      variant="outline"
      size="sm"
      className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#252525] border-[#333] text-gray-200"
      onClick={() => handleShare(platform)}
    >
      {getIconComponent(platform)}
      <span className="capitalize">{platform === 'copy' ? 'Copy Link' : platform}</span>
    </Button>
  );
  
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {platforms.map(platform => (
          <button
            key={platform}
            onClick={() => handleShare(platform)}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label={`Share on ${platform}`}
          >
            {getIconComponent(platform)}
          </button>
        ))}
      </div>
    );
  }
  
  if (variant === 'icon') {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className={`rounded-full bg-[#1A1A1A] hover:bg-[#252525] border-[#333] ${className}`}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-2 bg-black border border-[#333]" 
          sideOffset={5}
        >
          <div className="flex gap-2">
            {platforms.map(platform => (
              <button
                key={platform}
                onClick={() => handleShare(platform)}
                className="p-2 rounded-full bg-[#1A1A1A] hover:bg-[#252525] text-gray-400 hover:text-white transition-colors"
                aria-label={`Share on ${platform}`}
              >
                {getIconComponent(platform)}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
  
  // Default button variant
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={`bg-[#1A1A1A] hover:bg-[#252525] border-[#333] ${sizeClasses[size]} ${className}`}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-3 bg-black border border-[#333]" 
        sideOffset={5}
      >
        <div className="grid grid-cols-1 gap-2">
          {platforms.map(renderPlatformButton)}
        </div>
      </PopoverContent>
    </Popover>
  );
}