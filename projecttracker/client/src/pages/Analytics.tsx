import React from 'react'
import { Layout } from '@/components/Layout'
import { TaskAnalytics } from '@/components/TaskAnalytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, BarChart3, PieChart, Calendar, Target, Clock, Zap } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/components/AuthProvider'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from 'date-fns'

export default function Analytics() {
  const { user } = useAuth()
  const { data: projects, isLoading: projectsLoading } = useProjects()

  const { data: allTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks/all'],
    queryFn: async () => {
      if (!projects?.length) return []
      const taskPromises = projects.map(project => api.getProjectTasks(project.id))
      const taskArrays = await Promise.all(taskPromises)
      return taskArrays.flat()
    },
    enabled: !!projects?.length,
  })

  const analytics = React.useMemo(() => {
    if (!projects || !allTasks) return null

    const now = new Date()
    const currentMonth = startOfMonth(now)
    const previousMonth = startOfMonth(subMonths(now, 1))

    // Monthly productivity
    const currentMonthTasks = allTasks.filter(task => {
      const taskDate = new Date(task.createdAt)
      return taskDate >= currentMonth
    })

    const previousMonthTasks = allTasks.filter(task => {
      const taskDate = new Date(task.createdAt)
      return taskDate >= previousMonth && taskDate < currentMonth
    })

    const currentMonthCompleted = currentMonthTasks.filter(t => t.status === 'done').length
    const previousMonthCompleted = previousMonthTasks.filter(t => t.status === 'done').length

    // Project progress
    const projectProgress = projects.map(project => {
      const projectTasks = allTasks.filter(t => t.projectId === project.id)
      const completedTasks = projectTasks.filter(t => t.status === 'done').length
      const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0

      return {
        ...project,
        totalTasks: projectTasks.length,
        completedTasks,
        progress: Math.round(progress)
      }
    }).sort((a, b) => b.progress - a.progress)

    // Time distribution
    const last30Days = eachDayOfInterval({
      start: subMonths(now, 1),
      end: now
    })

    const dailyActivity = last30Days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayTasks = allTasks.filter(task => 
        task.updatedAt?.startsWith(dayStr) && task.status === 'done'
      ).length
      return {
        date: dayStr,
        completed: dayTasks
      }
    })

    // Performance metrics
    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter(t => t.status === 'done').length
    const inProgressTasks = allTasks.filter(t => t.status === 'in_progress').length
    const overdueTasks = allTasks.filter(t => {
      if (!t.dueDate || t.status === 'done') return false
      return new Date(t.dueDate) < now
    }).length

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    const monthlyGrowth = previousMonthCompleted > 0 
      ? ((currentMonthCompleted - previousMonthCompleted) / previousMonthCompleted) * 100 
      : 0

    // Top performing projects (by completion rate)
    const topProjects = projectProgress.filter(p => p.totalTasks > 0).slice(0, 3)

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      completionRate,
      monthlyGrowth,
      currentMonthCompleted,
      previousMonthCompleted,
      projectProgress,
      topProjects,
      dailyActivity
    }
  }, [projects, allTasks])

  if (projectsLoading || tasksLoading || !analytics) {
    return (
      <Layout>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 animate-pulse mx-auto mb-4" />
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive insights into your productivity and project performance</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold">{analytics.completionRate.toFixed(1)}%</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
              <Progress value={analytics.completionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Growth</p>
                  <p className="text-2xl font-bold flex items-center gap-1">
                    {analytics.monthlyGrowth > 0 ? '+' : ''}{analytics.monthlyGrowth.toFixed(1)}%
                    {analytics.monthlyGrowth > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                    )}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold">{projects?.length || 0}</p>
                </div>
                <PieChart className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overdue Tasks</p>
                  <p className="text-2xl font-bold text-red-600">{analytics.overdueTasks}</p>
                </div>
                <Clock className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Project Performance
              </CardTitle>
              <CardDescription>Progress across all your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.projectProgress.slice(0, 5).map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="font-medium">{project.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {project.completedTasks}/{project.totalTasks}
                        </span>
                        <Badge variant={project.progress >= 80 ? 'default' : project.progress >= 50 ? 'secondary' : 'outline'}>
                          {project.progress}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                ))}
                
                {analytics.projectProgress.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No projects found</p>
                    <p className="text-sm">Create your first project to see performance metrics</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Top Performing Projects
              </CardTitle>
              <CardDescription>Projects with highest completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProjects.map((project, index) => (
                  <div key={project.id} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="font-medium">{project.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{project.completedTasks} completed</span>
                        <span>•</span>
                        <span>{project.progress}% done</span>
                      </div>
                    </div>
                    <Badge variant="default">
                      {project.progress}%
                    </Badge>
                  </div>
                ))}

                {analytics.topProjects.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No completed projects yet</p>
                    <p className="text-sm">Complete some tasks to see top performers</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Analytics Component */}
        <TaskAnalytics allTasks={allTasks} projects={projects} />

        {/* Monthly Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Comparison
            </CardTitle>
            <CardDescription>Compare your productivity month over month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">This Month</p>
                <p className="text-4xl font-bold text-blue-600">{analytics.currentMonthCompleted}</p>
                <p className="text-sm text-gray-600">tasks completed</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Last Month</p>
                <p className="text-4xl font-bold text-gray-400">{analytics.previousMonthCompleted}</p>
                <p className="text-sm text-gray-600">tasks completed</p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center">
              <div className="flex items-center gap-2">
                {analytics.monthlyGrowth > 0 ? (
                  <>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="text-green-600 font-medium">
                      +{analytics.monthlyGrowth.toFixed(1)}% improvement
                    </span>
                  </>
                ) : analytics.monthlyGrowth < 0 ? (
                  <>
                    <TrendingUp className="h-5 w-5 text-red-500 rotate-180" />
                    <span className="text-red-600 font-medium">
                      {analytics.monthlyGrowth.toFixed(1)}% decrease
                    </span>
                  </>
                ) : (
                  <span className="text-gray-600">No change from last month</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}