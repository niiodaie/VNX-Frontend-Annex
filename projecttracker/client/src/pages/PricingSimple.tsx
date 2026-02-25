import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Pricing() {
  const plans = [
    { title: 'Free', price: '$0/mo', features: ['2 Projects', 'Basic To-dos'] },
    { title: 'Pro', price: '$9/mo', features: ['Unlimited Projects', 'AI Prompt Recall', 'Reminders'] },
    { title: 'Team', price: '$29/mo', features: ['All Pro features', 'Shared Boards', 'Export/Backup'] },
  ]

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
      <p className="text-gray-600 mb-6">Flexible pricing for solopreneurs and teams.</p>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <Card key={plan.title} className="border rounded-lg shadow p-4">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{plan.title}</CardTitle>
              <p className="text-lg text-gray-700">{plan.price}</p>
            </CardHeader>
            <CardContent>
              <ul className="text-sm mt-3 space-y-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>✔ {feature}</li>
                ))}
              </ul>
              <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}