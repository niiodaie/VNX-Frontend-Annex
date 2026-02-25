import { useAuth } from '@/components/AuthProvider'
import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, Settings, CreditCard, LogOut, Shield, Users } from 'lucide-react'
import { PlanBadge } from './PlanBadge'
import useUserRole from '@/hooks/useUserRole'

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const { role, isAdmin, isSuperAdmin } = useUserRole()
  const [, setLocation] = useLocation()

  const handleLogout = async () => {
    await signOut()
    setLocation('/')
  }

  if (!user) {
    return (
      <div className="flex gap-4 items-center">
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="sm">
            Sign Up
          </Button>
        </Link>
      </div>
    )
  }

  const nameInitial = user?.email?.charAt(0)?.toUpperCase() || 
                    user?.user_metadata?.first_name?.charAt(0)?.toUpperCase() || 'U'
  
  const displayName = user?.user_metadata?.first_name ? 
    `${user.user_metadata.first_name} ${user.user_metadata?.last_name || ''}`.trim() :
    user?.email

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
              {nameInitial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{displayName}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {user.email}
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between">
              <PlanBadge size="sm" />
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                role === 'super_admin' 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                  : role === 'admin'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}>
                {role === 'super_admin' ? 'Super Admin' : role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded font-medium capitalize">
              {role === 'super_admin' ? 'super_admin' : role}
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account" className="w-full cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/upgrade" className="w-full cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing & Plans</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="w-full cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        {(role === 'admin' || role === 'super_admin') && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin-dashboard" className="w-full cursor-pointer text-blue-600">
                <Users className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
            {role === 'super_admin' && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="w-full cursor-pointer text-red-600">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Super Admin Panel</span>
                </Link>
              </DropdownMenuItem>
            )}
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}