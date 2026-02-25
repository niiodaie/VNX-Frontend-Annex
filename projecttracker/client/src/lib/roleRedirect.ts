import { supabase } from '@/lib/supabase'

export interface RoleRedirectOptions {
  defaultRoute?: string
  onError?: (error: Error) => void
}

export async function redirectByRole(
  setLocation: (path: string) => void,
  options: RoleRedirectOptions = {}
) {
  const { defaultRoute = '/dashboard', onError } = options

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.warn('No authenticated user found, redirecting to default')
      setLocation(defaultRoute)
      return
    }

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, display_name')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.warn('Could not fetch user profile:', profileError.message)
      setLocation(defaultRoute)
      return
    }

    // Route based on role
    switch (profile?.role) {
      case 'super_admin':
        console.log(`Redirecting super admin: ${profile.display_name}`)
        setLocation('/dashboard/super-admin')
        break
      case 'admin':
        console.log(`Redirecting admin: ${profile.display_name}`)
        setLocation('/dashboard/admin')
        break
      case 'moderator':
        console.log(`Redirecting moderator: ${profile.display_name}`)
        setLocation('/dashboard/admin')
        break
      case 'user':
      default:
        console.log(`Redirecting user: ${profile.display_name}`)
        setLocation('/dashboard')
        break
    }
  } catch (error) {
    console.error('Error during role-based redirect:', error)
    if (onError) {
      onError(error as Error)
    }
    setLocation(defaultRoute)
  }
}

export function getRoleBasedRoute(role: string): string {
  switch (role) {
    case 'super_admin':
      return '/dashboard/super-admin'
    case 'admin':
    case 'moderator':
      return '/dashboard/admin'
    case 'user':
    default:
      return '/dashboard'
  }
}