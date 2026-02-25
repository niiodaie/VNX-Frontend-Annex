import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, MapPin, Clock, DollarSign, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocation } from "@/hooks/useLocation";

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface DestinationInsight {
  name: string;
  bestTime: string;
  budget: string;
  highlights: string[];
  insider_tip: string;
}

export default function TravelChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { location } = useLocation();

  const destinationDatabase: Record<string, DestinationInsight> = {
    'tokyo': {
      name: 'Tokyo, Japan',
      bestTime: 'March-May, September-November',
      budget: '$150-300 per day',
      highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tsukiji Market', 'Tokyo Skytree'],
      insider_tip: 'Visit early morning at Tsukiji for the freshest sushi, and explore Golden Gai at night for authentic tiny bars.'
    },
    'paris': {
      name: 'Paris, France',
      bestTime: 'April-June, September-October',
      budget: '$120-250 per day',
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Champs-Élysées'],
      insider_tip: 'Book museum tickets online to skip lines, and try authentic croissants at local boulangeries before 10 AM.'
    },
    'bali': {
      name: 'Bali, Indonesia',
      bestTime: 'April-October (dry season)',
      budget: '$50-120 per day',
      highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Mount Batur', 'Seminyak Beach'],
      insider_tip: 'Stay in Ubud for culture, Canggu for surfing, and always negotiate prices at markets.'
    },
    'iceland': {
      name: 'Iceland',
      bestTime: 'June-August (summer), September-March (Northern Lights)',
      budget: '$180-350 per day',
      highlights: ['Blue Lagoon', 'Golden Circle', 'Northern Lights', 'Glacier Lagoon'],
      insider_tip: 'Rent a 4WD vehicle for Ring Road adventures and book Blue Lagoon tickets well in advance.'
    },
    'new york': {
      name: 'New York City, USA',
      bestTime: 'April-June, September-November',
      budget: '$200-400 per day',
      highlights: ['Central Park', 'Times Square', 'Brooklyn Bridge', 'High Line'],
      insider_tip: 'Use the subway system with a MetroCard, and visit free attractions like Staten Island Ferry for Statue of Liberty views.'
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'bot',
        content: `Hello! I'm your AI travel companion. I can help you with destination insights, travel planning, and personalized recommendations. ${location ? `I see you're in ${location.city}, ${location.country}. ` : ''}What would you like to explore today?`,
        timestamp: new Date(),
        suggestions: ['Best time to visit Tokyo', 'Budget for Europe trip', 'Hidden gems in Bali', 'Plan 7-day Iceland itinerary']
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, location]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const analyzeUserQuery = (query: string): { intent: string; destination?: string; entities: string[] } => {
    const lowerQuery = query.toLowerCase();
    const destinations = Object.keys(destinationDatabase);
    
    let intent = 'general';
    let destination: string | undefined;
    const entities: string[] = [];

    // Destination detection
    for (const dest of destinations) {
      if (lowerQuery.includes(dest) || lowerQuery.includes(destinationDatabase[dest].name.toLowerCase())) {
        destination = dest;
        entities.push(dest);
        break;
      }
    }

    // Intent classification
    if (lowerQuery.includes('budget') || lowerQuery.includes('cost') || lowerQuery.includes('expensive')) {
      intent = 'budget';
    } else if (lowerQuery.includes('best time') || lowerQuery.includes('when to visit') || lowerQuery.includes('weather')) {
      intent = 'timing';
    } else if (lowerQuery.includes('itinerary') || lowerQuery.includes('plan') || lowerQuery.includes('days')) {
      intent = 'planning';
    } else if (lowerQuery.includes('tip') || lowerQuery.includes('advice') || lowerQuery.includes('recommend')) {
      intent = 'tips';
    } else if (lowerQuery.includes('highlight') || lowerQuery.includes('attraction') || lowerQuery.includes('see')) {
      intent = 'attractions';
    }

    return { intent, destination, entities };
  };

  const generateResponse = (query: string): { content: string; suggestions?: string[] } => {
    const analysis = analyzeUserQuery(query);
    const { intent, destination } = analysis;

    if (destination && destinationDatabase[destination]) {
      const destData = destinationDatabase[destination];
      
      switch (intent) {
        case 'budget':
          return {
            content: `For ${destData.name}, you can expect to spend around ${destData.budget}. This includes accommodation, meals, and activities. Budget travelers can spend less by staying in hostels and eating local food, while luxury travelers might spend significantly more.`,
            suggestions: [`Best time to visit ${destData.name}`, `Top attractions in ${destData.name}`, 'Travel insurance tips']
          };
        
        case 'timing':
          return {
            content: `The best time to visit ${destData.name} is ${destData.bestTime}. This is when you'll experience the most favorable weather conditions and optimal travel experiences.`,
            suggestions: [`Budget for ${destData.name}`, `What to pack for ${destData.name}`, 'Flight booking tips']
          };
        
        case 'attractions':
          return {
            content: `Top highlights in ${destData.name} include: ${destData.highlights.join(', ')}. Each offers unique experiences that showcase the destination's culture and beauty.`,
            suggestions: [`Insider tips for ${destData.name}`, `Best restaurants in ${destData.name}`, 'Photography spots']
          };
        
        case 'tips':
          return {
            content: `Here's an insider tip for ${destData.name}: ${destData.insider_tip}`,
            suggestions: [`Plan ${destData.name} itinerary`, `Transportation in ${destData.name}`, 'Local customs guide']
          };
        
        default:
          return {
            content: `${destData.name} is an amazing destination! Best time to visit: ${destData.bestTime}. Budget: ${destData.budget}. Key highlights: ${destData.highlights.slice(0, 3).join(', ')}. Insider tip: ${destData.insider_tip}`,
            suggestions: [`Budget breakdown for ${destData.name}`, `Weather in ${destData.name}`, 'Local transportation']
          };
      }
    }

    // General responses for non-destination queries
    if (query.toLowerCase().includes('hello') || query.toLowerCase().includes('hi')) {
      return {
        content: "Hello! I'm here to help you plan amazing travels. What destination are you curious about?",
        suggestions: ['Popular destinations 2024', 'Budget travel tips', 'Best time to travel', 'Solo travel advice']
      };
    }

    if (query.toLowerCase().includes('recommend') && !destination) {
      const locationSuggestion = location ? ` Since you're in ${location.country}, you might enjoy exploring nearby regions or` : '';
      return {
        content: `I'd love to recommend destinations for you!${locationSuggestion} I can help with specific places like Tokyo, Paris, Bali, Iceland, or New York. What type of experience are you looking for - adventure, culture, relaxation, or city exploration?`,
        suggestions: ['Adventure destinations', 'Cultural experiences', 'Beach destinations', 'City breaks']
      };
    }

    return {
      content: "I can help you with destination insights, travel planning, budgeting, and timing advice. Try asking about specific destinations like Tokyo, Paris, Bali, Iceland, or New York, or ask for recommendations based on your travel style!",
      suggestions: ['Tell me about Tokyo', 'Best budget destinations', 'Plan Europe itinerary', 'Travel safety tips']
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const response = generateResponse(inputValue);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full w-14 h-14 shadow-lg"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">Travel Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              <div className="flex items-start gap-2">
                {message.type === 'bot' && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                {message.type === 'user' && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                <div className="text-sm">{message.content}</div>
              </div>
              
              {message.suggestions && (
                <div className="mt-3 space-y-1">
                  {message.suggestions.map((suggestion, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs h-7 bg-white/10 border-white/30 text-gray-700 hover:bg-white/20"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me about destinations..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm" disabled={!inputValue.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}