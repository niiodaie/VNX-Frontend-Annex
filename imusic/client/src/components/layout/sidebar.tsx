import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

export default function Sidebar() {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navigationItems = [
    { href: '/', icon: 'fa-home', label: 'Home' },
    { href: '/mentor', icon: 'fa-user', label: 'My Mentor' },
    { href: '/studio', icon: 'fa-music', label: 'Studio' },
    { href: '/muse-lab', icon: 'fa-flask', label: 'Music Lab' },
    { href: '/inspiration', icon: 'fa-bolt', label: 'Inspiration' },
    { href: '/collab', icon: 'fa-users', label: 'Collab Zone' },
    { href: '/challenges', icon: 'fa-trophy', label: 'Challenges' },
    { href: '/share', icon: 'fa-share-alt', label: 'Share Music' },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const NavItems = () => (
    <ul className="space-y-2 px-2">
      {navigationItems.map((item) => (
        <li key={item.href}>
          <Link 
            href={item.href}
            className={`flex items-center p-2 rounded-lg ${
              location === item.href
                ? 'text-white bg-primary bg-opacity-20'
                : 'text-gray-400 hover:text-white hover:bg-[#2D2D2D]'
            } group`}
            onClick={isMobile ? closeMobileMenu : undefined}
          >
            <i className={`fas ${item.icon} w-6 h-6 text-center lg:mr-3`}></i>
            <span className="hidden lg:block">{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-full md:w-20 lg:w-64 bg-[#1E1E1E] flex-shrink-0 md:border-r border-[#2D2D2D]">
        {/* Mobile Nav */}
        <div className="block md:hidden bg-[#1E1E1E] py-2 px-4 border-b border-[#2D2D2D]">
          <div className="flex justify-between items-center">
            <div className="text-xl font-['Playfair_Display'] font-semibold text-white">
              <span className="text-primary">Dark</span>Notes
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="text-gray-400 hover:text-white"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
        
        {/* Desktop Sidebar Content */}
        <div className="hidden md:flex md:flex-col h-full">
          <div className="p-4 lg:mb-6">
            <div className="hidden lg:block text-2xl font-['Playfair_Display'] font-semibold mb-4">
              <span className="text-primary">Dark</span>Notes
            </div>
            <div className="block lg:hidden text-center">
              <span className="text-primary text-xl font-bold">DN</span>
            </div>
          </div>
          
          <nav className="flex-1">
            <NavItems />
          </nav>
          
          <div className="p-4">
            <div className="hidden lg:block space-y-2">
              <button 
                className="flex items-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2D2D2D] group w-full text-left"
              >
                <i className="fas fa-cog w-6 h-6 text-center mr-3"></i>
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2D2D2D] group w-full text-left"
              >
                <i className="fas fa-sign-out-alt w-6 h-6 text-center mr-3"></i>
                <span>Logout</span>
              </button>
            </div>
            <div className="block lg:hidden text-center py-2">
              <button className="text-gray-400 hover:text-white px-2 bg-transparent">
                <i className="fas fa-cog"></i>
              </button>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-white px-2 bg-transparent"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Modal */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#1E1E1E] shadow-lg">
            <div className="flex justify-between items-center p-4 border-b border-[#2D2D2D]">
              <div className="text-xl font-['Playfair_Display'] font-semibold text-white">
                <span className="text-primary">Dark</span>Notes
              </div>
              <button 
                onClick={closeMobileMenu} 
                className="text-gray-400 hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <nav className="px-4 py-6">
              <NavItems />
              <div className="border-t border-[#2D2D2D] pt-4 mt-4">
                <button 
                  className="flex items-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2D2D2D] group w-full text-left"
                >
                  <i className="fas fa-cog w-6 h-6 text-center mr-3"></i>
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2D2D2D] group w-full text-left"
                >
                  <i className="fas fa-sign-out-alt w-6 h-6 text-center mr-3"></i>
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
