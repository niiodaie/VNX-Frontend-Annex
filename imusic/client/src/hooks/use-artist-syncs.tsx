import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArtistSync } from "@shared/schema";

export function useArtistSyncs(options?: { limit?: number; status?: string }) {
  const queryParams = new URLSearchParams();
  if (options?.limit) {
    queryParams.append("limit", options.limit.toString());
  }
  if (options?.status) {
    queryParams.append("status", options.status);
  }

  const queryKey = ["/api/artist-syncs", options?.status, options?.limit];

  return useQuery<ArtistSync[]>({
    queryKey,
    queryFn: async () => {
      const url = `/api/artist-syncs${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await apiRequest("GET", url);
      return response.json();
    },
  });
}

export function useArtistSync(id: number) {
  return useQuery<ArtistSync>({
    queryKey: ["/api/artist-syncs", id],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/artist-syncs/${id}`);
      return response.json();
    },
    enabled: !!id,
  });
}

export function useAddArtistSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<ArtistSync, "id" | "createdAt" | "lastSynced" | "syncError" | "rawData" | "mentorId">) => {
      const response = await apiRequest("POST", "/api/artist-syncs", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artist-syncs'] });
    },
  });
}

export function useRefreshArtistSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/artist-syncs/${id}/refresh`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/artist-syncs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/artist-syncs', data.id] });
    },
  });
}

export function useLinkArtistSyncToMentor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ syncId, mentorId }: { syncId: number; mentorId: number }) => {
      const response = await apiRequest("POST", `/api/artist-syncs/${syncId}/link/${mentorId}`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/artist-syncs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/artist-syncs', data.id] });
    },
  });
}