import React, { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, MicIcon, LoaderIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MentorVoiceFeedback from '@/components/ui/mentor-voice-feedback';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'mentor';
  timestamp: Date;
  audioUrl?: string;
}

interface MentorChatProps {
  mentorId: number;
  mentorName: string;
  initialMessage?: string;
}

export default function MentorChat({ mentorId, mentorName, initialMessage }: MentorChatProps) {
  const { toast } = useToast();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => {
    // Initialize with the initial message if provided
    if (initialMessage) {
      return [
        {
          id: 'initial',
          content: initialMessage,
          sender: 'mentor',
          timestamp: new Date(),
        },
      ];
    }
    return [];
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when new ones are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Send message to the mentor
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest('POST', '/api/mentor/chat', { message });
      return await res.json();
    },
    onSuccess: (data) => {
      // Add mentor response to messages
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: data.message,
          sender: 'mentor',
          timestamp: new Date(),
          audioUrl: data.audioUrl
        },
      ]);
      
      // Scroll to the bottom to show the new message
      setTimeout(scrollToBottom, 100);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to get a response from your mentor. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  // Send a message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message to the chat
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: inputMessage,
        sender: 'user',
        timestamp: new Date(),
      },
    ]);
    
    // Send message to backend
    sendMessageMutation.mutate(inputMessage);
    
    // Clear input
    setInputMessage('');
    
    // Scroll to bottom
    setTimeout(scrollToBottom, 100);
  };
  
  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="mentor-chat flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-800 bg-black bg-opacity-40">
        <h3 className="text-lg font-medium text-white">Session with {mentorName}</h3>
      </div>
      
      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-black bg-opacity-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-3/4 p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-purple-900 to-purple-950 text-white ml-12'
                  : 'bg-gradient-to-br from-gray-900 to-black text-white mr-12 border border-purple-900/20'
              }`}
            >
              {message.sender === 'mentor' ? (
                <MentorVoiceFeedback 
                  text={message.content}
                  audioUrl={message.audioUrl}
                  mentorName={mentorName}
                />
              ) : (
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              )}
              <div className="text-xs text-gray-400 mt-1 text-right">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-gray-800 bg-black bg-opacity-60">
        <div className="flex space-x-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Share your lyrics, ask for feedback, or get some inspiration..."
            className="flex-grow bg-gray-900 border-gray-700 focus:border-purple-500 text-white"
            rows={2}
          />
          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleSendMessage}
              className="h-full bg-purple-800 hover:bg-purple-700 text-white"
              disabled={sendMessageMutation.isPending || !inputMessage.trim()}
            >
              {sendMessageMutation.isPending ? (
                <LoaderIcon className="h-5 w-5 animate-spin" />
              ) : (
                <SendIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}