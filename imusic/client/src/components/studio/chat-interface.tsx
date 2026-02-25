import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'mentor';
  timestamp: Date;
}

interface ChatInterfaceProps {
  mentorName: string;
  mentorImage: string;
  initialMessage?: string;
}

export default function ChatInterface({ mentorName, mentorImage, initialMessage }: ChatInterfaceProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add initial mentor message if provided
  useEffect(() => {
    if (initialMessage) {
      setMessages([
        {
          id: 'initial',
          text: initialMessage,
          sender: 'mentor',
          timestamp: new Date()
        }
      ]);
    }
  }, [initialMessage]);

  // Auto-scroll to bottom of message list
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    try {
      // Request mentor response from API
      const response = await apiRequest('POST', '/api/mentor/chat', {
        message: newMessage
      });
      
      const data = await response.json();
      
      // Add mentor response to chat
      const mentorMessage: Message = {
        id: Date.now().toString(),
        text: data.message,
        sender: 'mentor',
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, mentorMessage]);
    } catch (error) {
      toast({
        title: "Communication Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      console.error('Failed to get mentor response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-800 flex items-center space-x-3 bg-gray-900/80">
        <div className="h-10 w-10 rounded-full overflow-hidden">
          <img src={mentorImage} alt={mentorName} className="h-full w-full object-cover" />
        </div>
        <div>
          <h3 className="font-medium text-white">{mentorName}</h3>
          <p className="text-xs text-gray-400">AI Music Mentor</p>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-900/30 to-black/30">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[80%]'
            }`}
          >
            <div
              className={`p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-purple-800/40 text-white'
                  : 'bg-gray-800/80 text-gray-100'
              }`}
            >
              {message.text}
            </div>
            <div
              className={`text-xs mt-1 text-gray-500 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              {new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              }).format(message.timestamp)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="mb-4 mr-auto max-w-[80%]">
            <div className="p-3 rounded-lg bg-gray-800/80 text-gray-100 flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{mentorName} is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/50">
        <div className="flex space-x-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="resize-none bg-gray-800/50 border-gray-700"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !newMessage.trim()}
            className="bg-purple-700 hover:bg-purple-600"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Press Ctrl+Enter to send</p>
      </div>
    </div>
  );
}