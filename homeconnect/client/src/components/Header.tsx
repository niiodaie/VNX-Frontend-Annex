import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`bg-white ${scrolled ? 'shadow-sm' : ''} fixed w-full top-0 z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold font-heading">
            <span className="text-secondary">Home</span>
            <span className="text-primary">Pros</span>
            <span className="text-accent">Africa</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu} 
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="#services">Services</NavLink>
          <NavLink href="#professionals">Trusted Pros</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#about">About Us</NavLink>
          <NavLink href="#contact">Contact</NavLink>
          <NavLink href="/for-business">For Business</NavLink>
          <Link href="/sign-in">
            <Button className="ml-4 bg-primary text-white hover:bg-primary/90 rounded-full px-6">Sign In</Button>
          </Link>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden bg-white w-full absolute transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
          <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
          <MobileNavLink href="#services" onClick={() => setMobileMenuOpen(false)}>Services</MobileNavLink>
          <MobileNavLink href="#professionals" onClick={() => setMobileMenuOpen(false)}>Trusted Pros</MobileNavLink>
          <MobileNavLink href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</MobileNavLink>
          <MobileNavLink href="#about" onClick={() => setMobileMenuOpen(false)}>About Us</MobileNavLink>
          <MobileNavLink href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</MobileNavLink>
          <MobileNavLink href="/for-business" onClick={() => setMobileMenuOpen(false)}>For Business</MobileNavLink>
          <Link href="/sign-in">
            <Button className="w-full bg-primary text-white hover:bg-primary/90 rounded-full">Sign In</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <a className="font-semibold text-dark hover:text-primary transition-colors">{children}</a>
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <a className="font-semibold text-dark hover:text-primary transition-colors py-2 border-b border-gray-100" onClick={onClick}>
        {children}
      </a>
    </Link>
  );
}
