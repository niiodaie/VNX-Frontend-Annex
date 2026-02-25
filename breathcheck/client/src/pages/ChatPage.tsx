import { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getChatMessages, getUserChatSessions, getMentor, sendMessage } from "@/lib/api";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import type { ChatMessage } from "@shared/schema";

const ChatPage = () => {
  const [match, params] = useRoute<{ sessionId: string }>("/chat/:sessionId?");
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  
  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }
  
  // Get user's chat sessions
  const { 
    data: sessions = [], 
    isLoading: sessionsLoading 
  } = useQuery({
    queryKey: ['chat-sessions', user.id],
    queryFn: () => getUserChatSessions(user.id),
    enabled: !!user,
  });
  
  // Get current session ID from URL or first available session
  const sessionId = params?.sessionId 
    ? parseInt(params.sessionId) 
    : (sessions.length > 0 ? sessions[0].id : undefined);
  
  // Get current session
  const currentSession = sessions.find(s => s.id === sessionId);
  
  // Get mentor info if we have a session
  const { 
    data: mentor,
    isLoading: mentorLoading 
  } = useQuery({
    queryKey: ['mentor', currentSession?.mentorId],
    queryFn: () => getMentor(currentSession!.mentorId),
    enabled: !!currentSession,
  });
  
  // Get messages for the current session
  const { 
    data: messages = [], 
    isLoading: messagesLoading 
  } = useQuery({
    queryKey: ['chat-messages', sessionId],
    queryFn: () => getChatMessages(sessionId!),
    enabled: !!sessionId,
  });
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      // Invalidate chat messages query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['chat-messages', sessionId] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  });
  
  const handleSendMessage = () => {
    if (!currentMessage.trim() || !user || !sessionId || !currentSession) return;
    
    sendMessageMutation.mutate({
      message: currentMessage,
      userId: user.id,
      mentorId: currentSession.mentorId,
      sessionId: sessionId
    });
    
    setCurrentMessage("");
  };

  // Handle if no session is selected or available
  if (!sessionId && !sessionsLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">No Chat Sessions</h1>
          <p className="text-gray-400 mb-6">
            You don't have any active chat sessions with mentors yet.
            Start by exploring available mentors and connecting with one.
          </p>
          <Button 
            variant="default" 
            className="bg-purple-700 hover:bg-purple-800"
            onClick={() => navigate('/mentors')}
          >
            Find Mentors
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 py-3 px-6 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="p-0 mr-2" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Button>
          <div>
            <h1 className="text-md font-bold">
              {mentorLoading ? "Loading..." : mentor?.name || "Chat"}
            </h1>
            {currentSession && (
              <p className="text-xs text-gray-400">{currentSession.title}</p>
            )}
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagesLoading ? (
          <div className="flex justify-center py-20">
            <p className="text-gray-400">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-2">No messages yet</p>
            <p className="text-gray-500 text-sm">
              Start the conversation by saying hello!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                mentorName={mentor?.name || "Mentor"}
              />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-gray-900 p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            placeholder="Type your message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            className="bg-purple-700 hover:bg-purple-800 px-4"
            onClick={handleSendMessage}
            disabled={sendMessageMutation.isPending || !currentMessage.trim()}
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: ChatMessage;
  mentorName: string;
}

const MessageBubble = ({ message, mentorName }: MessageBubbleProps) => {
  const isUser = message.isUser;
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-purple-700 text-white'
            : 'bg-gray-800 text-gray-100'
        }`}
      >
        <div className="text-xs text-gray-300 mb-1">
          {isUser ? 'You' : mentorName}
        </div>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

export default ChatPage;