import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Upload, FileAudio, X, CheckCircle } from "lucide-react";

const episodeSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().optional(),
  episodeNumber: z.number().int().positive().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
});

type EpisodeFormData = z.infer<typeof episodeSchema>;

interface EpisodeUploadProps {
  podcastId: number;
  onSuccess?: () => void;
}

export default function EpisodeUpload({ podcastId, onSuccess }: EpisodeUploadProps) {
  const { toast } = useToast();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<EpisodeFormData>({
    resolver: zodResolver(episodeSchema),
    defaultValues: {
      title: "",
      description: "",
      episodeNumber: undefined,
      coverImageUrl: "",
      isPublished: false,
    },
  });

  const uploadEpisodeMutation = useMutation({
    mutationFn: async (data: EpisodeFormData & { audioFile: File }) => {
      const formData = new FormData();
      formData.append("audio", data.audioFile);
      formData.append("title", data.title);
      formData.append("podcastId", podcastId.toString());
      
      if (data.description) formData.append("description", data.description);
      if (data.episodeNumber) formData.append("episodeNumber", data.episodeNumber.toString());
      if (data.coverImageUrl) formData.append("coverImageUrl", data.coverImageUrl);
      formData.append("isPublished", data.isPublished.toString());

      const response = await fetch("/api/episodes", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Episode Uploaded",
        description: "Your episode has been uploaded successfully!",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/podcasts/${podcastId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/podcasts/creator"] });
      form.reset();
      setAudioFile(null);
      setUploadProgress(0);
      onSuccess?.();
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
        title: "Upload Failed",
        description: "Failed to upload episode. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("audio/")) {
      toast({
        title: "Invalid File Type",
        description: "Please select an audio file (MP3, WAV, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        title: "File Too Large",
        description: "Audio file must be less than 100MB",
        variant: "destructive",
      });
      return;
    }

    setAudioFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const onSubmit = (data: EpisodeFormData) => {
    if (!audioFile) {
      toast({
        title: "Audio File Required",
        description: "Please select an audio file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    uploadEpisodeMutation.mutate(
      { ...data, audioFile },
      {
        onSettled: () => {
          setIsUploading(false);
          setUploadProgress(100);
          clearInterval(progressInterval);
        },
      }
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Audio File Upload */}
      <div className="space-y-2">
        <Label>Audio File *</Label>
        {!audioFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-primary hover:bg-gray-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("audio-upload")?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop your audio file here or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports MP3, WAV, M4A files up to 100MB
            </p>
            <Button type="button" variant="outline">
              Choose File
            </Button>
            <input
              id="audio-upload"
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FileAudio className="w-8 h-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{audioFile.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(audioFile.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setAudioFile(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {isUploading && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Episode Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Episode Title *</Label>
        <Input
          id="title"
          placeholder="Enter episode title..."
          {...form.register("title")}
        />
        {form.formState.errors.title && (
          <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
        )}
      </div>

      {/* Episode Number */}
      <div className="space-y-2">
        <Label htmlFor="episodeNumber">Episode Number</Label>
        <Input
          id="episodeNumber"
          type="number"
          placeholder="1"
          min="1"
          {...form.register("episodeNumber", { valueAsNumber: true })}
        />
        {form.formState.errors.episodeNumber && (
          <p className="text-sm text-red-600">{form.formState.errors.episodeNumber.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Episode Description</Label>
        <Textarea
          id="description"
          placeholder="Describe what this episode is about..."
          rows={4}
          {...form.register("description")}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
        )}
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <Label htmlFor="coverImageUrl">Episode Cover Image URL</Label>
        <Input
          id="coverImageUrl"
          type="url"
          placeholder="https://example.com/episode-cover.jpg"
          {...form.register("coverImageUrl")}
        />
        <p className="text-sm text-gray-500">
          Optional: Use a custom cover image for this episode
        </p>
        {form.formState.errors.coverImageUrl && (
          <p className="text-sm text-red-600">{form.formState.errors.coverImageUrl.message}</p>
        )}
      </div>

      {/* Publish Toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id="isPublished"
          checked={form.watch("isPublished")}
          onCheckedChange={(checked) => form.setValue("isPublished", checked)}
        />
        <Label htmlFor="isPublished">Publish immediately</Label>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess?.()}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={uploadEpisodeMutation.isPending || isUploading || !audioFile}
          className="flex-1"
        >
          {uploadEpisodeMutation.isPending || isUploading ? (
            "Uploading..."
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Episode
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
