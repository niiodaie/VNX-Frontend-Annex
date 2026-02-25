import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { fetchUserRole } from '@/lib/userRole'

interface AuthContextType {
  user: User | null
  session: Session | null
  userRole: string
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: any }>
  signUp: (email: string, password: string) => Promise<{ error?: any }>
  signOut: () => Promise<void>
  isPremium: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState<string>('user')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simplified auth initialization with faster fallback
    const initializeAuth = async () => {
      try {
        // Quick timeout for initial session check
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth timeout')), 2000)
        )
        
        const result = await Promise.race([sessionPromise, timeoutPromise])
        const { data: { session } } = result as any
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Quick role assignment - demo admin or default user
          if (session.user.email === 'demo@nexustracker.com') {
            setUserRole('super_admin')
          } else {
            setUserRole('user') // Default to user for faster loading
          }
        } else {
          setUserRole('user')
        }
      } catch (error) {
        console.warn('Auth initialization timeout, using defaults:', error)
        // Fallback to no authentication for faster loading
        setSession(null)
        setUser(null)
        setUserRole('user')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
    
    // Set a hard timeout as a safety net
    const safetyTimeout = setTimeout(() => {
      console.warn('Authentication safety timeout triggered')
      setLoading(false)
    }, 3000)

    // Listen for auth changes with automatic role-based redirect
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      if (session?.user) {
        setUser({ 
          ...session.user, 
          user_metadata: session.user?.user_metadata || {} 
        })
        
        // Fetch user role from database for test accounts
        const testAdminEmails = ['demo@nexustracker.com', 'viusmedia@gmail.com', 'niiodaie@gmail.com', 'niiodaie@yahoo.com']
        
        let userRole = 'user'
        
        if (testAdminEmails.includes(session.user.email || '')) {
          // Automatically assign super_admin for test accounts
          userRole = 'super_admin'
          setUserRole('super_admin')
        } else {
          // Fetch role from database for other users
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single()
            
            if (!error && data?.role) {
              userRole = data.role
              setUserRole(data.role)
            } else {
              userRole = 'user'
              setUserRole('user')
            }
          } catch (error) {
            console.error('Error fetching user role:', error)
            userRole = 'user'
            setUserRole('user')
          }
        }
        
        // Auto-redirect on sign in based on role
        if (event === 'SIGNED_IN') {
          const currentPath = window.location.pathname
          
          // Only redirect if not already on the correct dashboard
          if (!currentPath.startsWith('/dashboard')) {
            switch (userRole) {
              case 'super_admin':
                window.location.href = '/dashboard/super-admin'
                break
              case 'admin':
              case 'moderator':
                window.location.href = '/dashboard/admin'
                break
              default:
                window.location.href = '/dashboard'
            }
          }
        }
      } else {
        setUser(null)
        setUserRole('user')
      }
      setLoading(false)
    })

    // Cleanup both timeout and subscription on unmount
    return () => {
      clearTimeout(safetyTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      localStorage.removeItem('supabase.auth.token')
      // Force hard refresh to clear memory cache
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
      // Fallback: clear local storage and redirect
      localStorage.clear()
      window.location.href = '/'
    }
  }

  const isPremium = user?.user_metadata?.plan === 'pro' || user?.user_metadata?.plan === 'premium'

  const value = {
    user,
    session,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    isPremium,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}