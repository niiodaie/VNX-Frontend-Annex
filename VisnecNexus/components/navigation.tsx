"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { pillars } from "@/config/site";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/98 backdrop-blur-sm shadow-md"
          : "bg-white/95 backdrop-blur-sm"
      } border-b border-slate-200`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <img 
              src="/favicon/favicon.svg" 
              alt="VNX Logo" 
              className="w-10 h-10 group-hover:scale-110 transition-transform"
            />
            <span className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
              VISNEC NEXUS
            </span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
              Digital Innovation Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {pillars.slice(0, 8).map((pillar) => (
              <Link
                key={pillar.id}
                href={pillar.href}
                className="px-3 py-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-all text-sm font-medium"
              >
                {pillar.name}
              </Link>
            ))}
            <div className="relative group">
              <button className="px-3 py-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-all text-sm font-medium">
                More
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {pillars.slice(8).map((pillar) => (
                  <Link
                    key={pillar.id}
                    href={pillar.href}
                    className="block px-4 py-2 text-sm text-slate-600 hover:text-purple-600 hover:bg-purple-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {pillar.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-600 hover:text-purple-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/e-services"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-2">
              {pillars.map((pillar) => (
                <Link
                  key={pillar.id}
                  href={pillar.href}
                  className="px-4 py-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {pillar.name}
                </Link>
              ))}
              <Link
                href="/e-services"
                className="mx-4 mt-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

