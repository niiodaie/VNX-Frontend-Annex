import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'en', flag: '🇺🇸', name: 'EN' },
    { code: 'es', flag: '🇪🇸', name: 'ES' },
    { code: 'fr', flag: '🇫🇷', name: 'FR' },
    { code: 'de', flag: '🇩🇪', name: 'DE' },
    { code: 'ja', flag: '🇯🇵', name: 'JP' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-chart-line text-white text-sm"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VNX-SearchTrends
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI-Powered Trend Tracker</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-sm bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              {isDarkMode ? (
                <i className="fas fa-sun text-yellow-400"></i>
              ) : (
                <i className="fas fa-moon text-gray-600"></i>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
              <i className="fas fa-bars text-gray-600 dark:text-gray-300"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
