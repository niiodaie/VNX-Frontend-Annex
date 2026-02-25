import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Users, Zap, Target } from 'lucide-react'
import { Footer } from '@/components/Footer'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Nexus Tracker</h1>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Simplified Project & Task Management
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Built for small teams and solo founders who need to stay organized without the complexity of enterprise tools.
          </p>
          
          <div className="space-x-4 mb-12">
            <Link href="/signup">
              <Button size="lg" className="px-8 py-3">
                Start Free Today
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="px-8 py-3">
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Simple Project Boards</CardTitle>
                <CardDescription>
                  Kanban-style boards that make project management intuitive
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Smart Task Management</CardTitle>
                <CardDescription>
                  Organize tasks with priorities, due dates, and progress tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>
                  Get intelligent suggestions and automate routine tasks
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Social Proof */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 mb-4">Trusted by entrepreneurs and small teams worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <Users className="w-8 h-8" />
              <span className="text-lg font-medium">500+ Active Users</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}