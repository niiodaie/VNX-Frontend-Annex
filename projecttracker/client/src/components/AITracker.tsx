import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { 
  Bot, 
  Brain, 
  Code, 
  MessageSquare, 
  ArrowRight, 
  Calendar, 
  Filter, 
  Plus,
  ExternalLink,
  Sparkles 
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/AuthProvider'
import { usePlan } from '@/hooks/usePlan'
import { useProjects } from '@/hooks/useProjects'
import { useCreateTask } from '@/hooks/useTasks'
import { useAILogs } from '@/hooks/useAILogs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { formatDistanceToNow } from 'date-fns'
import { apiRequest } from '@/lib/queryClient'

import type { AILog as DatabaseAILog } from '@shared/schema'

interface AILog extends DatabaseAILog {
  project?: { name: string; color: string }
}

const taskCreationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  projectId: z.number().min(1, 'Project is required'),
})

type TaskCreationData = z.infer<typeof taskCreationSchema>

export function AITracker() {
  const { user } = useAuth()
  const { isPro } = usePlan()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedSource, setSelectedSource] = useState<string>('all')
  const [isCreatingTask, setIsCreatingTask] = useState<number | null>(null)
  
  const { data: projects } = useProjects()
  const createTask = useCreateTask()

  const { data: aiLogs = [], isLoading } = useAILogs()

  const createTaskFromLog = useMutation({
    mutationFn: async ({ logId, taskData }: { logId: number; taskData: TaskCreationData }) => {
      // Create the task
      const task = await createTask.mutateAsync(taskData)
      
      // Update the AI log to mark task as created
      const response = await fetch(`/api/ai-logs/${logId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskCreated: true, taskId: task.id })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update AI log')
      }
      
      return task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-logs'] })
      setIsCreatingTask(null)
      toast({
        title: 'Task Created',
        description: 'Successfully converted AI suggestion to task',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create task from AI log',
        variant: 'destructive',
      })
    },
  })

  const form = useForm<TaskCreationData>({
    resolver: zodResolver(taskCreationSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      projectId: 0,
    },
  })

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'chatgpt':
        return <MessageSquare className="h-4 w-4 text-green-600" />
      case 'github copilot':
        return <Code className="h-4 w-4 text-purple-600" />
      case 'claude':
        return <Brain className="h-4 w-4 text-orange-600" />
      case 'gemini':
        return <Sparkles className="h-4 w-4 text-blue-600" />
      default:
        return <Bot className="h-4 w-4 text-gray-600" />
    }
  }

  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'chatgpt':
        return 'bg-green-100 text-green-700'
      case 'github copilot':
        return 'bg-purple-100 text-purple-700'
      case 'claude':
        return 'bg-orange-100 text-orange-700'
      case 'gemini':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const filteredLogs = aiLogs.filter((log: AILog) => 
    selectedSource === 'all' || log.source.toLowerCase() === selectedSource.toLowerCase()
  )

  const sources = Array.from(new Set(aiLogs.map((log: AILog) => log.source)))

  const handleCreateTask = (log: AILog) => {
    form.setValue('title', log.content.substring(0, 100))
    form.setValue('description', log.content)
    if (log.projectId) {
      form.setValue('projectId', log.projectId)
    }
    setIsCreatingTask(log.id)
  }

  const onSubmitTask = async (data: TaskCreationData) => {
    if (isCreatingTask) {
      await createTaskFromLog.mutateAsync({
        logId: isCreatingTask,
        taskData: data
      })
    }
  }

  if (!isPro) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Tracker
          </CardTitle>
          <CardDescription>
            Track your AI-generated tasks and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Bot className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Pro Feature</h3>
            <p className="text-gray-600 mb-4">
              AI Tracker is available for Pro and Team subscribers. 
              Upgrade to track your AI-generated content and convert suggestions to tasks.
            </p>
            <Button>
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading AI logs...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Tracker
              </CardTitle>
              <CardDescription>
                Track and manage AI-generated content from various sources
              </CardDescription>
            </div>
            <Badge variant="default" className="bg-purple-100 text-purple-700">
              {filteredLogs.length} logs
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter Controls */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filter by source:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedSource === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSource('all')}
              >
                All
              </Button>
              {sources.map((source: string) => (
                <Button
                  key={source}
                  variant={selectedSource === source ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSource(source)}
                  className="flex items-center gap-2"
                >
                  {getSourceIcon(source)}
                  {source}
                </Button>
              ))}
            </div>
          </div>

          {/* AI Logs List */}
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No AI logs yet</h3>
              <p className="text-gray-600 mb-4">
                Start using AI tools and your activity will appear here. 
                Install our browser extension to automatically track ChatGPT and other AI interactions.
              </p>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Install Browser Extension
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <Card key={log.id} className="border-l-4" style={{ borderLeftColor: log.project?.color || '#6B7280' }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getSourceIcon(log.source)}
                          <Badge className={getSourceColor(log.source)}>
                            {log.source}
                          </Badge>
                          {log.project && (
                            <Badge variant="outline">
                              {log.project.name}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(log.createdAt as any), { addSuffix: true })}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-900 line-clamp-3">
                            {log.content}
                          </p>
                          {log.prompt && (
                            <details className="mt-2">
                              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                                Show original prompt
                              </summary>
                              <p className="text-xs text-gray-600 mt-1 pl-4 border-l-2 border-gray-200">
                                {log.prompt}
                              </p>
                            </details>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {log.taskCreated ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Task Created
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCreateTask(log)}
                            className="flex items-center gap-2"
                          >
                            <Plus className="h-3 w-3" />
                            Create Task
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Task Dialog */}
      <Dialog open={!!isCreatingTask} onOpenChange={() => setIsCreatingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task from AI Suggestion</DialogTitle>
            <DialogDescription>
              Convert this AI-generated content into a project task
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitTask)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Task description"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border rounded">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <FormControl>
                      <select 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select a project</option>
                        {projects?.map(project => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreatingTask(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createTaskFromLog.isPending}
                >
                  {createTaskFromLog.isPending ? 'Creating...' : 'Create Task'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}