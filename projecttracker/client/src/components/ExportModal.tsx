import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, FileText, FileCode, FileSpreadsheet } from 'lucide-react';
import { exportProjectAsMarkdown, exportProjectAsJSON, exportProjectAsCSV, trackEvent, type ExportProject } from '@/utils/exportHelpers';
import { useAuth } from '@/components/AuthProvider';
import { usePlan } from '@/hooks/usePlan';
import toast from 'react-hot-toast';

interface ExportModalProps {
  plan: ExportProject;
}

export function ExportModal({ plan }: ExportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const { user } = useAuth();
  const { isPremium } = usePlan();

  const handleExport = async (format: 'markdown' | 'json' | 'csv') => {
    if (!isPremium) {
      toast.error('Export feature requires premium subscription');
      return;
    }

    setIsExporting(format);
    
    try {
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
          exportProjectAsMarkdown(plan);
          toast.success('Markdown file downloaded successfully!');
          break;
        case 'json':
          exportProjectAsJSON(plan);
          toast.success('JSON file downloaded successfully!');
          break;
        case 'csv':
          exportProjectAsCSV(plan);
          toast.success('CSV file downloaded successfully!');
          break;
      }

      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(null);
    }
  };

  const exportOptions = [
    {
      format: 'markdown' as const,
      title: 'Markdown',
      description: 'Human-readable format perfect for documentation',
      icon: FileText,
      extension: '.md'
    },
    {
      format: 'json' as const,
      title: 'JSON',
      description: 'Structured data format for developers',
      icon: FileCode,
      extension: '.json'
    },
    {
      format: 'csv' as const,
      title: 'CSV',
      description: 'Spreadsheet format for data analysis',
      icon: FileSpreadsheet,
      extension: '.csv'
    }
  ];

  if (!plan) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Project Plan
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Download your project plan in your preferred format:
          </div>
          
          <div className="space-y-3">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              const isCurrentlyExporting = isExporting === option.format;
              
              return (
                <div
                  key={option.format}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">{option.title}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => handleExport(option.format)}
                    disabled={!isPremium || isCurrentlyExporting}
                    className="ml-4"
                  >
                    {isCurrentlyExporting ? (
                      'Exporting...'
                    ) : (
                      `Download ${option.extension}`
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
          
          {!isPremium && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-sm text-yellow-800">
                <strong>Premium Feature:</strong> Export functionality requires a premium subscription.
                <Button variant="link" className="p-0 h-auto ml-1 text-yellow-700 underline">
                  Upgrade now
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}