import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Loader2, Check } from 'lucide-react';
import { savePlanToDatabase, trackEvent, type ExportProject } from '@/utils/exportHelpers';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';

interface SavePlanButtonProps {
  plan: ExportProject;
  userId?: string;
}

export function SavePlanButton({ plan, userId }: SavePlanButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user || !plan) {
      toast.error('Please login to save your plan');
      return;
    }

    setIsSaving(true);
    
    try {
      await savePlanToDatabase(userId || user.id, plan);
      
      // Track save event
      trackEvent('ai_plan_saved', {
        userId: userId || user.id,
        planTitle: plan.title,
        milestonesCount: plan.milestones.length,
        tasksCount: plan.totalTasks
      });

      setIsSaved(true);
      toast.success('Project plan saved successfully!');
      
      // Reset saved state after 3 seconds
      setTimeout(() => setIsSaved(false), 3000);
      
    } catch (error) {
      console.error('Failed to save plan:', error);
      toast.error('Failed to save plan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Button
      onClick={handleSave}
      disabled={isSaving || isSaved}
      variant={isSaved ? "default" : "outline"}
      className={isSaved ? "bg-green-600 hover:bg-green-700 text-white" : ""}
    >
      {isSaving ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isSaved ? (
        <Check className="h-4 w-4 mr-2" />
      ) : (
        <Save className="h-4 w-4 mr-2" />
      )}
      {isSaving ? 'Saving...' : isSaved ? 'Saved!' : 'Save Plan'}
    </Button>
  );
}