import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useLocation } from 'wouter'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { 
  Users, 
  Shield, 
  Settings, 
  TrendingUp, 
  Search,
  Crown,
  UserCheck,
  AlertTriangle,
  FolderOpen,
  Mail,
  Send,
  BarChart3
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface UserProfile {
  id: string
  email: string
  subscription: 'free' | 'pro' | 'premium'
  is_admin: boolean
  role: 'user' | 'admin' | 'super_admin'
  created_at: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

interface ProjectOverview {
  id: number
  name: string
  description: string
  owner_id: string
  owner_name: string
  task_count: number
  completed_tasks: number
  created_at: string
  status: 'active' | 'completed' | 'archived'
}

interface EmailInvite {
  email: string
  role: 'user' | 'admin'
  message?: string
}

export default function AdminPanel() {
  const { user, userRole, loading: authLoading } = useAuth()
  const [, setLocation] = useLocation()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
  const [projects, setProjects] = useState<ProjectOverview[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [announcement, setAnnouncement] = useState('')
  const [announcementTitle, setAnnouncementTitle] = useState('')
  const [activeTab, setActiveTab] = useState('users')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'user' | 'admin'>('user')
  const [inviteMessage, setInviteMessage] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && userRole !== 'super_admin') {
      setLocation('/') // redirect home
    }
  }, [userRole, authLoading, setLocation])

  useEffect(() => {
    checkAdminAccess()
  }, [])

  // Show loading while checking auth
  if (authLoading) {
    return (
      <Layout>
        <div className="p-6 flex justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Redirect if not super admin
  if (userRole !== 'super_admin') {
    return null
  }

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.user_metadata?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.includes(searchQuery)
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchQuery, users])

  const checkAdminAccess = async () => {
    try {
      if (!user) {
        setLocation('/login')
        return
      }

      const isAdmin = user?.user_metadata?.is_admin || user?.app_metadata?.is_admin
      
      if (!isAdmin) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges',
          variant: 'destructive',
        })
        setLocation('/dashboard')
        return
      }

      loadDemoData()
    } catch (error) {
      console.error('Error checking admin access:', error)
      setLocation('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const loadDemoData = () => {
    const demoUsers: UserProfile[] = [
      {
        id: 'demo-admin-123',
        email: 'admin@nexustracker.com',
        subscription: 'premium',
        is_admin: true,
        role: 'super_admin',
        created_at: new Date().toISOString(),
        user_metadata: { full_name: 'Demo Admin' }
      },
      {
        id: 'demo-user-456',
        email: 'john@example.com',
        subscription: 'pro',
        is_admin: false,
        role: 'user',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        user_metadata: { full_name: 'John Smith' }
      },
      {
        id: 'demo-user-789',
        email: 'jane@example.com',
        subscription: 'free',
        is_admin: false,
        role: 'user',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        user_metadata: { full_name: 'Jane Doe' }
      },
      {
        id: 'demo-user-101',
        email: 'mike@company.com',
        subscription: 'pro',
        is_admin: true,
        role: 'admin',
        created_at: new Date(Date.now() - 259200000).toISOString(),
        user_metadata: { full_name: 'Mike Johnson' }
      },
      {
        id: 'demo-user-102',
        email: 'sarah@startup.com',
        subscription: 'free',
        is_admin: false,
        role: 'user',
        created_at: new Date(Date.now() - 345600000).toISOString(),
        user_metadata: { full_name: 'Sarah Wilson' }
      }
    ]

    const demoProjects: ProjectOverview[] = [
      {
        id: 1,
        name: 'Website Redesign',
        description: 'Modern website redesign with enhanced UX',
        owner_id: 'demo-user-456',
        owner_name: 'John Smith',
        task_count: 12,
        completed_tasks: 8,
        created_at: new Date(Date.now() - 604800000).toISOString(),
        status: 'active'
      },
      {
        id: 2,
        name: 'Mobile App Development',
        description: 'React Native mobile application',
        owner_id: 'demo-user-789',
        owner_name: 'Jane Doe',
        task_count: 25,
        completed_tasks: 15,
        created_at: new Date(Date.now() - 1209600000).toISOString(),
        status: 'active'
      },
      {
        id: 3,
        name: 'Marketing Campaign',
        description: 'Q1 digital marketing strategy',
        owner_id: 'demo-user-101',
        owner_name: 'Mike Johnson',
        task_count: 8,
        completed_tasks: 8,
        created_at: new Date(Date.now() - 2419200000).toISOString(),
        status: 'completed'
      }
    ]

    setUsers(demoUsers)
    setProjects(demoProjects)
    // Set user role to super_admin for demo
  }

  const updateUserSubscription = async (userId: string, newSubscription: 'free' | 'pro' | 'premium') => {
    try {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, subscription: newSubscription }
            : user
        )
      )

      toast({
        title: 'Success',
        description: `User subscription updated to ${newSubscription}`,
      })
    } catch (error) {
      console.error('Error updating user:', error)
      toast({
        title: 'Error',
        description: 'Failed to update user subscription',
        variant: 'destructive',
      })
    }
  }

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin' | 'super_admin') => {
    try {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                role: newRole,
                is_admin: newRole === 'admin' || newRole === 'super_admin'
              }
            : user
        )
      )

      toast({
        title: 'Success',
        description: `User role updated to ${newRole.replace('_', ' ')}`,
      })
    } catch (error) {
      console.error('Error updating user role:', error)
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      })
    }
  }

  const sendEmailInvite = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: 'Error',
        description: 'Email address is required',
        variant: 'destructive',
      })
      return
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Invite Sent',
        description: `Invitation sent to ${inviteEmail} as ${inviteRole}`,
      })
      
      setInviteEmail('')
      setInviteMessage('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      })
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-red-100 text-red-700">Super Admin</Badge>
      case 'admin':
        return <Badge className="bg-orange-100 text-orange-700">Admin</Badge>
      default:
        return <Badge variant="secondary">User</Badge>
    }
  }

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case 'pro':
        return <Badge className="bg-blue-100 text-blue-700">Pro</Badge>
      case 'premium':
        return <Badge className="bg-purple-100 text-purple-700">Premium</Badge>
      default:
        return <Badge variant="secondary">Free</Badge>
    }
  }

  const getProjectStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-700">Archived</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-700">Active</Badge>
    }
  }

  const getUserStats = () => {
    const total = users.length
    const admins = users.filter(u => u.is_admin).length
    const proUsers = users.filter(u => u.subscription === 'pro' || u.subscription === 'premium').length
    const freeUsers = users.filter(u => u.subscription === 'free').length
    
    return { total, admins, proUsers, freeUsers }
  }

  const getProjectStats = () => {
    const total = projects.length
    const active = projects.filter(p => p.status === 'active').length
    const completed = projects.filter(p => p.status === 'completed').length
    const totalTasks = projects.reduce((sum, p) => sum + p.task_count, 0)
    const completedTasks = projects.reduce((sum, p) => sum + p.completed_tasks, 0)
    
    return { total, active, completed, totalTasks, completedTasks }
  }

  const publishAnnouncement = () => {
    if (!announcementTitle.trim() || !announcement.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter both title and message',
        variant: 'destructive',
      })
      return
    }

    toast({
      title: 'Success',
      description: 'Announcement published successfully',
    })
    
    setAnnouncementTitle('')
    setAnnouncement('')
  }

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const stats = getUserStats()
  const projectStats = getProjectStats()

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-red-600" />
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            </div>
            <p className="text-gray-600">Comprehensive system management and user administration</p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">{stats.admins} admins</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectStats.active}</div>
                <p className="text-xs text-muted-foreground">{projectStats.total} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.proUsers}</div>
                <p className="text-xs text-muted-foreground">{stats.freeUsers} free users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projectStats.totalTasks > 0 
                    ? Math.round((projectStats.completedTasks / projectStats.totalTasks) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {projectStats.completedTasks}/{projectStats.totalTasks} tasks
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Project Overview
              </TabsTrigger>
              <TabsTrigger value="invites" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Invites
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                System Settings
              </TabsTrigger>
            </TabsList>

            {/* User Management Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Management
                    </CardTitle>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Subscription</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {user.user_metadata?.full_name || user.email}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                <div className="text-xs text-gray-400">{user.id.slice(0, 8)}...</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getRoleBadge(user.role)}
                            </TableCell>
                            <TableCell>
                              {getSubscriptionBadge(user.subscription)}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(user.created_at).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2 flex-wrap">
                                <Select 
                                  value={user.role} 
                                  onValueChange={(value) => updateUserRole(user.id, value as 'user' | 'admin' | 'super_admin')}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    {userRole === 'super_admin' && (
                                      <SelectItem value="super_admin">Super Admin</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                                <Select 
                                  value={user.subscription} 
                                  onValueChange={(value) => updateUserSubscription(user.id, value as 'free' | 'pro' | 'premium')}
                                >
                                  <SelectTrigger className="w-28">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="free">Free</SelectItem>
                                    <SelectItem value="pro">Pro</SelectItem>
                                    <SelectItem value="premium">Premium</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Project Overview Tab */}
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    Project Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Tasks</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{project.name}</div>
                                <div className="text-sm text-gray-500">{project.description}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{project.owner_name}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {project.completed_tasks}/{project.task_count}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ 
                                      width: `${project.task_count > 0 
                                        ? (project.completed_tasks / project.task_count) * 100 
                                        : 0}%` 
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {project.task_count > 0 
                                    ? Math.round((project.completed_tasks / project.task_count) * 100)
                                    : 0}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getProjectStatusBadge(project.status)}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(project.created_at).toLocaleDateString()}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Invites Tab */}
            <TabsContent value="invites">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Invitations
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Send invitations to new users and assign roles
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Role</label>
                      <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as 'user' | 'admin')}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Personal Message (Optional)</label>
                    <Textarea
                      placeholder="Add a personal message to the invitation..."
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button onClick={sendEmailInvite} className="w-full md:w-auto">
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Settings Tab */}
            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Global Announcement Title</label>
                      <Input
                        placeholder="Enter announcement title..."
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Global Announcement Message</label>
                      <Textarea
                        placeholder="Enter announcement message..."
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={publishAnnouncement} className="w-full sm:w-auto">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Publish Announcement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}