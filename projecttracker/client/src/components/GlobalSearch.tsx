import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Search, FileText, CheckSquare, Calendar, Hash, User } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/components/AuthProvider'
import { Link } from 'wouter'
import { formatDistanceToNow } from 'date-fns'

interface SearchResult {
  id: string
  type: 'project' | 'task' | 'prompt'
  title: string
  description?: string
  projectName?: string
  status?: string
  priority?: string
  dueDate?: string
  createdAt: string
}

export function GlobalSearch() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])

  const { data: projects } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: api.getProjects,
    enabled: !!user,
  })

  const { data: allTasks } = useQuery({
    queryKey: ['/api/tasks/all'],
    queryFn: async () => {
      if (!projects?.length) return []
      const taskPromises = projects.map(project => api.getProjectTasks(project.id))
      const taskArrays = await Promise.all(taskPromises)
      return taskArrays.flat()
    },
    enabled: !!projects?.length,
  })

  const { data: prompts } = useQuery({
    queryKey: ['/api/prompts'],
    queryFn: () => api.getPrompts(),
    enabled: !!user,
  })

  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      const searchResults: SearchResult[] = []
      const lowerQuery = searchQuery.toLowerCase()

      // Search projects
      projects?.forEach(project => {
        if (
          project.name.toLowerCase().includes(lowerQuery) ||
          project.description?.toLowerCase().includes(lowerQuery)
        ) {
          searchResults.push({
            id: `project-${project.id}`,
            type: 'project',
            title: project.name,
            description: project.description,
            createdAt: project.createdAt,
          })
        }
      })

      // Search tasks
      allTasks?.forEach(task => {
        const project = projects?.find(p => p.id === task.projectId)
        if (
          task.title.toLowerCase().includes(lowerQuery) ||
          task.description?.toLowerCase().includes(lowerQuery) ||
          project?.name.toLowerCase().includes(lowerQuery)
        ) {
          searchResults.push({
            id: `task-${task.id}`,
            type: 'task',
            title: task.title,
            description: task.description,
            projectName: project?.name,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            createdAt: task.createdAt,
          })
        }
      })

      // Search AI prompts
      prompts?.forEach(prompt => {
        if (
          prompt.prompt.toLowerCase().includes(lowerQuery) ||
          prompt.response.toLowerCase().includes(lowerQuery)
        ) {
          const project = projects?.find(p => p.id === prompt.projectId)
          searchResults.push({
            id: `prompt-${prompt.id}`,
            type: 'prompt',
            title: prompt.prompt.substring(0, 50) + '...',
            description: prompt.response.substring(0, 100) + '...',
            projectName: project?.name,
            createdAt: prompt.createdAt,
          })
        }
      })

      // Sort by relevance and recency
      searchResults.sort((a, b) => {
        const aScore = a.title.toLowerCase().includes(lowerQuery) ? 2 : 1
        const bScore = b.title.toLowerCase().includes(lowerQuery) ? 2 : 1
        if (aScore !== bScore) return bScore - aScore
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })

      setResults(searchResults.slice(0, 10))
    },
    [projects, allTasks, prompts]
  )

  useEffect(() => {
    performSearch(query)
  }, [query, performSearch])

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'task':
        return <CheckSquare className="h-4 w-4 text-green-500" />
      case 'prompt':
        return <Hash className="h-4 w-4 text-purple-500" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case 'project':
        return `/projects/${result.id.split('-')[1]}`
      case 'task':
        const task = allTasks?.find(t => t.id.toString() === result.id.split('-')[1])
        return task ? `/projects/${task.projectId}` : '/dashboard'
      case 'prompt':
        return '/dashboard'
      default:
        return '/dashboard'
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700'
      case 'medium':
        return 'bg-orange-100 text-orange-700'
      case 'low':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-700'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700'
      case 'todo':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative w-full max-w-sm justify-start text-muted-foreground">
          <Search className="mr-2 h-4 w-4" />
          Search projects, tasks...
          <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Everything</DialogTitle>
          <DialogDescription>
            Search across projects, tasks, and AI conversations
          </DialogDescription>
        </DialogHeader>
        
        <Command>
          <CommandInput
            placeholder="Type to search..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-96">
            {results.length === 0 && query ? (
              <CommandEmpty>No results found for "{query}"</CommandEmpty>
            ) : (
              <>
                {results.filter(r => r.type === 'project').length > 0 && (
                  <CommandGroup heading="Projects">
                    {results
                      .filter(r => r.type === 'project')
                      .map(result => (
                        <CommandItem key={result.id} asChild>
                          <Link
                            href={getResultLink(result)}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 p-3 cursor-pointer"
                          >
                            {getResultIcon(result.type)}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{result.title}</p>
                              {result.description && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {result.description}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                Created {formatDistanceToNow(new Date(result.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </Link>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}

                {results.filter(r => r.type === 'task').length > 0 && (
                  <CommandGroup heading="Tasks">
                    {results
                      .filter(r => r.type === 'task')
                      .map(result => (
                        <CommandItem key={result.id} asChild>
                          <Link
                            href={getResultLink(result)}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 p-3 cursor-pointer"
                          >
                            {getResultIcon(result.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium truncate">{result.title}</p>
                                {result.priority && (
                                  <Badge className={`text-xs ${getPriorityColor(result.priority)}`}>
                                    {result.priority}
                                  </Badge>
                                )}
                                {result.status && (
                                  <Badge className={`text-xs ${getStatusColor(result.status)}`}>
                                    {result.status.replace('_', ' ')}
                                  </Badge>
                                )}
                              </div>
                              {result.projectName && (
                                <p className="text-xs text-muted-foreground">
                                  in {result.projectName}
                                </p>
                              )}
                              {result.dueDate && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Due {formatDistanceToNow(new Date(result.dueDate), { addSuffix: true })}
                                </p>
                              )}
                            </div>
                          </Link>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}

                {results.filter(r => r.type === 'prompt').length > 0 && (
                  <CommandGroup heading="AI Conversations">
                    {results
                      .filter(r => r.type === 'prompt')
                      .map(result => (
                        <CommandItem key={result.id} asChild>
                          <Link
                            href={getResultLink(result)}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 p-3 cursor-pointer"
                          >
                            {getResultIcon(result.type)}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{result.title}</p>
                              {result.description && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {result.description}
                                </p>
                              )}
                              {result.projectName && (
                                <p className="text-xs text-muted-foreground">
                                  in {result.projectName}
                                </p>
                              )}
                            </div>
                          </Link>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}