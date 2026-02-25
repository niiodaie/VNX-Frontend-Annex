import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { getRoleBasedRoute } from '@/lib/roleRedirect'

interface RoleBasedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
  fallbackRoute?: string
}

export function RoleBasedRoute({ 
  children, 
  allowedRoles = ['user', 'admin', 'super_admin'], 
  fallbackRoute = '/dashboard' 
}: RoleBasedRouteProps) {
  const { user, loading: authLoading } = useAuth()
  const [, setLocation] = useLocation()
  const [userRole, setUserRole] = useState<string>('user')
  const [roleLoading, setRoleLoading] = useState(true)

  useEffect(() => {
    async function checkUserRole() {
      if (!user) {
        setRoleLoading(false)
        return
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) {
          console.warn('Could not fetch user role:', error.message)
          setUserRole('user')
        } else {
          setUserRole(profile?.role || 'user')
        }
      } catch (error) {
        console.warn('Error checking user role:', error)
        setUserRole('user')
      } finally {
        setRoleLoading(false)
      }
    }

    checkUserRole()
  }, [user])

  // Show loading while checking authentication and role
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  // Redirect if user doesn't have permission
  if (!allowedRoles.includes(userRole)) {
    const correctRoute = getRoleBasedRoute(userRole)
    if (window.location.pathname !== correctRoute) {
      setLocation(correctRoute)
      return null
    }
  }

  return <>{children}</>
}

// Specific route guards for common use cases
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleBasedRoute 
      allowedRoles={['admin', 'super_admin']} 
      fallbackRoute="/dashboard"
    >
      {children}
    </RoleBasedRoute>
  )
}

export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleBasedRoute 
      allowedRoles={['super_admin']} 
      fallbackRoute="/dashboard"
    >
      {children}
    </RoleBasedRoute>
  )
}

export function UserRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleBasedRoute 
      allowedRoles={['user', 'admin', 'super_admin']} 
      fallbackRoute="/login"
    >
      {children}
    </RoleBasedRoute>
  )
}