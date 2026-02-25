import { RefObject } from "react";
import { Mic, Send } from "lucide-react";

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

interface ChatInterfaceProps {
  messages: Message[];
  isTyping: boolean;
  question: string;
  setQuestion: (question: string) => void;
  suggestedQuestions: SuggestedQuestion[];
  onSendQuestion: () => void;
  onSuggestedQuestionClick: (question: string) => void;
  onVoiceInputClick: () => void;
  chatEndRef: RefObject<HTMLDivElement>;
}

const ChatInterface = ({
  messages,
  isTyping,
  question,
  setQuestion,
  suggestedQuestions,
  onSendQuestion,
  onSuggestedQuestionClick,
  onVoiceInputClick,
  chatEndRef,
}: ChatInterfaceProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendQuestion();
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-neutral-800">Real-Time Q&A</h3>
        <div className="flex space-x-2">
          <button className="text-neutral-400 hover:text-neutral-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Chat/Question Area */}
      <div className="flex-grow overflow-y-auto space-y-4 mb-4 h-64 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : ""}`}
          >
            {message.type === "instructor" && (
              <div className="flex-shrink-0 mr-2">
                <img 
                  className="h-8 w-8 rounded-full" 
                  src={message.instructor?.image} 
                  alt={message.instructor?.name} 
                />
              </div>
            )}
            <div
              className={`py-2 px-3 max-w-xs rounded-lg ${
                message.type === "user"
                  ? "bg-primary-100 text-primary-800"
                  : "bg-neutral-100 text-neutral-800"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.type === "user"
                    ? "text-right text-primary-600"
                    : "text-neutral-500"
                }`}
              >
                {message.type === "user"
                  ? `${message.user?.name || "You"} • ${formatTimestamp(message.timestamp)}`
                  : `${message.instructor?.name || "Instructor"} • ${formatTimestamp(message.timestamp)}`}
              </p>
            </div>
          </div>
        ))}
        
        {/* Instructor typing indicator */}
        {isTyping && (
          <div className="flex">
            <div className="flex-shrink-0 mr-2">
              <img 
                className="h-8 w-8 rounded-full" 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e" 
                alt="Instructor" 
              />
            </div>
            <div className="bg-neutral-100 text-neutral-500 rounded-lg py-2 px-3 max-w-xs">
              <div className="flex space-x-1 items-center pulse-animation">
                <div className="bg-neutral-300 rounded-full h-2 w-2"></div>
                <div className="bg-neutral-300 rounded-full h-2 w-2"></div>
                <div className="bg-neutral-300 rounded-full h-2 w-2"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Anchor for auto-scrolling to bottom */}
        <div ref={chatEndRef} />
      </div>
      
      {/* AI Suggestions */}
      {suggestedQuestions.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-neutral-500 mb-2">Suggested Questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question) => (
              <button
                key={question.id}
                className="inline-flex items-center px-2.5 py-1.5 border border-neutral-300 text-xs font-medium rounded text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => onSuggestedQuestionClick(question.text)}
              >
                {question.text}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input Area */}
      <div className="mt-auto">
        <div className="flex items-center space-x-2">
          <button
            className="inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-full text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={onVoiceInputClick}
          >
            <Mic className="h-5 w-5" />
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ask a question..."
              className="block w-full py-2 px-3 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
          <button
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSendQuestion}
            disabled={!question.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper to format timestamp
const formatTimestamp = (date: Date): string => {
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export default ChatInterface;
