import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getProject, getMentor, updateProject, getMentorFeedback } from "@/lib/api";
import { ArrowLeft, Save, FileMusic, MessageSquare, Loader2 } from "lucide-react";
import type { Project } from "@shared/schema";

const ProjectDetailPage = () => {
  const [match, params] = useRoute<{ id: string }>("/projects/:id");
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("lyrics");
  const [content, setContent] = useState({
    lyrics: "",
    notes: "",
    reflections: ""
  });
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    feedback: string;
    suggestions: string[];
    score: number;
  } | null>(null);
  
  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }
  
  // Get project details
  const { 
    data: project, 
    isLoading: projectLoading,
    error: projectError 
  } = useQuery({
    queryKey: ['project', params?.id],
    queryFn: () => getProject(parseInt(params?.id || "0")),
    enabled: !!params?.id,
    onSuccess: (data) => {
      // Initialize content from stored project data
      if (data.content) {
        try {
          const projectContent = data.content as Record<string, any>;
          setContent({
            lyrics: projectContent.lyrics || "",
            notes: projectContent.notes || "",
            reflections: projectContent.reflections || ""
          });
        } catch (e) {
          console.error("Error parsing project content:", e);
        }
      }
    }
  });
  
  // Get mentor info
  const { 
    data: mentor,
    isLoading: mentorLoading 
  } = useQuery({
    queryKey: ['mentor', project?.mentorId],
    queryFn: () => getMentor(project!.mentorId),
    enabled: !!project,
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: (updatedProject: { id: number, content: any }) => 
      updateProject(updatedProject.id, { content: updatedProject.content }),
    onSuccess: () => {
      toast({
        title: "Project saved",
        description: "Your project has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['project', params?.id] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to save project",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  });

  // Save project content
  const handleSave = () => {
    if (!project) return;
    
    updateProjectMutation.mutate({
      id: project.id,
      content: content
    });
  };

  // Get AI feedback on content
  const handleGetFeedback = async () => {
    if (!project || !activeTab || !content[activeTab]) return;
    
    try {
      setIsFeedbackLoading(true);
      
      const feedbackResponse = await getMentorFeedback({
        content: content[activeTab],
        type: activeTab === "lyrics" ? "lyrics" : "general",
        projectId: project.id
      });
      
      setFeedback(feedbackResponse);
      
      toast({
        title: "Feedback received",
        description: "Your mentor has provided feedback on your work",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to get feedback",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading project...</p>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <FileMusic className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Project Not Found</h1>
          <p className="text-gray-400 mb-6">This project doesn't exist or couldn't be loaded</p>
          <Button 
            variant="outline" 
            className="border-purple-700 text-purple-400"
            onClick={() => navigate('/projects')}
          >
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(project.updatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 py-4 px-6 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="p-0 mr-2" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{project.title}</h1>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">
                Last updated: {formattedDate}
              </span>
              {project.genre && (
                <Badge className="bg-gray-800 text-xs">
                  {project.genre}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-700 text-white"
            onClick={() => navigate(`/feedback/${project.id}`)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Mentor Feedback
          </Button>
          <Button
            className="bg-purple-700 hover:bg-purple-800"
            onClick={handleSave}
            disabled={updateProjectMutation.isPending}
          >
            {updateProjectMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Project Description */}
      {project.description && (
        <div className="bg-gray-900/50 py-4 px-6 border-b border-gray-800">
          <p className="text-gray-300">{project.description}</p>
          {mentor && (
            <div className="mt-2 text-sm">
              <span className="text-gray-400">Mentor: </span>
              <span className="text-purple-400">{mentor.name}</span>
            </div>
          )}
        </div>
      )}

      {/* Project Content */}
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Left side - Editor */}
        <div className="md:col-span-2">
          <Tabs defaultValue="lyrics" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 bg-gray-900">
              <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
              <TabsTrigger value="notes">Music Notes</TabsTrigger>
              <TabsTrigger value="reflections">Reflections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="lyrics" className="mt-4">
              <Textarea 
                className="min-h-[60vh] bg-gray-900 border-gray-800 text-white resize-none p-4"
                placeholder="Write your lyrics here..."
                value={content.lyrics}
                onChange={(e) => setContent({ ...content, lyrics: e.target.value })}
              />
            </TabsContent>
            
            <TabsContent value="notes" className="mt-4">
              <Textarea 
                className="min-h-[60vh] bg-gray-900 border-gray-800 text-white resize-none p-4"
                placeholder="Add music notes, chord progressions, production ideas..."
                value={content.notes}
                onChange={(e) => setContent({ ...content, notes: e.target.value })}
              />
            </TabsContent>
            
            <TabsContent value="reflections" className="mt-4">
              <Textarea 
                className="min-h-[60vh] bg-gray-900 border-gray-800 text-white resize-none p-4"
                placeholder="Reflect on your creative process, inspirations, or challenges..."
                value={content.reflections}
                onChange={(e) => setContent({ ...content, reflections: e.target.value })}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              className="border-gray-700 text-white"
              onClick={handleSave}
              disabled={updateProjectMutation.isPending}
            >
              {updateProjectMutation.isPending ? "Saving..." : "Save Draft"}
            </Button>
            
            <Button
              className="bg-purple-700 hover:bg-purple-800"
              onClick={handleGetFeedback}
              disabled={isFeedbackLoading || !content[activeTab]}
            >
              {isFeedbackLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Getting Feedback...
                </>
              ) : (
                "Get Mentor Feedback"
              )}
            </Button>
          </div>
        </div>
        
        {/* Right side - Feedback */}
        <div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-800 p-4 border-b border-gray-700">
              <h2 className="font-semibold">Mentor Feedback</h2>
              {mentor && (
                <p className="text-sm text-gray-400">From {mentor.name}</p>
              )}
            </div>
            
            <div className="p-4">
              {!feedback ? (
                <div className="text-center py-12 text-gray-400">
                  {isFeedbackLoading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin mb-4" />
                      <p>Your mentor is analyzing your work...</p>
                    </div>
                  ) : (
                    <>
                      <p className="mb-4">No feedback yet</p>
                      <p className="text-sm">
                        Write some content and click "Get Mentor Feedback" 
                        to receive personalized insights
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-1">Overall Feedback</h3>
                    <p className="text-gray-300 text-sm">{feedback.feedback}</p>
                  </div>
                  
                  {feedback.score && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-1">Score</h3>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-800 rounded-full h-2.5">
                          <div 
                            className="bg-purple-600 h-2.5 rounded-full" 
                            style={{ width: `${(feedback.score / 10) * 100}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm font-medium text-white">{feedback.score}/10</span>
                      </div>
                    </div>
                  )}
                  
                  {feedback.suggestions && feedback.suggestions.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Suggestions</h3>
                      <ul className="space-y-2">
                        {feedback.suggestions.map((suggestion, index) => (
                          <li key={index} className="bg-gray-800 p-3 rounded text-sm text-gray-300">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleGetFeedback} 
                    className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    Get New Feedback
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;