import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Play, Users, Calendar, Clock, Heart, Share2, MoreHorizontal } from "lucide-react";

export default function Podcast() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: podcast, isLoading } = useQuery({
    queryKey: [`/api/podcasts/${id}`],
  });

  const { data: followStatus } = useQuery({
    queryKey: [`/api/follows/${id}/status`],
    enabled: isAuthenticated,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (followStatus?.isFollowing) {
        await apiRequest("DELETE", `/api/follows/${id}`);
      } else {
        await apiRequest("POST", "/api/follows", { podcastId: parseInt(id!) });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/follows/${id}/status`] });
      queryClient.invalidateQueries({ queryKey: ["/api/follows"] });
      toast({
        title: followStatus?.isFollowing ? "Unfollowed" : "Following",
        description: followStatus?.isFollowing 
          ? "You've unfollowed this podcast" 
          : "You're now following this podcast",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Skeleton className="w-full aspect-square rounded-xl" />
            </div>
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!podcast) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Podcast Not Found</h1>
              <p className="text-gray-600">The podcast you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Podcast Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <img 
                src={podcast.coverImageUrl || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop"}
                alt={podcast.title}
                className="w-full aspect-square rounded-xl object-cover shadow-lg"
              />
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{podcast.title}</h1>
                <p className="text-lg text-gray-600 mb-4">
                  by {podcast.creator.firstName} {podcast.creator.lastName}
                </p>
                {podcast.category && (
                  <Badge variant="secondary" className="mb-4">
                    {podcast.category}
                  </Badge>
                )}
                <p className="text-gray-700 leading-relaxed">{podcast.description}</p>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {podcast._count.follows} followers
                </div>
                <div className="flex items-center">
                  <Play className="w-4 h-4 mr-1" />
                  {podcast.episodes.length} episodes
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created {new Date(podcast.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isAuthenticated && (
                  <Button 
                    variant={followStatus?.isFollowing ? "outline" : "default"}
                    onClick={() => followMutation.mutate()}
                    disabled={followMutation.isPending}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${followStatus?.isFollowing ? 'fill-current' : ''}`} />
                    {followStatus?.isFollowing ? "Following" : "Follow"}
                  </Button>
                )}
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Episodes List */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Episodes</h2>
          
          {podcast.episodes.length === 0 ? (
            <div className="text-center py-12">
              <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No episodes yet</h3>
              <p className="text-gray-600">This podcast hasn't published any episodes yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {podcast.episodes.map((episode: any, index: number) => (
                <div key={episode.id}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {episode.episodeNumber || podcast.episodes.length - index}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {episode.title}
                          </h3>
                          {episode.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                              {episode.description}
                            </p>
                          )}
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(episode.publishedAt || episode.createdAt).toLocaleDateString()}
                            </div>
                            {episode.duration && (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {Math.floor(episode.duration / 60)} min
                              </div>
                            )}
                            <div className="flex items-center">
                              <Play className="w-4 h-4 mr-1" />
                              {episode.playCount || 0} plays
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm"
                          onClick={() => window.location.href = `/episode/${episode.id}`}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Play
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {index < podcast.episodes.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
