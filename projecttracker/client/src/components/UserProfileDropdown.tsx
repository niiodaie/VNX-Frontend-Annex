import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useLocation } from 'wouter'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface UserData {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

export default function UserProfileDropdown() {
  const [user, setUser] = useState<UserData | null>(null)
  const [, setLocation] = useLocation()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setLocation('/login')
  }

  const getInitials = (email?: string, fullName?: string) => {
    if (fullName) {
      return fullName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return email?.charAt(0).toUpperCase() || 'U'
  }

  const getUserDisplayName = (user: UserData) => {
    return user.user_metadata?.full_name || user.email || 'User'
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 px-3 gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-600 text-white text-sm">
              {getInitials(user.email, user.user_metadata?.full_name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline-block text-sm">
            {getUserDisplayName(user)}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{getUserDisplayName(user)}</p>
          <p className="text-xs text-gray-500">{user.email || 'No email'}</p>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => setLocation('/account')}>
          <User className="mr-2 h-4 w-4" />
          My Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setLocation('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={logout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}