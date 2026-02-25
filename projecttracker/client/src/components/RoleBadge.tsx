import { useAuth } from '@/components/AuthProvider'
import { cn } from '@/lib/utils'
import { Shield, Users, User } from 'lucide-react'

interface RoleBadgeProps {
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  role?: string // Allow explicit role override
  className?: string
}

export function RoleBadge({ size = 'md', showIcon = true, role, className }: RoleBadgeProps) {
  const { userRole } = useAuth()
  const displayRole = role || userRole

  if (!displayRole) return null

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const getBadgeStyle = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
      case 'admin':
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
      case 'moderator':
        return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin'
      case 'admin':
        return 'Admin'
      case 'moderator':
        return 'Moderator'
      default:
        return 'User'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Shield className={iconSizes[size]} />
      case 'admin':
        return <Users className={iconSizes[size]} />
      case 'moderator':
        return <Users className={iconSizes[size]} />
      default:
        return <User className={iconSizes[size]} />
    }
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium rounded-full border',
      sizeClasses[size],
      getBadgeStyle(displayRole),
      className
    )}>
      {showIcon && getRoleIcon(displayRole)}
      {getRoleLabel(displayRole)}
    </span>
  )
}