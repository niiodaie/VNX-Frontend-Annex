import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import IntroVideoModal from "@/components/intro-video-modal";
import { useTranslation } from "@/hooks/useTranslation";

interface HeroSectionProps {
  onExploreClick: () => void;
}

export default function HeroSection({ onExploreClick }: HeroSectionProps) {
  const { t } = useTranslation();
  
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background with world map pattern */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-vnx-blue-900/80 to-vnx-blue-600/70" />
      
      {/* Floating decoration elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full animate-pulse hidden lg:block" />
      <div className="absolute bottom-32 right-16 w-12 h-12 bg-amber-400/20 rounded-full animate-pulse hidden lg:block" />
      <div className="absolute top-1/3 right-20 w-8 h-8 bg-emerald-400/30 rounded-full animate-pulse hidden lg:block" />
      
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
          {t('heroTitle')}
          <span className="text-amber-400 block mt-2">{t('heroSubtitle')}</span>
        </h1>
        <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
          {t('heroDescription')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            onClick={onExploreClick}
          >
            <Compass className="w-5 h-5 mr-2" />
            {t('exploreNow')}
          </Button>
          <IntroVideoModal />
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
