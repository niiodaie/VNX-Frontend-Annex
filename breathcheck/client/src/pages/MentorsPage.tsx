import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getMentors } from "@/lib/api";
import { Music, Search, ArrowLeft, Users } from "lucide-react";
import type { Mentor } from "@shared/schema";

const MentorsPage = () => {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  // Get mentors list
  const { 
    data: mentors = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['mentors'],
    queryFn: getMentors,
  });

  // Extract all unique genres from mentors
  const allGenres = Array.from(
    new Set(mentors.flatMap(mentor => mentor.genres))
  ).sort();

  // Filter mentors based on search and genre
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = searchQuery === "" || 
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = !selectedGenre || mentor.genres.includes(selectedGenre);
    
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 py-4 px-6 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="p-0 mr-2" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Button>
          <h1 className="text-xl font-bold">AI Mentors</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        {/* Search and filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              className="bg-gray-800 border-gray-700 pl-10 text-white placeholder:text-gray-500"
              placeholder="Search mentors by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedGenre === null ? "secondary" : "outline"}
              className={`cursor-pointer ${selectedGenre === null ? "bg-purple-700" : "text-gray-400 hover:text-white"}`}
              onClick={() => setSelectedGenre(null)}
            >
              All Genres
            </Badge>
            {allGenres.map(genre => (
              <Badge
                key={genre}
                variant={selectedGenre === genre ? "secondary" : "outline"}
                className={`cursor-pointer ${selectedGenre === genre ? "bg-purple-700" : "text-gray-400 hover:text-white"}`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        {/* Mentors Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading mentors...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">Error loading mentors</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        ) : filteredMentors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No mentors found matching your criteria</p>
            <Button 
              variant="outline" 
              className="mt-4 border-purple-700 text-purple-400"
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre(null);
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map(mentor => (
              <MentorCard 
                key={mentor.id} 
                mentor={mentor} 
                onClick={() => navigate(`/mentors/${mentor.id}`)} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

interface MentorCardProps {
  mentor: Mentor;
  onClick: () => void;
}

const MentorCard = ({ mentor, onClick }: MentorCardProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800/80 transition-colors cursor-pointer overflow-hidden" onClick={onClick}>
      <div className="h-32 bg-gradient-to-r from-purple-900/40 to-blue-900/40 flex items-center justify-center">
        {mentor.image ? (
          <img 
            src={mentor.image} 
            alt={mentor.name} 
            className="h-full w-full object-cover" 
          />
        ) : (
          <Music className="h-16 w-16 text-purple-700/50" />
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{mentor.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-gray-300 text-sm line-clamp-2">
          {mentor.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {mentor.genres.slice(0, 3).map(genre => (
            <Badge key={genre} variant="outline" className="text-xs bg-purple-900/20 text-purple-300 border-purple-800">
              {genre}
            </Badge>
          ))}
          {mentor.genres.length > 3 && (
            <Badge variant="outline" className="text-xs bg-gray-800 text-gray-400 border-gray-700">
              +{mentor.genres.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-800 pt-3">
        <Button size="sm" className="w-full bg-purple-700 hover:bg-purple-800">
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentorsPage;