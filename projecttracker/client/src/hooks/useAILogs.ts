import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import type { AILog as DatabaseAILog, InsertAILog } from '@shared/schema'

interface AILogWithProject extends DatabaseAILog {
  project?: { name: string; color: string }
}

export function useAILogs(params?: { source?: string; projectId?: number }) {
  return useQuery({
    queryKey: ['/api/ai-logs', params],
    queryFn: async (): Promise<AILogWithProject[]> => {
      const searchParams = new URLSearchParams()
      if (params?.source) searchParams.set('source', params.source)
      if (params?.projectId) searchParams.set('projectId', params.projectId.toString())
      
      const response = await fetch(`/api/ai-logs?${searchParams}`)
      if (!response.ok) throw new Error('Failed to fetch AI logs')
      return response.json()
    },
  })
}

export function useCreateAILog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: InsertAILog): Promise<DatabaseAILog> => {
      const response = await fetch('/api/ai-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to create AI log')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-logs'] })
    },
  })
}

export function useUpdateAILog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertAILog> }): Promise<DatabaseAILog> => {
      const response = await fetch(`/api/ai-logs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to update AI log')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-logs'] })
    },
  })
}

export function useDeleteAILog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await fetch(`/api/ai-logs/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete AI log')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-logs'] })
    },
  })
}