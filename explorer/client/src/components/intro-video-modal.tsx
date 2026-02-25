import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function IntroVideoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
          <Play className="w-4 h-4 mr-2" />
          {t('introVideo')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {t('howItWorks')}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
            title="VNX-Explorer Introduction"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">VNX-Explorer Features:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Discover destinations worldwide with integrated travel tools</li>
            <li>• Track flights and manage your travel footprint</li>
            <li>• Find local events and experiences</li>
            <li>• Shop for travel gear with affiliate partners</li>
            <li>• Multi-language support for global accessibility</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}