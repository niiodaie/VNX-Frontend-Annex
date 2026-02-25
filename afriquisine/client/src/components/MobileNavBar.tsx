import React from 'react';
import { Link, useLocation } from 'wouter';

const MobileNavBar: React.FC = () => {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around items-center h-16">
        {/* Cuisines (Home) */}
        <Link href="/">
          <div className={`flex flex-col items-center cursor-pointer ${location === '/' ? 'text-primary font-medium' : 'text-gray-500'}`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-6 h-6"
            >
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
            <span className="text-xs mt-1">Cuisines</span>
          </div>
        </Link>



        {/* Find Restaurants */}
        <Link href="/find-restaurants">
          <div className={`flex flex-col items-center cursor-pointer ${
            location === '/find-restaurants' || 
            location === '/restaurants' || 
            location === '/directory' ? 'text-primary font-medium' : 'text-gray-500'
          }`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-6 h-6"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-xs mt-1">Find Restaurants</span>
          </div>
        </Link>

        {/* Food Gallery */}
        <Link href="/cuisine-gallery">
          <div className={`flex flex-col items-center cursor-pointer ${location === '/cuisine-gallery' ? 'text-primary font-medium' : 'text-gray-500'}`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-6 h-6"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <span className="text-xs mt-1">Gallery</span>
          </div>
        </Link>

        {/* Profile */}
        <Link href="/profile">
          <div className={`flex flex-col items-center cursor-pointer ${location === '/profile' ? 'text-primary font-medium' : 'text-gray-500'}`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-6 h-6"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavBar;