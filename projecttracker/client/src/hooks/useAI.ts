import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type APIPrompt, type TaskSuggestion } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function usePrompts(params?: { projectId?: number; search?: string }) {
  return useQuery({
    queryKey: ["/api/ai/prompts", params],
    queryFn: () => api.getPrompts(params),
  });
}

export function useSendPrompt() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.sendPrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/prompts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process AI prompt",
        variant: "destructive",
      });
    },
  });
}

export function useTaskSuggestions(projectId: number) {
  return useQuery({
    queryKey: ["/api/ai/task-suggestions", projectId],
    queryFn: () => api.getTaskSuggestions(projectId),
    enabled: !!projectId,
  });
}

export function useGetTaskSuggestions() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.getTaskSuggestions,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate task suggestions",
        variant: "destructive",
      });
    },
  });
}
