import { Link, useLocation } from 'wouter';

export default function MobileNav() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-[#2D2D2D] py-2 z-10">
      <div className="flex justify-around">
        <Link 
          href="/"
          className={`px-3 py-1 flex flex-col items-center ${isActive('/') ? 'text-primary' : 'text-gray-400'}`}
        >
          <i className="fas fa-home text-lg"></i>
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link 
          href="/mentor"
          className={`px-3 py-1 flex flex-col items-center ${isActive('/mentor') ? 'text-primary' : 'text-gray-400'}`}
        >
          <i className="fas fa-user text-lg"></i>
          <span className="text-xs mt-1">Mentor</span>
        </Link>
        <Link 
          href="/studio"
          className={`px-3 py-1 flex flex-col items-center ${isActive('/studio') ? 'text-primary' : 'text-gray-400'}`}
        >
          <i className="fas fa-music text-lg"></i>
          <span className="text-xs mt-1">Studio</span>
        </Link>
        <Link 
          href="/muse-lab"
          className={`px-3 py-1 flex flex-col items-center ${isActive('/muse-lab') ? 'text-primary' : 'text-gray-400'}`}
        >
          <i className="fas fa-flask text-lg"></i>
          <span className="text-xs mt-1">Lab</span>
        </Link>
        <Link 
          href="/share"
          className={`px-3 py-1 flex flex-col items-center ${isActive('/share') ? 'text-primary' : 'text-gray-400'}`}
        >
          <i className="fas fa-share-alt text-lg"></i>
          <span className="text-xs mt-1">Share</span>
        </Link>
        <Link 
          href="/collab"
          className={`px-3 py-1 flex flex-col items-center ${isActive('/collab') ? 'text-primary' : 'text-gray-400'}`}
        >
          <i className="fas fa-users text-lg"></i>
          <span className="text-xs mt-1">Collab</span>
        </Link>
      </div>
    </div>
  );
}
