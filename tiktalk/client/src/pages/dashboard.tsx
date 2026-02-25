import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import EpisodeUpload from "@/components/episode-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Users, 
  Play, 
  Plus, 
  Settings, 
  TrendingUp, 
  Calendar,
  Music,
  Edit,
  Eye,
  MoreHorizontal
} from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedPodcast, setSelectedPodcast] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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
  }, [isAuthenticated, authLoading, toast]);

  const { data: podcasts, isLoading: podcastsLoading } = useQuery({
    queryKey: [`/api/podcasts/creator/${user?.id}`],
    enabled: isAuthenticated && !!user?.id,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: [`/api/podcasts/${selectedPodcast}/analytics`],
    enabled: !!selectedPodcast,
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <Skeleton className="h-8 w-64" />
              <div className="grid md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-20 mb-2" />
                      <Skeleton className="h-8 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalPodcasts = podcasts?.length || 0;
  const totalEpisodes = podcasts?.reduce((sum: number, podcast: any) => sum + podcast._count.episodes, 0) || 0;
  const totalFollowers = podcasts?.reduce((sum: number, podcast: any) => sum + podcast._count.follows, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
            <p className="text-gray-600">Manage your podcasts and track your performance</p>
          </div>
          <Button onClick={() => window.location.href = "/create-podcast"}>
            <Plus className="w-4 h-4 mr-2" />
            Create Podcast
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Podcasts</p>
                      <p className="text-2xl font-bold text-gray-900">{totalPodcasts}</p>
                    </div>
                    <Music className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Episodes</p>
                      <p className="text-2xl font-bold text-gray-900">{totalEpisodes}</p>
                    </div>
                    <Play className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Followers</p>
                      <p className="text-2xl font-bold text-gray-900">{totalFollowers}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Podcasts Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Music className="w-5 h-5 mr-2" />
                  Your Podcasts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {podcastsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Skeleton className="w-16 h-16 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-1/3 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : podcasts && podcasts.length > 0 ? (
                  <div className="space-y-4">
                    {podcasts.map((podcast: any) => (
                      <div key={podcast.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <img 
                          src={podcast.coverImageUrl || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=64&h=64&fit=crop"}
                          alt={podcast.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{podcast.title}</h3>
                          <p className="text-sm text-gray-600">
                            {podcast._count.episodes} episodes • {podcast._count.follows} followers
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <Badge variant={podcast.isPublished ? "default" : "secondary"}>
                              {podcast.isPublished ? "Published" : "Draft"}
                            </Badge>
                            {podcast.category && (
                              <Badge variant="outline">{podcast.category}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPodcast(podcast.id)}
                          >
                            <BarChart className="w-4 h-4 mr-2" />
                            Analytics
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/podcast/${podcast.id}`}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Episode
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Upload New Episode</DialogTitle>
                              </DialogHeader>
                              <EpisodeUpload podcastId={podcast.id} />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No podcasts yet</h3>
                    <p className="text-gray-600 mb-6">Create your first podcast to get started.</p>
                    <Button onClick={() => window.location.href = "/create-podcast"}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Podcast
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analytics Card */}
            {selectedPodcast && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="w-5 h-5 mr-2" />
                    Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                  ) : analytics ? (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Plays</span>
                        <span className="font-semibold">{analytics.totalPlays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Followers</span>
                        <span className="font-semibold">{analytics.totalFollows}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Episodes</span>
                        <span className="font-semibold">{analytics.episodeCount}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Select a podcast to view analytics</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => window.location.href = "/create-podcast"}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Podcast
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">New follower</span>
                    <span className="text-gray-400">2h ago</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Episode played 50 times</span>
                    <span className="text-gray-400">5h ago</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">New episode published</span>
                    <span className="text-gray-400">1d ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
