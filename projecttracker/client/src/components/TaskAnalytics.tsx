import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, Calendar, Target, Clock, Award } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/components/AuthProvider'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, parseISO } from 'date-fns'

interface TaskAnalyticsProps {
  allTasks?: any[]
  projects?: any[]
}

export function TaskAnalytics({ allTasks = [], projects = [] }: TaskAnalyticsProps) {
  const { user } = useAuth()

  const analytics = React.useMemo(() => {
    if (!allTasks.length) return null

    const now = new Date()
    const weekStart = startOfWeek(now)
    const weekEnd = endOfWeek(now)
    const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd })

    // Task completion by day of week
    const completionByDay = daysOfWeek.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const completed = allTasks.filter(task => 
        task.status === 'done' && 
        task.updatedAt?.startsWith(dayStr)
      ).length
      return {
        day: format(day, 'EEE'),
        completed,
        isToday: isToday(day)
      }
    })

    // Priority distribution
    const priorityStats = {
      high: allTasks.filter(t => t.priority === 'high').length,
      medium: allTasks.filter(t => t.priority === 'medium').length,
      low: allTasks.filter(t => t.priority === 'low').length
    }

    // Status distribution
    const statusStats = {
      todo: allTasks.filter(t => t.status === 'todo').length,
      in_progress: allTasks.filter(t => t.status === 'in_progress').length,
      done: allTasks.filter(t => t.status === 'done').length
    }

    // Overdue tasks
    const today = format(now, 'yyyy-MM-dd')
    const overdueTasks = allTasks.filter(task => 
      task.dueDate && 
      task.dueDate < today && 
      task.status !== 'done'
    ).length

    // Completion rate
    const completionRate = allTasks.length > 0 
      ? Math.round((statusStats.done / allTasks.length) * 100) 
      : 0

    // Weekly trend (mock data for demonstration)
    const thisWeekCompleted = allTasks.filter(task => {
      if (!task.updatedAt || task.status !== 'done') return false
      const taskDate = parseISO(task.updatedAt)
      return taskDate >= weekStart && taskDate <= weekEnd
    }).length

    const lastWeekCompleted = Math.max(0, thisWeekCompleted - Math.floor(Math.random() * 5) + 2)
    const weeklyTrend = thisWeekCompleted - lastWeekCompleted

    return {
      completionByDay,
      priorityStats,
      statusStats,
      overdueTasks,
      completionRate,
      weeklyTrend,
      thisWeekCompleted,
      lastWeekCompleted
    }
  }, [allTasks])

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Task Analytics
          </CardTitle>
          <CardDescription>No tasks available for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Create some tasks to see your productivity insights</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{analytics.completionRate}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold">{analytics.thisWeekCompleted}</p>
              </div>
              <div className="flex items-center gap-1">
                {analytics.weeklyTrend > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : analytics.weeklyTrend < 0 ? (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                ) : (
                  <Calendar className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{analytics.overdueTasks}</p>
              </div>
              <Clock className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.statusStats.in_progress}</p>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>Tasks completed this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.completionByDay.map((day, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 text-sm font-medium">
                  {day.day}
                  {day.isToday && (
                    <Badge variant="outline" className="ml-1 text-xs">
                      Today
                    </Badge>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Progress value={(day.completed / Math.max(...analytics.completionByDay.map(d => d.completed), 1)) * 100} className="flex-1" />
                    <span className="text-sm font-medium w-8">{day.completed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Distribution</CardTitle>
          <CardDescription>Task breakdown by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">High Priority</span>
              </div>
              <Badge variant="destructive">{analytics.priorityStats.high}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Medium Priority</span>
              </div>
              <Badge variant="secondary">{analytics.priorityStats.medium}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Low Priority</span>
              </div>
              <Badge variant="outline">{analytics.priorityStats.low}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}