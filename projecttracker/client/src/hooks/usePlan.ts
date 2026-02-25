import { useAuth } from '@/components/AuthProvider'
import { useMemo } from 'react'

export interface PlanLimits {
  maxProjects: number
  maxTasksPerProject: number
  hasFileUploads: boolean
  hasTeamCollaboration: boolean
  hasAdvancedAnalytics: boolean
  hasAIAssistant: boolean
  hasPrioritySupport: boolean
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    maxProjects: 2,
    maxTasksPerProject: 50,
    hasFileUploads: false,
    hasTeamCollaboration: false,
    hasAdvancedAnalytics: false,
    hasAIAssistant: false,
    hasPrioritySupport: false,
  },
  pro: {
    maxProjects: -1, // unlimited
    maxTasksPerProject: -1, // unlimited
    hasFileUploads: true,
    hasTeamCollaboration: true,
    hasAdvancedAnalytics: true,
    hasAIAssistant: true,
    hasPrioritySupport: false,
  },
  premium: {
    maxProjects: -1, // unlimited
    maxTasksPerProject: -1, // unlimited
    hasFileUploads: true,
    hasTeamCollaboration: true,
    hasAdvancedAnalytics: true,
    hasAIAssistant: true,
    hasPrioritySupport: true,
  },
  team: {
    maxProjects: -1, // unlimited
    maxTasksPerProject: -1, // unlimited
    hasFileUploads: true,
    hasTeamCollaboration: true,
    hasAdvancedAnalytics: true,
    hasAIAssistant: true,
    hasPrioritySupport: true,
  },
}

export function usePlan() {
  const { user } = useAuth()
  
  const currentPlan = useMemo(() => {
    // Get plan from user metadata (Supabase stores this)
    return user?.user_metadata?.plan || 'free'
  }, [user])

  const limits = useMemo(() => {
    return PLAN_LIMITS[currentPlan] || PLAN_LIMITS.free
  }, [currentPlan])

  const isPro = currentPlan === 'pro' || currentPlan === 'team'
  const isTeam = currentPlan === 'team'
  const isPremium = currentPlan === 'pro' || currentPlan === 'team' || currentPlan === 'premium'
  
  return {
    currentPlan,
    limits,
    isPro,
    isTeam,
    isPremium,
    isFeatureAvailable: (feature: keyof PlanLimits) => {
      return limits[feature] === true || limits[feature] === -1
    },
    canCreateProjects: (currentCount: number) => {
      return limits.maxProjects === -1 || currentCount < limits.maxProjects
    },
    canCreateTasks: (currentCount: number) => {
      return limits.maxTasksPerProject === -1 || currentCount < limits.maxTasksPerProject
    },
  }
}