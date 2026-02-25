import { useState, useMemo } from "react";
import { useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { TabNavigation } from "@/components/TabNavigation";
import { ProjectBoard } from "@/components/ProjectBoard";
import { useProject, useUpdateProject, useDeleteProject } from "@/hooks/useProjects";
import { useProjectTasks } from "@/hooks/useTasks";
import { usePrompts } from "@/hooks/useAI";
import { TaskCard } from "@/components/TaskCard";
import { AITracker } from "@/components/AITracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Clock, Lightbulb, User, Edit, Trash2, Calendar, CheckCircle, AlertCircle, MoreHorizontal } from "lucide-react";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from "@/hooks/use-toast";

export default function ProjectView() {
  const [, params] = useRoute("/project/:id");
  const projectId = parseInt(params?.id || "0");
  const [activeTab, setActiveTab] = useState("board");
  const { toast } = useToast();

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: tasks = [], isLoading: tasksLoading } = useProjectTasks(projectId);
  const { data: prompts = [], isLoading: promptsLoading } = usePrompts({ projectId });
  const deleteProject = useDeleteProject();

  const projectStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
    const todoTasks = tasks.filter(task => task.status === 'todo').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const overdueTasks = tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
    ).length;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      progress,
      overdueTasks
    };
  }, [tasks]);

  const handleDeleteProject = async () => {
    if (window.confirm(`Are you sure you want to delete "${project?.name}"? This action cannot be undone.`)) {
      try {
        await deleteProject.mutateAsync(projectId);
        toast({
          title: 'Success',
          description: 'Project deleted successfully',
        });
        // Navigate back to projects list
        window.location.href = '/projects';
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete project',
          variant: 'destructive',
        });
      }
    }
  };

  if (projectLoading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-vnx-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-vnx-gray-600">Loading project...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-vnx-gray-900 mb-4">Project Not Found</h1>
            <p className="text-vnx-gray-600">The project you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "board":
        return <ProjectBoard projectId={projectId} />;
      
      case "list":
        return (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-vnx-gray-900 mb-6">All Tasks</h3>
              
              {tasksLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-vnx-gray-100 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-vnx-gray-500">No tasks yet. Create your first task!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map(task => (
                    <div key={task.id} className="bg-white">
                      <TaskCard task={task} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      case "prompts":
        return (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-vnx-gray-900 mb-6">AI Prompt History</h3>
              
              {promptsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-vnx-gray-100 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : prompts.length === 0 ? (
                <div className="text-center py-12">
                  <Lightbulb className="w-12 h-12 text-vnx-gray-300 mx-auto mb-4" />
                  <p className="text-vnx-gray-500">No AI conversations yet. Open the AI Helper to get started!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {prompts.map(prompt => (
                    <Card key={prompt.id}>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* User Question */}
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-vnx-blue rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-vnx-gray-900 mb-1">You asked:</p>
                              <p className="text-vnx-gray-700">{prompt.prompt}</p>
                            </div>
                          </div>
                          
                          {/* AI Response */}
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-vnx-teal rounded-full flex items-center justify-center flex-shrink-0">
                              <Lightbulb className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-vnx-gray-900 mb-1">AI Response:</p>
                              <p className="text-vnx-gray-700">{prompt.response}</p>
                            </div>
                          </div>
                          
                          {/* Metadata */}
                          <div className="flex items-center justify-between pt-4 border-t border-vnx-gray-200">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-vnx-gray-400" />
                              <span className="text-sm text-vnx-gray-500">
                                {format(new Date(prompt.createdAt), "MMM d, yyyy 'at' h:mm a")}
                              </span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {prompt.context}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      case "ai-insights":
        return (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <AITracker />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Layout currentProject={project}>
      {/* Project Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              {project.description && (
                <p className="text-gray-600 mt-1">{project.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link href="/projects">
              <Button variant="outline" size="sm">
                Back to Projects
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteProject}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Completed</p>
                <p className="font-semibold">{projectStats.completedTasks}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">In Progress</p>
                <p className="font-semibold">{projectStats.inProgressTasks}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">To Do</p>
                <p className="font-semibold">{projectStats.todoTasks}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-xs text-gray-600">Overdue</p>
                <p className="font-semibold">{projectStats.overdueTasks}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-600" />
              <div>
                <p className="text-xs text-gray-600">Progress</p>
                <p className="font-semibold">{projectStats.progress}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{projectStats.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: project.color,
                width: `${projectStats.progress}%`,
              }}
            />
          </div>
        </div>
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTabContent()}
    </Layout>
  );
}
