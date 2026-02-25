import { useState, useMemo } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, CheckCircle, Clock, TrendingUp, Users, FolderOpen, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { useProjects } from '@/hooks/useProjects';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  
  // Get all tasks across projects for dashboard metrics
  const { data: allTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks/all'],
    queryFn: async () => {
      if (!projects?.length) return [];
      const taskPromises = projects.map(project => api.getProjectTasks(project.id));
      const taskArrays = await Promise.all(taskPromises);
      return taskArrays.flat();
    },
    enabled: !!projects?.length,
  });

  const stats = useMemo(() => {
    if (!projects || !allTasks) return { activeProjects: 0, completedTasks: 0, pendingTasks: 0, productivity: 0 };
    
    const completedTasks = allTasks.filter(task => task.status === 'done').length;
    const pendingTasks = allTasks.filter(task => task.status !== 'done').length;
    const productivity = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;
    
    return {
      activeProjects: projects.length,
      completedTasks,
      pendingTasks,
      productivity
    };
  }, [projects, allTasks]);

  const todayTasks = useMemo(() => {
    if (!allTasks) return [];
    const today = new Date().toISOString().split('T')[0];
    return allTasks.filter(task => task.dueDate?.startsWith(today)).slice(0, 3);
  }, [allTasks]);

  const recentProjects = useMemo(() => {
    if (!projects) return [];
    return [...projects]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);
  }, [projects]);

  if (projectsLoading || tasksLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.user_metadata?.first_name || 'there'}!
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your projects today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProjects}</div>
              <p className="text-xs text-muted-foreground">Active projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedTasks}</div>
              <p className="text-xs text-muted-foreground">Tasks completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingTasks}</div>
              <p className="text-xs text-muted-foreground">{todayTasks.length} due today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productivity</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.productivity}%</div>
              <p className="text-xs text-muted-foreground">Completion rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Projects
                <Link href="/projects">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>Your most recently active projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => {
                  const projectTasks = allTasks?.filter(task => task.projectId === project.id) || [];
                  const completedTasks = projectTasks.filter(task => task.status === 'done').length;
                  const progressPercentage = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;
                  const lastUpdated = new Date(project.updatedAt).toLocaleDateString();
                  
                  return (
                    <Link key={project.id} href={`/project/${project.id}`}>
                      <div className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: project.color }}></div>
                        <div className="flex-1">
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-gray-600">{projectTasks.length} tasks • Updated {lastUpdated}</p>
                        </div>
                        <div className="text-sm text-gray-500">{progressPercentage}%</div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FolderOpen className="h-8 w-8 mx-auto mb-2" />
                  <p>No projects yet</p>
                  <Link href="/projects">
                    <Button variant="outline" size="sm" className="mt-2">
                      Create your first project
                    </Button>  
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Today's Tasks
              </CardTitle>
              <CardDescription>Tasks scheduled for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayTasks.length > 0 ? (
                todayTasks.map((task) => {
                  const project = projects?.find(p => p.id === task.projectId);
                  const priorityColors = {
                    high: 'border-red-500',
                    medium: 'border-yellow-500',
                    low: 'border-green-500'
                  };
                  const dueTime = task.dueDate ? new Date(task.dueDate).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  }) : '';
                  
                  return (
                    <div key={task.id} className={`flex items-center space-x-3 p-3 border rounded-lg ${
                      task.status === 'done' ? 'bg-green-50' : 'hover:bg-gray-50'
                    }`}>
                      {task.status === 'done' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className={`w-4 h-4 border-2 rounded ${priorityColors[task.priority]}`}></div>
                      )}
                      <div className="flex-1">
                        <h4 className={`font-medium ${task.status === 'done' ? 'text-green-800' : ''}`}>
                          {task.title}
                        </h4>
                        <p className={`text-sm ${task.status === 'done' ? 'text-green-600' : 'text-gray-600'}`}>
                          {project?.name} • {task.priority} priority
                        </p>
                      </div>
                      <div className={`text-xs ${task.status === 'done' ? 'text-green-500' : 'text-gray-500'}`}>
                        {task.status === 'done' ? 'Done' : `Due ${dueTime}`}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2" />
                  <p>No tasks due today</p>
                  <p className="text-sm">Great job staying on top of things!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/projects">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <Plus className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Create Project</div>
                    <div className="text-sm text-gray-600">Start a new project</div>
                  </div>
                </Button>
              </Link>
              
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <Clock className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Add Task</div>
                  <div className="text-sm text-gray-600">Create a quick task</div>
                </div>
              </Button>
              
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <Users className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Invite Team</div>
                  <div className="text-sm text-gray-600">Add team members</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;