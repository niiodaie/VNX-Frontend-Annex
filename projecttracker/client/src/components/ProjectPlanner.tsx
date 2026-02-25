import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Target, Download, Sparkles, Plus, X } from 'lucide-react';
import { useProjectPlanAI } from '@/hooks/useProjectPlanAI';
import { exportToMarkdown } from '@/utils/exportHelpers';
import toast from 'react-hot-toast';

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

interface ProjectPlan {
  title: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  tags: string[];
  milestones: Milestone[];
  estimatedDuration: string;
}

export default function ProjectPlanner() {
  const { user, isPremium } = useAuth();
  const { generatePlan, loading } = useProjectPlanAI();
  
  const [project, setProject] = useState<ProjectPlan>({
    title: '',
    description: '',
    status: 'planning',
    tags: [],
    milestones: [],
    estimatedDuration: ''
  });

  const [newTag, setNewTag] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  if (!isPremium) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <Target className="h-16 w-16 mx-auto text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Project Planning</h3>
          <p className="text-gray-600 mb-4">
            Create detailed project plans with AI-powered milestones and timeline management.
          </p>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Premium Feature
          </Badge>
          <div className="mt-4">
            <Button variant="outline">Upgrade to Premium</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const addTag = () => {
    if (newTag.trim() && !project.tags.includes(newTag.trim())) {
      setProject(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProject(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: crypto.randomUUID(),
      title: 'New Milestone',
      description: '',
      dueDate: '',
      tasks: [],
      status: 'pending'
    };
    setProject(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }));
  };

  const updateMilestone = (milestoneId: string, updates: Partial<Milestone>) => {
    setProject(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => 
        m.id === milestoneId ? { ...m, ...updates } : m
      )
    }));
  };

  const addTaskToMilestone = (milestoneId: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: 'New Task',
      completed: false
    };
    updateMilestone(milestoneId, {
      tasks: [...(project.milestones.find(m => m.id === milestoneId)?.tasks || []), newTask]
    });
  };

  const updateTask = (milestoneId: string, taskId: string, updates: Partial<Task>) => {
    const milestone = project.milestones.find(m => m.id === milestoneId);
    if (milestone) {
      updateMilestone(milestoneId, {
        tasks: milestone.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
      });
    }
  };

  const generateAIPlan = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please describe your project first');
      return;
    }

    try {
      const generatedPlan = await generatePlan(aiPrompt);
      if (generatedPlan.milestones) {
        setProject(prev => ({
          ...prev,
          title: generatedPlan.title || prev.title,
          description: aiPrompt,
          milestones: generatedPlan.milestones,
          estimatedDuration: generatedPlan.estimatedDuration || prev.estimatedDuration
        }));
        toast.success('AI project plan generated successfully!');
      }
    } catch (error) {
      toast.error('Failed to generate AI plan');
    }
  };

  const exportPlan = () => {
    const markdown = exportToMarkdown(project);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.title || 'project-plan'}.md`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Project plan exported to markdown!');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Planner</h1>
          <p className="text-gray-600">Create comprehensive project plans with AI assistance</p>
        </div>
        <Button onClick={exportPlan} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Plan
        </Button>
      </div>

      {/* AI Planning Assistant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Planning Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe your project goals, timeline, and key requirements..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="min-h-24"
          />
          <Button 
            onClick={generateAIPlan} 
            disabled={loading || !aiPrompt.trim()}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? 'Generating Plan...' : 'Generate AI Plan'}
          </Button>
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project Title</label>
              <Input
                value={project.title}
                onChange={(e) => setProject(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter project title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estimated Duration</label>
              <Input
                value={project.estimatedDuration}
                onChange={(e) => setProject(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                placeholder="e.g., 3 months, 6 weeks"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={project.description}
              onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} variant="outline">Add</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Milestones & Tasks
          </CardTitle>
          <Button onClick={addMilestone} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </CardHeader>
        <CardContent>
          {project.milestones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No milestones yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {project.milestones.map((milestone, index) => (
                <Card key={milestone.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Input
                          value={milestone.title}
                          onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                          className="font-semibold text-lg border-none p-0 h-auto bg-transparent"
                        />
                        <Badge variant={
                          milestone.status === 'completed' ? 'default' :
                          milestone.status === 'in_progress' ? 'secondary' : 'outline'
                        }>
                          {milestone.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <Textarea
                        value={milestone.description}
                        onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                        placeholder="Milestone description..."
                        className="min-h-16"
                      />
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-gray-500" />
                          <Input
                            type="date"
                            value={milestone.dueDate}
                            onChange={(e) => updateMilestone(milestone.id, { dueDate: e.target.value })}
                            className="w-auto"
                          />
                        </div>
                        <Button 
                          onClick={() => addTaskToMilestone(milestone.id)}
                          variant="outline" 
                          size="sm"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Task
                        </Button>
                      </div>

                      {milestone.tasks.length > 0 && (
                        <div className="space-y-2 ml-4 border-l-2 border-gray-200 pl-4">
                          {milestone.tasks.map(task => (
                            <div key={task.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={(e) => updateTask(milestone.id, task.id, { completed: e.target.checked })}
                                className="rounded"
                              />
                              <Input
                                value={task.title}
                                onChange={(e) => updateTask(milestone.id, task.id, { title: e.target.value })}
                                className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}