import { useState } from "react";
import { Button } from '@/components/ui/button'
import { Menu, Plus, User, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from 'wouter'
import { ReminderBar } from "./ReminderBar";
import { Sidebar } from "./Sidebar";
import { AIHelper } from "./AIHelper";
import { NotificationCenter } from "./NotificationCenter";
import { GlobalSearch } from "./GlobalSearch";
import { FloatingAIButton } from "./FloatingAIButton";
import { LanguageSwitcher } from './LanguageSwitcher'
import UserMenu from './UserMenu'
import { Footer } from './Footer'
import { useTranslation } from 'react-i18next'
import { useAuth } from './AuthProvider'

interface LayoutProps {
  children: React.ReactNode;
  currentProject?: any;
}

export function Layout({ children, currentProject }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [aiHelperOpen, setAiHelperOpen] = useState(false)
  const { t } = useTranslation()
  
  // Get user from auth context
  const { user, signOut } = useAuth()
  
  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <ReminderBar />
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer">
                Nexus Tracker
              </h1>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            {user && <GlobalSearch />}
            <LanguageSwitcher />
            
            {user && (
              <>
                <NotificationCenter />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiHelperOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('aiHelper')}</span>
                </Button>
              </>
            )}
            
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        {user && (
          <div className="hidden md:block">
            <Sidebar />
          </div>
        )}

        {/* Mobile Sidebar */}
        {sidebarOpen && user && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full">
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>

        {/* AI Helper Sidebar */}
        {aiHelperOpen && user && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setAiHelperOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-96 max-w-full">
              <AIHelper currentProject={currentProject} onClose={() => setAiHelperOpen(false)} />
            </div>
          </div>
        )}
      </div>

      <Footer />
      
      {/* Floating AI Assistant */}
      <FloatingAIButton currentProject={currentProject} />
    </div>
  )
}
