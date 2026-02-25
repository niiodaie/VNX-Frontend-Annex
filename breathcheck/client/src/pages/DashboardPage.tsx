import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { getUserProjects, getUserChatSessions, getMentors } from "@/lib/api";
import { FileMusic, User, Users, MessageSquare, Plus, ArrowRight } from "lucide-react";
import type { Project, ChatSession } from "@shared/schema";

const DashboardPage = () => {
  const [_, navigate] = useLocation();
  const { user, logout } = useAuth();
  
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
  
  // Get user chat sessions
  const { 
    data: sessions = [], 
    isLoading: sessionsLoading 
  } = useQuery({
    queryKey: ['chat-sessions', user.id],
    queryFn: () => getUserChatSessions(user.id),
    enabled: !!user,
  });
  
  // Get mentors
  const { 
    data: mentors = [], 
    isLoading: mentorsLoading 
  } = useQuery({
    queryKey: ['mentors'],
    queryFn: getMentors,
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 py-4 px-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user.displayName || user.username}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="border-gray-700 text-white"
            onClick={logout}
          >
            <User className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button 
            className="bg-purple-700 hover:bg-purple-800 h-auto py-6 flex flex-col items-center gap-2"
            onClick={() => navigate('/projects/new')}
          >
            <Plus className="h-6 w-6" />
            <span>New Project</span>
          </Button>
          
          <Button 
            className="bg-gray-800 hover:bg-gray-700 h-auto py-6 flex flex-col items-center gap-2"
            onClick={() => navigate('/mentors')}
          >
            <Users className="h-6 w-6" />
            <span>Explore Mentors</span>
          </Button>
          
          <Button 
            className="bg-gray-800 hover:bg-gray-700 h-auto py-6 flex flex-col items-center gap-2"
            onClick={() => navigate('/feedback')}
          >
            <MessageSquare className="h-6 w-6" />
            <span>Get Feedback</span>
          </Button>
        </div>
        
        {/* Recent Projects */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Projects</h2>
            <Button 
              variant="outline" 
              className="text-gray-300 border-gray-700"
              onClick={() => navigate('/projects')}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectsLoading ? (
              <p className="text-gray-400">Loading projects...</p>
            ) : projects.length === 0 ? (
              <Card className="bg-gray-900 border-gray-800 col-span-full">
                <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-40">
                  <FileMusic className="h-8 w-8 text-gray-600 mb-3" />
                  <p className="text-gray-400 mb-3">You don't have any projects yet</p>
                  <Button
                    className="bg-purple-700 hover:bg-purple-800"
                    onClick={() => navigate('/projects')}
                  >
                    Create Your First Project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {projects.slice(0, 3).map(project => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onClick={() => navigate(`/projects/${project.id}`)} 
                  />
                ))}
              </>
            )}
          </div>
        </section>
        
        {/* Recent Conversations */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Conversations</h2>
            <Button 
              variant="outline" 
              className="text-gray-300 border-gray-700"
              onClick={() => navigate('/chat')}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessionsLoading ? (
              <p className="text-gray-400">Loading conversations...</p>
            ) : sessions.length === 0 ? (
              <Card className="bg-gray-900 border-gray-800 col-span-full">
                <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-40">
                  <MessageSquare className="h-8 w-8 text-gray-600 mb-3" />
                  <p className="text-gray-400 mb-3">You don't have any conversations yet</p>
                  <Button
                    className="bg-purple-700 hover:bg-purple-800"
                    onClick={() => navigate('/mentors')}
                  >
                    Find a Mentor
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {sessions.slice(0, 4).map(session => (
                  <SessionCard 
                    key={session.id} 
                    session={session} 
                    onClick={() => navigate(`/chat/${session.id}`)} 
                  />
                ))}
              </>
            )}
          </div>
        </section>
        
        {/* Featured Mentors */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Featured Mentors</h2>
            <Button 
              variant="outline" 
              className="text-gray-300 border-gray-700"
              onClick={() => navigate('/mentors')}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentorsLoading ? (
              <p className="text-gray-400">Loading mentors...</p>
            ) : (
              <>
                {mentors.slice(0, 3).map(mentor => (
                  <Card key={mentor.id} className="bg-gray-900 border-gray-800 hover:bg-gray-800/80 transition-colors cursor-pointer" onClick={() => navigate(`/mentors/${mentor.id}`)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <CardDescription className="text-gray-400 line-clamp-1">
                        {mentor.genres.join(", ")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {mentor.description}
                      </p>
                    </CardContent>
                    <CardFooter className="text-purple-400 text-sm">
                      <div className="flex items-center">
                        View Profile
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const date = new Date(project.updatedAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800/80 transition-colors cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <CardDescription className="text-gray-400">
          Last updated: {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 text-sm line-clamp-2">
          {project.description || "No description"}
        </p>
      </CardContent>
      <CardFooter className="text-purple-400 text-sm">
        <div className="flex items-center">
          Continue Project
          <ArrowRight className="ml-1 h-3 w-3" />
        </div>
      </CardFooter>
    </Card>
  );
};

interface SessionCardProps {
  session: ChatSession;
  onClick: () => void;
}

const SessionCard = ({ session, onClick }: SessionCardProps) => {
  const date = new Date(session.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800/80 transition-colors cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{session.title}</CardTitle>
        <CardDescription className="text-gray-400">
          Started: {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardFooter className="text-purple-400 text-sm">
        <div className="flex items-center">
          Continue Conversation
          <ArrowRight className="ml-1 h-3 w-3" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default DashboardPage;