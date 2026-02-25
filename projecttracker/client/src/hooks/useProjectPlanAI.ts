import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  tasks: Task[];
  status: 'pending' | 'in_progress' | 'completed';
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignee?: string;
}

interface GeneratedPlan {
  title: string;
  description: string;
  estimatedDuration: string;
  milestones: Milestone[];
}

export function useProjectPlanAI() {
  const [loading, setLoading] = useState(false);

  const generatePlan = async (description: string): Promise<GeneratedPlan> => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/ai/generate-project-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: description,
          context: 'project_planning'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate project plan');
      }

      const data = await response.json();
      
      // Parse AI response and structure it properly
      const plan: GeneratedPlan = {
        title: data.title || extractTitleFromDescription(description),
        description: description,
        estimatedDuration: data.estimatedDuration || '4-6 weeks',
        milestones: data.milestones?.map((milestone: any, index: number) => ({
          id: crypto.randomUUID(),
          title: milestone.title,
          description: milestone.description || '',
          dueDate: calculateMilestoneDate(index, data.milestones.length),
          status: 'pending' as const,
          tasks: milestone.tasks?.map((task: any) => ({
            id: crypto.randomUUID(),
            title: task.title || task,
            completed: false
          })) || []
        })) || []
      };

      return plan;
    } catch (error) {
      console.error('Error generating project plan:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { generatePlan, loading };
}

function extractTitleFromDescription(description: string): string {
  // Extract a title from the first sentence or key phrase
  const sentences = description.split(/[.!?]/);
  const firstSentence = sentences[0]?.trim();
  
  if (firstSentence && firstSentence.length < 80) {
    return firstSentence;
  }
  
  // Fallback to first few words
  const words = description.split(' ').slice(0, 5);
  return words.join(' ') + (words.length === 5 ? '...' : '');
}

function calculateMilestoneDate(index: number, totalMilestones: number): string {
  // Distribute milestones over the next few months
  const weeksPerMilestone = Math.max(2, Math.floor(24 / totalMilestones));
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + ((index + 1) * weeksPerMilestone * 7));
  return dueDate.toISOString().split('T')[0];
}