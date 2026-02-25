import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getProject, getMentor, getUserProjects, getMentors, getMentorFeedback } from "@/lib/api";
import { ArrowLeft, Sparkles, Loader2, Check } from "lucide-react";
import type { Mentor, Project } from "@shared/schema";

const FeedbackPage = () => {
  const [match, params] = useRoute<{ projectId: string }>("/feedback/:projectId?");
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // State
  const [selectedProjectId, setSelectedProjectId] = useState<string>(params?.projectId || "");
  const [selectedMentorId, setSelectedMentorId] = useState<string>("");
  const [contentType, setContentType] = useState<"lyrics" | "beat" | "performance" | "general">("lyrics");
  const [content, setContent] = useState("");
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    feedback: string;
    suggestions: string[];
    score: number;
    mentorId: number;
  } | null>(null);
  
  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }
  
  // Get user projects
  const { 
    data: projects = [],
    isLoading: projectsLoading
  } = useQuery({
    queryKey: ['projects', user.id],
    queryFn: () => getUserProjects(user.id),
    enabled: !!user,
  });
  
  // Get selected project details
  const { 
    data: selectedProject,
  } = useQuery({
    queryKey: ['project', selectedProjectId],
    queryFn: () => getProject(parseInt(selectedProjectId)),
    enabled: !!selectedProjectId,
    onSuccess: (data) => {
      if (data && !selectedMentorId) {
        setSelectedMentorId(data.mentorId.toString());
      }
      
      // Pre-fill content if project has content
      if (data?.content) {
        try {
          const projectContent = data.content as Record<string, any>;
          if (projectContent.lyrics && contentType === "lyrics") {
            setContent(projectContent.lyrics);
          }
        } catch (e) {
          console.error("Error parsing project content:", e);
        }
      }
    }
  });
  
  // Get mentors
  const { 
    data: mentors = [],
    isLoading: mentorsLoading
  } = useQuery({
    queryKey: ['mentors'],
    queryFn: getMentors,
  });
  
  // Get selected mentor
  const { 
    data: selectedMentor 
  } = useQuery({
    queryKey: ['mentor', selectedMentorId],
    queryFn: () => getMentor(parseInt(selectedMentorId)),
    enabled: !!selectedMentorId,
  });

  // Get feedback from mentor
  const handleGetFeedback = async () => {
    if (!content.trim() || !contentType) {
      toast({
        variant: "destructive",
        title: "Missing content",
        description: "Please enter some content to get feedback on.",
      });
      return;
    }
    
    try {
      setIsFeedbackLoading(true);
      
      const feedbackResponse = await getMentorFeedback({
        content,
        type: contentType,
        projectId: selectedProjectId ? parseInt(selectedProjectId) : undefined
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 py-4 px-6 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="p-0 mr-2" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Button>
          <h1 className="text-xl font-bold">Get Mentor Feedback</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 space-y-4">
                {/* Project Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Project (Optional)
                  </label>
                  <Select 
                    value={selectedProjectId} 
                    onValueChange={setSelectedProjectId}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Choose a project" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="">No project (standalone feedback)</SelectItem>
                      {projectsLoading ? (
                        <SelectItem value="loading" disabled>Loading projects...</SelectItem>
                      ) : projects.length === 0 ? (
                        <SelectItem value="none" disabled>No projects available</SelectItem>
                      ) : (
                        projects.map(project => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Mentor Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Choose Mentor
                  </label>
                  <Select 
                    value={selectedMentorId} 
                    onValueChange={setSelectedMentorId}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select a mentor" />
                    </SelectTrigger>
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
                </div>
                
                {/* Content Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content Type
                  </label>
                  <Select 
                    value={contentType} 
                    onValueChange={(value) => setContentType(value as any)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Type of content" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="lyrics">Lyrics</SelectItem>
                      <SelectItem value="beat">Beat/Production</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="general">General Idea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Content
                  </label>
                  <Textarea 
                    className="min-h-[200px] bg-gray-800 border-gray-700 text-white resize-none"
                    placeholder={
                      contentType === "lyrics" ? "Enter your lyrics here..." :
                      contentType === "beat" ? "Describe your beat or production..." :
                      contentType === "performance" ? "Describe your performance or recording..." :
                      "Describe your creative idea or concept..."
                    }
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                
                {/* Submit Button */}
                <Button
                  className="w-full bg-purple-700 hover:bg-purple-800"
                  onClick={handleGetFeedback}
                  disabled={isFeedbackLoading || !content.trim() || !selectedMentorId}
                >
                  {isFeedbackLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Feedback...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get Mentor Feedback
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Feedback Display */}
          <div>
            <div className="sticky top-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  {/* Mentor Info */}
                  {selectedMentor ? (
                    <div className="mb-4 pb-4 border-b border-gray-800">
                      <h2 className="font-semibold">{selectedMentor.name}</h2>
                      <p className="text-sm text-gray-400">{selectedMentor.description.substring(0, 100)}...</p>
                    </div>
                  ) : (
                    <div className="mb-4 pb-4 border-b border-gray-800">
                      <h2 className="font-semibold text-gray-400">Select a Mentor</h2>
                      <p className="text-sm text-gray-500">Choose a mentor to get personalized feedback</p>
                    </div>
                  )}
                  
                  {/* Feedback Display */}
                  <div>
                    <h3 className="font-medium mb-3">Feedback</h3>
                    
                    {!feedback ? (
                      <div className="text-center py-6">
                        {isFeedbackLoading ? (
                          <div className="flex flex-col items-center">
                            <Loader2 className="h-8 w-8 animate-spin mb-2 text-purple-400" />
                            <p className="text-sm text-gray-400">Analyzing your work...</p>
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm">Submit your content to get feedback</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-300 text-sm">{feedback.feedback}</p>
                        </div>
                        
                        {feedback.score && (
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Score
                            </label>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-800 rounded-full h-2.5">
                                <div 
                                  className="bg-purple-600 h-2.5 rounded-full" 
                                  style={{ width: `${(feedback.score / 10) * 100}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm font-medium text-white">{feedback.score}/10</span>
                            </div>
                          </div>
                        )}
                        
                        {feedback.suggestions && feedback.suggestions.length > 0 && (
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">
                              Suggestions
                            </label>
                            <ul className="space-y-2">
                              {feedback.suggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                                  <Check className="h-4 w-4 text-purple-400 mt-0.5" />
                                  <span>{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;