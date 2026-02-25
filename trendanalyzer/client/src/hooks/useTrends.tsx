import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface Trend {
  id: number;
  title: string;
  category: string;
  searches: number;
  growth: string;
  countries: number;
  aiSummary: string;
  prediction?: string;
  region: string;
  createdAt: string;
  isActive: boolean;
}

export interface CountryTrend {
  name: string;
  flag: string;
  topTrend: string;
  searches: string;
  growth: string;
  code: string;
}

export interface AIInsights {
  predictions: Array<{ title: string; status: string; confidence: number }>;
  opportunities: Array<{ title: string; description: string; demand: string }>;
}

export function useTrends(category?: string, region?: string) {
  const queryKey = ['/api/trends'];
  if (category && category !== 'all') queryKey.push(`category=${category}`);
  if (region && region !== 'global') queryKey.push(`region=${region}`);
  
  const url = queryKey.length > 1 
    ? `/api/trends?${queryKey.slice(1).join('&')}`
    : '/api/trends';

  return useQuery<Trend[]>({
    queryKey: [url],
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useCountryTrends() {
  return useQuery<CountryTrend[]>({
    queryKey: ['/api/trends/countries'],
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

export function useAIInsights() {
  return useQuery<AIInsights>({
    queryKey: ['/api/insights'],
    refetchInterval: 600000, // Refetch every 10 minutes
  });
}

export function useSubmitTrend() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      topic: string;
      category: string;
      region: string;
      description?: string;
    }) => {
      const response = await apiRequest('POST', '/api/trends/submit', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trends'] });
    },
  });
}

export function useRefreshTrends() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/trends/refresh');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trends'] });
    },
  });
}
