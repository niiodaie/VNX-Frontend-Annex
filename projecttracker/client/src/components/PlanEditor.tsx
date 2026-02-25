import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit2, Save, X, Plus, Trash2, Crown } from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';
import { Link } from 'wouter';
import type { ExportProject, ExportMilestone, ExportTask } from '@/utils/exportHelpers';

interface PlanEditorProps {
  plan: ExportProject;
  onUpdate: (updatedPlan: ExportProject) => void;
}

export function PlanEditor({ plan, onUpdate }: PlanEditorProps) {
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const { isPremium } = usePlan();

  if (!isPremium) {
    return (
      <div className="space-y-4">
        {/* Display read-only plan for non-premium users */}
        {plan.milestones.slice(0, 2).map((milestone, index) => (
          <Card key={milestone.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Milestone {index + 1}: {milestone.title}
                </CardTitle>
                <Badge variant="outline">{milestone.dueDate}</Badge>
              </div>
              <p className="text-gray-600 text-sm">{milestone.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-medium text-sm text-gray-700">
                  Tasks ({milestone.tasks.length}):
                </div>
                {milestone.tasks.slice(0, 2).map((task) => (
                  <div key={task.id} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <span className="flex-1">{task.title}</span>
                    {task.estimatedHours && (
                      <Badge variant="secondary" className="text-xs">
                        {task.estimatedHours}h
                      </Badge>
                    )}
                  </div>
                ))}
                {milestone.tasks.length > 2 && (
                  <div className="text-sm text-gray-500 italic">
                    + {milestone.tasks.length - 2} more tasks (Premium feature)
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Premium upgrade prompt */}
        <Card className="border-2 border-dashed border-yellow-300 bg-yellow-50">
          <CardContent className="p-6 text-center">
            <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="font-medium text-yellow-800 mb-2">
              Editing & Full Plan Access
            </div>
            <p className="text-sm text-yellow-700 mb-4">
              Unlock inline editing, full milestone access, and advanced project management features.
            </p>
            <Link href="/upgrade">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const updateMilestone = (milestoneId: string, updates: Partial<ExportMilestone>) => {
    const updatedPlan = {
      ...plan,
      milestones: plan.milestones.map(m => 
        m.id === milestoneId ? { ...m, ...updates } : m
      )
    };
    onUpdate(updatedPlan);
  };

  const updateTask = (milestoneId: string, taskId: string, updates: Partial<ExportTask>) => {
    const updatedPlan = {
      ...plan,
      milestones: plan.milestones.map(m => 
        m.id === milestoneId 
          ? {
              ...m,
              tasks: m.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
            }
          : m
      )
    };
    onUpdate(updatedPlan);
  };

  const addTask = (milestoneId: string) => {
    const newTask: ExportTask = {
      id: crypto.randomUUID(),
      title: 'New Task',
      description: '',
      priority: 'medium',
      estimatedHours: 1,
      completed: false
    };

    const updatedPlan = {
      ...plan,
      milestones: plan.milestones.map(m => 
        m.id === milestoneId 
          ? { ...m, tasks: [...m.tasks, newTask] }
          : m
      )
    };
    onUpdate(updatedPlan);
    setEditingTask(newTask.id);
  };

  const deleteTask = (milestoneId: string, taskId: string) => {
    const updatedPlan = {
      ...plan,
      milestones: plan.milestones.map(m => 
        m.id === milestoneId 
          ? { ...m, tasks: m.tasks.filter(t => t.id !== taskId) }
          : m
      )
    };
    onUpdate(updatedPlan);
  };

  return (
    <div className="space-y-4">
      {plan.milestones.map((milestone, index) => (
        <Card key={milestone.id} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              {editingMilestone === milestone.id ? (
                <div className="flex-1 space-y-2">
                  <Input
                    value={milestone.title}
                    onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                    className="font-semibold"
                  />
                  <Input
                    type="date"
                    value={milestone.dueDate}
                    onChange={(e) => updateMilestone(milestone.id, { dueDate: e.target.value })}
                  />
                  <Textarea
                    value={milestone.description}
                    onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setEditingMilestone(null)}>
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingMilestone(null)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Milestone {index + 1}: {milestone.title}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingMilestone(milestone.id)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </CardTitle>
                    <p className="text-gray-600 text-sm mt-1">{milestone.description}</p>
                  </div>
                  <Badge variant="outline">{milestone.dueDate}</Badge>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm text-gray-700">
                  Tasks ({milestone.tasks.length}):
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addTask(milestone.id)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Task
                </Button>
              </div>
              
              {milestone.tasks.map((task) => (
                <div key={task.id}>
                  {editingTask === task.id ? (
                    <div className="space-y-2 p-2 border rounded bg-white">
                      <Input
                        value={task.title}
                        onChange={(e) => updateTask(milestone.id, task.id, { title: e.target.value })}
                        placeholder="Task title"
                      />
                      <Textarea
                        value={task.description || ''}
                        onChange={(e) => updateTask(milestone.id, task.id, { description: e.target.value })}
                        placeholder="Task description"
                        className="text-sm"
                      />
                      <div className="flex gap-2 items-center">
                        <select
                          value={task.priority}
                          onChange={(e) => updateTask(milestone.id, task.id, { priority: e.target.value as any })}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        <Input
                          type="number"
                          value={task.estimatedHours || 1}
                          onChange={(e) => updateTask(milestone.id, task.id, { estimatedHours: parseInt(e.target.value) })}
                          placeholder="Hours"
                          className="w-20 text-xs"
                        />
                        <Button size="sm" onClick={() => setEditingTask(null)}>
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingTask(null)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded group">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500' :
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="flex-1">{task.title}</span>
                      {task.estimatedHours && (
                        <Badge variant="secondary" className="text-xs">
                          {task.estimatedHours}h
                        </Badge>
                      )}
                      <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingTask(task.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTask(milestone.id, task.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}