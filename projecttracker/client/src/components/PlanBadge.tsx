import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Crown, Users, Sparkles } from 'lucide-react'
import { usePlan } from '@/hooks/usePlan'

interface PlanBadgeProps {
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export function PlanBadge({ size = 'md', showIcon = true }: PlanBadgeProps) {
  const { currentPlan } = usePlan()
  
  const planConfig = {
    free: {
      label: 'Free',
      variant: 'secondary' as const,
      icon: <Sparkles className="h-3 w-3" />
    },
    pro: {
      label: 'Pro',
      variant: 'default' as const,
      icon: <Crown className="h-3 w-3" />
    },
    team: {
      label: 'Team',
      variant: 'destructive' as const,
      icon: <Users className="h-3 w-3" />
    }
  }
  
  const config = planConfig[currentPlan as keyof typeof planConfig] || planConfig.free
  
  return (
    <Badge variant={config.variant} className={`${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs'}`}>
      {showIcon && config.icon}
      <span className={showIcon ? 'ml-1' : ''}>{config.label}</span>
    </Badge>
  )
}