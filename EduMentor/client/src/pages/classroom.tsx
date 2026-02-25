import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { User } from "@/App";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { connectWebSocket, sendMessage, addMessageListener, removeMessageListener } from "@/lib/websocket";
import { useToast } from "@/hooks/use-toast";
import VideoPlayer from "@/components/classroom/video-player";
import InteractiveWhiteboard from "@/components/classroom/interactive-whiteboard";
import ChatInterface from "@/components/classroom/chat-interface";
import LanguageSelector from "@/components/common/language-selector";
import { Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClassroomProps {
  user: User;
  courseId: number;
  lessonId: number;
}

interface Message {
  id: string;
  type: "user" | "instructor";
  content: string;
  timestamp: Date;
  user?: {
    name: string;
  };
  instructor?: {
    name: string;
    image: string;
  };
}

interface SuggestedQuestion {
  id: string;
  text: string;
}

const Classroom = ({ user, courseId, lessonId }: ClassroomProps) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedInstructorId, setSelectedInstructorId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [question, setQuestion] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch course details
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: [`/api/courses/${courseId}`],
  });

  // Fetch lesson details
  const { data: lesson, isLoading: isLoadingLesson } = useQuery({
    queryKey: [`/api/courses/${courseId}/lessons/${lessonId}`],
  });

  // Fetch available instructors for this subject
  const { data: instructors, isLoading: isLoadingInstructors } = useQuery({
    queryKey: [`/api/user/${user.id}/instructors`],
  });

  // Update user progress
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { percentComplete: number }) => {
      return apiRequest(
        "POST", 
        `/api/user/${user.id}/progress`, 
        { courseId, lastLessonId: lessonId, percentComplete: data.percentComplete }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${user.id}/progress`] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    },
  });

  // Connect to WebSocket for real-time interaction
  useEffect(() => {
    const ws = connectWebSocket();

    // Join classroom session
    sendMessage({
      type: "classroom-join",
      userId: user.id,
      courseId,
      lessonId,
    });

    // Handle instructor responses
    const handleInstructorResponse = (data: any) => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `instructor-${Date.now()}`,
          type: "instructor",
          content: data.data.answer,
          timestamp: new Date(),
          instructor: {
            name: instructors?.find((i: any) => i.id === selectedInstructorId)?.name || "AI Instructor",
            image: instructors?.find((i: any) => i.id === selectedInstructorId)?.appearance || "",
          },
        },
      ]);
    };

    addMessageListener("instructor-response", handleInstructorResponse);

    // Generate initial suggested questions
    setSuggestedQuestions([
      { id: "q1", text: "Can you explain this concept in simpler terms?" },
      { id: "q2", text: "How is this applied in real-world scenarios?" },
      { id: "q3", text: "What are common mistakes to avoid with this topic?" },
    ]);

    // Update progress on component mount
    updateProgressMutation.mutate({ percentComplete: 10 });

    return () => {
      removeMessageListener("instructor-response", handleInstructorResponse);
    };
  }, [courseId, lessonId, user.id, selectedInstructorId, instructors]);

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Set default instructor if not yet selected
  useEffect(() => {
    if (instructors?.length > 0 && !selectedInstructorId) {
      setSelectedInstructorId(instructors[0].id);
    }
  }, [instructors, selectedInstructorId]);

  const handleSendQuestion = () => {
    if (!question.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        type: "user",
        content: question,
        timestamp: new Date(),
        user: {
          name: user.displayName,
        },
      },
    ]);

    // Show typing indicator
    setIsTyping(true);

    // Send question to WebSocket
    sendMessage({
      type: "ask-question",
      userId: user.id,
      courseId,
      lessonId,
      instructorId: selectedInstructorId,
      question,
    });

    // Generate new suggested questions based on the topic
    setSuggestedQuestions([
      { id: `sq-${Date.now()}-1`, text: "What are the prerequisites for this topic?" },
      { id: `sq-${Date.now()}-2`, text: "Can you provide a practice problem?" },
      { id: `sq-${Date.now()}-3`, text: "How will this be tested in the exam?" },
    ]);

    // Clear input
    setQuestion("");

    // Update progress (simulated progress increase)
    updateProgressMutation.mutate({ percentComplete: Math.min(100, (course?.progress || 0) + 5) });
  };

  const handleSuggestedQuestion = (text: string) => {
    setQuestion(text);
  };

  const handleVoiceInput = () => {
    toast({
      title: "Voice Input",
      description: "Voice recognition activated. Speak your question.",
    });
    // In a real implementation, this would activate the browser's speech recognition API
  };

  if (isLoadingCourse || isLoadingLesson || isLoadingInstructors) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-primary-600 animate-spin" />
          <p className="mt-4 text-neutral-600">Loading classroom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-10">
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-neutral-500"
          onClick={() => setLocation("/courses")}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Courses
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left Panel: Video Instructor */}
          <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-neutral-200">
            <div className="p-4 bg-neutral-800">
              <VideoPlayer
                lessonId={lessonId}
                courseId={courseId}
                instructorId={selectedInstructorId || 0}
                title={lesson?.title || ""}
                subTitle={course?.name || ""}
                instructorName={
                  instructors?.find((i: any) => i.id === selectedInstructorId)?.name ||
                  "AI Instructor"
                }
              />

              <Tabs defaultValue="whiteboard" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="whiteboard">Interactive Whiteboard</TabsTrigger>
                  <TabsTrigger value="notes">My Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="whiteboard" className="p-0">
                  <InteractiveWhiteboard lessonId={lessonId} />
                </TabsContent>
                <TabsContent value="notes" className="p-4 bg-white rounded-lg border border-neutral-200 min-h-[200px]">
                  <textarea 
                    className="w-full h-full min-h-[200px] bg-neutral-50 rounded-md p-2 text-sm" 
                    placeholder="Take notes here..."
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Panel: Chat Interaction */}
          <div className="md:col-span-1">
            <ChatInterface
              messages={messages}
              isTyping={isTyping}
              question={question}
              setQuestion={setQuestion}
              suggestedQuestions={suggestedQuestions}
              onSendQuestion={handleSendQuestion}
              onSuggestedQuestionClick={handleSuggestedQuestion}
              onVoiceInputClick={handleVoiceInput}
              chatEndRef={chatEndRef}
            />
            
            <div className="px-4 py-2 border-t border-neutral-200">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button className="text-neutral-500 hover:text-neutral-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <button className="text-neutral-500 hover:text-neutral-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                <LanguageSelector currentLanguage={user.language} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
