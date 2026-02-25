import { apiRequest } from './queryClient';
import type { User, BreathTest, BreathResult } from '@shared/schema';

/**
 * Send a breath sample for analysis
 */
export async function analyzeBreathSample(sampleData: {
  userId?: number;
  audioSample: string;
  location?: string;
}): Promise<BreathResult> {
  return apiRequest<BreathResult>({
    url: '/api/breath/scan',
    method: 'POST',
    data: sampleData
  });
}

/**
 * Get breath test history for a user
 */
export async function getBreathTestHistory(userId: number): Promise<BreathTest[]> {
  return apiRequest<BreathTest[]>({
    url: `/api/users/${userId}/breath-tests`,
    method: 'GET'
  });
}

/**
 * Get a specific breath test
 */
export async function getBreathTest(testId: number): Promise<BreathTest> {
  return apiRequest<BreathTest>({
    url: `/api/breath/${testId}`,
    method: 'GET'
  });
}