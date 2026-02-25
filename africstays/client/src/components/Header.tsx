import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Logo, MenuIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md transition-transform duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <Logo className="mr-2 text-primary text-xl" />
            <h1 className="text-xl font-bold font-heading text-primary">ExploreAfrica</h1>
          </div>
        </Link>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-neutral-dark" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <MenuIcon className="text-xl" />
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className={`font-medium hover:text-primary ${location === "/" ? "text-primary" : ""}`}>Home</a>
          </Link>
          <Link href="/explore">
            <a className={`font-medium hover:text-primary ${location === "/explore" ? "text-primary" : ""}`}>Explore</a>
          </Link>
          <a href="#" className="font-medium hover:text-primary">Host Your Space</a>
          <a href="#" className="font-medium hover:text-primary">Trips</a>
          <a href="#" className="font-medium hover:text-primary">Community</a>
          <Button className="ml-4 px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition">
            Sign In
          </Button>
        </nav>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white w-full shadow-md">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <Link href="/">
              <a className="font-medium hover:text-primary py-2 border-b border-gray-100">Home</a>
            </Link>
            <Link href="/explore">
              <a className="font-medium hover:text-primary py-2 border-b border-gray-100">Explore</a>
            </Link>
            <a href="#" className="font-medium hover:text-primary py-2 border-b border-gray-100">Host Your Space</a>
            <a href="#" className="font-medium hover:text-primary py-2 border-b border-gray-100">Trips</a>
            <a href="#" className="font-medium hover:text-primary py-2 border-b border-gray-100">Community</a>
            <Button className="inline-block px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition text-center">
              Sign In
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
