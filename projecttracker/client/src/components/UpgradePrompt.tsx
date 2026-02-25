import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Crown, X } from 'lucide-react'
import { Link } from 'wouter'
import { useState } from 'react'

interface UpgradePromptProps {
  feature: string
  description: string
}

export function UpgradePrompt({ feature, description }: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Crown className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
              Upgrade to Pro for {feature}
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-200 mb-3">
              {description}
            </p>
            <div className="flex gap-2">
              <Button size="sm" asChild>
                <Link href="/pricing">Upgrade Now</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDismissed(true)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}