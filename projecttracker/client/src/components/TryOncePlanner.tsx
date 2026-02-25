import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, ArrowRight, Crown, Download, Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/components/AuthProvider';
import { usePlan } from '@/hooks/usePlan';
import { Link } from 'wouter';
import { exportProjectAsMarkdown, exportProjectAsJSON, exportProjectAsCSV, trackEvent, type ExportProject } from '@/utils/exportHelpers';
import { SavePlanButton } from '@/components/SavePlanButton';
import { ExportModal } from '@/components/ExportModal';
import { PlanEditor } from '@/components/PlanEditor';
import { StripeCheckout } from '@/components/StripeCheckout';

interface ProjectPlan {
  title: string;
  description: string;
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    dueDate: string;
    tasks: Array<{
      id: string;
      title: string;
      description: string;
      priority: 'low' | 'medium' | 'high';
      estimatedHours: number;
    }>;
  }>;
  estimatedDuration: string;
  totalTasks: number;
}

export function TryOncePlanner() {
  const [description, setDescription] = useState('');
  const [hasTriedOnce, setHasTriedOnce] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<ProjectPlan | null>(null);
  const { user } = useAuth();
  const { isPremium } = usePlan();

  const generatePlanMutation = useMutation({
    mutationFn: async (projectDescription: string): Promise<ProjectPlan> => {
      const response = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: projectDescription }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate project plan');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setHasTriedOnce(true);
      setCurrentPlan(data);
    },
  });

  const handleTryOnce = () => {
    if (description.trim()) {
      generatePlanMutation.mutate(description.trim());
    }
  };

  const plan = currentPlan || generatePlanMutation.data;

  const handleExport = (format: 'markdown' | 'json' | 'csv') => {
    if (!plan) return;
    
    const exportProject: ExportProject = {
      title: plan.title,
      description: plan.description,
      estimatedDuration: plan.estimatedDuration,
      milestones: plan.milestones.map(milestone => ({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description,
        dueDate: milestone.dueDate,
        tasks: milestone.tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          estimatedHours: task.estimatedHours,
          completed: false
        }))
      })),
      totalTasks: plan.totalTasks
    };

    // Track export event
    trackEvent('ai_plan_export', {
      format,
      userId: user?.id,
      planTitle: plan.title,
      milestonesCount: plan.milestones.length,
      tasksCount: plan.totalTasks
    });

    // Export based on format
    switch (format) {
      case 'markdown':
        exportProjectAsMarkdown(exportProject);
        break;
      case 'json':
        exportProjectAsJSON(exportProject);
        break;
      case 'csv':
        exportProjectAsCSV(exportProject);
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <h1 className="text-3xl font-bold">AI Project Planning</h1>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Try Once Free
          </Badge>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Experience the power of AI-driven project planning. Describe your project and get an intelligent breakdown with milestones and tasks.
        </p>
      </div>

      {/* Input Section */}
      <Card className="border-2 border-dashed border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Describe Your Project
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="E.g., 'Build a mobile app for food delivery with user authentication, restaurant listings, order management, and payment integration. Target launch in 3 months.'"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[120px] resize-none"
            disabled={generatePlanMutation.isPending || (hasTriedOnce && !isPremium)}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {!user && "Sign up to try AI planning"}
              {user && !isPremium && hasTriedOnce && "Upgrade for unlimited AI planning"}
              {user && !isPremium && !hasTriedOnce && "One free try available"}
              {user && isPremium && "Unlimited AI planning available"}
            </div>
            
            <Button
              onClick={handleTryOnce}
              disabled={
                !description.trim() || 
                generatePlanMutation.isPending || 
                (!user) ||
                (hasTriedOnce && !isPremium)
              }
              className="bg-purple-600 hover:bg-purple-700"
            >
              {generatePlanMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {generatePlanMutation.isPending ? 'Generating...' : 'Generate Plan'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {plan && (
        <div className="space-y-6">
          {/* Plan Overview */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Sparkles className="h-5 w-5" />
                Your AI-Generated Project Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{plan.title}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="font-medium text-gray-500">Duration</div>
                    <div className="text-lg font-bold text-green-600">{plan.estimatedDuration}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="font-medium text-gray-500">Milestones</div>
                    <div className="text-lg font-bold text-blue-600">{plan.milestones.length}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="font-medium text-gray-500">Total Tasks</div>
                    <div className="text-lg font-bold text-purple-600">{plan.totalTasks}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <SavePlanButton plan={plan as ExportProject} userId={user?.id} />
            <ExportModal plan={plan as ExportProject} />
            {isPremium && (
              <Button variant="outline" className="flex items-center gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Mode
              </Button>
            )}
          </div>

          {/* Export Options (Premium Feature for Free Users) */}
          {isPremium ? (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Export Your Plan</h4>
                    <p className="text-sm text-blue-600">Download your project plan in multiple formats</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport('markdown')}
                      className="text-blue-600 border-blue-300 hover:bg-blue-100"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      MD
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport('json')}
                      className="text-blue-600 border-blue-300 hover:bg-blue-100"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      JSON
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport('csv')}
                      className="text-blue-600 border-blue-300 hover:bg-blue-100"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      CSV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Export Feature</h4>
                    <p className="text-sm text-yellow-700">Save and export your plans in multiple formats</p>
                  </div>
                  <Link href="/upgrade">
                    <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600">
                      <Crown className="h-3 w-3 mr-1" />
                      Unlock
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Plan Editor with Smart Premium Gating */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Project Milestones</h3>
            <PlanEditor 
              plan={plan as ExportProject} 
              onUpdate={(updatedPlan) => setCurrentPlan(updatedPlan as ProjectPlan)} 
            />
          </div>

          {/* Upgrade CTA for Free Users */}
          {!isPremium && (
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Love what you see? Get the full experience!</h3>
                    <p className="text-purple-100 mb-4">
                      Unlock unlimited AI planning, milestone editing, timeline management, and export features.
                    </p>
                    <ul className="text-sm space-y-1 text-purple-100">
                      <li>• Unlimited AI project plans</li>
                      <li>• Interactive timeline editing</li>
                      <li>• Export to PDF, Excel & more</li>
                      <li>• Advanced task management</li>
                    </ul>
                  </div>
                  <div className="ml-6 text-center">
                    <StripeCheckout plan="premium">
                      <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                        <Crown className="h-5 w-5 mr-2" />
                        Upgrade Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </StripeCheckout>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* No User State */}
      {!user && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="text-blue-600 mb-4">
              <Sparkles className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Ready to plan your next project?</h3>
              <p className="text-blue-700">
                Sign up for free to try AI-powered project planning
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-blue-300 text-blue-600">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default TryOncePlanner;