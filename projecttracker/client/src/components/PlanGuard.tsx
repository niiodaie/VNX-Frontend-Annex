import React from 'react'
import { usePlan } from '@/hooks/usePlan'
import { UpgradePrompt } from './UpgradePrompt'

interface PlanGuardProps {
  feature: keyof import('@/hooks/usePlan').PlanLimits
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PlanGuard({ feature, children, fallback }: PlanGuardProps) {
  const { isFeatureAvailable } = usePlan()
  
  if (isFeatureAvailable(feature)) {
    return <>{children}</>
  }
  
  if (fallback) {
    return <>{fallback}</>
  }
  
  return null
}

interface ProjectLimitGuardProps {
  currentProjectCount: number
  children: React.ReactNode
  showUpgradePrompt?: boolean
}

export function ProjectLimitGuard({ 
  currentProjectCount, 
  children, 
  showUpgradePrompt = true 
}: ProjectLimitGuardProps) {
  const { canCreateProjects, limits, currentPlan } = usePlan()
  
  if (canCreateProjects(currentProjectCount)) {
    return <>{children}</>
  }
  
  if (showUpgradePrompt) {
    return (
      <UpgradePrompt 
        feature="Project Creation"
        description={`You've reached the ${currentPlan} plan limit of ${limits.maxProjects} projects. Upgrade to create unlimited projects.`}
      />
    )
  }
  
  return null
}

interface TaskLimitGuardProps {
  currentTaskCount: number
  children: React.ReactNode
  showUpgradePrompt?: boolean
}

export function TaskLimitGuard({ 
  currentTaskCount, 
  children, 
  showUpgradePrompt = true 
}: TaskLimitGuardProps) {
  const { canCreateTasks, limits, currentPlan } = usePlan()
  
  if (canCreateTasks(currentTaskCount)) {
    return <>{children}</>
  }
  
  if (showUpgradePrompt) {
    return (
      <UpgradePrompt 
        feature="Task Creation"
        description={`You've reached the ${currentPlan} plan limit of ${limits.maxTasksPerProject} tasks per project. Upgrade for unlimited tasks.`}
      />
    )
  }
  
  return null
}