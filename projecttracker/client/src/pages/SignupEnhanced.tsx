import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Footer } from '@/components/Footer'
import { redirectByRole } from '@/lib/roleRedirect'

export default function SignupEnhanced() {
  const [, setLocation] = useLocation()
  const { t } = useTranslation()
  
  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!firstName.trim() || !lastName.trim()) {
      toast.error('First and last name are required')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    // Show loading toast
    const loadingToast = toast.loading('Creating your account...')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            company_name: companyName.trim(),
            full_name: `${firstName.trim()} ${lastName.trim()}`
          }
        }
      })

      if (error) throw error

      if (data.user && !data.user.email_confirmed_at) {
        toast.dismiss(loadingToast)
        setEmailSent(true)
        toast.success('Check your email! We\'ve sent you a confirmation link to complete your registration. 📧', {
          duration: 6000,
        })
      } else {
        toast.dismiss(loadingToast)
        toast.success('Account created successfully! Welcome to Nexus Tracker! 🎉', {
          duration: 4000,
        })
        
        // Redirect based on user role
        await redirectByRole(setLocation, {
          onError: (error) => {
            console.warn('Role redirect failed, using default:', error.message)
            setLocation('/dashboard')
          }
        })
      }
    } catch (error: any) {
      toast.dismiss(loadingToast)
      setError(error.message || 'An error occurred during signup')
      toast.error(`Signup failed: ${error.message || 'Please try again'}`)
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Check your email</CardTitle>
              <CardDescription>
                We've sent a confirmation link to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Click the link in your email to verify your account and complete registration.
                </AlertDescription>
              </Alert>
              <div className="text-center">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
                Create Account
              </CardTitle>
              <CardDescription>
                Join Nexus Tracker and start managing your projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}



                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500">
                    Must be at least 6 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <Link href="/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Link href="/reset-password" className="text-sm text-blue-600 hover:underline">
                  Forgot your password?
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