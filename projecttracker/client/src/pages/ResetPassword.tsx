import { useState } from 'react'
import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Footer } from '@/components/Footer'

export default function ResetPassword() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      })

      if (error) throw error

      setEmailSent(true)
      toast({
        title: "Reset link sent",
        description: "Check your email for a password reset link.",
        duration: 5000,
      })
    } catch (error: any) {
      setError(error.message || 'An error occurred')
      toast({
        title: 'Reset failed',
        description: error.message,
        variant: 'destructive',
      })
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
                We've sent a password reset link to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Click the link in your email to reset your password.
                </AlertDescription>
              </Alert>
              <div className="text-center space-y-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Try a different email
                </button>
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
                Reset Password
              </CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
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

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <Link href="/login" className="text-sm text-blue-600 hover:underline inline-flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Link>
                <div className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-blue-600 hover:underline">
                    Sign up
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}