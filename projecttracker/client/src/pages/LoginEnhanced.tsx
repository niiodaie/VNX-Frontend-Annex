import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Footer } from '@/components/Footer'
import { redirectByRole } from '@/lib/roleRedirect'

export default function LoginEnhanced() {
  const [, setLocation] = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Show loading toast
    const loadingToast = toast.loading('Signing you in...')
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        toast.dismiss(loadingToast)
        setError(error.message)
        toast.error(`Sign in failed: ${error.message}`)
      } else {
        toast.dismiss(loadingToast)
        toast.success('Welcome back! 👋')
        
        // Redirect based on user role
        await redirectByRole(setLocation, {
          onError: (error) => {
            console.warn('Role redirect failed, using default:', error.message)
            setLocation('/dashboard')
          }
        })
      }
    } catch (err) {
      toast.dismiss(loadingToast)
      setError("Unexpected error occurred.")
      toast.error('Unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="text-center mt-6">
        <h1 className="text-4xl font-bold">Nexus Tracker</h1>
        <p className="mt-2 text-gray-600 text-lg">Simplified project & task management for small teams and solo founders.</p>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome Back
              </CardTitle>
              <CardDescription>
                Sign in to your Nexus Tracker account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}



                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Link href="/reset-password" className="text-sm text-blue-600 hover:underline">
                  Forgot your password?
                </Link>
              </div>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <Link href="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}