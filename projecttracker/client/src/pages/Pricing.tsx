import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { Link } from 'wouter'

export default function Pricing() {

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Up to 3 projects',
        '1 AI prompt per session',
        'Basic task management',
        'Mobile responsive',
      ],
      limitations: [
        'Limited AI assistance',
        'No prompt history',
        'Basic reminders only',
      ],
      current: true,
    },
    {
      name: 'Pro',
      price: '$9',
      period: 'month',
      description: 'For serious project managers',
      features: [
        'Unlimited projects',
        'Unlimited AI prompts',
        'Full prompt history',
        'Advanced reminders',
        'Priority support',
        'Export capabilities',
      ],
      popular: true,
      current: false,
    },
    {
      name: 'Team',
      price: '$19',
      period: 'month',
      description: 'For growing teams',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated support',
        'Custom branding',
      ],
      comingSoon: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Start free and upgrade when you're ready for more features
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? 'border-blue-500 shadow-lg scale-105'
                  : plan.current
                  ? 'border-green-500'
                  : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              {plan.current && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500">
                  Current Plan
                </Badge>
              )}
              {plan.comingSoon && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-500">
                  Coming Soon
                </Badge>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations?.map((limitation) => (
                    <div key={limitation} className="flex items-center gap-3 text-gray-500">
                      <div className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  {plan.comingSoon ? (
                    <Button className="w-full" disabled>
                      Coming Soon
                    </Button>
                  ) : plan.current ? (
                    <Button className="w-full" variant="outline" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button className="w-full" asChild>
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our Free plan is permanent and gives you access to core features. No credit card required.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We accept all major credit cards and PayPal for Pro and Team plans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, we offer a 30-day money-back guarantee for all paid plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}