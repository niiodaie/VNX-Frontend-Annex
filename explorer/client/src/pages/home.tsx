import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/hero-section";
import SearchFilter from "@/components/search-filter";
import DestinationCard from "@/components/destination-card";
import VNXDestinationCard from "@/components/vnx-destination-card";
import RegionSelector from "@/components/region-selector";
import AffiliateSection from "@/components/affiliate-section";
import LanguageSelector from "@/components/language-selector";
import LocationDetector from "@/components/location-detector";
import IntroVideoModal from "@/components/intro-video-modal";
import LiveTravelEvents from "@/components/live-travel-events";
import TravelMoodQuiz from "@/components/travel-mood-quiz";
import TravelChatbot from "@/components/travel-chatbot";
import AnimatedDestinationCard from "@/components/animated-destination-card";
import GamifiedAchievements from "@/components/gamified-achievements";
import UserAccountSystem from "@/components/user-account-system";
import { LoadingSpinner, TypingIndicator } from "@/components/micro-interactions";
import { mockDestinations } from "@/data/destinations";
import vnxDestinations from "@/data/destinations.json";
import { Globe, Facebook, Twitter, Instagram, Youtube, Compass, Map } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { Destination } from "@shared/schema";

type DestinationWithOptionalId = Omit<Destination, 'id'> & { id?: number };

