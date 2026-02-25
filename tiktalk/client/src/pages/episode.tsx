import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import AudioPlayer from "@/components/audio-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Play, Share2, Heart, ArrowLeft } from "lucide-react";

export default function Episode() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const { data: episode, isLoading } = useQuery({
    queryKey: [`/api/episodes/${id}`],
  });

  const playMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/episodes/${id}/play`);
    },
  });

  const recordPlayMutation = useMutation({
    mutationFn: async (data: { progress: number; completed: boolean }) => {
      if (isAuthenticated) {
        await apiRequest("POST", "/api/play-history", {
          episodeId: parseInt(id!),
          ...data,
        });
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="bg-white rounded-xl shadow-lg p-8">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-6" />
            <Skeleton className="h-32 w-full mb-6" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Episode Not Found</h1>
              <p className="text-gray-600">The episode you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handlePlayStart = () => {
    playMutation.mutate();
  };

  const handleProgress = (progress: number, duration: number) => {
    const completed = progress >= duration * 0.95; // Consider completed if 95% played
    recordPlayMutation.mutate({ progress, completed });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Podcast
        </Button>

        {/* Episode Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start space-x-6">
            <img 
              src={episode.coverImageUrl || episode.podcast.coverImageUrl || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&h=200&fit=crop"}
              alt={episode.title}
              className="w-32 h-32 rounded-xl object-cover shadow-md"
            />
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{episode.title}</h1>
                <p className="text-lg text-gray-600 mb-2">
                  <a 
                    href={`/podcast/${episode.podcast.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {episode.podcast.title}
                  </a>
                  {" • "}by {episode.podcast.creator.firstName} {episode.podcast.creator.lastName}
                </p>
                {episode.podcast.category && (
                  <Badge variant="secondary" className="mb-4">
                    {episode.podcast.category}
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
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

              <div className="flex items-center gap-3">
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                {isAuthenticated && (
                  <Button variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        <div className="mb-8">
          <AudioPlayer 
            episode={{
              title: episode.title,
              podcast: `${episode.podcast.title} • Episode ${episode.episodeNumber || ''}`,
              audioUrl: episode.audioUrl,
              duration: episode.duration || 0,
              coverImageUrl: episode.coverImageUrl || episode.podcast.coverImageUrl,
            }}
            onPlayStart={handlePlayStart}
            onProgress={handleProgress}
          />
        </div>

        {/* Episode Description */}
        {episode.description && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Episode Notes</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {episode.description}
              </p>
            </div>
          </div>
        )}

        {/* Podcast Info */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Podcast</h2>
          <div className="flex items-start space-x-4">
            <img 
              src={episode.podcast.coverImageUrl || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=80&h=80&fit=crop"}
              alt={episode.podcast.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <a 
                  href={`/podcast/${episode.podcast.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {episode.podcast.title}
                </a>
              </h3>
              <p className="text-gray-600 mb-3">
                by {episode.podcast.creator.firstName} {episode.podcast.creator.lastName}
              </p>
              {episode.podcast.description && (
                <p className="text-gray-700 line-clamp-3">{episode.podcast.description}</p>
              )}
            </div>
            <Button 
              onClick={() => window.location.href = `/podcast/${episode.podcast.id}`}
            >
              View Podcast
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
