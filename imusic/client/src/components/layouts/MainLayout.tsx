import React from 'react';
import { Link } from 'wouter';
import { Music, UserCircle, MessageSquare, Zap, Database, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { name: 'Dashboard', href: '/', icon: <Music className="w-5 h-5 mr-2" /> },
    { name: 'Explore', href: '/explore', icon: <Zap className="w-5 h-5 mr-2" /> },
    { name: 'Mentors', href: '/mentors', icon: <UserCircle className="w-5 h-5 mr-2" /> },
    { name: 'Messages', href: '/messages', icon: <MessageSquare className="w-5 h-5 mr-2" /> },
    { name: 'Artist Database', href: '/artist-database', icon: <Database className="w-5 h-5 mr-2" /> },
    { name: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Link href="/">
              <a className="flex items-center">
                <span className="text-2xl font-bold text-primary">DarkNotes</span>
              </a>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <a className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      {item.icon}
                      {item.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {user && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center px-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.subscriptionStatus === 'pro' ? 'Pro Member' : 'Free Plan'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;