import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getUserProjects, getMentors, createProject } from "@/lib/api";
import { ArrowLeft, Plus, FileMusic, Loader2, LayoutGrid, List, Search } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Project, Mentor } from "@shared/schema";

// Form schema for new project
const newProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  genre: z.string().optional(),
  mentorId: z.string().min(1, "Please select a mentor"),
});

type NewProjectValues = z.infer<typeof newProjectSchema>;

const ProjectsPage = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  // Get user projects
  const { 
    data: projects = [], 
    isLoading: projectsLoading,
    error: projectsError 
  } = useQuery({
    queryKey: ['projects', user.id],
    queryFn: () => getUserProjects(user.id),
    enabled: !!user,
  });

  // Get mentors for project creation
  const { 
    data: mentors = [], 
    isLoading: mentorsLoading 
  } = useQuery({
    queryKey: ['mentors'],
    queryFn: getMentors,
  });

  // Filter projects based on search
  const filteredProjects = projects.filter(project => {
    return searchQuery === "" || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.genre && project.genre.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Form for new project
  const form = useForm<NewProjectValues>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      mentorId: "",
    },
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast({
        title: "Project created",
        description: "Your new project has been created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['projects', user.id] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create project",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  });

  const onSubmit = (values: NewProjectValues) => {
    if (!user) return;
    
    createProjectMutation.mutate({
      userId: user.id,
      mentorId: parseInt(values.mentorId),
      title: values.title,
      description: values.description || null,
      genre: values.genre || null,
      status: "in_progress",
      content: null
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 py-4 px-6 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="p-0 mr-2" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Button>
          <h1 className="text-xl font-bold">My Projects</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-700 hover:bg-purple-800">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription className="text-gray-400">
                Start a new creative project with a mentor's guidance
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Project Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="My Amazing Song"
                        />
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
                      <FormLabel className="text-gray-300">Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="bg-gray-800 border-gray-700 text-white resize-none min-h-[100px]"
                          placeholder="What's this project about?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Genre (optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="Hip-Hop, R&B, Pop, etc."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mentorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Select Mentor</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Choose a mentor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {mentorsLoading ? (
                            <SelectItem value="loading" disabled>Loading mentors...</SelectItem>
                          ) : mentors.length === 0 ? (
                            <SelectItem value="none" disabled>No mentors available</SelectItem>
                          ) : (
                            mentors.map(mentor => (
                              <SelectItem key={mentor.id} value={mentor.id.toString()}>
                                {mentor.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-purple-700 hover:bg-purple-800"
                    disabled={createProjectMutation.isPending}
                  >
                    {createProjectMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Project"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        {/* Search and view controls */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              className="bg-gray-800 border-gray-700 pl-10 text-white placeholder:text-gray-500 w-full md:max-w-md"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm mr-2">View:</span>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className={viewMode === "grid" ? "bg-gray-800" : "text-gray-400"}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className={viewMode === "list" ? "bg-gray-800" : "text-gray-400"}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Projects display */}
        {projectsLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading projects...</p>
          </div>
        ) : projectsError ? (
          <div className="text-center py-12">
            <p className="text-red-400">Error loading projects</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FileMusic className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            {searchQuery ? (
              <>
                <p className="text-gray-400 mb-2">No projects matching "{searchQuery}"</p>
                <Button 
                  variant="outline" 
                  className="mt-2 border-gray-700"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <p className="text-gray-400 mb-6">You don't have any projects yet</p>
                <Button 
                  className="bg-purple-700 hover:bg-purple-800"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Project
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
          }>
            {filteredProjects.map(project => (
              viewMode === "grid" ? (
                <ProjectGridCard 
                  key={project.id} 
                  project={project} 
                  onClick={() => navigate(`/projects/${project.id}`)} 
                />
              ) : (
                <ProjectListItem
                  key={project.id}
                  project={project}
                  onClick={() => navigate(`/projects/${project.id}`)}
                />
              )
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectGridCard = ({ project, onClick }: ProjectCardProps) => {
  const date = new Date(project.updatedAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800/80 transition-colors cursor-pointer overflow-hidden" onClick={onClick}>
      <div className="h-3 bg-purple-700" />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <CardDescription className="text-gray-400">
          Last updated: {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-gray-300 text-sm line-clamp-2">
          {project.description || "No description"}
        </p>
        {project.genre && (
          <div className="mt-3">
            <Badge className="bg-gray-800 text-gray-300 hover:bg-gray-700">
              {project.genre}
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-800 pt-3">
        <div className="flex items-center text-xs text-purple-400 w-full justify-between">
          <div className="flex items-center">
            <FileMusic className="h-3 w-3 mr-1" />
            {project.status === "in_progress" ? "In Progress" : project.status === "completed" ? "Completed" : "Archived"}
          </div>
          <span className="text-gray-500">ID: {project.id}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

const ProjectListItem = ({ project, onClick }: ProjectCardProps) => {
  const date = new Date(project.updatedAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800/80 transition-colors cursor-pointer overflow-hidden" onClick={onClick}>
      <div className="flex">
        <div className="w-2 bg-purple-700" />
        <div className="flex flex-1 p-4 justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">{project.title}</h3>
            <p className="text-gray-400 text-sm">
              {project.genre ? `${project.genre} • ` : ""}Last updated: {formattedDate}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`
              ${project.status === 'in_progress' ? 'bg-blue-900/40 text-blue-300' : 
                project.status === 'completed' ? 'bg-green-900/40 text-green-300' : 
                'bg-gray-800 text-gray-300'}
            `}>
              {project.status === "in_progress" ? "In Progress" : project.status === "completed" ? "Completed" : "Archived"}
            </Badge>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectsPage;