import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Folder, Calendar, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatDistanceToNow } from 'date-fns'

interface Project {
  id: string
  title: string
  description: string | null
  status: string
  owner_id: string
  created_at: string
  updated_at: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const { toast } = useToast()

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching projects:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch projects',
          variant: 'destructive',
        })
      } else {
        setProjects(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const createProject = async () => {
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Project title is required',
        variant: 'destructive',
      })
      return
    }

    setCreating(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to create projects',
          variant: 'destructive',
        })
        return
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([{ 
          title: title.trim(), 
          description: description.trim() || null, 
          owner_id: user.id 
        }])
        .select()

      if (error) {
        console.error('Error creating project:', error)
        toast({
          title: 'Error',
          description: 'Failed to create project',
          variant: 'destructive',
        })
      } else {
        setTitle('')
        setDescription('')
        toast({
          title: 'Success',
          description: 'Project created successfully',
        })
        fetchProjects()
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      })
    } finally {
      setCreating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
            <p className="text-gray-600">Create and manage your projects</p>
          </div>

          {/* Create Project Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Project title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Project description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full"
                  />
                </div>
                <Button 
                  onClick={createProject} 
                  disabled={creating || !title.trim()}
                  className="w-full sm:w-auto"
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Folder className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first project to get started with task management
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {project.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {project.description}
                      </p>
                    )}
                    
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span>Owner: {project.owner_id}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}