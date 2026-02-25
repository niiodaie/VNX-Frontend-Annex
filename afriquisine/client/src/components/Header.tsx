import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const { user, isAuthenticated, isGuest, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    setLocation('/auth');
  };

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  const handleProfile = () => {
    setLocation('/profile');
  };

  // Get the first letters of the user's name for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="bg-primary text-white sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <span className="text-3xl font-bold text-white tracking-tight">AfriCuisine</span>
              </div>
            </Link>
          </div>

          {/* Navigation Menu - Desktop */}
          <nav className="hidden md:flex space-x-8">
            {/* Ordered by attractiveness and user importance */}
            <Link href="/find-restaurants">
              <span className="text-white hover:text-yellow-200 font-medium cursor-pointer">Find Restaurants</span>
            </Link>
            <Link href="/">
              <span className="text-white hover:text-yellow-200 font-medium cursor-pointer">Recipes</span>
            </Link>
            <Link href="/cuisine-gallery">
              <span className="text-white hover:text-yellow-200 font-medium cursor-pointer">Food Gallery</span>
            </Link>
            <Link href="/cultural-insights">
              <span className="text-white hover:text-yellow-200 font-medium cursor-pointer">Cultural Insights</span>
            </Link>
            <Link href="/about">
              <span className="text-white hover:text-yellow-200 font-medium cursor-pointer">About</span>
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isGuest && (
                  <div className="bg-yellow-400 text-xs text-primary font-medium px-2 py-1 rounded-full mr-1">
                    Guest
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 focus:outline-none">
                      <Avatar className="h-9 w-9 border-2 border-white">
                        <AvatarImage src="" alt={user?.fullName || 'User'} />
                        <AvatarFallback className="bg-yellow-400 text-primary">
                          {user?.fullName ? getInitials(user.fullName) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:block font-medium truncate max-w-[150px]">
                        {user?.fullName || 'User'}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfile}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleProfile}>
                      My Reservations
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleProfile}>
                      Favorites
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                className="hidden md:block bg-white text-primary hover:bg-yellow-100"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;