export default function Home() {
  const [filteredDestinations, setFilteredDestinations] = useState<DestinationWithOptionalId[]>(mockDestinations);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number; city?: string; country?: string} | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const handleSearch = async (filters: {
    query: string;
    continent: string;
    type: string;
  }) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = mockDestinations.filter(destination => {
      const matchesQuery = !filters.query || 
        destination.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        destination.location.toLowerCase().includes(filters.query.toLowerCase());
      
      const matchesContinent = !filters.continent || filters.continent === 'all' || destination.continent === filters.continent;
      const matchesType = !filters.type || filters.type === 'all' || destination.type === filters.type;
      
      return matchesQuery && matchesContinent && matchesType;
    });
    
    setFilteredDestinations(filtered);
    setIsLoading(false);
  };

  const handleRegionSelect = (continentId: string) => {
    handleSearch({ query: "", continent: continentId, type: "" });
    
    // Scroll to destinations section
    const destinationsSection = document.getElementById('destinations');
    if (destinationsSection) {
      destinationsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreDestination = (destination: DestinationWithOptionalId) => {
    // Generate VNX ecosystem URLs for seamless integration
    const vnxBaseUrl = 'https://travel-nexus-hub-viusmedia.replit.app';
    const destinationSlug = destination.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Open VNX ecosystem with destination context
    window.open(`${vnxBaseUrl}?destination=${destinationSlug}&source=vnx-explorer`, '_blank');
  };

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    // Implement pagination for destination loading
    const currentCount = filteredDestinations.length;
    const remainingDestinations = mockDestinations.slice(currentCount, currentCount + 6);
    setFilteredDestinations([...filteredDestinations, ...remainingDestinations]);
  };

  const handleLocationDetected = (location: {latitude: number; longitude: number; city?: string; country?: string}) => {
    setUserLocation(location);
    // Auto-filter destinations based on user's region for personalized experience
    if (location.country) {
      const countryLower = location.country.toLowerCase();
      let suggestedContinent = '';
      
      if (countryLower.includes('spain') || countryLower.includes('france') || countryLower.includes('italy') || countryLower.includes('germany')) {
        suggestedContinent = 'europe';
      } else if (countryLower.includes('japan') || countryLower.includes('china') || countryLower.includes('thailand') || countryLower.includes('korea')) {
        suggestedContinent = 'asia';
      } else if (countryLower.includes('usa') || countryLower.includes('canada') || countryLower.includes('mexico')) {
        suggestedContinent = 'north-america';
      }
      
      if (suggestedContinent) {
        handleSearch({ query: '', continent: suggestedContinent, type: '' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-vnx-blue-600 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('title')}</h1>
                <p className="text-xs text-gray-500">{t('subtitle')}</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#vnx-destinations" className="text-gray-600 hover:text-vnx-blue-600 transition-colors">
                {t('vnxEcosystem')}
              </a>
              <a href="#live-events" className="text-gray-600 hover:text-vnx-blue-600 transition-colors">
                Live Events
              </a>
              <a href="#destinations" className="text-gray-600 hover:text-vnx-blue-600 transition-colors">
                {t('destinations')}
              </a>
              <a href="#experiences" className="text-gray-600 hover:text-vnx-blue-600 transition-colors">
                {t('experiences')}
              </a>
              <a href="#regions" className="text-gray-600 hover:text-vnx-blue-600 transition-colors">
                {t('regions')}
              </a>
              <LanguageSelector />
              <UserAccountSystem />
            </div>
            
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-between">
                <span className={`block h-0.5 w-6 bg-gray-600 transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-gray-600 transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-gray-600 transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
              </div>
            </button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="px-4 py-3 space-y-3">
                <a 
                  href="#vnx-destinations" 
                  className="block text-gray-600 hover:text-vnx-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('vnxEcosystem')}
                </a>
                <a 
                  href="#live-events" 
                  className="block text-gray-600 hover:text-vnx-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('liveEvents')}
                </a>
                <a 
                  href="#destinations" 
                  className="block text-gray-600 hover:text-vnx-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('destinations')}
                </a>
                <a 
                  href="#experiences" 
                  className="block text-gray-600 hover:text-vnx-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('experiences')}
                </a>
                <a 
                  href="#regions" 
                  className="block text-gray-600 hover:text-vnx-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('regions')}
                </a>
                <div className="pt-2 border-t border-gray-100">
                  <LanguageSelector />
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <HeroSection onExploreClick={scrollToSearch} />

      {/* Search Filter */}
      <div ref={searchRef}>
        <SearchFilter onSearch={handleSearch} />
      </div>

      {/* Location Detection */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <LocationDetector onLocationDetected={handleLocationDetected} />
        </div>
      </section>

      {/* VNX Ecosystem Destinations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" id="vnx-destinations">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Map className="w-8 h-8 text-vnx-blue-600 mr-3" />
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {t('vnxTravelEcosystem')}
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('vnxDescription')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {vnxDestinations.map((destination, index) => (
              <VNXDestinationCard
                key={destination.slug + index}
                destination={destination}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Live Travel Events */}
      <div id="live-events">
        <LiveTravelEvents />
      </div>

      {/* Travel Mood Quiz */}
      <TravelMoodQuiz />

      {/* Gamified Achievements */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your Travel Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Track your progress and unlock achievements as you explore the world
            </p>
          </div>
          <GamifiedAchievements />
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" id="destinations">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('destinations')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked experiences that showcase the beauty and diversity of our planet
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDestinations.map((destination, index) => (
                <DestinationCard
                  key={destination.name + index}
                  destination={destination}
                  onExplore={handleExploreDestination}
                />
              ))}
            </div>
          )}
          
          {filteredDestinations.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No destinations found</h3>
              <p className="text-gray-500">Try adjusting your search filters to find more destinations.</p>
            </div>
          )}
          
          {filteredDestinations.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                onClick={handleLoadMore}
                variant="outline"
                size="lg"
                className="px-8"
              >
                Load More Destinations
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Discover By Region */}
      <div id="regions">
        <RegionSelector onSelectRegion={handleRegionSelect} />
      </div>

      {/* Affiliate Highlights */}
      <div id="experiences">
        <AffiliateSection />
      </div>

      {/* Travel Chatbot */}
      <TravelChatbot />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-vnx-blue-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">VNX-Explorer</h3>
                  <p className="text-gray-400 text-sm">Discover the World</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Your gateway to discovering the world's most incredible destinations, from natural wonders to cultural treasures.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-vnx-blue-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-vnx-blue-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-vnx-blue-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-vnx-blue-600 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#destinations" className="text-gray-300 hover:text-white transition-colors">Destinations</a></li>
                <li><a href="#experiences" className="text-gray-300 hover:text-white transition-colors">Experiences</a></li>
                <li><a href="#regions" className="text-gray-300 hover:text-white transition-colors">Regions</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Travel Guides</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sitemap</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 VNX-Explorer. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Powered by <span className="text-vnx-blue-400 font-semibold">Visnec Nexus</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
