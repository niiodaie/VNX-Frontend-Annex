import { useState } from "react";
import { Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Globe className="text-travel-blue text-2xl mr-3" />
            <span className="text-xl font-bold text-gray-900">VNX-GMP</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection("wonders")}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Natural Wonders
            </button>
            <button 
              onClick={() => scrollToSection("landmarks")}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Historical Sites
            </button>
            <button 
              onClick={() => scrollToSection("events")}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Cultural Events
            </button>
            <button 
              onClick={() => scrollToSection("food")}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Food & Markets
            </button>
            <Button 
              onClick={() => scrollToSection("booking")}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Book Now
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => scrollToSection("wonders")}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                Natural Wonders
              </button>
              <button 
                onClick={() => scrollToSection("landmarks")}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                Historical Sites
              </button>
              <button 
                onClick={() => scrollToSection("events")}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                Cultural Events
              </button>
              <button 
                onClick={() => scrollToSection("food")}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
              >
                Food & Markets
              </button>
              <Button 
                onClick={() => scrollToSection("booking")}
                className="block mx-3 mt-2 bg-blue-600 text-white hover:bg-blue-700 w-auto"
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
