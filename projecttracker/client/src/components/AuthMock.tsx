import { createContext, useContext, useState } from 'react'

interface AuthContextType {
  user: any | null
  session: any | null
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
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const signIn = async (email: string, password: string) => {
    // Mock authentication - in production this would use Supabase
    setUser({ email, user_metadata: { plan: 'free' } })
    return { error: null }
  }

  const signUp = async (email: string, password: string) => {
    // Mock authentication - in production this would use Supabase
    setUser({ email, user_metadata: { plan: 'free' } })
    return { error: null }
  }

  const signOut = async () => {
    setUser(null)
  }

  const isPremium = user?.user_metadata?.plan === 'pro' || user?.user_metadata?.plan === 'premium'

  const value = {
    user,
    session: user ? { user } : null,
    loading,
    signIn,
    signUp,
    signOut,
    isPremium,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}