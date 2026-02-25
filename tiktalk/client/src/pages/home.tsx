import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import PodcastCard from "@/components/podcast-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, TrendingUp, Users } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: featuredPodcasts, isLoading: featuredLoading } = useQuery({
    queryKey: ["/api/podcasts/featured"],
  });

  const { data: followedPodcasts, isLoading: followedLoading } = useQuery({
    queryKey: ["/api/follows"],
  });

  const { data: playHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["/api/play-history"],
  });

  const categories = [
    "Technology", "Business", "Health", "Society", "Comedy", "Education"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || "Listener"}!
          </h1>
          <p className="text-gray-600">Discover amazing podcasts and continue your listening journey.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Continue Listening */}
            {playHistory && playHistory.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Listening</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {historyLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <Skeleton className="w-16 h-16 rounded-lg" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-3/4 mb-2" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    playHistory.slice(0, 2).map((episode: any) => (
                      <Card key={episode.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={episode.coverImageUrl || episode.podcast.coverImageUrl || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=80&h=80&fit=crop"}
                              alt={episode.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 line-clamp-1">{episode.title}</h3>
                              <p className="text-sm text-gray-600">{episode.podcast.title}</p>
                              <div className="flex items-center mt-2">
                                <Clock className="w-4 h-4 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500">25 min left</span>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </section>
            )}

            {/* Featured Podcasts */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
                <Button variant="ghost" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="w-full h-32" />
                      <CardContent className="p-4">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  featuredPodcasts?.slice(0, 3).map((podcast: any) => (
                    <PodcastCard key={podcast.id} podcast={podcast} compact />
                  ))
                )}
              </div>
            </section>

            {/* Categories */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Categories</h2>
              <div className="flex flex-wrap gap-3 mb-6">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    className="cursor-pointer px-4 py-2"
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => window.location.href = "/create-podcast"}>
                  Create Podcast
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = "/dashboard"}>
                  View Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Following */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Following
                </CardTitle>
              </CardHeader>
              <CardContent>
                {followedLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                ) : followedPodcasts && followedPodcasts.length > 0 ? (
                  <div className="space-y-3">
                    {followedPodcasts.slice(0, 5).map((podcast: any) => (
                      <div key={podcast.id} className="flex items-center space-x-3">
                        <img 
                          src={podcast.coverImageUrl || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=32&h=32&fit=crop"}
                          alt={podcast.title}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900 line-clamp-1">{podcast.title}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">You're not following any podcasts yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Episodes Played</span>
                  <span className="font-semibold">{playHistory?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Following</span>
                  <span className="font-semibold">{followedPodcasts?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hours Listened</span>
                  <span className="font-semibold">47h</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
