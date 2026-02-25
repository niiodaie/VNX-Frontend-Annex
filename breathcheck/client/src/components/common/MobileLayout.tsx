import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Home, ShieldCheck } from "lucide-react";

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
}

const MobileLayout = ({ children, title, showBack = true }: MobileLayoutProps) => {
  const [location, navigate] = useLocation();
  
  const handleBack = () => {
    if (location === "/scan" || location === "/subscription") {
      navigate("/");
    } else if (location.startsWith("/result")) {
      navigate("/scan");
    } else {
      window.history.back();
    }
  };
  
  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-md min-h-[100dvh] flex flex-col bg-carbon border-x border-midnight/50">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b border-midnight bg-midnight">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleBack}
              className="mr-1 text-breathteal hover:text-breathteal/80 hover:bg-midnight/60"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-breathteal" />
            <h1 className="font-medium text-fogwhite">{title}</h1>
          </div>
        </div>
        
        {/* Show Home icon if not on home screen */}
        {location !== "/" && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleHome}
            className="text-breathteal hover:text-breathteal/80 hover:bg-midnight/60"
          >
            <Home className="h-5 w-5" />
          </Button>
        )}
      </header>
      
      {/* Content */}
      <main className="flex-1 overflow-auto pb-safe">
        {children}
      </main>
      
      {/* Safe area padding for mobile */}
      <div className="h-4 md:h-0"></div>
    </div>
  );
};

export default MobileLayout;
