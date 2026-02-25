import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type APITask } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useProjectTasks(projectId: number) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "tasks"],
    queryFn: () => api.getProjectTasks(projectId),
    enabled: !!projectId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.createTask,
    onSuccess: (task) => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/projects", task.projectId, "tasks"] 
      });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<APITask> }) =>
      api.updateTask(id, data),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/projects", task.projectId, "tasks"] 
      });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.deleteTask,
    onSuccess: (_, taskId) => {
      // Invalidate all project tasks queries
      queryClient.invalidateQueries({ 
        queryKey: ["/api/projects"],
        predicate: (query) => {
          const queryKey = query.queryKey as string[];
          return queryKey.includes("tasks");
        }
      });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });
}
