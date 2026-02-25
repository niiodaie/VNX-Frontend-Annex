import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Mic } from "lucide-react";

const podcastSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
});

type PodcastFormData = z.infer<typeof podcastSchema>;

const categories = [
  "Technology",
  "Business",
  "Health",
  "Society",
  "Comedy",
  "Education",
  "Science",
  "Arts",
  "Sports",
  "News",
  "True Crime",
  "History",
];

export default function CreatePodcast() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<PodcastFormData>({
    resolver: zodResolver(podcastSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      coverImageUrl: "",
    },
  });

  const createPodcastMutation = useMutation({
    mutationFn: async (data: PodcastFormData) => {
      const response = await apiRequest("POST", "/api/podcasts", data);
      return response.json();
    },
    onSuccess: (podcast) => {
      toast({
        title: "Podcast Created",
        description: "Your podcast has been created successfully!",
      });
      window.location.href = `/podcast/${podcast.id}`;
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
        description: "Failed to create podcast. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PodcastFormData) => {
    createPodcastMutation.mutate(data);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h1>
              <p className="text-gray-600 mb-6">You need to be signed in to create a podcast.</p>
              <Button onClick={() => window.location.href = "/api/login"}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Podcast</h1>
          <p className="text-gray-600">Share your voice with the world. Set up your podcast details below.</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mic className="w-5 h-5 mr-2" />
              Podcast Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Podcast Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter your podcast title..."
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell listeners what your podcast is about..."
                  rows={4}
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => form.setValue("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-red-600">{form.formState.errors.category.message}</p>
                )}
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label htmlFor="coverImageUrl">Cover Image URL</Label>
                <Input
                  id="coverImageUrl"
                  type="url"
                  placeholder="https://example.com/cover-image.jpg"
                  {...form.register("coverImageUrl")}
                />
                <p className="text-sm text-gray-500">
                  Recommended: 1400x1400 pixels, square format
                </p>
                {form.formState.errors.coverImageUrl && (
                  <p className="text-sm text-red-600">{form.formState.errors.coverImageUrl.message}</p>
                )}
              </div>

              {/* Cover Image Preview */}
              {form.watch("coverImageUrl") && (
                <div className="space-y-2">
                  <Label>Cover Image Preview</Label>
                  <img 
                    src={form.watch("coverImageUrl")}
                    alt="Cover preview"
                    className="w-32 h-32 rounded-lg object-cover border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createPodcastMutation.isPending}
                  className="flex-1"
                >
                  {createPodcastMutation.isPending ? (
                    "Creating..."
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Create Podcast
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tips for Success</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Choose a clear, memorable title that describes your content</li>
              <li>• Write a compelling description that explains what listeners can expect</li>
              <li>• Select the most relevant category to help people discover your podcast</li>
              <li>• Use a high-quality cover image that looks good at small sizes</li>
              <li>• Keep your podcast focused on a specific topic or theme</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
