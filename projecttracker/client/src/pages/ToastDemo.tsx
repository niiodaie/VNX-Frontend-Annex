import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ToastDemo() {
  
  const showSuccessToast = () => {
    toast.success('Account created successfully! Welcome to Nexus Tracker! 🎉', {
      duration: 4000,
    })
  }

  const showErrorToast = () => {
    toast.error('Signup failed: Invalid email format')
  }

  const showLoadingToast = () => {
    const loadingToast = toast.loading('Creating your account...')
    
    // Simulate async operation
    setTimeout(() => {
      toast.dismiss(loadingToast)
      toast.success('Account created! 🎉')
    }, 2000)
  }

  const showValidationError = () => {
    toast.error('Password must be at least 6 characters')
  }

  const showLoginSuccess = () => {
    toast.success('Welcome back! 👋')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Smart Toast Notifications Demo</CardTitle>
            <CardDescription>
              Test the enhanced authentication feedback system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={showSuccessToast} variant="default">
                Show Success Toast
              </Button>
              
              <Button onClick={showErrorToast} variant="destructive">
                Show Error Toast
              </Button>
              
              <Button onClick={showLoadingToast} variant="secondary">
                Show Loading Toast
              </Button>
              
              <Button onClick={showValidationError} variant="outline">
                Show Validation Error
              </Button>
              
              <Button onClick={showLoginSuccess} className="col-span-2">
                Show Login Success
              </Button>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Toast Features Implemented:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Custom styled success/error/loading toasts</li>
                <li>✅ Smart loading states with dismiss functionality</li>
                <li>✅ Form validation feedback with immediate error display</li>
                <li>✅ Authentication success messages with emojis</li>
                <li>✅ 4-second display duration for better UX</li>
                <li>✅ Top-right positioning for non-intrusive notifications</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}