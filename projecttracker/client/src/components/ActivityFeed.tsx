import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Activity, CheckCircle, Plus, Edit, Trash, Clock } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/components/AuthProvider'
import { formatDistanceToNow } from 'date-fns'

interface ActivityItem {
  id: number
  type: 'task_created' | 'task_completed' | 'project_created' | 'task_updated' | 'task_deleted'
  description: string
  timestamp: string
  projectName?: string
  taskTitle?: string
  userName?: string
}

export function ActivityFeed() {
  const { user } = useAuth()

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['/api/activities'],
    queryFn: async (): Promise<ActivityItem[]> => {
      // Get recent projects and tasks to build activity feed
      const [projects, ...taskArrays] = await Promise.all([
        api.getProjects(),
        ...(await api.getProjects()).map(p => api.getProjectTasks(p.id))
      ])

      const allTasks = taskArrays.flat()
      const activities: ActivityItem[] = []

      // Add project creation activities
      projects.slice(0, 3).forEach(project => {
        activities.push({
          id: project.id,
          type: 'project_created',
          description: `Created project "${project.name}"`,
          timestamp: project.createdAt,
          projectName: project.name,
          userName: user?.user_metadata?.first_name || 'You'
        })
      })

      // Add task activities
      allTasks
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
        .forEach(task => {
          const project = projects.find(p => p.id === task.projectId)
          
          if (task.status === 'done') {
            activities.push({
              id: task.id + 1000,
              type: 'task_completed',
              description: `Completed task "${task.title}"`,
              timestamp: task.updatedAt,
              taskTitle: task.title,
              projectName: project?.name,
              userName: user?.user_metadata?.first_name || 'You'
            })
          } else {
            activities.push({
              id: task.id + 2000,
              type: 'task_created',
              description: `Created task "${task.title}"`,
              timestamp: task.createdAt,
              taskTitle: task.title,
              projectName: project?.name,
              userName: user?.user_metadata?.first_name || 'You'
            })
          }
        })

      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 8)
    },
    enabled: !!user
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_created':
        return <Plus className="h-4 w-4 text-blue-500" />
      case 'task_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'project_created':
        return <Plus className="h-4 w-4 text-purple-500" />
      case 'task_updated':
        return <Edit className="h-4 w-4 text-orange-500" />
      case 'task_deleted':
        return <Trash className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task_created':
        return 'bg-blue-100 text-blue-700'
      case 'task_completed':
        return 'bg-green-100 text-green-700'
      case 'project_created':
        return 'bg-purple-100 text-purple-700'
      case 'task_updated':
        return 'bg-orange-100 text-orange-700'
      case 'task_deleted':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Your latest project and task activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Start creating projects and tasks to see your activity here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  {activity.projectName && (
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {activity.projectName}
                      </Badge>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}