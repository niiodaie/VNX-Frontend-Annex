import React, { useState } from 'react'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { StripeCheckout } from '@/components/StripeCheckout'
import { 
  Check, 
  Crown, 
  Users, 
  Sparkles, 
  FileUp, 
  BarChart3, 
  Zap, 
  Shield,
  Loader2
} from 'lucide-react'
import { usePlan } from '@/hooks/usePlan'
import { useToast } from '@/hooks/use-toast'

interface PlanFeature {
  name: string
  included: boolean
}

interface Plan {
  id: string
  name: string
  price: number
  period: string
  description: string
  icon: React.ReactNode
  popular?: boolean
  features: PlanFeature[]
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started with personal projects',
    icon: <Sparkles className="h-6 w-6" />,
    features: [
      { name: 'Up to 2 projects', included: true },
      { name: 'Up to 50 tasks per project', included: true },
      { name: 'Basic project management', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Email support', included: true },
      { name: 'File uploads', included: false },
      { name: 'Team collaboration', included: false },
      { name: 'Advanced analytics', included: false },
      { name: 'AI assistant', included: false },
      { name: 'Priority support', included: false },
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 12,
    period: 'month',
    description: 'Best for solopreneurs and small businesses',
    icon: <Crown className="h-6 w-6" />,
    popular: true,
    features: [
      { name: 'Unlimited projects', included: true },
      { name: 'Unlimited tasks', included: true },
      { name: 'Advanced project management', included: true },
      { name: 'File uploads & attachments', included: true },
      { name: 'Team collaboration (up to 5 members)', included: true },
      { name: 'Advanced analytics & reporting', included: true },
      { name: 'AI assistant', included: true },
      { name: 'Priority email support', included: true },
      { name: 'Custom integrations', included: true },
      { name: '24/7 phone support', included: false },
    ]
  },
  {
    id: 'team',
    name: 'Team',
    price: 25,
    period: 'month',
    description: 'For growing teams and organizations',
    icon: <Users className="h-6 w-6" />,
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Unlimited team members', included: true },
      { name: 'Advanced team management', included: true },
      { name: 'Advanced security features', included: true },
      { name: 'Custom branding', included: true },
      { name: 'API access', included: true },
      { name: 'Priority support', included: true },
      { name: '24/7 phone support', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'Custom onboarding', included: true },
    ]
  }
]

export default function Upgrade() {
  const { currentPlan } = usePlan()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    setIsLoading(planId)
    
    try {
      // Mock Stripe integration - in production this would redirect to Stripe Checkout
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: 'Upgrade Successful!',
        description: `You've been upgraded to the ${plans.find(p => p.id === planId)?.name} plan.`,
      })
      
      // In production, this would update the user's plan in the database
      // and refresh the auth context
      
    } catch (error) {
      toast({
        title: 'Upgrade Failed',
        description: 'There was an error processing your upgrade. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Upgrade Your Plan</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your project management needs. 
            Scale your productivity with advanced features and unlimited access.
          </p>
          
          {currentPlan !== 'free' && (
            <div className="mt-4">
              <Badge variant="default" className="text-sm">
                Current Plan: {plans.find(p => p.id === currentPlan)?.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''} ${plan.id === currentPlan ? 'border-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                </div>
              )}
              
              {plan.id === currentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="outline" className="bg-green-50 border-green-500 text-green-700">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {plan.icon}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </div>
                <div className="mb-2">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <CardDescription className="text-sm">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        feature.included 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {feature.included ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <span className="text-xs">✕</span>
                        )}
                      </div>
                      <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-500'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.id === 'free' ? (
                  <Button
                    className="w-full"
                    variant="outline"
                    disabled={plan.id === currentPlan}
                  >
                    {plan.id === currentPlan ? 'Current Plan' : 'Free Forever'}
                  </Button>
                ) : plan.id === currentPlan ? (
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <StripeCheckout plan={plan.id as 'pro' | 'premium'}>
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to {plan.name}
                    </Button>
                  </StripeCheckout>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Feature Comparison
            </CardTitle>
            <CardDescription>
              Compare all features across different plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Features</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {plan.icon}
                          <span>{plan.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Projects', values: ['2', 'Unlimited', 'Unlimited'] },
                    { name: 'Tasks per project', values: ['50', 'Unlimited', 'Unlimited'] },
                    { name: 'Team members', values: ['1', '5', 'Unlimited'] },
                    { name: 'File storage', values: ['—', '10GB', '100GB'] },
                    { name: 'AI assistant', values: ['—', '✓', '✓'] },
                    { name: 'Advanced analytics', values: ['—', '✓', '✓'] },
                    { name: 'Priority support', values: ['—', '✓', '✓'] },
                    { name: 'Phone support', values: ['—', '—', '✓'] },
                  ].map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4 font-medium">{row.name}</td>
                      {row.values.map((value, valueIndex) => (
                        <td key={valueIndex} className="py-3 px-4 text-center">
                          {value === '✓' ? (
                            <Check className="h-4 w-4 text-green-600 mx-auto" />
                          ) : value === '—' ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. 
                  Changes take effect immediately, and billing is prorated.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We accept all major credit cards (Visa, MasterCard, American Express) 
                  and PayPal through our secure Stripe payment processor.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our Free plan is permanently free with basic features. 
                  Pro and Team plans come with a 14-day money-back guarantee.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. 
                  You'll continue to have access until the end of your billing period.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}