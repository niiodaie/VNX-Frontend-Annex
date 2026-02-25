import React, { ReactNode } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Database, Home, LogOut, Music, Settings, Users } from 'lucide-react';

interface SimplifiedLayoutProps {
  children: ReactNode;
  title: string;
}

const SimplifiedLayout: React.FC<SimplifiedLayoutProps> = ({ children, title }) => {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { name: 'Home', href: '/', icon: <Home size={20} className="mr-2" /> },
    { name: 'Dashboard', href: '/home', icon: <Music size={20} className="mr-2" /> },
    { name: 'Mentors', href: '/mentor', icon: <Users size={20} className="mr-2" /> },
    { name: 'Artist Database', href: '/artist-database', icon: <Database size={20} className="mr-2" /> },
    { name: 'Settings', href: '/settings', icon: <Settings size={20} className="mr-2" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Link href="/">
              <span className="text-2xl font-bold text-primary cursor-pointer">DarkNotes</span>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <span className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      {item.icon}
                      {item.name}
                    </span>
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
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
};

export default SimplifiedLayout;