import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

import SimplifiedLayout from "@/components/SimplifiedLayout";
import ArtistSyncStatus from "@/components/ArtistSyncStatus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Schema for adding a new artist to sync
const addArtistSchema = z.object({
  source: z.enum(["spotify", "genius", "lastfm"]),
  sourceId: z.string().min(1, "Source ID is required"),
  syncInterval: z.enum(["hourly", "daily", "weekly", "monthly"]).default("daily"),
  priority: z.coerce.number().int().min(1).max(10).default(5),
});

type AddArtistFormValues = z.infer<typeof addArtistSchema>;

const ArtistDatabasePage = () => {
  const [activeTab, setActiveTab] = useState("status");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Setup form for adding new artists to sync
  const form = useForm<AddArtistFormValues>({
    resolver: zodResolver(addArtistSchema),
    defaultValues: {
      source: "spotify",
      sourceId: "",
      syncInterval: "daily",
      priority: 5,
    },
  });

  // Mutation for adding a new artist sync
  const addArtistMutation = useMutation({
    mutationFn: async (data: AddArtistFormValues) => {
      const response = await apiRequest("POST", "/api/artist-syncs", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Artist added to sync queue",
        description: "The artist will be synchronized according to the selected interval",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/artist-syncs'] });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add artist",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: AddArtistFormValues) => {
    addArtistMutation.mutate(data);
  };

  // Placeholder IDs for different sources (for user guidance)
  const getPlaceholder = () => {
    const source = form.watch("source");
    switch (source) {
      case "spotify":
        return "spotify:artist:1234567890";
      case "genius":
        return "genius:artist:kendrick-lamar";
      case "lastfm":
        return "lastfm:artist:drake";
      default:
        return "Enter source ID";
    }
  };

  return (
    <SimplifiedLayout title="Artist Database Management">
      <Helmet>
        <title>Artist Database Management | DarkNotes</title>
      </Helmet>

      <div className="container">
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Manage the auto-updating database of artists for mentorship capabilities
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="status">Sync Status</TabsTrigger>
            <TabsTrigger value="add">Add New Artist</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-4">
            <ArtistSyncStatus />
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Artist to Database</CardTitle>
                <CardDescription>
                  Start syncing data for a new artist from external sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Source</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a data source" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="spotify">Spotify</SelectItem>
                                <SelectItem value="genius">Genius</SelectItem>
                                <SelectItem value="lastfm">Last.fm</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              The external platform to fetch artist data from
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sourceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Source ID</FormLabel>
                            <FormControl>
                              <Input placeholder={getPlaceholder()} {...field} />
                            </FormControl>
                            <FormDescription>
                              The unique identifier for the artist in the selected platform
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="syncInterval"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sync Interval</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select sync frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How often the artist data should be refreshed
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority (1-10)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                max={10}
                                placeholder="5"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Higher priority (lower number) will be synced first
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={addArtistMutation.isPending}
                      className="w-full md:w-auto"
                    >
                      {addArtistMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Add Artist to Sync Queue
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-500 dark:text-gray-400">
                <p>
                  Note: Adding an artist here only schedules it for syncing. It may take some time 
                  before the data is fetched and a mentor is created.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SimplifiedLayout>
  );
};

export default ArtistDatabasePage;