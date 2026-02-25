import React from 'react';
import { Button } from '@/components/ui/button';
import { FaTwitter, FaFacebook, FaInstagram, FaTiktok, FaShareAlt } from 'react-icons/fa';
import { toast } from '@/hooks/use-toast';

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  vertical?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ShareButtons({
  url = window.location.href,
  title = 'Check out DarkNotes',
  description = 'Where your rawest thoughts become your realest sound',
  vertical = false,
  size = 'md',
  showLabel = false
}: ShareButtonsProps) {
  
  // Size maps
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base', 
    lg: 'h-12 w-12 text-lg'
  };
  
  // Handle social media shares
  const handleShare = (platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(description)}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct sharing API, show a toast instead
        toast({
          title: 'Copy this link to share on Instagram',
          description: url,
        });
        return;
      case 'tiktok':
        // TikTok doesn't have a direct sharing API, show a toast instead
        toast({
          title: 'Copy this link to share on TikTok',
          description: url,
        });
        return;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
          toast({
            title: 'Link copied to clipboard',
            description: 'You can now paste the link anywhere',
          });
        }).catch(() => {
          toast({
            title: 'Failed to copy link',
            description: 'Please try again or copy manually',
            variant: 'destructive',
          });
        });
        return;
    }
    
    // Open share URL in new window
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };
  
  // Button renderer
  const renderButton = (
    icon: React.ReactNode, 
    platform: string, 
    label: string, 
    color: string
  ) => (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleShare(platform)}
      className={`${sizeClasses[size]} ${color} hover:opacity-80 transition-all rounded-full flex items-center justify-center`}
      aria-label={`Share on ${label}`}
      title={`Share on ${label}`}
    >
      {icon}
      {showLabel && (
        <span className={`ml-2 ${vertical ? 'hidden' : 'hidden sm:inline'}`}>{label}</span>
      )}
    </Button>
  );
  
  return (
    <div className={`flex ${vertical ? 'flex-col space-y-2' : 'flex-row space-x-2'} items-center`}>
      {renderButton(
        <FaTwitter />,
        'twitter',
        'Twitter',
        'bg-[#1DA1F2] text-white'
      )}
      
      {renderButton(
        <FaFacebook />,
        'facebook',
        'Facebook',
        'bg-[#4267B2] text-white'
      )}
      
      {renderButton(
        <FaInstagram />,
        'instagram',
        'Instagram',
        'bg-gradient-to-tr from-[#fd5949] via-[#d6249f] to-[#285AEB] text-white'
      )}
      
      {renderButton(
        <FaTiktok />,
        'tiktok',
        'TikTok',
        'bg-black text-white hover:bg-gray-900'
      )}
      
      {renderButton(
        <FaShareAlt />,
        'copy',
        'Copy Link',
        'bg-gray-700 text-white'
      )}
    </div>
  );
}