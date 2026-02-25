import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getMentor, createChatSession } from "@/lib/api";
import { ArrowLeft, MessageSquare, Users, Music, Mic, Headphones, MoveRight } from "lucide-react";
import type { Mentor } from "@shared/schema";

const MentorDetailPage = () => {
  const [match, params] = useRoute<{ id: string }>("/mentors/:id");
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  // Get mentor details
  const { 
    data: mentor, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['mentor', params?.id],
    queryFn: () => getMentor(parseInt(params?.id || "0")),
    enabled: !!params?.id,
  });

  const handleStartChat = async () => {
    if (!mentor || !user) return;
    
    try {
      const session = await createChatSession({
        userId: user.id,
        mentorId: mentor.id,
        title: `Chat with ${mentor.name}`
      });
      
      toast({
        title: "Chat session created",
        description: `Your chat with ${mentor.name} is ready!`,
      });
      
      navigate(`/chat/${session.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create chat",
        description: "There was an error starting the chat session. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading mentor details...</p>
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Mentor Not Found</h1>
          <p className="text-gray-400 mb-6">This mentor doesn't exist or couldn't be loaded</p>
          <Button 
            variant="outline" 
            className="border-purple-700 text-purple-400"
            onClick={() => navigate('/mentors')}
          >
            Back to Mentors
          </Button>
        </div>
      </div>
    );
  }

  const traits = mentor.traits as Record<string, any>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 py-4 px-6 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="p-0 mr-2" onClick={() => navigate('/mentors')}>
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Button>
          <h1 className="text-xl font-bold">Mentor Profile</h1>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-900/30 to-black pt-8 pb-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Mentor Image */}
            <div className="w-32 h-32 rounded-full bg-purple-900/50 flex items-center justify-center overflow-hidden">
              {mentor.image ? (
                <img 
                  src={mentor.image} 
                  alt={mentor.name} 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <Music className="h-16 w-16 text-purple-400" />
              )}
            </div>
            
            {/* Mentor Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{mentor.name}</h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                {mentor.genres.map(genre => (
                  <Badge key={genre} className="bg-purple-900/50 text-purple-100 hover:bg-purple-800">
                    {genre}
                  </Badge>
                ))}
              </div>
              <p className="text-gray-300 max-w-2xl">
                {mentor.description}
              </p>
              
              <div className="mt-4 flex gap-3 justify-center md:justify-start">
                <Button 
                  className="bg-purple-700 hover:bg-purple-800"
                  onClick={handleStartChat}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with {mentor.name.split(' ')[0]}
                </Button>
                <Button variant="outline" className="border-gray-700">
                  <Users className="mr-2 h-4 w-4" />
                  See Related Mentors
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-4xl mx-auto p-4 mt-4">
        <Tabs defaultValue="style">
          <TabsList className="grid grid-cols-3 bg-gray-900">
            <TabsTrigger value="style">Style & Approach</TabsTrigger>
            <TabsTrigger value="insights">Key Insights</TabsTrigger>
            <TabsTrigger value="projects">Sample Projects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="style" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5 text-purple-400" />
                    <span>Signature Style</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{traits?.signature || "No data available"}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-purple-400" />
                    <span>Influences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {traits?.influences ? (
                      <ul className="space-y-1">
                        {(traits.influences as string[]).map((influence, index) => (
                          <li key={index} className="text-gray-300">
                            • {influence}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">No influences listed</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800 md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MoveRight className="h-5 w-5 text-purple-400" />
                    <span>Creative Strengths</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {traits?.strengths ? (
                      <ul className="space-y-1">
                        {(traits.strengths as string[]).map((strength, index) => (
                          <li key={index} className="text-gray-300">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">No strengths listed</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="mt-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Creative Philosophy</CardTitle>
                <CardDescription className="text-gray-400">
                  Key insights from {mentor.name}'s approach to music
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  {traits?.style || "Style information not available"}
                </p>
                <div className="mt-6 text-center">
                  <Button
                    className="bg-purple-700 hover:bg-purple-800"
                    onClick={handleStartChat}
                  >
                    Start a conversation to learn more
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects" className="mt-6">
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">Connect with {mentor.name} to explore sample projects</p>
              <Button
                className="bg-purple-700 hover:bg-purple-800"
                onClick={handleStartChat}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Conversation
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MentorDetailPage;